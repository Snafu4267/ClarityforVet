import {
  CFR_3_304_MENTAL,
  CFR_3_310_SECONDARY,
  CFR_4_104_CARDIOVASCULAR,
  CFR_4_119_ENDOCRINE,
  CFR_4_124A_NEUROLOGICAL,
  CFR_4_130_MENTAL,
  CFR_4_114_DIGESTIVE,
  CFR_4_118_SKIN,
  CFR_4_71A_MSK,
  CFR_4_85_HEARING,
  CFR_4_86_HEARING_PATTERNS,
  CFR_4_87_EAR,
  CFR_4_97_RESPIRATORY,
  CFR_PART_4_ROOT,
} from "@/data/cfr-links";

/** General Part 4 “doorways” guide (same spirit as the tinnitus write-up). */
export const LEARN_FIND_ANY = "/learn/ratings-connection#cfr-find-your-condition" as const;
export const LEARN_CFR_MAP = "/learn/ratings-connection#cfr-map" as const;
export const LEARN_TINNITUS = "/learn/ratings-connection#cfr-tinnitus-example" as const;

export type CfrHintLink =
  | { kind: "external"; label: string; href: string }
  | { kind: "internal"; label: string; href: string };

export type CfrConditionHint = {
  title: string;
  lines: string[];
  links: CfrHintLink[];
  relatedQuestionLinks?: CfrHintLink[];
};

const DISPLAY_MAX = 140;

function truncateDisplay(s: string): string {
  const t = s.trim();
  if (t.length <= DISPLAY_MAX) return t;
  return `${t.slice(0, DISPLAY_MAX - 1)}…`;
}

function dedupeLinksByHref(links: CfrHintLink[]): CfrHintLink[] {
  const seen = new Set<string>();
  return links.filter((l) => {
    if (seen.has(l.href)) return false;
    seen.add(l.href);
    return true;
  });
}

function relatedGoogleQueryLink(label: string, query: string): CfrHintLink {
  return {
    kind: "external",
    label,
    href: `https://www.google.com/search?q=${encodeURIComponent(query)}`,
  };
}

/** Optional “how might these connect” routes — prompts for clinician questions, not diagnosis claims. */
function getRelatedSecondaryQuestionPaths(t: string): CfrHintLink[] {
  if (/\btinitus\b|\btinnitus\b|\bring(ing)?\b/.test(t)) {
    return [
      { kind: "external", label: "Path: sleep apnea / breathing questions (§ 4.97)", href: CFR_4_97_RESPIRATORY },
      { kind: "external", label: "Path: headaches / neuro questions (§ 4.124a)", href: CFR_4_124A_NEUROLOGICAL },
      { kind: "external", label: "Path: anxiety / depression / PTSD questions (§ 4.130)", href: CFR_4_130_MENTAL },
      { kind: "external", label: "Secondary rule doorway (§ 3.310)", href: CFR_3_310_SECONDARY },
      relatedGoogleQueryLink(
        "Search: eCFR tinnitus + sleep apnea",
        "site:ecfr.gov tinnitus sleep apnea 3.310 4.97",
      ),
      relatedGoogleQueryLink(
        "Search: eCFR tinnitus + headaches",
        "site:ecfr.gov tinnitus headaches migraine 3.310 4.124a",
      ),
      relatedGoogleQueryLink(
        "Search: eCFR tinnitus + PTSD/depression",
        "site:ecfr.gov tinnitus PTSD depression anxiety 3.310 4.130",
      ),
    ];
  }

  if (/\bptsd\b|\bpost[- ]?traumatic\b|\btraumatic stress\b|\banxiety\b|\bdepression\b|\bmental health\b/i.test(t)) {
    return [
      { kind: "external", label: "Mental criteria (§ 4.130)", href: CFR_4_130_MENTAL },
      { kind: "external", label: "Secondary rule doorway (§ 3.310)", href: CFR_3_310_SECONDARY },
      relatedGoogleQueryLink(
        "Search: eCFR mental + sleep apnea",
        "site:ecfr.gov PTSD depression anxiety sleep apnea 3.310 4.97",
      ),
      relatedGoogleQueryLink(
        "Search: eCFR mental + headaches",
        "site:ecfr.gov PTSD depression anxiety headaches migraine 3.310 4.124a",
      ),
    ];
  }

  if (/\bgerd\b|\breflux\b|\bgastroesophageal\b|\besophagitis\b|\bhiatal\b/i.test(t)) {
    return [
      { kind: "external", label: "Digestive criteria (§ 4.114)", href: CFR_4_114_DIGESTIVE },
      { kind: "external", label: "Secondary rule doorway (§ 3.310)", href: CFR_3_310_SECONDARY },
      relatedGoogleQueryLink(
        "Search: eCFR GERD + sleep issues",
        "site:ecfr.gov GERD reflux sleep 3.310 4.114",
      ),
    ];
  }

  return [];
}

