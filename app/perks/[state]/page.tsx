import { EducationalFooter } from "@/components/EducationalFooter";
import { PageAccent } from "@/components/PageAccent";
import { ServiceSubpageFrame } from "@/components/ServiceSubpageFrame";
import { bigNavLinkCardClass } from "@/lib/big-nav-card";
import {
  PERK_BAND_ORDER,
  getStatePortalOfferRow,
  groupOfferRowsByBand,
  perkBandHeading,
  quickReferenceOfferRows,
} from "@/lib/perks-offers";
import { SITE_NAME } from "@/lib/site";
import type { StatePerksOfferRow } from "@/types/perks-offers";
import type { VeteranPerkEligibilityBand } from "@/types/veteran-state-perks";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getUsStateName, normalizeStateCodeParam, US_STATES_BY_NAME } from "@/lib/us-states";

type Props = { params: Promise<{ state: string }> };

export function generateStaticParams() {
  return US_STATES_BY_NAME.map((s) => ({ state: s.code.toLowerCase() }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state: raw } = await params;
  const code = normalizeStateCodeParam(raw);
  if (!code) return { title: `Perks — ${SITE_NAME}` };
  const name = getUsStateName(code);
  if (!name) return { title: `Perks — ${SITE_NAME}` };
  return {
    title: `Quick reference — ${name} veteran programs — ${SITE_NAME}`,
    description: `At-a-glance state perks by disability group (100% first), with links to full official wording.`,
  };
}

function QuickRefRow({ row, stateLower }: { row: StatePerksOfferRow; stateLower: string }) {
  return (
    <li>
      <Link href={`/perks/${stateLower}/${row.id}`} className={`${bigNavLinkCardClass} no-underline`}>
        <span className="block font-semibold text-zinc-900">{row.business_or_program}</span>
        <span className="mt-1 block text-sm leading-relaxed text-zinc-600">{row.discount_offer}</span>
        <div className="mt-2 space-y-2 text-sm leading-relaxed text-zinc-700">
          {row.description ? (
            <p>
              <span className="font-semibold text-zinc-800">What this is:</span> {row.description}
            </p>
          ) : null}
          {row.eligibility ? (
            <p>
              <span className="font-semibold text-zinc-800">Who may qualify:</span> {row.eligibility}
            </p>
          ) : null}
          {row.disability_rating_note ? (
            <p>
              <span className="font-semibold text-zinc-800">Rating note:</span> {row.disability_rating_note}
            </p>
          ) : null}
          {row.notes ? (
            <p>
              <span className="font-semibold text-zinc-800">What to bring / watch for:</span> {row.notes}
            </p>
          ) : null}
        </div>
        <span className="mt-3 block text-sm font-medium text-emerald-900">Full details + official wording →</span>
      </Link>
    </li>
  );
}

export default async function PerksByStatePage({ params }: Props) {
  const { state: raw } = await params;
  const code = normalizeStateCodeParam(raw);
  if (!code) notFound();

  const upper = code.toUpperCase();
  const stateName = getUsStateName(code);
  if (!stateName) notFound();

  const portal = getStatePortalOfferRow(upper);
  if (!portal) notFound();

  const quick = quickReferenceOfferRows(upper);
  const grouped = groupOfferRowsByBand(quick);
  const stateLower = upper.toLowerCase();

  const bandSections: { band: VeteranPerkEligibilityBand | "unsorted"; rows: StatePerksOfferRow[] }[] = [];
  for (const band of PERK_BAND_ORDER) {
    const list = grouped.get(band);
    if (list && list.length > 0) bandSections.push({ band, rows: list });
  }
  const unsorted = grouped.get("unsorted");
  if (unsorted && unsorted.length > 0) {
    bandSections.push({ band: "unsorted", rows: unsorted });
  }

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
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">
            {stateName} — earned benefits and qualification details
          </h1>
          <p className="text-sm leading-relaxed text-stone-600">
            Start with the official state site, then scan below. We lead with <strong className="font-semibold">100%</strong>{" "}
            and similar total-disability rules, then other groups. Each card shows the core details on this page; open the
            detail link for the full summary and source.
          </p>
        </header>

        <section
          id="perks-state-portal"
          className="scroll-mt-24 rounded-xl border border-emerald-200/90 bg-gradient-to-br from-emerald-50/80 to-teal-50/40 px-5 py-5 ring-1 ring-emerald-100/60"
        >
          <h2 className="text-sm font-semibold text-stone-900">Official state portal</h2>
          <p className="mt-1 text-sm text-stone-700">{portal.business_or_program}</p>
          <a
            href={portal.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex min-h-11 items-center justify-center rounded-lg bg-emerald-800 px-4 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-900"
          >
            Open official state website
          </a>
          {portal.notes ? <p className="mt-3 text-xs leading-relaxed text-stone-500">{portal.notes}</p> : null}
        </section>

        {quick.length === 0 ? (
          <section id="perks-state-quick" className="scroll-mt-24 rounded-xl border border-stone-200 bg-stone-50/80 px-5 py-5">
            <h2 className="text-sm font-semibold text-stone-900">Quick list</h2>
            <p className="mt-2 text-sm leading-relaxed text-stone-600">
              We don&apos;t have extra broken-out rows for this state yet beyond the portal. Use the official site above for
              programs, forms, and eligibility.
            </p>
          </section>
        ) : (
          <section id="perks-state-quick" className="scroll-mt-24 flex flex-col gap-6">
            <h2 className="text-lg font-medium text-stone-800">Quick reference by group</h2>
            {bandSections.map(({ band, rows }) => (
              <div key={band} className="flex flex-col gap-3">
                <h3 className="text-sm font-semibold leading-snug text-stone-900">
                  {band === "unsorted" ? "Also listed" : perkBandHeading(band as VeteranPerkEligibilityBand)}
                </h3>
                <ul className="flex list-none flex-col gap-3 p-0">
                  {rows.map((r) => (
                    <QuickRefRow key={r.id} row={r} stateLower={stateLower} />
                  ))}
                </ul>
              </div>
            ))}
          </section>
        )}

        <p id="perks-state-more" className="scroll-mt-24 text-sm text-stone-600">
          <Link href="/perks" className="font-medium text-slate-800 underline decoration-stone-300 underline-offset-2">
            ← Pick another state
          </Link>
        </p>

        <EducationalFooter variant="compact" />
      </div>
    </ServiceSubpageFrame>
  );
}
