/**
 * Renders plain text with optional **bold** segments and [label](https://...) links.
 * Links must use https:// — opens official PDFs/pages in a new tab for printing.
 */
function BoldSegments({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) => {
        const m = part.match(/^\*\*(.+)\*\*$/);
        if (m) {
          return (
            <strong key={i} className="font-medium text-stone-800">
              {m[1]}
            </strong>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

function isAllowedHref(href: string): boolean {
  try {
    const u = new URL(href);
    return u.protocol === "https:";
  } catch {
    return false;
  }
}

export function AwarenessBodyText({ text }: { text: string }) {
  const segments = text.split(/(\[[^\]]+\]\([^)]+\))/g);
  return (
    <>
      {segments.map((part, i) => {
        const m = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (m) {
          const href = m[2].trim();
          if (!isAllowedHref(href)) {
            return <span key={i}>{part}</span>;
          }
          return (
            <a
              key={i}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-blue-800 underline decoration-blue-200 underline-offset-2 hover:decoration-blue-600"
            >
              {m[1]}
            </a>
          );
        }
        return <BoldSegments key={i} text={part} />;
      })}
    </>
  );
}
