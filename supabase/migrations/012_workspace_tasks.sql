-- 012_workspace_tasks.sql
-- Collaborative pod workspace sprint tasks with RLS

create table if not exists public.workspace_tasks (
  id uuid primary key default gen_random_uuid(),
  contract_id uuid not null references public.partnership_contracts (id) on delete cascade,
  title text not null,
  description text,
  status text not null default 'todo' check (status in ('todo', 'in_progress', 'review', 'approved')),
  assignee_id uuid references public.profiles (id) on delete set null,
  priority text default 'medium' check (priority in ('low', 'medium', 'high', 'urgent')),
  tool_type text default 'general',
  deliverable_url text,
  deliverable_notes text,
  ai_verification jsonb,
  approved_by_partner boolean default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists workspace_tasks_contract_idx
  on public.workspace_tasks (contract_id, created_at desc);

-- Automatic updated_at trigger
drop trigger if exists workspace_tasks_set_updated_at on public.workspace_tasks;
create trigger workspace_tasks_set_updated_at
before update on public.workspace_tasks
for each row execute procedure public.set_updated_at();

-- Enable RLS
alter table public.workspace_tasks enable row level security;

-- RLS Policies using is_accepted_contract_party(contract_id)
drop policy if exists "workspace tasks select by parties" on public.workspace_tasks;
create policy "workspace tasks select by parties"
  on public.workspace_tasks for select
  to authenticated
  using (public.is_accepted_contract_party(contract_id));

drop policy if exists "workspace tasks insert by parties" on public.workspace_tasks;
create policy "workspace tasks insert by parties"
  on public.workspace_tasks for insert
  to authenticated
  with check (public.is_accepted_contract_party(contract_id));

drop policy if exists "workspace tasks update by parties" on public.workspace_tasks;
create policy "workspace tasks update by parties"
  on public.workspace_tasks for update
  to authenticated
  using (public.is_accepted_contract_party(contract_id))
  with check (public.is_accepted_contract_party(contract_id));

drop policy if exists "workspace tasks delete by parties" on public.workspace_tasks;
create policy "workspace tasks delete by parties"
  on public.workspace_tasks for delete
  to authenticated
  using (public.is_accepted_contract_party(contract_id));
