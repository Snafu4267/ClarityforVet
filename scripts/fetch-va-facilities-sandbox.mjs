/**
 * Fetch VA facilities from the Lighthouse sandbox (test data).
 *
 * Prereq: sandbox API key from https://developer.va.gov/onboarding/request-sandbox-access
 * Set VA_SANDBOX_API_KEY in the environment or in .env.local (see .env.example).
 *
 * Usage:
 *   node scripts/fetch-va-facilities-sandbox.mjs
 *   node scripts/fetch-va-facilities-sandbox.mjs --state=TX --out=data/va-facilities-sandbox-TX.json
 *
 * Sandbox base (current gateway): https://sandbox-api.va.gov/services/va_facilities/v1
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, "..");

const DEFAULT_BASE = "https://sandbox-api.va.gov/services/va_facilities/v1";
const PER_PAGE = 100;

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
      /* missing file */
    }
  }
}

function parseArgs() {
  const out = { state: "TX", outPath: path.join(projectRoot, "data", "va-facilities-sandbox-TX.json") };
  for (const a of process.argv.slice(2)) {
    if (a.startsWith("--state=")) out.state = a.slice("--state=".length).trim().toUpperCase();
    else if (a.startsWith("--out=")) out.outPath = path.resolve(projectRoot, a.slice("--out=".length).trim());
  }
  return out;
}

async function fetchPage(base, apiKey, state, page) {
  const url = new URL(`${base.replace(/\/$/, "")}/facilities`);
  url.searchParams.set("state", state);
  url.searchParams.set("page", String(page));
  url.searchParams.set("per_page", String(PER_PAGE));

  const res = await fetch(url, {
    headers: {
      apikey: apiKey,
      Accept: "application/json",
    },
  });

  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error(`Non-JSON response (${res.status}): ${text.slice(0, 200)}`);
  }

  if (!res.ok) {
    const msg = json?.message || json?.errors?.[0]?.detail || JSON.stringify(json);
    throw new Error(`HTTP ${res.status}: ${msg}`);
  }

  return json;
}

loadDotEnvFiles();

const apiKey = process.env.VA_SANDBOX_API_KEY || process.env.VA_API_KEY;
const base = process.env.VA_SANDBOX_BASE_URL || DEFAULT_BASE;

const { state, outPath } = parseArgs();

if (!apiKey) {
  console.error(
    "Missing API key. Set VA_SANDBOX_API_KEY (or VA_API_KEY) in the environment or .env.local — see .env.example."
  );
  process.exit(1);
}

const allData = [];
let page = 1;
let totalPages = 1;

console.error(`Sandbox: ${base}`);
console.error(`State: ${state} → ${outPath}`);

try {
  while (page <= totalPages) {
    const json = await fetchPage(base, apiKey, state, page);
    const chunk = Array.isArray(json.data) ? json.data : [];
    allData.push(...chunk);

    const pag = json.meta?.pagination;
    const tp = pag?.total_pages ?? pag?.totalPages;
    if (pag && typeof tp === "number") {
      totalPages = tp;
    } else if (chunk.length < PER_PAGE) {
      totalPages = page;
    } else {
      totalPages = page + 1;
    }

    console.error(`  page ${page}/${totalPages} (+${chunk.length} rows, total so far ${allData.length})`);
    page += 1;

    if (!pag && chunk.length === 0) break;
    if (pag && page > pag.total_pages) break;
  }
} catch (e) {
  console.error(e.message || e);
  process.exit(1);
}

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(
  outPath,
  JSON.stringify(
    {
      fetchedAt: new Date().toISOString(),
      environment: "sandbox",
      baseUrl: base,
      state,
      count: allData.length,
      data: allData,
    },
    null,
    2
  ),
  "utf8"
);

console.error(`Wrote ${allData.length} facilities to ${outPath}`);
