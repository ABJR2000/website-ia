"use client";

import { useSession } from "@/hooks/useSession";
import { supabase } from "@/lib/supabase";

// Placeholder for the snippets dashboard. AuthGuard redirects to /login after sign out.
export function HomeView() {
  const { session } = useSession();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-zinc-50 px-4">
      <p className="text-zinc-700">
        Signed in as <span className="font-medium text-zinc-900">{session?.user.email}</span>
      </p>
      <button
        type="button"
        onClick={() => supabase.auth.signOut()}
        className="rounded-md bg-zinc-900 px-4 py-2 font-medium text-white hover:bg-zinc-700"
      >
        Sign out
      </button>
    </main>
  );
}
