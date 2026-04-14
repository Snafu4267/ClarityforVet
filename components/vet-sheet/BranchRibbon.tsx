import { branchLabel, type BranchId } from "./branchData";

const SEAL_SRC: Record<Exclude<BranchId, "">, string> = {
  army: "/seals/army.svg",
  marines: "/seals/marine-corps.svg",
  navy: "/seals/navy.svg",
  "air-force": "/seals/air-force.svg",
  "coast-guard": "/seals/coast-guard.svg",
  "space-force": "/seals/space-force.svg",
};

type Props = { branch: Exclude<BranchId, ""> };

/** Decorative strip under the page header — branch seal + short line (not a “gallery”). */
export function BranchRibbon({ branch }: Props) {
  const src = SEAL_SRC[branch];
  const label = branchLabel(branch);

  return (
    <div
      className={`no-print flex flex-col gap-4 rounded-2xl border border-stone-200/90 bg-white/80 px-5 py-5 shadow-sm ring-1 ring-stone-100/80 sm:flex-row sm:items-center sm:gap-6 sm:px-7 sm:py-6`}
    >
      <div className="flex shrink-0 items-center justify-center sm:justify-start">
        {/* eslint-disable-next-line @next/next/no-img-element -- local SVG seal */}
        <img src={src} alt="" className="h-16 w-16 object-contain sm:h-20 sm:w-20" />
      </div>
      <div className="min-w-0 flex-1 text-center sm:text-left">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-stone-500">{label}</p>
        <p className="mt-1 text-lg font-semibold tracking-tight text-stone-900 sm:text-xl">
          Your branch, more than one chapter
        </p>
        <p className="mt-2 text-sm leading-relaxed text-stone-600">
          Branch colors and seal frame this sheet—context only, not your DD-214. Your fields come next;
          after those, a <span className="font-medium text-stone-800">Learn</span> shortcut on ratings,
          secondaries, and <span className="font-medium text-stone-800">38 CFR</span>.
        </p>
      </div>
    </div>
  );
}
