import { requireFullSiteAccessResponse, requireSignedInResponse } from "@/lib/api-full-site-access";
import { authOptions } from "@/lib/auth";
import { generateInviteCodeCandidate } from "@/lib/invite-code";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { getServerSession } from "next-auth/next";

const MAX_ATTEMPTS = 30;

export async function GET() {
  const session = await getServerSession(authOptions);
  const unauthorized = requireSignedInResponse(session);
  if (unauthorized) return unauthorized;
  const denied = requireFullSiteAccessResponse(session);
  if (denied) return denied;

  const userId = session!.user!.id;

  const existing = await prisma.user.findUnique({
    where: { id: userId },
    select: { inviteCode: true },
  });
  if (existing?.inviteCode) {
    return Response.json({ inviteCode: existing.inviteCode });
  }

  for (let i = 0; i < MAX_ATTEMPTS; i++) {
    const code = generateInviteCodeCandidate();
    try {
      const updated = await prisma.user.update({
        where: { id: userId },
        data: { inviteCode: code },
        select: { inviteCode: true },
      });
      if (updated.inviteCode) {
        return Response.json({ inviteCode: updated.inviteCode });
      }
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
        continue;
      }
      throw e;
    }
  }

  return Response.json({ error: "Could not create a unique invite code. Try again." }, { status: 500 });
}
