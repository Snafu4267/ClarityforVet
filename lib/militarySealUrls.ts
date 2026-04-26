import type { StaticImageData } from "next/image";
import airForce from "../public/seals/air-force.svg";
import army from "../public/seals/army.svg";
import coastGuard from "../public/seals/coast-guard.svg";
import marineCorps from "../public/seals/marine-corps.svg";
import navy from "../public/seals/navy.svg";
import spaceForce from "../public/seals/space-force.svg";

/**
 * Some builds can emit an absolute `https://primary-domain/...` URL. Browsers on `www.`
 * then request the **other** host; CSP, cookies, and mixed vhosts can break. A path
 * like `/_next/static/...` always loads from the host the user actually opened.
 */
function pathFromBundledUrl(asset: string | StaticImageData): string {
  const raw = typeof asset === "string" ? asset : asset.src;
  if (raw.startsWith("/") && !raw.startsWith("//")) return raw;
  try {
    const u = new URL(raw);
    return u.pathname + u.search;
  } catch {
    return raw;
  }
}

/** Vendored public-domain emblems, bundled so the build emits them under `/_next/static/…`. */
export const MILITARY_SEAL_URL = {
  army: pathFromBundledUrl(army),
  marines: pathFromBundledUrl(marineCorps),
  navy: pathFromBundledUrl(navy),
  "air-force": pathFromBundledUrl(airForce),
  "space-force": pathFromBundledUrl(spaceForce),
  "coast-guard": pathFromBundledUrl(coastGuard),
} as const;
