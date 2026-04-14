import { EducationalFooter } from "@/components/EducationalFooter";
import { SITE_NAME } from "@/lib/site";
import { PageAccent } from "@/components/PageAccent";
import { ServiceSubpageFrame } from "@/components/ServiceSubpageFrame";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: `For family & partners · ${SITE_NAME}`,
  description:
    "Why the private family log exists—for spouses and loved ones supporting a veteran, and a note for veterans.",
};

export default function SpouseFamilyInstructionsPage() {
  return (
    <ServiceSubpageFrame>
      <PageAccent className="page-accent-spouse-instructions" />
      <div className="relative z-10 mx-auto flex w-full max-w-2xl flex-col gap-10 px-6 py-12 pb-20">
      <header className="flex flex-col gap-3">
        <p className="text-sm text-stone-500">
          <Link href="/tools/spouse-log" className="underline decoration-stone-300 underline-offset-4">
            Private family log
          </Link>
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">
          Why this space is here
        </h1>
        <p className="text-sm text-stone-600">
          A short read before you open the log—not rules, just context. Nothing here is medical or
          legal advice.
        </p>
      </header>

      <article className="flex flex-col gap-6 rounded-2xl border border-amber-200/80 bg-gradient-to-b from-amber-50/60 to-white px-5 py-6 shadow-sm ring-1 ring-amber-100/50 sm:px-7 sm:py-8">
        <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-amber-900/70">
          If you&apos;re a spouse, partner, or family member
        </h2>
        <div className="space-y-4 text-sm leading-relaxed text-stone-700">
          <p>
            Supporting someone you love through stress or transition can leave you holding a lot
            inside—details, dates, what was said in the waiting room, what shifted from one week to
            the next. That weight often has nowhere polite to land, because you don&apos;t want to
            sound like you&apos;re complaining when someone you care about is already carrying so
            much.
          </p>
          <p>
            This corner of {SITE_NAME} is <span className="font-medium text-stone-800">for you</span>.
            The private log is a place to write what you noticed, what you need to remember, and
            what felt hard or hopeful—without turning you into a file clerk or a substitute for
            professional care. It doesn&apos;t diagnose anything; it simply gives your side of the
            story a shelf so it isn&apos;t all swimming in your head at 2 a.m.
          </p>
          <p>
            When memory is tired or emotions run high, timelines get fuzzy for everyone. A simple
            written trail—what happened, when, how it felt—can help later when you&apos;re trying to
            explain, plan, or just make sense of the arc you&apos;ve been walking together. You might
            use this tool, or a paper notebook, or a notes app you already trust. What matters is
            giving words to what you&apos;re carrying: naming it out loud (on the page) often makes
            the burden a little lighter than keeping it only in silence.
          </p>
        </div>

        <div className="border-t border-amber-200/70 pt-6">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
            For the veteran
          </p>
          <p className="mt-3 text-sm font-bold leading-relaxed text-stone-900">
            Your spouse, significant other, or family are often your first line of support. They love
            you and want what&apos;s best for you—not to take over your story, but because your
            wellbeing sits at the center of their world. If they keep notes here, it&apos;s to
            remember alongside you and lighten the mental load when life feels crowded—not to
            replace your voice. And if they never use this at all, that&apos;s okay: the same idea
            still holds—writing things down can get a weight off your shoulders later, when the days
            blur together and you need a clear thread to hold onto.
          </p>
        </div>
      </article>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <Link
          href="/tools/spouse-log"
          className="inline-flex items-center justify-center rounded-lg bg-slate-800 px-5 py-3 text-center text-sm font-medium text-white shadow-sm transition hover:bg-slate-900"
        >
          Continue to the private family log
        </Link>
        <Link
          href="/welcome"
          className="inline-flex items-center justify-center rounded-lg border border-stone-300 bg-white px-5 py-3 text-center text-sm font-medium text-stone-800 transition hover:border-stone-400 hover:bg-stone-50"
        >
          Create an account
        </Link>
        <Link
          href="/login?callbackUrl=/tools/spouse-log"
          className="text-center text-sm text-slate-800 underline decoration-slate-300 underline-offset-2 sm:text-left"
        >
          Sign in
        </Link>
      </div>

      <EducationalFooter variant="compact" />
      </div>
    </ServiceSubpageFrame>
  );
}
