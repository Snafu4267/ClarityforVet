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
  if (p.startsWith("/admin")) return true;
  return (
    p === "/" ||
    p === "/register" ||
    p === "/login" ||
    p === "/welcome" ||
    p === "/invite-vet"
  );
}

/** Global content row: Learn sidebar + page main (same on most routes). */
export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = normalizePath(usePathname() || "");
  const showLearnNav = !hideLearnSidebar(pathname);

  if (!showLearnNav) {
    return (
      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-1 flex-col px-5 py-8 sm:px-6 lg:py-12">
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    );
  }

  return (
    <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-5 py-8 sm:px-6 lg:py-12 xl:flex-row xl:items-start xl:justify-center xl:gap-12">
      <div className="hidden xl:block xl:w-72 xl:shrink-0">
        <div className="sticky top-28 max-h-[calc(100vh-7rem)] overflow-y-auto overscroll-contain rounded-xl border-2 border-neutral-400 bg-white px-4 py-5 text-neutral-950 shadow-lg antialiased [text-rendering:optimizeLegibility]">
          <LearnSidebarNav />
        </div>
      </div>
      <main className="mx-auto min-w-0 w-full max-w-4xl flex-1">{children}</main>
    </div>
  );
}
