import type { VaFormGuideId } from "@/data/va-form-guides";
import {
  CFR_3_310_SECONDARY,
  CFR_4_104_CARDIOVASCULAR,
  CFR_4_119_ENDOCRINE,
  CFR_4_124A_NEUROLOGICAL,
  CFR_4_130_MENTAL,
  CFR_4_71A_MSK,
  CFR_4_85_HEARING,
  CFR_4_87_EAR,
  CFR_4_97_RESPIRATORY,
  CFR_PART_4_ROOT,
} from "@/data/cfr-links";
import { SITE_NAME } from "@/lib/site";

export type AwarenessLink = { label: string; url: string };

export type AwarenessSection = {
  heading: string;
  body: string[];
  /** Optional: direct official pages for this topic (skip the VA.gov home-page treasure hunt). */
  links?: AwarenessLink[];
  /**
   * personal-note = Clarity4Vets intro card, no URL list.
   * topic-card = one bordered unit: heading + body + links together (default when `links` is set).
   */
  sectionLayout?: "personal-note" | "topic-card";
  /** Small line above the heading (personal-note sections only). */
  eyebrow?: string;
  /** Quick-open official form actions for this section. */
  formGuideActions?: { guideId: VaFormGuideId; label: string }[];
  /**
   * Optional rally line directly under the section heading (before body). Uses **bold** and [label](https://...) like other awareness text.
   */
  highlightAfterHeading?: string;
  /** For deep links from other pages, e.g. `/learn/ratings-connection#cfr-map`. */
  anchorId?: string;
  /** Overrides the default “VA links · this topic only” label above `links`. */
  linksSectionEyebrow?: string;
};

export type AwarenessModule = {
  slug: string;
  title: string;
  summary: string;
  sections: AwarenessSection[];
  officialLinks: AwarenessLink[];
};

