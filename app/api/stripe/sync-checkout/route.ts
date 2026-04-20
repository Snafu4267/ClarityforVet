import { authOptions } from "@/lib/auth";
import { requireSignedInResponse } from "@/lib/api-full-site-access";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";
import { getServerSession } from "next-auth/next";

export const runtime = "nodejs";

/** Links Stripe customer/subscription to the signed-in user after Checkout (no webhook required). */
export async function POST(request: Request) {
  if (!process.env.STRIPE_SECRET_KEY?.trim()) {
    return Response.json({ error: "Stripe is not configured." }, { status: 503 });
  }

  const session = await getServerSession(authOptions);
  const unauthorized = requireSignedInResponse(session);
  if (unauthorized) {
    return Response.json({ error: "Sign in to continue." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const sessionId =
    typeof body === "object" &&
    body !== null &&
    "sessionId" in body &&
    typeof (body as { sessionId: unknown }).sessionId === "string"
      ? (body as { sessionId: string }).sessionId.trim()
      : "";

  if (!sessionId.startsWith("cs_")) {
    return Response.json({ error: "Missing or invalid checkout session id." }, { status: 400 });
  }

  const stripe = getStripe();
  const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["subscription"],
  });

  if (checkoutSession.metadata?.userId !== session.user.id) {
    return Response.json({ error: "This checkout belongs to a different account." }, { status: 403 });
  }

  if (checkoutSession.status !== "complete") {
    return Response.json({ error: "Checkout is not complete yet." }, { status: 409 });
  }

  const customerId =
    typeof checkoutSession.customer === "string"
      ? checkoutSession.customer
      : checkoutSession.customer?.id ?? null;

  if (!customerId) {
    return Response.json({ error: "No customer on this checkout session." }, { status: 422 });
  }

  const subField = checkoutSession.subscription;
  const subId =
    typeof subField === "string"
      ? subField
      : subField && typeof subField === "object" && "id" in subField
        ? (subField as { id: string }).id
        : null;

  let subscriptionStatus = "active";
  if (subId) {
    const sub = await stripe.subscriptions.retrieve(subId);
    subscriptionStatus = sub.status;
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      stripeCustomerId: customerId,
      ...(subId ? { stripeSubscriptionId: subId, subscriptionStatus } : {}),
    },
  });

  return Response.json({ ok: true });
}
