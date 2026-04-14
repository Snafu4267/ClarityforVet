import type { VaFormGuideId } from "@/data/va-form-guides";

/**
 * One-screen index of official VA (and related) forms—printable PDFs where we could verify a stable URL,
 * plus VA.gov form pages when the PDF path varies. Confirm critical filings on VA.gov before sending.
 */

export type VaFormHubItem = {
  form: string;
  name: string;
  /** Direct printable PDF when available */
  pdfUrl?: string;
  /** VA form landing page (download / current revision) */
  pageUrl?: string;
};

export type VaFormHubGroup = {
  id: string;
  title: string;
  blurb?: string;
  items: VaFormHubItem[];
};

export const vaFormsHubGroups: VaFormHubGroup[] = [
  {
    id: "comp",
    title: "Disability compensation — file a claim or add evidence",
    blurb:
      "Most veterans who talk about “filing with VA” mean this lane. You can also file online at VA.gov instead of paper.",
    items: [
      {
        form: "VA Form 21-526EZ",
        name: "Application for Disability Compensation and Related Compensation Benefits",
        pdfUrl: "https://www.vba.va.gov/pubs/forms/vba-21-526ez-are.pdf",
      },
      {
        form: "VA Form 21-0966",
        name: "Intent to File a Claim for Compensation and/or Pension, or Survivors Pension and/or DIC",
        pdfUrl: "https://www.vba.va.gov/pubs/forms/vba-21-0966-are.pdf",
      },
      {
        form: "VA Form 21-4138",
        name: "Statement in Support of Claim",
        pdfUrl: "https://www.vba.va.gov/pubs/forms/vba-21-4138-are.pdf",
      },
      {
        form: "VA Form 21-10210",
        name: "Lay/Witness Statement",
        pdfUrl: "https://www.vba.va.gov/pubs/forms/vba-21-10210-are.pdf",
      },
      {
        form: "VA Form 21-4142",
        name: "Authorization to Disclose Information to the Department of Veterans Affairs",
        pdfUrl: "https://www.vba.va.gov/pubs/forms/vba-21-4142-are.pdf",
      },
      {
        form: "VA Form 21-4142a",
        name: "General Release for Medical Provider Information",
        pdfUrl: "https://www.vba.va.gov/pubs/forms/vba-21-4142a-are.pdf",
      },
      {
        form: "VA Form 21-0781",
        name: "Statement in Support of Claim for Service Connection for PTSD",
        pdfUrl: "https://www.vba.va.gov/pubs/forms/vba-21-0781-are.pdf",
      },
      {
        form: "VA Form 21-0781a",
        name: "Statement in Support of Claim for Service Connection for PTSD Secondary to Personal Assault",
        pageUrl: "https://www.va.gov/forms/21-0781a",
      },
      {
        form: "VA Form 21-8940",
        name: "Application for Increased Compensation Based on Unemployability",
        pdfUrl: "https://www.vba.va.gov/pubs/forms/vba-21-8940-are.pdf",
      },
      {
        form: "VA Form 21-8941",
        name: "Veteran’s Application for Increased Compensation Based on Unemployability (with spouse info)",
        pageUrl: "https://www.va.gov/forms/21-8941",
      },
    ],
  },
  {
    id: "reviews",
    title: "Decision reviews & appeals (after you have a decision)",
    blurb: "Pick the lane that matches what you’re doing—VA’s rules decide which one applies.",
    items: [
      {
        form: "VA Form 20-0995",
        name: "Decision Review Request: Supplemental Claim",
        pdfUrl: "https://www.vba.va.gov/pubs/forms/vba-20-0995-are.pdf",
      },
      {
        form: "VA Form 20-0996",
        name: "Decision Review Request: Higher-Level Review",
        pdfUrl: "https://www.vba.va.gov/pubs/forms/vba-20-0996-are.pdf",
      },
      {
        form: "VA Form 21-10182",
        name: "Decision Review Request: Board Appeal (Notice of Disagreement)",
        pageUrl: "https://www.va.gov/find-forms/about-form-21-10182/",
      },
    ],
  },
  {
    id: "health",
    title: "VA health care — enrollment & medical records",
    items: [
      {
        form: "VA Form 10-10EZ",
        name: "Application for Health Benefits",
        pdfUrl: "https://www.va.gov/vaforms/medical/pdf/VA%20Form%2010-10EZ.pdf",
      },
      {
        form: "VA Form 10-10EZR",
        name: "Health Benefits Update Form (keep your info current)",
        pdfUrl: "https://www.va.gov/vaforms/medical/pdf/VA%20Form%2010-10EZR.pdf",
      },
      {
        form: "VA Form 10-5345a",
        name: "Request for and Authorization to Release Medical Records or Health Information",
        pdfUrl: "https://www.va.gov/vaforms/medical/pdf/VHA%20Form%2010-5345a%20Fill-revision.pdf",
      },
    ],
  },
  {
    id: "family-health",
    title: "Family health coverage & caregiver support (selected forms)",
    blurb: "Eligibility rules are on VA’s site—these are only the forms people often look for.",
    items: [
      {
        form: "VA Form 10-7959c",
        name: "CHAMPVA — Application for Family Member to Receive Medical Benefits",
        pdfUrl: "https://www.va.gov/vaforms/medical/pdf/VA%20Form%2010-7959c.pdf",
      },
      {
        form: "VA Form 10-10d",
        name: "Application for Comprehensive Assistance for Family Caregivers Program",
        pdfUrl: "https://www.va.gov/vaforms/medical/pdf/VA%20Form%2010-10d.pdf",
      },
    ],
  },
  {
    id: "deps",
    title: "Dependents, marriage, school-age children",
    blurb: "Use when your family situation changes and VA needs an updated record.",
    items: [
      {
        form: "VA Form 21-686c",
        name: "Application Request to Add and/or Remove Dependents",
        pdfUrl: "https://www.vba.va.gov/pubs/forms/vba-21-686c-are.pdf",
      },
      {
        form: "VA Form 21-674",
        name: "Request for Approval of School Attendance (child in school)",
        pdfUrl: "https://www.vba.va.gov/pubs/forms/vba-21-674-are.pdf",
      },
    ],
  },
  {
    id: "edu",
    title: "Education benefits (GI Bill and related)",
    items: [
      {
        form: "VA Form 22-1990",
        name: "Application for VA Education Benefits",
        pdfUrl: "https://www.vba.va.gov/pubs/forms/vba-22-1990-are.pdf",
      },
      {
        form: "VA Form 22-1995",
        name: "Request for Change of Program or Place of Training",
        pdfUrl: "https://www.vba.va.gov/pubs/forms/vba-22-1995-are.pdf",
      },
    ],
  },
  {
    id: "vre",
    title: "Veteran Readiness and Employment (VR&E) — Chapter 31",
    items: [
      {
        form: "VA Form 28-1900",
        name: "Disabled Veterans Application for Vocational Rehabilitation",
        pdfUrl: "https://www.vba.va.gov/pubs/forms/vba-28-1900-are.pdf",
      },
    ],
  },
  {
    id: "pension-survivors",
    title: "Pension & survivors (separate rules from disability compensation)",
    blurb: "These programs are not the same as disability compensation—read VA’s pages for eligibility.",
    items: [
      {
        form: "VA Form 21P-527EZ",
        name: "Application for Veterans Pension",
        pageUrl: "https://www.va.gov/forms/21p-527ez",
      },
      {
        form: "VA Form 21P-534EZ",
        name: "Application for DIC, Death Pension, and/or Accrued Benefits",
        pdfUrl: "https://www.vba.va.gov/pubs/forms/vba-21p-534ez-are.pdf",
      },
      {
        form: "VA Form 21P-530EZ",
        name: "Application for Burial Benefits",
        pdfUrl: "https://www.vba.va.gov/pubs/forms/vba-21p-530ez-are.pdf",
      },
    ],
  },
  {
    id: "housing",
    title: "VA home loan (Certificate of Eligibility)",
    items: [
      {
        form: "VA Form 26-1880",
        name: "Request for a Certificate of Eligibility",
        pdfUrl: "https://www.vba.va.gov/pubs/forms/vba-26-1880-are.pdf",
      },
    ],
  },
  {
    id: "aa",
    title: "Aid and attendance / housebound (pension context)",
    items: [
      {
        form: "VA Form 21-2680",
        name: "Examination for Housebound Status or Permanent Need for Regular Aid and Attendance",
        pdfUrl: "https://www.vba.va.gov/pubs/forms/vba-21-2680-are.pdf",
      },
    ],
  },
  {
    id: "milrec",
    title: "Military personnel records (not a VA form)",
    blurb: "Used when you need copies of service records from federal records centers.",
    items: [
      {
        form: "SF 180",
        name: "Request Pertaining to Military Records",
        pdfUrl: "https://www.gsa.gov/system/files/2024-10/SF180-24a.pdf",
      },
    ],
  },
];

