"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { awarenessModules } from "@/data/awareness-modules";
import { PERKS_HUB_TOC } from "@/lib/perks-hub-toc";
import { PERKS_STATE_TOC } from "@/lib/perks-state-toc";
import { learnSectionDomId } from "@/lib/learn-section-id";
import { START_HERE_TOC } from "@/lib/start-here-toc";
import { toolsPagePrimaryTitle } from "@/lib/tools-page-title";
import { TOOLS_PRINTABLES_TOC } from "@/lib/tools-printables-toc";
import { VA_RESOURCES_TOC } from "@/lib/va-resources-toc";

/** High-contrast active link (sidebar) — easier for low vision / progressive lenses. */
const linkActive =
  "font-semibold text-blue-950 underline decoration-blue-600 decoration-2 underline-offset-[3px]";
/** Near-black link text; medium weight improves legibility at small sizes. */
const linkIdle =
  "font-medium text-neutral-950 hover:text-black hover:underline decoration-neutral-700 decoration-2 underline-offset-[3px]";
/** Section labels: bold, near-black, slightly wider letter-spacing for scanning. */
const navSectionHeading =
  "text-[11px] font-bold uppercase tracking-[0.14em] text-neutral-950";
const navLinkList = "flex flex-col gap-2.5 text-[15px] leading-snug";

function normalizePath(path: string) {
  if (path.length > 1 && path.endsWith("/")) return path.slice(0, -1);
  return path;
}

function VeteransPersonalDataNav({
  pathname,
  headingClassName = navSectionHeading,
}: {
  pathname: string;
  headingClassName?: string;
}) {
  return (
    <>
      <p className={headingClassName}>Veterans personal data</p>
      <ul className={`mt-3 ${navLinkList}`}>
        <li>
          <Link href="/#veterans-personal-data" className={linkIdle}>
            Home · tools &amp; vet sheet
          </Link>
        </li>
        <li>
          <Link
            href="/tools/vet-sheet"
            className={pathname === "/tools/vet-sheet" ? linkActive : linkIdle}
            aria-current={pathname === "/tools/vet-sheet" ? "page" : undefined}
          >
            Veteran info sheet
          </Link>
        </li>
        <li>
          <Link
            href="/tools/notes"
            className={pathname === "/tools/notes" ? linkActive : linkIdle}
            aria-current={pathname === "/tools/notes" ? "page" : undefined}
          >
            Daily notes
          </Link>
        </li>
        <li>
          <Link
            href="/tools/calendar"
            className={pathname === "/tools/calendar" ? linkActive : linkIdle}
            aria-current={pathname === "/tools/calendar" ? "page" : undefined}
          >
            Personal calendar
          </Link>
        </li>
        <li>
          <Link
            href="/tools/medications"
            className={pathname === "/tools/medications" ? linkActive : linkIdle}
            aria-current={pathname === "/tools/medications" ? "page" : undefined}
          >
            Medication list
          </Link>
        </li>
        <li>
          <Link
            href="/tools/printables"
            className={pathname === "/tools/printables" ? linkActive : linkIdle}
            aria-current={pathname === "/tools/printables" ? "page" : undefined}
          >
            Printables
          </Link>
        </li>
      </ul>
    </>
  );
}

/** `/perks/tx` (state page) — not `/perks/tx/foo` (detail). */
function perksStateSegment(pathname: string): string | null {
  const m = pathname.match(/^\/perks\/([a-z]{2})$/i);
  return m ? m[1].toLowerCase() : null;
}

/** `/perks/tx/some-perk` */
function perksDetailStateSegment(pathname: string): string | null {
  const m = pathname.match(/^\/perks\/([a-z]{2})\/[^/]+$/i);
  return m ? m[1].toLowerCase() : null;
}

function LearnTopicsOnlyNav() {
  return (
    <>
      <p className={`mt-6 ${navSectionHeading}`}>Learn</p>
      <ul className={`mt-2 ${navLinkList}`}>
        <li>
          <Link href="/learn" className={linkIdle}>
            Topics A–Z
          </Link>
        </li>
      </ul>
    </>
  );
}

/** One link to the home-page tools strip — avoids listing tools that are not headings on the current page. */
function PersonalToolsOnHomeNav() {
  return (
    <>
      <p className={`mt-6 ${navSectionHeading}`}>Personal tools</p>
      <ul className={`mt-3 ${navLinkList}`}>
        <li>
          <Link href="/#veterans-personal-data" className={linkIdle}>
            All tools on home (vet sheet, notes, calendar…)
          </Link>
        </li>
      </ul>
    </>
  );
}

