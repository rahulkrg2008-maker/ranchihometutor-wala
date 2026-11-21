-- Run ONCE in the Supabase SQL editor (after supabase_schema.sql).
-- The website never talks to Supabase from the browser: only the Express API does, with the
-- SERVICE ROLE key, which bypasses RLS. So no anon/authenticated policy should exist at all.
-- This removes every policy that would let someone holding the anon key (or any
-- self-registered Supabase user) read or write your data directly.

DO $$
DECLARE r record;
BEGIN
  FOR r IN
    SELECT schemaname, tablename, policyname FROM pg_policies
    WHERE (schemaname = 'public' AND tablename IN
             ('tutors','tuition_requirements','demo_assignments','reviews','site_settings','users'))
       OR (schemaname = 'storage' AND tablename = 'objects'
           AND policyname IN ('Allow registration upload to storage',
                              'Allow authenticated read on private storage',
                              'Allow authenticated manage on private storage'))
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', r.policyname, r.schemaname, r.tablename);
  END LOOP;
END $$;

-- RLS stays ENABLED with zero policies = deny everything except the service role.
ALTER TABLE public.tutors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tuition_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.demo_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- The stats view must not run with the creator's privileges for API roles
ALTER VIEW public.dashboard_stats_summary SET (security_invoker = true);
REVOKE ALL ON public.dashboard_stats_summary FROM anon, authenticated;

-- Also in the Supabase dashboard: Authentication > Providers > Email > turn OFF "Allow new users to sign up".

-- ---------------------------------------------------------------------------
-- Permissions: only the server (service_role) may use these tables.
-- Needed when "Automatically expose new tables" is switched OFF in project settings.
-- ---------------------------------------------------------------------------
GRANT USAGE ON SCHEMA public TO service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM anon, authenticated;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM anon, authenticated;
