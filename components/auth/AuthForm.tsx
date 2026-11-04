"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { DEMO_ACCOUNT } from "@/lib/config";
import { supabase } from "@/lib/supabase";

type AuthMode = "login" | "register";
type Credentials = { email: string; password: string };

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

const FIELD_CLASS =
  "w-full rounded-md border border-zinc-300 px-3 py-2 text-zinc-900 outline-none focus:border-zinc-900";

export function AuthForm({ mode }: { mode: AuthMode }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const copy = COPY[mode];
  const showDemo = mode === "login" && DEMO_ACCOUNT !== null;

  async function authenticate(credentials: Credentials, authMode: AuthMode) {
    setError(null);
    setNotice(null);
    setLoading(true);

    const { data, error } =
      authMode === "login"
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

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void authenticate({ email, password }, mode);
  }

  function handleDemoLogin() {
    if (!DEMO_ACCOUNT) return;
    setEmail(DEMO_ACCOUNT.email);
    setPassword(DEMO_ACCOUNT.password);
    void authenticate(DEMO_ACCOUNT, "login");
  }

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm space-y-4">
        {showDemo && DEMO_ACCOUNT && (
          <div className="space-y-3 rounded-lg border border-zinc-200 bg-white p-4 text-sm shadow-sm">
            <p className="font-medium text-zinc-900">Just looking around?</p>
            <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-zinc-600">
              <dt>Email</dt>
              <dd className="truncate font-mono text-zinc-900">{DEMO_ACCOUNT.email}</dd>
              <dt>Password</dt>
              <dd className="truncate font-mono text-zinc-900">{DEMO_ACCOUNT.password}</dd>
            </dl>
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={loading}
              className="w-full rounded-md border border-zinc-900 px-3 py-2 font-medium text-zinc-900 hover:bg-zinc-100 disabled:opacity-50"
            >
              Try the demo account
            </button>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm"
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
              className={FIELD_CLASS}
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
              className={FIELD_CLASS}
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
      </div>
    </main>
  );
}
