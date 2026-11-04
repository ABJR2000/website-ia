# Navbar and demo account

## Objective
Recruiters can open the deployed app and try it without registering: a global navbar plus a one-click demo login.

## Scope
- Global `Navbar` in the root layout: app name; signed out -> Login, Register; signed in -> My snippets, email, Sign out.
- Demo account via `NEXT_PUBLIC_DEMO_EMAIL` / `NEXT_PUBLIC_DEMO_PASSWORD` (optional; hidden if unset). Account is created manually in Supabase.
- Register stays available (optional path).
- Layout title metadata.

Out of scope: resetting demo data, per-recruiter isolation.

## Constraints
No new dependencies. TDD off (no runner). Checks: build, tsc, lint, browser check of navbar and demo box.

## Tasks
- [x] T1 `components/layout/Navbar.tsx` + root layout (title template). `APP_NAME` lives in `lib/config.ts` because a server component importing a value from a "use client" module gets a client reference, not the value.
- [x] T2 Demo login in `AuthForm` (env-driven `DEMO_ACCOUNT`, one-click sign in).
- [x] T3 Pages adapt to navbar (`flex-1`); sign-out moved from `DashboardView` to navbar. `globals.css` made light-only (template dark-mode body rule beat Tailwind utilities; Arial overrode Geist).
- [x] T4 README: demo account setup + env vars.
- [x] T5 Verify: build, tsc, lint pass; browser: signed-out navbar (Login/Register), demo box with env set, signed-in navbar (My snippets/email/Sign out).
- [ ] T6 Manual: user creates demo user in Supabase, sets env vars locally and in Vercel.

## Progress
Started 2026-11-03. T1-T5 done. Not verified: real demo sign-in against Supabase.
