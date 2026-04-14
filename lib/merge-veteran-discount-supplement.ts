import { US_STATES_BY_NAME } from "@/lib/us-states";
import type {
  NationalPerksOfferRow,
  PerksEligibilityBand,
  PerksOfferKind,
  PerksOffersDataset,
  StatePerksOfferRow,
} from "@/types/perks-offers";

const NAME_TO_CODE = new Map(US_STATES_BY_NAME.map((s) => [s.name.toLowerCase(), s.code]));
const VALID_CODES = new Set(US_STATES_BY_NAME.map((s) => s.code));

function normalizeStateKey(key: string): string | null {
  const t = key.trim();
  if (t.length === 2 && VALID_CODES.has(t.toUpperCase())) return t.toUpperCase();
  const code = NAME_TO_CODE.get(t.toLowerCase());
  return code ?? null;
}

function slugId(prefix: string, label: string, used: Set<string>): string {
  const base = `${prefix}-${label}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 72);
  let id = base || `${prefix}-offer`;
  let n = 2;
  while (used.has(id)) {
    id = `${base}-${n}`;
    n += 1;
  }
  used.add(id);
  return id;
}

function inferOfferKind(category: string): PerksOfferKind {
  const c = category.toLowerCase();
  if (c.includes("veteran") && c.includes("day")) return "guidance";
  if (
    c.includes("retail") ||
    c.includes("dining") ||
    c.includes("restaurant") ||
    c.includes("travel") ||
    c.includes("lodging") ||
    c.includes("entertainment")
  )
    return "brand";
  return "program";
}

type RawStateRow = {
  id?: string;
  business_or_program?: string;
  brand_or_program?: string;
  category?: string;
  discount_offer?: string;
  notes?: string;
  source_url?: string;
  source_link_label?: string;
  offer_kind?: PerksOfferKind;
  eligibility_band?: PerksEligibilityBand;
  description?: string;
  eligibility?: string;
  disability_rating_note?: string;
  perk_family_id?: string;
};

type RawNationalRow = RawStateRow & { brand_or_program?: string };

function toStateRow(stateCode: string, raw: RawStateRow, usedIds: Set<string>): StatePerksOfferRow | null {
  const name =
    (typeof raw.business_or_program === "string" && raw.business_or_program.trim()) ||
    (typeof raw.brand_or_program === "string" && raw.brand_or_program.trim()) ||
    "";
  const discount =
    (typeof raw.discount_offer === "string" && raw.discount_offer.trim()) ||
    (typeof raw.notes === "string" && raw.notes.trim()) ||
    name;
  const url = typeof raw.source_url === "string" ? raw.source_url.trim() : "";
  if (!name || !url) return null;

  const category =
    typeof raw.category === "string" && raw.category.trim() ? raw.category.trim() : "retail_discount";
  let id: string;
  if (typeof raw.id === "string" && raw.id.trim()) {
    id = raw.id.trim();
    if (usedIds.has(id)) return null;
    usedIds.add(id);
  } else {
    id = slugId(stateCode.toLowerCase(), name, usedIds);
  }

  const row: StatePerksOfferRow = {
    id,
    business_or_program: name,
    category,
    discount_offer: discount,
    notes: typeof raw.notes === "string" ? raw.notes.trim() || undefined : undefined,
    source_url: url,
    source_link_label:
      typeof raw.source_link_label === "string" ? raw.source_link_label.trim() || undefined : undefined,
    offer_kind: raw.offer_kind ?? inferOfferKind(category),
  };
  if (raw.eligibility_band) row.eligibility_band = raw.eligibility_band;
  if (raw.description) row.description = raw.description;
  if (raw.eligibility) row.eligibility = raw.eligibility;
  if (raw.disability_rating_note) row.disability_rating_note = raw.disability_rating_note;
  if (raw.perk_family_id) row.perk_family_id = raw.perk_family_id;
  return row;
}

function toNationalRow(raw: RawNationalRow, usedIds: Set<string>): NationalPerksOfferRow | null {
  const name =
    (typeof raw.brand_or_program === "string" && raw.brand_or_program.trim()) ||
    (typeof raw.business_or_program === "string" && raw.business_or_program.trim()) ||
    "";
  const discount =
    (typeof raw.discount_offer === "string" && raw.discount_offer.trim()) ||
    (typeof raw.notes === "string" && raw.notes.trim()) ||
    name;
  const url = typeof raw.source_url === "string" ? raw.source_url.trim() : "";
  if (!name || !url) return null;

  const category =
    typeof raw.category === "string" && raw.category.trim() ? raw.category.trim() : "retail_discount";
  let id: string;
  if (typeof raw.id === "string" && raw.id.trim()) {
    id = raw.id.trim();
    if (usedIds.has(id)) return null;
    usedIds.add(id);
  } else {
    id = slugId("nat", name, usedIds);
  }

  return {
    id,
    brand_or_program: name,
    category,
    discount_offer: discount,
    notes: typeof raw.notes === "string" ? raw.notes.trim() || undefined : undefined,
    source_url: url,
    source_link_label:
      typeof raw.source_link_label === "string" ? raw.source_link_label.trim() || undefined : undefined,
    offer_kind: raw.offer_kind ?? inferOfferKind(category),
  };
}

export type VeteranDiscountSupplementFile = {
  by_state?: Record<string, RawStateRow[]>;
  national_offers?: RawNationalRow[];
};

/** Merges spreadsheet-style import into the generated perks dataset (portals + Texas rows stay first). */
export function mergePerksOffersWithSupplement(
  base: PerksOffersDataset,
  supplement: VeteranDiscountSupplementFile,
): PerksOffersDataset {
  const by_state = { ...base.by_state };
  const usedIds = new Set<string>();
  for (const rows of Object.values(by_state)) {
    for (const r of rows) usedIds.add(r.id);
  }
  for (const n of base.national_offers) usedIds.add(n.id);

  const importStates = supplement.by_state ?? {};
  for (const [key, rows] of Object.entries(importStates)) {
    if (!Array.isArray(rows)) continue;
    const code = normalizeStateKey(key);
    if (!code) continue;
    const existing = [...(by_state[code] ?? [])];
    const existingIds = new Set(existing.map((r) => r.id));
    for (const raw of rows) {
      const row = toStateRow(code, raw, usedIds);
      if (!row) continue;
      if (existingIds.has(row.id)) continue;
      existing.push(row);
      existingIds.add(row.id);
    }
    by_state[code] = existing;
  }

  const national_offers = [...base.national_offers];
  const natIds = new Set(national_offers.map((r) => r.id));
  for (const raw of supplement.national_offers ?? []) {
    const row = toNationalRow(raw, usedIds);
    if (!row) continue;
    if (natIds.has(row.id)) continue;
    national_offers.push(row);
    natIds.add(row.id);
  }

  let state_offer_rows = 0;
  for (const rows of Object.values(by_state)) state_offer_rows += rows.length;

  return {
    metadata: {
      ...base.metadata,
      generated_at: base.metadata.generated_at,
      state_offer_rows,
      national_offer_rows: national_offers.length,
    },
    by_state,
    national_offers,
  };
}
