"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { supabase } from "@/lib/supabase";

type AuthMode = "login" | "register";

const COPY: Record<
  AuthMode,
  { title: string; submit: string; altText: string; altHref: string; altLink: string }
> = {
  login: {
    title: "Sign in",
    submit: "Sign in",
    altText: "Don't have an account?",
    altHref: "/register",
    altLink: "Create one",
  },
  register: {
    title: "Create account",
    submit: "Sign up",
    altText: "Already have an account?",
    altHref: "/login",
    altLink: "Sign in",
  },
};

// Where authenticated users land.
const AFTER_AUTH_PATH = "/dashboard";

export function AuthForm({ mode }: { mode: AuthMode }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const copy = COPY[mode];

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setNotice(null);
    setLoading(true);

    const credentials = { email, password };
    const { data, error } =
      mode === "login"
        ? await supabase.auth.signInWithPassword(credentials)
        : await supabase.auth.signUp(credentials);

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    // With "Confirm email" enabled in Supabase, signUp returns no session.
    if (!data.session) {
      setNotice("Check your email to confirm your account, then sign in.");
      return;
    }

    router.replace(AFTER_AUTH_PATH);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-4 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm"
      >
        <h1 className="text-2xl font-semibold text-zinc-900">{copy.title}</h1>

        <label className="block space-y-1">
          <span className="text-sm font-medium text-zinc-700">Email</span>
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-zinc-900 outline-none focus:border-zinc-900"
          />
        </label>

        <label className="block space-y-1">
          <span className="text-sm font-medium text-zinc-700">Password</span>
          <input
            type="password"
            required
            minLength={6}
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-zinc-900 outline-none focus:border-zinc-900"
          />
        </label>

        {error && (
          <p role="alert" className="text-sm text-red-600">
            {error}
          </p>
        )}
        {notice && (
          <p role="status" className="text-sm text-green-700">
            {notice}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-zinc-900 px-3 py-2 font-medium text-white hover:bg-zinc-700 disabled:opacity-50"
        >
          {loading ? "Please wait..." : copy.submit}
        </button>

        <p className="text-center text-sm text-zinc-600">
          {copy.altText}{" "}
          <Link href={copy.altHref} className="font-medium text-zinc-900 underline">
            {copy.altLink}
          </Link>
        </p>
      </form>
    </main>
  );
}
