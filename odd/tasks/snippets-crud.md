# Snippets CRUD (MVP step 4)

## Objective
Authenticated users can create, list and delete their own snippets (title, content, category) from `/dashboard`.

## Problem / Why
The app has auth but no functionality. This is the core MVP feature for the portfolio.

## Scope
- `snippets` table with RLS (owner-only select/insert/delete).
- `/dashboard` page: create form + list with delete, protected by `AuthGuard` (covers step 3's intent; a server middleware can't see a localStorage session).
- `/` and post-auth redirects point to `/dashboard`.

Edit added on user request (T7). Out of scope: tags, public snippets, search.

## Constraints
- Stack: Next.js 16 App Router, Tailwind 4, `@supabase/supabase-js` (client-side session), TypeScript. No new dependencies.
- TDD: off (no test runner configured). Checks: `tsc --noEmit`, `npm run lint`, `npm run build`, browser redirect check.

## Tasks
- [x] T1 SQL migration: `supabase/migrations/20261103000000_create_snippets.sql` (table, index, RLS policies, grants).
- [x] T2 Data access: `lib/snippets.ts` (list/create/delete + types).
- [x] T3 UI: `SnippetForm`, `SnippetList`, `DashboardView`, `app/dashboard/page.tsx`.
- [x] T4 Routing: `/` -> `/dashboard` via `next.config.ts` `redirects` (a `redirect()` in a page broke Next 16 `instant` validation); guest guard + AuthForm go to `/dashboard`; `HomeView` and `app/page.tsx` removed.
- [x] T5 Verify: `npm run build`, `tsc --noEmit`, `npm run lint` pass; browser: signed-out `/` -> `/dashboard` -> `/login`, no server errors.
- [x] T7 Edit: `20261103000100_allow_snippet_updates.sql` (UPDATE policy + column-level grant on title/content/category), `updateSnippet`, reusable `SnippetForm` (create/edit), `SnippetItem` with local edit mode. build/tsc/lint pass.
- [ ] T6 Manual: user runs the SQL in Supabase and tests create/list/delete with a real account.

## Acceptance criteria
- Signed-out visit to `/dashboard` lands on `/login`.
- Signed-in user sees only their snippets, can add and delete.
- Another user's rows are never returned (RLS).

## Progress
Started 2026-11-03. T1-T5, T7 done. Next step: T6 (run both migrations in Supabase SQL Editor, test create/edit/delete signed in). Not verified: real CRUD against Supabase, RLS isolation between two users.
