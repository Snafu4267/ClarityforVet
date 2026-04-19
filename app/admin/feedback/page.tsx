import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

export const metadata = {
  title: "Feedback log",
  robots: { index: false, follow: false },
};

export default async function AdminFeedbackPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/admin/feedback");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { isAdmin: true },
  });
  if (!user?.isAdmin) {
    notFound();
  }

  const rows = await prisma.siteFeedback.findMany({
    orderBy: { createdAt: "desc" },
    take: 300,
    include: { user: { select: { email: true } } },
  });

  return (
    <div className="mx-auto w-full max-w-4xl px-5 py-10">
      <p className="text-sm text-stone-600">
        <Link href="/" className="font-medium text-stone-800 underline">
          Home
        </Link>
      </p>
      <h1 className="mt-4 text-2xl font-semibold text-stone-900">Site feedback (private)</h1>
      <p className="mt-2 text-sm text-stone-600">Newest first. Only admin accounts can read this page.</p>

      {rows.length === 0 ? (
        <p className="mt-8 text-sm text-stone-600">No entries yet.</p>
      ) : (
        <ul className="mt-8 space-y-4">
          {rows.map((row) => (
            <li
              key={row.id}
              className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm ring-1 ring-stone-100/80"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="text-sm font-semibold text-stone-900">
                  {row.rating} / 5 <span className="text-amber-600">★</span>
                </p>
                <time className="text-xs text-stone-500" dateTime={row.createdAt.toISOString()}>
                  {row.createdAt.toLocaleString()}
                </time>
              </div>
              <p className="mt-2 whitespace-pre-wrap text-sm text-stone-800">{row.comment}</p>
              <p className="mt-2 text-xs text-stone-500">
                {row.user?.email ? `User: ${row.user.email}` : "Anonymous (not signed in)"}
                {row.pagePath ? ` · Page: ${row.pagePath}` : ""}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
