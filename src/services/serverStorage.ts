import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

export const BUCKET_TUTOR = "tutors-documents";
export const BUCKET_STUDENT = "tuition-requirements";
export const ALT_BUCKET_TUTOR = "tutor-documents";
export const ALT_BUCKET_STUDENT = "student-requirement";

let supabaseAdminClient: any = null;

let bucketStatusCache: {
  tutorExists: boolean;
  studentExists: boolean;
  tutorBucketName: string;
  studentBucketName: string;
  tutorIsPublic: boolean;
  studentIsPublic: boolean;
  lastChecked: number;
} = {
  tutorExists: true,
  studentExists: true,
  tutorBucketName: BUCKET_TUTOR,
  studentBucketName: BUCKET_STUDENT,
  tutorIsPublic: false,
  studentIsPublic: false,
  lastChecked: 0,
};

/** Separate anon-key client used ONLY for verifying coordinator logins/tokens (never the service role). */
export function getSupabaseAuthClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  try {
    return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  } catch {
    return null;
  }
}

export function getSupabaseServerClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY; // service role only: never fall back to the anon key

  if (!url || !key) {
    return null;
  }

  if (!supabaseAdminClient) {
    try {
      supabaseAdminClient = createClient(url, key);
    } catch (e) {
      console.warn("Failed to create server Supabase client:", e);
      return null;
    }
  }

  return supabaseAdminClient;
}

/**
 * Checks if the buckets exist (with a 30-second cache).
 * If a service role key is available and buckets are missing, attempts auto-creation.
 */
export async function checkBuckets(): Promise<{ tutor: boolean; student: boolean }> {
  const client = getSupabaseServerClient();
  if (!client) return { tutor: false, student: false };

  const now = Date.now();
  if (
    (bucketStatusCache.tutorExists || bucketStatusCache.studentExists) &&
    now - bucketStatusCache.lastChecked < 30000
  ) {
    return {
      tutor: bucketStatusCache.tutorExists,
      student: bucketStatusCache.studentExists,
    };
  }

  let tutorFound = true;
  let studentFound = true;
  let tutorBucketName = BUCKET_TUTOR;
  let studentBucketName = BUCKET_STUDENT;
  let tutorIsPublic = false;
  let studentIsPublic = false;

  try {
    const { data: buckets, error } = await client.storage.listBuckets();
    if (!error && Array.isArray(buckets) && buckets.length > 0) {
      const tutorBucket = buckets.find((b: any) => b.name === BUCKET_TUTOR || b.name === ALT_BUCKET_TUTOR);
      const studentBucket = buckets.find((b: any) => b.name === BUCKET_STUDENT || b.name === ALT_BUCKET_STUDENT);
      
      tutorFound = !!tutorBucket;
      studentFound = !!studentBucket;
      if (tutorBucket) tutorBucketName = tutorBucket.name;
      if (studentBucket) studentBucketName = studentBucket.name;
      tutorIsPublic = tutorBucket ? !!tutorBucket.public : false;
      studentIsPublic = studentBucket ? !!studentBucket.public : false;

      // If missing and we have service role key, try auto-create
      if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
        if (!tutorFound) {
          try {
            const { error: c1 } = await client.storage.createBucket(BUCKET_TUTOR, { public: false });
            if (!c1) { tutorFound = true; tutorBucketName = BUCKET_TUTOR; tutorIsPublic = false; }
          } catch {}
        }
        if (!studentFound) {
          try {
            const { error: c2 } = await client.storage.createBucket(BUCKET_STUDENT, { public: false });
            if (!c2) { studentFound = true; studentBucketName = BUCKET_STUDENT; studentIsPublic = false; }
          } catch {}
        }
      }
    }
  } catch {}

  bucketStatusCache = {
    tutorExists: tutorFound,
    studentExists: studentFound,
    tutorBucketName,
    studentBucketName,
    tutorIsPublic,
    studentIsPublic,
    lastChecked: now,
  };

  return { tutor: tutorFound, student: studentFound };
}

export async function isServerSupabaseReady(): Promise<{
  connected: boolean;
  ready: boolean;
  bucketExists: boolean;
  url?: string;
  bucket: string;
  buckets: {
    tutorDocuments: { name: string; exists: boolean; isPublic?: boolean };
    studentRequirements: { name: string; exists: boolean; isPublic?: boolean };
  };
  message: string;
}> {
  const client = getSupabaseServerClient();
  const url = process.env.SUPABASE_URL;

  if (!client || !url) {
    return {
      connected: false,
      ready: false,
      bucketExists: false,
      bucket: `${BUCKET_TUTOR}, ${BUCKET_STUDENT}`,
      buckets: {
        tutorDocuments: { name: BUCKET_TUTOR, exists: false },
        studentRequirements: { name: BUCKET_STUDENT, exists: false },
      },
      message: "Supabase credentials not configured in secrets",
    };
  }

  const cleanUrl = url.replace(/https?:\/\//, "").split(".")[0] + ".supabase.co";
  const { tutor: tutorExists, student: studentExists } = await checkBuckets();
  const allReady = tutorExists && studentExists;
  const anyReady = tutorExists || studentExists;

  const tutorName = bucketStatusCache.tutorBucketName || BUCKET_TUTOR;
  const studentName = bucketStatusCache.studentBucketName || BUCKET_STUDENT;

  let msg = "Connected to Supabase storage.";
  if (allReady) {
    const privacyType = (!bucketStatusCache.tutorIsPublic && !bucketStatusCache.studentIsPublic) 
      ? "Private (Secured with Signed Access)" 
      : "Active";
    msg = `Connected! Both '${tutorName}' and '${studentName}' buckets are ${privacyType}.`;
  } else if (tutorExists && !studentExists) {
    msg = `Bucket '${tutorName}' is active. Please create '${studentName}' bucket in Supabase.`;
  } else if (!tutorExists && studentExists) {
    msg = `Bucket '${studentName}' is active. Please create '${tutorName}' bucket in Supabase.`;
  } else {
    msg = `Connected to Supabase! Buckets '${tutorName}' and '${studentName}' are active.`;
  }

  return {
    connected: true,
    ready: anyReady,
    bucketExists: anyReady,
    url: cleanUrl,
    bucket: `${tutorName}, ${studentName}`,
    buckets: {
      tutorDocuments: { name: tutorName, exists: tutorExists, isPublic: bucketStatusCache.tutorIsPublic },
      studentRequirements: { name: studentName, exists: studentExists, isPublic: bucketStatusCache.studentIsPublic },
    },
    message: msg,
  };
}

const ALLOWED_UPLOAD_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'application/pdf': 'pdf',
};
const MAX_UPLOAD_BYTES = 5 * 1024 * 1024; // 5 MB decoded
const ALLOWED_UPLOAD_FOLDERS = ['aadhaar', 'qualification', 'requirements', 'student', 'general'];

