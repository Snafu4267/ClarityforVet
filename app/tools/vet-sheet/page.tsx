"use client";

import { BranchRibbon } from "@/components/vet-sheet/BranchRibbon";
import { VetSheetMyRatings, type VetSheetRatingRow } from "@/components/vet-sheet/VetSheetMyRatings";
import { VetSheetRatingsCallout } from "@/components/vet-sheet/VetSheetRatingsCallout";
import {
  BRANCH_BODY,
  BRANCH_CALLOUT,
  BRANCH_FOCUS,
  BRANCH_FORM_STRIP,
  BRANCH_LINK,
  BRANCH_PAGE,
  BRANCH_SELECT,
  BRANCH_TITLE,
  branchLabel,
  isBranchChosen,
  type BranchId,
} from "@/components/vet-sheet/branchData";
import { EducationalFooter } from "@/components/EducationalFooter";
import { bigNavLinkCardClass } from "@/lib/big-nav-card";
import { SITE_NAME } from "@/lib/site";
import { PageAccent } from "@/components/PageAccent";
import { PrintPageButton } from "@/components/PrintPageButton";
import Link from "next/link";
import { useEffect, useState } from "react";

const STORAGE_KEY = "vet-to-vet-veteran-sheet-v2";
const LEGACY_KEY = "vet-to-vet-veteran-sheet-v1";
const MAP_HOME_KEY = "vet-to-vet-map-home-v1";

type VetSheetFields = {
  branch: BranchId;
  name: string;
  dateOfBirth: string;
  email: string;
  zipCode: string;
  homeAddressLine: string;
  homeCity: string;
  homeState: string;
  homeZip: string;
  ratingRows: VetSheetRatingRow[];
};

type RatingTierGuide = {
  tier: string;
  overview: string;
  core: string[];
  familyAndAccess: string[];
  moneyAndTax: string[];
  actionLinks: { label: string; href: string }[];
};

