# Clarity4Vets — concrete project audit pack

**Product:** Clarity4Vets (`clarity4vets` in `package.json`) — Next.js educational / tools site for veterans (not VA-affiliated).  
**Repo:** `vet-to-vet-mvp` (remote example: `ClarityforVet` on GitHub).  
**Audit type:** Static codebase + config review (no penetration test, no legal review).  
**As-of:** Generated from the current `main` tree (Next **16.2.3**, React **19.2.4**, Prisma **5.22.0**).

---

## 1. Executive summary

The application is a **Next.js App Router** project with **NextAuth (credentials + JWT)**, **Prisma + SQLite** for accounts, spouse/family journal, feedback, and **Stripe** for subscriptions. Public routes deliver Learn topics, VA resource pointers, perks data, tools (client-heavy), and marketing pages; subscriber APIs enforce **full-site access** via session flags derived from Stripe/trial state.

**Strengths:** Clear separation between brochure-style public content and gated APIs (`requireFullSiteAccessResponse`), Stripe webhook signature verification when configured, bcrypt password hashing, Dockerized **standalone** production image with non-root user, documented env surface in `.env.example`.

**Primary residual risks:** **SQLite** suitability and **backup strategy** in production; **no `middleware.ts`** (route protection is API-layer and page-level—verify every sensitive page); **Docker CMD** runs `prisma db push` on container start (migrations/schema drift and startup coupling—see §7); dependency and secret rotation are operational, not automated in-repo.

---

## 2. Scope & inventory

| Layer | Technology | Notes |
|--------|------------|--------|
| Framework | Next.js 16 (App Router), `output: "standalone"` | `next.config.ts` |
| UI | React 19, Tailwind 4, Geist fonts | |
| Auth | next-auth v4, Credentials provider, JWT sessions (30d) | `lib/auth.ts` |
| DB | Prisma 5, SQLite (`DATABASE_URL`) | `prisma/schema.prisma` |
| Payments | Stripe server SDK | `lib/stripe.ts`, `app/api/stripe/*` |
| Maps | Leaflet / react-leaflet | Facility or map features as applicable |
| PDF | pdf-lib | Client or server usage per feature |
| Deploy | Dockerfile (Node 20 bookworm-slim), Dokploy on VPS | `docs/GO-LIVE-PLAN.md` |

**Top-level app routes (representative):** `/`, `/learn`, `/learn/[slug]`, `/start-here`, `/va-resources`, `/perks`, `/perks/[state]`, `/perks/[state]/[perkId]`, `/tools/*`, `/login`, `/register`, `/welcome`, `/invite-vet`, `/stripe`, `/unenroll`, `/admin/feedback`, `/va-facilities/[state]`, APIs under `/app/api/*`.

---

## 3. Security & privacy

| Topic | Observation |
|--------|----------------|
| Passwords | `bcryptjs` compare on login; registration hashes password (`app/api/register/route.ts`). |
| Sessions | JWT strategy; `NEXTAUTH_SECRET` required for integrity. |
| HTTPS | Assumed in production via Dokploy / reverse proxy; `NEXTAUTH_URL` must match public URL. |
| API auth | Journal, invite-code, Stripe user endpoints use `getServerSession` + `requireFullSiteAccessResponse` where applicable—**spot-check** any new API routes. |
| Webhook | `constructEvent` + `STRIPE_WEBHOOK_SECRET` when configured—good pattern. |
| PII | Emails, journal bodies, shares in SQLite—**classify** as sensitive; access control is application-level. |
| Client-only tools | Vet sheet, notes, etc. use **local storage**—data not sent to your server by design; clarify in privacy stance if you publish a policy. |

**Gaps / questions:** Rate limiting and abuse controls on `/api/register` and auth endpoints not audited here. No WAF or bot mitigation in-repo. Content Security Policy headers not verified in this pack—check hosting layer.

---

## 4. Authorization model (conceptual)

1. **Anonymous:** public pages, static learn, resources, perks, `start-here`, tools that do not call gated APIs.  
2. **Signed in, `siteAccess`:** JWT callback loads user row and `computeSiteAccess` (`lib/site-access.ts`) → `full` vs `restricted` (trial/subscription).  
3. **Subscriber-only APIs:** return **401** without session, **403** with `SITE_ACCESS_RESTRICTED` when not `full`.  
4. **Admin:** `User.isAdmin` for `/admin/feedback` (per comments in `.env.example`).

**Audit action:** When adding pages that hit Prisma or private APIs, confirm the same pattern is used.

---

## 5. Stripe & billing

- **Checkout / portal / subscription** routes under `app/api/stripe/`.  
- **Webhook** optional but recommended for DB sync (`STRIPE_WEBHOOK_SECRET`).  
- **Customer portal** noted as required for `/unenroll` flow in `.env.example`.

**Risk:** Test vs live keys—confirm Dokploy uses **live** keys only on production project in Stripe dashboard.

---

## 6. Data layer

**Models (Prisma):** `User`, `SiteFeedback`, `JournalEntry`, `EntryShare` (see schema for fields and indexes).

**Production concerns:**

