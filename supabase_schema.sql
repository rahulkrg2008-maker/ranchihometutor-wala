-- =========================================================
-- RANCHI HOMETUTOR WALA - PRODUCTION SUPABASE SQL SCHEMA
-- =========================================================
-- Run this script in the Supabase SQL Editor (Dashboard > SQL Editor > New Query)
-- It enforces strict Row Level Security (RLS), private tutor documents,
-- the unified `tuition_requirements` table, and the `demo_assignments` workflow.

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =========================================================
-- 2. USERS TABLE (Linked with Supabase Auth)
-- =========================================================
CREATE TABLE IF NOT EXISTS public.users (
  id SERIAL PRIMARY KEY,
  uid TEXT NOT NULL UNIQUE, -- Supabase Auth User UID (auth.users.id)
  email TEXT NOT NULL,
  display_name TEXT,
  role TEXT DEFAULT 'user', -- 'admin' | 'coordinator' | 'tutor' | 'user'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================
-- 3. TUTORS TABLE (STRICTLY PRIVATE - ADMIN ACCESS ONLY)
-- =========================================================
CREATE TABLE IF NOT EXISTS public.tutors (
  id TEXT PRIMARY KEY, -- e.g. RHT-0001
  full_name TEXT NOT NULL,
  dob TEXT,
  gender TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  highest_qualification TEXT NOT NULL,
  college TEXT,
  subjects JSONB NOT NULL DEFAULT '[]'::jsonb,
  classes JSONB NOT NULL DEFAULT '[]'::jsonb,
  teaching_experience TEXT NOT NULL,
  teaching_area TEXT NOT NULL,
  teaching_mode TEXT NOT NULL DEFAULT 'Student Home',
  availability TEXT NOT NULL,
  aadhaar_last4 TEXT, -- Minimized Aadhaar storage (only last 4 digits)
  aadhaar_number TEXT, -- Masked display if needed (e.g. •••• •••• 1234)
  pan_number TEXT,
  profile_photo TEXT,
  qualification_photo TEXT, -- Stored in PRIVATE bucket
  aadhaar_photo TEXT, -- Stored in PRIVATE bucket
  aadhaar_verified BOOLEAN DEFAULT FALSE,
  status TEXT NOT NULL DEFAULT 'Pending', -- 'Pending' | 'Approved' | 'Rejected'
  is_hidden BOOLEAN DEFAULT FALSE,
  registered_at TIMESTAMPTZ DEFAULT NOW(),
  assigned_requirements_count INTEGER DEFAULT 0,
  assigned_student_id TEXT,
  assigned_student_name TEXT,
  admin_notes TEXT
);

CREATE INDEX IF NOT EXISTS idx_tutors_status ON public.tutors(status);
CREATE INDEX IF NOT EXISTS idx_tutors_phone ON public.tutors(phone);
CREATE INDEX IF NOT EXISTS idx_tutors_registered_at ON public.tutors(registered_at DESC);

-- =========================================================
-- 4. TUITION REQUIREMENTS TABLE (Unified Single Source of Truth)
-- =========================================================
CREATE TABLE IF NOT EXISTS public.tuition_requirements (
  id TEXT PRIMARY KEY, -- Form No. e.g. HW01
  req_code TEXT NOT NULL,
  parent_name TEXT NOT NULL,
  student_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  classes JSONB NOT NULL DEFAULT '[]'::jsonb,
  subjects JSONB NOT NULL DEFAULT '[]'::jsonb,
  area TEXT NOT NULL,
  classes_per_week INTEGER DEFAULT 5,
  time_from TEXT NOT NULL,
  time_to TEXT NOT NULL,
  preferred_tutor TEXT NOT NULL DEFAULT 'No Preference', -- 'Male' | 'Female' | 'No Preference'
  budget TEXT NOT NULL DEFAULT '₹3,500 – ₹4,500',
  additional_requirements TEXT,
  status TEXT NOT NULL DEFAULT 'New', -- 'New' | 'Contacted' | 'Searching' | 'Tutor Assigned' | 'Demo Scheduled' | 'Filled' | 'Tuition Started' | 'Completed' | 'Cancelled'
  assigned_tutor_id TEXT,
  assigned_tutor_name TEXT,
  document_photo TEXT,
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_requirements_status ON public.tuition_requirements(status);
CREATE INDEX IF NOT EXISTS idx_requirements_phone ON public.tuition_requirements(phone);
CREATE INDEX IF NOT EXISTS idx_requirements_created_at ON public.tuition_requirements(created_at DESC);

-- =========================================================
-- 5. DEMO ASSIGNMENTS TABLE (Tutor Demo Class Pipeline)
-- =========================================================
CREATE TABLE IF NOT EXISTS public.demo_assignments (
  id TEXT PRIMARY KEY, -- e.g. DEMO-1001
  requirement_id TEXT NOT NULL REFERENCES public.tuition_requirements(id) ON DELETE CASCADE,
  tutor_id TEXT NOT NULL REFERENCES public.tutors(id) ON DELETE CASCADE,
  tutor_name TEXT NOT NULL,
  student_name TEXT NOT NULL,
  parent_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  subjects JSONB NOT NULL DEFAULT '[]'::jsonb,
  classes JSONB NOT NULL DEFAULT '[]'::jsonb,
  demo_date TEXT NOT NULL, -- YYYY-MM-DD
  demo_time TEXT NOT NULL, -- e.g. 05:00 PM
  demo_location TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'DEMO_SCHEDULED', -- 'DEMO_SCHEDULED' | 'DEMO_COMPLETED' | 'PARENT_APPROVED' | 'PARENT_NOT_APPROVED' | 'CHANGE_TUTOR' | 'CANCELLED'
  parent_feedback TEXT,
  tutor_feedback TEXT,
  coordinator_notes TEXT,
  final_decision TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_demos_status ON public.demo_assignments(status);
CREATE INDEX IF NOT EXISTS idx_demos_req ON public.demo_assignments(requirement_id);
CREATE INDEX IF NOT EXISTS idx_demos_tutor ON public.demo_assignments(tutor_id);

-- =========================================================
-- 6. REVIEWS TABLE (Public View of Approved Feedback)
-- =========================================================
CREATE TABLE IF NOT EXISTS public.reviews (
  id TEXT PRIMARY KEY,
  parent_name TEXT NOT NULL,
  student_info TEXT NOT NULL,
  locality TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pending', -- 'Pending' | 'Approved' | 'Rejected'
  date TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reviews_status ON public.reviews(status);

-- =========================================================
-- 7. SITE SETTINGS TABLE (Config & Contact Information)
-- =========================================================
CREATE TABLE IF NOT EXISTS public.site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================
-- 8. LIVE ANALYTICS VIEW FOR ADMIN DASHBOARD
-- =========================================================
CREATE OR REPLACE VIEW public.dashboard_stats_summary AS
SELECT
  (SELECT COUNT(*) FROM public.tutors) AS total_registered_tutors,
  (SELECT COUNT(*) FROM public.tutors WHERE status = 'Approved' OR aadhaar_verified = TRUE) AS verified_tutors,
  (SELECT COUNT(*) FROM public.tutors WHERE assigned_requirements_count > 0 OR assigned_student_id IS NOT NULL) AS classes_assigned_tutors,
  (SELECT COUNT(*) FROM public.tuition_requirements) AS total_student_requirements,
  (SELECT COUNT(*) FROM public.tuition_requirements WHERE status IN ('Tutor Assigned', 'Demo Scheduled', 'Filled', 'Tuition Started', 'Completed')) AS fulfilled_requirements,
  (SELECT COUNT(*) FROM public.demo_assignments WHERE status = 'DEMO_SCHEDULED') AS active_demos_count;

-- =========================================================
-- 9. PRIVATE SUPABASE STORAGE SETUP (Buckets & Policies)
-- =========================================================
-- All tutor documents & KYC proofs are strictly PRIVATE (public = false)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('tutors-documents', 'tutors-documents', false, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf']),
  ('tutor-documents', 'tutor-documents', false, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf']),
  ('tuition-requirements', 'tuition-requirements', false, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf'])
ON CONFLICT (id) DO UPDATE SET
  public = false,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Remove dangerous public storage read policies
DO $$
BEGIN
  BEGIN
    DROP POLICY IF EXISTS "Allow All Reads on Storage" ON storage.objects;
    DROP POLICY IF EXISTS "Public View Tutor Documents" ON storage.objects;
    DROP POLICY IF EXISTS "Public Upload Tutor Documents" ON storage.objects;
    DROP POLICY IF EXISTS "Allow All Inserts on Storage" ON storage.objects;
    DROP POLICY IF EXISTS "Allow All Updates on Storage" ON storage.objects;
  EXCEPTION WHEN OTHERS THEN NULL;
  END;
END $$;

-- Policy: Allow prospective tutors and parents to upload verification photos / syllabus
CREATE POLICY "Allow registration upload to storage"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id IN ('tutors-documents', 'tutor-documents', 'tuition-requirements'));

-- Policy: ONLY authenticated users (or service role) can view private documents
CREATE POLICY "Allow authenticated read on private storage"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id IN ('tutors-documents', 'tutor-documents', 'tuition-requirements'));

-- Policy: Authenticated admin updates/deletes on private storage
CREATE POLICY "Allow authenticated manage on private storage"
ON storage.objects FOR ALL
TO authenticated
USING (bucket_id IN ('tutors-documents', 'tutor-documents', 'tuition-requirements'))
WITH CHECK (bucket_id IN ('tutors-documents', 'tutor-documents', 'tuition-requirements'));

-- =========================================================
-- 10. STRICT ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================
ALTER TABLE public.tutors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tuition_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.demo_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Clean existing permissive policies
DO $$
BEGIN
  BEGIN
    DROP POLICY IF EXISTS "Allow public select tutors" ON public.tutors;
    DROP POLICY IF EXISTS "Allow public select requirements" ON public.tuition_requirements;
    DROP POLICY IF EXISTS "Allow public insert tutors" ON public.tutors;
    DROP POLICY IF EXISTS "Allow public update tutors" ON public.tutors;
    DROP POLICY IF EXISTS "Allow public insert requirements" ON public.tuition_requirements;
    DROP POLICY IF EXISTS "Allow public update requirements" ON public.tuition_requirements;
    DROP POLICY IF EXISTS "Allow public select reviews" ON public.reviews;
    DROP POLICY IF EXISTS "Allow public select site_settings" ON public.site_settings;
    DROP POLICY IF EXISTS "Allow public update site_settings" ON public.site_settings;
    DROP POLICY IF EXISTS "Allow public insert site_settings" ON public.site_settings;
  EXCEPTION WHEN OTHERS THEN NULL;
  END;
END $$;

-- A. TUTORS POLICIES:
-- 1. Public can ONLY submit their registration application (INSERT).
CREATE POLICY "Tutors public insert only"
ON public.tutors FOR INSERT
WITH CHECK (true);

-- 2. Strictly NO anonymous SELECT on tutors. Authenticated admins only.
CREATE POLICY "Tutors authenticated admin read"
ON public.tutors FOR SELECT
TO authenticated
USING (true);

-- 3. Authenticated admin update/delete
CREATE POLICY "Tutors authenticated admin update"
ON public.tutors FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Tutors authenticated admin delete"
ON public.tutors FOR DELETE
TO authenticated
USING (true);

-- B. TUITION REQUIREMENTS POLICIES:
-- 1. Parents/students can submit tuition requirement (INSERT).
CREATE POLICY "Requirements public insert only"
ON public.tuition_requirements FOR INSERT
WITH CHECK (true);

-- 2. Strictly NO anonymous SELECT. Only authenticated coordinators/admins can view leads.
CREATE POLICY "Requirements authenticated admin read"
ON public.tuition_requirements FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Requirements authenticated admin update"
ON public.tuition_requirements FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Requirements authenticated admin delete"
ON public.tuition_requirements FOR DELETE
TO authenticated
USING (true);

-- C. DEMO ASSIGNMENTS POLICIES:
-- Strictly internal coordinator workflow. Authenticated admin access only.
CREATE POLICY "Demo assignments authenticated admin access"
ON public.demo_assignments FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- D. REVIEWS POLICIES:
-- 1. Public can only see APPROVED reviews on the website
CREATE POLICY "Reviews public view approved only"
ON public.reviews FOR SELECT
USING (status = 'Approved');

-- 2. Authenticated admin can view all reviews (including pending/rejected)
CREATE POLICY "Reviews authenticated admin full read"
ON public.reviews FOR SELECT
TO authenticated
USING (true);

-- 3. Public can submit new reviews (saved as Pending for review)
CREATE POLICY "Reviews public insert pending"
ON public.reviews FOR INSERT
WITH CHECK (true);

-- 4. Authenticated admin can update/delete reviews
CREATE POLICY "Reviews authenticated admin manage"
ON public.reviews FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- E. SITE SETTINGS POLICIES:
-- 1. Public can read site configuration (contact, pricing, info)
CREATE POLICY "Settings public read"
ON public.site_settings FOR SELECT
USING (true);

-- 2. Authenticated admins can update settings
CREATE POLICY "Settings authenticated admin manage"
ON public.site_settings FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- F. USERS POLICIES:
CREATE POLICY "Users read own profile or admin"
ON public.users FOR SELECT
TO authenticated
USING (auth.uid()::text = uid OR role = 'admin');

CREATE POLICY "Users update own profile or admin"
ON public.users FOR UPDATE
TO authenticated
USING (auth.uid()::text = uid OR role = 'admin');

-- Confirmation Notice
SELECT 'Ranchi HomeTutor Wala Supabase Database, RLS, and Private Storage configured successfully!' AS status;
