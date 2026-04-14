"use client";

import { EducationalFooter } from "@/components/EducationalFooter";
import { PageAccent } from "@/components/PageAccent";
import { ServiceSubpageFrame } from "@/components/ServiceSubpageFrame";
import { useId, useState } from "react";

type MedRow = {
  id: string;
  name: string;
  dose: string;
  notes: string;
};

function newRow(): MedRow {
  return {
    id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    name: "",
    dose: "",
    notes: "",
  };
}

export default function MedicationsPage() {
  const [rows, setRows] = useState<MedRow[]>(() => [newRow()]);
  const baseId = useId();

  function updateRow(id: string, patch: Partial<Pick<MedRow, "name" | "dose" | "notes">>) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

  function addRow() {
    setRows((prev) => [...prev, newRow()]);
  }

  function removeRow(id: string) {
    setRows((prev) => (prev.length <= 1 ? prev : prev.filter((r) => r.id !== id)));
  }

  return (
    <ServiceSubpageFrame>
      <PageAccent className="page-accent-medications" />
      <div className="relative z-10 mx-auto flex w-full max-w-xl flex-col gap-10 px-6 py-12">
      <header className="flex flex-col gap-4">
        <h1 className="text-2xl font-semibold tracking-tight text-stone-800">Medication list</h1>
        <p className="text-sm text-stone-600">
          <span className="text-stone-500">Trial access</span>
          {" · "}
          Some vets find this helpful.
        </p>
        <p className="text-sm leading-relaxed text-stone-600">
          This page stores entries only in your browser for this session. Nothing is sent to a server
          in this MVP.
        </p>
        <p className="text-sm leading-relaxed text-stone-600">
          <span className="font-medium text-stone-700">Not medical advice.</span> This is a personal
          reference list for your own use (for example, before an appointment). It does not diagnose,
          treat, or prescribe. Follow your licensed prescriber and care team for all medical
          decisions. It is not a substitute for your official medical record.
        </p>
      </header>

      <div className="flex flex-col gap-8">
        {rows.map((row, index) => (
          <div
            key={row.id}
            className="flex flex-col gap-4 rounded-lg border border-stone-200 bg-stone-50/80 px-4 py-5"
          >
            <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
              Entry {index + 1}
            </p>

            <label className="flex flex-col gap-2">
              <span className="text-sm text-stone-700">Medication name</span>
              <input
                id={`${baseId}-${row.id}-name`}
                className="rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-800 placeholder:text-stone-400 focus:border-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-300/50"
                value={row.name}
                onChange={(e) => updateRow(row.id, { name: e.target.value })}
                placeholder="e.g., as written on the label"
                autoComplete="off"
              />
              <span className="text-xs leading-relaxed text-stone-500">
                We all forget things — writing it down now can really help later.
              </span>
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm text-stone-700">Dose / schedule</span>
              <input
                id={`${baseId}-${row.id}-dose`}
                className="rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-800 placeholder:text-stone-400 focus:border-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-300/50"
                value={row.dose}
                onChange={(e) => updateRow(row.id, { dose: e.target.value })}
                placeholder="e.g., once daily, or as your doctor directed"
                autoComplete="off"
              />
              <span className="text-xs leading-relaxed text-stone-500">
                We all forget things — writing it down now can really help later.
              </span>
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm text-stone-700">Notes (optional)</span>
              <textarea
                id={`${baseId}-${row.id}-notes`}
                className="min-h-[88px] rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-800 placeholder:text-stone-400 focus:border-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-300/50"
                value={row.notes}
                onChange={(e) => updateRow(row.id, { notes: e.target.value })}
                placeholder="Pharmacy, prescriber, side effects to discuss—whatever helps you."
                autoComplete="off"
              />
              <span className="text-xs leading-relaxed text-stone-500">
                We all forget things — writing it down now can really help later.
              </span>
            </label>

            {rows.length > 1 ? (
              <button
                type="button"
                className="self-start text-sm text-stone-600 underline decoration-stone-300 underline-offset-4 hover:text-stone-800"
                onClick={() => removeRow(row.id)}
              >
                Remove this entry
              </button>
            ) : null}
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        <button
          type="button"
          className="rounded-md border border-stone-300 bg-white px-4 py-3 text-sm font-medium text-stone-800 hover:bg-stone-50"
          onClick={addRow}
        >
          Add another medication
        </button>
      </div>

      <EducationalFooter variant="compact" />
      </div>
    </ServiceSubpageFrame>
  );
}
