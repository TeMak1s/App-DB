# SQL IRL / DB Rank

Mobile-first cyberpunk dashboard that gamifies database learning and progression.

## Stack

- Next.js + React + TypeScript
- TailwindCSS + Framer Motion
- Recharts + Lucide Icons
- Supabase + PostgreSQL

## Run Locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Environment

Copy `.env.example` to `.env.local` and fill:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

If env vars are missing, the app automatically runs in mock mode.

## Supabase Setup

1. Create a Supabase project.
2. In SQL editor, run [supabase/schema.sql](supabase/schema.sql).
3. Run [supabase/seed.sql](supabase/seed.sql).
4. Enable Anonymous Auth in Supabase Authentication settings if you want anonymous sign-in.
5. If using email/password login, enable Email provider in Supabase Auth.
6. To grant admin permissions for leaderboard operations, insert your auth user id into `public.app_admins`.

Example:

```sql
insert into public.app_admins (user_id)
values ('YOUR_AUTH_USER_UUID')
on conflict (user_id) do nothing;
```

## Auth And Admin Behavior

- Login supports `Sign In`, `Sign Up`, and `Continue as Guest`.
- `Forgot Password` sends a reset email using Supabase Auth.
- `Logout` always returns to login screen and clears the in-app session state.
- `Admin Ops` is only shown when the current authenticated user is in `public.app_admins`.

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Deploy (Vercel)

1. Push this repository to GitHub.
2. Import the repository in Vercel.
3. Set environment variables in Vercel project settings:
	- `NEXT_PUBLIC_SUPABASE_URL`
	- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
	- `NEXT_PUBLIC_APP_URL` (production URL)
4. Deploy.

The project is pre-configured for Vercel using [vercel.json](vercel.json).

## Scalable Architecture

- App shell and feature composition: [src/components/app/sql-irl-app.tsx](src/components/app/sql-irl-app.tsx)
- Reusable design system blocks: [src/components/ui](src/components/ui)
- Domain typing and contracts: [src/types/domain.ts](src/types/domain.ts)
- Data providers (Supabase + fallback): [src/lib/supabase/repository.ts](src/lib/supabase/repository.ts)
- SQL infrastructure and seeds: [supabase/schema.sql](supabase/schema.sql), [supabase/seed.sql](supabase/seed.sql)
- Future integrations roadmap: [src/lib/integrations/roadmap.ts](src/lib/integrations/roadmap.ts)

## Project Notes

- Main app shell: [src/components/app/sql-irl-app.tsx](src/components/app/sql-irl-app.tsx)
- Supabase repository with fallback: [src/lib/supabase/repository.ts](src/lib/supabase/repository.ts)
- Futuristic UI components: [src/components/ui](src/components/ui)
- Game data mocks: [src/lib/mocks.ts](src/lib/mocks.ts)