const VA_RATING_GUIDE: RatingTierGuide[] = [
  {
    tier: "100% (including total disability rules such as P&T where granted)",
    overview:
      "This is usually the broadest federal benefit tier. Medical coverage, ancillary programs, and family pathways are generally strongest here.",
    core: [
      "VA health care access with the broadest cost protection under VA rules; many veterans at this tier see very low out-of-pocket VA care costs.",
      "Comprehensive dental eligibility is commonly available at this level (especially when schedular 100% or equivalent entitlement applies).",
      "Priority access to programs like caregiver support, prosthetics support, home adaptation pathways, and expanded care coordination can be stronger at this tier.",
      "Potential eligibility for CHAMPVA family medical coverage is often tied to permanent-and-total type findings; verify your exact VA decision language.",
    ],
    familyAndAccess: [
      "Family education pathways (for example DEA/Chapter 35 where applicable) are commonly linked to total/permanent findings rather than rating number alone.",
      "Base access, commissary, and exchange/PX privileges can be available through approved credentials and current DoD access rules.",
      "ID options can include VA-issued health identification and, when eligible, DoD credentials through separate DoD processes.",
    ],
    moneyAndTax: [
      "Highest monthly compensation band under VA disability tables (plus possible SMC pathways if criteria are met).",
      "Many states reserve top property-tax, vehicle, tuition, and fee waivers for 100% or for total/permanent findings.",
    ],
    actionLinks: [
      { label: "VA disability compensation rates", href: "https://www.va.gov/disability/compensation-rates/veteran-rates/" },
      { label: "VA dental care eligibility", href: "https://www.va.gov/health-care/about-va-health-benefits/dental-care/" },
      { label: "CHAMPVA overview", href: "https://www.va.gov/health-care/family-caregiver-benefits/champva/" },
      { label: "Commissary and exchange access", href: "https://www.va.gov/resources/commissary-and-exchange-privileges-for-veterans/" },
    ],
  },
  {
    tier: "90%",
    overview:
      "Very high compensation tier with substantial medical and support value, but some family-only programs may still depend on P&T or specific findings.",
    core: [
      "Strong monthly compensation and broad VA health use for service-connected and other eligible care.",
      "Medical support remains robust, but certain specialized benefits still key off specific eligibility categories.",
      "Dental is not automatic solely by percentage in every case; verify current VA dental class eligibility.",
    ],
    familyAndAccess: [
      "Family medical or education programs may require additional status language beyond raw percentage.",
      "Base and exchange access can still be possible through veteran credential pathways under current federal policy.",
    ],
    moneyAndTax: [
      "High federal compensation amount just below 100% tier.",
      "Some states include 90% in tax, fee, and tuition relief programs; others reserve best packages for 100%.",
    ],
    actionLinks: [
      { label: "VA compensation rates", href: "https://www.va.gov/disability/compensation-rates/veteran-rates/" },
      { label: "VA health care eligibility", href: "https://www.va.gov/health-care/eligibility/" },
    ],
  },
  {
    tier: "80% and 70%",
    overview:
      "High disability tiers with meaningful compensation and treatment support. Many veterans at these levels can build strong federal + state bundles.",
    core: [
      "Monthly compensation is significant and may increase further with dependents and qualifying factors.",
      "VA care access remains a core entitlement path, with medication and specialty care options depending on priority and clinical need.",
      "Dental usually requires qualifying categories beyond percentage alone unless another class applies.",
    ],
    familyAndAccess: [
      "Dependent add-ons to compensation often become important at these levels when family criteria are met.",
      "Credential-based access programs (ID card routes, exchange/commissary policies) should be verified case-by-case.",
    ],
    moneyAndTax: [
      "Compensation plus potential state-side veteran benefits can materially reduce household burden.",
      "Certain states trigger partial tax or fee reductions at 70%+.",
    ],
    actionLinks: [{ label: "Add dependents to VA benefits", href: "https://www.va.gov/view-change-dependents/" }],
  },
  {
    tier: "60% and 50%",
    overview:
      "Mid-high tiers where compensation and care coordination are still substantial; this is often where veterans can pair federal benefits with strong state programs.",
    core: [
      "Meaningful monthly compensation with potential additional amounts for dependents when eligible.",
      "VA health care remains central, including ongoing treatment support tied to service-connected needs.",
      "Some travel, prosthetic, or care-support pathways may open based on clinical and eligibility criteria.",
    ],
    familyAndAccess: [
      "Family-facing programs vary widely; check exact decision text and state rules.",
      "Access/shopping privileges depend on current federal implementation and credential verification.",
    ],
    moneyAndTax: [
      "Compensation can materially offset out-of-pocket costs.",
      "State exemptions and fee relief at these levels are common in some states but not universal.",
    ],
    actionLinks: [{ label: "Find your state veterans agency", href: "https://nasdva.us/resources/" }],
  },
  {
    tier: "40% and 30%",
    overview:
      "Foundational compensation tiers. Financial support is smaller than higher tiers, but still important, and service-connected care remains a major pathway.",
    core: [
      "Monthly compensation applies and can increase with dependent status when VA criteria are met.",
      "VA care for service-connected conditions remains a key practical benefit.",
      "Evidence updates and condition worsening documentation are especially important for future re-evaluation requests when appropriate.",
    ],
    familyAndAccess: [
      "Some family-linked add-ons begin to matter at these levels depending on household status.",
      "ID/access/shopping policies are not solely percentage driven; verify with official guidance.",
    ],
    moneyAndTax: [
      "Federal payment support plus selected local/state programs can still create meaningful relief.",
      "Check county and state offices for veteran fee waivers and reduced-rate programs.",
    ],
    actionLinks: [{ label: "VA intent to file and claims options", href: "https://www.va.gov/disability/how-to-file-claim/" }],
  },
  {
    tier: "20% and 10%",
    overview:
      "Entry compensation tiers still matter. These ratings can open foundational support, establish service connection, and create future pathways if conditions worsen.",
    core: [
      "Monthly compensation is lower, but service connection itself is often strategically important for future claims and care.",
      "VA health care pathways can still provide meaningful treatment access depending on eligibility category and enrollment.",
      "Keeping records of symptom changes, medication impact, and daily function can support future increase claims when warranted.",
    ],
    familyAndAccess: [
      "Do not assume no access: some federal and state programs are available independent of percentage, status, or campaign service factors.",
      "Veteran ID card pathways and some exchange/commissary access models may still apply under current law and credential checks.",
    ],
    moneyAndTax: [
      "Compensation is smaller, but can still reduce pressure from recurring costs.",
      "State and local relief may exist even at lower ratings; always check your state veterans agency and county veteran office.",
    ],
    actionLinks: [
      { label: "Veteran ID Card (VIC)", href: "https://www.va.gov/records/get-veteran-id-cards/vic/" },
      { label: "Commissary and exchange privileges", href: "https://www.va.gov/resources/commissary-and-exchange-privileges-for-veterans/" },
    ],
  },
];

