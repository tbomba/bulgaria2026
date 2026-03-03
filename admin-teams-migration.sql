-- ============================================================
-- Teams & Team Members tables + RLS
-- Run this in the Supabase SQL Editor
-- ============================================================

-- 1. Teams table
create table if not exists public.teams (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  color text not null default '#6366f1',   -- hex color for UI badges
  created_at timestamptz not null default now()
);

-- 2. Team members join table (composite PK)
create table if not exists public.team_members (
  team_id uuid not null references public.teams(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  primary key (team_id, user_id)
);

-- 3. Enable RLS
alter table public.teams enable row level security;
alter table public.team_members enable row level security;

-- 4. Teams RLS policies
create policy "Everyone can read teams"
  on public.teams for select
  using (true);

create policy "Admin can insert teams"
  on public.teams for insert
  with check (public.is_admin());

create policy "Admin can update teams"
  on public.teams for update
  using (public.is_admin());

create policy "Admin can delete teams"
  on public.teams for delete
  using (public.is_admin());

-- 5. Team members RLS policies
create policy "Everyone can read team_members"
  on public.team_members for select
  using (true);

create policy "Admin can insert team_members"
  on public.team_members for insert
  with check (public.is_admin());

create policy "Admin can delete team_members"
  on public.team_members for delete
  using (public.is_admin());
