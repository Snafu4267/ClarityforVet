import type {
  StateVeteranPerksProfile,
  UsVeteranPerksDataset,
  VeteranPerkEntry,
} from "@/types/veteran-state-perks";
import { STATE_PORTAL_SEEDS, type StatePortalSeed } from "./state-portal-seeds";
import { buildTexasVeteranPerksProfile } from "./texas-profile";
import { NATIONAL_VETERAN_PERKS_BUNDLE } from "./national-bundle";
import { flattenStatePerkEntries } from "./perks-helpers";

const NASDVA_RESOURCES = "https://nasdva.us/resources/";
const FEDERAL_STATE_OFFICE_LOCATOR =
  "https://department.va.gov/about/state-departments-of-veterans-affairs-office-locations/";

function portalReferenceEntry(seed: StatePortalSeed): VeteranPerkEntry {
  return {
    id: `${seed.code.toLowerCase()}-state-portal`,
    category: "portal_reference",
    name: "State veterans office — programs and benefits hub",
    description:
      "Official starting point for this state’s veteran programs. Detailed perks (property tax, tuition, licenses, parks, employment preference) depend on state law and local offices and are not exhaustively listed here unless separately curated.",
    eligibility:
      "Varies by program. Eligibility depends on state statutes, residency, discharge status, disability findings, and other factors.",
    officialSourceUrl: seed.url,
    notes: `Portal URL is taken from the NASDVA public directory (${NASDVA_RESOURCES}). Re-verify the link periodically.`,
  };
}

function defaultProfileFromSeed(seed: StatePortalSeed): StateVeteranPerksProfile {
  return {
    stateCode: seed.code,
    stateName: seed.name,
    officialAgencyName: seed.agency,
    officialPortalUrl: seed.url,
    portalDirectorySource: `Listed as this state’s veterans affairs website in the NASDVA Resources directory (${NASDVA_RESOURCES}).`,
    stateLevelBenefits: [portalReferenceEntry(seed)],
    recreationLifestylePerks: [],
    veteransDayPerks: [],
    yearRoundDiscounts: [],
  };
}

function buildAllStates(): Record<string, StateVeteranPerksProfile> {
  const out: Record<string, StateVeteranPerksProfile> = {};
  for (const seed of STATE_PORTAL_SEEDS) {
    out[seed.code] = defaultProfileFromSeed(seed);
  }
  out.TX = buildTexasVeteranPerksProfile();
  return out;
}

export const US_VETERAN_PERKS_DATASET: UsVeteranPerksDataset = {
  meta: {
    lastStructuralUpdate: "2026-04-12",
    dataCompletenessNote:
      "Fifty states plus D.C. each have a verified-style official portal entry (NASDVA directory or D.C. OVA) plus optional empty category arrays for future curation. Texas includes additional rows tied to Texas Comptroller, TVC, DPS, and TPWD. National retail and Veterans Day sections are intentionally minimal to avoid stale or unverifiable claims.",
    nasdvaMemberDirectoryUrl: NASDVA_RESOURCES,
    federalStateOfficeLocatorUrl: FEDERAL_STATE_OFFICE_LOCATOR,
  },
  states: buildAllStates(),
  national: NATIONAL_VETERAN_PERKS_BUNDLE,
};

/** Lookup by USPS state code (case-insensitive). */
export function getStateVeteranPerksProfile(stateCode: string): StateVeteranPerksProfile | undefined {
  return US_VETERAN_PERKS_DATASET.states[stateCode.trim().toUpperCase()];
}

export function listStateVeteranPerkCodes(): string[] {
  return STATE_PORTAL_SEEDS.map((s) => s.code);
}

export type OtherStatePerkMatch = { stateCode: string; stateName: string; perkId: string; perkName: string };

/** Single perk row for detail pages; undefined if id is wrong */
export function getPerkEntry(stateCode: string, perkId: string): VeteranPerkEntry | undefined {
  const upper = stateCode.trim().toUpperCase();
  const profile = US_VETERAN_PERKS_DATASET.states[upper];
  if (!profile) return undefined;
  return flattenStatePerkEntries(profile).find((e) => e.id === perkId);
}

/**
 * Other states that list the same perk family (detail page only—not on quick reference).
 */
export function getOtherStatesWithPerkFamily(
  currentStateCode: string,
  familyId: string | undefined,
): OtherStatePerkMatch[] {
  if (!familyId) return [];
  const current = currentStateCode.trim().toUpperCase();
  const out: OtherStatePerkMatch[] = [];
  for (const [code, profile] of Object.entries(US_VETERAN_PERKS_DATASET.states)) {
    if (code === current) continue;
    for (const e of flattenStatePerkEntries(profile)) {
      if (e.perkFamilyId === familyId) {
        out.push({
          stateCode: code,
          stateName: profile.stateName,
          perkId: e.id,
          perkName: e.name,
        });
        break;
      }
    }
  }
  out.sort((a, b) => a.stateName.localeCompare(b.stateName));
  return out;
}

export function listPerkDetailStaticParams(): { state: string; perkId: string }[] {
  const params: { state: string; perkId: string }[] = [];
  for (const [code, profile] of Object.entries(US_VETERAN_PERKS_DATASET.states)) {
    for (const e of flattenStatePerkEntries(profile)) {
      params.push({ state: code.toLowerCase(), perkId: e.id });
    }
  }
  return params;
}

export { STATE_PORTAL_SEEDS } from "./state-portal-seeds";
export { NATIONAL_VETERAN_PERKS_BUNDLE } from "./national-bundle";
export { buildTexasVeteranPerksProfile } from "./texas-profile";
export {
  PERK_BAND_ORDER,
  flattenStatePerkEntries,
  groupQuickRefByBand,
  perkBandHeading,
  quickReferenceEntries,
} from "./perks-helpers";
