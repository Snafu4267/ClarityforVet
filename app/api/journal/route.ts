import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { requireFullSiteAccessResponse } from "@/lib/api-full-site-access";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  const denied = requireFullSiteAccessResponse(session);
  if (denied) return denied;
  if (!session?.user?.id || !session.user.email) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const email = session.user.email.toLowerCase();

  const own = await prisma.journalEntry.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      shares: true,
    },
  });

  const sharedWithMe = await prisma.journalEntry.findMany({
    where: {
      shares: { some: { recipientEmail: email } },
      NOT: { userId: session.user.id },
    },
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { email: true, name: true } },
    },
  });

  return NextResponse.json({ own, sharedWithMe });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const denied = requireFullSiteAccessResponse(session);
  if (denied) return denied;
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  let body: { body?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const text = typeof body.body === "string" ? body.body.trim() : "";
  if (!text) {
    return NextResponse.json({ error: "Entry cannot be empty." }, { status: 400 });
  }

  const entry = await prisma.journalEntry.create({
    data: { userId: session.user.id, body: text },
  });

  return NextResponse.json(entry);
}
