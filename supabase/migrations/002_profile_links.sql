-- Secure contact links table + RLS policy for matched partners
-- Run in the Supabase SQL editor.

create table if not exists public.profile_links (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  contact_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profile_links_url_len check (contact_url is null or char_length(contact_url) <= 200)
);

drop trigger if exists profile_links_set_updated_at on public.profile_links;
create trigger profile_links_set_updated_at
before update on public.profile_links
for each row execute procedure public.set_updated_at();

alter table public.profile_links enable row level security;

drop policy if exists "links readable by owner" on public.profile_links;
create policy "links readable by owner"
  on public.profile_links for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "links readable by matched partner" on public.profile_links;
create policy "links readable by matched partner"
  on public.profile_links for select
  to authenticated
  using (
    exists (
      select 1 from public.connect_requests cr
      where cr.status = 'accepted'
        and ((cr.from_id = auth.uid() and cr.to_id = profile_links.user_id)
          or (cr.to_id = auth.uid() and cr.from_id = profile_links.user_id))
    )
  );

drop policy if exists "links insert own" on public.profile_links;
create policy "links insert own"
  on public.profile_links for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "links update own" on public.profile_links;
create policy "links update own"
  on public.profile_links for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
