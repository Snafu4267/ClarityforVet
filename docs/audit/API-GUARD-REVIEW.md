# 1. lib/api-full-site-access.ts

```ts
import type { Session } from "next-auth";
import { NextResponse } from "next/server";

/** Returns JSON 401 when there is no signed-in user id on the session. */
export function requireSignedInResponse(session: Session | null): NextResponse | null {
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  return null;
}

/** Returns JSON 401 when signed-in routes also require a known user email. */
export function requireSignedInEmailResponse(session: Session | null): NextResponse | null {
  if (!session?.user?.id || !session.user.email) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  return null;
}

/** Returns a JSON error response if the session cannot use subscriber-only APIs (journal, invite code). */
export function requireFullSiteAccessResponse(session: Session | null): NextResponse | null {
  const unauthorized = requireSignedInResponse(session);
  if (unauthorized) return unauthorized;
  if (session.user.siteAccess !== "full") {
    return NextResponse.json(
      {
        error: "Full site access requires an active subscription or free trial.",
        code: "SITE_ACCESS_RESTRICTED",
      },
      { status: 403 },
    );
  }
  return null;
}
```

# 2. app/api/journal/route.ts

```ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { requireFullSiteAccessResponse, requireSignedInEmailResponse, requireSignedInResponse } from "@/lib/api-full-site-access";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  const unauthorized = requireSignedInEmailResponse(session);
  if (unauthorized) return unauthorized;
  const denied = requireFullSiteAccessResponse(session);
  if (denied) return denied;

  const email = session.user.email.toLowerCase();

  const own = await prisma.journalEntry.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      shares: true,
    },
  });

  const sharedWithMe = await prisma.journalEntry.findMany({
    where: {
      shares: { some: { recipientEmail: email } },
      NOT: { userId: session.user.id },
    },
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { email: true, name: true } },
    },
  });

  return NextResponse.json({ own, sharedWithMe });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const unauthorized = requireSignedInResponse(session);
  if (unauthorized) return unauthorized;
  const denied = requireFullSiteAccessResponse(session);
  if (denied) return denied;

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

  const entry = await prisma.journalEntry.create({
    data: { userId: session.user.id, body: text },
  });

  return NextResponse.json(entry);
}
```

# 3. app/api/journal/[id]/route.ts

```ts
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
  if (!entry || entry.userId !== session.user.id) {
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
  if (!entry || entry.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  await prisma.journalEntry.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
```

# 4. app/api/journal/[id]/share/route.ts

```ts
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

  if (recipientEmail === session.user.email.toLowerCase()) {
    return NextResponse.json({ error: "Use a different email than your own." }, { status: 400 });
  }

  const entry = await prisma.journalEntry.findUnique({ where: { id } });
  if (!entry || entry.userId !== session.user.id) {
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
  const recipientEmail = url.searchParams.get("email")?.toLowerCase().trim();
  if (!recipientEmail) {
    return NextResponse.json({ error: "email query param required." }, { status: 400 });
  }

  const entry = await prisma.journalEntry.findUnique({ where: { id } });
  if (!entry || entry.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  await prisma.entryShare.deleteMany({
    where: { entryId: id, recipientEmail },
  });

  return NextResponse.json({ ok: true });
}
```

# 5. app/api/invite-code/route.ts

```ts
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

  const userId = session.user.id;

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
```

# 6. app/api/stripe/checkout-session/route.ts

```ts
import { authOptions } from "@/lib/auth";
import { requireSignedInEmailResponse } from "@/lib/api-full-site-access";
import { prisma } from "@/lib/prisma";
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
  if (unauthorized) {
    return Response.json({ error: "Sign in to continue." }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
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
    const message =
      typeof e === "object" && e !== null && "message" in e && typeof (e as { message: unknown }).message === "string"
        ? (e as { message: string }).message
        : "Could not start checkout.";
    return Response.json({ error: message }, { status: 500 });
  }
}
```

# 7. app/api/stripe/portal-session/route.ts

```ts
import { authOptions } from "@/lib/auth";
import { requireSignedInResponse } from "@/lib/api-full-site-access";
import { prisma } from "@/lib/prisma";
import { appBaseUrl, getStripe } from "@/lib/stripe";
import { getServerSession } from "next-auth/next";

export const runtime = "nodejs";

export async function POST() {
  if (!process.env.STRIPE_SECRET_KEY?.trim()) {
    return Response.json({ error: "Stripe is not configured (missing STRIPE_SECRET_KEY)." }, { status: 503 });
  }
  const session = await getServerSession(authOptions);
  const unauthorized = requireSignedInResponse(session);
  if (unauthorized) {
    return Response.json({ error: "Sign in to continue." }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { stripeCustomerId: true },
  });

  if (!user?.stripeCustomerId) {
    return Response.json(
      { error: "No billing profile on file. Subscribe first, or contact support if you believe this is wrong." },
      { status: 400 },
    );
  }

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
}
```

# 8. app/api/stripe/subscription/route.ts

```ts
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
```

# 9. app/api/stripe/sync-checkout/route.ts

```ts
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
```
