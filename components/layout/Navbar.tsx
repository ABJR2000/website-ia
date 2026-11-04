"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "@/hooks/useSession";
import { APP_NAME } from "@/lib/config";
import { supabase } from "@/lib/supabase";

function NavLink({ href, label }: { href: string; label: string }) {
  const active = usePathname() === href;

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`rounded-md px-3 py-1.5 text-sm font-medium ${
        active ? "bg-zinc-100 text-zinc-900" : "text-zinc-600 hover:text-zinc-900"
      }`}
    >
      {label}
    </Link>
  );
}

export function Navbar() {
  const { session, loading } = useSession();

  return (
    <header className="border-b border-zinc-200 bg-white">
      <nav className="mx-auto flex h-14 max-w-3xl items-center justify-between gap-4 px-4">
        <Link href="/dashboard" className="shrink-0 font-semibold text-zinc-900">
          {"</>"} {APP_NAME}
        </Link>

        {/* Render nothing on the right until the session is known, to avoid flashing the wrong links. */}
        {!loading && (
          <div className="flex min-w-0 items-center gap-2">
            {session ? (
              <>
                <NavLink href="/dashboard" label="My snippets" />
                <span className="hidden truncate text-sm text-zinc-500 sm:inline">
                  {session.user.email}
                </span>
                <button
                  type="button"
                  onClick={() => supabase.auth.signOut()}
                  className="shrink-0 rounded-md border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-100"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <NavLink href="/login" label="Login" />
                <NavLink href="/register" label="Register" />
              </>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
