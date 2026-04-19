import type { AwarenessModule, AwarenessSection } from "@/data/awareness-modules";
import { SITE_NAME } from "@/lib/site";

const SHORT_TOPIC_BODY =
  "**Short guide:** Details depend on your situation and VA’s current rules. Use the official VA.gov links below — not legal advice.";

function shortenSummary(summary: string): string {
  const sentence = summary.split(/(?<=[.!?])\s+/)[0]?.trim();
  return sentence && sentence.length <= 280 ? sentence : `${summary.slice(0, 220).trim()}…`;
}

function simplifySection(section: AwarenessSection): AwarenessSection {
  const stripped: AwarenessSection = {
    ...section,
    highlightAfterHeading: undefined,
    formGuideActions: undefined,
  };

  if (section.links?.length) {
    return { ...stripped, body: [SHORT_TOPIC_BODY] };
  }

  if (section.sectionLayout === "personal-note") {
    return {
      ...stripped,
      body: [
        `**From ${SITE_NAME}:** Deadlines and filings still run on dates and official notices — same discipline you used on orders. Confirm everything that matters on **VA.gov** using the links on this page.`,
      ],
    };
  }

  const first = section.body[0];
  return {
    ...stripped,
    body: first ? [first] : [SHORT_TOPIC_BODY],
  };
}

/** Lighter learn pages: brief intro + official links; strips long claims-process narrative. */
export function awarenessModuleForPublicSite(mod: AwarenessModule): AwarenessModule {
  return {
    ...mod,
    summary: shortenSummary(mod.summary),
    sections: mod.sections.map(simplifySection),
  };
}
