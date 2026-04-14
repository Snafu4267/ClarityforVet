/**
 * Builds data/perks-offers/perks-offers.json from curated TS data (veteran-state-perks).
 * Re-run after Excel → TS updates, or replace the JSON manually from a spreadsheet export.
 */
import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { US_VETERAN_PERKS_DATASET } from "../data/veteran-state-perks/index";
import { flattenStatePerkEntries } from "../data/veteran-state-perks/perks-helpers";
import type { StateVeteranPerksProfile, VeteranPerkCategory, VeteranPerkEntry } from "../types/veteran-state-perks";
import type {
  NationalPerksOfferRow,
  PerksOfferKind,
  PerksOffersDataset,
  StatePerksOfferRow,
} from "../types/perks-offers";
import { US_STATES_BY_NAME } from "../lib/us-states";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function offerKindForCategory(cat: VeteranPerkCategory): PerksOfferKind {
  switch (cat) {
    case "veterans_day_offer":
      return "guidance";
    case "retail_discount":
    case "dining":
    case "travel_lodging":
    case "entertainment":
    case "recreation_attractions":
      return "brand";
    default:
      return "program";
  }
}

function entryToStateRow(e: VeteranPerkEntry): StatePerksOfferRow {
  const discount_offer = (e.quickRefLine?.trim() || e.description).trim();
  const row: StatePerksOfferRow = {
    id: e.id,
    business_or_program: e.name,
    category: e.category,
    discount_offer,
    notes: e.notes,
    source_url: e.officialSourceUrl,
    source_link_label: e.officialLinkLabel,
    offer_kind: offerKindForCategory(e.category),
  };
  if (e.eligibilityBand) row.eligibility_band = e.eligibilityBand;
  if (e.description && e.description !== discount_offer) row.description = e.description;
  if (e.eligibility) row.eligibility = e.eligibility;
  if (e.disabilityRatingNote) row.disability_rating_note = e.disabilityRatingNote;
  if (e.perkFamilyId) row.perk_family_id = e.perkFamilyId;
  return row;
}

function profileToRows(profile: StateVeteranPerksProfile): StatePerksOfferRow[] {
  return flattenStatePerkEntries(profile).map((e) => {
    const row = entryToStateRow(e);
    if (e.category === "portal_reference") {
      row.business_or_program = profile.officialAgencyName;
      row.notes = profile.portalDirectorySource || e.notes;
    }
    return row;
  });
}

function nationalEntryToRow(e: VeteranPerkEntry): NationalPerksOfferRow {
  return {
    id: e.id,
    brand_or_program: e.name,
    category: e.category,
    discount_offer: (e.quickRefLine?.trim() || e.description).trim(),
    notes: e.notes,
    source_url: e.officialSourceUrl,
    source_link_label: e.officialLinkLabel,
    offer_kind: offerKindForCategory(e.category),
  };
}

const EXTRA_NATIONAL: NationalPerksOfferRow[] = [
  {
    id: "nat-nasdva-directory",
    brand_or_program: "NASDVA — state veterans affairs directory",
    category: "state_programs",
    discount_offer:
      "Member-maintained links to state and territory veterans departments—use to find each state’s official hub.",
    notes: "Clarity4Vets is not NASDVA; confirm every link on the destination site.",
    source_url: "https://nasdva.us/resources/",
    offer_kind: "program",
  },
  {
    id: "nat-va-state-offices-locator",
    brand_or_program: "U.S. Department of Veterans Affairs — state / territory offices locator",
    category: "state_programs",
    discount_offer:
      "Federal locator for state departments of veterans affairs and related offices—cross-check with your state’s .gov site.",
    notes: "Use together with your state portal row on this site.",
    source_url:
      "https://department.va.gov/about/state-departments-of-veterans-affairs-office-locations/",
    offer_kind: "program",
  },
  {
    id: "nat-veteran-exchange-shopping",
    brand_or_program: "Military OneSource — veterans online exchange shopping benefit",
    category: "retail_discount",
    discount_offer:
      "Official overview of how qualifying veterans can shop select military exchanges online—rules and eligibility on the source.",
    notes: "Separate from private-store military discounts; read exclusions on the official page.",
    source_url: "https://www.militaryonesource.mil/veteran-shopping-benefit",
    offer_kind: "program",
  },
];

function main() {
  const national = US_VETERAN_PERKS_DATASET.national;
  const fromBundle: NationalPerksOfferRow[] = [
    ...national.veteransDayOffers.map(nationalEntryToRow),
    ...national.yearRoundOffers.map(nationalEntryToRow),
  ];
  const national_offers = [...fromBundle, ...EXTRA_NATIONAL];

  const by_state: Record<string, StatePerksOfferRow[]> = {};
  let state_offer_rows = 0;

  for (const s of US_STATES_BY_NAME) {
    const code = s.code.toUpperCase();
    const profile = US_VETERAN_PERKS_DATASET.states[code];
    if (!profile) continue;
    const rows = profileToRows(profile);
    by_state[code] = rows;
    state_offer_rows += rows.length;
  }

  const dataset: PerksOffersDataset = {
    metadata: {
      generated_from: "veteran-state-perks (TS) via scripts/generate-perks-offers-json.ts",
      generated_at: new Date().toISOString().slice(0, 10),
      schema_version: 1,
      disclaimer: US_VETERAN_PERKS_DATASET.national.disclaimer,
      states_count: Object.keys(by_state).length,
      state_offer_rows,
      national_offer_rows: national_offers.length,
    },
    by_state,
    national_offers,
  };

  const outDir = path.join(__dirname, "../data/perks-offers");
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, "perks-offers.json");
  fs.writeFileSync(outPath, `${JSON.stringify(dataset, null, 2)}\n`, "utf8");
  console.log(`Wrote ${outPath} (${dataset.metadata.state_offer_rows} state rows, ${dataset.metadata.national_offer_rows} national).`);
}

main();
