/**
 * Full-viewport decorative layer (CSS only). Sits above ServiceSubpageFrame base wash, below content.
 * Each route gets a different mood—no stock photos, print-safe (hidden).
 */
export function PageAccent({ className }: { className: string }) {
  return (
    <div
      className={`page-atmosphere pointer-events-none fixed inset-0 -z-[8] overflow-hidden print:hidden ${className}`}
      aria-hidden
    />
  );
}

/** Learn topic slugs → unique atmosphere classes (see globals.css `.page-accent-learn-*`). */
export function learnAccentClass(slug: string): string {
  const map: Record<string, string> = {
    "time-sensitive": "page-accent-learn-time-sensitive",
    evidence: "page-accent-learn-evidence",
    "ratings-connection": "page-accent-learn-ratings-connection",
    "community-care": "page-accent-learn-community-care",
    "life-events": "page-accent-learn-life-events",
    "caregivers-survivors": "page-accent-learn-caregivers",
    "va-letters": "page-accent-learn-va-letters",
  };
  return map[slug] ?? "page-accent-learn-default";
}
