import { EducationalFooter } from "@/components/EducationalFooter";
import { SITE_NAME } from "@/lib/site";
import { PageAccent } from "@/components/PageAccent";
import { PersonalCalendar } from "@/components/PersonalCalendar";
import { ServiceSubpageFrame } from "@/components/ServiceSubpageFrame";

export const metadata = {
  title: `Personal calendar — ${SITE_NAME}`,
  description: "Local-only appointment and date reminders. Not legal or medical advice.",
};

export default function CalendarToolPage() {
  return (
    <ServiceSubpageFrame>
      <PageAccent className="page-accent-calendar" />
      <div className="relative z-10 mx-auto flex w-full max-w-xl flex-col gap-8 px-6 py-12">
      <header className="flex flex-col gap-4">
        <h1 className="text-2xl font-semibold tracking-tight text-stone-800">Personal calendar</h1>
        <p className="text-sm text-stone-600">
          <span className="text-stone-500">Trial access</span>
          {" · "}
          Some vets find this helpful.
        </p>
        <p className="text-sm leading-relaxed text-stone-600">
          Keep VA and civilian appointments in one clear timeline your spouse or loved ones can review with
          you, so everyone stays aligned before labs, follow-ups, and visit days.
        </p>
      </header>

      <PersonalCalendar />

      <EducationalFooter variant="compact" />
      </div>
    </ServiceSubpageFrame>
  );
}
