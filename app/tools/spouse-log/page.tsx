"use client";

import { EducationalFooter } from "@/components/EducationalFooter";
import { PageAccent } from "@/components/PageAccent";
import { ServiceSubpageFrame } from "@/components/ServiceSubpageFrame";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";

type Share = { id: string; recipientEmail: string; createdAt: string };
type Entry = {
  id: string;
  body: string;
  createdAt: string;
  updatedAt: string;
  shares?: Share[];
  user?: { email: string | null; name: string | null };
};

function formatDateTime(value: string) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function SpouseLogPage() {
  const { data: session, status } = useSession();
  const [own, setOwn] = useState<Entry[]>([]);
  const [sharedWithMe, setSharedWithMe] = useState<Entry[]>([]);
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shareEmail, setShareEmail] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    setError(null);
    const res = await fetch("/api/journal");
    if (!res.ok) {
      setError("Could not load entries.");
      setLoading(false);
      return;
    }
    const data = (await res.json()) as { own: Entry[]; sharedWithMe: Entry[] };
    setOwn(data.own);
    setSharedWithMe(data.sharedWithMe);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (status !== "authenticated") return;
    const timer = setTimeout(() => {
      void load();
    }, 0);
    return () => clearTimeout(timer);
  }, [status, load]);

  async function createEntry(e: React.FormEvent) {
    e.preventDefault();
    const text = body.trim();
    if (!text) return;
    setError(null);
    const res = await fetch("/api/journal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: text }),
    });
    if (!res.ok) {
      setError("Could not save entry.");
      return;
    }
    setBody("");
    await load();
  }

  async function shareEntry(entryId: string) {
    const recipientEmail = (shareEmail[entryId] || "").trim().toLowerCase();
    if (!recipientEmail) return;
    setError(null);
    const res = await fetch(`/api/journal/${entryId}/share`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recipientEmail }),
    });
    if (!res.ok) {
      const j = (await res.json()) as { error?: string };
      setError(j.error ?? "Could not share.");
      return;
    }
    setShareEmail((prev) => ({ ...prev, [entryId]: "" }));
    await load();
  }

  async function deleteEntry(id: string) {
    if (!confirm("Delete this entry?")) return;
    setError(null);
    await fetch(`/api/journal/${id}`, { method: "DELETE" });
    await load();
  }

  if (status === "loading" || (status === "authenticated" && loading)) {
    return (
      <ServiceSubpageFrame>
        <PageAccent className="page-accent-spouse-log" />
        <div className="relative z-10 mx-auto max-w-xl px-6 py-16 text-sm text-stone-600">
          Loading…
        </div>
      </ServiceSubpageFrame>
    );
  }

  if (status === "unauthenticated") {
    return (
      <ServiceSubpageFrame>
        <PageAccent className="page-accent-spouse-log" />
        <div className="relative z-10 mx-auto flex max-w-xl flex-col gap-6 px-6 py-16">
        <p className="text-sm text-stone-600">Sign in to use the private log.</p>
        <Link
          href="/login?callbackUrl=/tools/spouse-log"
          className="rounded-md bg-stone-900 px-4 py-3 text-center text-sm font-medium text-white"
        >
          Sign in
        </Link>
        <Link href="/welcome" className="text-center text-sm text-blue-800 underline">
          Create an account
        </Link>
        </div>
      </ServiceSubpageFrame>
    );
  }

  return (
    <ServiceSubpageFrame>
      <PageAccent className="page-accent-spouse-log" />
      <div className="relative z-10 mx-auto flex w-full max-w-xl flex-col gap-10 px-6 py-12">
      <header className="flex flex-col gap-3">
        <div className="flex flex-wrap justify-end">
          <button
            type="button"
            className="text-sm text-stone-600 underline"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            Sign out
          </button>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-stone-900">Private family log</h1>
        <p className="text-sm text-stone-600">
          Entries are private to your account unless you share one with another person&apos;s email.
          They must register and sign in with that email to read shared entries. Not legal or medical
          advice.{" "}
          <Link href="/tools/spouse-log/instructions" className="font-medium text-slate-800 underline">
            Why this space exists
          </Link>
        </p>
        {session?.user?.email ? (
          <p className="text-xs text-stone-500">Signed in as {session.user.email}</p>
        ) : null}
      </header>

      {error ? <p className="text-sm text-red-700">{error}</p> : null}

      <form className="flex flex-col gap-3" onSubmit={createEntry}>
        <label className="text-sm font-medium text-stone-800">New entry</label>
        <textarea
          className="min-h-[120px] rounded-md border border-stone-300 px-3 py-2 text-sm text-stone-800"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Write what you need to remember—only you can see it until you share."
        />
        <button
          type="submit"
          className="self-start rounded-md bg-stone-800 px-4 py-2 text-sm font-medium text-white hover:bg-stone-900"
        >
          Save entry
        </button>
      </form>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-medium text-stone-900">Your entries</h2>
        {own.length === 0 ? (
          <p className="text-sm text-stone-500">No entries yet.</p>
        ) : (
          <ul className="flex flex-col gap-6">
            {own.map((en) => (
              <li key={en.id} className="rounded-lg border border-stone-200 bg-stone-50/80 px-4 py-4">
                <p className="whitespace-pre-wrap text-sm text-stone-800">{en.body}</p>
                <p className="mt-2 text-xs text-stone-500">Created: {formatDateTime(en.createdAt)}</p>
                {en.updatedAt !== en.createdAt ? (
                  <p className="mt-1 text-xs text-stone-500">Updated: {formatDateTime(en.updatedAt)}</p>
                ) : null}
                <div className="mt-4 flex flex-col gap-2 border-t border-stone-200 pt-4">
                  <p className="text-xs font-medium text-stone-600">Share with email (entry-by-entry)</p>
                  <div className="flex flex-wrap gap-2">
                    <input
                      type="email"
                      placeholder="spouse@example.com"
                      className="min-w-[200px] flex-1 rounded-md border border-stone-300 px-2 py-1 text-sm"
                      value={shareEmail[en.id] ?? ""}
                      onChange={(e) =>
                        setShareEmail((prev) => ({ ...prev, [en.id]: e.target.value }))
                      }
                    />
                    <button
                      type="button"
                      className="rounded-md border border-stone-300 bg-white px-3 py-1 text-sm"
                      onClick={() => void shareEntry(en.id)}
                    >
                      Share
                    </button>
                  </div>
                  {en.shares && en.shares.length > 0 ? (
                    <ul className="text-xs text-stone-600">
                      Shared with: {en.shares.map((s) => s.recipientEmail).join(", ")}
                    </ul>
                  ) : null}
                </div>
                <button
                  type="button"
                  className="mt-3 text-sm text-red-700 underline"
                  onClick={() => void deleteEntry(en.id)}
                >
                  Delete entry
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-medium text-stone-900">Shared with you</h2>
        {sharedWithMe.length === 0 ? (
          <p className="text-sm text-stone-500">Nothing shared with your email yet.</p>
        ) : (
          <ul className="flex flex-col gap-4">
            {sharedWithMe.map((en) => (
              <li key={en.id} className="rounded-lg border border-emerald-200/80 bg-emerald-50/40 px-4 py-4">
                <p className="text-xs text-stone-600">
                  From {en.user?.name || en.user?.email || "another account"}
                </p>
                <p className="mt-2 whitespace-pre-wrap text-sm text-stone-800">{en.body}</p>
                <p className="mt-2 text-xs text-stone-500">Created: {formatDateTime(en.createdAt)}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <EducationalFooter variant="compact" />
      </div>
    </ServiceSubpageFrame>
  );
}
