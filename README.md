# TeddyPups U.A.E. — BluTec technical clone

A production-oriented visual and functional clone of the live TeddyPups marketing site ([puppy.instabizweb.com](https://puppy.instabizweb.com/)), built as a Next.js App Router application with a Supabase-backed CMS, WhatsApp-first enquiry flow, and a protected admin console.

---

## Live site

> **Add your Netlify URL here once deployed:**

```text
LIVE_URL=
# Example: https://teddypups-bluetec.netlify.app
```

| Environment | URL |
|-------------|-----|
| **Production (Netlify)** | _← paste live link above / here_ |
| **Local development** | [http://localhost:3000](http://localhost:3000) |
| **Reference (original)** | [https://puppy.instabizweb.com](https://puppy.instabizweb.com/) |

---

## What this project is

TeddyPups is a Dubai-based teacup / miniature puppy brand. This repo recreates:

1. **Public marketing experience** — storybook-style pages, scroll motion, Meet-the-pups doors, puppy detail “chapters”, FAQ corkboard, happy-families wall, how-it-works paths, contact letter form.
2. **CMS / admin** — manage puppies, media, families, reviews, FAQs, and enquiries.
3. **Lead capture** — WhatsApp deep links (no cart / payments) + enquiry forms stored in Postgres.

Without a configured Supabase project the site still runs on **local demo data** so design and admin UI can be reviewed immediately.

---

## Tech stack (everything we used)

### Core application

| Technology | Version (approx.) | Role |
|------------|-------------------|------|
| **Next.js** | `16.4.6` | App Router, Server Components, Route Handlers, middleware, metadata / sitemap / robots |
| **React** | `19.3.0` | UI |
| **React DOM** | `19.3.0` | Rendering |
| **TypeScript** | `^5` | Typed app + lib layer |
| **Node.js** | 20+ recommended | Local scripts (`tsx` seed) and Netlify / Node runtime |

### Styling & design system

| Technology | Role |
|------------|------|
| **Tailwind CSS 4** (`4.3.3`) + `@tailwindcss/turbopack` | Utility styling, design tokens |
| **Custom CSS** (`app/globals.css`, `puppies.css`, `families.css`, `curtain.css`) | Storybook ribbons, trails, letter forms, header scallop, meet doors, FAQ corkboard, etc. |
| **Google Fonts via `next/font`** | **Fraunces** (`font-plush` headings), **Figtree** (body / UI), **Shantell Sans** (`font-scrawl` chapter labels) |
| **Design tokens** | Milk `#fffdf8`, cocoa `#2a170e`, toffee / honey / blush / sky / WhatsApp green — mirrored from the reference site |

### Motion & interaction

| Technology | Role |
|------------|------|
| **Framer Motion** (`^14`) | Route curtain, scroll buddy, doors, micro-interactions; drives Lenis RAF |
| **Lenis** (`1.3.26`) | Smooth scrolling (`LenisProvider`, `autoRaf: false`, synced to Motion’s frame loop) |
| **Lucide React** | Admin / UI icons (menu, eye, etc.) |

### Backend / data

| Technology | Role |
|------------|------|
| **Supabase PostgreSQL** | Primary data store |
| **Supabase Auth** | Email/password admin login |
| **Supabase Storage** | Public buckets: `puppies`, `families`, `media` |
| **`@supabase/supabase-js`** + **`@supabase/ssr`** | Browser client, server client, cookie session middleware |
| **Zod** (`^4`) | Enquiry / puppy / FAQ validation |
| **`server-only`** | Guard server modules from client bundling |
| **`date-fns`** | Date formatting in admin / content |

### Security helpers

| Piece | Role |
|-------|------|
| **Admin login challenge + hybrid encryption** (`lib/crypto/admin-login-*`) | Optional RSA private key encrypts login payload; challenge endpoint issues ephemeral material |
| **RLS + `is_admin()`** | DB authorization — **not** editable `user_metadata` |
| **Honeypot field `website`** | Spam trap on enquiry POSTs |
| **Middleware** (`middleware.ts` → `lib/supabase/middleware.ts`) | Gates `/admin/*` when Supabase is configured |

### Tooling

| Tool | Role |
|------|------|
| **ESLint** + `eslint-config-next` | Lint |
| **tsx** + **dotenv** | `npm run db:seed` against `.env.local` |
| **Netlify** | Intended production host (static/SSR via Next runtime) |

---

## Admin access

### URLs

| Page | Path |
|------|------|
| Login | `/admin/login` |
| Dashboard (after login) | `/admin/dashboard` |

Local: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

### Default credentials (from seed / `.env.example`)

These are created by `npm run db:seed` using `ADMIN_*` env vars (defaults shown):

| Field | Default value |
|-------|----------------|
| **Email** | `admin@teddypups.local` |
| **Password** | `ChangeMe123!` |
| **Display name** | `TeddyPups Admin` |

Override in `.env.local` before seeding:

```env
ADMIN_EMAIL=admin@teddypups.local
ADMIN_PASSWORD=ChangeMe123!
ADMIN_DISPLAY_NAME=TeddyPups Admin
```

> **Important:** Change the password for any shared or production Supabase project. Do not commit real passwords. `.env.local` is gitignored.

### How admin auth works

1. User submits email/password on `/admin/login`.
2. Client may encrypt credentials via challenge (`/api/admin/login/challenge` + `/api/admin/login`) using the optional admin-login private key (ephemeral key pair if unset in local).
3. Server calls Supabase `signInWithPassword`.
4. Server checks row in `public.admins` for `auth_user_id`.
5. If no admin row → sign out + `unauthorized`.
6. Middleware refreshes the session and re-checks admin membership on `/admin/*`.

### Demo mode (no Supabase)

If Supabase is not configured, `requireAdmin()` returns a **demo admin**. Pages render with demo data; mutations that need the database will fail until env + seed are configured.

---

## Quick start (local)

### Prerequisites

- Node.js **20+**
- npm (comes with Node)
- Optional: a [Supabase](https://supabase.com) project for persistent CMS data

### 1. Install

```bash
npm install
```

### 2. Environment file

```bash
cp .env.example .env.local
```

Edit `.env.local` (see [Environment variables](#environment-variables) below).

### 3. Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

| Script | Purpose |
|--------|---------|
| `npm run dev` | Next.js development server |
| `npm run build` | Production build |
| `npm start` | Serve production build |
| `npm run lint` | ESLint |
| `npm run db:seed` | Seed admin + demo CMS rows into Supabase |

---

## Supabase setup (full CMS)

1. Create a Supabase project.
2. Open **SQL Editor** and run the full migration:

   [`supabase/migrations/20260320120000_init.sql`](supabase/migrations/20260320120000_init.sql)

   This creates enums, tables, RLS policies, `is_admin()`, and storage buckets.

3. Copy your project credentials from the Supabase dashboard into `.env.local` (see `.env.example` for the required variable names — never commit real secrets).

4. Seed admin user + sample content:

```bash
npm run db:seed
```

5. Confirm Storage buckets exist: **`puppies`**, **`families`**, **`media`** (migration inserts them).

6. Log in at `/admin/login` with the seeded credentials.

---

## Environment variables

Use [`.env.example`](.env.example) as the template. Copy it to `.env.local` locally, and set the same names in Netlify for production.

Do **not** paste real Supabase credentials or other secrets into this README or into git.

High-level groups (names only in `.env.example`):

| Group | Purpose |
|-------|---------|
| **Supabase** | Project connection for the public site, admin, and uploads |
| **Site / WhatsApp / contact / social** | Public contact details and canonical `SITE_URL` |
| **Admin seed** | Email/password used only by `npm run db:seed` |
| **Admin login crypto** | Optional RSA private key for encrypted admin login (see comments in `.env.example`) |

---

## Routes map

### Public (`app/(public)/`)

| Path | Description |
|------|-------------|
| `/` | Home — hero quilt, Meet pups doors, journey, families peek, FAQ night, CTAs, scroll buddy |
| `/puppies` | Available listings + filter chips |
| `/gone-home` | Adopted / archive listings |
| `/puppies/[slug]` | Storybook detail: gallery, tag board, comes-with, way-home trail, enquiry, prev/next, **left brown scroll ribbon** |
| `/happy-families` | Family stories + mosaic / lightbox |
| `/how-it-works` | Local vs imported paths + delivery section (`#delivery`) |
| `/faq` | Corkboard FAQ UI |
| `/contact` | Letter-style enquiry + visit shopfront |

Also: `app/sitemap.ts`, `app/robots.ts`, loading / not-found under the public group.

### Admin

| Path | Description |
|------|-------------|
| `/admin/login` | Auth form (show/hide password) |
| `/admin/dashboard` | Counts + recent enquiries |
| `/admin/puppies` | List / create / edit + media |
| `/admin/puppies/new` | Create puppy |
| `/admin/puppies/[id]/edit` | Edit puppy |
| `/admin/families` | Family stories + photos |
| `/admin/reviews` | Approve / reject / show on home |
| `/admin/enquiries` | Status pipeline + notes |
| `/admin/faqs` | FAQ CRUD + ordering |
| `/admin/media` | Shared media library |

### API

| Path | Description |
|------|-------------|
| `POST /api/enquiries` | Public enquiry intake (Zod + honeypot) |
| `GET /api/admin/login/challenge` | Login crypto challenge |
| `POST /api/admin/login` | Complete admin sign-in |

---

## Project structure

```text
.
├── AGENTS.md                 # Next.js agent notes (local tooling)
├── README.md                 # This file
├── docs/
│   └── INTERVIEW.md          # Short interview / demo talking points
├── .env.example              # Env template (safe to commit)
├── .env.local                # Secrets (gitignored) — create locally
├── package.json
├── next.config.ts
├── middleware.ts             # Matches /admin/* → session + admin gate
│
├── app/
│   ├── layout.tsx            # Root: fonts, Lenis, RouteCurtain, CSS imports
│   ├── globals.css           # Tokens, header, letters, boards, shared chrome
│   ├── puppies.css           # Puppy list + storybook ribbon / trail / chapter
│   ├── families.css          # Families wall styles
│   ├── curtain.css           # Route transition curtain
│   ├── sitemap.ts / robots.ts
│   ├── (public)/             # Marketing site (header/footer layout)
│   │   ├── page.tsx          # Home
│   │   ├── puppies/…         # List + [slug] storybook
│   │   ├── happy-families/
│   │   ├── how-it-works/
│   │   ├── faq/
│   │   ├── contact/
│   │   └── gone-home/
│   ├── admin/
│   │   ├── login/
│   │   ├── actions.ts        # Server actions (CRUD / uploads)
│   │   └── (protected)/      # Dashboard, puppies, families, …
│   └── api/
│       ├── enquiries/
│       └── admin/login/…
│
├── components/
│   ├── admin/                # AdminShell, LoginForm, PuppyForm, …
│   ├── brand/                # TeddyFace, WalkingPuppy
│   ├── contact/              # VisitShopfront
│   ├── families/             # FamilyWall, FamilyMosaic
│   ├── faq/                  # FaqBoard, FaqRoomPaint
│   ├── forms/                # EnquiryForm (letter + puppy modes)
│   ├── home/                 # HeroGallery, MeetPupsDoors, HomeScrollBuddy, …
│   ├── how-it-works/         # TwoWaysHome, DeliverySection
│   ├── layout/               # SiteHeader, SiteFooter, LenisProvider, RouteCurtain, …
│   ├── puppies/              # PuppyCard, FilterChips, MediaGallery, PuppyRibbon
│   └── ui/                   # Button / ButtonLink
│
├── content/
│   ├── static.ts             # Nav, comes-with, home steps, marketing copy
│   └── demo-data.ts          # Offline fallback listings when Supabase unset
│
├── lib/
│   ├── config.ts             # Site config + hasSupabaseEnv()
│   ├── types.ts              # Shared TypeScript models
│   ├── whatsapp.ts           # wa.me builders
│   ├── auth/admin.ts         # requireAdmin()
│   ├── crypto/               # Encrypted admin login helpers
│   ├── db/                   # Server queries (puppies, faqs, …) + demo fallback
│   ├── supabase/             # client / server / admin / middleware / env
│   ├── validations/          # Zod schemas
│   └── utils/                # cn, format, puppy-media
│
├── public/
│   └── brand/                # Logo and static brand assets
│
└── supabase/
    ├── migrations/
    │   └── 20260320120000_init.sql
    └── seed.ts               # Creates admin user + seeds CMS rows
```

---

## Database model (high level)

Defined in the init migration:

| Table | Purpose |
|-------|---------|
| `admins` | Maps `auth.users` → allowed CMS operators |
| `puppies` | Listings (slug, breed, gender, availability, publish status, …) |
| `puppy_images` | Gallery images/videos per puppy |
| `families` | Happy-family stories |
| `family_images` | Photos for stories |
| `reviews` | Testimonials (pending / approved / rejected, optional home spotlight) |
| `enquiries` | Lead pipeline (`new` → `contacted` → …) |
| `faqs` | FAQ entries + sort order |

**Enums** include puppy gender/location/availability, publish status, enquiry status/source, review status.

**Storage buckets:** `puppies`, `families`, `media` — public read; write gated by `is_admin()`.

**RLS pattern:** public read for published content; public **insert** on `enquiries` only; all mutations for CMS tables require `is_admin()`.

---

## Architecture (how it was made)

### Data flow

```text
Browser
  → Server Components / Route Handlers
    → lib/db/*  (central queries)
      → Supabase (when env present)
      → else content/demo-data.ts
```

- **Marketing chrome** (journey copy, comes-with checklist, way-home steps) lives in `content/static.ts`.
- **CMS entities** (puppies, FAQs, families, reviews, enquiries) live in Supabase when configured.
- **WhatsApp** is the conversion path — `lib/whatsapp.ts` builds puppy-specific prefilled messages. There is **no cart or payment** flow.

### Rendering & UX patterns

- **App Router** with `(public)` and `admin` route groups.
- **Lenis + Framer Motion** for smooth scroll and character motion (home scroll buddy, meet doors, route curtain).
- **Puppy detail “storybook”**: chapter markers, sticky tag board, paper checklist, paw trail, letter enquiry, and a left **brown ribbon** whose band `scaleY`s with scroll (`PuppyRibbon`).
- **Design fidelity**: tokens, scalloped header hem, Fraunces / Figtree / Shantell, cocoa borders, honey accents — matched to the reference.

### Admin mutations

- Server Actions in `app/admin/actions.ts` (+ forms under `components/admin`).
- Uploads validated (MIME / size) and written with a **server-only** privileged Supabase client.
- Privileged credentials never ship to the browser.

### Enquiry intake

1. Public form (`EnquiryForm` letter mode on contact, puppy mode on detail).
2. `POST /api/enquiries` validates with Zod, rejects honeypot `website` fills.
3. Row inserted into `enquiries` (RLS allows public insert).
4. Admin updates status / notes in `/admin/enquiries`.

---

## Deploy on Netlify

### Checklist

1. Push this repo to GitHub / GitLab / Bitbucket.
2. In Netlify: **Add new site → Import from Git**.
3. Build settings (Next.js):

   | Setting | Value |
   |---------|--------|
   | Build command | `npm run build` |
   | Publish directory | Leave default for Next runtime / `@netlify/plugin-nextjs` |
   | Node version | `20` (set in Netlify env or `.nvmrc` if you add one) |

4. Install / enable the **Official Next.js runtime** (Netlify Next plugin) so App Router SSR / middleware work.
5. Add **environment variables** in Netlify → Site configuration → Environment variables — mirror what you use in `.env.local` (Supabase, WhatsApp, contact, site URL). Mark secrets as secret. Prefer not to put seed-only admin passwords on Netlify.
6. After first deploy, set the public site URL env var to your Netlify domain and **redeploy** (public env vars are baked in at build time).
7. Point Supabase Auth **Site URL** / redirect allow-list at your Netlify domain if using auth redirects.
8. Run the SQL migration + `npm run db:seed` once against the **production** Supabase project from a trusted machine (credentials stay in local env — not committed).
9. Paste the live URL into the [Live site](#live-site) section at the top of this README.

### After go-live

```text
LIVE_URL=https://YOUR-SITE.netlify.app
```

Also set:

```env
NEXT_PUBLIC_SITE_URL=https://YOUR-SITE.netlify.app
```

---

## Security notes (read before sharing)

- Never commit `.env.local` or any privileged Supabase / crypto secrets.
- Authorization = `admins` table + RLS `is_admin()`, not client-editable metadata.
- Privileged Supabase access is server-only (`lib/supabase/admin.ts`, seed, uploads).
- Enquiry API: Zod validation + honeypot; no open admin APIs without session.
- Change the default admin password after first seed on any shared project.
- Optional: configure a stable admin-login private key in production (see `.env.example`).

---

## Quality / feature checklist

- [x] Responsive public pages matching reference structure & visual language
- [x] Dynamic puppies, FAQs, families, reviews (Supabase or demo fallback)
- [x] Puppy storybook detail + scroll ribbon
- [x] WhatsApp CTAs + form enquiries with admin tracking
- [x] Protected admin CRUD (puppies, media, families, reviews, FAQs, enquiries)
- [x] RLS + privileged Supabase credentials never in client bundles
- [x] SEO metadata, sitemap, robots
- [x] Loading / empty / not-found states
- [x] Route curtain + Lenis smooth scroll
- [ ] Netlify production URL filled in this README _(your step)_

---

## Related docs

- [`docs/INTERVIEW.md`](docs/INTERVIEW.md) — short demo script and decision talking points
- [`.env.example`](.env.example) — full environment template
- [`supabase/migrations/20260320120000_init.sql`](supabase/migrations/20260320120000_init.sql) — schema source of truth

---

## License / ownership

Private BluTec clone project for TeddyPups U.A.E. Brand assets and copy are for the client deployment; do not republish as a public template without permission.
