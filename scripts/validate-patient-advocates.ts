/**
 * Phase 5–style QA: validate + report Patient Advocate blocks on Texas facilities JSON.
 *
 * Usage: npx tsx scripts/validate-patient-advocates.ts
 * Exit 1 if any severity "error" (schema break); warnings/info do not fail CI by default.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { buildPatientAdvocateReport } from "../lib/patient-advocate/validate";
import type { TexasFacility, TexasVaData } from "../types/texas-va";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const jsonPath = path.join(__dirname, "..", "data", "texas-va-resources.json");

function main() {
  const raw = fs.readFileSync(jsonPath, "utf8");
  const data = JSON.parse(raw) as TexasVaData;
  const facilities = data.facilities as TexasFacility[];

  const report = buildPatientAdvocateReport(facilities);

  console.log("# Patient Advocate validation — Texas facilities\n");
  console.log(`Source: ${path.relative(process.cwd(), jsonPath)}`);
  console.log(`Facilities: ${report.facilityCount}`);
  console.log(`\nCounts — errors: ${report.counts.error}, warnings: ${report.counts.warn}, info: ${report.counts.info}\n`);

  const bySev = { error: [] as typeof report.issues, warn: [] as typeof report.issues, info: [] as typeof report.issues };
  for (const i of report.issues) bySev[i.severity].push(i);

  for (const sev of ["error", "warn", "info"] as const) {
    const list = bySev[sev];
    if (!list.length) continue;
    console.log(`## ${sev.toUpperCase()} (${list.length})\n`);
    for (const i of list) {
      console.log(`- **${i.facilityId}** (${i.kind}) ${i.facilityName}`);
      console.log(`  - \`${i.field}\`: ${i.message}\n`);
    }
  }

  if (report.counts.error > 0) {
    console.error("Failing: fix errors above.");
    process.exit(1);
  }
  console.log("OK — no blocking errors (warnings/info may still need curator review).");
}

main();
