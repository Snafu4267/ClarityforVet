import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";

export const runtime = "nodejs";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
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
