# Billing and Access Mismatch Runbook

## Purpose
- Resolve cases where Stripe billing state and in-app site access disagree.

## Common symptoms
- User paid but still sees restricted access.
- User canceled but still has full access unexpectedly.
- Portal shows active subscription but app does not.

## Quick triage
1. Confirm user account email and internal user id.
2. Check Stripe customer/subscription status for that user.
3. Check DB fields on `User`:
   - `stripeCustomerId`
   - `stripeSubscriptionId`
   - `subscriptionStatus`
   - `createdAt` (trial window)
4. Confirm webhook health if using `/api/stripe/webhook`.

## Recovery options
- Ask signed-in user to complete return path from checkout so `/api/stripe/sync-checkout` runs.
- Run targeted support sync flow (manual API call by operator session if needed).
- If webhook was misconfigured, fix webhook secret and replay missed Stripe events.
- As last resort, patch user billing fields directly in DB with clear audit note.

## Validation after fix
- User session refresh shows expected `siteAccess` (`full` or `restricted`).
- Gated endpoint returns expected status (`200` for full, `403` restricted).
- `/unenroll` and billing portal behavior matches Stripe status.

## Prevention
- Keep webhook configured in production.
- Include one paid-path smoke test in each release check.
