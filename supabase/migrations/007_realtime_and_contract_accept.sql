-- Enable Realtime for chat + contracts, and let only the recipient accept/decline.

alter table public.messages replica identity full;
alter table public.partnership_contracts replica identity full;

do $$
begin
  alter publication supabase_realtime add table public.messages;
exception
  when duplicate_object then null;
end $$;

do $$
begin
  alter publication supabase_realtime add table public.partnership_contracts;
exception
  when duplicate_object then null;
end $$;

drop policy if exists "partnership update access" on public.partnership_contracts;

create policy "partnership recipient can accept or decline"
  on public.partnership_contracts for update
  to authenticated
  using (auth.uid() = proposed_to)
  with check (
    auth.uid() = proposed_to
    and status in ('accepted', 'declined')
  );
