"use client";

import { EducationalFooter } from "@/components/EducationalFooter";
import { PageAccent } from "@/components/PageAccent";
import { PrintPageButton } from "@/components/PrintPageButton";
import { ServiceSubpageFrame } from "@/components/ServiceSubpageFrame";
import { useEffect, useState } from "react";

const STORAGE_KEY = "vet-to-vet-daily-notes";

function loadNotes(): string {
  if (typeof window === "undefined") return "";
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ?? "";
  } catch {
    return "";
  }
}

export default function DailyNotesPage() {
  const [text, setText] = useState("");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setText(loadNotes());
      setHydrated(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, text);
    } catch {
      /* ignore */
    }
  }, [text, hydrated]);

  return (
    <ServiceSubpageFrame>
      <PageAccent className="page-accent-notes" />
      <div className="relative z-10 mx-auto flex w-full max-w-xl flex-col gap-8 px-6 py-12">
      <header className="flex flex-col gap-4 no-print">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-semibold tracking-tight text-stone-800">Daily notes</h1>
          <PrintPageButton />
        </div>
        <p className="text-sm text-stone-600">
          <span className="text-stone-500">Trial access</span>
          {" · "}
          Some vets find this helpful.
        </p>
        <p className="text-sm leading-relaxed text-stone-600">
          Stored only in your browser on this device (local storage). Not sent to our servers. Clear
          browser data removes it.
        </p>
      </header>

      <header className="hidden flex-col gap-2 print:flex">
        <h1 className="text-xl font-semibold text-stone-900">Daily notes</h1>
      </header>

      <label className="flex flex-col gap-2">
        <span className="text-sm text-stone-700">Notes</span>
        <textarea
          className="min-h-[280px] rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-800 placeholder:text-stone-400 focus:border-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-300/50 print:min-h-0 print:border-0 print:p-0"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Appointments, questions for your doctor, tasks—whatever helps you."
          autoComplete="off"
        />
        <span className="text-xs leading-relaxed text-stone-500">
          We all forget things — writing it down now can really help later.
        </span>
      </label>

      <EducationalFooter variant="compact" />
      </div>
    </ServiceSubpageFrame>
  );
}
