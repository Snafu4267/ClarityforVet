import { EducationalFooter } from "@/components/EducationalFooter";
import { PageAccent } from "@/components/PageAccent";
import { ServiceSubpageFrame } from "@/components/ServiceSubpageFrame";
import { getOtherStatesWithPerkFamily, getStatePerksOfferRow, listPerkDetailStaticParams } from "@/lib/perks-offers";
import { SITE_NAME } from "@/lib/site";
import { getUsStateName, normalizeStateCodeParam } from "@/lib/us-states";
import type { StatePerksOfferRow } from "@/types/perks-offers";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ state: string; perkId: string }> };

export function generateStaticParams() {
  return listPerkDetailStaticParams();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state: raw, perkId } = await params;
  const code = normalizeStateCodeParam(raw);
  if (!code) return { title: `Perk details — ${SITE_NAME}` };
  const name = getUsStateName(code);
  const entry = getStatePerksOfferRow(code, perkId);
  if (!entry || !name) return { title: `Perk details — ${SITE_NAME}` };
  return {
    title: `${entry.business_or_program} — ${name} — ${SITE_NAME}`,
    description: `Full wording, eligibility context, and official sources for this program—educational only.`,
  };
}

function PerkFullBlock({ row }: { row: StatePerksOfferRow }) {
  const bodyText = row.description ?? row.discount_offer;
  return (
    <article
      id="perk-detail"
      className="scroll-mt-24 rounded-lg border border-stone-200 bg-white px-4 py-4 text-sm shadow-sm"
    >
      <p className="text-xs font-medium uppercase tracking-wide text-emerald-800/90">{row.category.replace(/_/g, " ")}</p>
      <h2 className="mt-1 text-lg font-semibold text-stone-900">{row.business_or_program}</h2>
      <p className="mt-2 leading-relaxed text-stone-600">{bodyText}</p>
      {row.eligibility ? (
        <p className="mt-2 text-stone-600">
          <span className="font-medium text-stone-700">Eligibility (summary):</span> {row.eligibility}
        </p>
      ) : null}
      {row.disability_rating_note ? (
        <p className="mt-2 text-stone-600">
          <span className="font-medium text-stone-700">Disability / rating note:</span> {row.disability_rating_note}
        </p>
      ) : null}
      {row.notes ? <p className="mt-2 text-xs leading-relaxed text-stone-500">{row.notes}</p> : null}
      <p id="perk-official" className="scroll-mt-24 mt-4">
        <a
          href={row.source_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center justify-center rounded-lg bg-emerald-800 px-4 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-900"
        >
          {row.source_link_label
            ? row.source_link_label.replace(/\s*→\s*$/, "").trim()
            : "Open official source (full rules & forms)"}
        </a>
      </p>
    </article>
  );
}

export default async function PerkDetailPage({ params }: Props) {
  const { state: raw, perkId } = await params;
  const code = normalizeStateCodeParam(raw);
  if (!code) notFound();
  const upper = code.toUpperCase();
  const stateName = getUsStateName(code);
  if (!stateName) notFound();

  const entry = getStatePerksOfferRow(upper, perkId);
  if (!entry) notFound();

  const others = getOtherStatesWithPerkFamily(upper, entry.perk_family_id);
  const stateLower = upper.toLowerCase();

  return (
    <ServiceSubpageFrame>
      <PageAccent className="page-accent-perks" />
      <div className="relative z-10 mx-auto flex w-full max-w-xl flex-col gap-8 px-6 py-12 pb-20">
        <header className="flex flex-col gap-3">
          <p className="text-sm text-stone-500">
            <Link href="/" className="font-medium text-slate-800 underline decoration-stone-300 underline-offset-2">
              Home
            </Link>
            {" · "}
            <Link href="/perks" className="font-medium text-slate-800 underline decoration-stone-300 underline-offset-2">
              Perks hub
            </Link>
            {" · "}
            <Link
              href={`/perks/${stateLower}`}
              className="font-medium text-slate-800 underline decoration-stone-300 underline-offset-2"
            >
              {stateName} quick reference
            </Link>
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">
            {entry.business_or_program}
          </h1>
          <p className="text-sm leading-relaxed text-stone-600">
            Educational summary and official link—not a decision about your eligibility. Read the government source for
            full rules.
          </p>
        </header>

        <PerkFullBlock row={entry} />

        <section
          id="perk-similar-states"
          className="scroll-mt-24 rounded-xl border border-stone-200 bg-stone-50/90 px-5 py-5"
        >
          <h2 className="text-sm font-semibold text-stone-900">Similar programs in other states</h2>
          {others.length > 0 ? (
            <>
              <p className="mt-1 text-xs leading-relaxed text-stone-500">
                Shown when we tag the same benefit family in another state&apos;s list. Always read that state&apos;s official
                rules—details differ.
              </p>
              <ul className="mt-3 flex flex-col gap-2 text-sm">
                {others.map((o) => (
                  <li key={o.stateCode}>
                    <Link
                      href={`/perks/${o.stateCode.toLowerCase()}/${o.perkId}`}
                      className="font-medium text-emerald-900 underline decoration-emerald-300 underline-offset-2"
                    >
                      {o.stateName}
                    </Link>
                    <span className="text-stone-600"> — {o.perkName}</span>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="mt-2 text-sm leading-relaxed text-stone-600">
              No cross-state matches are listed for this program yet.
            </p>
          )}
        </section>

        <p id="perk-detail-back" className="scroll-mt-24 text-sm text-stone-600">
          <Link href={`/perks/${stateLower}`} className="font-medium text-slate-800 underline decoration-stone-300 underline-offset-2">
            ← Back to {stateName} quick reference
          </Link>
        </p>

        <EducationalFooter variant="compact" />
      </div>
    </ServiceSubpageFrame>
  );
}
