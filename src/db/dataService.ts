import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";
import { 
  TuitionRequirement, 
  Tutor, 
  Review, 
  WebsiteSettings, 
  TutorStatus, 
  RequirementStatus, 
  DemoAssignment, 
  DemoStatus 
} from "../types.ts";
import { 
  INITIAL_SETTINGS, 
  INITIAL_REVIEWS, 
  INITIAL_REQUIREMENTS, 
  INITIAL_TUTORS, 
  INITIAL_DEMO_ASSIGNMENTS 
} from "../data/initialData.ts";

const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

export const supabase = (supabaseUrl && supabaseKey)
  ? createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
  : null;

// In-memory fallback & cache store (synced with Supabase)
// Secure by default: anything other than an explicit NODE_ENV=development is treated as production
const IS_PROD = process.env.NODE_ENV !== "development";

/**
 * In production the in-memory store is NEVER used as a substitute for the database:
 * seed/demo data is not loaded and any database failure surfaces as an error instead
 * of silently losing submissions or showing fake records.
 * Outside production (local dev without Supabase) the seed data is loaded for convenience.
 */
export function assertFallbackAllowed(): void {
  if (IS_PROD) {
    throw new Error("Database is unavailable or not configured. Please try again later.");
  }
}

const memoryStore = {
  tutors: new Map<string, Tutor>(IS_PROD ? [] : INITIAL_TUTORS.map((t) => [t.id, t])),
  requirements: new Map<string, TuitionRequirement>(IS_PROD ? [] : INITIAL_REQUIREMENTS.map((r) => [r.id, r])),
  demos: new Map<string, DemoAssignment>(IS_PROD ? [] : INITIAL_DEMO_ASSIGNMENTS.map((d) => [d.id, d])),
  reviews: IS_PROD ? ([] as Review[]) : [...INITIAL_REVIEWS],
  settings: { ...INITIAL_SETTINGS },
};

/** Next sequential ID such as HW07 / RHT-0012 / DEMO-1004, computed from existing DB ids. */
async function nextSequentialId(table: string, prefix: string, pad: number, start = 1): Promise<string> {
  let max = start - 1;
  const scan = (id: string) => {
    const m = new RegExp("^" + prefix.replace(/[-]/g, "\\-") + "(\\d+)$").exec(id || "");
    if (m) max = Math.max(max, parseInt(m[1], 10));
  };
  if (supabase) {
    const { data, error } = await supabase.from(table).select("id");
    if (error) throw new Error(error.message);
    (data || []).forEach((r: any) => scan(r.id));
  } else {
    assertFallbackAllowed();
    const map: Map<string, any> =
      table === "tutors" ? memoryStore.tutors : table === "tuition_requirements" ? memoryStore.requirements : memoryStore.demos;
    for (const id of map.keys()) scan(id);
  }
  return prefix + String(max + 1).padStart(pad, "0");
}

/** Inserts a row, regenerating the id if two requests race and collide (unique violation). */
async function insertWithGeneratedId<T extends { id: string }>(
  table: string,
  prefix: string,
  pad: number,
  start: number,
  build: (id: string) => { model: T; row: any }
): Promise<{ model: T; row: any | null }> {
  for (let attempt = 0; attempt < 6; attempt++) {
    const id = await nextSequentialId(table, prefix, pad, start);
    const { model, row } = build(id);
    if (!supabase) {
      assertFallbackAllowed();
      return { model, row: null };
    }
    const { data, error } = await supabase.from(table).insert(row).select().maybeSingle();
    if (!error) return { model, row: data };
    if ((error as any).code === "23505") continue; // id taken by a concurrent request: retry
    throw new Error(error.message);
  }
  throw new Error("Could not allocate a unique ID. Please try again.");
}

// ==========================================
// MAPPERS: Supabase DB <-> App Models
// ==========================================

function normalizeTutorStatus(s?: string): TutorStatus {
  if (!s) return "Pending";
  const lower = s.toLowerCase();
  if (lower === "approved") return "Approved";
  if (lower === "rejected") return "Rejected";
  return "Pending";
}

