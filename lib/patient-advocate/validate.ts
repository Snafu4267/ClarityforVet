import type { TexasFacility, VaPatientAdvocate } from "@/types/texas-va";
import { normalizeEmail, normalizeFreeText, normalizeNotesPhrasing, normalizePhoneDisplay } from "./format";

export type AdvocateSeverity = "error" | "warn" | "info";

export type AdvocateValidationIssue = {
  facilityId: string;
  facilityName: string;
  kind: "VAMC" | "CBOC";
  field: string;
  severity: AdvocateSeverity;
  message: string;
};

export type NormalizedPatientAdvocate = VaPatientAdvocate;

/** Apply normalizers without dropping information. */
export function normalizePatientAdvocate(input: VaPatientAdvocate): {
  value: NormalizedPatientAdvocate;
  issues: Omit<AdvocateValidationIssue, "facilityId" | "facilityName" | "kind">[];
} {
  const issues: Omit<AdvocateValidationIssue, "facilityId" | "facilityName" | "kind">[] = [];

  const name = normalizeFreeText(input.name);
  const officeLocation = normalizeFreeText(input.officeLocation);
  const notes = normalizeNotesPhrasing(input.notes);

  const phoneResult = normalizePhoneDisplay(input.phone);
  if (phoneResult.warning) {
    issues.push({ field: "patientAdvocate.phone", severity: "warn", message: phoneResult.warning });
  }

  const emailResult = normalizeEmail(input.email);
  if (emailResult.warning) {
    issues.push({ field: "patientAdvocate.email", severity: "warn", message: emailResult.warning });
  }

  return {
    value: {
      name,
      phone: phoneResult.display,
      email: emailResult.email,
      officeLocation,
      notes,
    },
    issues,
  };
}

/** True if no advocate contact fields are filled (expected during Phase 1 / before Phase 2). */
export function isAdvocatePlaceholder(pa: VaPatientAdvocate): boolean {
  return (
    !normalizeFreeText(pa.name) &&
    !normalizeFreeText(pa.phone) &&
    !normalizeFreeText(pa.email) &&
    !normalizeFreeText(pa.officeLocation) &&
    !normalizeFreeText(pa.notes)
  );
}

/**
 * Validate one facility’s patientAdvocate block.
 * Policy: empty placeholder = info only. Once any field is set, require at least one reliable path (phone or email).
 */
export function validateFacilityPatientAdvocate(f: TexasFacility): AdvocateValidationIssue[] {
  const pa = f.patientAdvocate;
  const base = { facilityId: f.id, facilityName: f.name, kind: f.kind };
  const out: AdvocateValidationIssue[] = [];

  if (!pa || typeof pa !== "object") {
    out.push({
      ...base,
      field: "patientAdvocate",
      severity: "error",
      message: "Missing patientAdvocate object.",
    });
    return out;
  }

  if (isAdvocatePlaceholder(pa)) {
    out.push({
      ...base,
      field: "patientAdvocate",
      severity: "info",
      message: "Placeholder (no official Patient Advocate data yet).",
    });
    return out;
  }

  const hasPhone = Boolean(normalizeFreeText(pa.phone));
  const hasEmail = Boolean(normalizeFreeText(pa.email));
  const hasName = Boolean(normalizeFreeText(pa.name));

  if (!hasPhone && !hasEmail) {
    out.push({
      ...base,
      field: "patientAdvocate",
      severity: "warn",
      message: "Partial data: name or location present but neither phone nor email—add a VA-listed phone or email.",
    });
  }

  if (!hasName && (hasPhone || hasEmail)) {
    out.push({
      ...base,
      field: "patientAdvocate.name",
      severity: "info",
      message: "No individual name listed (acceptable if official source lists only a role or main line).",
    });
  }

  const { issues: normIssues } = normalizePatientAdvocate(pa);
  for (const i of normIssues) {
    out.push({ ...base, ...i });
  }

  return out;
}

/** Find duplicate normalized phone numbers across facilities (same display string after normalize). */
export function findDuplicateAdvocatePhones(facilities: TexasFacility[]): AdvocateValidationIssue[] {
  const byId = new Map(facilities.map((f) => [f.id, f]));
  const map = new Map<string, string[]>();
  for (const f of facilities) {
    const p = normalizePhoneDisplay(f.patientAdvocate.phone).display;
    if (!p) continue;
    const list = map.get(p) ?? [];
    list.push(f.id);
    map.set(p, list);
  }
  const out: AdvocateValidationIssue[] = [];
  for (const [phone, ids] of map) {
    if (ids.length < 2) continue;
    const first = byId.get(ids[0]!);
    out.push({
      facilityId: ids.join(", "),
      facilityName: `${ids.length} facilities share this advocate phone`,
      kind: first?.kind ?? "VAMC",
      field: "patientAdvocate.phone",
      severity: "info",
      message: `Duplicate normalized Patient Advocate phone (may be correct if shared / parent VAMC): ${phone}`,
    });
  }
  return out;
}

export type AdvocateReport = {
  facilityCount: number;
  counts: Record<AdvocateSeverity, number>;
  issues: AdvocateValidationIssue[];
};

export function buildPatientAdvocateReport(facilities: TexasFacility[]): AdvocateReport {
  const issues: AdvocateValidationIssue[] = [];
  for (const f of facilities) {
    issues.push(...validateFacilityPatientAdvocate(f));
  }
  issues.push(...findDuplicateAdvocatePhones(facilities));

  const counts: Record<AdvocateSeverity, number> = { error: 0, warn: 0, info: 0 };
  for (const i of issues) counts[i.severity]++;

  return { facilityCount: facilities.length, counts, issues };
}
