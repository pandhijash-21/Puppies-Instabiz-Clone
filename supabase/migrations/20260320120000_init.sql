-- TeddyPups schema: tables, indexes, RLS, storage buckets

create extension if not exists "pgcrypto";

-- Enums
do $$ begin
  create type puppy_gender as enum ('boy', 'girl', 'boy_and_girl');
exception when duplicate_object then null; end $$;

do $$ begin
  create type puppy_location_type as enum ('dubai_showroom', 'imported');
exception when duplicate_object then null; end $$;

do $$ begin
  create type puppy_availability as enum ('available', 'gone_home');
exception when duplicate_object then null; end $$;

do $$ begin
  create type publish_status as enum ('draft', 'published', 'archived');
exception when duplicate_object then null; end $$;

do $$ begin
  create type enquiry_status as enum ('new', 'contacted', 'interested', 'converted', 'closed');
exception when duplicate_object then null; end $$;

do $$ begin
  create type enquiry_source as enum ('contact_form', 'puppy_form', 'whatsapp_click');
exception when duplicate_object then null; end $$;

do $$ begin
  create type review_status as enum ('pending', 'approved', 'rejected');
exception when duplicate_object then null; end $$;

-- Admins (authorization via app table, not user_metadata)
create table if not exists public.admins (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid not null unique references auth.users(id) on delete cascade,
  email text not null unique,
  display_name text not null default 'Admin',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.puppies (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  breed text not null,
  gender puppy_gender not null default 'boy',
  age_label text not null default '',
  description text not null default '',
  location_type puppy_location_type not null default 'imported',
  availability puppy_availability not null default 'available',
  status publish_status not null default 'draft',
  has_video boolean not null default false,
  is_korean_teacup boolean not null default false,
  sort_order int not null default 0,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.puppy_images (
  id uuid primary key default gen_random_uuid(),
  puppy_id uuid not null references public.puppies(id) on delete cascade,
  storage_path text not null default '',
  url text not null,
  media_type text not null default 'image' check (media_type in ('image', 'video')),
  is_featured boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.families (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  caption text not null default '',
  adoption_date date,
  is_published boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.family_images (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  storage_path text not null default '',
  url text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  family_id uuid references public.families(id) on delete set null,
  author_name text not null,
  author_location text not null default '',
  body text not null,
  rating int not null default 5 check (rating between 1 and 5),
  status review_status not null default 'pending',
  show_on_home boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  puppy_id uuid references public.puppies(id) on delete set null,
  name text not null,
  phone text not null,
  email text,
  area text,
  message text,
  source enquiry_source not null default 'contact_form',
  status enquiry_status not null default 'new',
  internal_notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  is_published boolean not null default false,
  show_on_home boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Indexes
create index if not exists idx_puppies_slug on public.puppies(slug);
create index if not exists idx_puppies_status_avail_order on public.puppies(status, availability, sort_order);
create index if not exists idx_puppy_images_puppy on public.puppy_images(puppy_id, sort_order);
create index if not exists idx_enquiries_status_created on public.enquiries(status, created_at desc);
create index if not exists idx_faqs_sort on public.faqs(sort_order);
create index if not exists idx_families_published_order on public.families(is_published, sort_order);
create index if not exists idx_reviews_status_home on public.reviews(status, show_on_home);

-- updated_at helper
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_admins_updated on public.admins;
create trigger trg_admins_updated before update on public.admins
for each row execute function public.set_updated_at();

drop trigger if exists trg_puppies_updated on public.puppies;
create trigger trg_puppies_updated before update on public.puppies
for each row execute function public.set_updated_at();

drop trigger if exists trg_families_updated on public.families;
create trigger trg_families_updated before update on public.families
for each row execute function public.set_updated_at();

drop trigger if exists trg_reviews_updated on public.reviews;
create trigger trg_reviews_updated before update on public.reviews
for each row execute function public.set_updated_at();

drop trigger if exists trg_enquiries_updated on public.enquiries;
create trigger trg_enquiries_updated before update on public.enquiries
for each row execute function public.set_updated_at();

drop trigger if exists trg_faqs_updated on public.faqs;
create trigger trg_faqs_updated before update on public.faqs
for each row execute function public.set_updated_at();

-- Admin check (security definer, not in exposed risky pattern for JWT metadata)
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admins a
    where a.auth_user_id = auth.uid()
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated, anon;

-- RLS
alter table public.admins enable row level security;
alter table public.puppies enable row level security;
alter table public.puppy_images enable row level security;
alter table public.families enable row level security;
alter table public.family_images enable row level security;
alter table public.reviews enable row level security;
alter table public.enquiries enable row level security;
alter table public.faqs enable row level security;

-- Admins: self read; admins manage
drop policy if exists admins_select_self on public.admins;
create policy admins_select_self on public.admins
  for select to authenticated
  using (auth_user_id = auth.uid() or public.is_admin());

drop policy if exists admins_all_admin on public.admins;
create policy admins_all_admin on public.admins
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Puppies public read published
drop policy if exists puppies_public_read on public.puppies;
create policy puppies_public_read on public.puppies
  for select to anon, authenticated
  using (status = 'published' or public.is_admin());

drop policy if exists puppies_admin_write on public.puppies;
create policy puppies_admin_write on public.puppies
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Puppy images: readable if parent published (or admin)
drop policy if exists puppy_images_public_read on public.puppy_images;
create policy puppy_images_public_read on public.puppy_images
  for select to anon, authenticated
  using (
    public.is_admin()
    or exists (
      select 1 from public.puppies p
      where p.id = puppy_id and p.status = 'published'
    )
  );

drop policy if exists puppy_images_admin_write on public.puppy_images;
create policy puppy_images_admin_write on public.puppy_images
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Families
drop policy if exists families_public_read on public.families;
create policy families_public_read on public.families
  for select to anon, authenticated
  using (is_published = true or public.is_admin());

drop policy if exists families_admin_write on public.families;
create policy families_admin_write on public.families
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists family_images_public_read on public.family_images;
create policy family_images_public_read on public.family_images
  for select to anon, authenticated
  using (
    public.is_admin()
    or exists (
      select 1 from public.families f
      where f.id = family_id and f.is_published = true
    )
  );

drop policy if exists family_images_admin_write on public.family_images;
create policy family_images_admin_write on public.family_images
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Reviews
drop policy if exists reviews_public_read on public.reviews;
create policy reviews_public_read on public.reviews
  for select to anon, authenticated
  using (status = 'approved' or public.is_admin());

drop policy if exists reviews_admin_write on public.reviews;
create policy reviews_admin_write on public.reviews
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Enquiries: anyone can insert; only admins read/update
drop policy if exists enquiries_public_insert on public.enquiries;
create policy enquiries_public_insert on public.enquiries
  for insert to anon, authenticated
  with check (true);

drop policy if exists enquiries_admin_select on public.enquiries;
create policy enquiries_admin_select on public.enquiries
  for select to authenticated
  using (public.is_admin());

drop policy if exists enquiries_admin_update on public.enquiries;
create policy enquiries_admin_update on public.enquiries
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists enquiries_admin_delete on public.enquiries;
create policy enquiries_admin_delete on public.enquiries
  for delete to authenticated
  using (public.is_admin());

-- FAQs
drop policy if exists faqs_public_read on public.faqs;
create policy faqs_public_read on public.faqs
  for select to anon, authenticated
  using (is_published = true or public.is_admin());

drop policy if exists faqs_admin_write on public.faqs;
create policy faqs_admin_write on public.faqs
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Storage buckets
insert into storage.buckets (id, name, public)
values
  ('puppies', 'puppies', true),
  ('families', 'families', true),
  ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists storage_public_read_puppies on storage.objects;
create policy storage_public_read_puppies on storage.objects
  for select to anon, authenticated
  using (bucket_id in ('puppies', 'families', 'media'));

drop policy if exists storage_admin_insert on storage.objects;
create policy storage_admin_insert on storage.objects
  for insert to authenticated
  with check (bucket_id in ('puppies', 'families', 'media') and public.is_admin());

drop policy if exists storage_admin_update on storage.objects;
create policy storage_admin_update on storage.objects
  for update to authenticated
  using (bucket_id in ('puppies', 'families', 'media') and public.is_admin())
  with check (bucket_id in ('puppies', 'families', 'media') and public.is_admin());

drop policy if exists storage_admin_delete on storage.objects;
create policy storage_admin_delete on storage.objects
  for delete to authenticated
  using (bucket_id in ('puppies', 'families', 'media') and public.is_admin());
