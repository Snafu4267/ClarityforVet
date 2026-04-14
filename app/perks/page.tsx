import { EducationalFooter } from "@/components/EducationalFooter";
import { PageAccent } from "@/components/PageAccent";
import { ServiceSubpageFrame } from "@/components/ServiceSubpageFrame";
import { StatePerksPicker } from "@/components/StatePerksPicker";
import { getNationalPerksOffers, getPerksOffersMetadata } from "@/lib/perks-offers";
import { bigNavLinkCardClass } from "@/lib/big-nav-card";
import { SITE_NAME } from "@/lib/site";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: `Veteran perks & programs — ${SITE_NAME}`,
  description:
    "National quick notes plus a state-by-state snapshot (100% first on state pages)—open official sources for full rules.",
};

export default function PerksHubPage() {
  const meta = getPerksOffersMetadata();
  const nationalItems = getNationalPerksOffers();

  return (
    <ServiceSubpageFrame>
      <PageAccent className="page-accent-perks" />
      <div className="relative z-10 mx-auto flex w-full max-w-xl flex-col gap-8 px-6 py-12 pb-20">
        <header className="flex flex-col gap-3">
          <p className="text-sm text-stone-500">
            <Link href="/" className="font-medium text-slate-800 underline decoration-stone-300 underline-offset-2">
              Home
            </Link>
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">
            Veteran perks &amp; programs
          </h1>
          <p className="text-sm leading-relaxed text-stone-600">
            National rows and state lists are maintained as structured data (spreadsheet → JSON). This hub mixes national
            reminders with a state shortcut. State pages lead with your official portal, then{" "}
            <strong className="font-semibold">100%</strong> and similar groups where we have them—always confirm on the
            government or business source.
          </p>
        </header>

        <div id="perks-jump-state" className="scroll-mt-24">
          <StatePerksPicker />
        </div>

        <section
          id="perks-national-notes"
          className="scroll-mt-24 flex flex-col gap-4 rounded-xl border border-stone-200 bg-stone-50/80 px-5 py-5"
        >
          <h2 className="text-sm font-semibold text-stone-900">National — quick notes</h2>
          <p className="text-xs leading-relaxed text-stone-500">{meta.disclaimer}</p>
          <p className="text-xs text-stone-400">
            Data version: schema {meta.schema_version} · {meta.generated_at} · {meta.state_offer_rows} state rows ·{" "}
            {meta.national_offer_rows} national
          </p>
          <ul className="flex list-none flex-col gap-3 p-0">
            {nationalItems.map((entry) => (
              <li key={entry.id}>
                <a
                  href={entry.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${bigNavLinkCardClass} no-underline`}
                >
                  <span className="block text-sm font-semibold text-zinc-900">{entry.brand_or_program}</span>
                  <span className="mt-2 block text-sm leading-relaxed text-zinc-600">{entry.discount_offer}</span>
                  {entry.notes ? (
                    <span className="mt-2 block text-xs leading-relaxed text-zinc-500">{entry.notes}</span>
                  ) : null}
                  <span className="mt-3 block text-sm font-medium text-emerald-900">
                    {entry.source_link_label ?? "Official source →"}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        <nav
          id="perks-more-links"
          className="scroll-mt-24 text-sm text-stone-600"
          aria-label="Related pages"
        >
          <Link href="/va-resources" className="font-medium text-slate-800 underline decoration-stone-300 underline-offset-2">
            VA contacts &amp; tools
          </Link>
          {" · "}
          <Link href="/" className="font-medium text-slate-800 underline decoration-stone-300 underline-offset-2">
            Home
          </Link>
        </nav>

        <EducationalFooter variant="compact" />
      </div>
    </ServiceSubpageFrame>
  );
}
