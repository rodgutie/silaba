-- Sílaba — base de datos (Supabase / Postgres)
-- Ejecutar completo en: Supabase → SQL Editor → New query → Run.

-- ───────────────────────── Perfiles ─────────────────────────
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  handle text unique check (handle ~ '^[a-z0-9][a-z0-9-]{2,39}$'),
  full_name text,
  headline text,
  location text,
  bio text,
  avatar_url text,
  cover_url text,
  specialties text[] not null default '{}',
  institutions text[] not null default '{}',
  links jsonb not null default '[]',
  plan text not null default 'free' check (plan in ('free', 'pro')),
  created_at timestamptz not null default now()
);

-- Crea el perfil vacío cuando alguien se registra.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'))
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- Un usuario no puede cambiarse el plan a sí mismo (solo el administrador, desde el panel de Supabase).
create or replace function public.protect_plan()
returns trigger language plpgsql as $$
begin
  if new.plan is distinct from old.plan and auth.uid() is not null then
    new.plan := old.plan;
  end if;
  return new;
end $$;

drop trigger if exists profiles_protect_plan on public.profiles;
create trigger profiles_protect_plan before update on public.profiles
  for each row execute function public.protect_plan();

-- ─────────────────── Líneas temáticas, recursos, notas ───────────────────
create table if not exists public.themes (
  id uuid primary key default gen_random_uuid(),
  owner uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  description text,
  is_public boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.resources (
  id uuid primary key default gen_random_uuid(),
  owner uuid not null references public.profiles (id) on delete cascade,
  theme_id uuid references public.themes (id) on delete set null,
  kind text not null check (kind in ('link', 'article', 'video', 'lecture', 'document')),
  title text not null,
  authors text,
  year int,
  source text,
  url text,
  doi text,
  access text not null default 'unknown' check (access in ('open', 'subscription', 'unknown', 'own')),
  note text,
  file_path text,
  license text,
  is_public boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  owner uuid not null references public.profiles (id) on delete cascade,
  theme_id uuid references public.themes (id) on delete set null,
  title text not null,
  body text not null default '',
  is_public boolean not null default false,
  created_at timestamptz not null default now()
);

-- ───────────────────────── Cursos ─────────────────────────
create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  owner uuid not null references public.profiles (id) on delete cascade,
  slug text not null,
  title text not null,
  description text,
  term text,
  institutions text[] not null default '{}',
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  unique (owner, slug)
);

create table if not exists public.course_weeks (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses (id) on delete cascade,
  number int not null,
  title text,
  note text,
  dates text,
  unique (course_id, number)
);

create table if not exists public.course_items (
  id uuid primary key default gen_random_uuid(),
  week_id uuid not null references public.course_weeks (id) on delete cascade,
  resource_id uuid not null references public.resources (id) on delete cascade,
  role text not null default 'required' check (role in ('required', 'complementary', 'support')),
  position int not null default 0
);

-- Plan Gratis: un curso.
create or replace function public.enforce_course_limit()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if (select plan from public.profiles where id = new.owner) = 'free'
     and (select count(*) from public.courses where owner = new.owner) >= 1 then
    raise exception 'El plan Gratis incluye un curso. Pasa a Pro para crear más.';
  end if;
  return new;
end $$;

drop trigger if exists courses_limit on public.courses;
create trigger courses_limit before insert on public.courses
  for each row execute function public.enforce_course_limit();

create index if not exists resources_owner_idx on public.resources (owner, created_at desc);
create index if not exists courses_owner_idx on public.courses (owner);
create index if not exists items_week_idx on public.course_items (week_id, position);

-- ───────────────────────── Seguridad (RLS) ─────────────────────────
alter table public.profiles enable row level security;
alter table public.themes enable row level security;
alter table public.resources enable row level security;
alter table public.notes enable row level security;
alter table public.courses enable row level security;
alter table public.course_weeks enable row level security;
alter table public.course_items enable row level security;

