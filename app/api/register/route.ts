import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { rateLimitResponse } from "@/lib/rate-limit";
import { logSecurityEvent } from "@/lib/security-log";
import { isValidEmailFormat, normalizeEmail } from "@/lib/email-format";

const INVITE_CODE_MAX = 32;

function parseInviteCode(raw: unknown): { ok: true; value: string | null } | { ok: false; message: string } {
  if (raw === undefined || raw === null || raw === "") return { ok: true, value: null };
  if (typeof raw !== "string") return { ok: false, message: "Invalid invite code." };
  const s = raw.replace(/\s/g, "").toUpperCase();
  if (!s) return { ok: true, value: null };
  if (!/^[A-Z0-9]+$/.test(s)) {
    return {
      ok: false,
      message: "Invite code can only use letters and numbers—no spaces or special characters.",
    };
  }
  return { ok: true, value: s.slice(0, INVITE_CODE_MAX) };
}

export async function POST(req: Request) {
  const limited = rateLimitResponse(req, { key: "register", limit: 10, windowMs: 60_000 });
  if (limited) return limited;

  try {
    let body: { email?: string; password?: string; name?: string; inviteCode?: string };
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
    }

    const email = normalizeEmail(body.email);
    const password = typeof body.password === "string" ? body.password : "";
    const name = typeof body.name === "string" ? body.name.trim() : undefined;

    const inviteParsed = parseInviteCode(body.inviteCode);
    if (!inviteParsed.ok) {
      return NextResponse.json({ error: inviteParsed.message }, { status: 400 });
    }
    const referredByCode = inviteParsed.value;

    if (!isValidEmailFormat(email)) {
      return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
    }

    let referrerId: string | null = null;
    if (referredByCode) {
      const referrer = await prisma.user.findUnique({
        where: { inviteCode: referredByCode },
        select: { id: true },
      });
      if (!referrer) {
        return NextResponse.json(
          {
            error:
              "That invite code was not found. Ask your friend to sign in and open Invite a vet (top bar) to copy their code.",
          },
          { status: 400 },
        );
      }
      referrerId = referrer.id;
    }

    const passwordHash = await bcrypt.hash(password, 12);
    await prisma.user.create({
      data: {
        email,
        passwordHash,
        name: name || null,
        referredByCode,
        referrerId,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    logSecurityEvent("register.failure", { reason: "exception" }, "error");
    console.error("register error", e);
    return NextResponse.json(
      {
        error:
          "Could not create the account (server error). If you just updated the app, run `npx prisma db push` and `npx prisma generate` in the project folder, then try again.",
      },
      { status: 500 },
    );
  }
}
