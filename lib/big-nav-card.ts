/**
 * Shared “big button” surfaces: full-width tap/click targets with consistent chrome.
 * Use {@link bigNavLinkCardClass} for Next.js `Link` or `<a>` cards; {@link bigSurfaceCardClass} for forms/panels.
 */

const bigTargetBase =
  "relative w-full rounded-xl border border-zinc-200/90 text-left shadow-sm ring-1 ring-zinc-100/80 transition hover:border-zinc-300 hover:shadow-md touch-manipulation sm:min-h-[5.25rem] px-5 py-5 sm:px-6 sm:py-6";

/** Entire card is the control (internal route or external URL). */
export const bigNavLinkCardClass = `${bigTargetBase} group block bg-white text-zinc-900 hover:bg-zinc-50/80 focus-visible:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-500 active:scale-[0.99] motion-reduce:active:scale-100`;

/** Same hit target, muted background (e.g. home “Veterans personal data” lane). */
export const bigNavLinkCardMutedClass = `${bigTargetBase} group block bg-zinc-50/70 text-zinc-900 hover:bg-zinc-50 focus-visible:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-500 active:scale-[0.99] motion-reduce:active:scale-100`;

/** Large bordered surface without link semantics (state pickers, static rows). */
export const bigSurfaceCardClass = `${bigTargetBase} bg-white hover:bg-zinc-50/60 focus-within:ring-2 focus-within:ring-zinc-200/90`;

/** Same chrome as {@link bigSurfaceCardClass} without a tall minimum height (e.g. phone rows). */
export const bigSurfaceRowClass =
  "relative w-full rounded-xl border border-zinc-200/90 bg-white px-5 py-4 text-left shadow-sm ring-1 ring-zinc-100/80 transition hover:border-zinc-300 hover:bg-zinc-50/40";