function normalizeRequirementStatus(s?: string): RequirementStatus {
  if (!s) return "New";
  const map: Record<string, RequirementStatus> = {
    new: "New",
    contacted: "Contacted",
    searching: "Searching",
    "tutor assigned": "Tutor Assigned",
    assigned: "Tutor Assigned",
    "demo scheduled": "Demo Scheduled",
    filled: "Filled",
    fulfilled: "Filled",
    "tuition started": "Tuition Started",
    completed: "Completed",
    cancelled: "Cancelled",
    "on hold": "On Hold",
    "no tutor available": "No Tutor Available",
  };
  return map[s.toLowerCase()] || "New";
}

export function mapRowToTutor(row: any): Tutor {
  // Aadhaar minimization: mask and only show last 4 digits
  let last4 = row.aadhaar_last4 || "";
  let fullAadhaar = row.aadhaar_number || "";
  if (!last4 && fullAadhaar) {
    const digits = fullAadhaar.replace(/\D/g, "");
    if (digits.length >= 4) {
      last4 = digits.slice(-4);
    }
  }
  const maskedAadhaar = last4 ? `•••• •••• ${last4}` : (row.aadhaar_number ? "•••• •••• " + row.aadhaar_number.slice(-4) : undefined);

  return {
    id: row.id,
    fullName: row.full_name || row.fullName || row.name || "Tutor",
    dob: row.dob || undefined,
    gender: (row.gender === "Male" || row.gender === "Female") ? row.gender : "Other",
    phone: row.phone || "",
    email: row.email || "",
    highestQualification: row.highest_qualification || row.highestQualification || row.qualification || "Graduate",
    college: row.college_institution || row.college || "",
    subjects: Array.isArray(row.subjects) ? row.subjects : [],
    classes: Array.isArray(row.classes_handled) ? row.classes_handled : (Array.isArray(row.classes) ? row.classes : []),
    teachingExperience: row.teaching_experience_years || row.teachingExperience || row.experience || 1,
    teachingArea: row.current_locality || row.teachingArea || (Array.isArray(row.preferred_areas) && row.preferred_areas[0]) || "Ranchi",
    teachingMode: (row.teachingMode as any) || "Student Home",
    availability: row.availability || "Morning & Evening",
    aadhaarLast4: last4 || undefined,
    aadhaarNumber: maskedAadhaar,
    profilePhoto: row.profile_photo_url || row.profilePhoto || row.photo || undefined,
    qualificationPhoto: row.degree_certificate_url || row.qualificationPhoto || undefined,
    aadhaarPhoto: row.id_proof_url || row.aadhaarPhoto || undefined,
    aadhaarVerified: !!row.aadhaar_verified || (normalizeTutorStatus(row.status) === "Approved"),
    status: normalizeTutorStatus(row.status),
    isHidden: !!row.is_hidden,
    registeredAt: row.registered_at ? new Date(row.registered_at).toISOString().split("T")[0] : (row.registeredAt || new Date().toISOString().split("T")[0]),
    assignedRequirementsCount: Number(row.active_assignments_count || row.assignedRequirementsCount || 0),
    assignedStudentId: row.assigned_student_id || row.assignedStudentId || undefined,
    assignedStudentName: row.assigned_student_name || row.assignedStudentName || undefined,
    adminNotes: row.admin_review_notes || row.adminNotes || undefined,
  };
}

