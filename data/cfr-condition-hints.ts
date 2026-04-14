import {
  CFR_3_304_MENTAL,
  CFR_3_310_SECONDARY,
  CFR_4_104_CARDIOVASCULAR,
  CFR_4_119_ENDOCRINE,
  CFR_4_124A_NEUROLOGICAL,
  CFR_4_130_MENTAL,
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

/** Optional extra lines + § links when common words match—always layered on top of universal help. */
function getKeywordSuggestion(t: string): { lines: string[]; links: CfrHintLink[] } | null {
  if (/\btinitus\b|\btinnitus\b|\bring(ing)?\b/.test(t)) {
    return {
      lines: [
        "Your wording points toward ear / tinnitus: § 4.87 is the usual schedule block—on that page use Find for 6260 or “tinnitus.”",
      ],
      links: [
        { kind: "external", label: "§ 4.87 — ear schedule", href: CFR_4_87_EAR },
        { kind: "external", label: "§ 4.85 — hearing impairment", href: CFR_4_85_HEARING },
      ],
    };
  }

  if (/\bhearing\b|\baudiolog|\bdeaf\b|\bdeafness\b|\bpuretone\b|\bword recognition\b|\bcnc\b/.test(t)) {
    return {
      lines: ["Your wording points toward hearing: § 4.85–§ 4.86; ear ratings often include § 4.87."],
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
      lines: ["Your wording points toward mental health: rating criteria are usually in § 4.130; Part 3 also uses § 3.304."],
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
        "Your wording points toward musculoskeletal / joints / spine: § 4.71a is the usual schedule block—use Find for your diagnosis or code.",
      ],
      links: [{ kind: "external", label: "§ 4.71a — musculoskeletal", href: CFR_4_71A_MSK }],
    };
  }

  if (/\bsleep apnea\b|\bapnea\b|\bosa\b|\basthma\b|\bcopd\b|\brespiratory\b|\blung\b|\bpulmonary\b|\bcpap\b/i.test(t)) {
    return {
      lines: ["Your wording points toward respiratory: § 4.97 is the usual schedule block."],
      links: [{ kind: "external", label: "§ 4.97 — respiratory", href: CFR_4_97_RESPIRATORY }],
    };
  }

  if (
    /\bheart\b|\bcardiac\b|\bhypertension\b|\bhtn\b|\bcad\b|\bangina\b|\bchf\b|\bcardiovascular\b|\bbp\b|\bblood pressure\b/i.test(
      t,
    )
  ) {
    return {
      lines: ["Your wording points toward cardiovascular: § 4.104 is the usual schedule block."],
      links: [{ kind: "external", label: "§ 4.104 — cardiovascular", href: CFR_4_104_CARDIOVASCULAR }],
    };
  }

  if (/\bdiabetes\b|\bdiabetic\b|\bthyroid\b|\bendocrine\b|\binsulin\b/i.test(t)) {
    return {
      lines: ["Your wording points toward endocrine: § 4.119 is the usual schedule block."],
      links: [{ kind: "external", label: "§ 4.119 — endocrine", href: CFR_4_119_ENDOCRINE }],
    };
  }

  if (
    /\bmigraine\b|\bheadache\b|\bheadaches\b|\bseizure\b|\bneuro\b|\btbi\b|\bneuropathy\b|\bparkinson\b|\bmultiple sclerosis\b|\bstroke\b/i.test(
      t,
    )
  ) {
    return {
      lines: ["Your wording points toward neurological: § 4.124a is a common schedule block for many neurological conditions."],
      links: [{ kind: "external", label: "§ 4.124a — neurological", href: CFR_4_124A_NEUROLOGICAL }],
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
    `You entered: “${display}.” VA does not publish one magic link per diagnosis—pick an official § below, press Find (Ctrl+F or ⌘F), and search for these words, a shorter name, or a diagnostic code from your paperwork.`,
  ];
  if (suggestion) {
    lines.push(...suggestion.lines);
  } else {
    lines.push(
      "We don’t know your diagnosis from a short phrase—use Find on Part 4 or the search link below with your exact words.",
    );
  }
  lines.push(
    "Secondary service connection (what may be caused or aggravated by what) is framed in § 3.310—read it with your clinician or accredited rep, not as a medical verdict.",
  );

  const links: CfrHintLink[] = [
    { kind: "internal", label: "Guide: Part 4 doorways (all body systems)", href: LEARN_FIND_ANY },
    { kind: "internal", label: "CFR map — Part 3 & Part 4", href: LEARN_CFR_MAP },
    { kind: "internal", label: "Example: tinnitus (how one code maps to a §)", href: LEARN_TINNITUS },
    ...(suggestion?.links ?? []),
    { kind: "external", label: "§ 3.310 — secondary (caused or aggravated by)", href: CFR_3_310_SECONDARY },
    { kind: "external", label: "§ 4.71a — musculoskeletal (common schedule)", href: CFR_4_71A_MSK },
    { kind: "external", label: "Part 4 — full schedule (Find anything)", href: CFR_PART_4_ROOT },
    {
      kind: "external",
      label: "Search eCFR on Google (your words)",
      href: ecfrSearchHref,
    },
  ];

  return {
    title: "38 CFR — your words + Find",
    lines,
    links: dedupeLinksByHref(links),
  };
}
