# Interview walkthrough notes

## What we built

A visual clone of TeddyPups U.A.E. plus a real CMS: Supabase Postgres/Auth/Storage, enquiry intake, WhatsApp deep links, and a protected admin.

## Decisions you can explain

1. **Next.js 16.4.6** — matches the reference’s 16.4.x family; we used the latest patch, not a downgrade.
2. **Demo-data fallback** — `lib/db/*` queries Supabase when env is set; otherwise serves `content/demo-data.ts` so the site is demoable before a project is wired.
3. **Admins table + RLS `is_admin()`** — authorization is not taken from editable `user_metadata`.
4. **Service role only on the server** — seed script and upload helpers; anon key + RLS for the browser.
5. **No cart/payments** — business model is WhatsApp/enquiry concierge; forms write `enquiries` with status pipeline.
6. **Lenis 1.3.26 pinned** — driven from Framer Motion’s frame loop (`autoRaf: false`) for synced animation timing.
7. **Marketing chrome in code, CMS entities in DB** — FAQs/puppies/families/reviews are editable; journey/trust copy is static verified content.

## Demo script (5 minutes)

1. Home → scroll scenes, Meet the pups, WhatsApp CTA.
2. `/puppies` → filter chips → open Max → gallery + “Ask on WhatsApp” + enquiry form.
3. Submit enquiry → `/admin/login` (demo mode or seeded admin) → Enquiries → change status/notes.
4. Dashboard counts + FAQ/Families CRUD briefly.
5. Mention migration file + `npm run db:seed` for Supabase.

## Security talking points

- Public insert on `enquiries` only; honeypot `website` field.
- Upload MIME/size limits in server actions.
- Middleware gates `/admin/*` when Supabase is configured.
- `.env.example` documents keys; service role never prefixed with `NEXT_PUBLIC_`.