const empty: VetSheetFields = {
  branch: "",
  name: "",
  dateOfBirth: "",
  email: "",
  zipCode: "",
  homeAddressLine: "",
  homeCity: "",
  homeState: "",
  homeZip: "",
  ratingRows: defaultRatingRows(),
};

function loadSheet(): VetSheetFields {
  if (typeof window === "undefined") return { ...empty };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<VetSheetFields>;
      return {
        branch: normalizeBranch(parsed.branch),
        name: typeof parsed.name === "string" ? parsed.name : "",
        dateOfBirth: typeof parsed.dateOfBirth === "string" ? parsed.dateOfBirth : "",
        email: typeof parsed.email === "string" ? parsed.email : "",
        zipCode: typeof parsed.zipCode === "string" ? parsed.zipCode : "",
        homeAddressLine: typeof parsed.homeAddressLine === "string" ? parsed.homeAddressLine : "",
        homeCity: typeof parsed.homeCity === "string" ? parsed.homeCity : "",
        homeState: typeof parsed.homeState === "string" ? parsed.homeState : "",
        homeZip: typeof parsed.homeZip === "string" ? parsed.homeZip : "",
        ratingRows: normalizeRatingRows(parsed.ratingRows),
      };
    }
    const legacy = localStorage.getItem(LEGACY_KEY);
    if (legacy) {
      const parsed = JSON.parse(legacy) as Partial<Omit<VetSheetFields, "branch">>;
      const migrated: VetSheetFields = {
        branch: "",
        name: typeof parsed.name === "string" ? parsed.name : "",
        dateOfBirth: typeof parsed.dateOfBirth === "string" ? parsed.dateOfBirth : "",
        email: typeof parsed.email === "string" ? parsed.email : "",
        zipCode: typeof parsed.zipCode === "string" ? parsed.zipCode : "",
        homeAddressLine: "",
        homeCity: "",
        homeState: "",
        homeZip: "",
        ratingRows: defaultRatingRows(),
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
        localStorage.removeItem(LEGACY_KEY);
      } catch {
        /* ignore */
      }
      return migrated;
    }
  } catch {
    /* ignore */
  }
  return { ...empty };
}

function normalizeBranch(v: unknown): BranchId {
  const allowed: BranchId[] = ["", "army", "marines", "navy", "air-force", "coast-guard", "space-force"];
  return typeof v === "string" && (allowed as string[]).includes(v) ? (v as BranchId) : "";
}

function defaultRatingRows(): VetSheetRatingRow[] {
  return [{ id: "default", percent: "", condition: "" }];
}

