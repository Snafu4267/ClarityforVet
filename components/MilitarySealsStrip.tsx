import { SITE_NAME } from "@/lib/site";

/**
 * U.S. military department emblems (public-domain U.S. government works; vendored from Wikimedia Commons
 * under `public/seals/` so paths stay stable—Commons URLs/hash paths change and break hotlinks).
 * Displayed as a tribute strip—not an endorsement by DoD.
 */
const SEALS: { label: string; title: string; src: string }[] = [
  {
    label: "Army",
    title: "U.S. Department of the Army seal",
    src: "/seals/army.svg",
  },
  {
    label: "Marine Corps",
    title: "U.S. Marine Corps emblem",
    src: "/seals/marine-corps.svg",
  },
  {
    label: "Navy",
    title: "U.S. Department of the Navy seal",
    src: "/seals/navy.svg",
  },
  {
    label: "Air Force",
    title: "U.S. Department of the Air Force seal",
    src: "/seals/air-force.svg",
  },
  {
    label: "Space Force",
    title: "U.S. Space Force emblem",
    src: "/seals/space-force.svg",
  },
  {
    label: "Coast Guard",
    title: "U.S. Coast Guard seal",
    src: "/seals/coast-guard.svg",
  },
];

type StripProps = {
  /** Inside a parent card—drop heavy borders so it doesn’t fight the wrapper */
  embedded?: boolean;
};

export function MilitarySealsStrip({ embedded = false }: StripProps) {
  return (
    <div
      className={`flex flex-col items-center gap-3 backdrop-blur-[2px] ${
        embedded
          ? "border-t border-stone-200/60 bg-transparent py-5"
          : "border-y border-stone-200/80 bg-white/40 py-6"
      }`}
    >
      <p className="text-center text-[0.65rem] font-medium uppercase tracking-[0.2em] text-stone-500">
        All branches · One community
      </p>
      <ul
        className="flex max-w-xl flex-wrap items-center justify-center gap-x-6 gap-y-5 sm:max-w-none sm:gap-x-8"
        aria-label="U.S. military department emblems"
      >
        {SEALS.map((s) => (
          <li key={s.label} className="group flex flex-col items-center gap-1.5">
            {/* eslint-disable-next-line @next/next/no-img-element -- public-domain SVGs from Commons */}
            <img
              src={s.src}
              alt={s.title}
              width={56}
              height={56}
              className="h-12 w-12 object-contain opacity-[0.72] transition duration-300 ease-out group-hover:opacity-100 sm:h-14 sm:w-14"
            />
            <span className="text-center text-[0.65rem] font-medium text-stone-500 transition group-hover:text-stone-700">
              {s.label}
            </span>
          </li>
        ))}
      </ul>
      <p className="max-w-md text-center text-[0.7rem] leading-snug text-stone-400">
        Emblems are public U.S. government works, shown in recognition of those who served.{" "}
        {SITE_NAME} is not an official DoD or VA website.
      </p>
    </div>
  );
}
