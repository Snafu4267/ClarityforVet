/** Stable DOM id for a Learn topic section (must match `app/learn/[slug]/page.tsx`). */
export function learnSectionDomId(slug: string, sectionIndex: number, anchorId?: string) {
  if (anchorId) return anchorId;
  return `learn-${slug}-s-${sectionIndex}`;
}
