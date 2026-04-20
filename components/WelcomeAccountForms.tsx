"use client";

import { PageAccent } from "@/components/PageAccent";
import { ServiceSubpageFrame } from "@/components/ServiceSubpageFrame";
import { isValidEmailFormat, normalizeEmail } from "@/lib/email-format";
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

export function WelcomeAccountForms() {
  const router = useRouter();
  const inEmailId = useId();
  const inPassId = useId();

  const [inEmail, setInEmail] = useState("");
  const [inPassword, setInPassword] = useState("");
  const [inError, setInError] = useState<string | null>(null);
  const [inPending, setInPending] = useState(false);

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

        <section id="sign-in" className={cardClass} aria-labelledby="sign-in-heading">
          <h2 id="sign-in-heading" className="text-xl font-semibold text-stone-900">
            Sign in / Upgrade
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
              {inPending ? "Signing in…" : "Sign in / Upgrade"}
            </button>
          </form>
          <p className="mt-4 text-center text-sm text-stone-600">
            No account?{" "}
            <Link href="/welcome" className="font-medium text-blue-800 underline">
              Register
            </Link>
          </p>
          <p className="mt-2 text-center text-sm text-stone-600">
            Ready to upgrade?{" "}
            <Link href="/stripe" className="font-medium text-blue-800 underline">
              Upgrade now
            </Link>
          </p>
        </section>
      </div>
    </ServiceSubpageFrame>
  );
}
