import { supabase } from "@/lib/supabase";

export const SNIPPET_CATEGORIES = [
  "javascript",
  "typescript",
  "python",
  "sql",
  "bash",
  "css",
  "html",
  "note",
  "other",
] as const;

export type Snippet = {
  id: string;
  title: string;
  content: string;
  category: string;
  created_at: string;
};

export type NewSnippet = Pick<Snippet, "title" | "content" | "category">;

const TABLE = "snippets";
const COLUMNS = "id, title, content, category, created_at";

// RLS limits every query to the signed-in user's rows, so no user_id filter is needed here.

export async function listSnippets(): Promise<Snippet[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select(COLUMNS)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

export async function createSnippet(input: NewSnippet): Promise<Snippet> {
  // user_id is filled by the column default (auth.uid()).
  const { data, error } = await supabase.from(TABLE).insert(input).select(COLUMNS).single();

  if (error) throw new Error(error.message);
  return data;
}

export async function updateSnippet(id: string, input: NewSnippet): Promise<Snippet> {
  const { data, error } = await supabase
    .from(TABLE)
    .update(input)
    .eq("id", id)
    .select(COLUMNS)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function deleteSnippet(id: string): Promise<void> {
  const { error } = await supabase.from(TABLE).delete().eq("id", id);

  if (error) throw new Error(error.message);
}