export function mapTutorToRow(t: Tutor | any) {
  const name = t.fullName || t.name || "Tutor";
  const locality = t.teachingArea || (Array.isArray(t.classes) && t.classes[0]) || (Array.isArray(t.localities) && t.localities[0]) || "Ranchi";
  const qualification = t.highestQualification || t.qualification || "Graduate";
  const statusStr = t.status === "Approved" ? "Approved" : (t.status === "Rejected" ? "Rejected" : "Pending");

  // Extract last 4 digits for privacy
  let last4 = t.aadhaarLast4;
  if (!last4 && t.aadhaarNumber) {
    const d = t.aadhaarNumber.replace(/\D/g, "");
    if (d.length >= 4) last4 = d.slice(-4);
  }

  return {
    id: t.id,
    full_name: name,
    phone: t.phone || "",
    email: t.email || "",
    gender: t.gender || "Other",
    dob: t.dob || null,
    highest_qualification: qualification,
    college: t.college || "",
    subjects: Array.isArray(t.subjects) ? t.subjects : [],
    classes: Array.isArray(t.classes) ? t.classes : [],
    teaching_experience: String(t.teachingExperience || "1"),
    teaching_area: locality,
    teaching_mode: t.teachingMode || "Student Home",
    availability: t.availability || "Morning & Evening",
    aadhaar_last4: last4 || null,
    aadhaar_number: last4 ? `•••• •••• ${last4}` : null,
    pan_number: t.panNumber || null,
    profile_photo: t.profilePhoto || null,
    qualification_photo: t.qualificationPhoto || null,
    aadhaar_photo: t.aadhaarPhoto || null,
    aadhaar_verified: !!t.aadhaarVerified,
    status: statusStr,
    is_hidden: !!t.isHidden,
    registered_at: t.registeredAt ? new Date(t.registeredAt).toISOString() : new Date().toISOString(),
    assigned_requirements_count: Number(t.assignedRequirementsCount || 0),
    assigned_student_id: t.assignedStudentId || null,
    assigned_student_name: t.assignedStudentName || null,
    admin_notes: t.adminNotes || null,
  };
}

export function mapRowToRequirement(row: any): TuitionRequirement {
  return {
    id: row.id,
    reqCode: row.req_code || row.id,
    parentName: row.parent_name || row.parent_or_guardian_name || row.parentName || "Parent",
    studentName: row.student_name || row.studentName || row.parent_name || "Student",
    phone: row.phone || row.contact_phone || "",
    classes: Array.isArray(row.classes) ? row.classes : (Array.isArray(row.student_class) ? row.student_class : (row.student_class ? [row.student_class] : ["Class 10"])),
    subjects: Array.isArray(row.subjects) ? row.subjects : (Array.isArray(row.subjects_needed) ? row.subjects_needed : []),
    area: row.area || row.tuition_area || row.locality || "Ranchi",
    classesPerWeek: Number(row.classes_per_week || row.classesPerWeek || 5),
    timeFrom: row.time_from || row.timeFrom || "05:00 PM",
    timeTo: row.time_to || row.timeTo || "07:00 PM",
    preferredTutor: (row.preferred_tutor === "Male" || row.preferred_tutor === "Female") ? row.preferred_tutor : "No Preference",
    budget: row.budget || row.budget_range || "₹4,000 – ₹5,000",
    additionalRequirements: row.additional_requirements || row.special_requirements || "",
    status: normalizeRequirementStatus(row.status),
    assignedTutorId: row.assigned_tutor_id || row.assignedTutorId || undefined,
    assignedTutorName: row.assigned_tutor_name || row.assignedTutorName || undefined,
    documentPhoto: row.document_photo || row.syllabus_attachment_url || undefined,
    adminNotes: row.admin_notes || undefined,
    createdAt: row.created_at ? new Date(row.created_at).toISOString().split("T")[0] : (row.createdAt || new Date().toISOString().split("T")[0]),
  };
}

