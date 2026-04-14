import perksOffersJson from "@/data/perks-offers/perks-offers.json";
import veteranDiscountSupplementJson from "@/data/perks-offers/veteran-discount-supplement.json";
import {
  mergePerksOffersWithSupplement,
  type VeteranDiscountSupplementFile,
} from "@/lib/merge-veteran-discount-supplement";
import { getUsStateName } from "@/lib/us-states";
import type {
  NationalPerksOfferRow,
  OtherStatePerkMatch,
  PerksOffersDataset,
  StatePerksOfferRow,
} from "@/types/perks-offers";
import { PERK_BAND_ORDER, perkBandHeading } from "@/data/veteran-state-perks/perks-helpers";
import type { VeteranPerkEligibilityBand } from "@/types/veteran-state-perks";

const dataset: PerksOffersDataset = mergePerksOffersWithSupplement(
  perksOffersJson as PerksOffersDataset,
  veteranDiscountSupplementJson as VeteranDiscountSupplementFile,
);

export function getPerksOffersDataset(): PerksOffersDataset {
  return dataset;
}

export function getPerksOffersMetadata() {
  return dataset.metadata;
}

export function getNationalPerksOffers(): NationalPerksOfferRow[] {
  return dataset.national_offers;
}

export function getStatePerksOfferRows(stateCode: string): StatePerksOfferRow[] {
  return dataset.by_state[stateCode.trim().toUpperCase()] ?? [];
}

export function isPortalOfferRow(row: StatePerksOfferRow): boolean {
  return row.category === "portal_reference" || row.id.endsWith("-state-portal");
}

/** Official portal card (first portal-style row). */
export function getStatePortalOfferRow(stateCode: string): StatePerksOfferRow | undefined {
  return getStatePerksOfferRows(stateCode).find((r) => isPortalOfferRow(r));
}

/** VA facilities map — state veterans department link. */
export function getStateVeteransPortalForFacilities(stateCode: string): { name: string; url: string } | undefined {
  const row = getStatePortalOfferRow(stateCode);
  if (!row) return undefined;
  return { name: row.business_or_program, url: row.source_url };
}

/** Quick-reference rows (excludes portal hub row). */
export function quickReferenceOfferRows(stateCode: string): StatePerksOfferRow[] {
  return getStatePerksOfferRows(stateCode).filter((r) => !isPortalOfferRow(r));
}

export function getStatePerksOfferRow(stateCode: string, perkId: string): StatePerksOfferRow | undefined {
  return getStatePerksOfferRows(stateCode).find((r) => r.id === perkId);
}

export function listPerkDetailStaticParams(): { state: string; perkId: string }[] {
  const out: { state: string; perkId: string }[] = [];
  for (const code of Object.keys(dataset.by_state)) {
    for (const r of dataset.by_state[code]) {
      out.push({ state: code.toLowerCase(), perkId: r.id });
    }
  }
  return out;
}

export function groupOfferRowsByBand(
  entries: StatePerksOfferRow[],
): Map<VeteranPerkEligibilityBand | "unsorted", StatePerksOfferRow[]> {
  const map = new Map<VeteranPerkEligibilityBand | "unsorted", StatePerksOfferRow[]>();
  for (const e of entries) {
    const key: VeteranPerkEligibilityBand | "unsorted" = e.eligibility_band ?? "unsorted";
    const list = map.get(key) ?? [];
    list.push(e);
    map.set(key, list);
  }
  return map;
}

export { PERK_BAND_ORDER, perkBandHeading };

export function getOtherStatesWithPerkFamily(
  currentStateCode: string,
  familyId: string | undefined,
): OtherStatePerkMatch[] {
  if (!familyId) return [];
  const current = currentStateCode.trim().toUpperCase();
  const out: OtherStatePerkMatch[] = [];
  for (const [code, rows] of Object.entries(dataset.by_state)) {
    if (code === current) continue;
    for (const r of rows) {
      if (r.perk_family_id === familyId) {
        const stateName = getUsStateName(code.toLowerCase());
        if (stateName) {
          out.push({ stateCode: code, stateName, perkId: r.id, perkName: r.business_or_program });
        }
        break;
      }
    }
  }
  out.sort((a, b) => a.stateName.localeCompare(b.stateName));
  return out;
}
