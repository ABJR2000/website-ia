-- Snippets owned by a single user. Row Level Security keeps every row private to its owner.

create table public.snippets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  title text not null check (char_length(title) between 1 and 200),
  content text not null,
  category text not null default 'other',
  created_at timestamptz not null default now()
);

-- Matches the dashboard query: the user's snippets, newest first.
create index snippets_user_id_created_at_idx on public.snippets (user_id, created_at desc);

alter table public.snippets enable row level security;

-- (select auth.uid()) is evaluated once per query instead of once per row.
create policy "Users can read their own snippets"
  on public.snippets for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can create their own snippets"
  on public.snippets for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can delete their own snippets"
  on public.snippets for delete
  to authenticated
  using ((select auth.uid()) = user_id);

-- Explicit grants so the Data API exposes the table to signed-in users only.
grant select, insert, delete on public.snippets to authenticated;
