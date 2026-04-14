"use client";

import Link from "next/link";
import { SITE_HOOK, SITE_NAME } from "@/lib/site";

/** Shown on every page so users can always return to the hub. */
export function SiteHomeBar() {
  return (
    <header className="no-print sticky top-0 z-[100] border-b border-stone-200/90 bg-[#f7f6f3]/90 backdrop-blur-md supports-[backdrop-filter]:bg-[#f7f6f3]/75">
      <div className="mx-auto flex min-h-11 max-w-5xl flex-wrap items-center gap-x-4 gap-y-1 px-4 py-2 sm:px-6">
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/"
            className="inline-flex min-h-[2.25rem] items-center rounded-md border border-stone-200/90 bg-white/80 px-3 py-1.5 text-sm font-medium text-stone-800 shadow-sm transition hover:border-stone-300 hover:bg-white"
          >
            Home
          </Link>
          <Link
            href="/"
            className="text-sm font-semibold text-stone-900 transition hover:text-stone-700"
          >
            {SITE_NAME}
          </Link>
        </div>
        <p className="w-full text-xs leading-snug text-stone-600 sm:ml-auto sm:w-auto sm:max-w-md sm:text-right md:max-w-lg">
          {SITE_HOOK}
        </p>
      </div>
    </header>
  );
}
