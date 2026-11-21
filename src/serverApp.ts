import express, { Router } from "express";
import {
  getTuitionRequirements,
  createTuitionRequirement,
  updateTuitionRequirement,
  deleteRequirement,
  getTutors,
  createTutor,
  updateTutor,
  deleteTutor,
  getDemoAssignments,
  createDemoAssignment,
  updateDemoAssignment,
  deleteDemoAssignment,
  getReviews,
  createReview,
  updateReview,
  deleteReview,
  getServices,
  saveServices,
  getSiteSettings,
  saveSiteSettings,
} from "./db/dataService.ts";
import {
  requireAdminAuth,
  optionalAdminAuth,
  AuthRequest,
  createSessionToken,
  verifySessionToken,
  isAuthorizedAdminEmail,
  isSessionSigningConfigured,
  safeEqual,
} from "./middleware/auth.ts";
import { rateLimit, getClientIp } from "./middleware/rateLimit.ts";
import {
  isServerSupabaseReady,
  uploadFileToSupabase,
  getSupabaseAuthClient,
  getSupabaseServerClient,
  UploadValidationError,
  isAllowedBucket,
  isSafeStoragePath,
} from "./services/serverStorage.ts";
import { sanitizeRequirement, sanitizeTutor, sanitizeReview, ValidationError } from "./db/sanitize.ts";

// Failed-login lockout (best effort: per server instance, see middleware/rateLimit.ts)
interface LoginAttemptRecord {
  count: number;
  lockedUntil: number;
}
const loginAttempts = new Map<string, LoginAttemptRecord>();

/** Maps errors to HTTP responses without leaking internals. */
function sendError(res: express.Response, error: any, fallback: string) {
  if (error instanceof ValidationError || error instanceof UploadValidationError) {
    return res.status(400).json({ error: error.message });
  }
  console.error(fallback, error);
  const m = String(error?.message || error || '').toLowerCase();
  let hint = fallback;
  if (m.includes('permission denied')) hint = `${fallback}: database permission missing. Run the GRANT block of supabase_hardening.sql.`;
  else if (m.includes('does not exist') || m.includes('schema cache')) hint = `${fallback}: database table/column missing. Run supabase_schema.sql in Supabase.`;
  else if (m.includes('invalid api key') || m.includes('jwt')) hint = `${fallback}: Supabase key is wrong. Check SUPABASE_SERVICE_ROLE_KEY in Vercel.`;
  else if (m.includes('bucket') && m.includes('not found')) hint = `${fallback}: storage bucket missing in Supabase.`;
  return res.status(500).json({ error: hint });
}

const publicSubmitLimit = rateLimit("submit", 10, 10 * 60 * 1000); // 10 / 10 min / IP
const uploadLimit = rateLimit("upload", 12, 10 * 60 * 1000);

