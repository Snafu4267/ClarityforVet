import Link from "next/link";
import type { CfrHintLink } from "@/data/cfr-condition-hints";
import { getCfrHintForConditionText } from "@/data/cfr-condition-hints";

type Props = { condition: string };

function isGoogleLink(href: string): boolean {
  return href.includes("google.com");
}

function partitionMainLinks(links: CfrHintLink[]) {
  const onSite = links.filter((l) => l.kind === "internal");
  const ecfr = links.filter((l) => l.kind === "external" && !isGoogleLink(l.href));
  const search = links.filter((l) => l.kind === "external" && isGoogleLink(l.href));
  return { onSite, ecfr, search };
}

function LinkChip({
  link,
  variant,
}: {
  link: CfrHintLink;
  variant: "site" | "ecfr" | "search";
}) {
  const base =
    "inline-flex max-w-full items-center justify-center rounded-md px-2 py-1.5 text-[0.7rem] font-semibold transition sm:text-xs";
  const styles =
    variant === "site"
      ? "border border-dashed border-sky-500/70 bg-white text-sky-950 hover:bg-sky-50"
      : variant === "search"
        ? "border border-violet-300/80 bg-violet-50/80 text-violet-950 shadow-sm hover:border-violet-400 hover:bg-violet-50"
        : "border border-slate-300 bg-white text-slate-800 shadow-sm hover:border-slate-400 hover:bg-slate-50";

  if (link.kind === "internal") {
    return (
      <Link key={link.href + link.label} href={link.href} className={`${base} ${styles}`}>
        <span className="break-words text-center leading-snug">{link.label}</span>
      </Link>
    );
  }
  return (
    <a
      key={link.href + link.label}
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${base} ${styles}`}
    >
      <span className="break-words text-center leading-snug">{link.label}</span>
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}

function LinkGroup({
  title,
  links,
  variant,
}: {
  title: string;
  links: CfrHintLink[];
  variant: "site" | "ecfr" | "search";
}) {
  if (links.length === 0) return null;
  return (
    <div className="mt-2">
      <p className="text-[0.65rem] font-semibold uppercase tracking-wide text-slate-500">{title}</p>
      <div className="mt-1 flex flex-wrap gap-1.5">
        {links.map((link) => (
          <LinkChip key={link.href + link.label} link={link} variant={variant} />
        ))}
      </div>
    </div>
  );
}

export function VetSheetRatingRowHints({ condition }: Props) {
  const hint = getCfrHintForConditionText(condition);
  if (!hint) return null;
  const { onSite, ecfr, search } = partitionMainLinks(hint.links);
  const related = hint.relatedQuestionLinks ?? [];
  const relParts = partitionMainLinks(related);

  return (
    <div className="w-full rounded-md border border-sky-200/80 bg-sky-50/50 px-2.5 py-2 text-xs leading-relaxed text-slate-800 no-print">
      <p className="font-semibold text-slate-900">{hint.title}</p>
      {hint.lines.map((line, i) => (
        <p key={i} className="mt-1 text-slate-700">
          {line}
        </p>
      ))}

      <LinkGroup title="On this site" links={onSite} variant="site" />
      <LinkGroup title="Official CFR (new tab)" links={ecfr} variant="ecfr" />
      <LinkGroup title="Google search helpers" links={search} variant="search" />

      {hint.exampleLink ? (
        <div className="mt-2 border-t border-sky-200/80 pt-2">
          <p className="text-[0.65rem] font-semibold uppercase tracking-wide text-slate-500">Visual walkthrough</p>
          <p className="mt-0.5 text-[0.72rem] text-slate-600">Optional — see how one condition maps to a §.</p>
          <div className="mt-1 flex flex-wrap gap-1.5">
            <LinkChip link={hint.exampleLink} variant="site" />
          </div>
        </div>
      ) : null}

      {related.length > 0 ? (
        <div className="mt-2 border-t border-sky-200/80 pt-2">
          <p className="text-[0.72rem] font-medium text-slate-800">
            Other angles to ask about — not a diagnosis:
          </p>
          <LinkGroup title="On this site" links={relParts.onSite} variant="site" />
          <LinkGroup title="Official CFR (new tab)" links={relParts.ecfr} variant="ecfr" />
          <LinkGroup title="Google search helpers" links={relParts.search} variant="search" />
        </div>
      ) : null}
    </div>
  );
}
