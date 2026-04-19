"use client";

import { usePathname } from "next/navigation";
import { useCallback, useId, useState } from "react";

export function SiteFeedbackButton() {
  const pathname = usePathname() || "/";
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const labelId = useId();
  const descId = useId();

  const reset = useCallback(() => {
    setRating(0);
    setComment("");
    setError(null);
    setDone(false);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    reset();
  }, [reset]);

  const submit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);
      if (rating < 1 || rating > 5) {
        setError("Pick a star rating (1–5).");
        return;
      }
      setPending(true);
      try {
        const res = await fetch("/api/site-feedback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rating, comment, pagePath: pathname }),
        });
        const data = (await res.json()) as { error?: string };
        if (!res.ok) {
          setError(data.error ?? "Could not send feedback.");
          setPending(false);
          return;
        }
        setDone(true);
        setPending(false);
        window.setTimeout(() => {
          close();
        }, 1600);
      } catch {
        setError("Network error — try again.");
        setPending(false);
      }
    },
    [rating, comment, pathname, close],
  );

  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="no-print fixed bottom-5 right-5 z-[90] inline-flex min-h-12 items-center justify-center rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-900 shadow-lg ring-1 ring-stone-200/80 transition hover:bg-stone-50"
      >
        Feedback
      </button>

      {open ? (
        <div
          className="no-print fixed inset-0 z-[200] flex items-end justify-center bg-black/40 p-4 sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby={labelId}
          aria-describedby={descId}
        >
          <button type="button" className="absolute inset-0 cursor-default" aria-label="Close" onClick={close} />
          <div
            className="relative z-10 w-full max-w-md rounded-2xl border border-stone-200 bg-white p-5 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id={labelId} className="text-lg font-semibold text-stone-900">
              We read every note
            </h2>
            <p id={descId} className="mt-1 text-sm text-stone-600">
              Tell us what you liked or disliked—or if we missed something helpful. Give a quick star rating, then say
              what&apos;s on your mind. Not medical advice—we&apos;re not diagnosing anything; just building a better site
              for vets.
            </p>

            <form className="mt-4 space-y-4" onSubmit={submit}>
              <div>
                <p className="text-sm font-medium text-stone-800">Overall</p>
                <div className="mt-2 flex flex-wrap gap-2" role="group" aria-label="Star rating 1 to 5">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setRating(n)}
                      className={`inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border text-sm font-semibold transition ${
                        rating === n
                          ? "border-amber-500 bg-amber-50 text-amber-950"
                          : "border-stone-300 bg-white text-stone-700 hover:border-stone-400"
                      }`}
                      aria-pressed={rating === n}
                      aria-label={`${n} star${n === 1 ? "" : "s"}`}
                    >
                      {n}★
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label htmlFor="site-feedback-comment" className="text-sm font-medium text-stone-800">
                  Your thoughts
                </label>
                <textarea
                  id="site-feedback-comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                  maxLength={2000}
                  className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 text-sm text-stone-900 focus:border-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-200/80"
                  placeholder="What landed well, what didn’t, or what would help you most…"
                  required
                  minLength={3}
                />
              </div>
              {error ? <p className="text-sm text-red-700">{error}</p> : null}
              {done ? <p className="text-sm font-medium text-green-800">Thanks — we got it.</p> : null}
              <div className="flex flex-wrap gap-2">
                <button
                  type="submit"
                  disabled={pending || done}
                  className="inline-flex min-h-11 flex-1 items-center justify-center rounded-lg bg-stone-900 px-4 text-sm font-semibold text-white transition hover:bg-stone-800 disabled:opacity-60"
                >
                  {pending ? "Sending…" : done ? "Sent" : "Send"}
                </button>
                <button
                  type="button"
                  onClick={close}
                  className="inline-flex min-h-11 items-center justify-center rounded-lg border border-stone-300 bg-white px-4 text-sm font-medium text-stone-800 hover:bg-stone-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
