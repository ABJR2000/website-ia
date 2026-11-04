import { SnippetItem } from "@/components/snippets/SnippetItem";
import type { NewSnippet, Snippet } from "@/lib/snippets";

type Props = {
  snippets: Snippet[];
  deletingId: string | null;
  onDelete: (id: string) => void;
  onUpdate: (id: string, input: NewSnippet) => Promise<void>;
};

export function SnippetList({ snippets, deletingId, onDelete, onUpdate }: Props) {
  if (snippets.length === 0) {
    return <p className="text-center text-sm text-zinc-500">No snippets yet. Save your first one above.</p>;
  }

  return (
    <ul className="space-y-4">
      {snippets.map((snippet) => (
        <SnippetItem
          key={snippet.id}
          snippet={snippet}
          deleting={deletingId === snippet.id}
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
      ))}
    </ul>
  );
}
