import { EducationalFooter } from "@/components/EducationalFooter";
import { PageAccent } from "@/components/PageAccent";
import { PrintPageButton } from "@/components/PrintPageButton";
import { ServiceSubpageFrame } from "@/components/ServiceSubpageFrame";
import { StartHereChecklist } from "@/app/start-here/StartHereChecklist";
import { SITE_NAME } from "@/lib/site";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Start here — first steps with VA care — ${SITE_NAME}`,
  description:
    "How to start with the VA: what to say, what to bring, timing, housing and work, crisis numbers, and a week-by-week checklist until you are in the system.",
};

function Punch({ children }: { children: React.ReactNode }) {
  return <strong className="font-semibold text-stone-900">{children}</strong>;
}

const prose = "text-sm leading-relaxed text-stone-700";
const h2 = "text-xl font-semibold tracking-tight text-stone-900";

export default function StartHerePage() {
  return (
    <ServiceSubpageFrame>
      <PageAccent className="page-accent-learn-overview" />
      <div className="relative z-10 mx-auto flex w-full max-w-xl flex-col gap-10 px-6 py-12 pb-20">
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

        <div id="va-doorway" className="scroll-mt-24 flex flex-col gap-8">
          <section className="flex flex-col gap-3">
            <h1 className={h2}>VA doorway</h1>
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
          </section>

          <section className="flex flex-col gap-3">
            <h2 className={h2}>Your first 30 days at the VA</h2>
            <p className={prose}>
              Your first month is about getting into the system and being seen. <Punch>The VA only knows what you tell them.</Punch>{" "}
              They don&apos;t know your pain levels, your sleep issues, your mental health struggles, or the things
              you&apos;ve been pushing through for years. <Punch>You need to say these things out loud.</Punch> If you
              don&apos;t bring it up, they won&apos;t know to help.
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className={h2}>What you need to gather</h2>
            <p className={prose}>
              <Punch>The VA doesn&apos;t automatically have your civilian medical history.</Punch> They don&apos;t know
              what meds you take unless you tell them. They don&apos;t know which doctors you&apos;ve seen or what
              surgeries you&apos;ve had. Bring your medication list, your doctor info, and any records you have.{" "}
              <Punch>Even a simple list on your phone is enough to get started.</Punch>
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className={h2}>Your first appointments — what to expect</h2>
            <p className={prose}>
              Your first appointment is usually Primary Care or Mental Health Intake. They&apos;ll ask questions about
              your service and your health, <Punch>but they can&apos;t guess what&apos;s going on with you.</Punch> This
              is where you need to be honest about the hard stuff — the pain you ignore, the sleep you don&apos;t get,
              the anxiety you hide, the memories you avoid. <Punch>You&apos;re not complaining.</Punch> You&apos;re
              giving them the information they need to help you.
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className={h2}>Mental health or physical health — either path starts here</h2>
            <p className={prose}>
              Whether your struggle is physical, mental, or both, <Punch>the starting point is the same: tell them what&apos;s happening.</Punch>{" "}
              <Punch>You don&apos;t need to diagnose yourself.</Punch> You just need to describe what you&apos;re dealing
              with in your own words. The VA will route you to the right place.
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className={h2}>The reality of VA timing</h2>
            <p className={prose}>
              <Punch>The VA moves slowly. That&apos;s not your fault.</Punch> Phone calls take forever. Appointments take
              weeks. Referrals take time. <Punch>Staying organized is how you protect yourself.</Punch>{" "}
              <Punch>If you miss appointments or forget follow-ups, the system assumes you don&apos;t need care.</Punch>
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className={h2}>Why reminders matter</h2>
            <p className={prose}>
              <Punch>Memory fails when you&apos;re stressed.</Punch> A calendar, a short note after each call, and a
              running symptom log keep you from losing the thread. <Punch>Track the bad days and the good days</Punch> —
              good days count too. That pattern helps you and your team see what&apos;s really going on.
            </p>
          </section>

          <section className="flex flex-col gap-3 rounded-xl border border-stone-200 bg-red-50/40 px-4 py-4">
            <h2 className={h2}>If you&apos;re in crisis</h2>
            <p className={prose}>
              <Punch>If you might hurt yourself or someone else, call 911.</Punch> You can also call{" "}
              <Punch>988</Punch> and press <Punch>1</Punch> (Veterans Crisis Line), or text <Punch>838255</Punch>.
            </p>
          </section>

          <section className="flex flex-col gap-3 rounded-xl border border-stone-200 bg-stone-50/90 px-4 py-4">
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

          <section className="flex flex-col gap-4 rounded-2xl border-2 border-amber-200/90 bg-gradient-to-b from-amber-50/90 to-white px-5 py-6 shadow-sm ring-1 ring-amber-100/80">
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
