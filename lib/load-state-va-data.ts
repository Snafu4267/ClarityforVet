import fs from "fs";
import path from "path";
import type { TexasVaData } from "@/types/texas-va";

/**
 * Load generated VHA/ArcGIS-backed facility JSON for a USPS state code (e.g. "CA").
 * Texas uses curated `texas-va-resources.json` on /texas — no US-TX.json file.
 */
export function loadGeneratedStateVaData(stateCodeUpper: string): TexasVaData | null {
  const code = stateCodeUpper.trim().toUpperCase();
  if (code === "TX") return null;
  const file = path.join(process.cwd(), "data", "va-facilities", `US-${code}.json`);
  if (!fs.existsSync(file)) return null;
  const raw = fs.readFileSync(file, "utf8");
  return JSON.parse(raw) as TexasVaData;
}
