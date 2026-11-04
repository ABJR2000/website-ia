"use client";

import { useState, type FormEvent } from "react";
import { SNIPPET_CATEGORIES, type NewSnippet } from "@/lib/snippets";

const EMPTY: NewSnippet = { title: "", content: "", category: SNIPPET_CATEGORIES[0] };

const FIELD_CLASS =
  "w-full rounded-md border border-zinc-300 px-3 py-2 text-zinc-900 outline-none focus:border-zinc-900";

type Props = {
  heading: string;
  submitLabel: string;
  onSubmit: (input: NewSnippet) => Promise<void>;
  // Present when editing: prefills the form and keeps values after submit.
  initialValues?: NewSnippet;
  onCancel?: () => void;
};

export function SnippetForm({ heading, submitLabel, onSubmit, initialValues, onCancel }: Props) {
  const [values, setValues] = useState<NewSnippet>(initialValues ?? EMPTY);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function update<K extends keyof NewSnippet>(key: K, value: NewSnippet[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSaving(true);

    try {
      await onSubmit({ ...values, title: values.title.trim() });
      if (!initialValues) setValues(EMPTY);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save the snippet.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm"
    >
      <h2 className="text-lg font-semibold text-zinc-900">{heading}</h2>

      <div className="grid gap-4 sm:grid-cols-[1fr_12rem]">
        <label className="block space-y-1">
          <span className="text-sm font-medium text-zinc-700">Title</span>
          <input
            required
            maxLength={200}
            value={values.title}
            onChange={(e) => update("title", e.target.value)}
            className={FIELD_CLASS}
          />
        </label>

        <label className="block space-y-1">
          <span className="text-sm font-medium text-zinc-700">Category</span>
          <select
            value={values.category}
            onChange={(e) => update("category", e.target.value)}
            className={FIELD_CLASS}
          >
            {SNIPPET_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="block space-y-1">
        <span className="text-sm font-medium text-zinc-700">Content / code</span>
        <textarea
          required
          rows={6}
          spellCheck={false}
          value={values.content}
          onChange={(e) => update("content", e.target.value)}
          className={`${FIELD_CLASS} font-mono text-sm`}
        />
      </label>

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-zinc-900 px-4 py-2 font-medium text-white hover:bg-zinc-700 disabled:opacity-50"
        >
          {saving ? "Saving..." : submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="rounded-md border border-zinc-300 px-4 py-2 font-medium text-zinc-700 hover:bg-zinc-100 disabled:opacity-50"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