export function createApiRouter(): Router {
  const router = Router();

  // Health check
  router.get("/health", (_req, res) => {
    res.json({ status: "ok", service: "ranchi-hometutor", timestamp: new Date().toISOString() });
  });

  // ==========================================
  // ADMIN AUTHENTICATION
  // ==========================================

  router.get("/auth/session", (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ authenticated: false, message: "No session token provided" });
    }
    const session = verifySessionToken(authHeader.slice(7).trim());
    if (!session) {
      return res.status(401).json({ authenticated: false, message: "Invalid or expired session" });
    }
    return res.json({
      authenticated: true,
      user: { email: session.email, role: session.role, name: session.name },
    });
  });

  router.post("/auth/login", async (req, res) => {
    try {
      const clientIp = getClientIp(req);
      const now = Date.now();
      const attempt = loginAttempts.get(clientIp);

      if (attempt && attempt.lockedUntil > now) {
        const remainingMinutes = Math.ceil((attempt.lockedUntil - now) / (60 * 1000));
        return res.status(429).json({
          error: `Too many failed login attempts. Please try again in ${remainingMinutes} minute(s).`,
        });
      }

      if (!isSessionSigningConfigured()) {
        console.error("SESSION_SECRET is not set; admin login is disabled.");
        return res.status(503).json({ error: "Admin login is not configured on the server." });
      }

      const { email, password } = req.body || {};
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
      }

      const normalizedEmail = String(email).trim().toLowerCase();
      const inputPassword = String(password).trim();
      let isAuthenticated = false;
      let userName = "Coordinator";

      // Only authorized coordinator emails may ever sign in, whichever method is used
      if (isAuthorizedAdminEmail(normalizedEmail)) {
        // 1. Supabase Auth (anon client, never the service-role client)
        const authClient = getSupabaseAuthClient();
        if (authClient) {
          try {
            const { data: authData, error: authError } = await authClient.auth.signInWithPassword({
              email: normalizedEmail,
              password: inputPassword,
            });
            if (!authError && authData.user) {
              isAuthenticated = true;
              userName = authData.user.user_metadata?.full_name || normalizedEmail.split("@")[0];
            }
          } catch {
            // fall through to the shared-password check
          }
        }

        // 2. Shared coordinator password from environment (constant-time compare)
        const configuredAdminPassword = process.env.ADMIN_PASSWORD || process.env.COORDINATOR_PASSWORD;
        if (!isAuthenticated && configuredAdminPassword && safeEqual(inputPassword, configuredAdminPassword.trim())) {
          isAuthenticated = true;
          userName = normalizedEmail.split("@")[0];
        }
      }

      if (!isAuthenticated) {
        const newCount = (attempt ? attempt.count : 0) + 1;
        if (newCount >= 5) {
          loginAttempts.set(clientIp, { count: newCount, lockedUntil: now + 15 * 60 * 1000 });
          return res.status(429).json({ error: "Too many failed attempts. Login locked for 15 minutes." });
        }
        loginAttempts.set(clientIp, { count: newCount, lockedUntil: 0 });
        return res.status(401).json({
          error: `Invalid email or password. (${5 - newCount} attempts remaining before lockout)`,
        });
      }

      loginAttempts.delete(clientIp);
      const token = createSessionToken({ email: normalizedEmail, role: "admin", name: userName });
      return res.json({ ok: true, token, user: { email: normalizedEmail, role: "admin", name: userName } });
    } catch (err: any) {
      console.error("Auth login error:", err);
      return res.status(500).json({ error: "Authentication service error" });
    }
  });

  // Sessions are stateless signed tokens: logging out means the client discards the token.
  router.post("/auth/logout", (_req, res) => {
    res.json({ ok: true, message: "Logged out successfully" });
  });

  // ==========================================
  // STORAGE & PRIVATE DOCUMENTS
  // ==========================================

  router.get("/storage/status", requireAdminAuth, async (_req, res) => {
    try {
      res.json(await isServerSupabaseReady());
    } catch (err: any) {
      res.json({ ready: false, connected: false, bucketExists: false });
    }
  });

  // Public upload for tutor/parent documents: validated (type, size, magic bytes), rate limited
  router.post("/storage/upload", uploadLimit, async (req, res) => {
    try {
      const { fileData, fileName, folder, bucket } = req.body || {};
      if (typeof fileData !== "string") {
        return res.status(400).json({ error: "Missing fileData" });
      }
      const result = await uploadFileToSupabase(fileData, fileName || "upload", folder || "general", bucket);
      res.json(result);
    } catch (err: any) {
      sendError(res, err, "Upload failed");
    }
  });

  // Private document proxy: ADMIN ONLY
  router.get("/storage/file", requireAdminAuth, async (req, res) => {
    try {
      const bucket = String(req.query.bucket || "tutors-documents");
      const filePath = String(req.query.path || "");
      if (!isAllowedBucket(bucket) || !isSafeStoragePath(filePath)) {
        return res.status(400).send("Invalid file reference");
      }
      const client = getSupabaseServerClient();
      if (!client) return res.status(503).send("Storage service unconfigured");

      const { data, error } = await client.storage.from(bucket).download(filePath);
      if (error || !data) return res.status(404).send("File not found in storage");

      const buffer = Buffer.from(await data.arrayBuffer());
      res.setHeader("Content-Type", data.type || "application/octet-stream");
      res.setHeader("X-Content-Type-Options", "nosniff");
      res.setHeader("Content-Security-Policy", "default-src 'none'; img-src 'self' data:; style-src 'unsafe-inline'");
      res.setHeader("Cache-Control", "private, no-cache, no-store, must-revalidate");
      res.send(buffer);
    } catch (err: any) {
      console.error("Storage proxy download error:", err);
      res.status(500).send("Error retrieving file");
    }
  });

  // ==========================================
  // TUITION REQUIREMENTS (LEADS)
  // ==========================================

  router.get("/requirements", requireAdminAuth, async (_req, res) => {
    try {
      res.json(await getTuitionRequirements());
    } catch (error: any) {
      sendError(res, error, "Failed to fetch requirements");
    }
  });

  // Public submission (admins may also create entries and set extra fields)
  router.post("/requirements", publicSubmitLimit, optionalAdminAuth, async (req: AuthRequest, res) => {
    try {
      const clean = sanitizeRequirement(req.body || {}, !!req.user);
      res.status(201).json(await createTuitionRequirement(clean));
    } catch (error: any) {
      sendError(res, error, "Failed to create requirement");
    }
  });

  router.patch("/requirements/:id", requireAdminAuth, async (req, res) => {
    try {
      res.json(await updateTuitionRequirement(req.params.id, req.body));
    } catch (error: any) {
      sendError(res, error, "Failed to update requirement");
    }
  });

  router.delete("/requirements/:id", requireAdminAuth, async (req, res) => {
    try {
      await deleteRequirement(req.params.id);
      res.json({ ok: true, id: req.params.id });
    } catch (error: any) {
      sendError(res, error, "Failed to delete requirement");
    }
  });

  // ==========================================
  // TUTORS (PRIVATE - ADMIN ONLY, except registration)
  // ==========================================

  router.get("/tutors", requireAdminAuth, async (_req, res) => {
    try {
      res.json(await getTutors());
    } catch (error: any) {
      sendError(res, error, "Failed to fetch tutors");
    }
  });

  router.post("/tutors", publicSubmitLimit, optionalAdminAuth, async (req: AuthRequest, res) => {
    try {
      const clean = sanitizeTutor(req.body || {}, !!req.user);
      res.status(201).json(await createTutor(clean));
    } catch (error: any) {
      sendError(res, error, "Failed to register tutor");
    }
  });

  router.patch("/tutors/:id", requireAdminAuth, async (req, res) => {
    try {
      res.json(await updateTutor(req.params.id, req.body));
    } catch (error: any) {
      sendError(res, error, "Failed to update tutor");
    }
  });

  router.delete("/tutors/:id", requireAdminAuth, async (req, res) => {
    try {
      await deleteTutor(req.params.id);
      res.json({ ok: true, id: req.params.id });
    } catch (error: any) {
      sendError(res, error, "Failed to delete tutor");
    }
  });

  // ==========================================
  // DEMO ASSIGNMENTS (COORDINATOR PIPELINE - ADMIN ONLY)
  // ==========================================

  router.get("/demo-assignments", requireAdminAuth, async (_req, res) => {
    try {
      res.json(await getDemoAssignments());
    } catch (error: any) {
      sendError(res, error, "Failed to fetch demo assignments");
    }
  });

  router.post("/demo-assignments", requireAdminAuth, async (req, res) => {
    try {
      res.status(201).json(await createDemoAssignment(req.body));
    } catch (error: any) {
      sendError(res, error, "Failed to schedule demo assignment");
    }
  });

  router.patch("/demo-assignments/:id", requireAdminAuth, async (req, res) => {
    try {
      res.json(await updateDemoAssignment(req.params.id, req.body));
    } catch (error: any) {
      sendError(res, error, "Failed to update demo assignment");
    }
  });

  router.delete("/demo-assignments/:id", requireAdminAuth, async (req, res) => {
    try {
      await deleteDemoAssignment(req.params.id);
      res.json({ ok: true, id: req.params.id });
    } catch (error: any) {
      sendError(res, error, "Failed to delete demo assignment");
    }
  });

  // ==========================================
  // REVIEWS
  // ==========================================

  // Public: approved reviews only. Admin (with token): everything, for moderation.
  router.get("/reviews", optionalAdminAuth, async (req: AuthRequest, res) => {
    try {
      res.json(await getReviews(!!req.user));
    } catch (error: any) {
      sendError(res, error, "Failed to fetch reviews");
    }
  });

  // Public submissions are ALWAYS stored as Pending. Admin-created reviews are approved.
  router.post("/reviews", publicSubmitLimit, optionalAdminAuth, async (req: AuthRequest, res) => {
    try {
      const clean = sanitizeReview(req.body || {});
      res.status(201).json(await createReview(clean, { approved: !!req.user }));
    } catch (error: any) {
      sendError(res, error, "Failed to create review");
    }
  });

  router.patch("/reviews/:id", requireAdminAuth, async (req, res) => {
    try {
      const b = req.body || {};
      const patch: any = {};
      if (["Pending", "Approved", "Rejected"].includes(b.status)) patch.status = b.status;
      for (const k of ["parentName", "studentInfo", "locality", "comment"]) {
        if (typeof b[k] === "string") patch[k] = b[k].slice(0, 1200);
      }
      if (b.rating !== undefined) patch.rating = Math.min(5, Math.max(1, Math.round(Number(b.rating)) || 5));
      res.json(await updateReview(req.params.id, patch));
    } catch (error: any) {
      sendError(res, error, "Failed to update review");
    }
  });

  router.delete("/reviews/:id", requireAdminAuth, async (req, res) => {
    try {
      await deleteReview(req.params.id);
      res.json({ ok: true, id: req.params.id });
    } catch (error: any) {
      sendError(res, error, "Failed to delete review");
    }
  });

  // ==========================================
  // SERVICES + SETTINGS
  // ==========================================

  router.get("/services", async (_req, res) => {
    try {
      res.json(await getServices());
    } catch (error: any) {
      sendError(res, error, "Failed to fetch services");
    }
  });

  router.post("/services", requireAdminAuth, async (req, res) => {
    try {
      if (!Array.isArray(req.body)) return res.status(400).json({ error: "Expected an array of services" });
      res.json(await saveServices(req.body.slice(0, 50)));
    } catch (error: any) {
      sendError(res, error, "Failed to save services");
    }
  });

  router.get("/settings", async (_req, res) => {
    try {
      res.json(await getSiteSettings());
    } catch (error: any) {
      sendError(res, error, "Failed to fetch settings");
    }
  });

  router.post("/settings", requireAdminAuth, async (req, res) => {
    try {
      const b = req.body;
      if (!b || typeof b !== "object" || Array.isArray(b) || JSON.stringify(b).length > 50_000) {
        return res.status(400).json({ error: "Invalid settings payload" });
      }
      res.json(await saveSiteSettings(b));
    } catch (error: any) {
      sendError(res, error, "Failed to save settings");
    }
  });

  return router;
}

export function createApiApp() {
  const app = express();

  app.disable("x-powered-by");
  app.use((_req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    next();
  });
  // Documents travel as base64 in JSON: 5 MB file ≈ 6.7 MB; vercel caps bodies at ~4.5 MB anyway
  app.use(express.json({ limit: "10mb" }));

  const router = createApiRouter();
  // Mounted on /api and / so Vercel rewrites to the function work either way
  app.use("/api", router);
  app.use(router);

  // Final error handler: never leak stack traces or internals to clients
  app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    if (err?.type === "entity.too.large") return res.status(413).json({ error: "Request is too large." });
    if (err?.type === "entity.parse.failed") return res.status(400).json({ error: "Malformed request." });
    console.error("Unhandled API error:", err?.message || err);
    return res.status(500).json({ error: "Internal server error" });
  });

  return app;
}
