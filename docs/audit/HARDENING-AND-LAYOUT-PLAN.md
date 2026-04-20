# Hardening and Layout Plan

## 1) Current hardening baseline

### Already strong
- Credentials auth with bcrypt and NextAuth JWT sessions (`lib/auth.ts`).
- Site access tier model (`full` vs `restricted`) derived from subscription/trial (`lib/site-access.ts`).
- Central full-access API guard (`lib/api-full-site-access.ts`).
- Stripe webhook signature validation (`app/api/stripe/webhook/route.ts`).
- Admin gating for feedback page (`app/admin/feedback/page.tsx` checks `isAdmin`).
- Educational / non-VA / non-legal / non-medical positioning repeated in UX copy.

### Risky / weak
- Docker startup mutated schema via `prisma db push` on every boot (`Dockerfile`).
- Access checks were mostly consistent but duplicated per route; easier to drift.
- Public write/proxy endpoints have no rate-limit safety net:
  - `/api/site-feedback`
  - `/api/geocode-zip`
  - `/api/geocode-address`
  - `/api/register`
- No centralized middleware safety net (intentional for this phase).
- SQLite reliability depends on persistent volume + backup discipline (operational).

### Control files (exact)
- Auth/session: `lib/auth.ts`
- Access tier logic: `lib/site-access.ts`
- API full-access guard: `lib/api-full-site-access.ts`
- Prisma client/runtime: `lib/prisma.ts`, `prisma/schema.prisma`
- Stripe billing control: `app/api/stripe/*`
- Admin behavior: `app/admin/feedback/page.tsx`
- Docker startup: `Dockerfile`
- Environment template: `.env.example`
- Main shell/layout: `components/AppShell.tsx`, `components/LearnSidebarNav.tsx`

---

## 2) Route and API inventory

| Path | File | Access | Current guard | Missing/weak guard | Recommended change |
|---|---|---|---|---|---|
| `/api/journal` | `app/api/journal/route.ts` | Full Access | `requireFullSiteAccessResponse` | Duplicate inline 401 checks | Use shared signed-in helper + full-access guard |
| `/api/journal/[id]` | `app/api/journal/[id]/route.ts` | Full Access | `requireFullSiteAccessResponse` | Duplicate inline 401 checks | Use shared signed-in helper + full-access guard |
| `/api/journal/[id]/share` | `app/api/journal/[id]/share/route.ts` | Full Access | `requireFullSiteAccessResponse` | Duplicate inline 401/email checks | Use shared signed-in/email helper + full-access guard |
| `/api/invite-code` | `app/api/invite-code/route.ts` | Full Access | `requireFullSiteAccessResponse` | Duplicate inline 401 check | Use shared signed-in helper + full-access guard |
| `/api/stripe/checkout-session` | `app/api/stripe/checkout-session/route.ts` | Authenticated | Inline session checks | Pattern drift risk | Use shared signed-in-email helper |
| `/api/stripe/portal-session` | `app/api/stripe/portal-session/route.ts` | Authenticated | Inline session checks | Pattern drift risk | Use shared signed-in helper |
| `/api/stripe/subscription` | `app/api/stripe/subscription/route.ts` | Authenticated | Inline session checks | Pattern drift risk | Use shared signed-in helper |
| `/api/stripe/sync-checkout` | `app/api/stripe/sync-checkout/route.ts` | Authenticated | Inline session checks | Pattern drift risk | Use shared signed-in helper |
| `/api/site-feedback` | `app/api/site-feedback/route.ts` | Public write | Optional session only | No abuse controls | Keep public for now; add rate-limit in P1 |
| `/api/geocode-zip` | `app/api/geocode-zip/route.ts` | Public | None | No abuse controls | Keep public for now; add rate-limit in P1 |
| `/api/geocode-address` | `app/api/geocode-address/route.ts` | Public | None | No abuse controls | Keep public for now; add rate-limit in P1 |
| `/admin/feedback` | `app/admin/feedback/page.tsx` | Admin | Session + DB `isAdmin` | None in code path | Keep as-is |

---

## 3) Startup and migration review

- `prisma db push` was running in normal runtime startup:
  - `Dockerfile` previous CMD used `db push && node server.js`.
- Risk:
  - Runtime schema mutation on every boot increases operational blast radius and couples startup to DB mutation.
- Smallest safe replacement (P0):
  - App boot runs server only.
  - Schema sync runs as explicit one-off step: `npm run db:push`.