export function mapRequirementToRow(r: TuitionRequirement | any) {
  return {
    id: r.id,
    req_code: r.reqCode || r.id,
    parent_name: r.parentName || "Parent",
    student_name: r.studentName || "Student",
    phone: r.phone || "",
    classes: Array.isArray(r.classes) ? r.classes : (r.class ? [r.class] : ["Class 10"]),
    subjects: Array.isArray(r.subjects) ? r.subjects : [],
    area: r.area || "Ranchi",
    classes_per_week: Number(r.classesPerWeek || 5),
    time_from: r.timeFrom || "05:00 PM",
    time_to: r.timeTo || "07:00 PM",
    preferred_tutor: r.preferredTutor || "No Preference",
    budget: r.budget || "₹4,000 – ₹5,000",
    additional_requirements: r.additionalRequirements || null,
    status: r.status || "New",
    assigned_tutor_id: r.assignedTutorId || null,
    assigned_tutor_name: r.assignedTutorName || null,
    document_photo: r.documentPhoto || null,
    admin_notes: r.adminNotes || null,
    created_at: r.createdAt ? new Date(r.createdAt).toISOString() : new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

export function mapRowToDemo(row: any): DemoAssignment {
  return {
    id: row.id,
    requirementId: row.requirement_id || row.requirementId,
    tutorId: row.tutor_id || row.tutorId,
    tutorName: row.tutor_name || row.tutorName,
    studentName: row.student_name || row.studentName,
    parentName: row.parent_name || row.parentName,
    phone: row.phone || "",
    subjects: Array.isArray(row.subjects) ? row.subjects : [],
    classes: Array.isArray(row.classes) ? row.classes : [],
    demoDate: row.demo_date || row.demoDate,
    demoTime: row.demo_time || row.demoTime,
    demoLocation: row.demo_location || row.demoLocation,
    status: (row.status as DemoStatus) || "DEMO_SCHEDULED",
    parentFeedback: row.parent_feedback || row.parentFeedback || undefined,
    tutorFeedback: row.tutor_feedback || row.tutorFeedback || undefined,
    coordinatorNotes: row.coordinator_notes || row.coordinatorNotes || undefined,
    finalDecision: row.final_decision || row.finalDecision || undefined,
    createdAt: row.created_at ? new Date(row.created_at).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
    updatedAt: row.updated_at ? new Date(row.updated_at).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
  };
}

export function mapDemoToRow(d: DemoAssignment | any) {
  return {
    id: d.id,
    requirement_id: d.requirementId,
    tutor_id: d.tutorId,
    tutor_name: d.tutorName,
    student_name: d.studentName,
    parent_name: d.parentName,
    phone: d.phone,
    subjects: Array.isArray(d.subjects) ? d.subjects : [],
    classes: Array.isArray(d.classes) ? d.classes : [],
    demo_date: d.demoDate,
    demo_time: d.demoTime,
    demo_location: d.demoLocation,
    status: d.status || "DEMO_SCHEDULED",
    parent_feedback: d.parentFeedback || null,
    tutor_feedback: d.tutorFeedback || null,
    coordinator_notes: d.coordinatorNotes || null,
    final_decision: d.finalDecision || null,
    created_at: d.createdAt ? new Date(d.createdAt).toISOString() : new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

// ==========================================
// TUTORS (SUPABASE 'tutors' TABLE)
// ==========================================

export async function getTutors(): Promise<Tutor[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("tutors")
        .select("*")
        .order("registered_at", { ascending: false });

      if (!error && Array.isArray(data)) {
        data.forEach((row) => {
          const t = mapRowToTutor(row);
          memoryStore.tutors.set(t.id, t);
        });
        return data.map(mapRowToTutor);
      }
    } catch (err: any) {
      console.warn("Supabase getTutors error:", err.message);
    }
  }
  assertFallbackAllowed();
  return Array.from(memoryStore.tutors.values());
}

export async function getTutorById(id: string): Promise<Tutor | null> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("tutors")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (!error && data) {
        const t = mapRowToTutor(data);
        memoryStore.tutors.set(t.id, t);
        return t;
      }
    } catch (err: any) {
      console.warn("Supabase getTutorById error:", err.message);
    }
  }
  return memoryStore.tutors.get(id) || null;
}

