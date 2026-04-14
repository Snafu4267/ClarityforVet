/**
 * Perks data shaped for spreadsheet → JSON export (`perks-offers.json`).
 * Optional fields support detail pages and grouping; curators can omit them for simple rows.
 */

export type PerksOfferKind = "program" | "brand" | "guidance";

export type PerksEligibilityBand = "100_percent" | "disabled_other" | "any_veteran" | "general";

export type StatePerksOfferRow = {
  id: string;
  business_or_program: string;
  category: string;
  /** Short line for list cards (from spreadsheet “discount” column or summary). */
  discount_offer: string;
  notes?: string;
  source_url: string;
  source_link_label?: string;
  offer_kind: PerksOfferKind;
  eligibility_band?: PerksEligibilityBand;
  /** Detail page — full description when different from discount_offer */
  description?: string;
  eligibility?: string;
  disability_rating_note?: string;
  /** Cross-state “similar program” links on detail pages */
  perk_family_id?: string;
};

export type NationalPerksOfferRow = {
  id: string;
  brand_or_program: string;
  category: string;
  discount_offer: string;
  notes?: string;
  source_url: string;
  source_link_label?: string;
  offer_kind: PerksOfferKind;
};

export type PerksOffersMetadata = {
  generated_from: string;
  generated_at: string;
  schema_version: number;
  disclaimer: string;
  states_count: number;
  state_offer_rows: number;
  national_offer_rows: number;
};

export type PerksOffersDataset = {
  metadata: PerksOffersMetadata;
  /** USPS state code → rows (portal row first when present). */
  by_state: Record<string, StatePerksOfferRow[]>;
  national_offers: NationalPerksOfferRow[];
};

export type OtherStatePerkMatch = {
  stateCode: string;
  stateName: string;
  perkId: string;
  perkName: string;
};
