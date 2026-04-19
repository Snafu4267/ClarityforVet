# Pre-launch green-light checkup

Saved from assistant review session — **work through each line tonight** and tick items when satisfied.

Also complete your **master plan §14** gate (“full review before any live/production deploy”), referenced in [`README.md`](../README.md).

---

## Process gate (your call)

- [ ] Deliberate go-live decision recorded (idea, plan, execution reviewed per master plan §14).

---

## Production environment

- [ ] **`NEXTAUTH_URL`** equals the real public URL users open (including `https://`, no typo).
- [ ] **`NEXTAUTH_SECRET`** is a long random secret (never committed); set only in hosting env.
- [ ] **`DATABASE_URL`** points at **persistent** storage on the server (mounted volume / stable path). Not a disposable container path that resets on redeploy.
- [ ] **`npx prisma db push`** (or your migration strategy) run **once** against production `DATABASE_URL` before traffic.
- [ ] Production **build passes** (`npm run build` or Docker build — same pipeline you deploy).

---

## Payments (Stripe)

- [ ] Production **Stripe** keys and **`STRIPE_PRICE_ID`** set in hosting env (not test keys unless you intend test mode).
- [ ] **Stripe webhook** configured for production (`/api/stripe/webhook` + secret) if subscription status must stay accurate without relying only on redirect after checkout.
- [ ] Smoke test: **checkout → active subscription** reflects in app; **cancel / portal** behaves as expected.

---

## Trial & access behavior

- [ ] **`TRIAL_DAYS`** intentional for prod (default `10` unless you chose otherwise).
- [ ] Quick sanity: new user sees **full** surface during trial; after trial **without pay**, restricted UX matches intent (hub, learn, spouse log / invite blocked, subscribe path works).
- [ ] If using **`NEXT_PUBLIC_PUBLIC_ONLY_SITE=true`**, confirm that deploy is intentionally “brochure only” (not mixed with paid trial UX).

---

## Content & messaging

- [ ] Read **home hero**, **Welcome**, **invite**, **stripe**, **footers** — wording matches what you’ll stand behind publicly.
- [ ] **Educational disclaimers** (not VA / not legal advice / confirm on VA.gov) still accurate for how you describe the site.

---

## Smoke tests (hands-on)

- [ ] Anonymous: main journeys (Learn, VA resources, start-here) load.
- [ ] Register → login → spouse log / invite (if applicable) works while **in trial or paid**.
- [ ] **Restricted** path: subscribe flow restores **full** access after payment (or documented manual DB override for ops).

---

## Ops & safety

- [ ] **Secrets** only in hosting env — not in GitHub ([`.gitignore`](../.gitignore) respected).
- [ ] **Admin** (`isAdmin`): only your account(s) marked in production DB if `/admin/feedback` is used.
- [ ] **HTTPS** / domain / DNS verified on the URL you’ll share.

---

## Optional / later

- [ ] Rate limiting on `/api/register` / auth (noted as backlog in [`docs/ROADMAP.md`](ROADMAP.md)).
- [ ] Postgres migration when SQLite + traffic outgrow single-server file DB.

---

When every **required** box above is checked and §14 is done, treat that as **green light** for your deployment window.
