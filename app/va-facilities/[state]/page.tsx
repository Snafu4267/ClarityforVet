import TexasPageContent from "@/components/TexasPageContent";
import { getStateVeteransPortalForFacilities } from "@/lib/perks-offers";
import { loadGeneratedStateVaData } from "@/lib/load-state-va-data";
import { SITE_NAME } from "@/lib/site";
import { US_STATES_FOR_VA_FACILITIES_SSG, getUsStateName, normalizeStateCodeParam } from "@/lib/us-states";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

type Props = { params: Promise<{ state: string }> };

export function generateStaticParams() {
  /** Texas is served at `/texas` (curated data); avoid SSG calling `redirect()` for `tx`. */
  return US_STATES_FOR_VA_FACILITIES_SSG.map((s) => ({ state: s.code.toLowerCase() }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state: raw } = await params;
  const code = normalizeStateCodeParam(raw);
  if (!code) return { title: `Facilities — ${SITE_NAME}` };
  const name = getUsStateName(code);
  if (!name) return { title: `Facilities — ${SITE_NAME}` };
  return {
    title: `VA health facilities — ${name} — ${SITE_NAME}`,
    description: `Map and list of VA health sites in ${name} from public VHA data—confirm every detail on VA.gov. Not affiliated with VA.`,
  };
}

export default async function VaFacilitiesByStatePage({ params }: Props) {
  const { state: raw } = await params;
  const code = normalizeStateCodeParam(raw);
  if (!code) notFound();

  if (code === "tx") redirect("/texas");

  const upper = code.toUpperCase();
  const stateName = getUsStateName(code);
  if (!stateName) notFound();

  const data = loadGeneratedStateVaData(upper);
  if (!data) notFound();

  const statePortal = getStateVeteransPortalForFacilities(upper);

  return (
    <TexasPageContent
      data={data}
      stateCode={upper}
      stateName={stateName}
      accentClassName="page-accent-va-resources"
      statePortal={statePortal ? { name: statePortal.name, url: statePortal.url } : undefined}
      footerVariant="compact"
    />
  );
}