function normalizeRatingRows(raw: unknown): VetSheetRatingRow[] {
  if (!Array.isArray(raw)) return defaultRatingRows();
  const out: VetSheetRatingRow[] = [];
  for (const item of raw) {
    if (item && typeof item === "object") {
      const o = item as Record<string, unknown>;
      const id =
        typeof o.id === "string" && o.id.length > 0
          ? o.id
          : globalThis.crypto?.randomUUID?.() ?? `r-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      out.push({
        id,
        percent: typeof o.percent === "string" ? o.percent : "",
        condition: typeof o.condition === "string" ? o.condition : "",
      });
    }
  }
  return out.length > 0 ? out : defaultRatingRows();
}

export default function VeteranSheetPage() {
  const [fields, setFields] = useState<VetSheetFields>(empty);
  const [hydrated, setHydrated] = useState(false);
  const [mapHomePending, setMapHomePending] = useState(false);
  const [mapHomeMessage, setMapHomeMessage] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFields(loadSheet());
      setHydrated(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fields));
    } catch {
      /* ignore */
    }
  }, [fields, hydrated]);

  function update<K extends keyof VetSheetFields>(key: K, value: VetSheetFields[K]) {
    setFields((prev) => ({ ...prev, [key]: value }));
  }

  function setRatingRows(rows: VetSheetRatingRow[]) {
    setFields((prev) => ({ ...prev, ratingRows: rows }));
  }

  async function setMapHomeFromVetSheet() {
    const query = [fields.homeAddressLine, fields.homeCity, fields.homeState, fields.homeZip]
      .map((v) => v.trim())
      .filter(Boolean)
      .join(", ");
    if (query.length < 8) {
      setMapHomeMessage("Enter full home address details first.");
      return;
    }
    setMapHomePending(true);
    setMapHomeMessage(null);
    try {
      const res = await fetch("/api/geocode-address", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const payload = (await res.json()) as { error?: string; lat?: number; lng?: number; displayName?: string };
      if (!res.ok || payload.lat === undefined || payload.lng === undefined) {
        setMapHomeMessage(payload.error ?? "Could not set map home address.");
        return;
      }
      localStorage.setItem(
        MAP_HOME_KEY,
        JSON.stringify({
          label: "My home",
          addressLine: fields.homeAddressLine.trim(),
          city: fields.homeCity.trim(),
          state: fields.homeState.trim().toUpperCase(),
          zip: fields.homeZip.trim(),
          lat: payload.lat,
          lng: payload.lng,
          privacyNote: "Home address is saved locally on this device for map centering and directions.",
          displayName: payload.displayName ?? query,
        }),
      );
      setMapHomeMessage("Home address saved for facility map centering.");
    } catch {
      setMapHomeMessage("Network error while setting map home address.");
    } finally {
      setMapHomePending(false);
    }
  }

  const activeBranch = isBranchChosen(fields.branch) ? fields.branch : null;
  const formCardClass = activeBranch
    ? BRANCH_FORM_STRIP[activeBranch]
    : "rounded-xl border-2 border-stone-300 bg-white shadow-sm";

  const focusExtra = activeBranch ? BRANCH_FOCUS[activeBranch] : "focus:ring-stone-300/50";
  const inputClass = `rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-stone-400 focus:outline-none focus:ring-2 ${focusExtra} print:border-b print:border-t-0 print:border-x-0 print:rounded-none`;
  const selectClass = `rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-stone-400 focus:outline-none focus:ring-2 ${focusExtra}`;

  const pageShell = activeBranch ? `min-h-screen ${BRANCH_PAGE[activeBranch]}` : "min-h-screen bg-[#f7f6f3]";
  const bodyText = activeBranch ? BRANCH_BODY[activeBranch] : "text-stone-600";
  const linkClass = activeBranch
    ? BRANCH_LINK[activeBranch]
    : "text-stone-600 underline decoration-stone-300 underline-offset-2 hover:text-stone-800";
  const titleClass = activeBranch ? BRANCH_TITLE[activeBranch] : "text-stone-800";
  const calloutClass = activeBranch
    ? `rounded-lg px-3 py-2 text-xs leading-relaxed ${BRANCH_CALLOUT[activeBranch]}`
    : "rounded-lg border border-slate-200 bg-slate-50/90 px-3 py-2 text-xs leading-relaxed text-slate-700";

  return (
    <div className={`relative ${pageShell}`}>
      <PageAccent className="page-accent-vet-sheet" />
      <div
        className={`relative z-10 mx-auto flex w-full flex-col gap-8 px-6 py-12 ${
          activeBranch ? "max-w-3xl" : "max-w-xl"
        }`}
      >
        <header className="flex flex-col gap-4 no-print">
          <p className={`text-sm ${bodyText}`}>
            <Link href="/#veterans-personal-data" className={linkClass}>
              Veterans personal data
            </Link>
            <span className="text-stone-500"> — section on the home page</span>
          </p>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className={`text-2xl font-semibold tracking-tight ${titleClass}`}>Veteran info sheet</h1>
            <PrintPageButton label="Print sheet" />
          </div>
          <div className={calloutClass}>
            <span className="font-semibold text-slate-900">Where your data lives:</span> If you{" "}
            <Link href="/welcome" className="font-medium text-slate-800 underline decoration-slate-400">
              register
            </Link>{" "}
            for an account, that only covers sign-in (email/password). What you type below stays in{" "}
            <span className="font-semibold text-slate-900">this browser on this device</span>—it is not
            uploaded to {SITE_NAME} servers. Use it as a personal scratch card; clear browser data removes
            it.
          </div>
          <p className={`text-sm leading-relaxed ${bodyText}`}>
            Choose your branch to tint the page and show your seal, then fill your fields. A{" "}
            <span className="font-medium text-slate-800">Learn</span> shortcut on ratings, secondaries, and
            CFR sits below your fields. Optional fields—fill what helps you. Not a VA form, not legal or
            medical advice, not stored on our servers.
          </p>
        </header>

        <header className="hidden flex-col gap-2 print:flex">
          <h1 className="text-xl font-semibold text-stone-900">Veteran info sheet</h1>
          {activeBranch ? (
            <p className="text-sm font-medium text-stone-800">Branch: {branchLabel(activeBranch)}</p>
          ) : null}
          <p className="text-sm text-stone-600">For your records only.</p>
        </header>

        {activeBranch ? <BranchRibbon branch={activeBranch} /> : null}

        <div
          className={`rounded-xl p-5 shadow-sm print:border-stone-400 print:shadow-none sm:p-7 ${formCardClass}`}
        >
          <div className="mb-5 border-b border-stone-200 pb-3 text-center print:mb-4">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-slate-500">
              Veteran — personal reference
            </p>
            <p className="mt-1 text-xs text-slate-500">Sign-in style · local copy only</p>
            {activeBranch ? (
              <p className="mt-2 text-sm font-semibold text-slate-800">Branch: {branchLabel(activeBranch)}</p>
            ) : null}
          </div>

          <div className="flex flex-col gap-5">
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-slate-800">Branch of service</span>
              <select
                className={selectClass}
                value={fields.branch}
                onChange={(e) => update("branch", normalizeBranch(e.target.value))}
              >
                {BRANCH_SELECT.map((opt) => (
                  <option key={opt.value || "empty"} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <span className="text-xs leading-relaxed text-slate-500">
                Pick what you served—the page tints, shows your branch seal, and opens the ratings / CFR
                learn shortcut below your fields (not your personal record). Stays on this device only.
              </span>
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-slate-800">Name</span>
              <input
                type="text"
                autoComplete="name"
                className={inputClass}
                placeholder="Preferred or legal name"
                value={fields.name}
                onChange={(e) => update("name", e.target.value)}
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-slate-800">Date of birth</span>
              <input type="date" className={inputClass} value={fields.dateOfBirth} onChange={(e) => update("dateOfBirth", e.target.value)} />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-slate-800">Email (optional)</span>
              <input
                type="email"
                autoComplete="email"
                className={inputClass}
                placeholder="If you want it on your sheet"
                value={fields.email}
                onChange={(e) => update("email", e.target.value)}
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-slate-800">ZIP code (optional)</span>
              <input
                type="text"
                autoComplete="postal-code"
                inputMode="numeric"
                maxLength={10}
                className={inputClass}
                placeholder="For your own reference"
                value={fields.zipCode}
                onChange={(e) => update("zipCode", e.target.value)}
              />
            </label>

            <div className="rounded-lg border border-stone-200 bg-stone-50/70 px-4 py-4">
              <p className="text-sm font-semibold text-stone-900">Home address for map centering</p>
              <p className="mt-1 text-xs leading-relaxed text-stone-600">
                Save your home address once so VA facility maps can center on your location automatically.
              </p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <label className="flex flex-col gap-1.5 sm:col-span-2">
                  <span className="text-sm font-medium text-slate-800">Street address</span>
                  <input
                    type="text"
                    autoComplete="street-address"
                    className={inputClass}
                    placeholder="123 Main St"
                    value={fields.homeAddressLine}
                    onChange={(e) => update("homeAddressLine", e.target.value)}
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-sm font-medium text-slate-800">City</span>
                  <input
                    type="text"
                    autoComplete="address-level2"
                    className={inputClass}
                    value={fields.homeCity}
                    onChange={(e) => update("homeCity", e.target.value)}
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-sm font-medium text-slate-800">State</span>
                  <input
                    type="text"
                    autoComplete="address-level1"
                    maxLength={2}
                    className={inputClass}
                    placeholder="TX"
                    value={fields.homeState}
                    onChange={(e) => update("homeState", e.target.value)}
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-sm font-medium text-slate-800">ZIP</span>
                  <input
                    type="text"
                    autoComplete="postal-code"
                    maxLength={10}
                    className={inputClass}
                    value={fields.homeZip}
                    onChange={(e) => update("homeZip", e.target.value)}
                  />
                </label>
              </div>
              <button
                type="button"
                onClick={() => void setMapHomeFromVetSheet()}
                disabled={mapHomePending}
                className="mt-3 rounded-md bg-stone-800 px-4 py-2 text-sm font-medium text-white hover:bg-stone-900 disabled:opacity-60"
              >
                {mapHomePending ? "Saving..." : "Save as map home"}
              </button>
              {mapHomeMessage ? <p className="mt-2 text-xs text-stone-600">{mapHomeMessage}</p> : null}
            </div>
          </div>
        </div>

        <VetSheetMyRatings
          branch={fields.branch}
          rows={fields.ratingRows}
          onRowsChange={setRatingRows}
          inputClass={inputClass}
          selectClass={selectClass}
        />

        {activeBranch ? <VetSheetRatingsCallout branch={activeBranch} /> : null}

        <p className={`text-xs leading-relaxed no-print ${bodyText}`}>
          No Social Security number, claims numbers, or medical details—keep those with official VA
          channels and your own secure records.
        </p>

        <section
          className={`no-print flex flex-col gap-4 rounded-xl px-4 py-5 ${
            activeBranch ? BRANCH_CALLOUT[activeBranch] : "border border-stone-200 bg-stone-50/80"
          }`}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-600">More in this lane</p>
          <div className="rounded-lg border border-stone-200 bg-white px-4 py-4 shadow-sm">
            <h2 className="text-base font-semibold text-slate-900 sm:text-lg">Why These Exist Together</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              These tools sit in one lane because they support the same goal: keeping day-to-day health,
              appointments, and medication information organized in a way that reduces stress and makes VA
              visits smoother.
            </p>
          </div>
          <div className="grid gap-3">
            <Link href="/tools/notes" className={bigNavLinkCardClass}>
              <span className="block text-sm font-semibold text-zinc-900">Daily Notes</span>
              <span className="mt-2 block text-sm text-zinc-600">
                A simple place to record how the day actually went: mood, sleep, pain spikes, bowel
                issues, shower difficulty, whether meds helped, or anything that felt off. Or if you had a
                great day, those days should be recorded as well.
              </span>
            </Link>
            <Link href="/tools/calendar" className={bigNavLinkCardClass}>
              <span className="block text-sm font-semibold text-zinc-900">Personal Calendar</span>
              <span className="mt-2 block text-sm text-zinc-600">
                A dedicated calendar for VA and civilian appointments in one place. Your spouse or loved
                one can check the same schedule, so this becomes a shared care timeline, not just a phone
                calendar only you can see.
              </span>
            </Link>
            <Link href="/tools/medications" className={bigNavLinkCardClass}>
              <span className="block text-sm font-semibold text-zinc-900">Medication List</span>
              <span className="mt-2 block text-sm text-zinc-600">
                A complete, always-current list of every medication you take so appointments are easier and
                caregivers can track changes.
              </span>
            </Link>
            <Link href="/tools/printables" className={bigNavLinkCardClass}>
              <span className="block text-sm font-semibold text-zinc-900">Printables</span>
              <span className="mt-2 block text-sm text-zinc-600">
                Print notes, calendar entries, or medication information when you need a physical copy for
                appointments, travel, or personal organization.
              </span>
            </Link>
          </div>
        </section>

        <section className="no-print flex flex-col gap-4 rounded-xl border border-stone-200 bg-white px-5 py-5">
          <h2 className="text-sm font-semibold text-stone-900">Earned Veteran Benefits — Full Brief by Rating</h2>
          <p className="text-xs leading-relaxed text-stone-500">
            This is a practical briefing format so veterans and families know what to ask for. Final eligibility
            depends on your VA decision text, dependent status, and current agency rules.
          </p>
          <div className="flex flex-col gap-4">
            {VA_RATING_GUIDE.map((tier) => (
              <article key={tier.tier} className="rounded-lg border border-stone-200 bg-stone-50/70 px-4 py-4">
                <h3 className="text-sm font-semibold text-stone-900">{tier.tier}</h3>
                <p className="mt-1 text-sm leading-relaxed text-stone-700">{tier.overview}</p>

                <div className="mt-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.08em] text-stone-600">
                    Medical and core VA coverage
                  </p>
                  <ul className="mt-1 list-disc space-y-1 pl-5 text-sm leading-relaxed text-stone-700">
                    {tier.core.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="mt-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.08em] text-stone-600">
                    Family, ID, access, PX and commissary
                  </p>
                  <ul className="mt-1 list-disc space-y-1 pl-5 text-sm leading-relaxed text-stone-700">
                    {tier.familyAndAccess.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="mt-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.08em] text-stone-600">
                    Compensation and state-side money impact
                  </p>
                  <ul className="mt-1 list-disc space-y-1 pl-5 text-sm leading-relaxed text-stone-700">
                    {tier.moneyAndTax.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="mt-3 flex flex-wrap gap-4 text-sm">
                  {tier.actionLinks.map((link) => (
                    <a
                      key={`${tier.tier}-${link.href}`}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-emerald-900 underline decoration-emerald-300 underline-offset-2"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <div className="rounded-xl border border-stone-200/90 bg-white/95 p-4 shadow-sm print:border-0 print:bg-transparent print:shadow-none">
          <EducationalFooter variant="compact" />
        </div>
      </div>
    </div>
  );
}
