/**
 * Build per-state VA health facility JSON (same shape as texas-va-resources.json) by:
 * 1) VHA ArcGIS layer — addresses & coordinates (VAST)
 * 2) VA Facilities API — main phone, website, hours
 *
 * Matching (in order):
 *   - Direct id from STA_NO → vc_{STA_NO} / vha_{STA_NO} (handles mobile units whose API
 *     coordinates differ from ArcGIS stop locations)
 *   - Greedy nearest-neighbor among remaining API facilities (health + vet_center),
 *     loaded once for the whole country (correct pagination).
 *
 * Requires VA_API_KEY or VA_SANDBOX_API_KEY (https://developer.va.gov/).
 * Production: VA_FACILITIES_BASE=https://api.va.gov/services/va_facilities/v1
 * Sandbox:   VA_FACILITIES_BASE=https://sandbox-api.va.gov/services/va_facilities/v1
 *
 * Usage: npm run build:va-state-data
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, "..");
const outDir = path.join(projectRoot, "data", "va-facilities");
const OVERRIDES_PATH = path.join(outDir, "sta-phone-overrides.json");

const LAYER_QUERY =
  "https://services2.arcgis.com/VFLAJVozK0rtzQmT/ArcGIS/rest/services/Veterans_Health_Administration_Medical_Facilities/FeatureServer/0/query";

const US_STATES = [
  ["AL", "Alabama"],
  ["AK", "Alaska"],
  ["AZ", "Arizona"],
  ["AR", "Arkansas"],
  ["CA", "California"],
  ["CO", "Colorado"],
  ["CT", "Connecticut"],
  ["DE", "Delaware"],
  ["FL", "Florida"],
  ["GA", "Georgia"],
  ["HI", "Hawaii"],
  ["ID", "Idaho"],
  ["IL", "Illinois"],
  ["IN", "Indiana"],
  ["IA", "Iowa"],
  ["KS", "Kansas"],
  ["KY", "Kentucky"],
  ["LA", "Louisiana"],
  ["ME", "Maine"],
  ["MD", "Maryland"],
  ["MA", "Massachusetts"],
  ["MI", "Michigan"],
  ["MN", "Minnesota"],
  ["MS", "Mississippi"],
  ["MO", "Missouri"],
  ["MT", "Montana"],
  ["NE", "Nebraska"],
  ["NV", "Nevada"],
  ["NH", "New Hampshire"],
  ["NJ", "New Jersey"],
  ["NM", "New Mexico"],
  ["NY", "New York"],
  ["NC", "North Carolina"],
  ["ND", "North Dakota"],
  ["OH", "Ohio"],
  ["OK", "Oklahoma"],
  ["OR", "Oregon"],
  ["PA", "Pennsylvania"],
  ["RI", "Rhode Island"],
  ["SC", "South Carolina"],
  ["SD", "South Dakota"],
  ["TN", "Tennessee"],
  ["UT", "Utah"],
  ["VT", "Vermont"],
  ["VA", "Virginia"],
  ["WA", "Washington"],
  ["WV", "West Virginia"],
  ["WI", "Wisconsin"],
  ["WY", "Wyoming"],
];

const TYPE_LABELS = {
  VAMC: "VA medical center",
  CBOC: "Community-based outpatient clinic",
  VTCR: "Vet Center",
  OSOC: "Outreach clinic",
  MHOS: "Mobile health outreach",
  MVCTR: "Mobile Vet Center",
  DOM: "Domiciliary",
  NSG: "Community living center / nursing",
  DRTP: "Residential rehabilitation",
  HCC: "Health care center",
  PCR: "Primary care clinic",
  SHCOM: "Spinal cord / specialty hub",
};

const EMPTY_ADV = {
  name: "",
  phone: "",
  email: "",
  officeLocation: "",
  notes: "",
};

function loadDotEnvFiles() {
  for (const name of [".env.local", ".env"]) {
    const p = path.join(projectRoot, name);
    try {
      const raw = fs.readFileSync(p, "utf8");
      for (const line of raw.split("\n")) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;
        const eq = trimmed.indexOf("=");
        if (eq === -1) continue;
        const key = trimmed.slice(0, eq).trim();
        let val = trimmed.slice(eq + 1).trim();
        if (
          (val.startsWith('"') && val.endsWith('"')) ||
          (val.startsWith("'") && val.endsWith("'"))
        ) {
          val = val.slice(1, -1);
        }
        if (process.env[key] === undefined) process.env[key] = val;
      }
    } catch {
      /* missing */
    }
  }
}

