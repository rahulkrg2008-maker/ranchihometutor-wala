export const BUCKET_TUTOR_DOCUMENTS = 'tutors-documents';
export const BUCKET_STUDENT_REQUIREMENTS = 'tuition-requirements';
export const BUCKET_NAME = BUCKET_TUTOR_DOCUMENTS;

/**
 * Uploads a base64 Data URL or document strictly through the private server endpoint.
 * NO Supabase keys or secrets are ever exposed in the client browser.
 * If Supabase is not configured, it gracefully falls back to direct private database storage.
 */
export async function uploadDocumentToStorage(
  fileData: string,
  suggestedName: string,
  folder: 'aadhaar' | 'qualification' | 'requirements' | 'student' | 'general' = 'general',
  bucket?: 'tutor-documents' | 'student-requirements'
): Promise<string> {
  if (!fileData || !fileData.startsWith('data:')) {
    return fileData;
  }

  const targetBucket = bucket || (folder === 'requirements' || folder === 'student' ? BUCKET_STUDENT_REQUIREMENTS : BUCKET_TUTOR_DOCUMENTS);

  try {
    const res = await fetch('/api/storage/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fileData,
        fileName: suggestedName,
        folder,
        bucket: targetBucket,
      }),
    });

    if (res.status === 400 || res.status === 429) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || 'Upload rejected. Please try a different file.');
    }
    if (res.ok) {
      const data = await res.json();
      if (data.url) {
        // Private proxy URL (admin-only) when Supabase storage is configured,
        // otherwise the validated data URL is kept in the database.
        return data.url;
      }
    }
  } catch (err: any) {
    if (err?.message && !/fetch|network/i.test(err.message)) throw err;
    console.warn('Private storage upload endpoint fallback:', err);
  }

  // Safe fallback to raw data string for PostgreSQL database storage
  return fileData;
}
