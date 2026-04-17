/**
 * Official form quick-open map used by /api/va-form-guide.
 * Form numbers and titles align with public VA “Find a VA Form” listings; confirm current versions on VA.gov.
 */

export const VA_FORM_GUIDE_IDS = [
  "disability-claim-526ez",
  "supplemental-claim-0995",
  "higher-level-review-0996",
  "board-appeal-10182",
  "lay-statement-10210",
  "records-release-4142",
  "service-records-sf180",
] as const;

export type VaFormGuideId = (typeof VA_FORM_GUIDE_IDS)[number];

export type VaFormGuideDefinition = {
  id: VaFormGuideId;
  formNumber: string;
  shortTitle: string;
  /** Direct official PDF when available */
  officialPdfUrl?: string;
  officialFindFormUrl: string;
  /** Shown under the title — plain orientation, not legal advice */
  whatThisIs: string;
  /** Yellow-highlighted blocks: what the veteran completes on the real form */
  sections: { heading: string; youComplete: string[] }[];
};

export const vaFormGuides: Record<VaFormGuideId, VaFormGuideDefinition> = {
  "disability-claim-526ez": {
    id: "disability-claim-526ez",
    formNumber: "VA Form 21-526EZ",
    shortTitle: "Application for Disability Compensation and Related Compensation Benefits",
    officialPdfUrl: "https://www.vba.va.gov/pubs/forms/vba-21-526ez-are.pdf",
    officialFindFormUrl: "https://www.va.gov/find-forms/about-form-21-526ez/",
    whatThisIs:
      "Official filing is usually online at VA.gov or with the current PDF from VA. Yellow blocks below list typical parts veterans complete—your form version may differ slightly.",
    sections: [
      {
        heading: "Section I — Identification",
        youComplete: [
          "Your name (as it should appear on the claim)",
          "Social Security number, date of birth, and contact information",
          "Mailing address and preferred phone / email",
        ],
      },
      {
        heading: "Section II — Claim information",
        youComplete: [
          "Each disability or condition you are claiming",
          "Whether you are claiming for the first time, an increase, or secondary conditions (follow the form’s checkboxes)",
        ],
      },
      {
        heading: "Section III — Service information",
        youComplete: [
          "Branch(es) of service and dates",
          "Place of last separation and character of discharge (as required on the form)",
        ],
      },
      {
        heading: "Sections on pay, direct deposit, and certification",
        youComplete: [
          "Service pay / retirement items if the form asks for them",
          "Direct deposit (bank routing and account) if you choose that option",
          "Signature and date where the form requires your certification",
        ],
      },
    ],
  },
  "supplemental-claim-0995": {
    id: "supplemental-claim-0995",
    formNumber: "VA Form 20-0995",
    shortTitle: "Decision Review Request: Supplemental Claim",
    officialPdfUrl: "https://www.vba.va.gov/pubs/forms/vba-20-0995-are.pdf",
    officialFindFormUrl: "https://www.va.gov/find-forms/about-form-20-0995/",
    whatThisIs:
      "Used when you have new and relevant evidence after a decision. Use the current VA form and instructions.",
    sections: [
      {
        heading: "Identification",
        youComplete: ["Your name, VA file number if you have it, and contact information as the form requests"],
      },
      {
        heading: "Issue(s) and evidence",
        youComplete: [
          "Which decision or issues you want reviewed",
          "How you are submitting new and relevant evidence (the form lists options)",
        ],
      },
      {
        heading: "Signature",
        youComplete: ["Sign and date where indicated"],
      },
    ],
  },
  "higher-level-review-0996": {
    id: "higher-level-review-0996",
    formNumber: "VA Form 20-0996",
    shortTitle: "Decision Review Request: Higher-Level Review",
    officialPdfUrl: "https://www.vba.va.gov/pubs/forms/vba-20-0996-are.pdf",
    officialFindFormUrl: "https://www.va.gov/find-forms/about-form-20-0996/",
    whatThisIs:
      "A different reviewer looks at the same evidence already in the file (no new evidence on this lane—follow VA’s current rules).",
    sections: [
      {
        heading: "Identification",
        youComplete: ["Your name, VA file number if applicable, and contact fields on the form"],
      },
      {
        heading: "Issues and meeting (optional)",
        youComplete: [
          "Which issues you want reviewed",
          "Whether you want an informal conference, if the form offers that choice",
        ],
      },
      {
        heading: "Signature",
        youComplete: ["Sign and date as required"],
      },
    ],
  },
  "board-appeal-10182": {
    id: "board-appeal-10182",
    formNumber: "VA Form 21-10182",
    shortTitle: "Decision Review Request: Board Appeal (Notice of Disagreement)",
    officialPdfUrl: "https://www.va.gov/vaforms/va/pdf/VA10182.pdf",
    officialFindFormUrl: "https://www.va.gov/forms/10182/",
    whatThisIs:
      "Board lane with options (e.g., evidence submission, hearing) per VA’s published form and instructions.",
    sections: [
      {
        heading: "Identification",
        youComplete: ["Your name, VA file number, and contact information"],
      },
      {
        heading: "Issues and Board options",
        youComplete: [
          "Issues you disagree with",
          "Which Board review option you are selecting (follow the form’s choices)",
        ],
      },
      {
        heading: "Signature",
        youComplete: ["Sign and date where required"],
      },
    ],
  },
  "lay-statement-10210": {
    id: "lay-statement-10210",
    formNumber: "VA Form 21-10210",
    shortTitle: "Lay/Witness Statement",
    officialPdfUrl: "https://www.vba.va.gov/pubs/forms/vba-21-10210-are.pdf",
    officialFindFormUrl: "https://www.va.gov/find-forms/about-form-21-10210/",
    whatThisIs:
      "A structured way to submit lay evidence VA may consider—follow VA’s rules for who can sign and what belongs in a statement.",
    sections: [
      {
        heading: "Who is signing",
        youComplete: [
          "Name and relationship to the veteran (if not the veteran)",
          "Identification fields the form asks for",
        ],
      },
      {
        heading: "Statement",
        youComplete: [
          "Facts you have personal knowledge of, in the space or attachment the form allows",
          "Sign and date in the certification area",
        ],
      },
    ],
  },
  "records-release-4142": {
    id: "records-release-4142",
    formNumber: "VA Forms 21-4142 & 21-4142a",
    shortTitle: "Authorization for VA to obtain private (non-VA) treatment records",
    officialPdfUrl: "https://www.vba.va.gov/pubs/forms/vba-21-4142-are.pdf",
    officialFindFormUrl: "https://www.va.gov/find-forms/about-form-21-4142/",
    whatThisIs:
      "21-4142 authorizes release to VA; 21-4142a is often used with providers. Use current VA versions.",
    sections: [
      {
        heading: "Veteran identification",
        youComplete: ["Your name, SSN or VA file number, and DOB as the form requests"],
      },
      {
        heading: "Provider / records to release",
        youComplete: [
          "Facility or provider name and address",
          "What records or dates you authorize (per the form’s fields)",
        ],
      },
      {
        heading: "Signature",
        youComplete: ["Your signature and date; provider sections if applicable"],
      },
    ],
  },
  "service-records-sf180": {
    id: "service-records-sf180",
    formNumber: "SF 180",
    shortTitle: "Request Pertaining to Military Records",
    officialPdfUrl: "https://www.gsa.gov/system/files/2024-10/SF180-24a.pdf",
    officialFindFormUrl: "https://www.gsa.gov/system/files/2024-10/SF180-24a.pdf",
    whatThisIs:
      "Standard form used with the National Archives / NPRC for certain military personnel records—not a VA form, but often discussed with claims.",
    sections: [
      {
        heading: "Who is requesting",
        youComplete: ["Your name and relationship to the service member (if requesting for someone else)"],
      },
      {
        heading: "Service and record type",
        youComplete: [
          "Branch, approximate dates of service, and which documents you need (check boxes the form provides)",
        ],
      },
      {
        heading: "Purpose and signature",
        youComplete: ["Purpose of request where asked", "Signature and fee information if applicable"],
      },
    ],
  },
};

export function isVaFormGuideId(id: string): id is VaFormGuideId {
  return (VA_FORM_GUIDE_IDS as readonly string[]).includes(id);
}

export function getVaFormGuide(id: VaFormGuideId): VaFormGuideDefinition {
  return vaFormGuides[id];
}