- Files changed:
  - `Dockerfile`
  - `package.json`
  - `.env.example`
  - `README.md`
  - `docs/GO-LIVE-PLAN.md`
  - `docs/PRE-LAUNCH-GREEN-LIGHT-CHECKUP.md`

---

## 4) SQLite production safety review

- `DATABASE_URL` handling:
  - `prisma/schema.prisma` uses env-driven SQLite datasource.
  - `.env.example` now clearly points local to `file:./dev.db` and production to absolute mounted path.
- Persistence assumptions:
  - Already documented in `docs/GO-LIVE-PLAN.md`; reinforced in runbooks.
- Backup/restore gaps:
  - Previously documented but no concrete runbook files.
- Needed runbook/docs additions (P0):
  - `docs/runbooks/backup-restore.md`
  - `docs/runbooks/deploy-rollback.md`
  - `docs/runbooks/secret-rotation.md`
  - `docs/runbooks/billing-access-mismatch.md`

---

## 5) Layout and UX audit

| Page/component | Problem | Severity | File | Smallest safe correction |
|---|---|---|---|---|
| `/start-here` | H1 too visually similar to section H2 | Medium | `app/start-here/page.tsx` | Separate `h1` style token (larger H1) |
| `/learn/[slug]` | Disclaimer was easy to miss after long content | Medium | `app/learn/[slug]/page.tsx` | Add compact top trust/disclaimer line near summary |
| Footer disclaimers | Compact/footer disclaimers low contrast for low-vision users | Medium | `components/EducationalFooter.tsx` | Increase text size/contrast and emphasis |
| Login | Minimal trust cue at sign-in moment | Low | `app/login/LoginForm.tsx` | Add concise reassurance copy below blurb |
| Sidebar readability | Needed stronger separation from atmospheric background | Low | `components/AppShell.tsx` | Slightly stronger border/ring/opacity |
| Home `/` | No P0 layout issue requiring code change | Low | `app/page.tsx` | No change in P0 |
| `/learn` index | Contextual nav behavior already improved | Low | `components/LearnSidebarNav.tsx` | No further P0 change |
| `/va-resources` | TOC alignment already corrected in prior pass | Low | `lib/va-resources-toc.ts` + page | No P0 change now |
| `/perks` | TOC alignment already corrected in prior pass | Low | `lib/perks-hub-toc.ts` + page | No P0 change now |
| `/tools/*` | Printables TOC alignment already corrected | Low | `app/tools/printables/page.tsx` | No P0 change now |
| one gated page | Access messaging acceptable for P0 | Low | `app/tools/spouse-log/page.tsx` | No P0 change now |
| `/admin/feedback` | Access control is clear in behavior | Low | `app/admin/feedback/page.tsx` | No P0 change now |

---

## 6) Smoke-test plan (from REVIEW-BUNDLE section C)

- Use `docs/audit/SMOKE-TEST-CHECKLIST.md` as concrete P0 smoke script:
  - `/`
  - `/learn`
  - one `/learn/[slug]`
  - `/start-here`
  - `/va-resources`
  - `/perks`
  - `/tools/vet-sheet` (or equivalent)
  - `/register`
  - `/login`
  - one gated route (journal API/feature)
  - Stripe entry endpoint
  - `/admin/feedback`

---

## 7) Ops/security gaps (current)

- Rate limiting: not implemented on public write/proxy routes (P1).
- Error tracking: no integrated error telemetry dependency (P1/P2 decision).
- Structured logging: not standardized yet (P1).
- CSP/security headers: no explicit policy layer/middleware in this phase (P1).
- Dependency automation: no explicit Dependabot/Renovate config found (P1).
- Secret/env hygiene: good baseline; now supported by dedicated runbook.
- Restore/deploy/billing mismatch guidance: now documented as runbooks (P0 done).

---

## 8) Implementation order

### P0 (do now)
1. Remove schema mutation from normal startup; move to explicit `db:push` step.
2. Standardize route-level guard checks with shared helpers.
3. Apply minimal readability/trust improvements on start-here, learn topic header, footer, login, shell contrast.
4. Add smoke-test checklist doc.
5. Add runbooks and env/docs updates.

### P1 (next)
1. Add lightweight rate limiting for public write/proxy endpoints.
2. Add security headers/CSP baseline.
3. Add dependency automation config and routine.

### P2 (later)
1. Evaluate migration path from SQLite + `db push` workflow to formal migrations.
2. Add lightweight automated smoke tests.
