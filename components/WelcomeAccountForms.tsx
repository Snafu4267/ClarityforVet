"use client";

import { PageAccent } from "@/components/PageAccent";
import { ServiceSubpageFrame } from "@/components/ServiceSubpageFrame";
import { isValidEmailFormat, normalizeEmail } from "@/lib/email-format";
import { PUBLIC_ONLY_SITE, SITE_NAME } from "@/lib/site";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useId, useState } from "react";

const cardClass =
  "rounded-2xl border border-stone-200/90 bg-white px-5 py-6 shadow-sm ring-1 ring-stone-100/80 sm:px-7 sm:py-7";
const inputClass = "rounded-md border border-stone-300 px-3 py-2.5 text-sm text-stone-900 focus:border-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-200/80";
const primaryBtn =
  "mt-2 inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-stone-900 px-4 text-sm font-medium text-white transition hover:bg-stone-800 disabled:pointer-events-none disabled:opacity-60";

export function WelcomeAccountForms() {
  const router = useRouter();
  const regNameId = useId();
  const regEmailId = useId();
  const regPassId = useId();
  const regInviteId = useId();
  const inEmailId = useId();
  const inPassId = useId();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [friendInviteCode, setFriendInviteCode] = useState(() => {
    if (typeof window === "undefined") return "";
    const c = new URLSearchParams(window.location.search).get("code");
    return c?.trim() || "";
  });
  const [regError, setRegError] = useState<string | null>(null);
  const [regPending, setRegPending] = useState(false);

  const [inEmail, setInEmail] = useState("");
  const [inPassword, setInPassword] = useState("");
  const [inError, setInError] = useState<string | null>(null);
  const [inPending, setInPending] = useState(false);

  const onRegister = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setRegError(null);
      const normalizedEmail = normalizeEmail(email);
      if (!isValidEmailFormat(normalizedEmail)) {
        setRegError("Enter a valid email address.");
        return;
      }
      setRegPending(true);
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim() || undefined,
          email: normalizedEmail,
          password,
          inviteCode: friendInviteCode.trim() || undefined,
        }),
      });
      const raw = await res.text();
      let data: { error?: string } = {};
      if (raw) {
        try {
          data = JSON.parse(raw) as { error?: string };
        } catch {
          setRegPending(false);
          setRegError("Server returned an invalid response. Try again or update the app (Prisma + dev server).");
          return;
        }
      }
      if (!res.ok) {
        setRegPending(false);
        setRegError(data.error ?? "Could not register.");
        return;
      }
      const sign = await signIn("credentials", {
        email: normalizedEmail,
        password,
        redirect: false,
      });
      setRegPending(false);
      if (sign?.error) {
        setRegError("Account created but sign-in failed—try signing in below.");
        return;
      }
      router.push("/");
      router.refresh();
    },
    [email, friendInviteCode, name, password, router],
  );

  const onSignIn = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setInError(null);
      const normalizedEmail = normalizeEmail(inEmail);
      if (!isValidEmailFormat(normalizedEmail)) {
        setInError("Enter a valid email address.");
        return;
      }
      setInPending(true);
      const res = await signIn("credentials", {
        email: normalizedEmail,
        password: inPassword,
        redirect: false,
      });
      setInPending(false);
      if (res?.error) {
        setInError("Email or password did not match.");
        return;
      }
      router.push("/");
      router.refresh();
    },
    [inEmail, inPassword, router],
  );

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
              Before you get started, here&apos;s what you need to know. Your first <strong className="font-semibold text-stone-900">10 days</strong>{" "}
              on this site are completely free, so you can review the full package and decide if it helps.
            </p>
            <p>
              After day 10, membership is <strong className="font-semibold text-stone-900">$1.99/month</strong>. No hidden fees.
              You&apos;ll get clear reminders before trial end so you can choose what to do next.
            </p>
          </div>
        </header>

        <section id="create-account" className={cardClass} aria-labelledby="create-account-heading">
          <h2 id="create-account-heading" className="text-xl font-semibold text-stone-900">
            Create your account
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-stone-600">
            All you need is your email and a password to start your free 10-day trial.
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
            <div className="flex flex-col gap-1.5 text-sm">
              <label htmlFor={regInviteId} className="text-stone-800">
                Invite a Vet if you think this could help them on this journey.{" "}
                <span className="text-stone-500">(optional)</span>
              </label>
              <p className="text-xs leading-snug text-stone-600">
                If someone already shared their personal code with <em>you</em>, enter it here so we can thank them.
              </p>
              <input
                id={regInviteId}
                type="text"
                autoComplete="off"
                inputMode="text"
                spellCheck={false}
                placeholder="Their code (letters & numbers)"
                className={inputClass}
                value={friendInviteCode}
                onChange={(e) => setFriendInviteCode(e.target.value)}
              />
              <p className="text-xs leading-snug text-stone-500">
                Letters and numbers only—it has to match an active code from someone on the site. A link with{" "}
                <code className="rounded bg-stone-100 px-1 py-0.5 text-[0.7rem]">?code=</code> can fill this in for you.
              </p>
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

        {PUBLIC_ONLY_SITE ? null : (
          <section
            id="billing"
            className="rounded-lg border border-stone-200 bg-stone-50/90 px-3 py-3 text-sm leading-relaxed text-stone-700 sm:text-[0.9375rem]"
            aria-label="Billing and unenroll"
          >
            <strong className="font-semibold text-stone-900">Billing:</strong>{" "}
            cancel or change your plan in Stripe&apos;s secure portal —{" "}
            <Link href="/unenroll" className="font-semibold text-slate-800 underline decoration-stone-300 underline-offset-2">
              Unenroll / billing
            </Link>
            . Sign in first if you use an account.
          </section>
        )}

        {PUBLIC_ONLY_SITE ? null : (
          <section
            className="rounded-lg border border-stone-200 bg-white px-3 py-3 text-sm leading-relaxed text-stone-700 shadow-sm ring-1 ring-stone-100/80 sm:text-[0.9375rem]"
            aria-label="Invite a vet after sign-in"
          >
            <strong className="font-semibold text-stone-900">Invite a vet:</strong> after you sign in, use{" "}
            <strong className="font-semibold text-stone-900">Invite a vet</strong> in the top bar (next to Sign out) or open{" "}
            <Link href="/invite-vet" className="font-semibold text-slate-800 underline decoration-stone-300 underline-offset-2">
              your invite page
            </Link>
            . Your personal code is created there and tied to your account—share it only with people who want it.
          </section>
        )}
      </div>
    </ServiceSubpageFrame>
  );
}
