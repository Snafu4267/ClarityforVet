"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { PUBLIC_ONLY_SITE, SITE_HOOK, SITE_NAME } from "@/lib/site";

const btnOutline =
  "inline-flex min-h-[2.5rem] items-center justify-center rounded-lg border border-zinc-300 bg-white/90 px-4 py-2 text-sm font-medium text-zinc-900 shadow-sm transition hover:border-zinc-400 hover:bg-white";
const btnSolid =
  "inline-flex min-h-[2.5rem] items-center justify-center rounded-lg bg-stone-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-stone-800";

/** Shown on every page so users can always return to the hub. */
export function SiteHomeBar() {
  const router = useRouter();
  const pathname = usePathname() || "/";
  const isHome = pathname === "/";
  const { data: session, status } = useSession();
  const accessRestricted = !PUBLIC_ONLY_SITE && session?.user?.siteAccess === "restricted";

  return (
    <header className="no-print sticky top-0 z-[100] border-b border-stone-200/90 bg-[#f7f6f3]/90 backdrop-blur-md supports-[backdrop-filter]:bg-[#f7f6f3]/75">
      <div className="mx-auto flex min-h-11 max-w-6xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-2 sm:px-6">
        <div className="flex flex-wrap items-center gap-2">
          {!isHome ? (
            <Link
              href="/"
              className="inline-flex min-h-[2.5rem] items-center rounded-lg border border-zinc-300 bg-white/90 px-4 py-2 text-sm font-medium text-zinc-900 shadow-sm transition hover:border-zinc-400 hover:bg-white"
            >
              Home
            </Link>
          ) : null}
          <Link
            href="/"
            className="text-sm font-semibold text-stone-900 transition hover:text-stone-700"
          >
            {SITE_NAME}
          </Link>
        </div>
        <div className="flex w-full flex-wrap items-center justify-between gap-2 sm:ml-auto sm:w-auto sm:justify-end">
          <p className="text-xs leading-snug text-stone-600 sm:max-w-md sm:text-right md:max-w-lg">
            {SITE_HOOK}
          </p>
          <div className="flex min-h-[2.5rem] flex-wrap items-center justify-end gap-2">
            {!isHome ? (
              <>
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="inline-flex min-h-[2.5rem] items-center justify-center rounded-lg border border-zinc-300 bg-white/90 px-4 py-2 text-sm font-medium text-zinc-900 shadow-sm transition hover:border-zinc-400 hover:bg-white"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => router.forward()}
                  className="inline-flex min-h-[2.5rem] items-center justify-center rounded-lg border border-zinc-300 bg-white/90 px-4 py-2 text-sm font-medium text-zinc-900 shadow-sm transition hover:border-zinc-400 hover:bg-white"
                >
                  Forward
                </button>
              </>
            ) : null}
            {PUBLIC_ONLY_SITE && status === "authenticated" ? (
              <button type="button" onClick={() => signOut({ callbackUrl: "/" })} className={btnSolid}>
                Sign out
              </button>
            ) : PUBLIC_ONLY_SITE ? null : accessRestricted && status === "authenticated" ? (
              <>
                <Link href="/stripe" className={btnSolid}>
                  Subscribe
                </Link>
                <button type="button" onClick={() => signOut({ callbackUrl: "/" })} className={btnOutline}>
                  Sign out
                </button>
              </>
            ) : status === "authenticated" ? (
              <>
                <Link href="/invite-vet" className={btnOutline}>
                  Invite a vet
                </Link>
                <Link href="/welcome" className={btnOutline}>
                  Welcome
                </Link>
                <Link href="/welcome#create-account" className={btnOutline}>
                  Register
                </Link>
                <Link href="/login" className={btnOutline}>
                  Sign in
                </Link>
                <button type="button" onClick={() => signOut({ callbackUrl: "/" })} className={btnSolid}>
                  Sign out
                </button>
              </>
            ) : status === "unauthenticated" ? (
              <>
                <Link href="/welcome" className={btnOutline}>
                  Welcome
                </Link>
                <Link href="/welcome#create-account" className={btnOutline}>
                  Register
                </Link>
                <Link href="/login" className={btnSolid}>
                  Sign in
                </Link>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}
