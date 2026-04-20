import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { requireFullSiteAccessResponse, requireSignedInEmailResponse, requireSignedInResponse } from "@/lib/api-full-site-access";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(req: Request, ctx: Ctx) {
  const session = await getServerSession(authOptions);
  const unauthorized = requireSignedInEmailResponse(session);
  if (unauthorized) return unauthorized;
  const denied = requireFullSiteAccessResponse(session);
  if (denied) return denied;

  const { id } = await ctx.params;

  let body: { recipientEmail?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const recipientEmail =
    typeof body.recipientEmail === "string" ? body.recipientEmail.toLowerCase().trim() : "";
  if (!recipientEmail || !recipientEmail.includes("@")) {
    return NextResponse.json({ error: "Valid recipient email required." }, { status: 400 });
  }

  if (recipientEmail === session!.user!.email!.toLowerCase()) {
    return NextResponse.json({ error: "Use a different email than your own." }, { status: 400 });
  }

  const entry = await prisma.journalEntry.findUnique({ where: { id } });
  if (!entry || entry.userId !== session!.user!.id) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  await prisma.entryShare.upsert({
    where: {
      entryId_recipientEmail: { entryId: id, recipientEmail },
    },
    create: { entryId: id, recipientEmail },
    update: {},
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request, ctx: Ctx) {
  const session = await getServerSession(authOptions);
  const unauthorized = requireSignedInResponse(session);
  if (unauthorized) return unauthorized;
  const denied = requireFullSiteAccessResponse(session);
  if (denied) return denied;

  const { id } = await ctx.params;

  const url = new URL(req.url);
  const recipientEmail = (url.searchParams.get("email") ?? "").toLowerCase().trim();
  if (!recipientEmail || !recipientEmail.includes("@")) {
    return NextResponse.json({ error: "Valid email query param required." }, { status: 400 });
  }

  const entry = await prisma.journalEntry.findUnique({ where: { id } });
  if (!entry || entry.userId !== session!.user!.id) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  await prisma.entryShare.deleteMany({
    where: { entryId: id, recipientEmail },
  });

  return NextResponse.json({ ok: true });
}
