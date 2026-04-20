"use client";

import { PageAccent } from "@/components/PageAccent";
import { ServiceSubpageFrame } from "@/components/ServiceSubpageFrame";
import { isValidEmailFormat, normalizeEmail } from "@/lib/email-format";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

const DEFAULT_AFTER_LOGIN = "/";

function safeInternalPath(raw: string | null): string {
  if (!raw) return DEFAULT_AFTER_LOGIN;
  const t = raw.trim();
  if (!t.startsWith("/") || t.startsWith("//") || t.includes("://")) return DEFAULT_AFTER_LOGIN;
  return t;
}

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = useMemo(() => safeInternalPath(searchParams.get("callbackUrl")), [searchParams]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const normalizedEmail = normalizeEmail(email);
    if (!isValidEmailFormat(normalizedEmail)) {
      setError("Enter a valid email address.");
      return;
    }
    setPending(true);
    const res = await signIn("credentials", {
      email: normalizedEmail,
      password,
      redirect: false,
    });
    setPending(false);
    if (res?.error) {
      setError("Email or password did not match.");
      return;
    }
    router.push(callbackUrl);
    router.refresh();
  }

  const blurb =
    callbackUrl === "/stripe"
      ? "Continue to supporter checkout after you sign in."
      : callbackUrl.startsWith("/unenroll")
        ? "Manage billing or cancel after you sign in."
        : callbackUrl === "/"
          ? "Continue to the home page after you sign in."
          : "Access the private spouse / family log.";

  return (
    <ServiceSubpageFrame>
      <PageAccent className="page-accent-auth-login" />
      <div className="relative z-10 mx-auto flex w-full max-w-md flex-col gap-8 px-6 py-16">
        <div className="rounded-xl border border-stone-200 bg-white/90 px-5 py-5 shadow-sm">
        <header className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold text-stone-900">Sign in</h1>
          <p className="text-sm text-stone-600">{blurb}</p>
          <p className="text-sm text-stone-700">
            We only use your sign-in to unlock your account features; this site remains educational and is not VA.
          </p>
        </header>

        <form className="mt-5 flex flex-col gap-4" onSubmit={onSubmit}>
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-stone-700">Email</span>
            <input
              type="email"
              autoComplete="email"
              required
              className="rounded-md border border-stone-300 px-3 py-2 text-stone-900"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-stone-700">Password</span>
            <input
              type="password"
              autoComplete="current-password"
              required
              className="rounded-md border border-stone-300 px-3 py-2 text-stone-900"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          {error ? <p className="text-sm text-red-700">{error}</p> : null}
          <button
            type="submit"
            disabled={pending}
            className="rounded-md bg-stone-900 px-4 py-3 text-sm font-medium text-white hover:bg-stone-800 disabled:opacity-60"
          >
            {pending ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="text-center text-sm text-stone-600">
          No account?{" "}
          <Link href="/welcome" className="font-medium text-blue-800 underline">
            Register
          </Link>
        </p>
        </div>
      </div>
    </ServiceSubpageFrame>
  );
}
