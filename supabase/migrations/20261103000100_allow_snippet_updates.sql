-- Let owners edit their snippets.

create policy "Users can update their own snippets"
  on public.snippets for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- Column-level grant: only editable fields; user_id and created_at stay immutable.
grant update (title, content, category) on public.snippets to authenticated;
