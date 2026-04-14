/** Branch ids for vet sheet — decorative themes only, not DoD endorsement. */

export type BranchId = "" | "army" | "marines" | "navy" | "air-force" | "coast-guard" | "space-force";

export const BRANCH_SELECT: { value: BranchId; label: string }[] = [
  { value: "", label: "Choose branch…" },
  { value: "army", label: "U.S. Army" },
  { value: "marines", label: "U.S. Marine Corps" },
  { value: "navy", label: "U.S. Navy" },
  { value: "air-force", label: "U.S. Air Force" },
  { value: "coast-guard", label: "U.S. Coast Guard" },
  { value: "space-force", label: "U.S. Space Force" },
];

export function branchLabel(id: BranchId): string {
  return BRANCH_SELECT.find((b) => b.value === id)?.label ?? "";
}

export type BranchChosen = Exclude<BranchId, "">;

export function isBranchChosen(id: BranchId): id is BranchChosen {
  return id !== "";
}

/**
 * Full-page shell: soft tinted gradient + subtle texture class (globals.css).
 * Background stays quiet—content (cards) carries the page.
 */
export const BRANCH_PAGE: Record<Exclude<BranchId, "">, string> = {
  army:
    "vet-sheet-shell-army bg-gradient-to-b from-[#f7f6f2] via-[#f1f2ec] to-[#e9ebe4] text-slate-800 antialiased",
  marines:
    "vet-sheet-shell-marines bg-gradient-to-b from-[#f4f6f4] via-[#eef1ee] to-[#e6eae6] text-slate-800 antialiased",
  navy: "vet-sheet-shell-navy bg-gradient-to-b from-[#f3f6fa] via-[#edf2f8] to-[#e6edf6] text-slate-800 antialiased",
  "air-force":
    "vet-sheet-shell-air-force bg-gradient-to-b from-[#f2f6fb] via-[#eaf0f9] to-[#e3ebf5] text-slate-800 antialiased",
  "coast-guard":
    "vet-sheet-shell-coast-guard bg-gradient-to-b from-[#f7f9fc] via-[#f1f4f8] to-[#eaeff5] text-slate-800 antialiased",
  "space-force":
    "vet-sheet-shell-space-force bg-gradient-to-b from-[#f3f5f9] via-[#eef2f8] to-[#e8edf6] text-slate-800 antialiased",
};

/** Primary heading underline / emphasis */
export const BRANCH_TITLE: Record<Exclude<BranchId, "">, string> = {
  army: "inline-block text-slate-900 border-b-2 border-amber-800/25 pb-1",
  marines: "inline-block text-slate-900 border-b-2 border-emerald-800/25 pb-1",
  navy: "inline-block text-slate-900 border-b-2 border-blue-800/30 pb-1",
  "air-force": "inline-block text-slate-900 border-b-2 border-sky-700/35 pb-1",
  "coast-guard": "inline-block text-slate-900 border-b-2 border-blue-900/20 pb-1",
  "space-force": "inline-block text-slate-900 border-b-2 border-cyan-700/35 pb-1",
};

/** Muted prose + links */
export const BRANCH_BODY: Record<Exclude<BranchId, "">, string> = {
  army: "text-slate-600",
  marines: "text-slate-600",
  navy: "text-slate-600",
  "air-force": "text-slate-600",
  "coast-guard": "text-slate-600",
  "space-force": "text-slate-600",
};

export const BRANCH_LINK: Record<Exclude<BranchId, "">, string> = {
  army: "text-amber-900/90 underline decoration-amber-800/35 underline-offset-2 hover:text-amber-950",
  marines: "text-emerald-900/90 underline decoration-emerald-800/30 underline-offset-2 hover:text-emerald-950",
  navy: "text-blue-900/90 underline decoration-blue-700/35 underline-offset-2 hover:text-blue-950",
  "air-force": "text-sky-900/90 underline decoration-sky-700/35 underline-offset-2 hover:text-sky-950",
  "coast-guard": "text-blue-950 underline decoration-blue-800/25 underline-offset-2 hover:text-slate-900",
  "space-force": "text-slate-800 underline decoration-cyan-800/35 underline-offset-2 hover:text-slate-950",
};

/** White cards: left accent stripe + soft border */
export const BRANCH_FORM_STRIP: Record<Exclude<BranchId, "">, string> = {
  army: "border border-stone-200/90 bg-white text-stone-900 shadow-sm ring-1 ring-stone-200/60 border-l-4 border-l-amber-800/50",
  marines:
    "border border-stone-200/90 bg-white text-stone-900 shadow-sm ring-1 ring-stone-200/60 border-l-4 border-l-emerald-800/45",
  navy: "border border-stone-200/90 bg-white text-stone-900 shadow-sm ring-1 ring-stone-200/60 border-l-4 border-l-blue-800/45",
  "air-force":
    "border border-stone-200/90 bg-white text-stone-900 shadow-sm ring-1 ring-stone-200/60 border-l-4 border-l-sky-700/45",
  "coast-guard":
    "border border-stone-200/90 bg-white text-stone-900 shadow-sm ring-1 ring-stone-200/60 border-l-4 border-l-blue-900/40",
  "space-force":
    "border border-stone-200/90 bg-white text-stone-900 shadow-sm ring-1 ring-stone-200/60 border-l-4 border-l-cyan-700/50",
};

/** Info / “more in this lane” callouts — white, readable, branch accent stripe */
export const BRANCH_CALLOUT: Record<Exclude<BranchId, "">, string> = {
  army: "border border-stone-200/90 border-l-4 border-l-amber-800/45 bg-white/95 text-slate-700 shadow-sm",
  marines:
    "border border-stone-200/90 border-l-4 border-l-emerald-800/40 bg-white/95 text-slate-700 shadow-sm",
  navy: "border border-stone-200/90 border-l-4 border-l-blue-800/40 bg-white/95 text-slate-700 shadow-sm",
  "air-force":
    "border border-stone-200/90 border-l-4 border-l-sky-700/45 bg-white/95 text-slate-700 shadow-sm",
  "coast-guard":
    "border border-stone-200/90 border-l-4 border-l-blue-900/35 bg-white/95 text-slate-700 shadow-sm",
  "space-force":
    "border border-stone-200/90 border-l-4 border-l-cyan-700/45 bg-white/95 text-slate-700 shadow-sm",
};

/** Focus ring on inputs (paired in page) */
export const BRANCH_FOCUS: Record<Exclude<BranchId, "">, string> = {
  army: "focus:border-amber-700/50 focus:ring-amber-800/15",
  marines: "focus:border-emerald-700/45 focus:ring-emerald-800/12",
  navy: "focus:border-blue-600/50 focus:ring-blue-800/12",
  "air-force": "focus:border-sky-600/50 focus:ring-sky-700/12",
  "coast-guard": "focus:border-blue-700/40 focus:ring-blue-900/10",
  "space-force": "focus:border-cyan-600/45 focus:ring-cyan-800/12",
};