export async function createTutor(data: any): Promise<Tutor> {
  const build = (tutorId: string) => {
  const completeTutor: Tutor = {
    id: tutorId,
    fullName: data.fullName || data.name || data.full_name || "Tutor",
    dob: data.dob,
    gender: (data.gender === "Male" || data.gender === "Female") ? data.gender : "Other",
    phone: data.phone || "",
    email: data.email || "",
    highestQualification: data.highestQualification || data.qualification || data.highest_qualification || "Graduate",
    college: data.college || "",
    subjects: Array.isArray(data.subjects) ? data.subjects : [],
    classes: Array.isArray(data.classes) ? data.classes : [],
    teachingExperience: data.teachingExperience || data.experience || 1,
    teachingArea: data.teachingArea || "Ranchi",
    teachingMode: (data.teachingMode as any) || "Student Home",
    availability: data.availability || "Morning & Evening",
    aadhaarLast4: data.aadhaarLast4,
    aadhaarNumber: data.aadhaarNumber,
    profilePhoto: data.profilePhoto || data.photo,
    qualificationPhoto: data.qualificationPhoto,
    aadhaarPhoto: data.aadhaarPhoto,
    aadhaarVerified: !!data.aadhaarVerified,
    status: normalizeTutorStatus(data.status),
    isHidden: !!data.isHidden,
    registeredAt: data.registeredAt || new Date().toISOString().split("T")[0],
    assignedRequirementsCount: 0,
  };

  return { model: completeTutor, row: mapTutorToRow(completeTutor) };
  };

  const { model, row } = await insertWithGeneratedId<Tutor>("tutors", "RHT-", 4, 1, build);
  memoryStore.tutors.set(model.id, model);
  return row ? mapRowToTutor(row) : model;
}

export async function updateTutor(id: string, data: any): Promise<Tutor | null> {
  const existing = memoryStore.tutors.get(id) || await getTutorById(id);
  const updated: Tutor = {
    ...(existing || {}),
    ...data,
    id,
  };
  memoryStore.tutors.set(id, updated);

  if (supabase) {
    try {
      const row = mapTutorToRow(updated);
      const { data: dbRow, error } = await supabase
        .from("tutors")
        .update(row)
        .eq("id", id)
        .select()
        .maybeSingle();

      if (!error && dbRow) {
        return mapRowToTutor(dbRow);
      }
    } catch (err: any) {
      console.warn("Supabase updateTutor error:", err.message);
    }
  }

  assertFallbackAllowed();
  return updated;
}

export async function deleteTutor(id: string): Promise<boolean> {
  memoryStore.tutors.delete(id);
  if (supabase) {
    const { error } = await supabase.from("tutors").delete().eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    assertFallbackAllowed();
  }
  return true;
}

// ==========================================
// TUITION REQUIREMENTS (SUPABASE 'tuition_requirements' TABLE)
// ==========================================

export async function getTuitionRequirements(): Promise<TuitionRequirement[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("tuition_requirements")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && Array.isArray(data)) {
        data.forEach((row) => {
          const r = mapRowToRequirement(row);
          memoryStore.requirements.set(r.id, r);
        });
        return data.map(mapRowToRequirement);
      }
    } catch (err: any) {
      console.warn("Supabase getTuitionRequirements error:", err.message);
    }
  }
  assertFallbackAllowed();
  return Array.from(memoryStore.requirements.values());
}

export const getRequirements = getTuitionRequirements;

export async function getTuitionRequirementById(id: string): Promise<TuitionRequirement | null> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("tuition_requirements")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (!error && data) {
        const r = mapRowToRequirement(data);
        memoryStore.requirements.set(r.id, r);
        return r;
      }
    } catch (err: any) {
      console.warn("Supabase getTuitionRequirementById error:", err.message);
    }
  }
  return memoryStore.requirements.get(id) || null;
}

export const getRequirementById = getTuitionRequirementById;

