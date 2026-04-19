"use client";

import { EducationalFooter } from "@/components/EducationalFooter";
import { PageAccent } from "@/components/PageAccent";
import { ServiceSubpageFrame } from "@/components/ServiceSubpageFrame";
import { SITE_NAME } from "@/lib/site";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";

const secondaryBtn =
  "inline-flex min-h-12 w-full items-center justify-center rounded-lg border border-stone-300 bg-white px-4 text-sm font-medium text-stone-800 shadow-sm transition hover:border-stone-400 hover:bg-stone-50 disabled:pointer-events-none disabled:opacity-60";

export default function InviteVetPage() {
  const { data: session, status } = useSession();
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (status !== "authenticated" || !session?.user) return;
    if (session.user.siteAccess === "restricted") return;
    let cancelled = false;
    (async () => {
      setLoadError(null);
      const res = await fetch("/api/invite-code");
      const data = (await res.json()) as { inviteCode?: string; error?: string };
      if (cancelled) return;
      if (!res.ok) {
        setLoadError(data.error ?? "Could not load your code.");
        return;
      }
      if (data.inviteCode) setInviteCode(data.inviteCode);
    })();
    return () => {
      cancelled = true;
    };
  }, [status, session?.user]);

  const copyInvite = useCallback(async () => {
    if (!inviteCode) return;
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const text = `Join me on ${SITE_NAME}. Use my code when you create your account: ${inviteCode}\n${origin}/welcome?code=${inviteCode}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }, [inviteCode]);

  return (
    <ServiceSubpageFrame>
      <PageAccent className="page-accent-vet-sheet" />
      <div className="relative z-10 mx-auto flex w-full max-w-xl flex-col gap-8 px-6 py-12 pb-20">
        <header className="flex flex-col gap-3">
          <p className="text-sm text-stone-500">
            <Link href="/" className="font-medium text-slate-800 underline decoration-stone-300 underline-offset-2">
              Home
            </Link>
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-stone-900">Invite a vet</h1>
          <p className="text-sm leading-relaxed text-stone-700">
            This page opens after you sign in. Your code is tied to your account so we know who shared it. Pass it on
            only when you truly think it could help someone on their journey—no pressure.
          </p>
          <p className="rounded-lg border border-amber-200/80 bg-amber-50/90 px-3 py-2 text-sm leading-relaxed text-stone-800">
            <strong className="font-semibold text-stone-900">Rewards:</strong> every vet who signs up with your code
            earns you <strong className="font-semibold text-stone-900">one month free</strong> on your membership, up to{" "}
            <strong className="font-semibold text-stone-900">12 months total</strong>.
          </p>
        </header>

        {status === "loading" ? (
          <p className="text-sm text-stone-600">Loading…</p>
        ) : status === "authenticated" && session?.user?.siteAccess === "restricted" ? (
          <div className="rounded-2xl border border-stone-200/90 bg-white px-5 py-6 shadow-sm ring-1 ring-stone-100/80">
            <p className="text-sm font-semibold text-stone-900">Trial ended — subscribe for full access</p>
            <p className="mt-2 text-sm leading-relaxed text-stone-600">
              Invite-a-vet is included with full access. Subscribe to bring back this tool and the private family log.
            </p>
            <Link
              href="/stripe"
              className="mt-4 inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-stone-900 px-4 text-sm font-medium text-white transition hover:bg-stone-800"
            >
              View subscription
            </Link>
          </div>
        ) : status === "unauthenticated" ? (
          <div className="rounded-2xl border border-stone-200/90 bg-white px-5 py-6 shadow-sm ring-1 ring-stone-100/80">
            <p className="text-sm text-stone-700">
              Sign in first—then your personal invite code appears here. New accounts can enter a friend&apos;s code on
              the Welcome page when they register.
            </p>
            <Link
              href="/login?callbackUrl=/invite-vet"
              className="mt-4 inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-stone-900 px-4 text-sm font-medium text-white transition hover:bg-stone-800"
            >
              Sign in
            </Link>
          </div>
        ) : loadError ? (
          <p className="text-sm text-red-700">{loadError}</p>
        ) : inviteCode ? (
          <div className="rounded-2xl border border-stone-200/90 bg-white px-5 py-6 shadow-sm ring-1 ring-stone-100/80">
            <p className="text-xs font-medium uppercase tracking-wide text-stone-500">Your code</p>
            <p className="mt-1 font-mono text-xl font-semibold tracking-wider text-stone-900">{inviteCode}</p>
            <p className="mt-3 text-xs leading-relaxed text-stone-500">
              They enter this when they create an account, or open your link so it fills in for them.
            </p>
            <button type="button" onClick={() => void copyInvite()} className={`${secondaryBtn} mt-4 !min-h-11 text-sm`}>
              {copied ? "Copied" : "Copy message + link"}
            </button>
          </div>
        ) : (
          <p className="text-sm text-stone-600">Preparing your code…</p>
        )}

        <p className="text-xs leading-relaxed text-stone-500">
          Not affiliated with VA or DoD. Rewards are subject to the terms you publish on the site when you enable them
          in billing.
        </p>

        <EducationalFooter variant="full" />
      </div>
    </ServiceSubpageFrame>
  );
}