/** Optional extra lines + § links when common words match—always layered on top of universal help. */
function getKeywordSuggestion(t: string): { lines: string[]; links: CfrHintLink[] } | null {
  if (/\btinitus\b|\btinnitus\b|\bring(ing)?\b/.test(t)) {
    return {
      lines: [
        "This can connect to ear/tinnitus rules. Open § 4.87 and use Find for 6260 or “tinnitus.”",
      ],
      links: [
        { kind: "external", label: "§ 4.87 — ear schedule", href: CFR_4_87_EAR },
        { kind: "external", label: "§ 4.85 — hearing impairment", href: CFR_4_85_HEARING },
      ],
    };
  }

  if (/\bhearing\b|\baudiolog|\bdeaf\b|\bdeafness\b|\bpuretone\b|\bword recognition\b|\bcnc\b/.test(t)) {
    return {
      lines: ["This can connect to hearing rules: § 4.85–§ 4.86, and often § 4.87."],
      links: [
        { kind: "external", label: "§ 4.85 — hearing impairment", href: CFR_4_85_HEARING },
        { kind: "external", label: "§ 4.86 — exceptional hearing patterns", href: CFR_4_86_HEARING_PATTERNS },
        { kind: "external", label: "§ 4.87 — ear schedule", href: CFR_4_87_EAR },
      ],
    };
  }

  if (
    /\bptsd\b|\bpost[- ]?traumatic\b|\btraumatic stress\b|\banxiety\b|\bdepression\b|\bbipolar\b|\bmental health\b|\bmood\b|\bpanic\b|\bocd\b|\bschizophrenia\b|\bschizophren\b/i.test(
      t,
    )
  ) {
    return {
      lines: ["This can connect to mental-health rules: usually § 4.130, and also § 3.304 in Part 3."],
      links: [
        { kind: "external", label: "§ 4.130 — mental disorders", href: CFR_4_130_MENTAL },
        { kind: "external", label: "§ 3.304 — mental disorders (Part 3)", href: CFR_3_304_MENTAL },
      ],
    };
  }

  if (
    /\bknee\b|\bback\b|\blumbar\b|\bcervical\b|\bthoracic\b|\bspine\b|\bneck\b|\bshoulder\b|\belbow\b|\bwrist\b|\bhip\b|\bankle\b|\bfoot\b|\bfeet\b|\barthritis\b|\bgout\b|\bgouty\b|\bjoint\b|\bjoints\b|\bmeniscus\b|\brotator\b|\bsciatica\b|\bradiculopath|\bmsk\b|\borthopedic|\bbone\b|\bvertebra|\bscoliosis\b|\bstenosis\b|\btendinitis\b|\btendonitis\b|\bbursitis\b|\bcarpal\b|\bfibromyalgia\b|\brheumatoid\b|\bosteoarthritis\b|\bplantar\b|\bepicondylitis\b|\bsacroiliac\b|\btmj\b|\btennis elbow\b|\bgolfers elbow\b/i.test(
      t,
    )
  ) {
    return {
      lines: [
        "This can connect to joints/spine/musculoskeletal rules: § 4.71a. Use Find for your condition words.",
      ],
      links: [{ kind: "external", label: "§ 4.71a — musculoskeletal", href: CFR_4_71A_MSK }],
    };
  }

  if (/\binsomnia\b/.test(t)) {
    return {
      lines: ["This can connect to sleep/mental-health questions: start with § 4.130 and compare with breathing rules in § 4.97 when relevant."],
      links: [
        { kind: "external", label: "§ 4.130 — mental disorders", href: CFR_4_130_MENTAL },
        { kind: "external", label: "§ 4.97 — respiratory", href: CFR_4_97_RESPIRATORY },
      ],
    };
  }

  if (/\bsleep apnea\b|\bapnea\b|\bosa\b|\basthma\b|\bcopd\b|\brespiratory\b|\blung\b|\bpulmonary\b|\bcpap\b|\bsinusitis\b|\brhinitis\b/i.test(t)) {
    return {
      lines: ["This can connect to breathing/lung rules: § 4.97."],
      links: [{ kind: "external", label: "§ 4.97 — respiratory", href: CFR_4_97_RESPIRATORY }],
    };
  }

  if (/\bgerd\b|\breflux\b|\bgastroesophageal\b|\besophagitis\b|\bhiatal\b|\bibs\b|\bcolitis\b|\bulcer\b|\bgastritis\b/i.test(t)) {
    return {
      lines: ["This can connect to digestive rules: § 4.114."],
      links: [{ kind: "external", label: "§ 4.114 — digestive system", href: CFR_4_114_DIGESTIVE }],
    };
  }

  if (
    /\bheart\b|\bcardiac\b|\bhypertension\b|\bhtn\b|\bcad\b|\bangina\b|\bchf\b|\bcardiovascular\b|\bbp\b|\bblood pressure\b/i.test(
      t,
    )
  ) {
    return {
      lines: ["This can connect to heart/blood-pressure rules: § 4.104."],
      links: [{ kind: "external", label: "§ 4.104 — cardiovascular", href: CFR_4_104_CARDIOVASCULAR }],
    };
  }

  if (/\bdiabetes\b|\bdiabetic\b|\bthyroid\b|\bendocrine\b|\binsulin\b/i.test(t)) {
    return {
      lines: ["This can connect to endocrine rules (diabetes/thyroid): § 4.119."],
      links: [{ kind: "external", label: "§ 4.119 — endocrine", href: CFR_4_119_ENDOCRINE }],
    };
  }

  if (/\bobesity\b/.test(t)) {
    return {
      lines: ["This can connect to endocrine/metabolic questions and often secondary-connection questions under § 3.310."],
      links: [
        { kind: "external", label: "§ 4.119 — endocrine", href: CFR_4_119_ENDOCRINE },
        { kind: "external", label: "§ 3.310 — secondary (caused or aggravated by)", href: CFR_3_310_SECONDARY },
      ],
    };
  }

  if (/\bvertigo\b/.test(t)) {
    return {
      lines: ["This can connect to ear/vestibular and neuro questions: start with § 4.87, then compare with § 4.124a."],
      links: [
        { kind: "external", label: "§ 4.87 — ear schedule", href: CFR_4_87_EAR },
        { kind: "external", label: "§ 4.124a — neurological", href: CFR_4_124A_NEUROLOGICAL },
      ],
    };
  }

  if (
    /\bmigraines?\b|\bheadache\b|\bheadaches\b|\bseizure\b|\bneuro\b|\btbi\b|\bneuropathy\b|\bparkinson\b|\bmultiple sclerosis\b|\bstroke\b/i.test(
      t,
    )
  ) {
    return {
      lines: ["This can connect to neuro/headache/TBI rules: § 4.124a."],
      links: [{ kind: "external", label: "§ 4.124a — neurological", href: CFR_4_124A_NEUROLOGICAL }],
    };
  }

  if (/\beczema\b|\bdermatitis\b|\bskin\b|\bpsoriasis\b/.test(t)) {
    return {
      lines: ["This can connect to skin-condition rules: § 4.118."],
      links: [{ kind: "external", label: "§ 4.118 — skin conditions", href: CFR_4_118_SKIN }],
    };
  }

  return null;
}