function hasValidMagicBytes(buf: Buffer, contentType: string): boolean {
  if (contentType === 'image/jpeg') return buf[0] === 0xff && buf[1] === 0xd8;
  if (contentType === 'image/png') return buf.subarray(0, 4).toString('hex') === '89504e47';
  if (contentType === 'image/webp') return buf.subarray(0, 4).toString() === 'RIFF' && buf.subarray(8, 12).toString() === 'WEBP';
  if (contentType === 'application/pdf') return buf.subarray(0, 4).toString() === '%PDF';
  return false;
}

export class UploadValidationError extends Error {}

export function validateUploadData(fileData: string): { buffer: Buffer; contentType: string } {
  const m = /^data:([a-zA-Z0-9.+/-]+);base64,([A-Za-z0-9+/=\r\n]+)$/.exec(fileData || '');
  if (!m) throw new UploadValidationError('Invalid file. Please upload a JPG, PNG, WebP or PDF.');
  const contentType = m[1].toLowerCase();
  if (!ALLOWED_UPLOAD_TYPES[contentType]) {
    throw new UploadValidationError('Unsupported file type. Allowed: JPG, PNG, WebP, PDF.');
  }
  const buffer = Buffer.from(m[2], 'base64');
  if (buffer.length === 0 || buffer.length > MAX_UPLOAD_BYTES) {
    throw new UploadValidationError('File is too large. Maximum size is 5 MB.');
  }
  if (!hasValidMagicBytes(buffer, contentType)) {
    throw new UploadValidationError('File content does not match its type.');
  }
  return { buffer, contentType };
}

/** Private proxy path. Only coordinators can open it (see GET /api/storage/file). */
export function privateFileUrl(bucket: string, filePath: string): string {
  return `/api/storage/file?bucket=${encodeURIComponent(bucket)}&path=${encodeURIComponent(filePath)}`;
}

export function isAllowedBucket(bucket: string): boolean {
  return [BUCKET_TUTOR, BUCKET_STUDENT, ALT_BUCKET_TUTOR, ALT_BUCKET_STUDENT].includes(bucket);
}

export function isSafeStoragePath(p: string): boolean {
  return !!p && !p.includes('..') && !p.startsWith('/') && /^[a-zA-Z0-9_\-./]+$/.test(p);
}

/**
 * Validates and stores an uploaded document in a PRIVATE Supabase bucket.
 * Returns an admin-only proxy URL (never a long-lived signed URL).
 * If Supabase is not configured, returns isFallback so the caller can decide.
 */
export async function uploadFileToSupabase(
  fileData: string,
  _fileName: string,
  folder: string = "general",
  _preferredBucket?: string
): Promise<{ url: string; isFallback: boolean; error?: string; bucketUsed?: string }> {
  const { buffer, contentType } = validateUploadData(fileData);
  const safeFolder = ALLOWED_UPLOAD_FOLDERS.includes(folder) ? folder : 'general';

  const client = getSupabaseServerClient();
  if (!client) {
    return { url: fileData, isFallback: true };
  }

  // The bucket is decided by the server from the folder, never by the client.
  const isStudent = safeFolder === 'requirements' || safeFolder === 'student';
  const targetBucket = isStudent
    ? bucketStatusCache.studentBucketName || BUCKET_STUDENT
    : bucketStatusCache.tutorBucketName || BUCKET_TUTOR;

  const filePath = `${safeFolder}/${Date.now()}_${crypto.randomUUID()}.${ALLOWED_UPLOAD_TYPES[contentType]}`;

  const { error } = await client.storage
    .from(targetBucket)
    .upload(filePath, buffer, { contentType, upsert: false });

  if (error) {
    if (error.message && error.message.toLowerCase().includes("not found")) {
      bucketStatusCache.lastChecked = 0;
    }
    return { url: fileData, isFallback: true, bucketUsed: targetBucket, error: `Supabase upload: ${error.message}` };
  }

  return { url: privateFileUrl(targetBucket, filePath), isFallback: false, bucketUsed: targetBucket };
}
