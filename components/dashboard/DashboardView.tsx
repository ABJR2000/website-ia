"use client";

import { useEffect, useState } from "react";
import { SnippetForm } from "@/components/snippets/SnippetForm";
import { SnippetList } from "@/components/snippets/SnippetList";
import { useSession } from "@/hooks/useSession";
import {
  createSnippet,
  deleteSnippet,
  listSnippets,
  updateSnippet,
  type NewSnippet,
  type Snippet,
} from "@/lib/snippets";
import { supabase } from "@/lib/supabase";

// Container: owns snippet state and talks to Supabase; children only render and emit events.
export function DashboardView() {
  const { session } = useSession();
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    listSnippets()
      .then(setSnippets)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleCreate(input: NewSnippet) {
    const created = await createSnippet(input);
    setSnippets((prev) => [created, ...prev]);
  }

  async function handleUpdate(id: string, input: NewSnippet) {
    const updated = await updateSnippet(id, input);
    setSnippets((prev) => prev.map((snippet) => (snippet.id === id ? updated : snippet)));
  }

  async function handleDelete(id: string) {
    setError(null);
    setDeletingId(id);
    try {
      await deleteSnippet(id);
      setSnippets((prev) => prev.filter((snippet) => snippet.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete the snippet.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-8">
      <div className="mx-auto max-w-3xl space-y-8">
        <header className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold text-zinc-900">My snippets</h1>
            <p className="truncate text-sm text-zinc-500">{session?.user.email}</p>
          </div>
          <button
            type="button"
            onClick={() => supabase.auth.signOut()}
            className="shrink-0 rounded-md border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-100"
          >
            Sign out
          </button>
        </header>

        <SnippetForm heading="New snippet" submitLabel="Save snippet" onSubmit={handleCreate} />

        <section className="space-y-4">
          {error && (
            <p role="alert" className="text-sm text-red-600">
              {error}
            </p>
          )}
          {loading ? (
            <p className="text-center text-sm text-zinc-500">Loading snippets...</p>
          ) : (
            <SnippetList
              snippets={snippets}
              deletingId={deletingId}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
            />
          )}
        </section>
      </div>
    </main>
  );
}
