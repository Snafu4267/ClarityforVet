import { EducationalFooter } from "@/components/EducationalFooter";
import { EmergencyBlock } from "@/components/EmergencyBlock";
import { PrintPageButton } from "@/components/PrintPageButton";
import { PageAccent } from "@/components/PageAccent";
import { ServiceSubpageFrame } from "@/components/ServiceSubpageFrame";
import national from "@/data/va-national-resources.json";
import { bigNavLinkCardClass, bigSurfaceRowClass } from "@/lib/big-nav-card";

export default function VaResourcesPage() {
  return (
    <ServiceSubpageFrame>
      <PageAccent className="page-accent-va-resources" />
      <div className="relative z-10 mx-auto flex w-full max-w-xl flex-col gap-10 px-6 py-12 print:max-w-none">
      <header className="flex flex-col gap-4 no-print">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-semibold tracking-tight text-stone-800">VA access &amp; resources</h1>
          <PrintPageButton />
        </div>
        <p className="text-sm leading-relaxed text-stone-600">{national.intro}</p>
      </header>

      <header className="hidden flex-col gap-2 print:flex">
        <h1 className="text-xl font-semibold text-stone-900">VA access &amp; resources</h1>
        <p className="text-sm text-stone-600">{national.intro}</p>
      </header>

      <section id="va-official-tools" className="scroll-mt-24 flex flex-col gap-4">
        <h2 className="text-lg font-medium text-stone-800">Start on official VA tools</h2>
        <ul className="flex list-none flex-col gap-3 p-0">
          {national.primaryActions.map((a) => (
            <li key={a.url}>
              <a
                href={a.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`${bigNavLinkCardClass} no-underline`}
              >
                <span className="block font-semibold text-zinc-900">{a.title}</span>
                <span className="mt-2 block text-sm leading-relaxed text-zinc-600">{a.description}</span>
                <span className="mt-3 block text-sm font-medium text-blue-800">{a.cta} →</span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section id="va-national-phones" className="scroll-mt-24 flex flex-col gap-4">
        <h2 className="text-lg font-medium text-stone-800">National phone numbers (verify on VA.gov)</h2>
        <ul className="flex list-none flex-col gap-3 p-0">
          {national.phoneDirectory.map((row) => (
            <li
              key={row.label}
              className={`${bigSurfaceRowClass} flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between`}
            >
              <div>
                <span className="text-sm text-stone-700">{row.label}</span>
                <p className="mt-1 text-xs text-stone-500">{row.note}</p>
              </div>
              <span className="font-mono text-sm text-stone-800">{row.phone}</span>
            </li>
          ))}
        </ul>
      </section>

      <section
        id="va-local-vso"
        className="scroll-mt-24 rounded-lg border border-stone-200 bg-white px-4 py-4 text-sm leading-relaxed text-stone-600"
      >
        <h2 className="text-lg font-medium text-stone-800">Local posts &amp; VSOs</h2>
        <p className="mt-2">{national.organizationsNote}</p>
      </section>

      <EmergencyBlock
        id="va-crisis"
        title={national.emergencyCopy.title}
        lines={national.emergencyCopy.lines}
        disclaimer={national.emergencyCopy.disclaimer}
      />

      <EducationalFooter variant="compact" />
      </div>
    </ServiceSubpageFrame>
  );
}
