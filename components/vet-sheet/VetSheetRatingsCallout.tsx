import Link from "next/link";
import { BRANCH_FORM_STRIP, branchLabel, type BranchId } from "./branchData";

/** Official VA.gov page with the embedded combined disability rating calculator and combined ratings table. */
const VA_COMBINED_RATINGS_URL = "https://www.va.gov/disability/about-disability-ratings/" as const;

/** Replaces the old photo “service snapshots” strip — VA calculator link plus on-site CFR / secondary learn topic. */
export function VetSheetRatingsCallout({ branch }: { branch: Exclude<BranchId, ""> }) {
  return (
    <section
      className={`no-print flex flex-col gap-4 rounded-2xl p-5 sm:p-7 ${BRANCH_FORM_STRIP[branch]}`}
      aria-label="Combined disability ratings — VA calculator and learn topic"
    >
      <header className="flex flex-col gap-2 border-b border-stone-200/90 pb-4">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-slate-500">
          {branchLabel(branch)}
        </p>
        <h2 className="text-lg font-semibold leading-snug tracking-tight text-slate-900 sm:text-xl">
          Combined ratings — use VA’s official calculator
        </h2>
        <p className="text-sm leading-relaxed text-slate-600">
          The Department of Veterans Affairs hosts a <span className="font-medium text-slate-800">combined disability rating</span>{" "}
          calculator on its public site (same page as the official combined ratings table). That is the real tool—not a guess on this
          site. For <span className="font-medium text-slate-800">secondary</span> claims and how{" "}
          <span className="font-medium text-slate-800">38 CFR</span> fits in, use the second button for a plain-language topic on
          this site—still not medical or legal advice.
        </p>
      </header>
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <a
          href={VA_COMBINED_RATINGS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-[2.75rem] w-full items-center justify-center rounded-lg bg-slate-800 px-4 py-3 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-slate-900 sm:w-auto sm:self-start"
        >
          Open VA.gov — combined rating calculator
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
        <Link
          href="/learn/ratings-connection"
          className="inline-flex min-h-[2.75rem] w-full items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-3 text-center text-sm font-semibold text-slate-800 shadow-sm transition hover:border-slate-400 hover:bg-slate-50 sm:w-auto sm:self-start"
        >
          On this site: ratings, secondaries &amp; CFR
        </Link>
      </div>
    </section>
  );
}
