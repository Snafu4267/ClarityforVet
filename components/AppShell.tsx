"use client";

import { LearnSidebarNav } from "@/components/LearnSidebarNav";
import { usePathname } from "next/navigation";

function normalizePath(path: string) {
  if (path.length > 1 && path.endsWith("/")) return path.slice(0, -1);
  return path;
}

/** Full-width content: no Learn TOC on home or auth screens. */
function hideLearnSidebar(pathname: string) {
  const p = normalizePath(pathname);
  return p === "/" || p === "/register" || p === "/login" || p === "/welcome";
}

/** Global content row: Learn sidebar + page main (same on most routes). */
export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = normalizePath(usePathname() || "");
  const showLearnNav = !hideLearnSidebar(pathname);

  return (
    <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-5 py-8 sm:px-6 lg:flex-row lg:gap-12 lg:py-12">
      {showLearnNav ? <LearnSidebarNav /> : null}
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}
