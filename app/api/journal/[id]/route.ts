import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { requireFullSiteAccessResponse, requireSignedInResponse } from "@/lib/api-full-site-access";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, ctx: Ctx) {
  const session = await getServerSession(authOptions);
  const unauthorized = requireSignedInResponse(session);
  if (unauthorized) return unauthorized;
  const denied = requireFullSiteAccessResponse(session);
  if (denied) return denied;

  const { id } = await ctx.params;

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

  const entry = await prisma.journalEntry.findUnique({ where: { id } });
  if (!entry || entry.userId !== session!.user!.id) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  const updated = await prisma.journalEntry.update({
    where: { id },
    data: { body: text },
  });

  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const session = await getServerSession(authOptions);
  const unauthorized = requireSignedInResponse(session);
  if (unauthorized) return unauthorized;
  const denied = requireFullSiteAccessResponse(session);
  if (denied) return denied;

  const { id } = await ctx.params;

  const entry = await prisma.journalEntry.findUnique({ where: { id } });
  if (!entry || entry.userId !== session!.user!.id) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  await prisma.journalEntry.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
