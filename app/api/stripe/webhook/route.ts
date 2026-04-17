import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";
import type Stripe from "stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!process.env.STRIPE_SECRET_KEY?.trim()) {
    return new Response("Stripe not configured", { status: 503 });
  }
  const whSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
  const sig = request.headers.get("stripe-signature");
  if (!whSecret || !sig) {
    return new Response("Webhook not configured", { status: 400 });
  }

  const buf = await request.text();
  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(buf, sig, whSecret);
  } catch {
    return new Response("Invalid signature", { status: 400 });
  }

  const stripe = getStripe();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;
      const customerId =
        typeof session.customer === "string" ? session.customer : session.customer?.id ?? null;
      const subId =
        typeof session.subscription === "string" ? session.subscription : session.subscription?.id ?? null;
      if (userId && customerId) {
        let status = "active";
        if (subId) {
          const sub = await stripe.subscriptions.retrieve(subId);
          status = sub.status;
        }
        await prisma.user.update({
          where: { id: userId },
          data: {
            stripeCustomerId: customerId,
            ...(subId ? { stripeSubscriptionId: subId, subscriptionStatus: status } : {}),
          },
        });
      }
      break;
    }
    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      const userId = sub.metadata?.userId;
      const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer?.id ?? null;
      const status = event.type === "customer.subscription.deleted" ? "canceled" : sub.status;
      if (userId) {
        await prisma.user.update({
          where: { id: userId },
          data: {
            stripeSubscriptionId: sub.id,
            subscriptionStatus: status,
            ...(customerId ? { stripeCustomerId: customerId } : {}),
          },
        });
      } else if (customerId) {
        await prisma.user.updateMany({
          where: { stripeCustomerId: customerId },
          data: { stripeSubscriptionId: sub.id, subscriptionStatus: status },
        });
      }
      break;
    }
    default:
      break;
  }

  return Response.json({ received: true });
}
