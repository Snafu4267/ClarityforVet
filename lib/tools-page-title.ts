// Maps each /tools/... route to the same title as that page's main h1 (see app/tools folders).

const TOOLS_PAGE_TITLE: Record<string, string> = {
  "/tools/vet-sheet": "Veteran info sheet",
  "/tools/notes": "Daily notes",
  "/tools/calendar": "Personal calendar",
  "/tools/medications": "Medication list",
  "/tools/printables": "Printables",
  "/tools/spouse-log": "Private family log",
  "/tools/spouse-log/instructions": "Why this space is here",
};

export function toolsPagePrimaryTitle(pathname: string): string | null {
  return TOOLS_PAGE_TITLE[pathname] ?? null;
}