export async function createTuitionRequirement(data: any): Promise<TuitionRequirement> {
  const build = (reqId: string) => {
  const completeReq: TuitionRequirement = {
    id: reqId,
    reqCode: reqId,
    parentName: data.parentName || data.parent_or_guardian_name || "Parent",
    studentName: data.studentName || data.student_name || "Student",
    phone: data.phone || data.contact_phone || "",
    classes: Array.isArray(data.classes) ? data.classes : (data.class ? [data.class] : ["Class 10"]),
    subjects: Array.isArray(data.subjects) ? data.subjects : (Array.isArray(data.subjects_needed) ? data.subjects_needed : []),
    area: data.area || data.locality || "Ranchi",
    classesPerWeek: Number(data.classesPerWeek || 5),
    timeFrom: data.timeFrom || "05:00 PM",
    timeTo: data.timeTo || "07:00 PM",
    preferredTutor: (data.preferredTutor === "Male" || data.preferredTutor === "Female") ? data.preferredTutor : "No Preference",
    budget: typeof data.budget === "number" ? `₹${data.budget}` : (data.budget || "₹4,000 – ₹5,000"),
    additionalRequirements: data.additionalRequirements || data.notes || "",
    status: normalizeRequirementStatus(data.status),
    assignedTutorId: data.assignedTutorId,
    assignedTutorName: data.assignedTutorName,
    documentPhoto: data.documentPhoto || data.syllabus_attachment_url,
    adminNotes: data.adminNotes,
    createdAt: data.createdAt || new Date().toISOString().split("T")[0],
  };

  return { model: completeReq, row: mapRequirementToRow(completeReq) };
  };

  const { model, row } = await insertWithGeneratedId<TuitionRequirement>("tuition_requirements", "HW", 2, 1, build);
  memoryStore.requirements.set(model.id, model);
  return row ? mapRowToRequirement(row) : model;
}

export const createRequirement = createTuitionRequirement;

export async function updateTuitionRequirement(id: string, data: any): Promise<TuitionRequirement | null> {
  const existing = memoryStore.requirements.get(id) || await getTuitionRequirementById(id);
  const updated: TuitionRequirement = {
    ...(existing || {}),
    ...data,
    id,
  };
  memoryStore.requirements.set(id, updated);

  if (supabase) {
    try {
      const row = mapRequirementToRow(updated);
      const { data: dbRow, error } = await supabase
        .from("tuition_requirements")
        .update(row)
        .eq("id", id)
        .select()
        .maybeSingle();

      if (!error && dbRow) {
        return mapRowToRequirement(dbRow);
      }
    } catch (err: any) {
      console.warn("Supabase updateTuitionRequirement error:", err.message);
    }
  }

  assertFallbackAllowed();
  return updated;
}

export const updateRequirement = updateTuitionRequirement;

export async function deleteRequirement(id: string): Promise<boolean> {
  memoryStore.requirements.delete(id);
  if (supabase) {
    const { error } = await supabase.from("tuition_requirements").delete().eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    assertFallbackAllowed();
  }
  return true;
}

// ==========================================
// DEMO ASSIGNMENTS (SUPABASE 'demo_assignments' TABLE)
// ==========================================

export async function getDemoAssignments(): Promise<DemoAssignment[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("demo_assignments")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && Array.isArray(data)) {
        data.forEach((row) => {
          const d = mapRowToDemo(row);
          memoryStore.demos.set(d.id, d);
        });
        return data.map(mapRowToDemo);
      }
    } catch (err: any) {
      console.warn("Supabase getDemoAssignments error:", err.message);
    }
  }
  assertFallbackAllowed();
  return Array.from(memoryStore.demos.values());
}

