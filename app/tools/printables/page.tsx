import { EducationalFooter } from "@/components/EducationalFooter";
import { SITE_NAME } from "@/lib/site";
import { PageAccent } from "@/components/PageAccent";
import { PrintPageButton } from "@/components/PrintPageButton";
import { ServiceSubpageFrame } from "@/components/ServiceSubpageFrame";

export const metadata = {
  title: `Printables — ${SITE_NAME}`,
  description: "Printable blank forms for appointment prep and contacts. Educational use only.",
};

export default function PrintablesPage() {
  return (
    <ServiceSubpageFrame>
      <PageAccent className="page-accent-printables" />
      <div className="relative z-10 mx-auto flex w-full max-w-xl flex-col gap-10 px-6 py-12 print:max-w-none">
      <header className="flex flex-col gap-4 no-print">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-semibold tracking-tight text-stone-800">Printables</h1>
          <PrintPageButton />
        </div>
        <p className="text-sm leading-relaxed text-stone-600">
          Simple layouts you can print or save as PDF from your browser (Print → Save as PDF). No
          data is sent to our servers.
        </p>
      </header>

      <section className="print:break-inside-avoid rounded-lg border border-stone-200 bg-white px-5 py-6">
        <h2 className="text-lg font-medium text-stone-900">Appointment prep</h2>
        <p className="mt-2 text-sm text-stone-600">
          Write what you want to cover—this is your space, not medical advice from {SITE_NAME}.
        </p>
        <div className="mt-6 space-y-4 text-sm">
          <p className="font-medium text-stone-800">Date / provider / location</p>
          <div className="h-10 border-b border-stone-300" />
          <p className="font-medium text-stone-800">Top questions</p>
          <div className="h-24 border border-stone-200 bg-stone-50/50" />
          <p className="font-medium text-stone-800">Symptoms or changes to mention</p>
          <div className="h-24 border border-stone-200 bg-stone-50/50" />
        </div>
      </section>

      <section className="print:break-inside-avoid rounded-lg border border-stone-200 bg-white px-5 py-6">
        <h2 className="text-lg font-medium text-stone-900">Contact scratch space</h2>
        <p className="mt-2 text-sm text-stone-600">Numbers and names you are trying to keep straight.</p>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {["Name", "Organization", "Phone", "Notes"].map((label) => (
            <div key={label} className="flex flex-col gap-1">
              <span className="text-xs font-medium text-stone-500">{label}</span>
              <div className="min-h-[88px] border border-stone-200 bg-stone-50/50" />
            </div>
          ))}
        </div>
      </section>

      <EducationalFooter variant="compact" />
      </div>
    </ServiceSubpageFrame>
  );
}
