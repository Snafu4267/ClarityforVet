import Link from "next/link";
import { getCfrHintForConditionText } from "@/data/cfr-condition-hints";

type Props = { condition: string };

export function VetSheetRatingRowHints({ condition }: Props) {
  const hint = getCfrHintForConditionText(condition);
  if (!hint) return null;
  const exampleLinks = hint.links.filter((link) => link.label.toLowerCase().startsWith("example:"));
  const mainLinks = hint.links.filter((link) => !link.label.toLowerCase().startsWith("example:"));
  const related = hint.relatedQuestionLinks ?? [];

  return (
    <div className="w-full rounded-md border border-sky-200/80 bg-sky-50/50 px-2.5 py-2 text-xs leading-relaxed text-slate-800 no-print">
      <p className="font-semibold text-slate-900">{hint.title}</p>
      {hint.lines.map((line, i) => (
        <p key={i} className="mt-1 text-slate-700">
          {line}
        </p>
      ))}
      <div className="mt-2 flex flex-wrap gap-1.5">
        {mainLinks.map((link) =>
          link.kind === "internal" ? (
            <Link
              key={link.href + link.label}
              href={link.href}
              className="inline-flex items-center justify-center rounded-md border border-dashed border-sky-500/70 bg-white px-2 py-1.5 text-[0.7rem] font-semibold text-sky-950 transition hover:bg-sky-50 sm:text-xs"
            >
              {link.label}
            </Link>
          ) : (
            <a
              key={link.href + link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-md border border-slate-300 bg-white px-2 py-1.5 text-[0.7rem] font-semibold text-slate-800 shadow-sm transition hover:border-slate-400 hover:bg-slate-50 sm:text-xs"
            >
              {link.label}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          ),
        )}
      </div>
      {exampleLinks.length > 0 ? (
        <div className="mt-2 border-t border-sky-200/80 pt-2">
          <p className="text-[0.72rem] font-medium text-slate-700">Quick example (visual aid):</p>
          <div className="mt-1 flex flex-wrap gap-1.5">
            {exampleLinks.map((link) => (
              <Link
                key={link.href + link.label}
                href={link.href}
                className="inline-flex items-center justify-center rounded-md border border-dashed border-sky-500/70 bg-white px-2 py-1.5 text-[0.7rem] font-semibold text-sky-950 transition hover:bg-sky-50 sm:text-xs"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
      {related.length > 0 ? (
        <div className="mt-2 border-t border-sky-200/80 pt-2">
          <p className="text-[0.72rem] font-medium text-slate-700">
            This can also connect to these issues — ask your doctor (we are not diagnosing):
          </p>
          <div className="mt-1 flex flex-wrap gap-1.5">
            {related.map((link) =>
              link.kind === "internal" ? (
                <Link
                  key={link.href + link.label}
                  href={link.href}
                  className="inline-flex items-center justify-center rounded-md border border-dashed border-sky-500/70 bg-white px-2 py-1.5 text-[0.7rem] font-semibold text-sky-950 transition hover:bg-sky-50 sm:text-xs"
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.href + link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-md border border-slate-300 bg-white px-2 py-1.5 text-[0.7rem] font-semibold text-slate-800 shadow-sm transition hover:border-slate-400 hover:bg-slate-50 sm:text-xs"
                >
                  {link.label}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              ),
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
