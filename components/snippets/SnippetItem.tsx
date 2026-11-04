"use client";

import { useState } from "react";
import { SnippetForm } from "@/components/snippets/SnippetForm";
import type { NewSnippet, Snippet } from "@/lib/snippets";

type Props = {
  snippet: Snippet;
  deleting: boolean;
  onDelete: (id: string) => void;
  onUpdate: (id: string, input: NewSnippet) => Promise<void>;
};

// Edit mode is local UI state; persistence stays in the container via onUpdate.
export function SnippetItem({ snippet, deleting, onDelete, onUpdate }: Props) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <li>
        <SnippetForm
          heading="Edit snippet"
          submitLabel="Save changes"
          initialValues={{ title: snippet.title, content: snippet.content, category: snippet.category }}
          onSubmit={async (input) => {
            await onUpdate(snippet.id, input);
            setEditing(false);
          }}
          onCancel={() => setEditing(false)}
        />
      </li>
    );
  }

  return (
    <li className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="truncate font-semibold text-zinc-900">{snippet.title}</h3>
          <span className="mt-1 inline-block rounded bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600">
            {snippet.category}
          </span>
        </div>
        <div className="flex shrink-0 gap-3">
          <button
            type="button"
            onClick={() => setEditing(true)}
            disabled={deleting}
            className="text-sm font-medium text-zinc-700 hover:text-zinc-900 disabled:opacity-50"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => onDelete(snippet.id)}
            disabled={deleting}
            className="text-sm font-medium text-red-600 hover:text-red-800 disabled:opacity-50"
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
      <pre className="overflow-x-auto rounded-md bg-zinc-900 p-3 text-sm text-zinc-100">
        <code>{snippet.content}</code>
      </pre>
    </li>
  );
}
