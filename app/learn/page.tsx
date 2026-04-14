import { EducationalFooter } from "@/components/EducationalFooter";
import { PageAccent } from "@/components/PageAccent";
import { awarenessModules } from "@/data/awareness-modules";
import { bigNavLinkCardClass } from "@/lib/big-nav-card";
import { SITE_NAME } from "@/lib/site";
import Link from "next/link";

export const metadata = {
  title: `Learn — ${SITE_NAME}`,
  description:
    "Topics A–Z: time limits, evidence types, Community Care, life events, caregivers, VA letters—plain language, official links. Not legal advice.",
};

export default function LearnIndexPage() {
  return (
    <>
      <PageAccent className="page-accent-learn-overview" />
      <div className="relative z-10 flex flex-col gap-8">
        <header className="flex flex-col gap-4">
          <h1 className="text-2xl font-semibold tracking-tight text-stone-900">Topics A–Z</h1>
          <div className="rounded-xl border border-stone-200 bg-white px-5 py-5 shadow-sm ring-1 ring-stone-100/90 sm:px-6 sm:py-6">
            <p className="text-base font-medium leading-relaxed text-stone-900 sm:text-lg">
              Plain-language overviews with links to official VA sources—not advice for your specific case.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-stone-600">
              Daily notes, calendar, medication list, and printables live under{" "}
              <Link
                href="/#veterans-personal-data"
                className="font-medium text-slate-800 underline decoration-stone-300 underline-offset-2"
              >
                Veterans personal data
              </Link>{" "}
              on the home page (same lane as the vet info sheet)—not under these articles. Scroll to{" "}
              <strong className="font-semibold text-stone-800">what each topic covers</strong> for the A–Z topics.
            </p>
          </div>
        </header>

        <section aria-labelledby="topic-summaries-heading">
          <h2 id="topic-summaries-heading" className="text-base font-semibold text-stone-900">
            What each topic covers
          </h2>
          <ul className="mt-4 list-none flex flex-col gap-3 p-0">
            {awarenessModules.map((m) => (
              <li key={m.slug}>
                <Link href={`/learn/${m.slug}`} className={bigNavLinkCardClass}>
                  <span className="block font-semibold text-zinc-900">{m.title}</span>
                  <span className="mt-2 block text-sm leading-relaxed text-zinc-600">{m.summary}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <EducationalFooter variant="compact" />
      </div>
    </>
  );
}
