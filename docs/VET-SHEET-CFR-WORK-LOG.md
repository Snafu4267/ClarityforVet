# Veteran info sheet & 38 CFR — work log (saved with this project)

This file is **intentional documentation** so design decisions and file locations stay with the repo. It is **not** legal or medical advice.

**Last updated:** April 2026

---

## What we built (plain English)

### Veteran info sheet (`/tools/vet-sheet`)

- **Personal fields** (name, DOB, email, ZIP, branch). Data stays in **this browser only** (local storage), not on Clarity4Vets servers.
- **Branch** choice tints the page and shows the branch ribbon when selected.
- **“Your ratings”** — one or more rows: **rating %** and **what it’s for** (free text). Saved with the same local storage key as the rest of the sheet.
- **Per row:** once you type something in “what it’s for,” a **CFR help box** appears. It always includes:
  - Short explanation that **VA does not publish one link per diagnosis** — use **Find** (Ctrl+F / ⌘F) on official § pages.
  - Links to **on-site learn pages** (Part 4 doorways, CFR map, tinnitus example).
  - **§ 3.310** (secondary), **§ 4.71a** (common MSK schedule), **full Part 4**, and a **Google search** scoped to `site:ecfr.gov` using the user’s words (for rare conditions).
- **Optional keyword hints** (tinnitus, hearing, mental health, MSK words including gout, respiratory, heart, diabetes, neuro/TBI, etc.) **add** suggested § links — they never replace the universal path above.

### Combined ratings / VA calculator block

- Shown **below** the ratings section when a **branch is chosen**.
- Primary action: **official VA.gov** combined disability rating calculator / table.
- Secondary: on-site learn topic for ratings & secondaries.

### Learn pages (`/learn/ratings-connection`)

- **`#cfr-map`** — Part 3 jump links + Part 4 entry points.
- **`#cfr-find-your-condition`** — “same method as tinnitus”: body-system § doorways (4.71a, 4.97, 4.104, 4.119, 4.124a, 4.130, ear §§, 3.310, Part 4 root).
- **`#cfr-tinnitus-example`** — worked example: DC 6260, § 4.87, secondary framing.
- Article title uses **“38 CFR and what to ask”** (avoid “what caused what” phrasing).

---

## Key files (where to edit)

| Area | Path |
|------|------|
| Vet sheet page | `app/tools/vet-sheet/page.tsx` |
| Ratings card + disclaimer | `components/vet-sheet/VetSheetMyRatings.tsx` |
| Per-row CFR UI | `components/vet-sheet/VetSheetRatingRowHints.tsx` |
| CFR logic (keywords + universal path + Google link) | `data/cfr-condition-hints.ts` |
| Official eCFR URLs (update if eCFR moves a page) | `data/cfr-links.ts` |
| Learn article content & anchors | `data/awareness-modules.ts` (slug `ratings-connection`) |
| Learn page rendering (section `id`s) | `app/learn/[slug]/page.tsx` |

---

## How to add more keyword hints

1. Open `data/cfr-condition-hints.ts`.
2. In **`getKeywordSuggestion`**, add a new `if` block **before** the final `return null`, or extend an existing regex (e.g. musculoskeletal) with more words.
3. Return **short lines** + **external** links to real `ecfr.gov` URLs (prefer patterns already in `cfr-links.ts`).
4. Run `npx tsc --noEmit` after edits.

Universal behavior (guides + 3.310 + Part 4 + search) is assembled in **`getCfrHintForConditionText`** — do not remove that unless you intend to change the product promise.

---

## If an eCFR link breaks

eCFR occasionally changes URL paths. Search [eCFR](https://www.ecfr.gov) for the § number (e.g. “38 CFR 4.71a”) and update the URL in `data/cfr-links.ts` (and any hardcoded links in `awareness-modules.ts`).

---

## Cursor / chat history

This file **does not** replace Cursor chat logs. To keep long conversations, copy them into a note or export from Cursor separately—but **this file** records what matters for **code and product behavior** inside the project folder.
