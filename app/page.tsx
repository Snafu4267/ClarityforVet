import { AwarenessBodyText } from "@/components/AwarenessBodyText";
import { EducationalFooter } from "@/components/EducationalFooter";
import { MilitarySealsStrip } from "@/components/MilitarySealsStrip";
import { StatePerksPicker } from "@/components/StatePerksPicker";
import { StateVaFacilitiesPicker } from "@/components/StateVaFacilitiesPicker";
import { bigNavLinkCardClass, bigNavLinkCardMutedClass } from "@/lib/big-nav-card";
import { SITE_HOOK, SITE_NAME } from "@/lib/site";
import Link from "next/link";

/** Public domain — U.S. Air Force / DVIDS: flag at Joint Base Charleston (flag and sky; moon in frame). */
const HOME_HERO_FLAG_BG =
  "https://upload.wikimedia.org/wikipedia/commons/0/0a/The_American_flag_blows_in_the_wind_as_the_moon_rises_over_Joint_Base_Charleston.jpg";

/** Public domain — National Park Service (Wikimedia Commons): Statue of Liberty National Monument. */
const HOME_HERO_LIBERTY_BG =
  "https://upload.wikimedia.org/wikipedia/commons/8/81/Statue_of_Liberty_National_Monument_STLI2261.jpg";

