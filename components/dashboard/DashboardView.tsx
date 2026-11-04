"use client";

import { useEffect, useState } from "react";
import { SnippetForm } from "@/components/snippets/SnippetForm";
import { SnippetList } from "@/components/snippets/SnippetList";
import {
  createSnippet,
  deleteSnippet,
  listSnippets,
  updateSnippet,
  type NewSnippet,
  type Snippet,
} from "@/lib/snippets";

// Container: owns snippet state and talks to Supabase; children only render and emit events.
export function DashboardView() {
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
    <main className="flex-1 px-4 py-8">
      <div className="mx-auto max-w-3xl space-y-8">
        <h1 className="text-2xl font-semibold text-zinc-900">My snippets</h1>

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
