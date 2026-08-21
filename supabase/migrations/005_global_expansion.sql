-- Add new columns for the Global Professional Network expansion

alter table public.profiles
  add column if not exists full_name text,
  add column if not exists location text,
  add column if not exists spoken_languages text[] default '{}',
  add column if not exists industry_category text,
  add column if not exists professional_title text,
  add column if not exists looking_for_category text,
  add column if not exists looking_for_title text;

-- We will transition away from the old enum-based role columns. 
-- We can drop them to ensure the codebase relies on the new flexible text columns.
alter table public.profiles 
  drop column if exists role,
  drop column if exists looking_for;

-- We can drop the enum types if they are no longer used anywhere else,
-- but they might be cached or used in old migrations, so it's safer to leave the type definitions.

-- We also need to capture phone numbers and linkedin URLs. 
-- Adding them to profile_links is one way, but adding them to profiles is easier for querying.
alter table public.profiles
  add column if not exists phone_number text,
  add column if not exists linkedin_url text;
