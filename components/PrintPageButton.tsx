"use client";

export function PrintPageButton({ label = "Print or save as PDF" }: { label?: string }) {
  return (
    <button
      type="button"
      className="no-print inline-flex min-h-[2.5rem] items-center justify-center rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-900 shadow-sm transition hover:border-zinc-400 hover:bg-zinc-50"
      onClick={() => window.print()}
    >
      {label}
    </button>
  );
}
