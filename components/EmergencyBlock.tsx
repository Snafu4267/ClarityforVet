type Props = {
  title: string;
  lines: string[];
  disclaimer: string;
  className?: string;
  /** Anchor for in-page / sidebar navigation. */
  id?: string;
};

/**
 * Crisis / emergency resource block. Keep copy aligned with official VA & 988 guidance.
 */
export function EmergencyBlock({ title, lines, disclaimer, className = "", id }: Props) {
  return (
    <section
      id={id}
      className={`flex flex-col gap-4 scroll-mt-24 rounded-lg border border-amber-200/80 bg-amber-50/60 px-4 py-5 ${className}`}
    >
      <h2 className="text-lg font-medium text-stone-800">{title}</h2>
      <ul className="list-inside list-disc space-y-2 text-sm leading-relaxed text-stone-700">
        {lines.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
      <p className="text-xs leading-relaxed text-stone-500">{disclaimer}</p>
    </section>
  );
}
