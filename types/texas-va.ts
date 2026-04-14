/**
 * VA Patient Advocate (Patient Representative) contact for a VAMC or CBOC.
 * Populated from official VA sources when available; Phase 1 uses empty strings.
 */
export type VaPatientAdvocate = {
  name: string;
  phone: string;
  email: string;
  officeLocation: string;
  notes: string;
};

export const EMPTY_VA_PATIENT_ADVOCATE: VaPatientAdvocate = {
  name: "",
  phone: "",
  email: "",
  officeLocation: "",
  notes: "",
};

/**
 * Texas VA health facility row. Maps to the standardized facility shape as:
 * `facilityName` → `name`, `facilityType` → `kind`, `phone` → `phoneMain`,
 * full street line → `facilityAddressLine()` / address + city + state + zip,
 * `website` → public page (often matches `sourceUrl` for VA.gov listings).
 */
export type TexasFacility = {
  id: string;
  name: string;
  kind: "VAMC" | "CBOC";
  system: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phoneMain: string;
  hoursSummary: string;
  lat: number;
  lng: number;
  /** Provenance / listing URL used when compiling this row */
  sourceUrl: string;
  /** Official facility web page (Phase 1: same as sourceUrl where that is the VA location page) */
  website: string;
  patientAdvocate: VaPatientAdvocate;
};

export type TexasOrg = {
  id: string;
  name: string;
  kind: "VFW" | "State" | "VSO";
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  hoursNote: string;
  sourceNote: string;
};

export type TexasStartingPoint = {
  label: string;
  addressLine: string;
  city: string;
  state: string;
  zip: string;
  lat: number;
  lng: number;
  privacyNote: string;
};

export type TexasVaData = {
  meta: {
    title: string;
    region: string;
    lastReviewed: string;
    disclaimer: string;
    sources: { label: string; url: string }[];
    startingPoint?: TexasStartingPoint;
  };
  scheduling: { label: string; phone: string; note: string }[];
  facilities: TexasFacility[];
  organizations: TexasOrg[];
  emergencyCopy: {
    title: string;
    lines: string[];
    disclaimer: string;
  };
};
