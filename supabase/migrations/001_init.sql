-- Passion Protocol schema + RLS
-- Run in the Supabase SQL editor.

create extension if not exists "pgcrypto";

do $$ begin
  create type public.operator_role as enum ('coder', 'designer', 'writer', 'maker');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type public.connect_status as enum ('pending', 'accepted', 'declined');
exception
  when duplicate_object then null;
end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  codename text not null,
  role public.operator_role,
  looking_for public.operator_role,
  bio text,
  onboarding_complete boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_codename_len check (char_length(codename) between 2 and 32),
  constraint profiles_codename_unique unique (codename)
);

create table if not exists public.vibe_answers (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  pace smallint not null check (pace between 1 and 5),
  comms smallint not null check (comms between 1 and 5),
  risk smallint not null check (risk between 1 and 5),
  energy smallint not null check (energy between 1 and 5)
);

create table if not exists public.connect_requests (
  id uuid primary key default gen_random_uuid(),
  from_id uuid not null references public.profiles (id) on delete cascade,
  to_id uuid not null references public.profiles (id) on delete cascade,
  status public.connect_status not null default 'pending',
  created_at timestamptz not null default now(),
  constraint connect_not_self check (from_id <> to_id)
);

create unique index if not exists connect_requests_pair_idx
  on public.connect_requests (least(from_id, to_id), greatest(from_id, to_id));

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute procedure public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.vibe_answers enable row level security;
alter table public.connect_requests enable row level security;

drop policy if exists "profiles readable by authenticated" on public.profiles;
create policy "profiles readable by authenticated"
  on public.profiles for select
  to authenticated
  using (true);

drop policy if exists "profiles insert own" on public.profiles;
create policy "profiles insert own"
  on public.profiles for insert
  to authenticated
  with check (auth.uid() = id);

drop policy if exists "profiles update own" on public.profiles;
create policy "profiles update own"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "vibe readable by authenticated" on public.vibe_answers;
create policy "vibe readable by authenticated"
  on public.vibe_answers for select
  to authenticated
  using (true);

drop policy if exists "vibe insert own" on public.vibe_answers;
create policy "vibe insert own"
  on public.vibe_answers for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "vibe update own" on public.vibe_answers;
create policy "vibe update own"
  on public.vibe_answers for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "connects visible to parties" on public.connect_requests;
create policy "connects visible to parties"
  on public.connect_requests for select
  to authenticated
  using (auth.uid() = from_id or auth.uid() = to_id);

drop policy if exists "connects insert as sender" on public.connect_requests;
create policy "connects insert as sender"
  on public.connect_requests for insert
  to authenticated
  with check (auth.uid() = from_id);

drop policy if exists "connects update as party" on public.connect_requests;
create policy "connects update as party"
  on public.connect_requests for update
  to authenticated
  using (auth.uid() = from_id or auth.uid() = to_id)
  with check (auth.uid() = from_id or auth.uid() = to_id);
