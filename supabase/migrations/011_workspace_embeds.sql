-- 011_workspace_embeds.sql
-- Add workspace embeds for Figma, GitHub, Notion links

create table public.workspace_embeds (
  id uuid primary key default gen_random_uuid(),
  contract_id uuid references public.partnership_contracts(id) not null,
  added_by uuid references public.profiles(id) not null,
  embed_type text not null check (embed_type in ('figma', 'github', 'notion', 'other')),
  url text not null,
  title text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS
alter table public.workspace_embeds enable row level security;

-- Contract members can see their own embeds
create policy "Workspace embeds are visible to contract members"
  on public.workspace_embeds for select
  using (
    exists (
      select 1 from public.partnership_contracts pc
      where pc.id = workspace_embeds.contract_id
      and (pc.proposed_by = auth.uid() or pc.proposed_to = auth.uid())
    )
  );

-- Contract members can add embeds
create policy "Contract members can add embeds"
  on public.workspace_embeds for insert
  with check (
    added_by = auth.uid() and
    exists (
      select 1 from public.partnership_contracts pc
      where pc.id = workspace_embeds.contract_id
      and (pc.proposed_by = auth.uid() or pc.proposed_to = auth.uid())
      and pc.status = 'accepted'
    )
  );
