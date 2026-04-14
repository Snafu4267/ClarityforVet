import type { VaFormGuideId } from "@/data/va-form-guides";
import { SITE_NAME } from "@/lib/site";

export function VaFormGuideButtons({
  actions,
}: {
  actions: { guideId: VaFormGuideId; label: string }[];
}) {
  return (
    <ul className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
      {actions.map((a) => (
        <li key={a.guideId}>
          <a
            href={`/api/va-form-guide?guide=${encodeURIComponent(a.guideId)}`}
            target="_blank"
            rel="noopener noreferrer"
            title={`Opens ${SITE_NAME} practice worksheet (not an official VA form) in a new tab`}
            className="inline-flex min-h-[2.75rem] items-center justify-center rounded-lg border border-amber-300/90 bg-amber-50/90 px-4 py-2.5 text-left text-sm font-semibold leading-snug text-amber-950 shadow-sm transition hover:border-amber-400 hover:bg-amber-100/90 sm:min-h-0 sm:text-center"
          >
            {a.label}
          </a>
        </li>
      ))}
    </ul>
  );
}