export const awarenessModules: AwarenessModule[] = [
  {
    slug: "time-sensitive",
    title: "Time-sensitive awareness (clocks exist)",
    summary:
      "Overview of published VA time limits—one-year review options, intent to file, and shorter Board deadlines in some cases—so you know what to check against your own letters and VA.gov. Not legal advice; your decision notice and official sources define your situation.",
    sections: [
      {
        heading: "From one vet to another",
        sectionLayout: "personal-note",
        eyebrow: "Heads-up—Army, Marines, Navy, Air Force, Coast Guard, Space Force",
        body: [
          "Different branches, **same habits**: you learned to track **warning orders**, **all-hands**, **taskings**, **fragmentary orders**, **briefs**, and **word passed on the deck**—deadlines, required actions, and how to move on time. VA paperwork uses different words, but it still runs on **dates, lanes, and windows**. That skill transfers.",
          "If this is your **first** time working with VA, it can feel like a long brief with too many attachments. If you have **been at it a while**, you know portal rabbit holes, hold times, and the “I’ll finish this tomorrow” stack. Many veterans hit the same friction. Showing up here to read is already a useful step.",
          "Below, each **topic** is **its own section**: short context, then **links to VA for that topic** so you can open the right official page first. Use what matches your situation.",
        ],
      },
      {
        heading: "Real deadlines VA publishes (spans, filings, and what you can lose if you miss them)",
        sectionLayout: "topic-card",
        highlightAfterHeading:
          "**Attention to detail:** read **every page** VA sends you, including the dense ones. **Deadlines are real.** Missing a published window can change which review options you have or when benefits can start. When you are tired, it still helps to **note the dates** and **confirm them on VA.gov** or with an accredited representative.",
        body: [
          "**This is education, not legal advice.** Your deadlines depend on **which benefit**, **which letter**, and **which review lane** you are in. Read your **decision notice**, then use [Decision reviews and appeals (overview)](https://www.va.gov/decision-reviews/). A **VSO** or **accredited attorney** can help if you want hands-on help with filings.",
          "**The one-year window (lots of AMA decisions)** — VA stamps a **date on the notice**. For many claims, you get **one year** from that date to pick **Higher-Level Review**, **Supplemental Claim**, or **Board Appeal** for *that* decision. If the year slips by without the right filing, you may **lose that review path** for that decision—same rules, rougher outcome. You might still have another option (e.g. **Supplemental Claim** with **new and relevant evidence**), but **effective dates** can land somewhere you did not want—[Choosing a decision review option](https://www.va.gov/resources/choosing-a-decision-review-option/) is VA spelling it out in their own words.",
          "**Intent to file** — Think of it as saving your place in line. VA usually expects the **full claim** within **about a year** if you want the **earliest effective date** they describe for your situation. Miss that, and **when** money can start may slide—[Your intent to file a VA claim](https://www.va.gov/resources/your-intent-to-file-a-va-claim/).",
          "**Sometimes it isn’t a year** — Certain **Board** situations (including some **contested** claims) use a **shorter** window. Do not assume “one year for everything”—check [Board Appeal](https://www.va.gov/decision-reviews/board-appeal/) against **your notice**.",
          "**Supplemental Claims** — **New and relevant evidence** can reopen the conversation; **when** you file still nudges **effective dates** and how the claim rolls. [Supplemental Claim](https://www.va.gov/decision-reviews/supplemental-claim/) · [Effective dates overview](https://www.va.gov/disability/effective-date/).",
          "**The system follows rules, not intent** — Miss a deadline and VA’s process may **close a review path**, **change an effective date**, or **end a filing window**. That can feel personal; most often it is **the published clock**, not a judgment about you. That is why these time frames matter.",
        ],
        links: [
          {
            label: "Choosing a decision review option (VA — deadlines and lanes)",
            url: "https://www.va.gov/resources/choosing-a-decision-review-option/",
          },
          {
            label: "Your intent to file a VA claim (VA — one-year completion window explained)",
            url: "https://www.va.gov/resources/your-intent-to-file-a-va-claim/",
          },
          { label: "Decision reviews and appeals (overview)", url: "https://www.va.gov/decision-reviews/" },
          { label: "Board Appeal (includes exceptions such as shorter deadlines)", url: "https://www.va.gov/decision-reviews/board-appeal/" },
          { label: "Supplemental Claim", url: "https://www.va.gov/decision-reviews/supplemental-claim/" },
          { label: "Effective dates overview (disability)", url: "https://www.va.gov/disability/effective-date/" },
        ],
      },
      {
        heading: "Disability compensation — filing, effective dates, and related timing",
        sectionLayout: "topic-card",
        body: [
          "**This section** — Disability compensation, filing, evidence, intent to file, after-you-file steps, and effective dates. Use the VA links at the bottom for full pages.",
          "**Why dates matter** — VA sets **effective dates** and review **windows** from rules, not feelings. Miss a published deadline and you can lose a review option or get a later start date than you hoped.",
          "[VA Form 21-526EZ](https://www.vba.va.gov/pubs/forms/vba-21-526ez-are.pdf) — **File** a disability compensation claim (PDF; you can also file online at VA.gov).",
          "[VA Form 20-0995](https://www.vba.va.gov/pubs/forms/vba-20-0995-are.pdf) — **Supplemental Claim** after a decision (new and relevant evidence).",
          "[VA Form 20-0996](https://www.vba.va.gov/pubs/forms/vba-20-0996-are.pdf) — **Higher-Level Review** after a decision (same evidence, new look).",
          "[VA Form 21-10182](https://www.va.gov/vaforms/va/pdf/VA10182.pdf) — **Board Appeal** after a decision.",
          "Which review fits your situation — [Decision reviews and appeals](https://www.va.gov/decision-reviews/).",
        ],
        formGuideActions: [
          {
            guideId: "disability-claim-526ez",
            label: "Official form: File a disability claim (21-526EZ)",
          },
          {
            guideId: "supplemental-claim-0995",
            label: "Official form: Supplemental Claim (20-0995)",
          },
          {
            guideId: "higher-level-review-0996",
            label: "Official form: Higher-Level Review (20-0996)",
          },
          {
            guideId: "board-appeal-10182",
            label: "Official form: Board appeal (21-10182)",
          },
        ],
        links: [
          { label: "How to file a VA disability claim (hub)", url: "https://www.va.gov/disability/how-to-file-claim/" },
          { label: "Disability eligibility overview", url: "https://www.va.gov/disability/eligibility/" },
          { label: "Effective dates overview", url: "https://www.va.gov/disability/effective-date/" },
          { label: "Evidence to support your VA disability claim", url: "https://www.va.gov/disability/how-to-file-claim/evidence-needed/" },
          {
            label: "Intent to file — what it is and why it can matter",
            url: "https://www.va.gov/resources/your-intent-to-file-a-va-claim/",
          },
          {
            label: "After you file your claim (what to expect)",
            url: "https://www.va.gov/disability/after-you-file-claim/",
          },
        ],
      },
      {
        heading: "Decision reviews & appeals — review options and time limits",
        sectionLayout: "topic-card",
        body: [
          "**Decision reviews and appeals only**—if you have (or will have) a decision letter, these are the three lanes VA talks about: Higher-Level Review, Supplemental Claim, Board Appeal. The **Real deadlines** box above has the **one-year** story (and the exceptions); pick the lane that fits what you’re carrying.",
        ],
        links: [
          { label: "Decision reviews and appeals (overview)", url: "https://www.va.gov/decision-reviews/" },
          { label: "Higher-Level Review", url: "https://www.va.gov/decision-reviews/higher-level-review/" },
          { label: "Supplemental Claim", url: "https://www.va.gov/decision-reviews/supplemental-claim/" },
          { label: "Board Appeal (Notice of Disagreement / BVA)", url: "https://www.va.gov/decision-reviews/board-appeal/" },
          { label: "After VA makes a decision on your claim", url: "https://www.va.gov/decision-reviews/after-you-request-review/" },
        ],
      },
      {
        heading: "Education benefits — GI Bill, programs, and time-related rules",
        sectionLayout: "topic-card",
        body: [
          "**Education-only**—GI Bill chapters, how to apply, comparison tool, and checking what you have left. Different programs, different clocks; these links stay in the education lane.",
        ],
        links: [
          { label: "VA education and training (hub)", url: "https://www.va.gov/education/" },
          { label: "About GI Bill benefits (overview)", url: "https://www.va.gov/education/about-gi-bill-benefits/" },
          { label: "Post-9/11 GI Bill (Chapter 33)", url: "https://www.va.gov/education/about-gi-bill-benefits/post-9-11/" },
          {
            label: "Montgomery GI Bill — Active Duty (MGIB-AD, Chapter 30)",
            url: "https://www.va.gov/education/about-gi-bill-benefits/montgomery-active-duty/",
          },
          {
            label: "Montgomery GI Bill — Selected Reserve (MGIB-SR, Chapter 1606)",
            url: "https://www.va.gov/education/about-gi-bill-benefits/montgomery-selected-reserve/",
          },
          { label: "GI Bill® comparison tool (schools and programs)", url: "https://www.va.gov/education/gi-bill-comparison-tool/" },
          { label: "Apply for education benefits (how to apply)", url: "https://www.va.gov/education/how-to-apply/" },
          { label: "Check your VA education benefits status (sign-in may be required)", url: "https://www.va.gov/education/check-post-9-11-gi-bill-benefits/" },
        ],
      },
      {
        heading: "Veteran Readiness and Employment (VR&E) — Chapter 31",
        sectionLayout: "topic-card",
        body: [
          "**VR&E only (Chapter 31)**—employment-focused support with its own apply path and eligibility. If this isn’t what you’re after, skip to another box.",
        ],
        links: [
          { label: "VR&E (Chapter 31) hub", url: "https://www.va.gov/careers-employment/vocational-rehabilitation/" },
          { label: "How to apply for VR&E", url: "https://www.va.gov/careers-employment/vocational-rehabilitation/how-to-apply/" },
          { label: "Eligibility for VR&E", url: "https://www.va.gov/careers-employment/vocational-rehabilitation/eligibility/" },
        ],
      },
      {
        heading: "PACT Act, presumptives, and exposure-related rules",
        sectionLayout: "topic-card",
        body: [
          "**Toxic exposure / PACT / presumptives**—rules and lists change when Congress and VA update them. These links go to VA’s current PACT and exposure hubs—not disability filing in general.",
        ],
        links: [
          { label: "The PACT Act and your VA benefits (VA resource)", url: "https://www.va.gov/resources/the-pact-act-and-your-va-benefits/" },
          {
            label: "Toxic exposure benefits (hub)",
            url: "https://www.va.gov/disability/eligibility/hazardous-materials-exposure/",
          },
          {
            label: "Illnesses within one year after discharge (VA)",
            url: "https://www.va.gov/disability/eligibility/illnesses-within-one-year-of-discharge/",
          },
        ],
      },
      {
        heading: "Survivors, dependents, and family benefits",
        sectionLayout: "topic-card",
        body: [
          "**Survivors and dependents**—different programs and clocks than the veteran’s own disability claim. This box is for family-path benefits only.",
        ],
        links: [
          { label: "Survivors and dependents (hub)", url: "https://www.va.gov/survivors/" },
          { label: "DIC (Dependency and Indemnity Compensation) — overview", url: "https://www.va.gov/disability/dependency-indemnity-compensation/" },
          { label: "Survivors Pension", url: "https://www.va.gov/pension/survivors-pension/" },
          { label: "CHAMPVA (family health coverage)", url: "https://www.va.gov/COMMUNITYCARE/programs/dependents/champva/" },
        ],
      },
      {
        heading: "What this site still does not do",
        sectionLayout: "topic-card",
        body: [
          "We **do not** choose your deadlines, file anything for you, or provide legal representation. We only collect **public** VA links so you can read the same rules VA publishes.",
          "Need hands-on help with a claim? That’s what accredited reps and VSOs are for—link below.",
        ],
        links: [
          { label: "Get help from an accredited representative (VA)", url: "https://www.va.gov/get-help-from-accredited-representative/" },
        ],
      },
    ],
    officialLinks: [
      { label: "VA.gov home (only if you need the top-level search)", url: "https://www.va.gov/" },
      { label: "Contact VA (phones and contacts)", url: "https://www.va.gov/contact-us/" },
    ],
  },
  {
    slug: "evidence",
    title: "Evidence awareness (categories, not strategy)",
    summary:
      `The first block on this page has quick-open official forms and every official form link in one place. Not legal advice—not a strategy for any specific claim.`,
    sections: [
      {
        heading: "What we do not provide",
        body: [
          "No templates, no suggested wording for nexus or theory of claim, and no “how to win” framing. If you need help developing a claim, use official VA resources or accredited assistance.",
        ],
      },
    ],
    officialLinks: [
      { label: "How VA talks about evidence for disability claims (official overview)", url: "https://www.va.gov/disability/how-to-file-claim/evidence-needed/" },
      { label: "Search all VA forms (if a number is not in the list above)", url: "https://www.va.gov/find-forms/" },
      { label: "VA.gov disability hub", url: "https://www.va.gov/disability/" },
    ],
  },
  {
    slug: "ratings-connection",
    title: "Ratings & secondary connection (38 CFR and what to ask)",
    summary:
      "Why ratings and ‘secondary’ claims trip people up—combined ratings aren’t simple addition, **38 CFR** is public law, and if nobody tells you what *can* be linked on paper, you might not know what to ask a clinician or VSO. Not medical advice, not legal advice.",
    sections: [
      {
        heading: "CFR map — secondaries & questions for your clinician",
        sectionLayout: "topic-card",
        anchorId: "cfr-map",
        linksSectionEyebrow: "eCFR jump links — official text (new tab)",
        body: [
          "The electronic CFR is **long**. If you feel like you scroll forever, you are not alone. This list is a **small set of doorways** into **Title 38, Chapter I**—the parts people usually open first when the topic is **secondary** service connection or **what to ask** a **treating clinician** (or accredited rep) about how conditions might relate **under VA’s rules**.",
          "**We are not** your doctor and **not** saying what you have. Use these links to read **VA’s own words**, then turn them into **questions** for someone who can examine you and read your records.",
          "**Tip:** after each page opens, use your browser’s **Find** tool (often Ctrl+F or Command+F) to search for a **keyword** (for example a body part or diagnosis name). That beats scrolling the whole Part 4 by hand.",
          "**Words for your provider (a request, not an order):** Some veterans say something like: “According to **38 CFR**, could we review **this section** in light of my symptoms and records?” Pick the **§** or **Part** from the links below that matches your question. Your clinician still decides what to do; VA still needs **evidence** in your file—this only helps you **speak the same language** as the public rules.",
        ],
        links: [
          {
            label: "§ 3.310 — Disability caused or aggravated by service-connected disability (secondary)",
            url: "https://www.ecfr.gov/current/title-38/chapter-I/part-3#3.310",
          },
          {
            label: "§ 3.303 — Principles relating to service connection",
            url: "https://www.ecfr.gov/current/title-38/chapter-I/part-3#3.303",
          },
          {
            label: "§ 3.304 — Mental disorders (often discussed with other conditions)",
            url: "https://www.ecfr.gov/current/title-38/chapter-I/part-3#3.304",
          },
          {
            label: "§ 3.306 — Aggravation of preservice disability",
            url: "https://www.ecfr.gov/current/title-38/chapter-I/part-3#3.306",
          },
          {
            label: "Part 4 — Schedule for Rating Disabilities (full part; use Find for keywords)",
            url: "https://www.ecfr.gov/current/title-38/chapter-I/part-4",
          },
          {
            label: "Part 4 — Subpart A (general rating principles; narrower than the whole part)",
            url: "https://www.ecfr.gov/current/title-38/chapter-I/part-4/subpart-A",
          },
        ],
      },
      {
        heading: "Find your condition in Part 4 — same method as tinnitus",
        sectionLayout: "topic-card",
        anchorId: "cfr-find-your-condition",
        linksSectionEyebrow: "Part 4 body-system schedules (eCFR — new tab)",
        body: [
          "**Tinnitus** was easy to show because **DC 6260** sits in a clear **§ 4.87** block. Most other ratings work the **same way**: pick the **body-system** § first, then use **Find** on that page.",
          "**Steps:** (1) Open the **doorway** below that fits (bones vs lungs vs heart, etc.). (2) Press **Find** (Ctrl+F or Command+F). (3) Search a **keyword**—diagnosis, body part, or a **diagnostic code** from a VA letter if you have one.",
          "**Secondary** (“caused or aggravated by”) still runs through **§ 3.310** and **medical evidence**. CFR does **not** print a master list of every possible pairing—that is what your **records** and **clinician** address.",
          "**We are not** choosing your diagnosis—only pointing at **where VA publishes the rating language** so you can ask better questions.",
        ],
        links: [
          {
            label: "§ 4.71a — musculoskeletal system (joints, spine, many orthopedic issues)",
            url: CFR_4_71A_MSK,
          },
          {
            label: "§ 4.97 — respiratory system (lungs, sleep-related breathing, etc.)",
            url: CFR_4_97_RESPIRATORY,
          },
          {
            label: "§ 4.104 — cardiovascular system",
            url: CFR_4_104_CARDIOVASCULAR,
          },
          {
            label: "§ 4.119 — endocrine system (e.g. diabetes mellitus)",
            url: CFR_4_119_ENDOCRINE,
          },
          {
            label: "§ 4.124a — neurological conditions, convulsive disorders, headaches",
            url: CFR_4_124A_NEUROLOGICAL,
          },
          {
            label: "§ 4.130 — mental disorders",
            url: CFR_4_130_MENTAL,
          },
          {
            label: "§ 4.85 — evaluation of hearing impairment",
            url: CFR_4_85_HEARING,
          },
          {
            label: "§ 4.87 — schedule of ratings—ear (incl. DC 6260 tinnitus)",
            url: CFR_4_87_EAR,
          },
          {
            label: "§ 3.310 — secondary service connection",
            url: CFR_3_310_SECONDARY,
          },
          { label: "Part 4 — full schedule (fallback)", url: CFR_PART_4_ROOT },
        ],
      },
      {
        heading: "Example: tinnitus — Part 4 (rating) vs Part 3 (secondary)",
        sectionLayout: "topic-card",
        anchorId: "cfr-tinnitus-example",
        linksSectionEyebrow: "Tinnitus & hearing — exact §§ · secondary rule (new tab)",
        body: [
          "**Spelling:** **Tinnitus** (one **n**—not “tinitus”).",
          "**Where VA rates tinnitus:** Recurrent tinnitus is under **Diagnostic Code 6260** in **§ 4.87** (Schedule of ratings—ear). Open **§ 4.87**, use your browser’s **Find** tool, search **6260** or **Tinnitus**—that jumps to the paragraph for **DC 6260** without reading the whole Part 4.",
          "**Hearing impairment** is usually under **§ 4.85** (and **§ 4.86** when the pattern is unusual)—same **auditory** area of the schedule. People often read **4.85** and **4.87** together when **ear** issues are in play. Still not a verdict on **your** file.",
          "**Secondary (“caused by” / “aggravated by”):** There is **no** single CFR appendix that lists every condition that might be **secondary to** tinnitus—or **tinnitus secondary to** something else. VA uses **medical evidence** and **§ 3.310** (disability caused or aggravated by a service-connected disability). That **§** is the doorway for **both directions** of the question in the rules—not a catalog of approved pairings.",
          "**We are not** saying what is linked **in your body**. Use these links for **questions** to your **clinician** or accredited rep, not a self-diagnosis.",
        ],
        links: [
          {
            label: "§ 4.87 — Schedule of ratings—ear (DC 6260 tinnitus — Find: 6260)",
            url: CFR_4_87_EAR,
          },
          {
            label: "§ 4.85 — Evaluation of hearing impairment",
            url: CFR_4_85_HEARING,
          },
          {
            label: "§ 3.310 — Secondary: caused or aggravated by a service-connected disability",
            url: CFR_3_310_SECONDARY,
          },
        ],
      },
      {
        heading: "From one vet to another",
        sectionLayout: "personal-note",
        eyebrow: "Ratings · connection · the regs",
        body: [
          "Disability isn’t always **one condition in a vacuum**. **Combined** ratings, **secondary** service connection, and **how the regulations describe related conditions** matter because the system follows **published rules**. **38 CFR** (Title 38 in the **Code of Federal Regulations**) holds much of that language, including the **Schedule for Rating Disabilities**. It is **public**; you can read the same framework VA cites. That does not make you a lawyer—it helps you see **which questions to ask**.",
          "**We are not diagnosing you.** We are **not** saying one condition causes another **in your case**—only **medical evidence** and **VA adjudication** can do that. If you have never heard **secondary** as a **claim type**, or never seen **combined** rating math, you might not think to **ask** a **treating clinician** or **accredited rep** whether **your** situation fits what the **regulations** describe. Having the vocabulary can make those conversations more productive.",
        ],
      },
      {
        heading: "Combined ratings — more than adding percentages",
        sectionLayout: "topic-card",
        body: [
          "VA uses a **combined** disability rating when you have more than one service-connected condition. **It isn’t** “30% + 20% = 50%” in the plain-arithmetic sense—VA publishes **how** they combine percentages (often called **whole person** logic). If you expected stacking math, your **pay** and expectations can feel wrong until you read the rules.",
        ],
        links: [
          {
            label: "About disability ratings — VA’s combined rating calculator & table (official)",
            url: "https://www.va.gov/disability/about-disability-ratings/",
          },
          { label: "VA disability compensation rates", url: "https://www.va.gov/disability/compensation-rates/" },
        ],
      },
      {
        heading: "Secondary service connection — what the regulations address",
        sectionLayout: "topic-card",
        body: [
          "A **secondary** claim is, in plain terms, about a condition that may be related to a **condition VA already accepted** as service-connected—**if** the **evidence** and **law** support it. The details live in **statute** and **38 CFR** (for example provisions VA cites around **secondary** and **aggravation**). **We don’t decide** whether **your** claim qualifies—**we’re pointing at the map** so you know the **category** exists.",
        ],
        links: [
          {
            label: "38 CFR § 3.310 — disabilities caused or aggravated by service-connected disability (eCFR)",
            url: "https://www.ecfr.gov/current/title-38/chapter-I/part-3#3.310",
          },
          { label: "How to file a VA disability claim (types of claims mentioned)", url: "https://www.va.gov/disability/how-to-file-claim/" },
          { label: "Eligibility for VA disability benefits (overview)", url: "https://www.va.gov/disability/eligibility/" },
        ],
      },
      {
        heading: "Why we mention an example (still not your diagnosis)",
        sectionLayout: "topic-card",
        body: [
          "**Example people research in CFR and forums** — You may run across discussions of whether **sleep apnea** could be claimed in relation to another condition such as **anxiety** (or other mental-health ratings), or different pairings, depending on **facts** and **evidence**. **This page does not say** that any pairing is true **for you**. **We are not** establishing medical causation here.",
          "**Why bring it up at all?** — Because if you’ve **never heard** the word **secondary**, or never knew **38 CFR** addresses **how** conditions can relate under **VA’s rules**, you might not **ask** a **qualified clinician** or **accredited representative** what **your** records could support. VA won’t **infer** your theory of the case for you—you bring **evidence** and **arguments** within the rules, or someone accredited helps you.",
        ],
        links: [
          {
            label: "38 CFR Part 4 — Schedule for Rating Disabilities (eCFR)",
            url: "https://www.ecfr.gov/current/title-38/chapter-I/part-4",
          },
          { label: "Evidence to support your VA disability claim", url: "https://www.va.gov/disability/how-to-file-claim/evidence-needed/" },
          { label: "Get help from an accredited representative (VA)", url: "https://www.va.gov/get-help-from-accredited-representative/" },
        ],
      },
    ],
    officialLinks: [
      { label: "VA.gov disability hub", url: "https://www.va.gov/disability/" },
      { label: "About disability ratings", url: "https://www.va.gov/disability/about-disability-ratings/" },
      { label: "How to file a VA disability claim", url: "https://www.va.gov/disability/how-to-file-claim/" },
    ],
  },
  {
    slug: "community-care",
    title: "Community Care (system literacy)",
    summary:
      "Why Community Care exists in plain terms: when VA may send you to a non-VA provider, how that still ties back to VA, and why your records from both worlds matter—not eligibility or referral advice.",
    sections: [
      {
        heading: "Why Community Care exists—and what it is to you",
        sectionLayout: "topic-card",
        highlightAfterHeading:
          "**You are not “going rogue.”** When Community Care applies, it is because **public law and VA’s own rules** created a path so veterans are not stuck when **distance, wait, or what your facility offers** does not match what you need.",
        body: [
          "Most of us picture VA health care as **walking into a VA hospital or clinic**. That is still the core. Community Care is the **other lane**: care from a **civilian doctor, lab, or hospital** when VA **authorizes** it under standards VA publishes—not because you decided on your own to skip the VA.",
          "That matters emotionally, too. A lot of veterans feel like they failed the system if they end up “outside.” **You didn’t.** The point of the program is **access**: sometimes the **nearest** help is across town, not on a VA campus; sometimes **wait** or **specialty** means VA’s answer is to **buy care in the network** instead of telling you to wait indefinitely.",
          "When you are in that lane, **paperwork and payment still usually run through VA’s authorization process** in ways VA describes on its site. You may see **two sets of documents**—VA and the community provider. That is normal; it is why **system literacy** helps: you know **who ordered the care**, **who is supposed to pay**, and **where results are supposed to land** in your record.",
          "**Your story does not split in half** because the exam room wasn’t in a VA building. Notes, imaging, and treatment from authorized community care **can still matter** for **continuity** (what actually happened to your body) and for **benefits conversations** later, because VA’s disability side still cares about **complete evidence**. VA’s public page on **[Evidence to support your VA disability claim](https://www.va.gov/disability/how-to-file-claim/evidence-needed/)** is the official wording on how they talk about records—not a how-to for your specific file here.",
        ],
        links: [
          { label: "VA Community Care overview (eligibility, how it works)", url: "https://www.va.gov/communitycare/" },
          { label: "Evidence to support your VA disability claim", url: "https://www.va.gov/disability/how-to-file-claim/evidence-needed/" },
        ],
      },
      {
        heading: "What this page is not doing for you",
        body: [
          "**We are not your care team.** We cannot see your chart, your wait times, or whether **you** meet the tests VA uses for Community Care. We cannot pick a provider, speed a referral, or tell you what VA “should” do in your case.",
          "**That is on purpose.** Eligibility and next steps belong to **your VA providers** and to **VA’s published rules**—so you are not guessing from a third-party site. Use **[VA Community Care overview](https://www.va.gov/communitycare/)** when you need the official picture; bring questions to **the people who know your enrollment and your treatment plan**.",
        ],
      },
    ],
    officialLinks: [
      { label: "VA Community Care overview", url: "https://www.va.gov/communitycare/" },
      { label: "VA health care hub", url: "https://www.va.gov/health-care/" },
    ],
  },
  {
    slug: "life-events",
    title: "Life events (benefit visibility)",
    summary:
      "Real-life changes—family, address, work, school, caregiving, loss—that can change what VA owes you, who is on your award, or which office needs to hear from you. Plain language why each matters; not legal or financial advice.",
    sections: [
      {
        heading: "When your life shifts, your VA record may need to shift with it",
        body: [
          "**Marriage, divorce, or who counts as your dependent** — VA pays some benefits at different rates when you have a spouse or qualifying dependents, and **who is on your file** is not automatic forever. A new marriage, a split, or a change in who lives with you and relies on you can change **monthly compensation**, **who is eligible for certain programs**, and **what you are supposed to report**. If the person VA thinks is your dependent is not accurate anymore, **money and letters can be wrong** until the file is updated.",
          "**A new child, an adoption, or a kid who ages out** — Adding a child can matter for **dependent pay** on disability compensation and for **education and health-coverage stories** tied to your service or rating (VA publishes the rules; we do not decide your case). When a child **ages past the rules** for “dependent,” VA may need to **drop them from the count**—if nobody tells them, you can end up with **overpayments or messy corrections** later. Birth certificates and court orders are the boring paperwork that backs up what you already know is true.",
          "**Job changes, going back to school, or moving** — New work can touch **vocational rehab**, **income-sensitive programs** (like some pension lanes VA describes publicly), or simply **what you tell an employer** about veteran status. School enrollment can tie to **GI Bill and other education benefits**—credits, breaks, and graduation dates are not just academic; they are **benefit timelines**. A move changes **which VA facility is yours**, **mailing address**, and sometimes **state or local veteran programs**; the system does not read your mind when you pack the truck.",
          "**When you need more help day to day—or you become the one doing the caring** — If **you** struggle with bathing, dressing, staying safe at home, or keeping up with basic needs, VA has **public programs and terms** (things like **aid and attendance** in their materials) that describe **extra support**—we are **not** diagnosing you here, only flagging that **a change in how you function** is often when veterans finally ask what is available. If **your spouse or parent** is the veteran and **you** are burning out providing care, **caregiver support** is a different door on VA.gov; your exhaustion is a signal to look, not something to shrug off.",
          "**Death—yours or someone you love** — If you are the veteran, **what you leave behind** for a spouse or kids is not just grief; it is **which survivor programs exist**, **who notifies VA**, and **what documents** survivors will need. If **you** are the family member left standing, **DIC, survivors pension, education, burial, CHAMPVA**—those are **different applications and clocks** than the veteran’s disability claim; VA’s survivor hub is where the **official map** lives. None of this should be learned from a rumor at the funeral lunch.",
        ],
      },
      {
        heading: "Why the details matter",
        body: [
          "**Every program has its own reporting rules and dates.** Telling VA late—or not at all—can mean **lost pay**, **clawbacks**, or **missing a window** you did not know existed. We are not your pay clerk; we are the guy tapping you on the shoulder: **when life changes, check the official site or ask VA** so your paperwork matches your reality.",
        ],
      },
    ],
    officialLinks: [
      { label: "VA change your address / personal info", url: "https://www.va.gov/change-address/" },
      { label: "VA survivors hub", url: "https://www.va.gov/survivors/" },
    ],
  },
  {
    slug: "caregivers-survivors",
    title: "Caregivers & survivors (visibility)",
    summary:
      "For the veteran who hates needing help—and for the spouse, partner, or family member who is already doing the work: what caregiver programs, survivor benefits, and CHAMPVA are actually *for*, in human terms. Not eligibility decisions; official VA pages and people are where applications live.",
    sections: [
      {
        heading: "If you are the one holding everything together",
        highlightAfterHeading:
          "**This is for the person who knows the med list by heart**—who drives to appointments, argues with the pharmacy, and still goes to work—or who gave up work because someone had to stay home.",
        body: [
          "Caregiver support on VA.gov exists because **some injuries and illnesses do not stay inside one body**. They spill into **your** sleep, **your** income, **your** marriage, and **your** kids’ routines. Congress and VA built **named programs** (you will see **PCAFC** and others on their site) because lawmakers heard from families who were **burned out, broke, or invisible** next to the veteran’s chart.",
          "If you are the **veteran** reading this: needing help is not weakness. **Your person** may already be carrying more than you see—managing meds, moods, and the fear of what happens if they step away for one day. **Acknowledging that labor** is how some families finally unlock **training, stipends, or respite** VA describes in its caregiver materials. Pride is expensive when it costs your partner their health.",
          "If you are the **spouse or family caregiver**: you are not a “dependent” in the sentimental sense only—you may be **keeping someone alive in the practical sense**. VA’s caregiver lanes are **applications, assessments, and rules**, not a thank-you card. **Eligibility is narrow on purpose** in some programs; that does not mean **your exhaustion** is fake. It means **you still deserve a map**, even when the first door says no.",
        ],
      },
      {
        heading: "When the veteran dies—the benefits are not one big check with one form",
        body: [
          "**Survivor benefits sound like one topic; they are really a bundle of different lifelines.** **Dependency and Indemnity Compensation (DIC)** is monthly support when a death ties to service the way VA defines it—not the same as a life insurance payout you chose at work. **Survivors pension** is a different lane for **low-income** surviving spouses and certain dependents under rules VA publishes—easy to confuse with DIC if nobody explains the labels.",
          "**Education** for spouses and children (VA publishes Chapter 35 and related paths) can mean **school money** when the family’s plan for “after the military” assumed **two incomes or two parents**. **Burial and memorial benefits** are the ones people try to handle **in a fog** three days after the death—having **death certificate, discharge papers, and marriage records** in one place is cruel homework, but it is what survivors describe needing.",
          "If you are **still living**: **talking once** about **where the DD214 lives** and **who knows how to log in to VA.gov** is a gift to the person who will be standing in your kitchen without you. If you are **already in that kitchen**: you are not behind—you are **grieving and learning a new vocabulary at the same time**. VA’s survivor hub is written for **that** person.",
        ],
      },
      {
        heading: "CHAMPVA—when the fight left is with insurance, not the enemy",
        body: [
          "**CHAMPVA** is **health coverage** for certain **spouses and children** when the veteran’s **service-connected death or total disability** meets criteria VA spells out—not Medicare, not Tricare, not “whatever your job offers.” Families hit it when **COBRA runs out**, when **a child still needs therapy**, or when **a surviving spouse** is staring at a premium that eats the DIC check.",
          "It does not fix grief. It can **keep a widow from choosing between** the mortgage and **a specialist**. If your family **might** qualify, **waiting to ask** because the forms look scary is how people **pay cash for insulin** they did not have to. VA’s CHAMPVA pages walk **who qualifies, how to enroll, and what it pairs with**—we do not run enrollment here.",
        ],
      },
      {
        heading: "Where to start on VA.gov (we do not file for you)",
        sectionLayout: "topic-card",
        body: [
          `${SITE_NAME} **does not** decide if you qualify, **does not** submit caregiver or survivor applications, and **cannot** see your account. Use the links below to land in the **right official section**—then call, ask for a patient advocate or social work, or work with an **accredited representative** if your situation is tangled.`,
        ],
        links: [
          { label: "VA family member benefits (caregiver programs hub)", url: "https://www.va.gov/family-member-benefits/" },
          { label: "VA survivors hub (DIC, pension, education, burial overview)", url: "https://www.va.gov/survivors/" },
          { label: "CHAMPVA — eligibility and enrollment (VA)", url: "https://www.va.gov/COMMUNITYCARE/programs/dependents/champva/" },
        ],
      },
    ],
    officialLinks: [
      { label: "VA caregivers", url: "https://www.va.gov/family-member-benefits/" },
      { label: "VA survivors", url: "https://www.va.gov/survivors/" },
      { label: "CHAMPVA (VA)", url: "https://www.va.gov/COMMUNITYCARE/programs/dependents/champva/" },
    ],
  },
  {
    slug: "va-letters",
    title: "VA letters & proof of benefits",
    summary:
      "The VA-issued papers that back up what you already know you earned—so a bank, boss, school, or state office can move instead of stalling. Why they matter in real life, what people are actually asking for, and where VA says to get a fresh copy. Not legal advice.",
    sections: [
      {
        heading: "When your DD214 is not the whole story",
        highlightAfterHeading:
          "**Your service is real without a PDF—but the world runs on paper.** A **benefit summary letter**, **disability rating letter**, or similar **VA-generated proof** is often what a third party means when they say **“we need something from the VA.”**",
        body: [
          "You know what you rate, what you get paid, and what you are enrolled in. **Strangers at a desk do not.** They are trying to **limit fraud** and **match you to their own rules**—veteran hiring credits, **property-tax exemptions**, **tuition breaks**, **mortgage breaks** for disabled vets, or **priority in line** for housing. **A letter on VA letterhead (or from VA’s authenticated tools)** is how you translate **your truth** into **their checkbox**.",
          "If you are the **spouse or family member** helping: your job is often **not** to argue the policy—it is to **get the right PDF downloaded**, **check the date**, and **make sure the name matches the application**. That is logistics, not disrespect.",
        ],
      },
      {
        heading: "Where life actually asks you to prove it",
        body: [
          "**Buying or refinancing a home** — Loan officers may need **documented disability rating or income** tied to VA benefits when you are using **VA-backed loan options** or **state/local disabled-vet property programs**. Stalling here is usually **missing paperwork**, not a judgment on your service.",
          "**A job or promotion** — Some employers track **veteran status** for **hiring goals** or **leave** tied to service. HR wants **something they can file**; a **VA letter or VA.gov-generated summary** beats a long story in an email.",
          "**School and training** — Registrars and certifying officials often need **proof of benefit level or eligibility** for **GI Bill**, **Yellow Ribbon**, or **state education waivers**. The class you want starts **whether or not** the bursar’s office is having a bad day—**early letters** prevent **late drops**.",
          "**State and local perks** — DMV clerks, **county tax assessors**, parks passes, and **professional license fees** sometimes ask for **proof of disability percentage or service connection**. Rules vary **by state and county**; what they have in common is **they want a document they recognize**, not a photo of your VA card from 2019.",
          "**Landlords and assisted living** — Income-qualified housing may treat **VA pay** as income; some facilities want **verification** before they hold a room. **Current** letters reduce **“we are still reviewing you”** limbo.",
        ],
      },
      {
        heading: "How you get a fresh letter without the shame spiral",
        body: [
          "**Signing in to VA.gov is not about surveillance—it is a lock on your file.** VA puts **letters and summaries** behind **identity checks** so **random people cannot pull your disability or payment history**. If the login feels like a hurdle, **password resets and ID.me / Login.gov** are the same hoops everyone hits; **it does not mean you did something wrong**.",
          "Once you are in, VA’s **account and records** areas (linked below) are where **current guidance** tells you to **download or print**. **Save a PDF** when you can—**printed mail** still exists but **instant copy** saves a second trip.",
          "**Dates matter.** A letter from **three years ago** may not match **today’s percentage or enrollment**. If someone pushes back, **refresh the letter** before you argue.",
          "**Screenshots of unofficial apps or third-party sites** often fail—**not because your benefits are fake**, but because **the reviewer’s policy names VA as the source**. Give them **what their rulebook asks for**.",
        ],
      },
      {
        heading: "VA’s own doors (sign-in, account, records)",
        sectionLayout: "topic-card",
        body: [
          `Use these when you are ready to **pull official proof** or **read how VA labels each document**. ${SITE_NAME} **cannot** log in for you or generate letters—only **you** (or someone you trust with your credentials) can.`,
        ],
        links: [
          { label: "VA.gov — sign in and account (get to your letters from here)", url: "https://www.va.gov/" },
          { label: "VA records hub — how VA talks about copies, letters, and your file", url: "https://www.va.gov/records/" },
        ],
      },
    ],
    officialLinks: [
      { label: "VA.gov sign in / account", url: "https://www.va.gov/" },
      { label: "VA records (overview)", url: "https://www.va.gov/records/" },
    ],
  },
];

export function getModule(slug: string): AwarenessModule | undefined {
  return awarenessModules.find((m) => m.slug === slug);
}
