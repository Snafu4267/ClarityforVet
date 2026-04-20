import { authOptions } from "@/lib/auth";
import { requireSignedInResponse } from "@/lib/api-full-site-access";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";

export const runtime = "nodejs";

export async function GET() {
  const session = await getServerSession(authOptions);
  const unauthorized = requireSignedInResponse(session);
  if (unauthorized) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { subscriptionStatus: true, stripeCustomerId: true, stripeSubscriptionId: true },
  });

  return Response.json({
    subscriptionStatus: user?.subscriptionStatus ?? "none",
    hasBillingProfile: Boolean(user?.stripeCustomerId),
    hasSubscriptionId: Boolean(user?.stripeSubscriptionId),
  });
}
