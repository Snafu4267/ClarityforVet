# Smoke Test Checklist (P0)

Run after local build or pre-deploy review. Record pass/fail and notes.

## Public routes
- [ ] `/` loads and primary nav works.
- [ ] `/learn` loads topic index.
- [ ] One `/learn/[slug]` loads, section links in sidebar (desktop) align with page headings.
- [ ] `/start-here` loads and left TOC entries jump to matching sections.
- [ ] `/va-resources` loads and section anchors work.
- [ ] `/perks` loads; state selection works.
- [ ] `/tools/vet-sheet` (or `/tools/notes`) loads and core interactions work.

## Auth routes
- [ ] `/register` loads; invalid input shows validation.
- [ ] `/login` loads and sign-in error handling is clear.

## Access control
- [ ] One full-access API route returns `401` when signed out (example: `/api/journal`).
- [ ] Same route returns `403` for restricted account (trial expired/no active subscription).
- [ ] Signed-in full account can access journal APIs successfully.

## Billing flow
- [ ] Stripe checkout entry endpoint responds as expected for signed-in user (`/api/stripe/checkout-session`).
- [ ] `/api/stripe/subscription` reflects expected status.

## Admin
- [ ] `/admin/feedback` is unavailable to non-admin users.
- [ ] `/admin/feedback` loads for admin user.

## UX trust checks
- [ ] Disclaimers remain visible on key pages (learn/start-here/footer).
- [ ] Sidebar text and contrast are legible on desktop.
