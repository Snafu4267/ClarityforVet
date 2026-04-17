"use client";

import { EducationalFooter } from "@/components/EducationalFooter";
import { PageAccent } from "@/components/PageAccent";
import { PrintPageButton } from "@/components/PrintPageButton";
import { ServiceSubpageFrame } from "@/components/ServiceSubpageFrame";
import { useEffect, useState } from "react";

const STORAGE_KEY = "vet-to-vet-daily-notes-v2";
const LEGACY_STORAGE_KEY = "vet-to-vet-daily-notes";

type LocalNoteEntry = {
  id: string;
  body: string;
  createdAt: string;
};

function formatDateTime(value: string) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function sortNewestFirst(entries: LocalNoteEntry[]) {
  return [...entries].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

function loadEntries(): LocalNoteEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved) as LocalNoteEntry[];
      if (Array.isArray(parsed)) {
        const cleaned = parsed.filter(
          (row) =>
            row &&
            typeof row === "object" &&
            typeof row.id === "string" &&
            typeof row.body === "string" &&
            typeof row.createdAt === "string",
        );
        return sortNewestFirst(cleaned);
      }
    }

    const legacy = localStorage.getItem(LEGACY_STORAGE_KEY) ?? "";
    const trimmed = legacy.trim();
    if (!trimmed) return [];
    return [
      {
        id: crypto.randomUUID(),
        body: trimmed,
        createdAt: new Date().toISOString(),
      },
    ];
  } catch {
    return [];
  }
}

export default function DailyNotesPage() {
  const [entries, setEntries] = useState<LocalNoteEntry[]>([]);
  const [draft, setDraft] = useState("");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setEntries(loadEntries());
      setHydrated(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch {
      /* ignore */
    }
  }, [entries, hydrated]);

  function addEntry(e: React.FormEvent) {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setEntries((prev) =>
      sortNewestFirst([
        {
          id: crypto.randomUUID(),
          body: text,
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ]),
    );
    setDraft("");
  }

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

      <form className="flex flex-col gap-2" onSubmit={addEntry}>
        <label className="flex flex-col gap-2">
          <span className="text-sm text-stone-700">New note</span>
          <textarea
            className="min-h-[160px] rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-800 placeholder:text-stone-400 focus:border-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-300/50 print:min-h-0 print:border-0 print:p-0"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Appointments, questions for your doctor, tasks—whatever helps you."
            autoComplete="off"
          />
        </label>
        <button
          type="submit"
          className="self-start rounded-md bg-stone-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-stone-900"
        >
          Save note with date/time
        </button>
        <span className="text-xs leading-relaxed text-stone-500">
          We all forget things — writing it down now can really help later.
        </span>
      </form>

      <section className="flex flex-col gap-3">
        <h2 className="text-base font-semibold text-stone-900">Note history</h2>
        {entries.length === 0 ? (
          <p className="text-sm text-stone-500">No notes yet.</p>
        ) : (
          <ul className="max-h-[28rem] space-y-3 overflow-y-auto rounded-lg border border-stone-200 bg-white/90 p-3">
            {entries.map((entry) => (
              <li key={entry.id} className="rounded-md border border-stone-200 bg-stone-50/70 px-3 py-3">
                <p className="text-xs font-medium text-stone-500">{formatDateTime(entry.createdAt)}</p>
                <p className="mt-2 whitespace-pre-wrap text-sm text-stone-800">{entry.body}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <EducationalFooter variant="compact" />
      </div>
    </ServiceSubpageFrame>
  );
}
