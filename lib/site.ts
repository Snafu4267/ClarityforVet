/** Public product name (browser title, footers, PDFs, disclaimers). */
export const SITE_NAME = "Clarity4Vets";

/** One-line positioning: hero, SEO, and share previews. */
export const SITE_HOOK =
  "Helping veterans understand and navigate benefits, options, and decisions with clarity.";

/**
 * When true (set `NEXT_PUBLIC_PUBLIC_ONLY_SITE=true` at build time): hide account/spouse/stripe
 * entry points on the public hub, shorten Learn topic bodies to point at VA.gov, and trim the forms hub.
 */
export const PUBLIC_ONLY_SITE =
  typeof process.env.NEXT_PUBLIC_PUBLIC_ONLY_SITE === "string" &&
  ["1", "true", "yes"].includes(process.env.NEXT_PUBLIC_PUBLIC_ONLY_SITE.toLowerCase());
