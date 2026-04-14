/** USPS state codes plus D.C. for perks and pickers. VA facility map excludes DC where no `US-DC.json` exists. */
const RAW: { code: string; name: string }[] = [
  { code: "AL", name: "Alabama" },
  { code: "AK", name: "Alaska" },
  { code: "AZ", name: "Arizona" },
  { code: "AR", name: "Arkansas" },
  { code: "CA", name: "California" },
  { code: "CO", name: "Colorado" },
  { code: "CT", name: "Connecticut" },
  { code: "DE", name: "Delaware" },
  { code: "DC", name: "District of Columbia" },
  { code: "FL", name: "Florida" },
  { code: "GA", name: "Georgia" },
  { code: "HI", name: "Hawaii" },
  { code: "ID", name: "Idaho" },
  { code: "IL", name: "Illinois" },
  { code: "IN", name: "Indiana" },
  { code: "IA", name: "Iowa" },
  { code: "KS", name: "Kansas" },
  { code: "KY", name: "Kentucky" },
  { code: "LA", name: "Louisiana" },
  { code: "ME", name: "Maine" },
  { code: "MD", name: "Maryland" },
  { code: "MA", name: "Massachusetts" },
  { code: "MI", name: "Michigan" },
  { code: "MN", name: "Minnesota" },
  { code: "MS", name: "Mississippi" },
  { code: "MO", name: "Missouri" },
  { code: "MT", name: "Montana" },
  { code: "NE", name: "Nebraska" },
  { code: "NV", name: "Nevada" },
  { code: "NH", name: "New Hampshire" },
  { code: "NJ", name: "New Jersey" },
  { code: "NM", name: "New Mexico" },
  { code: "NY", name: "New York" },
  { code: "NC", name: "North Carolina" },
  { code: "ND", name: "North Dakota" },
  { code: "OH", name: "Ohio" },
  { code: "OK", name: "Oklahoma" },
  { code: "OR", name: "Oregon" },
  { code: "PA", name: "Pennsylvania" },
  { code: "RI", name: "Rhode Island" },
  { code: "SC", name: "South Carolina" },
  { code: "SD", name: "South Dakota" },
  { code: "TN", name: "Tennessee" },
  { code: "TX", name: "Texas" },
  { code: "UT", name: "Utah" },
  { code: "VT", name: "Vermont" },
  { code: "VA", name: "Virginia" },
  { code: "WA", name: "Washington" },
  { code: "WV", name: "West Virginia" },
  { code: "WI", name: "Wisconsin" },
  { code: "WY", name: "Wyoming" },
];

/** Sorted by display name for dropdowns */
export const US_STATES_BY_NAME: { code: string; name: string }[] = [...RAW].sort((a, b) =>
  a.name.localeCompare(b.name, "en", { sensitivity: "base" }),
);

/** VA facilities picker: D.C. omitted until `US-DC.json` exists (Texas stays—`/va-facilities/tx` redirects to `/texas`). */
export const US_STATES_FOR_VA_FACILITIES_PICKER: { code: string; name: string }[] = US_STATES_BY_NAME.filter(
  (s) => s.code !== "DC",
);

/** Static generation for `/va-facilities/[state]` (no TX—redirect; no DC—no data file). */
export const US_STATES_FOR_VA_FACILITIES_SSG: { code: string; name: string }[] = US_STATES_BY_NAME.filter(
  (s) => s.code !== "TX" && s.code !== "DC",
);

const BY_CODE = new Map(RAW.map((s) => [s.code, s.name]));

export function isValidUsStateCode(code: string): boolean {
  return BY_CODE.has(code.trim().toUpperCase());
}

export function getUsStateName(code: string): string | undefined {
  return BY_CODE.get(code.trim().toUpperCase());
}

/** Lowercase URL segment, e.g. `tx` */
export function normalizeStateCodeParam(param: string): string | null {
  const upper = param.trim().toUpperCase();
  if (upper.length !== 2 || !BY_CODE.has(upper)) return null;
  return upper.toLowerCase();
}