-- Perfiles: públicos si tienen dirección; cada quien edita el suyo.
drop policy if exists "profiles read" on public.profiles;
create policy "profiles read" on public.profiles for select using (handle is not null or id = auth.uid());
drop policy if exists "profiles update own" on public.profiles;
create policy "profiles update own" on public.profiles for update using (id = auth.uid()) with check (id = auth.uid());

-- Dueño: acceso total a lo suyo.
drop policy if exists "themes owner" on public.themes;
create policy "themes owner" on public.themes for all using (owner = auth.uid()) with check (owner = auth.uid());
drop policy if exists "resources owner" on public.resources;
create policy "resources owner" on public.resources for all using (owner = auth.uid()) with check (owner = auth.uid());
drop policy if exists "notes owner" on public.notes;
create policy "notes owner" on public.notes for all using (owner = auth.uid()) with check (owner = auth.uid());
drop policy if exists "courses owner" on public.courses;
create policy "courses owner" on public.courses for all using (owner = auth.uid()) with check (owner = auth.uid());
drop policy if exists "weeks owner" on public.course_weeks;
create policy "weeks owner" on public.course_weeks for all
  using (exists (select 1 from public.courses c where c.id = course_id and c.owner = auth.uid()))
  with check (exists (select 1 from public.courses c where c.id = course_id and c.owner = auth.uid()));
drop policy if exists "items owner" on public.course_items;
create policy "items owner" on public.course_items for all
  using (exists (select 1 from public.course_weeks w join public.courses c on c.id = w.course_id where w.id = week_id and c.owner = auth.uid()))
  with check (exists (select 1 from public.course_weeks w join public.courses c on c.id = w.course_id where w.id = week_id and c.owner = auth.uid()));

-- Público: lo que el docente marcó como público o publicó en un curso.
drop policy if exists "themes public" on public.themes;
create policy "themes public" on public.themes for select using (is_public);
drop policy if exists "notes public" on public.notes;
create policy "notes public" on public.notes for select using (is_public);
drop policy if exists "courses public" on public.courses;
create policy "courses public" on public.courses for select using (is_published);
drop policy if exists "weeks public" on public.course_weeks;
create policy "weeks public" on public.course_weeks for select
  using (exists (select 1 from public.courses c where c.id = course_id and c.is_published));
drop policy if exists "items public" on public.course_items;
create policy "items public" on public.course_items for select
  using (exists (select 1 from public.course_weeks w join public.courses c on c.id = w.course_id where w.id = week_id and c.is_published));
drop policy if exists "resources public" on public.resources;
create policy "resources public" on public.resources for select using (
  is_public or exists (
    select 1 from public.course_items i
    join public.course_weeks w on w.id = i.week_id
    join public.courses c on c.id = w.course_id
    where i.resource_id = resources.id and c.is_published
  )
);

-- ───────────────────────── Archivos (Storage) ─────────────────────────
-- media: fotos de perfil y portadas · documents: documentos propios de los docentes (plan Pro).
insert into storage.buckets (id, name, public, file_size_limit)
values ('media', 'media', true, 5242880), ('documents', 'documents', true, 52428800)
on conflict (id) do nothing;

-- Cada docente solo puede escribir dentro de su carpeta: <user id>/archivo
drop policy if exists "own folder insert" on storage.objects;
create policy "own folder insert" on storage.objects for insert to authenticated
  with check (
    (storage.foldername(name))[1] = auth.uid()::text
    and (
      bucket_id = 'media'
      or (bucket_id = 'documents' and exists (select 1 from public.profiles p where p.id = auth.uid() and p.plan = 'pro'))
    )
  );
drop policy if exists "own folder update" on storage.objects;
create policy "own folder update" on storage.objects for update to authenticated
  using (bucket_id in ('media', 'documents') and (storage.foldername(name))[1] = auth.uid()::text);
drop policy if exists "own folder delete" on storage.objects;
create policy "own folder delete" on storage.objects for delete to authenticated
  using (bucket_id in ('media', 'documents') and (storage.foldername(name))[1] = auth.uid()::text);
