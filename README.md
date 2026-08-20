# Passion Protocol

A website to find collaborators by **vibe**, not resumes.

## Stack

Next.js (App Router) + Supabase (Auth, Postgres, RLS).

## Setup

1. Create a project at [supabase.com](https://supabase.com).
2. In the SQL editor, run [`supabase/migrations/001_init.sql`](supabase/migrations/001_init.sql).
3. Copy env vars:

   ```bash
   copy .env.example .env.local
   ```

   Fill in `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` from **Project Settings → API**.

4. In Supabase Auth, disable email confirmations for local testing (Authentication → Providers → Email → uncheck “Confirm email”), or confirm users from the dashboard.

5. Install and run:

   ```bash
   npm install
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Demo partners

After the schema is applied, seed six completed profiles so Discover has a pool:

```bash
npm run seed
```

All demo accounts use password `DemoPartner1!`. Emails:

- `riya.designs@example.com` — designer, looking for coder
- `dev.arjun@example.com` — coder, looking for designer
- `kai.scripts@example.com` — writer, looking for maker
- `neo.maker@example.com` — maker, looking for writer
- `luna.code@example.com` — coder, looking for maker
- `alex.growth@example.com` — designer, looking for writer

Create your own account on `/login`, finish onboarding, and match against that pool.

## Matching

Role (`looking_for`) is a **filter**. Score is computed from four vibe sliders (pace, comms, risk, energy): same answers score 100; maximum distance scores 0.
