"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const STORAGE_KEY = "start-here-checklist-v1";

type Step = {
  id: string;
  label: string;
  href: string;
};

const STEPS: Step[] = [
  { id: "learn", label: "Learn key VA topics", href: "/learn" },
  { id: "va-resources", label: "Find VA contacts and resources", href: "/va-resources" },
  { id: "perks", label: "Browse veteran perks", href: "/perks" },
  { id: "spouse-log", label: "Set up private family log", href: "/tools/spouse-log" },
  { id: "notes", label: "Start daily notes", href: "/tools/notes" },
];

type ChecklistState = Record<string, boolean>;

function initialState(): ChecklistState {
  const state: ChecklistState = {};
  for (const step of STEPS) state[step.id] = false;
  return state;
}

export function StartHereChecklist() {
  const [checked, setChecked] = useState<ChecklistState>(() => initialState());
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        setIsReady(true);
        return;
      }
      const parsed = JSON.parse(raw) as Partial<ChecklistState>;
      const next = initialState();
      for (const step of STEPS) {
        next[step.id] = Boolean(parsed[step.id]);
      }
      setChecked(next);
    } catch {
      setChecked(initialState());
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
      {STEPS.map((step) => (
        <li key={step.id} className="rounded-lg border border-amber-100/80 bg-white/70 px-3 py-2">
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
            <span className="leading-snug">
              {step.label}{" "}
              <Link
                href={step.href}
                className="font-medium text-slate-800 underline decoration-stone-300 underline-offset-2"
              >
                Open
              </Link>
            </span>
          </label>
        </li>
      ))}
    </ul>
  );
}
