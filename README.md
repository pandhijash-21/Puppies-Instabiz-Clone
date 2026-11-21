# TeddyPups U.A.E. — BluTec technical clone

Production-oriented clone of [puppy.instabizweb.com](https://puppy.instabizweb.com/) with a Supabase-backed CMS and protected admin.

## Stack

- **Next.js 16.4.6** (App Router) + React 19 + TypeScript
- **Tailwind CSS 4** with reference design tokens (milk / cocoa / toffee / honey)
- **Framer Motion** + **Lenis 1.3.26** smooth scroll
- **Lucide React** icons
- **Supabase** PostgreSQL, Auth, Storage
- Deploy target: **Vercel**

Without Supabase env vars the public site and admin UI still run on **local demo data** (verified reference listings). Connect Supabase for persistent CMS writes.

## Quick start

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Admin: [http://localhost:3000/admin/login](http://localhost:3000/admin/login).

## Supabase setup

1. Create a Supabase project.
2. In the SQL editor, run [`supabase/migrations/20260320120000_init.sql`](supabase/migrations/20260320120000_init.sql).
3. Copy project URL, anon key, and service role key into `.env.local`.
4. Seed content + admin user:

```bash
npm run db:seed
```

Default admin (override via env):

- Email: `admin@teddypups.local`
- Password: `ChangeMe123!`

5. Confirm Storage buckets `puppies`, `families`, and `media` exist (created by the migration).

## Environment

See [`.env.example`](.env.example).

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` / `SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` / `SUPABASE_PUBLISHABLE_KEY` | Public publishable key (RLS enforced) |
| `SUPABASE_SECRET_KEY` | Server-only seed/uploads — never expose to the browser |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | E.164 digits for `wa.me` links |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Seed admin credentials |

## Routes

### Public

| Path | Description |
|------|-------------|
| `/` | Home |
| `/puppies` | Available listings + filters |
| `/gone-home` | Adopted archive |
| `/puppies/[slug]` | Detail, gallery, WhatsApp, enquiry |
| `/happy-families` | Stories + lightbox |
| `/how-it-works` | Process + `#delivery` |
| `/faq` | FAQ accordion |
| `/contact` | Letter enquiry form + visit info |

### Admin

| Path | Description |
|------|-------------|
| `/admin/login` | Supabase Auth (or demo bypass) |
| `/admin/dashboard` | Counts + recent enquiries |
| `/admin/puppies` | CRUD + media upload |
| `/admin/families` | Stories + photos |
| `/admin/reviews` | Approve / reject / home visibility |
| `/admin/enquiries` | Status pipeline + notes |
| `/admin/faqs` | CRUD + ordering |
| `/admin/media` | Shared media bucket |

## Architecture notes (interview-ready)

- **Public data**: Server Components → `lib/db/*` → Supabase (falls back to `content/demo-data.ts`).
- **Enquiries**: `POST /api/enquiries` with Zod + honeypot field `website`.
- **WhatsApp**: `lib/whatsapp.ts` builds puppy-specific prefilled links — no cart/payments.
- **Auth**: Supabase email/password; authorization via `admins` table + `is_admin()` RLS helper (not `user_metadata`).
- **Uploads**: MIME/size checks in server actions; Storage writes via service role on the server only.
- **Design**: Fraunces (`font-plush`), Figtree, Shantell Sans (`font-scrawl`); colours match live CSS tokens.

## Deploy on Vercel

1. Push the repo and import into Vercel.
2. Add the same env vars as `.env.local` (including `SUPABASE_SECRET_KEY` for admin uploads).
3. Deploy. Run the SQL migration + `npm run db:seed` against the production Supabase project once.

```bash
npm run build
```

## Project layout

```text
app/(public)/          Public pages
app/admin/             Admin login + protected CMS
app/api/enquiries/     Enquiry intake
components/            UI, layout, forms, admin
content/               Static marketing copy + demo seed data
lib/db/                Centralised queries
lib/supabase/          Browser / server / service clients
supabase/migrations/   Schema, RLS, storage policies
supabase/seed.ts       Admin + content seed
```

## Quality checklist

- [x] Responsive public pages matching reference structure/copy
- [x] Dynamic puppies, FAQs, families, reviews
- [x] WhatsApp + form enquiries with admin tracking
- [x] Protected admin CRUD
- [x] RLS + no service role in client bundles
- [x] SEO metadata, sitemap, robots
- [x] Loading / empty / not-found states
