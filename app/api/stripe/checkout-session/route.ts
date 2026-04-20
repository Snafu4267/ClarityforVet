import { authOptions } from "@/lib/auth";
import { requireSignedInEmailResponse } from "@/lib/api-full-site-access";
import { prisma } from "@/lib/prisma";
import { logSecurityEvent } from "@/lib/security-log";
import { appBaseUrl, getStripe } from "@/lib/stripe";
import { getServerSession } from "next-auth/next";

export const runtime = "nodejs";

export async function POST() {
  if (!process.env.STRIPE_SECRET_KEY?.trim()) {
    return Response.json({ error: "Stripe is not configured (missing STRIPE_SECRET_KEY)." }, { status: 503 });
  }
  const priceId = process.env.STRIPE_PRICE_ID?.trim();
  if (!priceId) {
    return Response.json(
      { error: "Subscription is not configured yet (missing STRIPE_PRICE_ID)." },
      { status: 503 },
    );
  }

  const session = await getServerSession(authOptions);
  const unauthorized = requireSignedInEmailResponse(session);
  if (unauthorized) return unauthorized;

  const user = await prisma.user.findUnique({
    where: { id: session!.user!.id },
    select: { id: true, email: true, stripeCustomerId: true },
  });
  if (!user) {
    return Response.json({ error: "Account not found." }, { status: 404 });
  }

  try {
    const stripe = getStripe();
    const base = appBaseUrl();

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      ...(user.stripeCustomerId
        ? { customer: user.stripeCustomerId }
        : { customer_email: user.email }),
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${base}/stripe?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${base}/stripe?checkout=canceled`,
      metadata: { userId: user.id },
      subscription_data: { metadata: { userId: user.id } },
      allow_promotion_codes: true,
    });

    if (!checkoutSession.url) {
      return Response.json({ error: "Could not create checkout session." }, { status: 500 });
    }

    return Response.json({ url: checkoutSession.url });
  } catch (e) {
    logSecurityEvent("stripe.failure", { area: "checkout-session", reason: "exception" }, "error");
    const message =
      typeof e === "object" && e !== null && "message" in e && typeof (e as { message: unknown }).message === "string"
        ? (e as { message: string }).message
        : "Could not start checkout.";
    return Response.json({ error: message }, { status: 500 });
  }
}
