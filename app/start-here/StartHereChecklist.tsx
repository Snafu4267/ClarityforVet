"use client";

import Link from "next/link";
import { PUBLIC_ONLY_SITE } from "@/lib/site";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "start-here-checklist-v1";

type Step = {
  id: string;
  label: string;
  href: string;
  whatThisDoes: string;
  haveReady: string[];
  doneWhen: string;
};

const STEPS_ALL: Step[] = [
  {
    id: "learn",
    label: "Learn key VA topics",
    href: "/learn",
    whatThisDoes: "Shows the core VA lanes in plain English so you know which door to use first.",
    haveReady: ["Your latest VA letter (if you have one)", "One main question you need answered"],
    doneWhen: "You open at least one topic that matches your current issue.",
  },
  {
    id: "va-resources",
    label: "Find VA contacts and resources",
    href: "/va-resources",
    whatThisDoes: "Gets you to the right VA phone lines and official tools without guessing.",
    haveReady: ["ZIP code or city/state", "A pen, note app, or screenshot plan for numbers"],
    doneWhen: "You save at least one contact number or resource link you will use.",
  },
  {
    id: "perks",
    label: "Browse veteran perks",
    href: "/perks",
    whatThisDoes: "Helps you find state and national benefits you may be missing.",
    haveReady: ["Your state", "A quick list of needs (tax, education, housing, etc.)"],
    doneWhen: "You find one perk worth following up this week.",
  },
  {
    id: "spouse-log",
    label: "Set up private family log",
    href: "/tools/spouse-log/instructions",
    whatThisDoes: "Gives spouse, partner, or family one private place to track patterns and concerns.",
    haveReady: ["Email and password", "One or two high-priority issues to track first"],
    doneWhen: "Your first entry is saved and visible in the log history.",
  },
  {
    id: "notes",
    label: "Start daily notes",
    href: "/tools/notes",
    whatThisDoes: "Builds a day-by-day record you can use at appointments and follow-ups.",
    haveReady: ["Today’s key symptoms or stressors", "Any medication changes or side effects"],
    doneWhen: "You create your first dated note entry.",
  },
];

type ChecklistState = Record<string, boolean>;

export function StartHereChecklist() {
  const { data: session } = useSession();
  const hideSpouseStep = PUBLIC_ONLY_SITE || session?.user?.siteAccess === "restricted";
  const steps = useMemo(
    () => (hideSpouseStep ? STEPS_ALL.filter((s) => s.id !== "spouse-log") : STEPS_ALL),
    [hideSpouseStep],
  );

  const [checked, setChecked] = useState<ChecklistState>(() => {
    const state: ChecklistState = {};
    for (const step of STEPS_ALL) state[step.id] = false;
    return state;
  });
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        setIsReady(true);
        return;
      }
      const parsed = JSON.parse(raw) as Partial<ChecklistState>;
      const next: ChecklistState = {};
      for (const step of STEPS_ALL) {
        next[step.id] = Boolean(parsed[step.id]);
      }
      setChecked(next);
    } catch {
      const fallback: ChecklistState = {};
      for (const step of STEPS_ALL) fallback[step.id] = false;
      setChecked(fallback);
    } finally {
      setIsReady(true);
    }
  }, []);

  useEffect(() => {
    if (!isReady) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(checked));
  }, [checked, isReady]);

  return (
    <ul className="flex flex-col gap-3 text-sm text-stone-800">
      {steps.map((step) => (
        <li key={step.id} className="rounded-lg border border-amber-100/80 bg-white/80 px-3 py-3">
          <label htmlFor={step.id} className="flex items-start gap-3">
            <input
              id={step.id}
              type="checkbox"
              className="mt-1 size-4 shrink-0 rounded border-stone-400 text-amber-800 focus:ring-amber-600"
              checked={checked[step.id] ?? false}
              onChange={(e) =>
                setChecked((prev) => ({
                  ...prev,
                  [step.id]: e.target.checked,
                }))
              }
              aria-label={step.label}
            />
            <div className="leading-snug">
              <p>
                <span className="font-medium text-stone-900">{step.label}</span>{" "}
              <Link
                href={step.href}
                className="font-medium text-slate-800 underline decoration-stone-300 underline-offset-2"
              >
                Open
              </Link>
              </p>
              <p className="mt-1 text-xs text-stone-600">
                <span className="font-medium text-stone-800">What this does:</span> {step.whatThisDoes}
              </p>
              <p className="mt-1 text-xs text-stone-600">
                <span className="font-medium text-stone-800">Have ready:</span> {step.haveReady.join(" • ")}
              </p>
              <p className="mt-1 text-xs text-stone-600">
                <span className="font-medium text-stone-800">Done when:</span> {step.doneWhen}
              </p>
            </div>
          </label>
        </li>
      ))}
    </ul>
  );
}
