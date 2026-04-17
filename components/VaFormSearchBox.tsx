"use client";

import { FormEvent, useState } from "react";

export function VaFormSearchBox() {
  const [query, setQuery] = useState("");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    const search = encodeURIComponent(`site:va.gov/forms OR site:vba.va.gov/pubs/forms ${trimmed}`);
    window.open(`https://www.google.com/search?q=${search}`, "_blank", "noopener,noreferrer");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-3 rounded-lg border border-stone-200/90 bg-white/90 p-3 shadow-sm"
      aria-label="Search for official VA forms"
    >
      <label htmlFor="va-form-search" className="block text-sm font-medium text-stone-900">
        Search any official form number or name
      </label>
      <p className="mt-1 text-xs text-stone-600">Try: 21-526EZ, 10-10EZ, 21-686c, CHAMPVA</p>
      <div className="mt-2 flex flex-col gap-2 sm:flex-row">
        <input
          id="va-form-search"
          type="text"
          required
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type a form number or title"
          className="h-10 w-full rounded-md border border-stone-300 bg-white px-3 text-sm text-stone-900 shadow-sm outline-none ring-0 placeholder:text-stone-400 focus:border-blue-400"
        />
        <button
          type="submit"
          className="inline-flex h-10 items-center justify-center rounded-md border border-blue-300 bg-blue-50 px-4 text-sm font-semibold text-blue-900 shadow-sm transition hover:border-blue-400 hover:bg-blue-100"
        >
          Search official forms
        </button>
      </div>
    </form>
  );
}
