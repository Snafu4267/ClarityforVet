"use client";

import { PageAccent } from "@/components/PageAccent";
import { ServiceSubpageFrame } from "@/components/ServiceSubpageFrame";
import { SITE_NAME } from "@/lib/site";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";

type SubPayload = {
  subscriptionStatus: string;
  hasBillingProfile: boolean;
  hasSubscriptionId: boolean;
};

export function UnenrollClient() {
  const { data: session, status } = useSession();
  const [sub, setSub] = useState<SubPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const loadSub = useCallback(async () => {
    if (!session) return;
    try {
      const res = await fetch("/api/stripe/subscription");
      if (!res.ok) {
        setSub(null);
        return;
      }
      const data = (await res.json()) as SubPayload;
      setSub(data);
    } catch {
      setSub(null);
    }
  }, [session]);

  useEffect(() => {
    if (!session) return;
    let alive = true;
    void (async () => {
      try {
        const res = await fetch("/api/stripe/subscription");
        if (!alive) return;
        if (!res.ok) {
          setSub(null);
          return;
        }
        const data = (await res.json()) as SubPayload;
        if (alive) setSub(data);
      } catch {
        if (alive) setSub(null);
      }
    })();
    return () => {
      alive = false;
    };
  }, [session]);

  const openPortal = useCallback(async () => {
    setError(null);
    setPending(true);
    try {
      const res = await fetch("/api/stripe/portal-session", { method: "POST" });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok) {
        setError(data.error ?? "Could not open billing portal.");
        setPending(false);
        return;
      }
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      setError("No portal URL returned.");
    } catch {
      setError("Network error. Try again.");
    }
    setPending(false);
  }, []);

  return (
    <ServiceSubpageFrame>
      <PageAccent className="page-accent-auth-login" />
      <div className="relative z-10 mx-auto flex w-full max-w-lg flex-col gap-8 px-6 py-16">
        <header className="flex flex-col gap-2">
          <p className="text-sm text-stone-500">
            <Link href="/" className="font-medium text-slate-800 underline decoration-stone-300 underline-offset-2">
              Home
            </Link>
            {" · "}
            <Link
              href="/stripe"
              className="font-medium text-slate-800 underline decoration-stone-300 underline-offset-2"
            >
              Subscribe
            </Link>
          </p>
          <h1 className="text-2xl font-semibold text-stone-900">Unenroll &amp; billing</h1>
          <p className="text-sm leading-relaxed text-stone-600">
            Cancel or change your supporter subscription in Stripe&apos;s secure billing portal. {SITE_NAME} does not
            cancel billing for you from this page—we send you to the official Stripe tools linked to your account.
          </p>
        </header>

        <div className="rounded-lg border border-amber-200/90 bg-amber-50/70 px-4 py-4 text-sm leading-relaxed text-stone-700">
          <p>We hope this site gave you at least one small piece of help when you needed it.</p>
          <p className="mt-2">
            This platform was started by a fellow veteran as a first project, built with care for veterans and families
            trying to find clear answers in a hard system.
          </p>
          <p className="mt-2">
            Wherever your next step takes you, we&apos;re wishing you and your family a steady path, real support, and a
            warm, hopeful journey ahead.
          </p>
        </div>

        <div className="rounded-2xl border border-stone-200/90 bg-white/95 px-5 py-6 shadow-sm ring-1 ring-stone-100/80">
          {status === "loading" ? (
            <p className="text-sm text-stone-600">Checking your session…</p>
          ) : session ? (
            <>
              <p className="text-sm text-stone-600">
                Signed in as <span className="font-medium text-stone-800">{session.user?.email}</span>
              </p>
              {sub ? (
                <p className="mt-2 text-xs text-stone-500">
                  Billing profile: {sub.hasBillingProfile ? "on file" : "not yet on file"} · Status:{" "}
                  <span className="font-medium text-stone-700">{sub.subscriptionStatus}</span>
                </p>
              ) : null}
              <button
                type="button"
                onClick={openPortal}
                disabled={pending || !sub?.hasBillingProfile}
                className="mt-4 w-full rounded-md bg-stone-900 px-4 py-3 text-sm font-medium text-white hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {pending ? "Opening Stripe…" : "Open billing portal (cancel or update)"}
              </button>
              {!sub?.hasBillingProfile ? (
                <p className="mt-3 text-sm text-stone-600">
                  No Stripe customer is linked yet. If you just finished checkout, wait a moment and{" "}
                  <button
                    type="button"
                    onClick={() => void loadSub()}
                    className="font-medium text-blue-800 underline decoration-blue-200 underline-offset-2"
                  >
                    refresh status
                  </button>
                  , or start checkout from the{" "}
                  <Link href="/stripe" className="font-medium text-blue-800 underline">
                    subscribe
                  </Link>{" "}
                  page.
                </p>
              ) : null}
            </>
          ) : (
            <div className="flex flex-col gap-3">
              <p className="text-sm text-stone-600">Sign in to open your billing portal.</p>
              <Link
                href="/login?callbackUrl=/unenroll"
                className="inline-flex min-h-12 items-center justify-center rounded-md border border-stone-300 bg-white px-4 py-3 text-sm font-medium text-stone-900 hover:bg-stone-50"
              >
                Sign in
              </Link>
            </div>
          )}
          {error ? <p className="mt-3 text-sm text-red-700">{error}</p> : null}
        </div>

        <div className="rounded-lg border border-stone-200 bg-stone-50/80 px-4 py-3 text-xs leading-relaxed text-stone-600">
          <p className="font-medium text-stone-800">Heads-up</p>
          <p className="mt-1">
            After you cancel in Stripe, this site may take a short moment to reflect the new status. You can always
            come back here and open the portal again if you need receipts or history.
          </p>
        </div>
      </div>
    </ServiceSubpageFrame>
  );
}