/** Clarity4Vets practice worksheets for the Evidence page (same IDs as /api/va-form-guide). */
export const evidenceWorksheetActions: { guideId: VaFormGuideId; label: string }[] = [
  { guideId: "lay-statement-10210", label: "21-10210 — lay / witness worksheet" },
  { guideId: "records-release-4142", label: "21-4142 / 4142a — private records worksheet" },
  { guideId: "service-records-sf180", label: "SF 180 — service records worksheet" },
];

export const vaFormsHubCatchAll: { label: string; url: string; note?: string }[] = [
  {
    label: "Search all VA forms (official)",
    url: "https://www.va.gov/find-forms/",
    note: "If a number isn’t listed above, search here.",
  },
  { label: "VA.gov home", url: "https://www.va.gov/" },
  { label: "Contact VA", url: "https://www.va.gov/contact-us/" },
  {
    label: "Get help from an accredited representative (VA)",
    url: "https://www.va.gov/get-help-from-accredited-representative/",
  },
  { label: "Disability compensation hub", url: "https://www.va.gov/disability/" },
  { label: "VA health care hub", url: "https://www.va.gov/health-care/" },
  { label: "Education benefits hub", url: "https://www.va.gov/education/" },
  { label: "Survivors hub", url: "https://www.va.gov/survivors/" },
];
