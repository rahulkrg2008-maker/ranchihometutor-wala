# Ranchi HomeTutor Wala

Home-tuition matching site for Ranchi: parents post requirements, tutors register with
KYC documents, and coordinators manage matching, demo classes, reviews and site content.

**Stack:** React 19 + Vite + Tailwind 4 (frontend), Express API (`src/serverApp.ts`),
Supabase (Postgres + private storage). Deployed on Vercel (`api/index.ts`) or run as a Node server (`server.ts`).

## Run locally
```bash
npm install
cp .env.example .env     # fill in values
npm run dev              # http://localhost:3000   (admin: /admin)
```
Without Supabase credentials, local dev uses in-memory seed data. In production
(`NODE_ENV=production`) the API refuses to run without a database instead of faking data.

## Database
Run `supabase_schema.sql` in the Supabase SQL editor. Buckets `tutors-documents` and
`tuition-requirements` must be **private**.

## Environment variables
See `.env.example`. `SESSION_SECRET` is mandatory in production.

## Security notes
- Admin sessions are signed, stateless 24-hour tokens (work on serverless).
- Public submissions are validated and whitelisted server-side; status/IDs are server-controlled.
- Uploads accept JPG/PNG/WebP/PDF ≤ 5 MB, verified by file signature, and are served only through the admin-only `/api/storage/file`.
- Rate limits are per-instance (best effort). For strong limits add Vercel Firewall / Cloudflare rules.
