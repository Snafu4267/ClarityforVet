import Link from "next/link";
import { useSession } from "next-auth/react";
import { PUBLIC_ONLY_SITE } from "@/lib/site";
import { LEARN_FIND_ANY, LEARN_TINNITUS } from "@/data/cfr-condition-hints";
import { CFR_3_310_SECONDARY, CFR_4_87_EAR, CFR_PART_4_ROOT } from "@/data/cfr-links";
import { VetSheetRatingRowHints } from "@/components/vet-sheet/VetSheetRatingRowHints";
import { BRANCH_FORM_STRIP, branchLabel, isBranchChosen, type BranchId } from "./branchData";

/** Curated jump links + plain-language setup — avoids raw eCFR haystack scrolling. */
const CFR_MAP_HREF = "/learn/ratings-connection#cfr-map" as const;

/** Matches the main form card when no branch is chosen yet. */
const NEUTRAL_RATING_CARD = "border-2 border-stone-300 bg-white text-stone-900 shadow-sm";

export type VetSheetRatingRow = {
  id: string;
  /** VA-style percentage (user picks from list or leaves blank). */
  percent: string;
  /** Short label for what the rating is for — user’s own words / VA wording. */
  condition: string;
};

type Props = {
  /** Decorative strip; neutral card if branch not chosen yet. */
  branch: BranchId;
  rows: VetSheetRatingRow[];
  onRowsChange: (rows: VetSheetRatingRow[]) => void;
  inputClass: string;
  selectClass: string;
};

const PERCENT_OPTIONS = ["", "0", "10", "20", "30", "40", "50", "60", "70", "80", "90", "100"] as const;

