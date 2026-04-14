/**
 * Official eCFR.gov URLs for 38 CFR passages cited on the vet sheet and learn pages.
 * If a link 404s after an eCFR site update, search eCFR for the § number and replace the path.
 */

const ECFR = "https://www.ecfr.gov/current" as const;

/** Part 4 root — Schedule for Rating Disabilities. */
export const CFR_PART_4_ROOT = `${ECFR}/title-38/chapter-I/part-4` as const;

/** Part 3 — § 3.310 secondary (disability caused or aggravated by service-connected disability). */
export const CFR_3_310_SECONDARY = `${ECFR}/title-38/chapter-I/part-3#3.310` as const;

/**
 * Subpart B subject group “Impairment of auditory acuity” — §§ 4.85–4.87 live here.
 * § 4.87 includes Diagnostic Code 6260 (tinnitus, recurrent).
 */
const CFR_AUDITORY_ACUITY_GROUP =
  `${ECFR}/title-38/chapter-I/part-4/subpart-B/subject-group-ECFR378242b2776122d` as const;

/** § 4.85 — Evaluation of hearing impairment. */
export const CFR_4_85_HEARING = `${CFR_AUDITORY_ACUITY_GROUP}/section-4.85` as const;

/** § 4.87 — Schedule of ratings—ear (DC 6260 tinnitus; use Find on page for “6260”). */
export const CFR_4_87_EAR = `${CFR_AUDITORY_ACUITY_GROUP}/section-4.87` as const;

/** § 4.86 — Exceptional patterns of hearing impairment (same auditory subpart as §§ 4.85–4.87). */
export const CFR_4_86_HEARING_PATTERNS = `${CFR_AUDITORY_ACUITY_GROUP}/section-4.86` as const;

/**
 * § 4.130 — Schedule of ratings—mental disorders (Subpart B, mental health rating criteria).
 * Subject group id from eCFR “Impairment of mental health” / mental disorders block.
 */
export const CFR_4_130_MENTAL =
  `${ECFR}/title-38/chapter-I/part-4/subpart-B/subject-group-ECFRfa64377db09ae97/section-4.130` as const;

/** § 3.304 — Mental disorders (service connection principles in Part 3). */
export const CFR_3_304_MENTAL = `${ECFR}/title-38/chapter-I/part-3#3.304` as const;

/**
 * Part 4 — short `…/title-38/section-X.XX` links (same pattern eCFR uses for deep links).
 * Use **Find** on the page for a diagnosis keyword or diagnostic code when unsure.
 */
export const CFR_4_71A_MSK = `${ECFR}/title-38/section-4.71a` as const;

export const CFR_4_97_RESPIRATORY = `${ECFR}/title-38/section-4.97` as const;

export const CFR_4_104_CARDIOVASCULAR = `${ECFR}/title-38/section-4.104` as const;

export const CFR_4_119_ENDOCRINE = `${ECFR}/title-38/section-4.119` as const;

export const CFR_4_124A_NEUROLOGICAL = `${ECFR}/title-38/section-4.124a` as const;