/**
 * Every non-empty “What it’s for” line gets the same universal path (guides + § 3.310 + Part 4 + Find).
 * Optional keyword hints add suggested § links—they never replace the universal path.
 */
export function getCfrHintForConditionText(raw: string): CfrConditionHint | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  const lower = trimmed.toLowerCase();
  const display = truncateDisplay(trimmed);
  const suggestion = getKeywordSuggestion(lower);

  /** Web search limited to public eCFR—helps rare words we did not hard-code. */
  const ecfrSearchHref = `https://www.google.com/search?q=${encodeURIComponent(`site:ecfr.gov ${trimmed}`)}`;

  const lines: string[] = [
    `You typed: “${display}.” There is no one perfect VA link for any single condition.`,
    "We are NOT diagnosing anything here. This is only a question-builder for your doctor or accredited rep.",
  ];
  if (suggestion) {
    lines.push(...suggestion.lines);
  } else {
    lines.push(
      "If we do not match your words yet, use Part 4 and search with the exact words from your paperwork.",
    );
  }
  lines.push("Quick order: 1) click the condition link, 2) use Find on that page, 3) use Part 4 as backup.");
  lines.push("This is the part VA will not ask for you: if you do not ask about possible connections, they may never get reviewed.");
  lines.push("§ 3.310 is the secondary-connection rule (what may be caused or worsened by another condition).");

  const links: CfrHintLink[] = [
    { kind: "internal", label: "Guide: Part 4 doorways (all body systems)", href: LEARN_FIND_ANY },
    { kind: "internal", label: "CFR map — Part 3 & Part 4", href: LEARN_CFR_MAP },
    ...(suggestion?.links ?? []),
    { kind: "external", label: "§ 3.310 — secondary (caused or aggravated by)", href: CFR_3_310_SECONDARY },
    { kind: "external", label: "Part 4 — full schedule (Find anything)", href: CFR_PART_4_ROOT },
    {
      kind: "external",
      label: "Search eCFR on Google (your words)",
      href: ecfrSearchHref,
    },
  ];

  const relatedQuestionLinks = dedupeLinksByHref(getRelatedSecondaryQuestionPaths(lower));

  return {
    title: "38 CFR — your words + Find",
    lines,
    links: dedupeLinksByHref([
      ...links,
      { kind: "internal", label: "Example: tinnitus (how one code maps to a §)", href: LEARN_TINNITUS },
    ]),
    relatedQuestionLinks,
  };
}
