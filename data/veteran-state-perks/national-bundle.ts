import type { NationalVeteranPerksBundle, VeteranPerkEntry } from "@/types/veteran-state-perks";

const VETERANS_DAY: VeteranPerkEntry[] = [
  {
    id: "nat-vets-day-verify-locally",
    category: "veterans_day_offer",
    name: "Veterans Day retail and restaurant offers — verify each year",
    quickRefLine: "Chains often run one-day meals or discounts—rules change every year; confirm with the store you plan to visit.",
    description:
      "Many national chains run time-limited Veterans Day meals or discounts. Menus, hours, proof of service, and participation vary by location and change every year.",
    eligibility: "Usually requires proof of military or veteran status as defined by the business (ID, VA card, DD214, etc.).",
    officialSourceUrl:
      "https://www.militaryonesource.mil/financial-legal/personal-finance/money-saving-tips-for-military-families/",
    officialLinkLabel: "Military OneSource: saving money & everyday discounts (verify each business) →",
    notes: "No government site lists every private Veterans Day deal. Call the location or read the company’s own announcement before you go.",
  },
  {
    id: "nat-dol-vets",
    category: "employment",
    name: "U.S. Department of Labor — Veterans’ Employment and Training Service (VETS)",
    quickRefLine: "Federal hub for job help, transition programs, and employment rights—not a discount list.",
    description:
      "Federal hub for employment rights, transition programs, and resources for veterans (not a discount list, but a core national benefit pathway).",
    eligibility: "Varies by program.",
    officialSourceUrl: "https://www.dol.gov/agencies/vets",
    notes: "Use for career and USERRA information rather than restaurant or theme-park deals.",
  },
];

const YEAR_ROUND: VeteranPerkEntry[] = [
  {
    id: "nat-verify-at-point-of-sale",
    category: "retail_discount",
    name: "National brand military / veteran discounts — verify at the business",
    quickRefLine: "Some brands offer everyday military/veteran pricing—policy is set by the business, not VA.",
    description:
      "Some retailers, hotels, and services advertise everyday military or veteran discounts. Policies differ by brand, franchise, region, and product category; many require verified ID.",
    eligibility: "Defined solely by the merchant. Government sites do not maintain a complete, binding catalog of private discounts.",
    officialSourceUrl:
      "https://www.militaryonesource.mil/benefits/benefits-finder/?filter-benefit-type=discounts-perks",
    officialLinkLabel: "Military OneSource: browse discounts & perks (still confirm with the business) →",
    notes: "Ask at checkout or read the company’s published policy. Clarity4Vets does not guarantee any private discount.",
  },
  {
    id: "nat-military-wildlife-licenses",
    category: "hunting_fishing",
    name: "U.S. Fish & Wildlife Service — military and veterans fishing and hunting access",
    quickRefLine: "Some federal wildlife/refuge rules have military or veteran fee breaks—check the specific refuge or program.",
    description:
      "Federal lands and programs sometimes include fee-free days or license guidance for active military and veterans. Rules depend on the refuge, park, or state-federal combination.",
    eligibility: "Varies by site and program; check the specific refuge or federal unit.",
    officialSourceUrl: "https://www.fws.gov/initiative/military-veterans",
    notes: "Complements—not replaces—your state fish and game agency rules.",
  },
];

export const NATIONAL_VETERAN_PERKS_BUNDLE: NationalVeteranPerksBundle = {
  disclaimer:
    "Quick notes only. Clarity4Vets does not run these programs. Confirm every perk with the official agency or business.",
  veteransDayOffers: VETERANS_DAY,
  yearRoundOffers: YEAR_ROUND,
};
