import type { StateVeteranPerksProfile, VeteranPerkEntry } from "@/types/veteran-state-perks";

const PORTAL_SOURCE =
  "Listed as the Texas veterans affairs website in the NASDVA Resources directory (https://nasdva.us/resources/).";

/** Curated Texas rows with official .gov sources—still not eligibility advice. */
const TX_STATE_BENEFITS: VeteranPerkEntry[] = [
  {
    id: "tx-state-portal",
    category: "portal_reference",
    name: "Texas Veterans Commission — state benefits hub",
    description:
      "Gateway to Texas programs for veterans and families (claims help, employment, education, mental health navigation, and pointers to other agencies).",
    eligibility: "Varies by program. Eligibility depends on Texas law, military service, discharge characterization, and other factors.",
    officialSourceUrl: "https://www.tvc.texas.gov/",
    notes: "Use this site plus county appraisal districts and TPWD for specific tax and license questions.",
  },
  {
    id: "tx-property-tax-homestead-100",
    category: "property_tax",
    name: "Residence homestead exemption — totally disabled veterans (and certain surviving spouses)",
    quickRefLine:
      "Total property tax exemption on a qualifying homestead when you meet Texas’s totally disabled veteran rules (often tied to 100% or qualifying IU).",
    eligibilityBand: "100_percent",
    perkFamilyId: "homestead_property_tax_total_disability",
    description:
      "Texas law provides a total property tax exemption on a qualifying residence homestead for some veterans with a service-connected disability and for certain surviving spouses. Amounts and partial exemptions for other ratings are also addressed in statute and comptroller guidance.",
    eligibility:
      "May apply if you meet statutory definitions (including VA rating or individual unemployability, surviving spouse rules, and homestead requirements). Your county appraisal district makes the determination on your application.",
    disabilityRatingNote:
      "Often discussed in terms of 100% P&T or individual unemployability; other partial exemptions may apply at lower ratings—see official charts.",
    officialSourceUrl: "https://comptroller.texas.gov/taxes/property-tax/exemptions/disabledvet-100-faq.php",
    notes: "File with your county appraisal district. Deadlines and forms (e.g., Form 50-114) matter—confirm on the comptroller and district sites.",
  },
  {
    id: "tx-property-tax-tvc-summary",
    category: "property_tax",
    name: "Property tax exemptions — disability rating overview (educational summary)",
    quickRefLine: "Chart-style overview of how exemptions may line up with VA ratings—confirm with your appraisal district.",
    eligibilityBand: "general",
    description:
      "TVC publishes a plain-language overview of how Texas residence homestead exemptions may align with VA disability ratings. It is a guide, not a binding determination.",
    eligibility: "Eligibility depends on your rating, homestead status, and Texas Tax Code. Confirm with your appraisal district.",
    disabilityRatingNote: "References multiple rating bands; verify against current law and your award letter.",
    officialSourceUrl: "https://tvc.texas.gov/news/property-tax-exemptions-available-to-veterans-per-disability-rating/",
    notes: "Cross-check any summary with the Texas Comptroller and your county chief appraiser.",
  },
  {
    id: "tx-driver-license-fee",
    category: "vehicle_registration",
    name: "Driver license and ID fee exemptions (certain disabled veterans)",
    quickRefLine: "Waived driver license / ID fees when you meet DPS disability and discharge rules (rating threshold on the official page).",
    eligibilityBand: "disabled_other",
    perkFamilyId: "driver_license_fee_waiver_disabled_veteran",
    description:
      "Texas DPS describes fee exemptions for qualifying veterans with a service-related disability at or above a threshold stated in their materials, with honorable discharge and other conditions.",
    eligibility:
      "May apply if you meet DPS requirements (disability compensation, rating threshold, discharge status, and other criteria). CDLs may be excluded.",
    disabilityRatingNote: "DPS materials reference a service-related disability percentage threshold—verify on the current DPS veteran services page.",
    officialSourceUrl: "https://www.dps.texas.gov/section/driver-license/veteran-services",
    notes: "Bring VA documentation as described by DPS. This is separate from vehicle registration and specialty plate rules.",
  },
];

const TX_RECREATION: VeteranPerkEntry[] = [
  {
    id: "tx-parklands-passport",
    category: "state_parks",
    name: "Texas Parklands Passport — free entry to state parks (veterans passport)",
    quickRefLine: "No daily entrance fee at Texas state parks for honorably discharged veterans who qualify under TPWD’s ID list.",
    eligibilityBand: "any_veteran",
    perkFamilyId: "state_parks_pass_veteran",
    description:
      "TPWD issues no-cost Parklands Passports so honorably discharged veterans can enter Texas state parks without paying the daily entrance fee, subject to program rules.",
    eligibility:
      "Generally requires honorable discharge and proof from the list TPWD publishes (e.g., veteran ID, driver license with veteran designation, DD214, or VHIC). Eligibility details are defined by TPWD.",
    officialSourceUrl: "https://tpwd.texas.gov/state-parks/park-information/passes/texas-parklands-passports",
    notes: "Pass covers the cardholder per TPWD rules. Disabled veteran and other passport types may differ—read TPWD’s table.",
  },
  {
    id: "tx-disabled-veteran-super-combo-license",
    category: "hunting_fishing",
    name: "Disabled Veteran Super Combo — hunting and all-water fishing package",
    quickRefLine:
      "Discounted all-in hunting and fishing package for qualifying disabled veterans (rating or loss-of-use rules on TPWD’s page).",
    eligibilityBand: "disabled_other",
    perkFamilyId: "hunting_fishing_super_combo_disabled_veteran",
    description:
      "TPWD offers a combination hunting and fishing license package for qualifying disabled veterans when statutory conditions are met. Federal stamps (such as duck stamp) may still be required separately.",
    eligibility:
      "May apply if you meet TPWD’s disabled veteran definition (including VA disability rating or loss-of-use criteria and receiving compensation). Available in person at license retailers per TPWD.",
    disabilityRatingNote: "TPWD states a minimum VA disability rating or specific loss-of-use criteria—confirm on the official license page.",
    officialSourceUrl:
      "https://tpwd.texas.gov/regulations/outdoor-annual/licenses/combination-hunting-fishing/disabled-veteran-super-combo-hunting-and-all-water-fishing-package",
    notes: "Not available online; documentation must meet TPWD recency rules.",
  },
];

export function buildTexasVeteranPerksProfile(): StateVeteranPerksProfile {
  return {
    stateCode: "TX",
    stateName: "Texas",
    officialAgencyName: "Texas Veterans Commission",
    officialPortalUrl: "https://www.tvc.texas.gov/",
    portalDirectorySource: PORTAL_SOURCE,
    stateLevelBenefits: TX_STATE_BENEFITS,
    recreationLifestylePerks: TX_RECREATION,
    veteransDayPerks: [],
    yearRoundDiscounts: [],
  };
}