/** Persistent Learn nav, or an on-page TOC when the route is not a Learn topic index. */
export function LearnSidebarNav() {
  const pathname = normalizePath(usePathname() || "");
  const overviewActive = pathname === "/learn";

  if (pathname === "/perks") {
    return (
      <nav
        className="no-print w-full shrink-0 border-b border-stone-200/80 pb-6 lg:w-56 lg:border-b-0 lg:pb-0"
        aria-label="On this page"
      >
        <p className={navSectionHeading}>Perks &amp; programs</p>
        <ul className={`mt-3 ${navLinkList}`}>
          {PERKS_HUB_TOC.map((item) => (
            <li key={item.id}>
              <a href={`#${item.id}`} className={linkIdle}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        <PersonalToolsOnHomeNav />
        <LearnTopicsOnlyNav />
      </nav>
    );
  }

  const perksState = perksStateSegment(pathname);
  if (perksState) {
    return (
      <nav
        className="no-print w-full shrink-0 border-b border-stone-200/80 pb-6 lg:w-56 lg:border-b-0 lg:pb-0"
        aria-label="On this page"
      >
        <p className={navSectionHeading}>Perks &amp; programs</p>
        <ul className={`mt-3 ${navLinkList}`}>
          <li>
            <Link href="/perks" className={linkIdle}>
              Veteran perks hub
            </Link>
          </li>
          {PERKS_STATE_TOC.map((item) => (
            <li key={item.id}>
              <a href={`#${item.id}`} className={linkIdle}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        <PersonalToolsOnHomeNav />
        <LearnTopicsOnlyNav />
      </nav>
    );
  }

  const perksDetailState = perksDetailStateSegment(pathname);
  if (perksDetailState) {
    return (
      <nav
        className="no-print w-full shrink-0 border-b border-stone-200/80 pb-6 lg:w-56 lg:border-b-0 lg:pb-0"
        aria-label="On this page"
      >
        <p className={navSectionHeading}>This program</p>
        <ul className={`mt-3 ${navLinkList}`}>
          <li>
            <a href="#perk-detail" className={linkIdle}>
              Program details
            </a>
          </li>
          <li>
            <a href="#perk-official" className={linkIdle}>
              Official rules (full source)
            </a>
          </li>
          <li>
            <a href="#perk-similar-states" className={linkIdle}>
              Similar programs in other states
            </a>
          </li>
          <li>
            <a href="#perk-detail-back" className={linkIdle}>
              Back to state quick reference
            </a>
          </li>
        </ul>
        <p className={`mt-6 ${navSectionHeading}`}>Perks navigation</p>
        <ul className={`mt-3 ${navLinkList}`}>
          <li>
            <Link href="/perks" className={linkIdle}>
              Veteran perks hub
            </Link>
          </li>
          <li>
            <Link href={`/perks/${perksDetailState}`} className={linkIdle}>
              State quick list
            </Link>
          </li>
          <li>
            <Link href="/perks#perks-jump-state" className={linkIdle}>
              Pick another state
            </Link>
          </li>
        </ul>
        <PersonalToolsOnHomeNav />
        <LearnTopicsOnlyNav />
      </nav>
    );
  }

  if (pathname === "/tools/printables") {
    return (
      <nav
        className="no-print w-full shrink-0 border-b border-stone-200/80 pb-6 lg:w-56 lg:border-b-0 lg:pb-0"
        aria-label="On this page"
      >
        <p className={navSectionHeading}>This page</p>
        <ul className={`mt-3 ${navLinkList}`}>
          {TOOLS_PRINTABLES_TOC.map((item) => (
            <li key={item.id}>
              <a href={`#${item.id}`} className={linkIdle}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        <PersonalToolsOnHomeNav />
        <LearnTopicsOnlyNav />
      </nav>
    );
  }

  const toolsPrimaryTitle = toolsPagePrimaryTitle(pathname);
  if (toolsPrimaryTitle) {
    return (
      <nav
        className="no-print w-full shrink-0 border-b border-stone-200/80 pb-6 lg:w-56 lg:border-b-0 lg:pb-0"
        aria-label="On this page"
      >
        <p className={navSectionHeading}>This page</p>
        <ul className={`mt-3 ${navLinkList}`}>
          <li>
            <span className={linkActive} aria-current="page">
              {toolsPrimaryTitle}
            </span>
          </li>
        </ul>
        <PersonalToolsOnHomeNav />
        <LearnTopicsOnlyNav />
      </nav>
    );
  }

  if (pathname === "/start-here") {
    return (
      <nav
        className="no-print w-full shrink-0 border-b border-stone-200/80 pb-6 lg:w-56 lg:border-b-0 lg:pb-0"
        aria-label="On this page"
      >
        <p className={navSectionHeading}>Starting with the VA</p>
        <ul className={`mt-3 ${navLinkList}`}>
          {START_HERE_TOC.map((item) => (
            <li key={item.id}>
              <a href={`#${item.id}`} className={linkIdle}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        <p className={`mt-6 ${navSectionHeading}`}>More on this site</p>
        <ul className={`mt-3 ${navLinkList}`}>
          <li>
            <Link href="/learn" className={linkIdle}>
              Topics A–Z
            </Link>
          </li>
          <li>
            <Link href="/va-resources" className={linkIdle}>
              VA contacts &amp; resources
            </Link>
          </li>
          <li>
            <Link href="/#veterans-personal-data" className={linkIdle}>
              Personal tools (notes, calendar, meds…)
            </Link>
          </li>
        </ul>
      </nav>
    );
  }

  if (pathname === "/va-resources") {
    return (
      <nav
        className="no-print w-full shrink-0 border-b border-stone-200/80 pb-6 lg:w-56 lg:border-b-0 lg:pb-0"
        aria-label="On this page"
      >
        <p className={navSectionHeading}>VA access &amp; resources</p>
        <ul className={`mt-3 ${navLinkList}`}>
          {VA_RESOURCES_TOC.map((item) => (
            <li key={item.id}>
              <a href={`/va-resources#${item.id}`} className={linkIdle}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        <PersonalToolsOnHomeNav />
        <LearnTopicsOnlyNav />
      </nav>
    );
  }

  const learnTopicMatch = pathname.match(/^\/learn\/([^/]+)$/);
  const learnTopicSlug = learnTopicMatch?.[1];
  if (learnTopicSlug) {
    const learnMod = awarenessModules.find((m) => m.slug === learnTopicSlug);
    if (learnMod) {
      const sectionToc = learnMod.sections.map((s, idx) => ({
        id: learnSectionDomId(learnTopicSlug, idx, s.anchorId),
        label: s.heading,
      }));
      const onPageToc =
        learnTopicSlug === "evidence"
          ? [
              { id: "learn-evidence-forms-hub", label: "Forms & helpers — all in one block" },
              ...sectionToc,
            ]
          : sectionToc;
      onPageToc.push({ id: `learn-${learnTopicSlug}-official-links`, label: "More official links" });

      return (
        <nav
          className="no-print w-full shrink-0 border-b border-stone-200/80 pb-6 lg:w-56 lg:border-b-0 lg:pb-0"
          aria-label="On this page"
        >
          <p className={navSectionHeading}>This topic</p>
          <ul className={`mt-3 ${navLinkList}`}>
            {onPageToc.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`} className={linkIdle}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <p className={`mt-6 ${navSectionHeading}`}>Learn</p>
          <ul className={`mt-3 ${navLinkList}`}>
            <li>
              <Link href="/learn" className={linkIdle}>
                Topics A–Z (all topics)
              </Link>
            </li>
            <li>
              <Link href="/learn#topic-summaries-heading" className={linkIdle}>
                What each topic covers
              </Link>
            </li>
          </ul>
          <PersonalToolsOnHomeNav />
        </nav>
      );
    }
  }

  return (
    <nav
      className="no-print w-full shrink-0 border-b border-stone-200/80 pb-6 lg:w-56 lg:border-b-0 lg:pb-0"
      aria-label="Site sections"
    >
      {!overviewActive ? <VeteransPersonalDataNav pathname={pathname} /> : null}

      <p
        className={`${navSectionHeading} ${overviewActive ? "pt-1" : "mt-6"}`}
      >
        Learn
      </p>
      <ul className={`mt-3 ${navLinkList}`}>
        {overviewActive ? (
          <li>
            <a href="#topic-summaries-heading" className={linkIdle}>
              What each topic covers
            </a>
          </li>
        ) : null}
        <li>
          <Link
            href="/learn"
            className={overviewActive ? linkActive : linkIdle}
            aria-current={overviewActive ? "page" : undefined}
          >
            Topics A–Z
          </Link>
        </li>
        {overviewActive
          ? awarenessModules.map((m) => {
              const topicPath = `/learn/${m.slug}`;
              const active = pathname === topicPath;
              return (
                <li key={m.slug}>
                  <Link
                    href={topicPath}
                    className={active ? linkActive : linkIdle}
                    aria-current={active ? "page" : undefined}
                  >
                    {m.title}
                  </Link>
                </li>
              );
            })
          : null}
      </ul>
    </nav>
  );
}
