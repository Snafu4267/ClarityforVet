/**
 * Normalize Patient Advocate contact fields for display and QA.
 * Educational site context: never fabricate digits—if parsing fails, return original with a flag.
 */

/** Pull extension from common VA-style tails: "ext. 2", "x1234", "extension 5" */
function splitExtension(input: string): { body: string; ext: string | null } {
  const m = input.match(/^(.*?)[\s,;]*(?:\bext\.?\s*|\bextension\s*|\bx)(\d{1,8})\s*$/i);
  if (m) return { body: m[1].trim(), ext: m[2] };
  return { body: input.trim(), ext: null };
}

/** Digits only (after optional +1 strip handled separately). */
function digitsOnly(s: string): string {
  return s.replace(/\D/g, "");
}

/**
 * Normalize a US phone string to `(XXX) XXX-XXXX` with optional ` ext. ####`.
 * Non‑10-digit US numbers are returned trimmed, unchanged, with a warning.
 */
export function normalizePhoneDisplay(raw: string): { display: string; normalized: boolean; warning?: string } {
  const trimmed = raw.trim();
  if (!trimmed) return { display: "", normalized: true };

  const { body, ext } = splitExtension(trimmed);
  let d = digitsOnly(body);
  if (d.length === 11 && d.startsWith("1")) d = d.slice(1);
  if (d.length !== 10) {
    return {
      display: trimmed,
      normalized: false,
      warning: "Not a 10-digit US number after stripping punctuation; left unchanged.",
    };
  }
  const core = `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
  const display = ext ? `${core} ext. ${ext}` : core;
  return { display, normalized: true };
}

/** Lowercase email, trim; basic shape check (not RFC-complete). */
export function normalizeEmail(raw: string): { email: string; warning?: string } {
  const t = raw.trim().toLowerCase();
  if (!t) return { email: "" };
  // Reasonable guard: one @, domain has a dot, no spaces
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t)) {
    return { email: t, warning: "Email does not match a simple valid pattern." };
  }
  return { email: t };
}

/** Collapse whitespace; trim ends. */
export function normalizeFreeText(raw: string): string {
  return raw.replace(/\s+/g, " ").trim();
}

/**
 * Light phrase consistency for notes (does not alter proper names in the middle of sentences).
 * Standardizes a few VA terms when they appear as whole words.
 */
export function normalizeNotesPhrasing(raw: string): string {
  let s = normalizeFreeText(raw);
  if (!s) return "";
  const replacements: [RegExp, string][] = [
    [/\bcboc\b/gi, "CBOC"],
    [/\bvamc\b/gi, "VAMC"],
    [/\bpatient representative\b/gi, "Patient Representative"],
    [/\bpatient advocate\b/gi, "Patient Advocate"],
  ];
  for (const [re, rep] of replacements) s = s.replace(re, rep);
  return s;
}