- SQLite is **single-file**; requires **persistent volume** and backup discipline (see `docs/PRE-LAUNCH-GREEN-LIGHT-CHECKUP.md` / go-live plan).  
- Growth path: PostgreSQL migration if concurrent writes or HA become requirements.

---

## 7. Deployment (Docker)

**Dockerfile highlights:** multi-stage build, `npm ci`, `prisma generate`, `npm run build`, runtime user `nextjs`, exposes `3000`, copies standalone output + Prisma engines.

**Startup command (important):**

```text
node node_modules/prisma/build/index.js db push --skip-generate && node server.js
```

**Implications:** Every container start runs **`db push`** against `DATABASE_URL`. This keeps schema aligned but is **not** a traditional migration pipeline; review for production (locking, zero-downtime, accidental schema changes). Prefer explicit migrate strategy if the product matures.

**Node version:** Image uses **Node 20**; local dev showed **Node 22**—usually fine, but align if you hit subtle build/runtime differences.

---

## 8. Dependencies & supply chain

| Dependency | Role |
|------------|------|
| `next`, `react`, `react-dom` | Core |
| `next-auth` | Auth |
| `@prisma/client`, `prisma` | ORM |
| `bcryptjs` | Password hashing |
| `stripe` | Billing |
| `leaflet`, `react-leaflet` | Maps |
| `pdf-lib` | PDF |

**Recommendation:** Run `npm audit` periodically; enable Dependabot or Renovate on GitHub if not already.

---

## 9. Accessibility & UX (recent work)

- **Sidebar:** Contextual TOCs on key routes; **higher-contrast** nav text and solid panel (`AppShell` + `LearnSidebarNav`).  
- **Wide screens:** Nav visible at `xl`; smaller viewports rely on in-page content—consider a future **mobile TOC** pattern if feedback demands it.

**Audit action:** Run Lighthouse accessibility on `/start-here`, `/learn`, `/tools/vet-sheet` after major UI changes.

---

## 10. Content & compliance posture

- README and pages repeatedly state **not VA / not legal or medical advice**—keep that consistent in new copy.  
- **Master plan §14** gate in README before calling deployment “production” in a legal/compliance sense.

---

## 11. Observability & operations

| Area | Status in repo |
|------|------------------|
| Structured logging | Not centralized in this audit |
| Error tracking (Sentry, etc.) | Not observed in dependencies |
| Uptime monitoring | External (Dokploy / Hostinger) |
| Backups | Operational—document who/when for SQLite file |

---

## 12. Risk register (concrete)

| ID | Risk | Likelihood | Impact | Mitigation (starter) |
|----|------|------------|--------|----------------------|
| R1 | SQLite file loss / no backup | Med | High | Automated volume backup + restore drill |
| R2 | `db push` on every container start | Med | Med | Move to `migrate deploy` + controlled releases |
| R3 | Session / secret leak (`NEXTAUTH_SECRET`) | Low | High | Rotate secret procedure; never commit `.env` |
| R4 | Stripe webhook misconfig | Med | Med | Dashboard test events; monitor 4xx on `/api/stripe/webhook` |
| R5 | New API route without access check | Med | High | Code review checklist (see REVIEW-BUNDLE) |
| R6 | Dependency CVE | Ongoing | Med–High | `npm audit`, updates |
| R7 | Public copy interpreted as professional advice | Med | Med | Disclaimers + “see your VSO / clinician” patterns |

---

## 13. Strengths, gaps, recommended follow-ups

**Strengths:** Modern Next stack; clear auth gate for paid features; Stripe webhook verification; Docker non-root; documented env template; educational positioning in UI.

**Gaps:** Automated test suite not characterized in this pack; centralized logging/monitoring optional; migration story for SQLite; CSP/rate-limit review.

**Follow-ups (prioritized):**

1. Production **backup + restore** test for `DATABASE_URL` file.  
2. Replace or gate **`db push` on boot** when you outgrow MVP.  
3. Add **smoke tests** (Playwright or manual script—see `REVIEW-BUNDLE.md`).  
4. **npm audit** + dependency update window.  
5. Optional **error tracking** for production.

---

## Appendix A — API routes inventoried

| Path prefix | Purpose (high level) |
|-------------|----------------------|
| `/api/auth/[...nextauth]` | NextAuth |
| `/api/register` | Account creation |
| `/api/invite-code` | Invite code (gated) |
| `/api/journal`, `/api/journal/[id]` | Journal CRUD (gated) |
| `/api/journal/[id]/share` | Sharing entries (gated) |
| `/api/site-feedback` | Feedback |
| `/api/geocode-zip`, `/api/geocode-address` | Geocoding helpers |
| `/api/va-form-guide` | VA form guide proxy/helper |
| `/api/stripe/*` | Checkout, portal, subscription, webhook, sync |

---

## Appendix B — Environment variables (from `.env.example`)

`DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, optional `NEXT_PUBLIC_PUBLIC_ONLY_SITE`, `TRIAL_DAYS`, `STRIPE_SECRET_KEY`, `STRIPE_PRICE_ID`, optional `STRIPE_WEBHOOK_SECRET`, optional `VA_API_KEY`, optional `VA_FACILITIES_BASE`.

**Rule:** Real values only in Dokploy / local `.env`, never in Git.
