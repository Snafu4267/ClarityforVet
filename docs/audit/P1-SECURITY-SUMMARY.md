# P1 Security Summary

## Files changed

- `lib/rate-limit.ts`
- `lib/security-log.ts`
- `app/api/register/route.ts`
- `app/api/site-feedback/route.ts`
- `app/api/geocode-zip/route.ts`
- `app/api/geocode-address/route.ts`
- `next.config.ts`
- `lib/auth.ts`
- `lib/api-full-site-access.ts`
- `app/api/stripe/checkout-session/route.ts`
- `app/api/stripe/portal-session/route.ts`
- `app/api/stripe/sync-checkout/route.ts`
- `app/api/stripe/webhook/route.ts`

## Exact protections added

- Added a lightweight in-memory fixed-window rate limiter (`lib/rate-limit.ts`) with per-IP buckets and `429` + `Retry-After` responses.
- Applied endpoint-specific rate limits:
  - `/api/register`: 10 requests / 60 seconds per IP
  - `/api/site-feedback`: 20 requests / 10 minutes per IP
  - `/api/geocode-zip`: 30 requests / 60 seconds per IP
  - `/api/geocode-address`: 20 requests / 60 seconds per IP
- Added baseline security response headers for all routes in `next.config.ts`:
  - `Content-Security-Policy` (baseline CSP)
  - `X-Frame-Options: DENY`
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy: camera=(), microphone=(), geolocation=()`
  - `poweredByHeader: false`
- Added lightweight security logging hook (`lib/security-log.ts`) and integrated logging points for:
  - Auth failures (`lib/auth.ts`)
  - Access denied (`lib/api-full-site-access.ts`)
  - Stripe failures (`app/api/stripe/checkout-session/route.ts`, `app/api/stripe/portal-session/route.ts`, `app/api/stripe/sync-checkout/route.ts`)
  - Stripe webhook failures (`app/api/stripe/webhook/route.ts`)

## Still left for later

- Current rate limiting is process-local memory only (not shared across multiple instances/containers).
- CSP is intentionally baseline/permissive for compatibility; it is not yet tightened with nonce/hash-based script controls.
- Security logs currently go to stdout/stderr only; no external alerting/aggregation pipeline is configured.
- No distributed abuse protections (WAF/CDN rules, bot scoring, IP reputation) were added in this pass.

## Current verification status

- `npm.cmd run build`: pass
- `npm.cmd run lint -- --max-warnings=0`: pass
- `npm.cmd run checks:manual`: pass (5/5)
- Remaining manual-only validation: real Stripe checkout/portal/webhook flow with valid Stripe keys.
