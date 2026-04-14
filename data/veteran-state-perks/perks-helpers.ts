import type {
  StateVeteranPerksProfile,
  VeteranPerkEligibilityBand,
  VeteranPerkEntry,
} from "@/types/veteran-state-perks";

export const PERK_BAND_ORDER: VeteranPerkEligibilityBand[] = [
  "100_percent",
  "disabled_other",
  "any_veteran",
  "general",
];

export function perkBandHeading(band: VeteranPerkEligibilityBand): string {
  switch (band) {
    case "100_percent":
      return "If you have 100% VA disability (or qualifying total disability under state rules)";
    case "disabled_other":
      return "Other disability ratings or special medical/disability rules";
    case "any_veteran":
      return "Honorably discharged veterans (confirm each program)";
    case "general":
      return "Varies by program / overview";
    default:
      return "Programs";
  }
}

export function flattenStatePerkEntries(profile: StateVeteranPerksProfile): VeteranPerkEntry[] {
  return [
    ...profile.stateLevelBenefits,
    ...profile.recreationLifestylePerks,
    ...profile.veteransDayPerks,
    ...profile.yearRoundDiscounts,
  ];
}

/** Entries shown on the quick-reference state page (no long legalese). */
export function quickReferenceEntries(profile: StateVeteranPerksProfile): VeteranPerkEntry[] {
  return flattenStatePerkEntries(profile).filter((e) => e.category !== "portal_reference");
}

export function groupQuickRefByBand(entries: VeteranPerkEntry[]): Map<VeteranPerkEligibilityBand | "unsorted", VeteranPerkEntry[]> {
  const map = new Map<VeteranPerkEligibilityBand | "unsorted", VeteranPerkEntry[]>();
  for (const e of entries) {
    const key: VeteranPerkEligibilityBand | "unsorted" = e.eligibilityBand ?? "unsorted";
    const list = map.get(key) ?? [];
    list.push(e);
    map.set(key, list);
  }
  return map;
}

