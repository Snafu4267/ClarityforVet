import { SITE_NAME } from "@/lib/site";

/**
 * Site-wide educational / limitation notice. Not a substitute for a formal legal review.
 */
export function EducationalFooter({ variant = "full" }: { variant?: "full" | "compact" }) {
  if (variant === "compact") {
    return (
      <p className="mt-10 border-t border-stone-200/90 pt-6 text-xs leading-relaxed text-stone-500">
        <span className="font-medium text-stone-600">Educational use only.</span> {SITE_NAME} is independent—not VA, DoD,
        or any government agency. It is not a law firm, does not give legal or medical advice, and does not represent
        anyone before VA or any agency. Listings are not
        endorsements. Information may be incomplete or outdated—confirm with official sources. Using this site does not
        create an attorney-client or other professional relationship.
      </p>
    );
  }

  return (
    <section
      className="rounded-xl border border-stone-200/90 bg-stone-50/80 px-5 py-5"
      aria-labelledby="educational-use-heading"
    >
      <h2 id="educational-use-heading" className="text-sm font-medium text-stone-800">
        Educational use only
      </h2>
      <ul className="mt-3 list-inside list-disc space-y-2 text-xs leading-relaxed text-stone-600 marker:text-stone-400">
        <li>
          {SITE_NAME} is an independent education and organization project. It is{" "}
          <strong className="font-medium text-stone-700">not</strong> the U.S. Department of Veterans Affairs, the
          Department of Defense, or any government agency. It is <strong className="font-medium text-stone-700">not</strong>{" "}
          a law firm, does <strong className="font-medium text-stone-700">not</strong> provide legal advice, and does{" "}
          <strong className="font-medium text-stone-700">not</strong> represent veterans before VA or any other agency
          (including claims or appeals assistance).
        </li>
        <li>
          Nothing here is medical advice, diagnosis, or treatment. The medication list is a personal reference tool
          only—always follow your licensed care team.
        </li>
        <li>
          Information may be incomplete, outdated, or wrong for your situation. Confirm phone numbers, addresses,
          benefits, and eligibility with official VA, state, and federal sources.
        </li>
        <li>
          Listings of facilities, numbers, or organizations do not imply endorsement, partnership, or a recommendation to
          use a particular service.
        </li>
        <li>
          Using this site does not create an attorney-client relationship or any other professional relationship with{" "}
          {SITE_NAME} or its operators.
        </li>
      </ul>
    </section>
  );
}
