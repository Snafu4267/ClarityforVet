import { EducationalFooter } from "@/components/EducationalFooter";
import { PageAccent } from "@/components/PageAccent";
import { PrintPageButton } from "@/components/PrintPageButton";
import { ServiceSubpageFrame } from "@/components/ServiceSubpageFrame";
import { StartHereChecklist } from "@/app/start-here/StartHereChecklist";
import { authOptions } from "@/lib/auth";
import { SITE_NAME } from "@/lib/site";
import Link from "next/link";
import type { Metadata } from "next";
import { getServerSession } from "next-auth/next";

export const metadata: Metadata = {
  title: `Your journey begins — first steps with VA care — ${SITE_NAME}`,
  description:
    "How to start with the VA: what to say, what to bring, timing, housing and work, crisis numbers, and a week-by-week checklist until you are in the system.",
};

function Punch({ children }: { children: React.ReactNode }) {
  return <strong className="font-semibold text-stone-900">{children}</strong>;
}

const prose = "text-sm leading-relaxed text-stone-700";
const h1 = "text-2xl font-semibold tracking-tight text-stone-900 sm:text-[1.75rem]";
const h2 = "text-xl font-semibold tracking-tight text-stone-900";

export default async function StartHerePage() {
  const session = await getServerSession(authOptions);
  const isSignedIn = Boolean(session?.user?.id);

  return (
    <ServiceSubpageFrame>
      <PageAccent className="page-accent-learn-overview" />
      <div className="relative z-10 mx-auto flex w-full max-w-none flex-col gap-10 px-6 py-12 pb-20">
        <header className="flex flex-col gap-4 no-print">
          <p className="text-sm text-stone-500">
            <Link href="/" className="font-medium text-slate-800 underline decoration-stone-300 underline-offset-2">
              Home
            </Link>
            {" · "}
            <Link href="/learn" className="font-medium text-slate-800 underline decoration-stone-300 underline-offset-2">
              Learn topics
            </Link>
            {" · "}
            <Link href="/va-resources" className="font-medium text-slate-800 underline decoration-stone-300 underline-offset-2">
              VA contacts
            </Link>
          </p>
          <div className="flex flex-wrap items-center justify-end gap-3">
            <PrintPageButton />
          </div>
          <p className="text-xs text-stone-500">
            Care-start guidance only. {SITE_NAME} is not VA. Not legal or medical advice.
          </p>
        </header>

        {!isSignedIn ? (
          <section className="rounded-xl border-2 border-amber-300/90 bg-gradient-to-b from-amber-100/90 to-amber-50 px-5 py-4 shadow-sm ring-1 ring-amber-200/80">
            <p className="text-sm font-semibold text-amber-950">Ready to open the full app?</p>
            <p className="mt-1 text-sm leading-relaxed text-amber-900">
              Registration matters because it unlocks the full Clarity4Vets experience and lets us keep your progress
              organized in one place. We do not want you adding a credit card (Nothing annoys me more than this) if you
              do not believe this will help your
              journey. Register first and open the full site with a 10-day trial. Give it 10 days, explore the tools,
              and use the knowledge the Clarity4Vets team has put together in one place for veterans, then decide.
            </p>
            <div className="mt-3 flex flex-wrap gap-3">
              <Link
                href="/register"
                className="inline-flex min-h-11 items-center justify-center rounded-lg bg-amber-900 px-4 py-2.5 text-sm font-semibold text-amber-50 shadow-sm transition hover:bg-amber-950"
              >
                Register here - open full app
              </Link>
            </div>
          </section>
        ) : null}

        <div className="flex flex-col gap-8">
          <section id="va-doorway" className="scroll-mt-24 flex flex-col gap-3">
            <h1 className={h1}>VA doorway</h1>
            <p className={prose}>
              Hey. You made it. If you&apos;re here, it means you&apos;re finally stepping toward the VA — maybe for the
              first time, maybe after years of putting it off. <Punch>Every one of us started right where you are:</Punch>{" "}
              standing at the doorway with no map and no idea what comes next.
            </p>
            <p className={prose}>
              People say &quot;Go to the VA,&quot; but nobody explains how. <Punch>This is your starting point.</Punch>{" "}
              Whether you&apos;re dealing with physical pain, mental health struggles, old injuries, or new symptoms,{" "}
              <Punch>this is where you take your first real step.</Punch>
            </p>
            <p className={prose}>
              Your first step is going to a VA facility — <Punch>it doesn&apos;t matter which one.</Punch> Walk in. Tell one
              of the helpful folks behind the counter that this is your first time and you need to see someone about{" "}
              <Punch>getting enrolled in the VA.</Punch>
            </p>
          </section>

          <section id="first-30-days" className="scroll-mt-24 flex flex-col gap-3">
            <h2 className={h2}>Your first 30 days at the VA</h2>
            <p className={prose}>
              Your first month is about getting into the system and being seen. <Punch>The VA only knows what you tell them.</Punch>{" "}
              They don&apos;t know your pain levels, your sleep issues, your mental health struggles, or the things
              you&apos;ve been pushing through for years. <Punch>You need to say these things out loud.</Punch> If you
              don&apos;t bring it up, they won&apos;t know to help.
            </p>
            <div className={`${prose} rounded-lg border border-stone-200 bg-white/80 px-4 py-3`}>
              <p className="font-medium text-stone-800">30-day focus plan</p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li><Punch>Week 1:</Punch> get enrolled, confirm contact info, book first appointment.</li>
                <li><Punch>Week 2:</Punch> start symptom notes and list your top 3 health concerns.</li>
                <li><Punch>Week 3:</Punch> follow up on referrals, labs, meds, and next appointment dates.</li>
                <li><Punch>Week 4:</Punch> verify what is still pending and who owns each next step.</li>
              </ul>
            </div>
          </section>

          <section id="what-to-gather" className="scroll-mt-24 flex flex-col gap-3">
            <h2 className={h2}>What you need to gather</h2>
            <p className={prose}>
              <Punch>The VA doesn&apos;t automatically have your civilian medical history.</Punch> They don&apos;t know
              what meds you take unless you tell them. They don&apos;t know which doctors you&apos;ve seen or what
              surgeries you&apos;ve had. Bring your medication list, your doctor info, and any records you have.{" "}
              <Punch>Even a simple list on your phone is enough to get started.</Punch>
            </p>
            <div className={`${prose} rounded-lg border border-stone-200 bg-white/80 px-4 py-3`}>
              <p className="font-medium text-stone-800">Bring this starter packet</p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>Current meds (name, dose, how often, and what side effects you notice).</li>
                <li>Civilian doctors/clinics you used in the last 2-3 years.</li>
                <li>Major diagnoses, surgeries, ER visits, and recent test results if you have them.</li>
                <li>Emergency contact and the best phone/email to reach you.</li>
              </ul>
            </div>
          </section>

          <section id="first-appointments" className="scroll-mt-24 flex flex-col gap-3">
            <h2 className={h2}>Your first appointments — what to expect</h2>
            <p className={prose}>
              Your first appointment is usually Primary Care or Mental Health Intake. They&apos;ll ask questions about
              your service and your health, <Punch>but they can&apos;t guess what&apos;s going on with you.</Punch> This
              is where you need to be honest about the hard stuff — the pain you ignore, the sleep you don&apos;t get,
              the anxiety you hide, the memories you avoid. <Punch>You&apos;re not complaining.</Punch> You&apos;re
              giving them the information they need to help you.
            </p>
            <div className={`${prose} rounded-lg border border-stone-200 bg-white/80 px-4 py-3`}>
              <p className="font-medium text-stone-800">Simple script you can use</p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>&quot;My top 3 issues right now are ____ , ____ , and ____ .&quot;</li>
                <li>&quot;This is affecting sleep/work/relationships in these ways: ____ .&quot;</li>
                <li>&quot;What is our plan after this visit, and when should I follow up?&quot;</li>
                <li>&quot;Who do I call if this gets worse before my next appointment?&quot;</li>
              </ul>
            </div>
          </section>

          <section id="mental-or-physical" className="scroll-mt-24 flex flex-col gap-3">
            <h2 className={h2}>Mental health or physical health — either path starts here</h2>
            <p className={prose}>
              Whether your struggle is physical, mental, or both, <Punch>the starting point is the same: tell them what&apos;s happening.</Punch>{" "}
              <Punch>You don&apos;t need to diagnose yourself.</Punch> You just need to describe what you&apos;re dealing
              with in your own words. The VA will route you to the right place.
            </p>
            <div className={`${prose} rounded-lg border border-stone-200 bg-white/80 px-4 py-3`}>
              <p className="font-medium text-stone-800">How to describe symptoms clearly</p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li><Punch>When:</Punch> how often it happens and when it started.</li>
                <li><Punch>Severity:</Punch> how bad it gets on your worst days.</li>
                <li><Punch>Impact:</Punch> what it stops you from doing in daily life.</li>
                <li><Punch>Pattern:</Punch> what makes it better or worse.</li>
              </ul>
            </div>
          </section>

          <section id="va-timing" className="scroll-mt-24 flex flex-col gap-3">
            <h2 className={h2}>The reality of VA timing</h2>
            <p className={prose}>
              <Punch>The VA moves slowly. That&apos;s not your fault.</Punch> Phone calls take forever. Appointments take
              weeks. Referrals take time. The rulebook itself is huge: Title 38 CFR is roughly{" "}
              <Punch>2,194 pages</Punch> and about <Punch>1.38 million words</Punch>. That is exactly why we built this
              site to make the search for answers easier, clearer, and faster for veterans and families.{" "}
              <Punch>Staying organized is how you protect yourself.</Punch> <Punch>If you miss appointments or forget
              follow-ups, the system assumes you don&apos;t need care.</Punch>
            </p>
            <div className={`${prose} rounded-lg border border-stone-200 bg-white/80 px-4 py-3`}>
              <p className="font-medium text-stone-800">Protect yourself from delays</p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>After every call, write down date, time, person, and what was promised.</li>
                <li>Set reminders 48 hours before appointments and again the morning of.</li>
                <li>If you do not hear back, call again and ask for the status by name.</li>
                <li>Keep one running list: pending referrals, pending labs, pending callbacks.</li>
              </ul>
            </div>
          </section>

          <section id="reminders" className="scroll-mt-24 flex flex-col gap-3">
            <h2 className={h2}>Why reminders matter</h2>
            <p className={prose}>
              <Punch>Memory fails when you&apos;re stressed.</Punch> A calendar, a short note after each call, and a
              running symptom log keep you from losing the thread. <Punch>Track the bad days and the good days</Punch> —
              good days count too. That pattern helps you and your team see what&apos;s really going on.
            </p>
            <div className={`${prose} rounded-lg border border-stone-200 bg-white/80 px-4 py-3`}>
              <p className="font-medium text-stone-800">Minimum reminder system</p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>Calendar for appointments and deadlines.</li>
                <li>Daily note for symptoms, sleep, and side effects.</li>
                <li>One checklist for open tasks and follow-ups.</li>
              </ul>
            </div>
          </section>

          <section
            id="crisis"
            className="scroll-mt-24 flex flex-col gap-3 rounded-xl border border-stone-200 bg-red-50/40 px-4 py-4"
          >
            <h2 className={h2}>If you&apos;re in crisis</h2>
            <p className={prose}>
              If you need care fast, VA offers urgent care at VA facilities and <Punch>in-network</Punch> community
              urgent care clinics for minor, non-emergency issues. Ask your local VA office what options are available
              to you in your area.
            </p>
            <p className={prose}>
              <Punch>If you might hurt yourself or someone else, call 911.</Punch> You can also call{" "}
              <Punch>988</Punch> and press <Punch>1</Punch> (Veterans Crisis Line), or text <Punch>838255</Punch>.
            </p>
          </section>

          <section
            id="housing-work"
            className="scroll-mt-24 flex flex-col gap-3 rounded-xl border border-stone-200 bg-stone-50/90 px-4 py-4"
          >
            <h2 className={h2}>If you don&apos;t have stable housing or a steady income</h2>
            <p className={prose}>
              <Punch>Not having an address or a job does not disqualify you from care.</Punch> VA and community partners
              have lanes for housing help, employment help, and getting seen even when life is chaotic.{" "}
              <Punch>The trap is staying silent</Punch> — if they don&apos;t know you&apos;re couch-surfing, in a shelter,
              sleeping in a car, or out of work, they can&apos;t point you at the right door.
            </p>
            <p className={prose}>
              <Punch>Say it plainly at enrollment and at your first visit:</Punch> &quot;I don&apos;t have stable
              housing&quot; / &quot;I&apos;m unemployed&quot; / &quot;I&apos;m at risk of losing housing.&quot;{" "}
              <Punch>You are not asking for a handout. You are stating facts so the system can respond.</Punch>
            </p>
            <div className={prose}>
              <p className="font-medium text-stone-800">Housing — starting moves</p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>Ask: &quot;Who handles housing and homeless services here?&quot; (names, numbers, walk-in hours.)</li>
                <li>Ask: &quot;Is there a social worker or case management for veterans without stable housing?&quot;</li>
                <li>
                  If you have no phone or mail, ask how they contact you and where to check in so you don&apos;t fall
                  through the cracks.
                </li>
              </ul>
            </div>
            <div className={prose}>
              <p className="font-medium text-stone-800">Unemployment — starting moves</p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>
                  Ask: &quot;What help exists for work, training, or benefits while I&apos;m not working?&quot; (VR&amp;E,
                  vocational services, referrals — whatever your facility uses.)
                </li>
                <li>Say what you can do (hours, physical limits, transportation) so referrals fit reality.</li>
                <li>
                  <Punch>No job does not mean no care</Punch> — still book Primary Care / Mental Health; health and
                  stability often move together.
                </li>
              </ul>
            </div>
          </section>

          <section
            id="start-here-checklist"
            className="scroll-mt-24 flex flex-col gap-4 rounded-2xl border-2 border-amber-200/90 bg-gradient-to-b from-amber-50/90 to-white px-5 py-6 shadow-sm ring-1 ring-amber-100/80"
          >
            <h2 className={`${h2} text-amber-950`}>Start Here checklist</h2>
            <p className="text-sm leading-relaxed text-stone-600">
              Keep this simple: complete these five steps and your progress stays saved on this device.
            </p>
            <StartHereChecklist />
          </section>
        </div>

        <EducationalFooter variant="compact" />
      </div>
    </ServiceSubpageFrame>
  );
}