export async function createDemoAssignment(data: any): Promise<DemoAssignment> {
  const demoId = data.id || `DEMO-${String(1000 + memoryStore.demos.size + 1)}`;
  const newDemo: DemoAssignment = {
    id: demoId,
    requirementId: data.requirementId,
    tutorId: data.tutorId,
    tutorName: data.tutorName || "Assigned Tutor",
    studentName: data.studentName || "Student",
    parentName: data.parentName || "Parent",
    phone: data.phone || "",
    subjects: Array.isArray(data.subjects) ? data.subjects : [],
    classes: Array.isArray(data.classes) ? data.classes : [],
    demoDate: data.demoDate || new Date().toISOString().split("T")[0],
    demoTime: data.demoTime || "05:00 PM",
    demoLocation: data.demoLocation || "Student Residence, Ranchi",
    status: (data.status as DemoStatus) || "DEMO_SCHEDULED",
    parentFeedback: data.parentFeedback,
    tutorFeedback: data.tutorFeedback,
    coordinatorNotes: data.coordinatorNotes,
    finalDecision: data.finalDecision,
    createdAt: new Date().toISOString().split("T")[0],
    updatedAt: new Date().toISOString().split("T")[0],
  };

  memoryStore.demos.set(demoId, newDemo);

  // When demo is scheduled, auto-update requirement status
  if (data.requirementId) {
    updateTuitionRequirement(data.requirementId, {
      status: "Demo Scheduled",
      assignedTutorId: data.tutorId,
      assignedTutorName: data.tutorName,
    }).catch(() => {});
  }

  if (supabase) {
    try {
      const row = mapDemoToRow(newDemo);
      const { data: inserted, error } = await supabase
        .from("demo_assignments")
        .upsert(row, { onConflict: "id" })
        .select()
        .maybeSingle();

      if (!error && inserted) {
        return mapRowToDemo(inserted);
      }
    } catch (err: any) {
      console.warn("Supabase createDemoAssignment error:", err.message);
    }
  }

  return newDemo;
}

export async function updateDemoAssignment(id: string, data: any): Promise<DemoAssignment | null> {
  const existing = memoryStore.demos.get(id);
  const updated: DemoAssignment = {
    ...(existing || {
      id,
      requirementId: "",
      tutorId: "",
      tutorName: "",
      studentName: "",
      parentName: "",
      phone: "",
      subjects: [],
      classes: [],
      demoDate: "",
      demoTime: "",
      demoLocation: "",
      status: "DEMO_SCHEDULED",
      createdAt: "",
      updatedAt: "",
    }),
    ...data,
    id,
    updatedAt: new Date().toISOString().split("T")[0],
  };
  memoryStore.demos.set(id, updated);

  // If status is PARENT_APPROVED, update requirement to Filled / Tuition Started
  if (updated.status === "PARENT_APPROVED" && updated.requirementId) {
    updateTuitionRequirement(updated.requirementId, {
      status: "Tuition Started",
    }).catch(() => {});
  } else if (updated.status === "CANCELLED" && updated.requirementId) {
    updateTuitionRequirement(updated.requirementId, {
      status: "Searching",
    }).catch(() => {});
  }

  if (supabase) {
    try {
      const row = mapDemoToRow(updated);
      const { data: dbRow, error } = await supabase
        .from("demo_assignments")
        .update(row)
        .eq("id", id)
        .select()
        .maybeSingle();

      if (!error && dbRow) {
        return mapRowToDemo(dbRow);
      }
    } catch (err: any) {
      console.warn("Supabase updateDemoAssignment error:", err.message);
    }
  }

  assertFallbackAllowed();
  return updated;
}

export async function deleteDemoAssignment(id: string): Promise<boolean> {
  memoryStore.demos.delete(id);
  if (supabase) {
    const { error } = await supabase.from("demo_assignments").delete().eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    assertFallbackAllowed();
  }
  return true;
}

// ==========================================
// REVIEWS (SUPABASE 'reviews' TABLE)
// ==========================================

const mapRowToReview = (r: any): Review => ({
  id: r.id,
  parentName: r.parent_name,
  studentInfo: r.student_info,
  locality: r.locality,
  rating: Number(r.rating || 5),
  comment: r.comment,
  status: r.status,
  date: r.date,
});

/** Public callers get approved reviews only; coordinators can request everything. */
export async function getReviews(includeAll = false): Promise<Review[]> {
  if (supabase) {
    let q = supabase.from("reviews").select("*").order("created_at", { ascending: false });
    if (!includeAll) q = q.eq("status", "Approved");
    const { data, error } = await q;
    if (error) throw new Error(error.message);
    return (data || []).map(mapRowToReview);
  }
  assertFallbackAllowed();
  return includeAll ? memoryStore.reviews : memoryStore.reviews.filter((r) => r.status === "Approved");
}