function LaneSection({
  label,
  id,
  children,
}: {
  label: string;
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="rounded-2xl border border-zinc-200 bg-gradient-to-b from-white to-zinc-50/90 p-5 shadow-sm scroll-mt-24"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">{label}</p>
      <div className="mt-4 flex flex-col gap-3">{children}</div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="relative min-h-screen w-full">
      {/* Full viewport bleed — `fixed` avoids a narrow parent (flex/embed) clipping `absolute` layers */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
        <div className="absolute inset-0 bg-[#f3f4f6]" />
        {/* Liberty + flag only in the side gutters — same width as the margin outside max-w-3xl (48rem), so they never sit under the white cards */}
        <div
          className="absolute inset-y-0 left-0 opacity-[0.3] max-[47.999rem]:hidden"
          style={{
            width: "max(0px, calc((100vw - 48rem) / 2 - 0.5rem))",
            backgroundImage: `url(${HOME_HERO_LIBERTY_BG})`,
            backgroundSize: "cover",
            backgroundPosition: "center top",
          }}
        />
        <div
          className="absolute inset-y-0 right-0 opacity-[0.32] max-[47.999rem]:hidden"
          style={{
            width: "max(0px, calc((100vw - 48rem) / 2 - 0.5rem))",
            backgroundImage: `url(${HOME_HERO_FLAG_BG})`,
            backgroundSize: "cover",
            backgroundPosition: "center 40%",
          }}
        />
        {/* Center: stronger wash for cards; far left stays light so Liberty reads in the margin */}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(243,244,246,0.2)_0%,rgba(243,244,246,0.12)_14%,rgba(243,244,246,0.92)_36%,rgba(243,244,246,0.92)_64%,rgba(243,244,246,0.12)_86%,rgba(243,244,246,0.5)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,transparent_55%,rgba(243,244,246,0.45)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,rgba(28,42,58,0.06),transparent_52%)]" />
        <div className="page-accent-home-extra pointer-events-none absolute inset-0" aria-hidden />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col gap-8 px-5 py-12 pb-24 sm:px-6 sm:py-16">
        <header className="rounded-2xl border border-zinc-200/90 bg-gradient-to-br from-white via-zinc-50/50 to-zinc-100/40 p-6 shadow-md ring-1 ring-zinc-100/80 sm:p-8 sm:px-10">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-zinc-500">
            For all who served — Army, Marine Corps, Navy, Air Force, Coast Guard, Space Force
          </p>
          <h1 className="mt-4 text-balance text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl sm:leading-[1.08]">
            {SITE_NAME}
          </h1>
          <p className="mt-3 max-w-prose text-xl font-medium leading-snug text-zinc-800 sm:text-2xl sm:leading-snug">
            {SITE_HOOK}
          </p>
          <p className="mt-5 max-w-prose text-lg leading-relaxed text-zinc-800 sm:text-xl">
            If this helps even <span className="font-semibold text-zinc-900">one</span> veteran find a clearer next step,
            the work behind it was worth doing.
          </p>

          <div className="mt-6 space-y-4 text-sm leading-relaxed text-zinc-700 sm:text-[0.9375rem]">
            <p>
              <AwarenessBodyText
                text={`You already know how to read orders, deadlines, and taskings. VA and benefits information is spread across many official sites. **${SITE_NAME}** gathers **public** links and phone numbers—locators, topics in plain language—into **one organized place** so you can find what you need without hunting every portal.`}
              />
            </p>
            <p>
              <AwarenessBodyText
                text={`**Important:** **${SITE_NAME}** is **not** VA or a law firm. It does not file claims or represent you before VA—only **education and personal organization tools**. The full limitations statement is at the bottom of this page.`}
              />
            </p>
          </div>

          <div className="mt-8 rounded-xl border border-zinc-200/70 bg-white/60 px-1">
            <MilitarySealsStrip embedded />
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <Link
              href="/start-here"
              className="inline-flex min-h-[3.25rem] items-center justify-center rounded-lg border-2 border-amber-600/85 bg-gradient-to-b from-amber-100 to-amber-200/90 px-5 py-3.5 text-center text-base font-bold uppercase tracking-[0.1em] text-amber-950 shadow-md ring-2 ring-amber-400/35 transition hover:from-amber-200 hover:to-amber-300/90 sm:col-span-2"
            >
              Start here
            </Link>
            <Link
              href="/learn"
              className="inline-flex min-h-[2.75rem] items-center justify-center rounded-lg border border-zinc-200/95 bg-white px-4 py-2.5 text-center text-sm font-medium text-zinc-800 shadow-sm ring-1 ring-zinc-100/90 transition hover:border-zinc-300 hover:bg-zinc-50"
            >
              Learn topics
            </Link>
            <Link
              href="/tools/vet-sheet"
              className="inline-flex min-h-[2.75rem] items-center justify-center rounded-lg border border-zinc-200/95 bg-white px-4 py-2.5 text-center text-sm font-medium text-zinc-800 shadow-sm ring-1 ring-zinc-100/90 transition hover:border-zinc-300 hover:bg-zinc-50"
            >
              Veterans Personal Data
            </Link>
            <Link
              href="/tools/spouse-log/instructions"
              className="inline-flex min-h-[2.75rem] items-center justify-center rounded-lg border border-zinc-200/95 bg-white px-4 py-2.5 text-center text-sm font-medium leading-snug text-zinc-800 shadow-sm ring-1 ring-zinc-100/90 transition hover:border-zinc-300 hover:bg-zinc-50"
            >
              Spouse, partner, or family
            </Link>
            <Link
              href="/va-resources"
              className="inline-flex min-h-[2.75rem] items-center justify-center rounded-lg border border-zinc-200/95 bg-white px-4 py-2.5 text-center text-sm font-medium text-zinc-800 shadow-sm ring-1 ring-zinc-100/90 transition hover:border-zinc-300 hover:bg-zinc-50"
            >
              VA contacts &amp; tools
            </Link>
            <div className="flex justify-center sm:col-span-2">
              <Link
                href="/perks"
                className="inline-flex min-h-[2.75rem] w-full items-center justify-center rounded-lg border border-zinc-200/95 bg-white px-4 py-2.5 text-center text-sm font-medium text-zinc-800 shadow-sm ring-1 ring-zinc-100/90 transition hover:border-zinc-300 hover:bg-zinc-50 sm:w-1/2 sm:max-w-none"
              >
                Perks
              </Link>
            </div>
          </div>
        </header>

        <nav className="flex flex-col gap-6" aria-label="Main sections">
          <LaneSection id="awareness" label="Learn">
            <Link href="/learn" className={bigNavLinkCardClass}>
              <span className="font-semibold text-zinc-900">Topics A–Z</span>
              <span className="mt-1 block text-sm text-zinc-600">
                Time limits, evidence, Community Care, caregivers, VA letters—each article links out to official sources.
              </span>
            </Link>
          </LaneSection>

          <LaneSection id="veterans-personal-data" label="Veterans personal data">
            <Link href="/tools/vet-sheet" className={bigNavLinkCardMutedClass}>
              <span className="font-semibold text-zinc-900">Veteran info sheet</span>
              <span className="mt-1 block text-sm text-zinc-600">
                Sign-in style personal info card stored in your browser on this device.
              </span>
            </Link>
            <Link href="/tools/notes" className={bigNavLinkCardMutedClass}>
              <span className="font-semibold text-zinc-900">Daily Notes</span>
              <span className="mt-1 block text-sm text-zinc-600">
                A simple place to record how the day actually went: mood, sleep, pain spikes, bowel issues,
                shower difficulty, whether meds helped, or anything that felt off.
              </span>
            </Link>
            <Link href="/tools/calendar" className={bigNavLinkCardMutedClass}>
              <span className="font-semibold text-zinc-900">Personal Calendar</span>
              <span className="mt-1 block text-sm text-zinc-600">
                A dedicated calendar for VA and civilian appointments in one place so your household can stay
                aligned on upcoming visits, labs, and follow-ups.
              </span>
            </Link>
            <Link href="/tools/medications" className={bigNavLinkCardMutedClass}>
              <span className="font-semibold text-zinc-900">Medication List</span>
              <span className="mt-1 block text-sm text-zinc-600">
                A complete, current list of every medication you take so appointments are easier and changes are
                easier to track.
              </span>
            </Link>
            <Link href="/tools/printables" className={bigNavLinkCardMutedClass}>
              <span className="font-semibold text-zinc-900">Printables</span>
              <span className="mt-1 block text-sm text-zinc-600">
                Print notes, calendar entries, or medication information when you need a paper copy for visits,
                travel, or home organization.
              </span>
            </Link>
            <div className="rounded-xl border border-zinc-200/90 bg-white px-4 py-4 text-sm text-zinc-700 shadow-sm ring-1 ring-zinc-100/80">
              <p className="font-semibold text-zinc-900">Why These Exist Together</p>
              <p className="mt-1">
                These tools sit in one lane because they support one goal: keeping day-to-day health,
                appointments, and medication information organized so VA visits feel smoother and less stressful.
              </p>
            </div>
          </LaneSection>

          <LaneSection id="spouse-family" label="Spouse topics">
            <Link href="/tools/spouse-log/instructions" className={bigNavLinkCardClass}>
              <span className="font-semibold text-zinc-900">Why this space exists</span>
              <span className="mt-1 block text-sm text-zinc-600">
                Short read for partners and family before using the log
              </span>
            </Link>
            <Link href="/tools/spouse-log" className={bigNavLinkCardClass}>
              <span className="font-semibold text-zinc-900">Private family log</span>
              <span className="mt-1 block text-sm text-zinc-600">
                Sign in · entries private unless you share by email
              </span>
            </Link>
          </LaneSection>

          <LaneSection id="national-va" label="VA Facilities Local &amp; Nationwide">
            <StateVaFacilitiesPicker />
            <Link href="/va-resources" className={bigNavLinkCardClass}>
              <span className="font-semibold text-zinc-900">National VA access &amp; resources</span>
              <span className="mt-1 block text-sm text-zinc-600">
                Official locator, national phone lines, crisis numbers
              </span>
            </Link>
          </LaneSection>

          <LaneSection id="state-veteran-perks" label="Perks &amp; programs">
            <StatePerksPicker />
            <Link href="/perks" className={bigNavLinkCardClass}>
              <span className="font-semibold text-zinc-900">Perks hub</span>
              <span className="mt-1 block text-sm text-zinc-600">National notes and state shortcuts on one page.</span>
            </Link>
          </LaneSection>

          {/* Sentence-case title (not the LaneSection eyebrow) so this block reads like a person, not a filing label */}
          <section className="rounded-2xl border border-zinc-200/90 bg-gradient-to-b from-white to-zinc-50/95 p-5 shadow-sm ring-1 ring-zinc-100/80">
            <h2 className="text-lg font-semibold leading-snug text-zinc-900 sm:text-xl">
              Account sign-in
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-zinc-600">
              Some tools use a simple email and password: one account for the family log and any other sign-in features.
              Open <strong className="font-semibold text-zinc-800">Welcome</strong> for trial details, create account,
              sign in, and invite-a-vet—or use Sign in here if you only need to log in.
            </p>
            <div className="mt-4 flex flex-wrap gap-6 text-sm">
              <Link
                className="font-semibold text-slate-800 underline decoration-slate-300 underline-offset-2"
                href="/login"
              >
                Sign in
              </Link>
              <Link
                className="font-semibold text-slate-800 underline decoration-slate-300 underline-offset-2"
                href="/welcome"
              >
                Welcome &amp; register
              </Link>
            </div>
          </section>
        </nav>

        <EducationalFooter variant="full" />

        <p className="text-center text-sm leading-relaxed text-zinc-500">
          Built to stay clear and steady—here&apos;s to your next step.
        </p>
      </div>
    </div>
  );
}
