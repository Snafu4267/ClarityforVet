import { authOptions } from "@/lib/auth";
import { requireSignedInResponse } from "@/lib/api-full-site-access";
import { prisma } from "@/lib/prisma";
import { logSecurityEvent } from "@/lib/security-log";
import { appBaseUrl, getStripe } from "@/lib/stripe";
import { getServerSession } from "next-auth/next";

export const runtime = "nodejs";

export async function POST() {
  if (!process.env.STRIPE_SECRET_KEY?.trim()) {
    return Response.json({ error: "Stripe is not configured (missing STRIPE_SECRET_KEY)." }, { status: 503 });
  }
  const session = await getServerSession(authOptions);
  const unauthorized = requireSignedInResponse(session);
  if (unauthorized) return unauthorized;

  const user = await prisma.user.findUnique({
    where: { id: session!.user!.id },
    select: { stripeCustomerId: true },
  });

  if (!user?.stripeCustomerId) {
    return Response.json(
      { error: "No billing profile on file. Subscribe first, or contact support if you believe this is wrong." },
      { status: 400 },
    );
  }

  try {
    const stripe = getStripe();
    const base = appBaseUrl();

    const portal = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${base}/unenroll`,
    });

    if (!portal.url) {
      return Response.json({ error: "Could not open billing portal." }, { status: 500 });
    }

    return Response.json({ url: portal.url });
  } catch {
    logSecurityEvent("stripe.failure", { area: "portal-session", reason: "exception" }, "error");
    return Response.json({ error: "Could not open billing portal." }, { status: 500 });
  }
}
