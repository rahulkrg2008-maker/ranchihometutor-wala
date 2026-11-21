// src/middleware/auth.ts
// Stateless, HMAC-signed admin session tokens. They work across serverless
// instances (Vercel) because nothing is stored in server memory.
import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { getSupabaseAuthClient } from '../services/serverStorage.ts';

export interface AuthUser {
  uid: string;
  email?: string;
  name?: string;
  role?: string;
}

export interface AuthRequest extends Request {
  user?: AuthUser;
}

const SESSION_TTL_MS = 1000 * 60 * 60 * 24; // 24 hours

// Authorized coordinators. Override in production with ADMIN_EMAILS="a@x.com,b@y.com"
const DEFAULT_ADMIN_EMAILS = [
  'rahulkrg2008@gmail.com',
  'rahuliya2008@gmail.com',
  'admin@ranchihometutor.com',
  'coordinator@ranchihometutor.com',
];

export function getAuthorizedAdminEmails(): string[] {
  const fromEnv = (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return fromEnv.length > 0 ? fromEnv : DEFAULT_ADMIN_EMAILS;
}

export function isAuthorizedAdminEmail(email: string): boolean {
  return getAuthorizedAdminEmails().includes(email.trim().toLowerCase());
}

/** Secret used to sign sessions. Must be set in production. */
function getSessionSecret(): string | null {
  if (process.env.SESSION_SECRET) return process.env.SESSION_SECRET;
  if (process.env.NODE_ENV === 'development' && process.env.ADMIN_PASSWORD) {
    return 'dev-only:' + process.env.ADMIN_PASSWORD; // local development convenience only
  }
  return null;
}

export function isSessionSigningConfigured(): boolean {
  return !!getSessionSecret();
}

const b64 = (buf: Buffer | string) => Buffer.from(buf).toString('base64url');

function sign(payload: string, secret: string): string {
  return crypto.createHmac('sha256', secret).update(payload).digest('base64url');
}

export function safeEqual(a: string, b: string): boolean {
  const ha = crypto.createHash('sha256').update(a).digest();
  const hb = crypto.createHash('sha256').update(b).digest();
  return crypto.timingSafeEqual(ha, hb);
}

export function createSessionToken(user: { email: string; name: string; role: string }): string {
  const secret = getSessionSecret();
  if (!secret) throw new Error('SESSION_SECRET is not configured');
  const payload = b64(JSON.stringify({ ...user, exp: Date.now() + SESSION_TTL_MS }));
  return `rht1.${payload}.${sign(payload, secret)}`;
}

export function verifySessionToken(token: string): (AuthUser & { exp: number }) | null {
  const secret = getSessionSecret();
  if (!secret) return null;
  const parts = token.split('.');
  if (parts.length !== 3 || parts[0] !== 'rht1') return null;
  const [, payload, sig] = parts;
  if (!safeEqual(sig, sign(payload, secret))) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (!data.exp || data.exp < Date.now()) return null;
    if (!isAuthorizedAdminEmail(String(data.email || ''))) return null;
    return { uid: data.email, email: data.email, name: data.name, role: data.role, exp: data.exp };
  } catch {
    return null;
  }
}

async function resolveUser(req: Request): Promise<AuthUser | null> {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.slice('Bearer '.length).trim();
  if (!token) return null;

  const session = verifySessionToken(token);
  if (session) return session;

  // Fallback: a real Supabase access token belonging to an authorized coordinator
  try {
    const supabase = getSupabaseAuthClient();
    if (supabase) {
      const { data, error } = await supabase.auth.getUser(token);
      const email = data?.user?.email?.toLowerCase().trim();
      if (!error && data.user && email && isAuthorizedAdminEmail(email)) {
        return {
          uid: data.user.id,
          email,
          name: data.user.user_metadata?.full_name || email.split('@')[0],
          role: 'admin',
        };
      }
    }
  } catch (err) {
    console.warn('Supabase auth verification error:', err);
  }
  return null;
}

/** Strict guard for coordinator-only routes. */
export const requireAdminAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const user = await resolveUser(req);
  if (!user) {
    return res.status(401).json({
      error: 'Unauthorized: Access restricted to authorized Ranchi HomeTutor coordinators.',
    });
  }
  req.user = user;
  return next();
};

/** Attaches req.user when a valid admin token is present, but never rejects. */
export const optionalAdminAuth = async (req: AuthRequest, _res: Response, next: NextFunction) => {
  const user = await resolveUser(req);
  if (user) req.user = user;
  next();
};

export const requireAuth = requireAdminAuth;
