"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useSession } from "@/hooks/useSession";

type GuardMode = "private" | "guest";

// private: only signed-in users. guest: only signed-out users (login/register).
const REDIRECT_TO: Record<GuardMode, string> = {
  private: "/login",
  guest: "/dashboard",
};

export function AuthGuard({ mode, children }: { mode: GuardMode; children: ReactNode }) {
  const router = useRouter();
  const { session, loading } = useSession();

  const allowed = mode === "private" ? session !== null : session === null;

  useEffect(() => {
    if (!loading && !allowed) {
      router.replace(REDIRECT_TO[mode]);
    }
  }, [loading, allowed, mode, router]);

  if (loading || !allowed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 text-sm text-zinc-500">
        Loading...
      </div>
    );
  }

  return children;
}