function vaGovFindLocationsUrl(stateName) {
  const q = new URLSearchParams();
  q.set("address", stateName);
  q.set("facilityType[0]", "health");
  return `https://www.va.gov/find-locations/?${q.toString()}`;
}

function facilityPageUrl(id) {
  return `https://www.va.gov/find-locations/facility/${id}`;
}

function slugId(staNo, city) {
  const c = String(city || "site")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `vha-${String(staNo).toLowerCase()}-${c || "site"}`;
}

function zipParts(zip, zip4) {
  const z = String(zip || "").replace(/\D/g, "").slice(0, 5);
  const z4 = String(zip4 || "").replace(/\D/g, "").slice(0, 4);
  if (z.length === 5 && z4) return `${z}-${z4}`;
  if (z.length === 5) return z;
  return z.padStart(5, "0").slice(0, 5) || "00000";
}

function zip5Arc(a) {
  return String(a.S_ZIP || "").replace(/\D/g, "").slice(0, 5);
}

function zip5Api(attrs) {
  const z = attrs?.address?.physical?.zip || "";
  return String(z).replace(/\D/g, "").slice(0, 5);
}

function streetLine(a) {
  const add2 = (a.S_ADD2 || "").trim();
  const add1 = (a.S_ADD1 || "").trim();
  const name = (a.STA_NAME || "").trim();
  if (add2) return add2;
  if (add1 && add1 !== name) return add1;
  return "Street address: confirm on VA.gov locator before you travel.";
}

function facilityKind(abbr) {
  return abbr === "VAMC" ? "VAMC" : "CBOC";
}

function systemLabel(abbr) {
  const k = String(abbr || "").toUpperCase();
  return `VHA · ${TYPE_LABELS[k] || k || "facility"}`;
}

