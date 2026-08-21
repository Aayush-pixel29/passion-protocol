-- Shared pod workspace after a contract is accepted.

insert into storage.buckets (id, name, public, file_size_limit)
values ('pod-workspace', 'pod-workspace', false, 10485760)
on conflict (id) do nothing;

create table if not exists public.workspace_files (
  id uuid primary key default gen_random_uuid(),
  contract_id uuid not null references public.partnership_contracts (id) on delete cascade,
  uploaded_by uuid not null references public.profiles (id) on delete cascade,
  path text not null unique,
  file_name text not null,
  mime_type text not null,
  size_bytes integer not null check (size_bytes > 0 and size_bytes <= 10485760),
  created_at timestamptz not null default now()
);

create index if not exists workspace_files_contract_idx on public.workspace_files (contract_id, created_at desc);

alter table public.workspace_files enable row level security;

create or replace function public.is_accepted_contract_party(cid uuid)
returns boolean
language sql
stable
security invoker
set search_path = public
as $$
  select exists (
    select 1
    from public.partnership_contracts pc
    where pc.id = cid
      and pc.status = 'accepted'
      and (pc.proposed_by = auth.uid() or pc.proposed_to = auth.uid())
  );
$$;

drop policy if exists "workspace files read by parties" on public.workspace_files;
create policy "workspace files read by parties"
  on public.workspace_files for select
  to authenticated
  using (public.is_accepted_contract_party(contract_id));

drop policy if exists "workspace files insert by parties" on public.workspace_files;
create policy "workspace files insert by parties"
  on public.workspace_files for insert
  to authenticated
  with check (
    auth.uid() = uploaded_by
    and public.is_accepted_contract_party(contract_id)
  );

drop policy if exists "workspace files delete own" on public.workspace_files;
create policy "workspace files delete own"
  on public.workspace_files for delete
  to authenticated
  using (auth.uid() = uploaded_by and public.is_accepted_contract_party(contract_id));

drop policy if exists "pod workspace select" on storage.objects;
create policy "pod workspace select"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'pod-workspace'
    and public.is_accepted_contract_party(((storage.foldername(name))[1])::uuid)
  );

drop policy if exists "pod workspace insert" on storage.objects;
create policy "pod workspace insert"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'pod-workspace'
    and public.is_accepted_contract_party(((storage.foldername(name))[1])::uuid)
  );

drop policy if exists "pod workspace delete own" on storage.objects;
create policy "pod workspace delete own"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'pod-workspace'
    and public.is_accepted_contract_party(((storage.foldername(name))[1])::uuid)
  );
