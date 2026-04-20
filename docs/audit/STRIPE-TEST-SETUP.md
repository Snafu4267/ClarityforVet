# Stripe Test Setup (Test Mode Only)

## Required env vars (test only)

Set these in your runtime env (`.env.local` for local, test env vars for deployed test):

- `STRIPE_SECRET_KEY=sk_test_...`
- `STRIPE_PRICE_ID=price_...`
- `STRIPE_WEBHOOK_SECRET=whsec_...`

Do not use any `sk_live_` key in this setup.

## Verify app is using test keys

- Confirm `STRIPE_SECRET_KEY` starts with `sk_test_`.
- Confirm `STRIPE_PRICE_ID` is from a Test mode recurring price in Stripe.
- Confirm `STRIPE_WEBHOOK_SECRET` starts with `whsec_` from the Test mode webhook endpoint.

## Webhook URL (deployed test env)

- `https://YOUR-TEST-URL/api/stripe/webhook`

## Stripe dashboard steps (exact order)

1. Open Stripe Dashboard.
2. Turn on **Test mode** (top-right toggle).
3. Go to **Product catalog** (or Products) and create/select a product.
4. Add/select a **recurring monthly** price and copy the `price_...` id.
5. Go to **Developers -> API keys** and copy the **Secret key** (`sk_test_...`).
6. Go to **Developers -> Webhooks** and add endpoint:
   - `https://YOUR-TEST-URL/api/stripe/webhook`
7. Select events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
8. Save endpoint and copy signing secret (`whsec_...`).
9. Set env vars in test env and redeploy/restart test app.

## Test card flow

Use Stripe test card:

- Card number: `4242 4242 4242 4242`
- Expiry: any future date
- CVC: any 3 digits
- ZIP/postcode: any value

## App test steps (local or deployed test env)

1. Sign in with a test user.
2. Trigger checkout (`/api/stripe/checkout-session`) from app billing flow.
3. Complete Stripe Checkout with test card.
4. Return to app success path.
5. Open billing portal flow (`/api/stripe/portal-session`) and confirm portal opens.
6. Check subscription endpoint (`/api/stripe/subscription`) and confirm expected status.
7. Trigger a test webhook event from Stripe and confirm sync behavior.

## Expected behavior

- `/api/stripe/checkout-session`: returns `200` with checkout URL for signed-in user.
- `/api/stripe/portal-session`: returns `200` with portal URL when billing profile exists.
- `/api/stripe/subscription`: returns subscription status payload for signed-in user.
- `/api/stripe/webhook`: returns success on valid signature and updates subscription fields.

## Still manual

- Real end-to-end webhook delivery validation in deployed test env.
- Manual confirmation of Stripe portal actions (cancel/reactivate) reflected in app.