function newRow(): VetSheetRatingRow {
  return {
    id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `row-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    percent: "",
    condition: "",
  };
}

export function VetSheetMyRatings({ branch, rows, onRowsChange, inputClass, selectClass }: Props) {
  const { data: session } = useSession();
  const cardShell = isBranchChosen(branch) ? BRANCH_FORM_STRIP[branch] : NEUTRAL_RATING_CARD;
  const genericOnly = PUBLIC_ONLY_SITE || session?.user?.siteAccess === "restricted";
  const branchEyebrow = isBranchChosen(branch)
    ? branchLabel(branch)
    : "Pick your branch above to match this card to your service (optional)";
  function updateRow(id: string, patch: Partial<Pick<VetSheetRatingRow, "percent" | "condition">>) {
    onRowsChange(rows.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

  function addRow() {
    onRowsChange([...rows, newRow()]);
  }

  function removeRow(id: string) {
    if (rows.length <= 1) {
      onRowsChange([newRow()]);
      return;
    }
    onRowsChange(rows.filter((r) => r.id !== id));
  }

  return (
    <section
      className={`flex flex-col gap-4 rounded-2xl p-5 sm:p-7 ${cardShell}`}
      aria-label="Your service-connected ratings — notes for questions to ask your doctor"
    >
      <header className="flex flex-col gap-2 border-b border-stone-200/90 pb-4">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-slate-500">{branchEyebrow}</p>
        <h2 className="text-lg font-semibold leading-snug tracking-tight text-slate-900 sm:text-xl">
          Your ratings — for your own notes
        </h2>
      </header>

      <div className="rounded-lg border border-amber-200/90 bg-amber-50/80 px-3 py-3 text-sm leading-relaxed text-amber-950 shadow-sm">
        <p className="font-semibold text-amber-950">Read this before you type anything.</p>
        <p className="mt-2">
          <strong>We are not doctors.</strong> We are <strong>not</strong> saying you have any illness or injury, and we are{" "}
          <strong>not</strong> telling you what VA will decide. This site does <strong>not</strong> diagnose you and does{" "}
          <strong>not</strong> give medical or legal advice.
        </p>
        <p className="mt-2">
          The only thing we are trying to do here is give you a place to jot what <strong>you already know</strong> from your
          own records or letters—so you can turn that into <strong>questions to ask your treating clinician</strong> or an{" "}
          <strong>accredited representative</strong>. If a question belongs in an exam room or with someone qualified to read
          your file, take it there—not from a website box.
        </p>
      </div>

      <p className="text-sm leading-relaxed text-slate-600">
        List each <span className="font-medium text-slate-800">percentage</span> and what it is{" "}
        <span className="font-medium text-slate-800">for</span> (use the same short names you use with your doctor or what VA
        put on your paperwork).         <span className="font-medium text-slate-800">Each line</span> shows{" "}
        <span className="font-medium text-slate-800">the same CFR help</span> once you type something: guides on this site, §
        3.310, Part 4, and a Google search of eCFR using your words. If we recognize common words (tinnitus, gout, TBI,
        etc.), we add suggested § links—never instead of the universal path. Add rows if you
        have more than one. Still only your notes—same privacy as the rest of this sheet (this device only).
      </p>

      <div className="flex flex-col gap-4">
        {rows.map((row, index) => (
          <div key={row.id} className="flex flex-col gap-2 rounded-lg border border-stone-200/80 bg-white/60 p-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-3">
              <label className="flex min-w-0 flex-1 flex-col gap-1.5 sm:max-w-[8.5rem]">
                <span className="text-sm font-medium text-slate-800">Rating %</span>
                <select
                  className={selectClass}
                  value={row.percent}
                  onChange={(e) => updateRow(row.id, { percent: e.target.value })}
                  aria-label={`Rating percentage, row ${index + 1}`}
                >
                  {PERCENT_OPTIONS.map((p) => (
                    <option key={p || "empty"} value={p}>
                      {p === "" ? "—" : `${p}%`}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex min-w-0 flex-[2] flex-col gap-1.5">
                <span className="text-sm font-medium text-slate-800">What it&apos;s for</span>
                <input
                  type="text"
                  className={inputClass}
                  placeholder="e.g. knee · PTSD · hearing (your words)"
                  value={row.condition}
                  onChange={(e) => updateRow(row.id, { condition: e.target.value })}
                  autoComplete="off"
                  aria-label={`What the rating is for, row ${index + 1}`}
                />
              </label>
              <div className="flex shrink-0 justify-end sm:pb-0.5 no-print">
                <button
                  type="button"
                  onClick={() => removeRow(row.id)}
                  className="rounded-md border border-stone-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-stone-50"
                >
                  Remove
                </button>
              </div>
            </div>
            <VetSheetRatingRowHints condition={row.condition} genericOnly={genericOnly} />
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addRow}
        className="no-print self-start rounded-md border border-dashed border-slate-400 bg-white/80 px-4 py-2 text-sm font-medium text-slate-800 transition hover:border-slate-500 hover:bg-white"
      >
        Add another rating row
      </button>
      <Link
        href="/stripe"
        className="no-print inline-flex min-h-11 items-center justify-center self-start rounded-lg bg-stone-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-stone-800"
      >
        Sign in / Upgrade
      </Link>

      {genericOnly ? (
        <div className="border-t border-stone-200/90 pt-4">
          <p className="text-sm text-slate-700">
            Secondary-condition search is available for full membership vets.
          </p>
        </div>
      ) : <div className="border-t border-stone-200/90 pt-4">
        <p className="text-sm font-medium text-slate-800">38 CFR — official rules (for questions, not a verdict)</p>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          The Code of Federal Regulations is what VA points to for <span className="font-medium text-slate-800">how</span>{" "}
          conditions are rated and how <span className="font-medium text-slate-800">secondary</span> connection can work in
          principle. Raw eCFR pages are <strong>long</strong>—finding the right paragraph can feel like a needle in a haystack.
          Start with the <strong>CFR map</strong> on this site: short list of jump links, tips for using <strong>Find</strong>{" "}
          on the page, and framing for <strong>questions for your clinician</strong>—still not a diagnosis and not what you
          “have.”
        </p>
        <p className="mt-3 rounded-md border border-slate-200 bg-slate-50/90 px-3 py-2.5 text-sm leading-relaxed text-slate-700">
          <span className="font-medium text-slate-800">Words you might use with your clinician:</span> “According to{" "}
          <span className="font-medium text-slate-800">38 CFR</span>, could we review{" "}
          <span className="font-medium text-slate-800">[the section that fits my question—e.g. § 3.310 or Part 4]</span>{" "}
          together so my questions line up with what VA cites?” They choose how to respond—we are{" "}
          <span className="font-medium text-slate-800">not</span> giving medical orders.
        </p>
        <p className="mt-2 hidden font-mono text-[0.65rem] leading-snug text-slate-600 print:block">
          CFR map: {CFR_MAP_HREF} · Part 4 doorways: {LEARN_FIND_ANY} · Tinnitus: {LEARN_TINNITUS} · Part 4: {CFR_PART_4_ROOT} ·
          §4.87: {CFR_4_87_EAR} · §3.310: {CFR_3_310_SECONDARY}
        </p>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap no-print">
          <Link
            href={CFR_MAP_HREF}
            className="inline-flex min-h-[2.75rem] w-full items-center justify-center rounded-lg bg-slate-800 px-4 py-3 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-slate-900 sm:w-auto"
          >
            Open CFR map — secondaries &amp; questions for your doctor
          </Link>
          <a
            href={CFR_PART_4_ROOT}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[2.75rem] w-full items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-3 text-center text-sm font-semibold text-slate-800 shadow-sm transition hover:border-slate-400 hover:bg-slate-50 sm:w-auto"
          >
            Part 4 only (full eCFR — use Find)
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
          <a
            href={CFR_3_310_SECONDARY}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[2.75rem] w-full items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-3 text-center text-sm font-semibold text-slate-800 shadow-sm transition hover:border-slate-400 hover:bg-slate-50 sm:w-auto"
          >
            § 3.310 only (eCFR — secondary)
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
      </div>}
    </section>
  );
}
