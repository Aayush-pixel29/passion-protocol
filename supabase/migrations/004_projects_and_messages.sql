-- 1. Projects Table
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  description text not null,
  budget_range text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint projects_title_len check (char_length(title) between 3 and 100),
  constraint projects_desc_len check (char_length(description) between 10 and 1000)
);

-- Only one active project per user for now
create unique index if not exists projects_user_idx on public.projects (user_id);

alter table public.projects enable row level security;

create policy "projects readable by authenticated"
  on public.projects for select
  to authenticated
  using (true);

create policy "projects insert own"
  on public.projects for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "projects update own"
  on public.projects for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);


-- 2. Messages Table
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references public.profiles (id) on delete cascade,
  receiver_id uuid not null references public.profiles (id) on delete cascade,
  content text not null,
  read_status boolean not null default false,
  created_at timestamptz not null default now(),
  constraint messages_not_self check (sender_id <> receiver_id)
);

alter table public.messages enable row level security;

-- Users can only read messages they sent or received
create policy "messages read access"
  on public.messages for select
  to authenticated
  using (auth.uid() = sender_id or auth.uid() = receiver_id);

-- Users can only send messages if they have an accepted connect request
create policy "messages insert access"
  on public.messages for insert
  to authenticated
  with check (
    auth.uid() = sender_id and
    exists (
      select 1 from public.connect_requests
      where status = 'accepted'
      and (
        (from_id = auth.uid() and to_id = receiver_id) or
        (to_id = auth.uid() and from_id = receiver_id)
      )
    )
  );

create policy "messages update read status"
  on public.messages for update
  to authenticated
  using (auth.uid() = receiver_id)
  with check (auth.uid() = receiver_id);


-- 3. Partnership Contracts Table
create type public.partnership_status as enum ('pending', 'accepted', 'declined', 'paid');

create table if not exists public.partnership_contracts (
  id uuid primary key default gen_random_uuid(),
  connect_request_id uuid not null references public.connect_requests (id) on delete cascade,
  proposed_by uuid not null references public.profiles (id) on delete cascade,
  proposed_to uuid not null references public.profiles (id) on delete cascade,
  price_amount numeric not null check (price_amount >= 0),
  deliverables text not null,
  status public.partnership_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint partnership_not_self check (proposed_by <> proposed_to)
);

alter table public.partnership_contracts enable row level security;

create policy "partnership read access"
  on public.partnership_contracts for select
  to authenticated
  using (auth.uid() = proposed_by or auth.uid() = proposed_to);

create policy "partnership insert access"
  on public.partnership_contracts for insert
  to authenticated
  with check (
    auth.uid() = proposed_by and
    exists (
      select 1 from public.connect_requests
      where id = connect_request_id and status = 'accepted'
    )
  );

create policy "partnership update access"
  on public.partnership_contracts for update
  to authenticated
  using (auth.uid() = proposed_by or auth.uid() = proposed_to)
  with check (auth.uid() = proposed_by or auth.uid() = proposed_to);
