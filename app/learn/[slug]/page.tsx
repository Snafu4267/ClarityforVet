import { AwarenessBodyText } from "@/components/AwarenessBodyText";
import { EducationalFooter } from "@/components/EducationalFooter";
import { PrintPageButton } from "@/components/PrintPageButton";
import { VaFormGuideButtons } from "@/components/VaFormGuideButtons";
import { PageAccent, learnAccentClass } from "@/components/PageAccent";
import { VaFormsHub } from "@/components/VaFormsHub";
import { evidenceWorksheetActions } from "@/data/va-forms-hub";
import type { AwarenessSection } from "@/data/awareness-modules";
import { awarenessModules, getModule } from "@/data/awareness-modules";
import { SITE_NAME } from "@/lib/site";
import Link from "next/link";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return awarenessModules.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const mod = getModule(slug);
  if (!mod) return { title: "Not found" };
  return {
    title: `${mod.title} — ${SITE_NAME}`,
    description: mod.summary,
  };
}

function SectionBody({ section }: { section: AwarenessSection }) {
  return (
    <div className="space-y-3 text-sm leading-relaxed text-stone-600">
      {section.body.map((p, i) => (
        <p key={i}>
          <AwarenessBodyText text={p} />
        </p>
      ))}
    </div>
  );
}

function HeadingCallout({ text }: { text: string }) {
  return (
    <div
      className="mt-4 rounded-xl border-2 border-amber-500/80 bg-gradient-to-br from-amber-200/50 via-amber-50 to-amber-100/60 px-4 py-5 text-center shadow-md ring-2 ring-amber-400/30 sm:px-6"
      role="note"
    >
      <p className="text-base font-semibold leading-snug tracking-tight text-amber-950 sm:text-lg sm:leading-relaxed">
        <AwarenessBodyText text={text} />
      </p>
    </div>
  );
}

function FormGuideBlock({ actions }: { actions: NonNullable<AwarenessSection["formGuideActions"]> }) {
  return (
    <div className="mt-5 rounded-xl border border-amber-200/80 bg-amber-50/50 px-4 py-4 no-print">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-amber-900/70">
        Form worksheets (PDF)
      </p>
      <VaFormGuideButtons actions={actions} />
    </div>
  );
}

function LinkList({
  links,
  id,
  eyebrow,
}: {
  links: NonNullable<AwarenessSection["links"]>;
  id: string;
  eyebrow?: string;
}) {
  function linkUseLine(label: string): string {
    return `Use this for: ${label}.`;
  }

  return (
    <div className="border-t border-stone-200/90 pt-4">
      <p id={id} className="text-xs font-semibold uppercase tracking-[0.12em] text-stone-500">
        {eyebrow ?? "VA links · this topic only"}
      </p>
      <ul className="mt-3 flex flex-col gap-2.5 text-sm" aria-labelledby={id}>
        {links.map((l) => (
          <li key={l.url}>
            <p className="text-stone-600">{linkUseLine(l.label)}</p>
            <a
              className="text-blue-800 underline decoration-blue-200 underline-offset-2 hover:decoration-blue-600"
              href={l.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default async function LearnModulePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const mod = getModule(slug);
  if (!mod) notFound();

  return (
    <article className="relative print:max-w-none">
      <PageAccent className={learnAccentClass(slug)} />
      <div className="relative z-10 flex flex-col gap-8">
      <header className="flex flex-col gap-3 no-print">
        <p className="text-sm text-stone-500">
          <Link href="/learn" className="underline decoration-stone-300 underline-offset-4 hover:text-stone-700">
            Topics A–Z
          </Link>
        </p>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <h1 className="text-2xl font-semibold tracking-tight text-stone-900">{mod.title}</h1>
          <PrintPageButton />
        </div>
        <p className="text-sm leading-relaxed text-stone-600">{mod.summary}</p>
      </header>

      <header className="hidden flex-col gap-2 print:flex">
        <h1 className="text-xl font-semibold text-stone-900">{mod.title}</h1>
        <p className="text-sm text-stone-600">{mod.summary}</p>
      </header>

      <div className="flex flex-col gap-8">
        {slug === "evidence" ? <VaFormsHub worksheetActions={evidenceWorksheetActions} /> : null}
        {mod.sections.map((s, idx) => {
          const key = `${s.heading}-${idx}`;
          const hasLinks = s.links && s.links.length > 0;

          if (s.sectionLayout === "personal-note") {
            return (
              <section
                key={key}
                id={s.anchorId}
                className="rounded-2xl border border-amber-200/90 bg-gradient-to-br from-amber-50/95 via-white to-stone-50 p-6 shadow-md ring-1 ring-amber-100/60"
              >
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-amber-900/65">
                  {s.eyebrow ?? SITE_NAME}
                </p>
                <h2 className="mt-2 text-lg font-semibold tracking-tight text-stone-900">{s.heading}</h2>
                <SectionBody section={s} />
              </section>
            );
          }

          if (hasLinks) {
            return (
              <section
                key={key}
                id={s.anchorId}
                className="rounded-2xl border border-stone-200/90 bg-gradient-to-b from-white to-stone-50/95 p-5 shadow-sm ring-1 ring-stone-100/80"
              >
                <h2 className="text-base font-semibold leading-snug text-stone-900">{s.heading}</h2>
                {s.highlightAfterHeading ? <HeadingCallout text={s.highlightAfterHeading} /> : null}
                <div className={s.highlightAfterHeading ? "mt-5" : "mt-3"}>
                  <SectionBody section={s} />
                </div>
                {s.formGuideActions && s.formGuideActions.length > 0 ? (
                  <FormGuideBlock actions={s.formGuideActions} />
                ) : null}
                <div className="mt-5">
                  <LinkList
                    links={s.links!}
                    id={`topic-links-${idx}`}
                    eyebrow={s.linksSectionEyebrow}
                  />
                </div>
              </section>
            );
          }

          return (
            <section key={key} id={s.anchorId}>
              <h2 className="text-lg font-medium text-stone-800">{s.heading}</h2>
              {s.highlightAfterHeading ? <HeadingCallout text={s.highlightAfterHeading} /> : null}
              <div className={s.highlightAfterHeading ? "mt-5" : "mt-3"}>
                <SectionBody section={s} />
              </div>
              {s.formGuideActions && s.formGuideActions.length > 0 ? (
                <FormGuideBlock actions={s.formGuideActions} />
              ) : null}
            </section>
          );
        })}
      </div>

      <section className="rounded-lg border border-stone-200 bg-stone-50/80 px-4 py-4">
        <h2 className="text-sm font-medium text-stone-800">More official links</h2>
        <p className="mt-1 text-xs text-stone-500">
          Straight from VA when you want the main site, sign-in, or a human-facing hub—not a substitute for your own letters and decisions.
        </p>
        <ul className="mt-3 list-inside list-disc space-y-2 text-sm text-stone-700">
          {mod.officialLinks.map((l) => (
            <li key={l.url}>
              <p className="text-stone-600">Use this for: {l.label}.</p>
              <a className="text-blue-800 underline" href={l.url} target="_blank" rel="noopener noreferrer">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <EducationalFooter variant="compact" />
      </div>
    </article>
  );
}
