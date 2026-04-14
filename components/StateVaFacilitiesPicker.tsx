"use client";

import { bigSurfaceCardClass } from "@/lib/big-nav-card";
import { US_STATES_FOR_VA_FACILITIES_PICKER } from "@/lib/us-states";
import { useRouter } from "next/navigation";
import { useId, useState } from "react";

/**
 * Home-page control: pick a state → `/va-facilities/[code]` (Texas redirects to `/texas`).
 */
export function StateVaFacilitiesPicker() {
  const router = useRouter();
  const selectId = useId();
  const [code, setCode] = useState("");
  const [pending, setPending] = useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!code) return;
    setPending(true);
    router.push(`/va-facilities/${code.toLowerCase()}`);
  }

  return (
    <form onSubmit={onSubmit} className={bigSurfaceCardClass}>
      <p className="font-semibold text-zinc-900">Local VA facilities by state</p>
      <p className="mt-1 text-sm text-zinc-600">
        Map and facility list by state (ZIP distances where data allows). Texas uses this site&apos;s directory; other
        states use public VHA data—confirm phones and hours on <span className="font-medium text-zinc-800">VA.gov</span>.
      </p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="relative min-w-0 flex-1">
          <label htmlFor={selectId} className="sr-only">
            State
          </label>
          {/* appearance-none removes the OS gold frame around the state dropdown on Windows/Chrome */}
          <select
            id={selectId}
            name="state"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="min-h-11 w-full appearance-none rounded-lg border border-zinc-200/90 bg-white py-2 pl-3 pr-10 text-sm text-zinc-900 shadow-sm outline-none transition-colors focus:border-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-100/90"
            required
          >
            <option value="">Select your state…</option>
            {US_STATES_FOR_VA_FACILITIES_PICKER.map((s) => (
              <option key={s.code} value={s.code}>
                {s.name}
              </option>
            ))}
          </select>
          <span
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500"
            aria-hidden
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
        <button
          type="submit"
          disabled={!code || pending}
          className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-lg bg-slate-800 px-5 text-sm font-medium text-white shadow-sm transition hover:bg-slate-900 disabled:pointer-events-none disabled:opacity-50"
        >
          {pending ? "Opening…" : "Continue"}
        </button>
      </div>
    </form>
  );
}