/** `data` must already be validated/sanitized. The id is always generated here. */
export async function createReview(data: any, opts: { approved?: boolean } = {}): Promise<Review> {
  const review: Review = {
    id: `REV-${Date.now().toString(36).toUpperCase()}${crypto.randomBytes(2).toString("hex").toUpperCase()}`,
    parentName: data.parentName,
    studentInfo: data.studentInfo,
    locality: data.locality,
    rating: data.rating,
    comment: data.comment,
    status: opts.approved ? "Approved" : "Pending",
    date: new Date().toISOString().split("T")[0],
  };
  if (supabase) {
    const { error } = await supabase.from("reviews").insert({
      id: review.id,
      parent_name: review.parentName,
      student_info: review.studentInfo,
      locality: review.locality,
      rating: review.rating,
      comment: review.comment,
      status: review.status,
      date: review.date,
    });
    if (error) throw new Error(error.message);
  } else {
    assertFallbackAllowed();
    memoryStore.reviews.push(review);
  }
  return review;
}

export async function updateReview(id: string, data: Partial<Review>): Promise<Review | null> {
  const patch: any = {};
  if (data.parentName !== undefined) patch.parent_name = data.parentName;
  if (data.studentInfo !== undefined) patch.student_info = data.studentInfo;
  if (data.locality !== undefined) patch.locality = data.locality;
  if (data.rating !== undefined) patch.rating = data.rating;
  if (data.comment !== undefined) patch.comment = data.comment;
  if (data.status !== undefined) patch.status = data.status;
  if (supabase) {
    const { data: row, error } = await supabase.from("reviews").update(patch).eq("id", id).select().maybeSingle();
    if (error) throw new Error(error.message);
    return row ? mapRowToReview(row) : null;
  }
  assertFallbackAllowed();
  const idx = memoryStore.reviews.findIndex((r) => r.id === id);
  if (idx === -1) return null;
  memoryStore.reviews[idx] = { ...memoryStore.reviews[idx], ...data, id };
  return memoryStore.reviews[idx];
}

export async function deleteReview(id: string): Promise<boolean> {
  if (supabase) {
    const { error } = await supabase.from("reviews").delete().eq("id", id);
    if (error) throw new Error(error.message);
    return true;
  }
  assertFallbackAllowed();
  memoryStore.reviews = memoryStore.reviews.filter((r) => r.id !== id);
  return true;
}

// ==========================================
// SETTINGS (SUPABASE 'site_settings' TABLE)
// ==========================================

export async function getSiteSettings(): Promise<WebsiteSettings> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "main_config")
        .maybeSingle();

      if (!error && data?.value) {
        memoryStore.settings = { ...memoryStore.settings, ...data.value };
        return memoryStore.settings;
      }
    } catch {}
  }
  return memoryStore.settings;
}

export const getSettings = getSiteSettings;

export async function saveSiteSettings(settings: WebsiteSettings): Promise<WebsiteSettings> {
  memoryStore.settings = { ...memoryStore.settings, ...settings };
  if (supabase) {
    const { error } = await supabase.from("site_settings").upsert({
      key: "main_config",
      value: settings,
      updated_at: new Date().toISOString(),
    });
    if (error) throw new Error(error.message);
  } else {
    assertFallbackAllowed();
  }
  return memoryStore.settings;
}

export const updateSettings = saveSiteSettings;


// ==========================================
// SERVICES (stored as a JSON document in 'site_settings' under key 'services')
// ==========================================

export async function getServices(): Promise<any[] | null> {
  if (supabase) {
    const { data, error } = await supabase.from("site_settings").select("value").eq("key", "services").maybeSingle();
    if (error) throw new Error(error.message);
    return Array.isArray(data?.value) ? data!.value : null; // null => client keeps its defaults
  }
  assertFallbackAllowed();
  return null;
}

export async function saveServices(services: any[]): Promise<any[]> {
  if (supabase) {
    const { error } = await supabase
      .from("site_settings")
      .upsert({ key: "services", value: services, updated_at: new Date().toISOString() });
    if (error) throw new Error(error.message);
    return services;
  }
  assertFallbackAllowed();
  return services;
}
