"use client";

import { PageAccent } from "@/components/PageAccent";
import { ServiceSubpageFrame } from "@/components/ServiceSubpageFrame";
import { SITE_NAME } from "@/lib/site";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useId, useState } from "react";

const cardClass =
  "rounded-2xl border border-stone-200/90 bg-white px-5 py-6 shadow-sm ring-1 ring-stone-100/80 sm:px-7 sm:py-7";
const inputClass = "rounded-md border border-stone-300 px-3 py-2.5 text-sm text-stone-900 focus:border-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-200/80";
const primaryBtn =
  "mt-2 inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-stone-900 px-4 text-sm font-medium text-white transition hover:bg-stone-800 disabled:pointer-events-none disabled:opacity-60";
const secondaryBtn =
  "inline-flex min-h-12 w-full items-center justify-center rounded-lg border border-stone-300 bg-white px-4 text-sm font-medium text-stone-800 shadow-sm transition hover:border-stone-400 hover:bg-stone-50 disabled:pointer-events-none disabled:opacity-60";

export function WelcomeAccountForms() {
  const router = useRouter();
  const regNameId = useId();
  const regEmailId = useId();
  const regPassId = useId();
  const inEmailId = useId();
  const inPassId = useId();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [regError, setRegError] = useState<string | null>(null);
  const [regPending, setRegPending] = useState(false);

  const [inEmail, setInEmail] = useState("");
  const [inPassword, setInPassword] = useState("");
  const [inError, setInError] = useState<string | null>(null);
  const [inPending, setInPending] = useState(false);

  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const onRegister = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setRegError(null);
      setRegPending(true);
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim() || undefined,
          email: email.trim().toLowerCase(),
          password,
        }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setRegPending(false);
        setRegError(data.error ?? "Could not register.");
        return;
      }
      const sign = await signIn("credentials", {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
      });
      setRegPending(false);
      if (sign?.error) {
        setRegError("Account created but sign-in failed—try signing in below.");
        return;
      }
      router.push("/tools/spouse-log");
      router.refresh();
    },
    [email, name, password, router],
  );

  const onSignIn = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setInError(null);
      setInPending(true);
      const res = await signIn("credentials", {
        email: inEmail.trim().toLowerCase(),
        password: inPassword,
        redirect: false,
      });
      setInPending(false);
      if (res?.error) {
        setInError("Email or password did not match.");
        return;
      }
      router.push("/tools/spouse-log");
      router.refresh();
    },
    [inEmail, inPassword, router],
  );

  function generateInvite() {
    const part =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID().replace(/-/g, "").slice(0, 10).toUpperCase()
        : `VET${Date.now().toString(36).toUpperCase().slice(-8)}`;
    setInviteCode(part);
    setCopied(false);
  }

  async function copyInvite() {
    if (!inviteCode) return;
    const text = `Join me on ${SITE_NAME}. Use my code when you sign up: ${inviteCode}\n${typeof window !== "undefined" ? window.location.origin : ""}/welcome`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <ServiceSubpageFrame>
      <PageAccent className="page-accent-auth-register" />
      <div className="relative z-10 mx-auto flex w-full max-w-xl flex-col gap-10 px-6 py-12 pb-20 sm:gap-12">
        <header className="flex flex-col gap-4">
          <p className="text-sm text-stone-500">
            <Link href="/" className="font-medium text-slate-800 underline decoration-stone-300 underline-offset-2">
              Home
            </Link>
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
            Welcome to {SITE_NAME}
          </h1>
          <div className="space-y-4 text-sm leading-relaxed text-stone-700 sm:text-[0.9375rem]">
            <p>
              Before you get started, here&apos;s what you need to know. Your first 7 days on this site are
              completely free. No credit card. No tricks. No surprise charges. Just full access so you can see if
              this helps you.
            </p>
            <p>
              On day 7, you&apos;ll get a message letting you know your trial is ending. After that, you&apos;ll still
              have access to all the free tools on the site, but the full features will lock until you choose to
              subscribe.
            </p>
          </div>
          <aside
            className="rounded-xl border border-amber-200/90 bg-amber-50/80 px-4 py-3 text-xs leading-relaxed text-amber-950/90"
            role="note"
          >
            <strong className="font-semibold">Today on this site:</strong> we are{" "}
            <strong className="font-semibold">not</strong> collecting cards or running paid plans yet. Accounts and
            tools are free right now. The trial and subscription wording above is how we plan to run things when billing
            is turned on—we&apos;ll tell you clearly before anything charges.
          </aside>
        </header>

        <section id="create-account" className={cardClass} aria-labelledby="create-account-heading">
          <h2 id="create-account-heading" className="text-xl font-semibold text-stone-900">
            Create your account
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-stone-600">
            All you need is your email and a password. No payment info required.
          </p>
          <form className="mt-5 flex flex-col gap-4" onSubmit={onRegister} noValidate>
            <div className="flex flex-col gap-1.5 text-sm">
              <label htmlFor={regNameId} className="text-stone-700">
                Name <span className="text-stone-500">(optional)</span>
              </label>
              <input
                id={regNameId}
                type="text"
                autoComplete="name"
                className={inputClass}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5 text-sm">
              <label htmlFor={regEmailId} className="text-stone-700">
                Email
              </label>
              <input
                id={regEmailId}
                type="email"
                autoComplete="email"
                required
                className={inputClass}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5 text-sm">
              <label htmlFor={regPassId} className="text-stone-700">
                Password <span className="text-stone-500">(min 8 characters)</span>
              </label>
              <input
                id={regPassId}
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                className={inputClass}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {regError ? <p className="text-sm text-red-700">{regError}</p> : null}
            <button type="submit" disabled={regPending} className={primaryBtn}>
              {regPending ? "Creating…" : "Create account"}
            </button>
          </form>
        </section>

        <section id="sign-in" className={cardClass} aria-labelledby="sign-in-heading">
          <h2 id="sign-in-heading" className="text-xl font-semibold text-stone-900">
            Sign in
          </h2>
          <p className="mt-2 text-sm text-stone-600">Same email and password if you already registered.</p>
          <form className="mt-5 flex flex-col gap-4" onSubmit={onSignIn} noValidate>
            <div className="flex flex-col gap-1.5 text-sm">
              <label htmlFor={inEmailId} className="text-stone-700">
                Email
              </label>
              <input
                id={inEmailId}
                type="email"
                autoComplete="email"
                required
                className={inputClass}
                value={inEmail}
                onChange={(e) => setInEmail(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5 text-sm">
              <label htmlFor={inPassId} className="text-stone-700">
                Password
              </label>
              <input
                id={inPassId}
                type="password"
                autoComplete="current-password"
                required
                className={inputClass}
                value={inPassword}
                onChange={(e) => setInPassword(e.target.value)}
              />
            </div>
            {inError ? <p className="text-sm text-red-700">{inError}</p> : null}
            <button type="submit" disabled={inPending} className={primaryBtn}>
              {inPending ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </section>

        <section id="invite" className={cardClass} aria-labelledby="invite-heading">
          <h3 id="invite-heading" className="text-lg font-semibold text-stone-900">
            Invite a vet
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-stone-600">
            This button gives you a referral code you can send to another veteran. This is meant to help—not annoy,
            pressure, or harass anyone. If you think a buddy could use this page, send them your code and let them
            decide for themselves.
          </p>
          <button type="button" onClick={generateInvite} className={`${secondaryBtn} mt-4`}>
            Generate my invite code
          </button>
          {inviteCode ? (
            <div className="mt-4 rounded-lg border border-stone-200 bg-stone-50/90 px-4 py-3">
              <p className="text-xs font-medium uppercase tracking-wide text-stone-500">Your code</p>
              <p className="mt-1 font-mono text-lg font-semibold tracking-wider text-stone-900">{inviteCode}</p>
              <button type="button" onClick={() => void copyInvite()} className={`${secondaryBtn} mt-3 !min-h-10 text-xs`}>
                {copied ? "Copied" : "Copy message to send"}
              </button>
            </div>
          ) : null}
          <p className="referral-note mt-4 text-xs leading-relaxed text-stone-500">
            For every veteran who signs up for a paid account using your code, you get 1 month free—up to 12 months
            total. <span className="text-stone-600">Paid plans and reward tracking are not live yet; we&apos;ll honor this policy when they are.</span>
          </p>
        </section>
      </div>
    </ServiceSubpageFrame>
  );
}
