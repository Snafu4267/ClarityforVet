# Clarity4Vets — review bundle

Use this with **`PROJECT-AUDIT-PACK.md`** for engineering review, stakeholder walkthrough, or pre–go-live checks. It is **not** a substitute for legal, medical, or security audits by licensed professionals.

---

## A. Who uses this bundle

| Role | Use |
|------|-----|
| **Owner / product** | Sections C, D, E — clarity, tone, and “what we promise” |
| **Engineering** | Sections B, F — correctness, regressions, deploy |
| **Ops / Dokploy** | Section F + audit pack §7 (Docker / DB) |

---

## B. Pre-merge / pre-release — engineering checklist

Copy into a PR description or tick before tagging a release.

- [ ] `npx next build` succeeds (or full `npm run build` if Prisma generate works in your environment).
- [ ] `npm run lint` — no new errors in touched files.
- [ ] **No secrets** in diff (search for `sk_live`, `sk_test`, `whsec_`, long base64 blobs, private URLs).
- [ ] New **API route** under `app/api/` uses `getServerSession` / `requireFullSiteAccessResponse` (or documents why public).
- [ ] **User-visible copy** still states not VA / not legal or medical advice where relevant.
- [ ] **Mobile + desktop** spot-check on `/start-here`, one `/learn/[topic]`, `/login`, one `/tools/*` route.
- [ ] **Dokploy env vars** documented if any new `process.env.*` was added (update `.env.example`).

---

## C. Smoke test script (manual, ~15–20 minutes)

Run in **production** or **staging** URL after deploy. Record pass/fail in Section G.

| # | Action | Expected |
|---|--------|----------|
| 1 | Open `/` | Home loads; no console errors blocking layout |
| 2 | Open `/learn` | Topic list loads |
| 3 | Open any `/learn/[slug]` | Article loads; sidebar on wide screen shows section links |
| 4 | Open `/start-here` | Sections load; sidebar matches headings; text readable |
| 5 | Open `/va-resources` | Sections and phone-style content load |
| 6 | Open `/perks` | Hub loads; state picker works |
| 7 | Open `/tools/vet-sheet` (or notes) | Tool loads; data local-only behavior as designed |
| 8 | Open `/register` | Form loads; submit validation (do not use real PII in shared env) |
| 9 | Open `/login` | Form loads |
| 10 | Signed-in: journal or gated page | 403/redirect when trial/subscription expects restriction |
| 11 | Stripe: checkout smoke (test mode) | Completes or fails gracefully with clear message |
| 12 | `/admin/feedback` | Only as admin; otherwise blocked |

---

## D. Stakeholder / product review questions

Use in a 30–45 minute session; capture answers in meeting notes.

1. **Audience:** Is the primary reader enrolled, pre-enrolled, or family? Does navigation match that journey?
2. **Trust:** Does every page make clear Clarity4Vets is **not** VA and not giving legal/medical advice?
3. **Access:** Is the **trial vs paid** experience understandable without support tickets?
4. **Crisis:** Are crisis numbers (988, etc.) correct and visible where needed?
5. **Data:** What do we tell users about **where** journal vs vet-sheet data lives (server vs browser)?
6. **Perks / discounts:** Is “confirm on official source” prominent enough?
7. **Accessibility:** Is sidebar + body text comfortable for low vision (size, contrast)?
8. **Feedback:** Is the site feedback path discoverable and monitored?

---

## E. Compliance & positioning reminders (non-legal)

- Educational / directory / tooling positioning — avoid implying **official VA endorsement**.  
- Maintain alignment with **internal master plan §14** before calling a URL “production” in a formal sense (see `README.md`).  
- If you add health questionnaires or claims advice, **re-scope** with counsel—that is out of band for this bundle.

---

## F. Dokploy / Hostinger — quick ops checklist

- [ ] **HTTPS** and **canonical domain** match `NEXTAUTH_URL`.
- [ ] **Persistent volume** for SQLite path in `DATABASE_URL` (if using file DB).
- [ ] **Backup** of DB file or volume on a schedule; test a restore once.
- [ ] **Stripe** live vs test keys match environment (production = live).
- [ ] **Webhook** URL in Stripe dashboard matches deployed `/api/stripe/webhook` if used.
- [ ] **Deploy** after `main` push succeeds; note commit SHA in Dokploy for traceability.

---

## G. Sign-off table (print or duplicate in spreadsheet)

| Gate | Owner name | Date | Pass / Fail | Notes |
|------|------------|------|---------------|-------|
| Engineering checklist (B) | | | | |
| Smoke tests (C) | | | | |
| Stakeholder Q&A (D) | | | | |
| Ops checklist (F) | | | | |
| Owner “go” for public URL | | | | |

---

## H. Appendix — file pointers for reviewers

| Topic | Path |
|--------|------|
| Auth | `lib/auth.ts`, `app/api/auth/[...nextauth]/route.ts` |
| Site access | `lib/site-access.ts`, `lib/api-full-site-access.ts` |
| Prisma | `prisma/schema.prisma`, `lib/prisma.ts` |
| Docker | `Dockerfile`, `next.config.ts` (`standalone`) |
| Env template | `.env.example` |
| Go-live context | `docs/GO-LIVE-PLAN.md`, `docs/PRE-LAUNCH-GREEN-LIGHT-CHECKUP.md` |
| Shell layout | `components/AppShell.tsx`, `components/LearnSidebarNav.tsx` |

---

## I. Suggested next artifacts (optional)

- One **Lighthouse** PDF or screenshot set per major release.  
- **Runbook** one-pager: “site is down” → check Dokploy deploy, logs, Stripe status, DB disk.  
- **Playwright** minimal suite for `/`, `/learn`, `/login` if engineering capacity allows.
