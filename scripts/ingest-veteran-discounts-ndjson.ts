/**
 * Reads project-root `veteran_discounts_combined_flat.ndjson` and writes
 * `data/perks-offers/veteran-discount-supplement.json` for merge in `lib/perks-offers.ts`.
 */
import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { US_STATES_BY_NAME } from "../lib/us-states";
import type { PerksOfferKind } from "../types/perks-offers";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const SRC = path.join(ROOT, "veteran_discounts_combined_flat.ndjson");
const DEST = path.join(ROOT, "data/perks-offers/veteran-discount-supplement.json");

const NAME_TO_CODE = new Map(US_STATES_BY_NAME.map((s) => [s.name.toLowerCase(), s.code]));

function slugPart(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 56);
}

function uniqueId(base: string, used: Set<string>): string {
  let id = base;
  let n = 2;
  while (used.has(id)) {
    id = `${base}-${n}`;
    n += 1;
  }
  used.add(id);
  return id;
}

function inferOfferKind(o: {
  scope?: string;
  offer_type?: string;
  category?: string;
  source_dataset?: string;
}): PerksOfferKind {
  if (o.scope === "national") return "brand";
  const ot = String(o.offer_type || "");
  if (/veterans\s*day/i.test(ot)) return "guidance";
  const cat = String(o.category || "").toLowerCase();
  if (
    cat.includes("restaurant") ||
    cat.includes("theme park") ||
    cat.includes("entertainment") ||
    cat.includes("tickets") ||
    cat.includes("dining")
  )
    return "brand";
  if (
    cat.includes("license") ||
    cat.includes("wildlife") ||
    cat.includes("fish") ||
    cat.includes("hunt") ||
    cat.includes("state parks") ||
    cat.includes("parks and") ||
    cat.includes("dnr") ||
    cat.includes("dept.") ||
    cat.includes("department")
  )
    return "program";
  if (o.source_dataset === "restaurants_v1") return "brand";
  return "brand";
}

function normalizeCategory(cat: unknown): string {
  if (typeof cat !== "string" || !cat.trim()) return "retail_discount";
  return cat.trim();
}

type Flat = Record<string, unknown>;

function main() {
  if (!fs.existsSync(SRC)) {
    console.error(`Missing ${SRC}`);
    process.exit(1);
  }

  const raw = fs.readFileSync(SRC, "utf8");
  const lines = raw.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);

  const by_state: Record<string, unknown[]> = {};
  const national_offers: unknown[] = [];
  const usedIds = new Set<string>();

  for (const line of lines) {
    let o: Flat;
    try {
      o = JSON.parse(line) as Flat;
    } catch {
      console.warn("Skip bad JSON line");
      continue;
    }

    const scope = String(o.scope || "").toLowerCase();
    const stateRaw = String(o.state || "").trim();
    const isNational = scope === "national" || stateRaw.toLowerCase() === "national";

    const notesParts = [o.notes, o.source_note].filter((x) => typeof x === "string" && String(x).trim());
    const notes = notesParts.length ? notesParts.join(" ") : undefined;
    const eligibility =
      typeof o.eligibility === "string" && o.eligibility.trim() ? o.eligibility.trim() : undefined;
    const discount =
      typeof o.discount_offer === "string" && o.discount_offer.trim()
        ? o.discount_offer.trim()
        : String(o.business_or_program || "");
    const url = typeof o.source_url === "string" ? o.source_url.trim() : "";
    const name = typeof o.business_or_program === "string" ? o.business_or_program.trim() : "";

    if (!name || !url) continue;

    const category = normalizeCategory(o.category);
    const offer_kind = inferOfferKind({
      scope,
      offer_type: typeof o.offer_type === "string" ? o.offer_type : undefined,
      category,
      source_dataset: typeof o.source_dataset === "string" ? o.source_dataset : undefined,
    });

    if (isNational) {
      const base = `nat-${slugPart(name)}`;
      const id = uniqueId(base, usedIds);
      national_offers.push({
        id,
        brand_or_program: name,
        category,
        discount_offer: discount,
        notes,
        source_url: url,
        offer_kind,
      });
      continue;
    }

    const code = NAME_TO_CODE.get(stateRaw.toLowerCase());
    if (!code) {
      console.warn(`Unknown state "${stateRaw}", skipped: ${name.slice(0, 40)}`);
      continue;
    }

    const base = `${code.toLowerCase()}-${slugPart(name)}`;
    const id = uniqueId(base, usedIds);
    if (!by_state[code]) by_state[code] = [];
    by_state[code].push({
      id,
      business_or_program: name,
      category,
      discount_offer: discount,
      notes,
      source_url: url,
      eligibility,
      offer_kind,
    });
  }

  const out = { by_state, national_offers };
  fs.mkdirSync(path.dirname(DEST), { recursive: true });
  fs.writeFileSync(DEST, `${JSON.stringify(out, null, 2)}\n`, "utf8");

  let stateRows = 0;
  for (const rows of Object.values(by_state)) stateRows += rows.length;
  console.log(`Wrote ${DEST} (${stateRows} state rows, ${national_offers.length} national).`);
}

main();
