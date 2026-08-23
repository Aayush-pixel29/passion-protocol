alter table public.partnership_contracts
  add column payment_status text not null default 'unpaid';

alter table public.partnership_contracts
  add constraint partnership_contracts_payment_status_check
  check (payment_status in ('unpaid', 'paid', 'refunded'));

alter table public.profiles
  add column stripe_account_id text;
