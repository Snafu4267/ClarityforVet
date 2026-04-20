# Hardening and Layout Summary (P0 Local Changes)

## What changed

### Startup hardening
- Removed schema mutation from normal container boot.
  - `Dockerfile`: runtime command now starts app only (`node server.js`).
- Added explicit DB sync command:
  - `package.json`: `db:push` script.
- Updated docs/env comments to reflect explicit one-off DB sync:
  - `.env.example`
  - `README.md`
  - `docs/GO-LIVE-PLAN.md`
  - `docs/PRE-LAUNCH-GREEN-LIGHT-CHECKUP.md`

### Access-control consistency
- Added compact shared auth guard helpers:
  - `lib/api-full-site-access.ts`
    - `requireSignedInResponse`
    - `requireSignedInEmailResponse`
- Standardized private/auth API checks using shared helpers:
  - `app/api/invite-code/route.ts`
  - `app/api/journal/route.ts`
  - `app/api/journal/[id]/route.ts`
  - `app/api/journal/[id]/share/route.ts`
  - `app/api/stripe/checkout-session/route.ts`
  - `app/api/stripe/portal-session/route.ts`
  - `app/api/stripe/subscription/route.ts`
  - `app/api/stripe/sync-checkout/route.ts`

### Layout / UX P0 improvements
- Stronger hierarchy on start-here:
  - `app/start-here/page.tsx` (`h1` now visually distinct from `h2`).
- Added early trust/disclaimer line on learn topic pages:
  - `app/learn/[slug]/page.tsx`.
- Improved low-vision readability for disclaimers:
  - `components/EducationalFooter.tsx` (contrast + size).
- Added concise login trust cue:
  - `app/login/LoginForm.tsx`.
- Slightly stronger sidebar panel separation from background:
  - `components/AppShell.tsx`.

### Smoke and runbooks
- Added concrete smoke checklist:
  - `docs/audit/SMOKE-TEST-CHECKLIST.md`
- Added runbooks:
  - `docs/runbooks/backup-restore.md`
  - `docs/runbooks/deploy-rollback.md`
  - `docs/runbooks/secret-rotation.md`
  - `docs/runbooks/billing-access-mismatch.md`

### Audit plan artifact
- Added phase plan document:
  - `docs/audit/HARDENING-AND-LAYOUT-PLAN.md`

## Why it changed
- Reduce production risk by avoiding automatic schema mutation on every app restart.
- Lower future auth drift by using shared guard helpers across private/authenticated APIs.
- Improve readability, trust signaling, and low-vision friendliness with minimal style/copy edits.
- Turn previously implied ops guidance into concrete runbooks and a repeatable smoke script.

## Exact files changed
- `Dockerfile`
- `package.json`
- `lib/api-full-site-access.ts`
- `app/api/invite-code/route.ts`
- `app/api/journal/route.ts`
- `app/api/journal/[id]/route.ts`
- `app/api/journal/[id]/share/route.ts`
- `app/api/stripe/checkout-session/route.ts`
- `app/api/stripe/portal-session/route.ts`
- `app/api/stripe/subscription/route.ts`
- `app/api/stripe/sync-checkout/route.ts`
- `app/start-here/page.tsx`
- `app/learn/[slug]/page.tsx`
- `components/EducationalFooter.tsx`
- `components/AppShell.tsx`
- `app/login/LoginForm.tsx`
- `.env.example`
- `README.md`
- `docs/GO-LIVE-PLAN.md`
- `docs/PRE-LAUNCH-GREEN-LIGHT-CHECKUP.md`
- `docs/audit/HARDENING-AND-LAYOUT-PLAN.md`
- `docs/audit/SMOKE-TEST-CHECKLIST.md`
- `docs/runbooks/backup-restore.md`
- `docs/runbooks/deploy-rollback.md`
- `docs/runbooks/secret-rotation.md`
- `docs/runbooks/billing-access-mismatch.md`
- `docs/audit/HARDENING-AND-LAYOUT-SUMMARY.md`

## What remains risky
- Public write/proxy endpoints still have no rate limiting (`/api/site-feedback`, geocode endpoints, `/api/register`).
- No centralized CSP/security-header layer in code yet.
- No integrated error tracking/structured logging standard.
- SQLite remains operationally sensitive to backup discipline and volume correctness.

## What layout issues remain
- No mobile equivalent of desktop sidebar/TOC for many long pages.
- Header density/actions on small screens may still feel crowded in some auth states.
- Trial/restricted messaging tone still varies across some tools pages.

## What should be tackled next
### P1
1. Add lightweight rate limiting for public write/proxy endpoints.
2. Add baseline security headers/CSP configuration.
3. Add dependency automation and periodic audit routine.

### P2
1. Add minimal automated smoke tests (scripted).
2. Revisit migration strategy and long-term DB scaling path.
3. Add mobile TOC/navigation affordance for long-form pages.
