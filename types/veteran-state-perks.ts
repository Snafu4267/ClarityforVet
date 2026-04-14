/**
 * Structured veteran perks / benefits / discounts for UI and future pages.
 * Copy is educational only—not legal, tax, or eligibility advice.
 */

export type VeteranPerkCategory =
  | "property_tax"
  | "vehicle_registration"
  | "hunting_fishing"
  | "state_parks"
  | "education"
  | "employment"
  | "state_programs"
  | "recreation_attractions"
  | "retail_discount"
  | "dining"
  | "travel_lodging"
  | "entertainment"
  | "veterans_day_offer"
  /** Starting point when detailed perks are not yet curated for a state */
  | "portal_reference";

/** Used to group quick-reference rows and to match similar programs across states */
export type VeteranPerkEligibilityBand =
  | "100_percent"
  | "disabled_other"
  | "any_veteran"
  | "general";

export type VeteranPerkEntry = {
  /** Stable key within state or national bundle */
  id: string;
  name: string;
  category: VeteranPerkCategory;
  /** Plain-language summary; avoid promising outcomes */
  description: string;
  /** Who may qualify; use conditional language */
  eligibility: string;
  /** Optional: VA disability rating context when statutes tie to ratings */
  disabilityRatingNote?: string;
  /** Government .gov, state agency, or primary official source */
  officialSourceUrl: string;
  /** Optional CTA line for external links when “official eligibility wording” would be misleading */
  officialLinkLabel?: string;
  /** Caveats: local rules, annual changes, verify with business, etc. */
  notes?: string;
  /**
   * Quick-reference line on the state basics page (no long legalese).
   * If omitted, the basics page may show a shortened title only for banded entries.
   */
  quickRefLine?: string;
  /** Order quick-reference sections: 100% first, then other bands */
  eligibilityBand?: VeteranPerkEligibilityBand;
  /**
   * Same logical benefit in another state (e.g. homestead exemption for total disability).
   * Used on the detail page only to list other states—never on the quick-reference page.
   */
  perkFamilyId?: string;
};

export type StateVeteranPerksProfile = {
  stateCode: string;
  stateName: string;
  officialAgencyName: string;
  officialPortalUrl: string;
  /** How the portal URL was chosen (transparency for maintainers) */
  portalDirectorySource: string;
  stateLevelBenefits: VeteranPerkEntry[];
  recreationLifestylePerks: VeteranPerkEntry[];
  veteransDayPerks: VeteranPerkEntry[];
  /** Retail / dining / travel that operate nationally—still verify locally */
  yearRoundDiscounts: VeteranPerkEntry[];
};

export type NationalVeteranPerksBundle = {
  disclaimer: string;
  /** Hub links and examples; offers change—see notes on each entry */
  veteransDayOffers: VeteranPerkEntry[];
  yearRoundOffers: VeteranPerkEntry[];
};

export type UsVeteranPerksDataset = {
  meta: {
    lastStructuralUpdate: string;
    /** ISO date string; set when curators change perk rows */
    dataCompletenessNote: string;
    nasdvaMemberDirectoryUrl: string;
    federalStateOfficeLocatorUrl: string;
  };
  states: Record<string, StateVeteranPerksProfile>;
  national: NationalVeteranPerksBundle;
};
