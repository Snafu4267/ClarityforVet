"use client";

export function PrintPageButton({ label = "Print or save as PDF" }: { label?: string }) {
  return (
    <button
      type="button"
      className="no-print rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-800 hover:bg-stone-50"
      onClick={() => window.print()}
    >
      {label}
    </button>
  );
}