function haversineMiles(lat1, lon1, lat2, lon2) {
  const R = 3959;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function normName(s) {
  return String(s || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function nameTokens(s) {
  return new Set(
    normName(s)
      .split(" ")
      .filter((w) => w.length > 2),
  );
}

function nameScore(n1, n2) {
  const a = nameTokens(n1);
  const b = nameTokens(n2);
  if (a.size === 0 || b.size === 0) return 0;
  let inter = 0;
  for (const x of a) {
    if (b.has(x)) inter += 1;
  }
  return inter / Math.max(a.size, b.size);
}

function passesMatchThreshold(arc, row, d) {
  const ns = nameScore(arc.STA_NAME, row.name);
  const zMatch = zip5Arc(arc).length === 5 && zip5Arc(arc) === zip5Api(row.attrs);
  if (d <= 0.55) return true;
  if (d <= 2.2 && ns >= 0.16) return true;
  if (d <= 4.2 && ns >= 0.28) return true;
  if (zMatch && d <= 3.2 && ns >= 0.1) return true;
  return false;
}

function pickPhone(attrs) {
  const p = attrs.phone || {};
  const keys = [
    "main",
    "healthConnect",
    "afterHours",
    "pharmacy",
    "mentalHealthClinic",
    "patientAdvocate",
    "enrollmentCoordinator",
  ];
  for (const k of keys) {
    const v = p[k];
    if (v && /\d{3}/.test(String(v))) return String(v).trim();
  }
  return null;
}

function hoursFromAttrs(attrs) {
  const o = attrs.operationalHoursSpecialInstructions;
  if (Array.isArray(o) && o.length) return o.join(" ").replace(/\s+/g, " ").trim().slice(0, 420);
  const h = attrs.hours;
  if (h && typeof h === "object") {
    const parts = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
      .map((k) => (h[k] ? `${k}: ${h[k]}` : null))
      .filter(Boolean);
    if (parts.length) return parts.join(" · ").slice(0, 420);
  }
  if (attrs.classification) return `${attrs.classification}. Confirm hours on the facility’s VA.gov page.`;
  return "Confirm hours on the facility’s VA.gov page.";
}

/** Lighthouse pagination uses camelCase totalPages in JSON:API meta. */
function readTotalPages(json) {
  const pag = json.meta?.pagination || {};
  return pag.total_pages ?? pag.totalPages ?? 1;
}

function normalizeApiRow(item) {
  const a = item.attributes;
  const lat = a?.lat;
  const lng = a?.long;
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  return {
    id: item.id,
    name: a.name || "",
    lat,
    lng,
    attrs: a,
  };
}

/**
 * Full national health + vet_center index (by facility id).
 */
async function fetchNationalFacilityMap(apiKey, baseUrl) {
  const base = baseUrl.replace(/\/$/, "");
  const byId = new Map();
  for (const type of ["health", "vet_center"]) {
    let page = 1;
    let totalPages = 1;
    while (page <= totalPages) {
      const url = `${base}/facilities?type=${type}&per_page=100&page=${page}`;
      const res = await fetch(url, {
        headers: { apikey: apiKey, Accept: "application/json" },
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(`VA API national ${type} page ${page}: ${res.status} ${JSON.stringify(json)}`);
      }
      totalPages = readTotalPages(json);
      for (const item of json.data || []) {
        const row = normalizeApiRow(item);
        if (row) byId.set(row.id, row);
      }
      page += 1;
    }
  }
  return byId;
}

/** Try vc_{STA_NO} / vha_{STA_NO} (and MVC strip) — aligns ArcGIS STA_NO with Lighthouse ids. */
function directApiRowForArc(arc, byId) {
  const sta = String(arc.STA_NO || "").trim();
  if (!sta) return null;
  const candidates = [
    `vc_${sta}`,
    `vha_${sta}`,
    `vc_${sta.replace(/MVC$/i, "")}`,
    `vha_${sta.replace(/MVC$/i, "")}`,
  ];
  for (const cid of candidates) {
    const row = byId.get(cid);
    if (row && pickPhone(row.attrs)) return row;
  }
  return null;
}

function loadStaOverrides() {
  try {
    const raw = fs.readFileSync(OVERRIDES_PATH, "utf8");
    const j = JSON.parse(raw);
    return typeof j === "object" && j !== null ? j : {};
  } catch {
    return {};
  }
}

/** When a site exists in ArcGIS but not in the API snapshot (e.g. sandbox), use VA.gov-sourced numbers from sta-phone-overrides.json. */
function syntheticRowFromStaOverride(arc, o) {
  const sta = String(arc.STA_NO || "").trim();
  return {
    id: `va-gov-override-${sta}`,
    name: String(arc.STA_NAME || "").trim(),
    lat: Number(arc.LAT),
    lng: Number(arc.LON),
    attrs: {
      name: arc.STA_NAME,
      phone: { main: o.phoneMain },
      website: o.website || "",
      operationalHoursSpecialInstructions: o.hoursSummary ? [o.hoursSummary] : undefined,
      classification: "VA health facility (contact info from VA.gov; confirm on the facility page)",
    },
  };
}

/** e.g. STA_NO 649QB → prefix vha_649 (same NAVAHCS clinic group in Lighthouse). */
function vhaGroupPrefixFromStaNo(staNo) {
  const sta = String(staNo || "").trim();
  const m = sta.match(/^(\d{3})/);
  return m ? `vha_${m[1]}` : "";
}

/**
 * When an exact STA_NO id is missing from the API (common in sandbox), use the nearest
 * unused facility in the same vha_### group — real VA phone, same health system.
 */
function tryNearestVhaGroupSibling(arc, byId) {
  const prefix = vhaGroupPrefixFromStaNo(arc.STA_NO);
  if (!prefix) return null;
  let best = null;
  let bestD = Infinity;
  for (const row of byId.values()) {
    if (!row.id.startsWith(prefix)) continue;
    if (!pickPhone(row.attrs)) continue;
    const d = haversineMiles(Number(arc.LAT), Number(arc.LON), row.lat, row.lng);
    if (d < bestD) {
      bestD = d;
      best = row;
    }
  }
  if (best && bestD <= 95) return { row: best, miles: bestD };
  return null;
}

/**
 * 1) Direct STA_NO → API id
 * 2) Greedy global nearest valid pair (each API id used once)
 */
function matchArcRowsToApi(arcRows, byId, stateCode, staOverrides) {
  const arcs = arcRows.filter((a) => Number.isFinite(Number(a.LAT)) && Number.isFinite(Number(a.LON)));
  const usedApi = new Set();
  const pairs = [];

  const arcsLeft = [];

  for (const arc of arcs) {
    const sta = String(arc.STA_NO || "").trim();
    const direct = directApiRowForArc(arc, byId);
    const ov = staOverrides[sta];
    if (direct && !usedApi.has(direct.id)) {
      usedApi.add(direct.id);
      pairs.push({ arc, api: direct });
    } else if (ov && typeof ov.phoneMain === "string" && /\d{3}/.test(ov.phoneMain)) {
      pairs.push({ arc, api: syntheticRowFromStaOverride(arc, ov) });
    } else {
      arcsLeft.push(arc);
    }
  }

  let siblingPass = true;
  while (siblingPass && arcsLeft.length > 0) {
    siblingPass = false;
    for (let i = 0; i < arcsLeft.length; i++) {
      const arc = arcsLeft[i];
      const hit = tryNearestVhaGroupSibling(arc, byId);
      if (hit) {
        pairs.push({ arc, api: hit.row });
        arcsLeft.splice(i, 1);
        siblingPass = true;
        break;
      }
    }
  }

  while (arcsLeft.length > 0) {
    let best = null;
    let bestDist = Infinity;
    for (const arc of arcsLeft) {
      for (const row of byId.values()) {
        if (usedApi.has(row.id)) continue;
        const d = haversineMiles(Number(arc.LAT), Number(arc.LON), row.lat, row.lng);
        if (d > 6) continue;
        if (!passesMatchThreshold(arc, row, d)) continue;
        if (d < bestDist) {
          bestDist = d;
          best = { arc, api: row };
        }
      }
    }
    if (!best) {
      const a = arcsLeft[0];
      throw new Error(
        `No VA Facilities API match for ${stateCode}: ${a.STA_NAME} (${a.S_CITY}). Tried STA_NO ids and nearest-neighbor.`,
      );
    }
    usedApi.add(best.api.id);
    pairs.push(best);
    arcsLeft.splice(arcsLeft.indexOf(best.arc), 1);
  }

  return pairs;
}

async function fetchStateFeatures(stateCode) {
  const pageSize = 2000;
  let offset = 0;
  const all = [];
  for (;;) {
    const u = new URL(LAYER_QUERY);
    u.searchParams.set("f", "json");
    u.searchParams.set("where", `S_STATE='${stateCode}'`);
    u.searchParams.set(
      "outFields",
      "STA_NO,PAR_STA_NO,S_ABBR,STA_NAME,S_ADD1,S_ADD2,S_CITY,S_STATE,S_ZIP,S_ZIP4,LAT,LON",
    );
    u.searchParams.set("returnGeometry", "false");
    u.searchParams.set("orderByFields", "STA_NO");
    u.searchParams.set("resultRecordCount", String(pageSize));
    u.searchParams.set("resultOffset", String(offset));

    const res = await fetch(u.toString(), { headers: { Accept: "application/json" } });
    if (!res.ok) throw new Error(`ArcGIS HTTP ${res.status} for ${stateCode}`);
    const json = await res.json();
    if (json.error) throw new Error(JSON.stringify(json.error));
    const chunk = Array.isArray(json.features) ? json.features : [];
    for (const row of chunk) {
      if (row?.attributes) all.push(row.attributes);
    }
    if (chunk.length < pageSize) break;
    offset += pageSize;
  }
  return all;
}

function isExactStaApiId(arc, apiRow) {
  const sta = String(arc.STA_NO || "").trim();
  return sta !== "" && (apiRow.id === `vha_${sta}` || apiRow.id === `vc_${sta}`);
}

function mapFacility(arc, apiRow, locatorUrl) {
  const lat = Number(arc.LAT);
  const lng = Number(arc.LON);
  const abbr = String(arc.S_ABBR || "").toUpperCase();
  const state = String(arc.S_STATE || "").toUpperCase();
  const city = String(arc.S_CITY || "").trim() || "Unknown city";
  const zip = zipParts(arc.S_ZIP, arc.S_ZIP4);
  const attrs = apiRow.attrs;
  const phoneMain = pickPhone(attrs);
  if (!phoneMain) {
    throw new Error(`VA API returned no dialable phone for ${apiRow.id} (${attrs.name})`);
  }
  const website = (attrs.website || "").trim() || facilityPageUrl(apiRow.id);
  const sourceUrl = website.startsWith("http") ? website : facilityPageUrl(apiRow.id);

  let hoursSummary = hoursFromAttrs(attrs);
  const fromGovOverride = apiRow.id.startsWith("va-gov-override-");
  if (!fromGovOverride && !isExactStaApiId(arc, apiRow)) {
    hoursSummary = `${hoursSummary} Phone is from the nearest VA facility in the same Lighthouse group as this site; confirm hours for this address on VA.gov.`;
  }

  return {
    id: slugId(arc.STA_NO, city),
    name: String(arc.STA_NAME || "VA facility").trim(),
    kind: facilityKind(abbr),
    system: systemLabel(abbr),
    address: streetLine(arc),
    city,
    state,
    zip,
    phoneMain,
    hoursSummary,
    sourceUrl,
    lat,
    lng,
    website,
    patientAdvocate: { ...EMPTY_ADV },
  };
}

function centroidOf(mapped) {
  let la = 0;
  let lo = 0;
  for (const f of mapped) {
    la += f.lat;
    lo += f.lng;
  }
  return { lat: la / mapped.length, lng: lo / mapped.length };
}

function nearestTo(mapped, c) {
  let best = mapped[0];
  let bestD = Infinity;
  for (const f of mapped) {
    const d = (f.lat - c.lat) ** 2 + (f.lng - c.lng) ** 2;
    if (d < bestD) {
      bestD = d;
      best = f;
    }
  }
  return best;
}

function buildPayload(stateCode, stateName, pairs, apiBaseLabel) {
  const locatorUrl = vaGovFindLocationsUrl(stateName);
  const mapped = pairs.map(({ arc, api }) => mapFacility(arc, api, locatorUrl));
  mapped.sort((x, y) => x.name.localeCompare(y.name, "en", { sensitivity: "base" }));

  const today = new Date().toISOString().slice(0, 10);
  const geoCenter = mapped.length ? centroidOf(mapped) : { lat: 39.8283, lng: -98.5795 };
  const anchor = mapped.length ? nearestTo(mapped, geoCenter) : null;

  const startingPoint = anchor
    ? {
        label: "Default starting point",
        addressLine: anchor.address,
        city: anchor.city,
        state: stateCode,
        zip: anchor.zip,
        lat: anchor.lat,
        lng: anchor.lng,
        privacyNote:
          "Default point is one listed facility near the geographic middle of this state’s mapped sites (not your home). Use “Your ZIP” to center the map on your postal area—only an approximate ZIP center is used.",
      }
    : undefined;

  return {
    meta: {
      title: `${stateName} — VA health facilities (map & list)`,
      region: stateName,
      lastReviewed: today,
      disclaimer: `This page lists Veterans Health Administration (VHA) sites in ${stateName}. Locations and labels come from the public ArcGIS VHA medical facilities layer; each row’s phone, website, and hours text are merged from the VA Facilities API (${apiBaseLabel}) using official facility ids and coordinates. Educational information only—not legal or medical advice. Clarity4Vets does not represent anyone before VA.\n\nAlways confirm addresses, phone numbers, and hours on VA.gov or with the facility before you travel. Distances on this site are straight-line approximations (not drive time). Map links use third-party services for convenience—verify every detail with official sources.`,
      sources: [
        {
          label: "VHA medical facilities — ArcGIS FeatureServer (coordinates & street context)",
          url: "https://services2.arcgis.com/VFLAJVozK0rtzQmT/ArcGIS/rest/services/Veterans_Health_Administration_Medical_Facilities/FeatureServer",
        },
        {
          label: "VA Facilities API — phones, websites, hours (Lighthouse)",
          url: "https://developer.va.gov/explore/api/facilities/docs",
        },
        {
          label: "Find any VA location (official VA.gov)",
          url: "https://www.va.gov/find-locations",
        },
      ],
      startingPoint,
    },
    scheduling: [
      {
        label: "VA health information (national)",
        phone: "877-222-8387",
        note: "MyVA411 — general VA health information; not a substitute for a facility’s direct line.",
      },
      {
        label: "Veterans Crisis Line",
        phone: "988 then press 1",
        note: "If you are in crisis, you can also text 838255.",
      },
      {
        label: `Official locator — ${stateName}`,
        phone: "www.va.gov/find-locations",
        note: "Filter by services and open each facility’s official page for the latest hours.",
      },
    ],
    facilities: mapped,
    organizations: [],
    emergencyCopy: {
      title: "If you are in crisis",
      lines: [
        "Dial 988, then press 1 for the Veterans Crisis Line.",
        "Text 838255.",
        "If this is a life-threatening emergency, call 911.",
      ],
      disclaimer:
        "If you are in immediate danger, call 911. Crisis numbers here are general public information—confirm current contact options on official VA and 988 sites. This list is not a substitute for emergency services or professional crisis care.",
    },
  };
}

async function main() {
  loadDotEnvFiles();

  const apiKey = process.env.VA_API_KEY || process.env.VA_SANDBOX_API_KEY;
  const baseUrl =
    process.env.VA_FACILITIES_BASE || "https://api.va.gov/services/va_facilities/v1";

  if (!apiKey) {
    console.error(
      "Missing VA_API_KEY or VA_SANDBOX_API_KEY. Get a Facilities API key at https://developer.va.gov/ and add it to .env.local",
    );
    process.exit(1);
  }

  const apiBaseLabel = baseUrl.includes("sandbox") ? "sandbox" : "production";

  process.stderr.write("Loading national VA Facilities API index (health + vet_center)…\n");
  const nationalMap = await fetchNationalFacilityMap(apiKey, baseUrl);
  process.stderr.write(`  ${nationalMap.size} facilities indexed.\n`);

  const staOverrides = loadStaOverrides();
  if (Object.keys(staOverrides).length > 0) {
    process.stderr.write(`  STA_NO overrides (VA.gov): ${Object.keys(staOverrides).length}\n`);
  }

  fs.mkdirSync(outDir, { recursive: true });
  let ok = 0;

  for (const [code, name] of US_STATES) {
    process.stderr.write(`${code}… `);
    const attrs = await fetchStateFeatures(code);
    const pairs = matchArcRowsToApi(attrs, nationalMap, code, staOverrides);
    const payload = buildPayload(code, name, pairs, apiBaseLabel);
    const outPath = path.join(outDir, `US-${code}.json`);
    fs.writeFileSync(outPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
    process.stderr.write(`${payload.facilities.length} facilities → ${path.relative(projectRoot, outPath)}\n`);
    ok += 1;
    await new Promise((r) => setTimeout(r, 80));
  }
  process.stderr.write(`Done. Wrote ${ok} state files (TX skipped — use texas-va-resources.json).\n`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
