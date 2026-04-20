# Outside Review Bundle

## Scope

P1 security and access-control hardening review package.

## P1 review files

- `docs/audit/P1-SECURITY-SUMMARY.md`
- `docs/audit/API-GUARD-REVIEW.md`
- `docs/audit/API-GUARD-CLEANUP-SUMMARY.md`
- `docs/audit/SMOKE-TEST-CHECKLIST.md`
- `docs/audit/AUTOMATED-MANUAL-CHECKS.md`
- `docs/audit/STRIPE-TEST-SETUP.md`

## Primary code touched for P1/security follow-up

- `lib/rate-limit.ts`
- `lib/security-log.ts`
- `next.config.ts`
- `lib/auth.ts`
- `lib/api-full-site-access.ts`
- `app/api/register/route.ts`
- `app/api/site-feedback/route.ts`
- `app/api/geocode-zip/route.ts`
- `app/api/geocode-address/route.ts`
- `app/api/stripe/checkout-session/route.ts`
- `app/api/stripe/portal-session/route.ts`
- `app/api/stripe/subscription/route.ts`
- `app/api/stripe/sync-checkout/route.ts`
- `app/api/stripe/webhook/route.ts`
- `app/api/journal/route.ts`
- `app/api/journal/[id]/route.ts`
- `app/api/journal/[id]/share/route.ts`
- `app/api/invite-code/route.ts`

## Reviewer checklist

- Security and access control
- Billing and auth flows
- Layout/UX regressions from auth/access changes
- Trust/compliance wording unchanged
- Missing edge cases and nullability regressions

## Known open verification items

- ✅ `npm.cmd run build` passed.
- ✅ `npm.cmd run lint -- --max-warnings=0` passed.
- ✅ `npm.cmd run checks:manual` passed (5/5) with local app server running.
- ✅ Smoke run metadata recorded in `docs/audit/SMOKE-TEST-CHECKLIST.md`.
- Manual confirmation still required: real Stripe checkout/portal/webhook with valid keys.

## Stripe test-mode setup status

- Env example updated for test-only values in `.env.example`:
  - `STRIPE_SECRET_KEY=sk_test_...`
  - `STRIPE_PRICE_ID=price_...`
  - `STRIPE_WEBHOOK_SECRET=whsec_...`
- Setup/runbook added: `docs/audit/STRIPE-TEST-SETUP.md`
- Billing logic unchanged; documentation/setup only.

## Latest verification snapshot

- Build: pass
- Lint: pass
- Automated auth/access/admin checks: pass (5/5)

## Deferrals

- None documented yet for P1; add here if reviewer raises non-critical items to defer.
