// Validation + whitelisting for PUBLIC submissions. Anything not listed here is dropped,
// and server-controlled fields (id, status, verification flags, assignments, notes) are
// forced to safe defaults so visitors can never approve themselves or overwrite records.

export class ValidationError extends Error {}

const str = (v: unknown, max: number, field: string, required = false): string => {
  const s = typeof v === 'string' ? v.trim() : v == null ? '' : String(v).trim();
  if (required && !s) throw new ValidationError(`${field} is required.`);
  if (s.length > max) throw new ValidationError(`${field} is too long (max ${max} characters).`);
  return s;
};

const strArray = (v: unknown, maxItems: number, maxLen: number, field: string): string[] => {
  if (!Array.isArray(v)) return [];
  if (v.length > maxItems) throw new ValidationError(`Too many entries in ${field}.`);
  return v.map((x) => str(x, maxLen, field)).filter(Boolean);
};

const phone = (v: unknown, field = 'Phone'): string => {
  let d = str(v, 25, field, true).replace(/\D/g, '');
  if (d.length === 12 && d.startsWith('91')) d = d.slice(2); // +91 98xxxxxx
  if (d.length === 11 && d.startsWith('0')) d = d.slice(1); // 098xxxxxx / 07xxxxxxx
  if (d.length === 13 && d.startsWith('091')) d = d.slice(3);
  if (!/^[6-9]\d{9}$/.test(d)) throw new ValidationError(`${field} must be a valid 10-digit Indian mobile number.`);
  return d;
};

const oneOf = <T extends string>(v: unknown, allowed: readonly T[], fallback: T): T =>
  allowed.includes(v as T) ? (v as T) : fallback;

/** Document references: either a private storage proxy path, or an inline data URL (DB fallback). */
const MAX_INLINE_DOC = 7_500_000; // ~5 MB binary as base64
const docRef = (v: unknown): string | undefined => {
  if (typeof v !== 'string' || !v) return undefined;
  if (v.startsWith('/api/storage/file?')) return v.slice(0, 600);
  if (/^data:(image\/(jpeg|png|webp)|application\/pdf);base64,/.test(v) && v.length <= MAX_INLINE_DOC) return v;
  throw new ValidationError('Invalid document upload.');
};

export function sanitizeRequirement(b: any, isAdmin: boolean) {
  const out: any = {
    parentName: str(b.parentName, 100, 'Parent name', true),
    studentName: str(b.studentName, 100, 'Student name', true),
    phone: phone(b.phone),
    classes: strArray(b.classes, 15, 40, 'classes'),
    subjects: strArray(b.subjects, 20, 60, 'subjects'),
    area: str(b.area, 150, 'Area', true),
    classesPerWeek: Math.min(7, Math.max(1, Number(b.classesPerWeek) || 5)),
    timeFrom: str(b.timeFrom, 20, 'Start time') || '05:00 PM',
    timeTo: str(b.timeTo, 20, 'End time') || '07:00 PM',
    preferredTutor: oneOf(b.preferredTutor, ['Male', 'Female', 'No Preference'] as const, 'No Preference'),
    budget: str(b.budget, 60, 'Budget') || '₹4,000 – ₹5,000',
    additionalRequirements: str(b.additionalRequirements, 1500, 'Additional requirements'),
    documentPhoto: docRef(b.documentPhoto),
  };
  if (out.classes.length === 0) throw new ValidationError('Select at least one class.');
  if (out.subjects.length === 0) throw new ValidationError('Enter at least one subject.');
  if (isAdmin) {
    if (b.status) out.status = str(b.status, 40, 'status');
    if (b.assignedTutorId) out.assignedTutorId = str(b.assignedTutorId, 40, 'assignedTutorId');
    if (b.assignedTutorName) out.assignedTutorName = str(b.assignedTutorName, 120, 'assignedTutorName');
    if (b.adminNotes) out.adminNotes = str(b.adminNotes, 3000, 'adminNotes');
  }
  return out;
}

export function sanitizeTutor(b: any, isAdmin: boolean) {
  const out: any = {
    fullName: str(b.fullName, 100, 'Full name', true),
    dob: str(b.dob, 20, 'Date of birth') || undefined,
    gender: oneOf(b.gender, ['Male', 'Female', 'Other'] as const, 'Other'),
    phone: phone(b.phone),
    email: str(b.email, 150, 'Email'),
    highestQualification: str(b.highestQualification, 150, 'Qualification', true),
    college: str(b.college, 150, 'College'),
    subjects: strArray(b.subjects, 20, 60, 'subjects'),
    classes: strArray(b.classes, 15, 40, 'classes'),
    teachingExperience: str(b.teachingExperience, 10, 'Experience') || '0',
    teachingArea: str(b.teachingArea, 200, 'Teaching area') || 'Ranchi',
    teachingMode: oneOf(b.teachingMode, ['Student Home', 'Online', 'Hybrid'] as const, 'Student Home'),
    availability: str(b.availability, 150, 'Availability') || 'Morning & Evening',
    panNumber: str(b.panNumber, 12, 'PAN') || undefined,
    profilePhoto: typeof b.profilePhoto === 'string' && /^https:\/\//.test(b.profilePhoto) ? b.profilePhoto.slice(0, 500) : undefined,
    qualificationPhoto: docRef(b.qualificationPhoto),
    aadhaarPhoto: docRef(b.aadhaarPhoto),
    // Only the last 4 digits are ever kept
    aadhaarLast4: typeof b.aadhaarLast4 === 'string' && /^\d{4}$/.test(b.aadhaarLast4) ? b.aadhaarLast4 : undefined,
  };
  if (out.subjects.length === 0) throw new ValidationError('Enter at least one subject.');
  if (!isAdmin && (!out.qualificationPhoto || !out.aadhaarPhoto)) {
    throw new ValidationError('Qualification and Aadhaar photos are required.');
  }
  if (isAdmin) {
    // Coordinators may pre-verify / assign when adding a tutor manually
    out.status = oneOf(b.status, ['Pending', 'Approved', 'Rejected'] as const, 'Pending');
    out.aadhaarVerified = !!b.aadhaarVerified;
    if (b.assignedStudentId) out.assignedStudentId = str(b.assignedStudentId, 40, 'assignedStudentId');
    if (b.assignedStudentName) out.assignedStudentName = str(b.assignedStudentName, 150, 'assignedStudentName');
    if (b.adminNotes) out.adminNotes = str(b.adminNotes, 3000, 'adminNotes');
  } else {
    out.status = 'Pending';
    out.aadhaarVerified = false;
    out.isHidden = false;
  }
  return out;
}

export function sanitizeReview(b: any) {
  const rating = Math.round(Number(b.rating));
  if (!(rating >= 1 && rating <= 5)) throw new ValidationError('Rating must be between 1 and 5.');
  return {
    parentName: str(b.parentName, 80, 'Name', true),
    studentInfo: str(b.studentInfo, 120, 'Student info') || 'Parent in Ranchi',
    locality: str(b.locality, 80, 'Locality') || 'Ranchi',
    rating,
    comment: str(b.comment, 1200, 'Review', true),
  };
}
