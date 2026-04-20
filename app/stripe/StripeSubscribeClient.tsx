"use client";

import { PageAccent } from "@/components/PageAccent";
import { ServiceSubpageFrame } from "@/components/ServiceSubpageFrame";
import { SITE_NAME } from "@/lib/site";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useRef, useState } from "react";

export function StripeSubscribeClient() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const checkout = searchParams.get("checkout");
  const checkoutSessionId = searchParams.get("session_id");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [syncingReturn, setSyncingReturn] = useState(false);
  const attemptedSyncSessionIdsRef = useRef(new Set<string>());

  useEffect(() => {
    if (checkout !== "success" || !checkoutSessionId || status !== "authenticated") return;
    if (attemptedSyncSessionIdsRef.current.has(checkoutSessionId)) return;

    let cancelled = false;
    attemptedSyncSessionIdsRef.current.add(checkoutSessionId);
    setSyncingReturn(true);
    setSyncError(null);

    void (async () => {
      try {
        const res = await fetch("/api/stripe/sync-checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId: checkoutSessionId }),
        });
        const data = (await res.json()) as { error?: string };
        if (cancelled) return;
        if (res.ok) {
          router.replace("/stripe?checkout=success");
        } else {
          attemptedSyncSessionIdsRef.current.delete(checkoutSessionId);
          setSyncError(data.error ?? "Could not link this checkout to your account.");
        }
      } catch {
        attemptedSyncSessionIdsRef.current.delete(checkoutSessionId);
        if (!cancelled) setSyncError("Network error. Refresh and try again.");
      } finally {
        if (!cancelled) setSyncingReturn(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [checkout, checkoutSessionId, status, router]);

  const startCheckout = useCallback(async () => {
    setError(null);
    setPending(true);
    try {
      const res = await fetch("/api/stripe/checkout-session", { method: "POST" });
      const raw = await res.text();
      let data: { url?: string; error?: string };
      try {
        data = raw ? (JSON.parse(raw) as { url?: string; error?: string }) : {};
      } catch {
        setError(
          "The app returned a non-JSON response. Is the dev server running (npm run dev), and did you restart it after saving .env.local?",
        );
        setPending(false);
        return;
      }
      if (!res.ok) {
        setError(data.error ?? "Could not start checkout.");
        setPending(false);
        return;
      }
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      setError("No checkout URL returned.");
    } catch {
      setError("Could not reach the server. Check that the dev server is running, then try again.");
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
              href="/unenroll"
              className="font-medium text-slate-800 underline decoration-stone-300 underline-offset-2"
            >
              Unenroll / billing
            </Link>
          </p>
          <h1 className="text-2xl font-semibold text-stone-900">Support {SITE_NAME}</h1>
          <p className="text-sm leading-relaxed text-stone-600">
            Optional paid subscription through Stripe. You stay in control: cancel anytime from the billing portal
            linked on the <Link href="/unenroll" className="font-medium text-blue-800 underline">unenroll</Link> page.
          </p>
        </header>

        {checkout === "success" ? (
          <div className="flex flex-col gap-2">
            <div className="rounded-lg border border-emerald-200 bg-emerald-50/80 px-4 py-3 text-sm text-emerald-950">
              Checkout completed. Thank you for supporting {SITE_NAME}.
              {!checkoutSessionId
                ? " You can use Unenroll / billing anytime to open Stripe’s customer portal."
                : null}
            </div>
            {checkoutSessionId && syncingReturn ? (
              <p className="text-xs text-stone-600">Confirming with Stripe…</p>
            ) : null}
            {syncError ? <p className="text-sm text-red-700">{syncError}</p> : null}
          </div>
        ) : null}
        {checkout === "canceled" ? (
          <div className="rounded-lg border border-amber-200 bg-amber-50/80 px-4 py-3 text-sm text-amber-950">
            Checkout was canceled. No charge was made.
          </div>
        ) : null}

        <div className="rounded-2xl border border-stone-200/90 bg-white/95 px-5 py-6 shadow-sm ring-1 ring-stone-100/80">
          <p className="text-sm font-medium text-stone-900">What you get</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-stone-600">
            <li>Helps keep {SITE_NAME} online and improving.</li>
            <li>The core educational VA links stay available; your support keeps this project sustainable.</li>
            <li>Your feedback directly shapes what we build next.</li>
          </ul>
          <p className="mt-4 text-xs text-stone-500">
            Amount and renewal are set in your Stripe product. We do not store card numbers on this site.
          </p>

          {status === "loading" ? (
            <p className="mt-6 text-sm text-stone-600">Checking your session…</p>
          ) : session ? (
            <div className="mt-6 flex flex-col gap-3">
              <p className="text-sm text-stone-600">
                Signed in as <span className="font-medium text-stone-800">{session.user?.email}</span>
              </p>
              {checkout === "success" ? (
                <div className="flex flex-col gap-2">
                  <Link
                    href="/unenroll"
                    className="inline-flex min-h-12 items-center justify-center rounded-md bg-stone-900 px-4 py-3 text-sm font-medium text-white hover:bg-stone-800"
                  >
                    Manage billing or cancel
                  </Link>
                  <Link
                    href="/"
                    className="text-center text-sm font-medium text-blue-800 underline decoration-blue-200 underline-offset-2"
                  >
                    Back to home
                  </Link>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={startCheckout}
                  disabled={pending}
                  className="rounded-md bg-stone-900 px-4 py-3 text-sm font-medium text-white hover:bg-stone-800 disabled:opacity-60"
                >
                  {pending ? "Redirecting to Stripe…" : "Continue to secure checkout"}
                </button>
              )}
            </div>
          ) : (
            <div className="mt-6 flex flex-col gap-3">
              <p className="text-sm text-stone-600">Sign in / Upgrade first so we can attach the subscription to your account.</p>
              <Link
                href="/login?callbackUrl=/stripe"
                className="inline-flex min-h-12 items-center justify-center rounded-md border border-stone-300 bg-white px-4 py-3 text-sm font-medium text-stone-900 hover:bg-stone-50"
              >
                Sign in / Upgrade
              </Link>
              <Link
                href="/welcome"
                className="text-center text-sm font-medium text-blue-800 underline decoration-blue-200 underline-offset-2"
              >
                Create account
              </Link>
            </div>
          )}

          {error ? <p className="mt-3 text-sm text-red-700">{error}</p> : null}
        </div>

        <p className="text-center text-xs text-stone-500">
          Questions about billing? Use the portal on the unenroll page or contact us through your usual support channel.
        </p>
      </div>
    </ServiceSubpageFrame>
  );
}
