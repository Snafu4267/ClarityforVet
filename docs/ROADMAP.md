# Clarity4Vets — modules: shipped vs backlog

Companion to the Clarity4Vets master plan (workspace root). If your file is still named `Vet to Vet Master Plan.md` or `MusterPoint Master Plan.md`, rename it or treat this as the same document. This file tracks **code modules** and **execution order**.

---

## A. Done (implemented)

| Module | Location | What it does |
|--------|----------|----------------|
| **App shell** | `app/layout.tsx`, `Providers` (next-auth session), `globals.css` | Fonts, print styles (`.no-print`), metadata |
| **Home hub** | `app/page.tsx` | Sections: Learn, Directories, Tools, Account links |
| **Legal copy** | `components/EducationalFooter.tsx` | Full + compact disclaimers |
| **Awareness A–F** | `app/learn/*`, `data/awareness-modules.ts` | Static educational pages + official links |
| **National VA resources** | `app/va-resources/page.tsx`, `data/va-national-resources.json` | VA.gov locators, national phones, crisis (no fake 555s) |
| **Texas directory** | `app/texas`, `TexasPageContent`, `texas-va-resources.json` | Facilities, map, ZIP sort, orgs |
| **Map + ZIP** | `TexasFacilitiesMap`, `app/api/geocode-zip` | Leaflet/OSM; Zippopotam (no key) |
| **Geo** | `lib/geo.ts` | Haversine |
| **Tools (local)** | `tools/medications`, `notes`, `calendar`, `printables` | Session/localStorage; print on notes/va-resources/learn |
| **Print** | `PrintPageButton`, `@media print` in `globals.css` | Browser print → Save as PDF |
| **Emergency block** | `components/EmergencyBlock.tsx` | Reusable crisis copy |
| **Auth + DB** | Prisma 5 + SQLite, NextAuth (credentials), `app/login`, `app/register` | Email/password; `DATABASE_URL`, `NEXTAUTH_SECRET` |
| **Spouse / family log** | `app/tools/spouse-log`, `app/api/journal/*` | Private entries; share entry-by-email to another account |
| **Pre-launch gate** | `README.md` | Points to master plan §14 |

---

## B. Not done (skipped by request)

- [ ] **Stripe / $4.99 subscription** — deferred until you are ready (master plan §3).

---

## C. Optional polish later

- [ ] Refactor Texas page to use `EmergencyBlock` from JSON (duplicate markup today).
- [ ] OAuth providers (Google, etc.) in addition to email/password.
- [ ] Hosted Postgres + Prisma migrate for production (SQLite file is dev-friendly only).
- [ ] Rate limiting on `/api/register` and `/api/auth`.

---

## D. APIs & keys

### Required for auth + spouse log (local)

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | SQLite: `file:./prisma/dev.db` |
| `NEXTAUTH_SECRET` | Random string (`openssl rand -base64 32`) |
| `NEXTAUTH_URL` | e.g. `http://localhost:3000` |

Copy `.env.example` → `.env`. **No** third-party API keys for core features.

### Still keyless

Zippopotam, OSM tiles, outbound Google Maps URLs.

### When you add payments later

Stripe (or similar) keys — not configured in this repo.

---

## E. Scripts

- `npm run dev` — dev server (needs `.env` for spouse log / auth).
- `npm run build` — runs `prisma generate` then `next build`.
- `npx prisma db push` — sync schema to SQLite after model changes.
