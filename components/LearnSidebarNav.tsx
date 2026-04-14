"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { awarenessModules } from "@/data/awareness-modules";
import { PERKS_HUB_TOC } from "@/lib/perks-hub-toc";
import { PERKS_STATE_TOC } from "@/lib/perks-state-toc";
import { VA_RESOURCES_TOC } from "@/lib/va-resources-toc";

const linkActive =
  "font-medium text-blue-800 underline decoration-blue-200 underline-offset-2";
const linkIdle = "text-stone-700 hover:text-stone-900 hover:underline";

function normalizePath(path: string) {
  if (path.length > 1 && path.endsWith("/")) return path.slice(0, -1);
  return path;
}

function VeteransPersonalDataNav({
  pathname,
  headingClassName = "text-xs font-medium uppercase tracking-wide text-stone-500",
}: {
  pathname: string;
  headingClassName?: string;
}) {
  return (
    <>
      <p className={headingClassName}>Veterans personal data</p>
      <ul className="mt-3 flex flex-col gap-2 text-sm">
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
      <p className="mt-6 text-xs font-medium uppercase tracking-wide text-stone-500">Learn</p>
      <ul className="mt-2 flex flex-col gap-2 text-sm">
        <li>
          <Link href="/learn" className={linkIdle}>
            Topics A–Z
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
        <p className="text-xs font-medium uppercase tracking-wide text-stone-500">Perks &amp; programs</p>
        <ul className="mt-3 flex flex-col gap-2 text-sm">
          {PERKS_HUB_TOC.map((item) => (
            <li key={item.id}>
              <a href={`#${item.id}`} className={linkIdle}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="mt-6">
          <VeteransPersonalDataNav pathname={pathname} />
        </div>
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
        <p className="text-xs font-medium uppercase tracking-wide text-stone-500">Perks &amp; programs</p>
        <ul className="mt-3 flex flex-col gap-2 text-sm">
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
        <div className="mt-6">
          <VeteransPersonalDataNav pathname={pathname} />
        </div>
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
        <p className="text-xs font-medium uppercase tracking-wide text-stone-500">Perks &amp; programs</p>
        <ul className="mt-3 flex flex-col gap-2 text-sm">
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
        <div className="mt-6">
          <VeteransPersonalDataNav pathname={pathname} />
        </div>
        <LearnTopicsOnlyNav />
      </nav>
    );
  }

  if (pathname === "/va-resources") {
    return (
      <nav
        className="no-print w-full shrink-0 border-b border-stone-200/80 pb-6 lg:w-56 lg:border-b-0 lg:pb-0"
        aria-label="On this page"
      >
        <p className="text-xs font-medium uppercase tracking-wide text-stone-500">VA access &amp; resources</p>
        <ul className="mt-3 flex flex-col gap-2 text-sm">
          {VA_RESOURCES_TOC.map((item) => (
            <li key={item.id}>
              <a href={`/va-resources#${item.id}`} className={linkIdle}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="mt-6">
          <VeteransPersonalDataNav pathname={pathname} />
        </div>
        <LearnTopicsOnlyNav />
      </nav>
    );
  }

  return (
    <nav
      className="no-print w-full shrink-0 border-b border-stone-200/80 pb-6 lg:w-56 lg:border-b-0 lg:pb-0"
      aria-label="Site sections"
    >
      <VeteransPersonalDataNav pathname={pathname} />

      <p className="mt-6 text-xs font-medium uppercase tracking-wide text-stone-500">Learn</p>
      <ul className="mt-3 flex flex-col gap-2 text-sm">
        <li>
          <Link
            href="/learn"
            className={overviewActive ? linkActive : linkIdle}
            aria-current={overviewActive ? "page" : undefined}
          >
            Topics A–Z
          </Link>
        </li>
        {awarenessModules.map((m) => {
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
        })}
      </ul>
    </nav>
  );
}
