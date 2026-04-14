"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "vet-to-vet-calendar-events-v1";

type CalEvent = {
  id: string;
  title: string;
  date: string;
  notes?: string;
};

function load(): CalEvent[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CalEvent[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function save(events: CalEvent[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  } catch {
    /* ignore */
  }
}

export function PersonalCalendar() {
  const [events, setEvents] = useState<CalEvent[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setEvents(load());
      setHydrated(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    save(events);
  }, [events, hydrated]);

  const sorted = useMemo(
    () => [...events].sort((a, b) => a.date.localeCompare(b.date)),
    [events],
  );

  const add = useCallback(() => {
    const t = title.trim();
    const d = date.trim();
    if (!t || !d) return;
    const ev: CalEvent = {
      id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      title: t,
      date: d,
      notes: notes.trim() || undefined,
    };
    setEvents((prev) => [...prev, ev]);
    setTitle("");
    setNotes("");
  }, [title, date, notes]);

  const remove = useCallback((id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  }, []);

  return (
    <div className="flex flex-col gap-8">
      <p className="text-sm leading-relaxed text-stone-600">
        Personal reminders only—this is not legal or medical scheduling advice. Events stay in your
        browser (local storage).
      </p>

      <div className="rounded-lg border border-stone-200 bg-white px-4 py-4">
        <h2 className="text-sm font-medium text-stone-800">Add an entry</h2>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <label className="flex min-w-[200px] flex-1 flex-col gap-1 text-sm">
            <span className="text-stone-600">Title</span>
            <input
              className="rounded-md border border-stone-300 px-3 py-2 text-stone-800"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Primary care call"
            />
          </label>
          <label className="flex w-full flex-col gap-1 text-sm sm:w-44">
            <span className="text-stone-600">Date</span>
            <input
              type="date"
              className="rounded-md border border-stone-300 px-3 py-2 text-stone-800"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </label>
        </div>
        <label className="mt-3 flex flex-col gap-1 text-sm">
          <span className="text-stone-600">Notes (optional)</span>
          <input
            className="rounded-md border border-stone-300 px-3 py-2 text-stone-800"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Time, location, what to bring"
          />
        </label>
        <button
          type="button"
          className="mt-4 rounded-md bg-stone-800 px-4 py-2 text-sm font-medium text-white hover:bg-stone-900"
          onClick={add}
        >
          Save entry
        </button>
      </div>

      <div>
        <h2 className="text-sm font-medium text-stone-800">Upcoming &amp; saved</h2>
        <ul className="mt-3 flex flex-col gap-3">
          {sorted.length === 0 ? (
            <li className="text-sm text-stone-500">No entries yet.</li>
          ) : (
            sorted.map((e) => (
              <li
                key={e.id}
                className="flex flex-col gap-1 rounded-lg border border-stone-200 bg-stone-50/80 px-4 py-3 sm:flex-row sm:items-start sm:justify-between"
              >
                <div>
                  <p className="font-medium text-stone-900">{e.title}</p>
                  <p className="text-sm text-stone-600">{e.date}</p>
                  {e.notes ? <p className="mt-1 text-sm text-stone-600">{e.notes}</p> : null}
                </div>
                <button
                  type="button"
                  className="text-sm text-red-700 underline decoration-red-300"
                  onClick={() => remove(e.id)}
                >
                  Remove
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
