import { vaFormsHubCatchAll, vaFormsHubGroups } from "@/data/va-forms-hub";
import type { VaFormGuideId } from "@/data/va-form-guides";
import { VaFormGuideButtons } from "@/components/VaFormGuideButtons";
import { VaFormSearchBox } from "@/components/VaFormSearchBox";

const linkBtn =
  "inline-flex items-center rounded-md border border-blue-200 bg-white px-3 py-1.5 text-xs font-semibold text-blue-900 shadow-sm transition hover:border-blue-300 hover:bg-blue-50/80 sm:text-sm";
const linkSecondary =
  "inline-flex items-center rounded-md border border-stone-200 bg-stone-50/90 px-3 py-1.5 text-xs font-medium text-stone-800 shadow-sm transition hover:border-stone-300 hover:bg-stone-100/90 sm:text-sm";

type WorksheetAction = { guideId: VaFormGuideId; label: string };

export function VaFormsHub({ worksheetActions }: { worksheetActions?: WorksheetAction[] }) {
  return (
    <section
      className="rounded-2xl border border-amber-200/90 bg-gradient-to-b from-amber-50/40 via-white to-stone-50/95 p-5 shadow-md ring-1 ring-amber-100/70 sm:p-6"
      aria-labelledby="va-forms-hub-heading"
    >
      <h2
        id="va-forms-hub-heading"
        className="text-lg font-semibold tracking-tight text-stone-900 sm:text-xl"
      >
        Forms &amp; helpers — all in one block
      </h2>

      <ul className="mt-3 list-inside list-disc space-y-1.5 text-sm leading-relaxed text-stone-700 marker:text-amber-800/80">
        <li>
          <span className="font-medium text-stone-900">Official forms:</span> use{" "}
          <span className="font-medium text-stone-900">Printable PDF</span> for a direct file, or{" "}
          <span className="font-medium text-stone-900">VA form page</span> when VA only posts the download
          there. We link to VA/GSA—we don’t host the files.
        </li>
        <li>
          <span className="font-medium text-stone-900">DD Form 214</span> is usually the separation paper you
          already have. <span className="font-medium text-stone-900">SF 180</span> is for requesting personnel
          record copies from the federal records process.
        </li>
      </ul>

      {worksheetActions && worksheetActions.length > 0 ? (
        <div className="mt-6 rounded-xl border border-stone-200/90 bg-white/80 px-4 py-4 shadow-sm">
          <h3 className="text-sm font-semibold text-stone-900">Quick-open official forms</h3>
          <p className="mt-2 text-sm leading-relaxed text-stone-600">
            These buttons open the official form source directly (PDF when available, otherwise the official form page).
          </p>
          <VaFormGuideButtons actions={worksheetActions} />
        </div>
      ) : null}

      <h3 className="mt-8 text-base font-semibold text-stone-900">Official VA &amp; related forms (print or form page)</h3>
      <p className="mt-1 text-sm text-stone-600">
        Pick your lane and open the form you need.
      </p>

      <div className="mt-4 flex flex-col gap-8">
        {vaFormsHubGroups.map((g) => (
          <div key={g.id}>
            <h4 className="text-base font-semibold text-stone-900">{g.title}</h4>
            {g.blurb ? <p className="mt-1 text-sm leading-relaxed text-stone-600">{g.blurb}</p> : null}
            <ul className="mt-3 flex flex-col gap-3">
              {g.items.map((item) => (
                <li
                  key={`${g.id}-${item.form}`}
                  className="rounded-lg border border-stone-200/90 bg-white/90 px-3 py-3 text-sm shadow-sm"
                >
                  <p className="font-semibold text-stone-900">{item.form}</p>
                  <p className="mt-0.5 leading-snug text-stone-600">{item.name}</p>
                  <p className="mt-1 text-xs leading-relaxed text-stone-600">
                    Use this form when you need to complete {item.form} for {item.name}.
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {item.pdfUrl ? (
                      <a
                        className={linkBtn}
                        href={item.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Printable PDF
                      </a>
                    ) : null}
                    {item.pageUrl ? (
                      <a
                        className={item.pdfUrl ? linkSecondary : linkBtn}
                        href={item.pageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {item.pdfUrl ? "VA form page (also)" : "VA form page"}
                      </a>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-8 border-t border-stone-200/90 pt-6">
        <h3 className="text-base font-semibold text-stone-900">If you still need a door</h3>
        <p className="mt-1 text-sm text-stone-600">
          Search, main hubs, and help—so you are not stuck guessing where to go next.
        </p>
        <VaFormSearchBox />
        <ul className="mt-3 flex flex-col gap-2.5 text-sm">
          {vaFormsHubCatchAll.map((x) => (
            <li key={x.url}>
              <a
                className="font-medium text-blue-800 underline decoration-blue-200 underline-offset-2 hover:decoration-blue-600"
                href={x.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {x.label}
              </a>
              {x.note ? <span className="text-stone-500"> — {x.note}</span> : null}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
