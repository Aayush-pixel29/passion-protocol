-- Tighten connect requests: sender cannot mark a pair accepted.

drop policy if exists "connects update as party" on public.connect_requests;
drop policy if exists "connects insert as sender" on public.connect_requests;

create policy "connects insert pending as sender"
  on public.connect_requests for insert
  to authenticated
  with check (
    auth.uid() = from_id
    and status = 'pending'
  );

create policy "connects recipient can accept or decline"
  on public.connect_requests for update
  to authenticated
  using (auth.uid() = to_id)
  with check (
    auth.uid() = to_id
    and status in ('accepted', 'declined')
  );

alter table public.profiles
  drop constraint if exists profiles_bio_len;
alter table public.profiles
  add constraint profiles_bio_len check (bio is null or char_length(bio) <= 280);

alter table public.profiles
  drop constraint if exists profiles_codename_charset;
alter table public.profiles
  add constraint profiles_codename_charset check (codename ~ '^[A-Z0-9_]{2,32}$');
