# Go-live plan — Clarity4Vets MVP

This document records the agreed direction for **GitHub**, **production hosting**, **accounts/data**, and **photos**. Update it as decisions change.

---

## 0. Chosen stack (initial deployment) — **locked in**

| Piece | Choice |
|--------|--------|
| **Server** | **Hostinger** — **KVM 2** plan (VPS: you get a full virtual machine with persistent disk). |
| **Deploy / ops** | **Dokploy** — self-hosted on that VPS: connect the **GitHub** repo, build/run the app (typically in **Docker**), manage env vars, HTTPS, and domains from Dokploy. |
| **Code** | **GitHub** — canonical **source code** and git history. Pushes to GitHub trigger (or feed) deploys; GitHub does **not** store live user accounts or journal entries—that stays on the server unless you add another service later. |
| **Model** | **Self-hosted** first deployment: you operate the VPS + Dokploy; not a managed “serverless” host like Vercel for this phase. |

### Hostinger checkout — **reminder when you pay**

When you **order or renew** Hostinger (e.g. KVM 2) for this project, use promo code **`David`** (David Ondrej) for the partner discount. **Stop at checkout** long enough to enter that code before you complete payment—deals and fields can change, so confirm the code still applies on Hostinger’s site when you get there.

**Implications**

- **Runtime database:** User/password and spouse-log data live in whatever database file or service you configure **on the VPS**. With a **single** machine and **persistent disk**, **SQLite** (`DATABASE_URL` pointing at a file on a **mounted volume** that survives redeploys) can be acceptable for an **initial** small deployment—if the Dokploy app has a **persistent volume** for `prisma` / `dev.db`. If you later outgrow that, move to PostgreSQL (or similar) on the same VPS or elsewhere and update Prisma accordingly.
- **`NEXTAUTH_URL`** must be the real public URL users use (including `https://` and your domain).
- **Secrets** (`NEXTAUTH_SECRET`, etc.) go in **Dokploy environment variables**, not in GitHub.

---

## 1. Source control (GitHub)

- Push this project to GitHub as the canonical copy of the app code.
- **Do not commit** secrets or local-only files:
  - `.env`, `.env.local` (keep secrets out of the repo)
  - `prisma/dev.db` (local SQLite database file)
- **Do commit** `.env.example` (placeholders only, no real secrets).
- Rely on existing `.gitignore` for `node_modules`, `.next`, env files, and `dev.db`.

**Clarification:** “GitHub holds the data” here means **code and configuration history**. **Private user data** (accounts, journal entries) is **not** stored in GitHub—it lives on the **self-hosted** database / volume unless you explicitly design something else.

---

## 2. Docker image (in this repo) — **ready for Dokploy**

These files support **build from GitHub** and **run in a container** on your VPS:

| File | Purpose |
|------|--------|
| **`Dockerfile`** | Multi-stage build: `prisma generate` → `next build` (standalone) → run `node server.js` on port **3000**. Includes Prisma engines beside the standalone output. |
| **`.dockerignore`** | Keeps images small and avoids copying `node_modules`, `.env`, or local `*.db` into the build context. |
| **`next.config.ts`** | **`output: "standalone"`** — required for the Docker `CMD ["node", "server.js"]` pattern. |

**Local check (optional):** `npm run docker:build` builds the image tag `clarity4vets` (requires Docker installed).

**Dokploy (when you wire it):** Point the service at this repo, use **Dockerfile** build, expose **3000**, attach a **persistent volume** for the SQLite directory (see §3), and set env vars from §2 / `.env.example`.

---

## 3. Live website (hosting)

- Deploy the same Next.js app to a public URL (“go live”) via **Dokploy** on the **Hostinger KVM** VPS.
- In **Dokploy** (or the app’s container env), set at minimum:
  - **`NEXTAUTH_SECRET`** — long random value for production.
  - **`NEXTAUTH_URL`** — the real public site address, including `https://` (e.g. `https://your-domain.com`). Must match how users open the site.
  - **`DATABASE_URL`** — see section 3b; must match where Prisma writes on the server (file path on a **persistent** volume if using SQLite).

---

## 3b. Database in production (SQLite on Docker)

- **Local dev** uses SQLite at `file:./prisma/dev.db` (see `.env.example`).
- **In Docker**, use an **absolute** path on a **mounted volume**, e.g.  
  `DATABASE_URL="file:/data/prisma/prod.db"`  
  Mount host (or Dokploy) storage at **`/data/prisma`** so the file **survives** image rebuilds and container restarts.
- **First time** the production DB is empty (or when schema changes): run **`npm run db:push`** as an explicit one-off deploy step (Dokploy one-off exec, local machine with tunnel, or short-lived container using same image + env + volume). Do **not** commit `prod.db` to GitHub.
- **Serverless / ephemeral-only** hosts: SQLite is a bad fit—**your** VPS + volume avoids that **if** you configure the volume correctly.
- For **growth** or **multiple app instances**, plan **PostgreSQL** (or similar) and a matching **`DATABASE_URL`** + Prisma migrations.
- Tooling pages that **do not** use the server database can still work without DB configuration; **auth and the private log** need a **working, persistent** production database strategy.

---

## 4. Photos and reliability

- **Current behavior:** The **home page** background flag and **veteran info sheet** “service snapshots” load images from **remote URLs** (e.g. Wikimedia Commons). That requires visitors to have normal internet access to those hosts.
- **Self-hosting the app** does not by itself change that—images still load from those URLs unless the code is updated.
- **Stronger reliability (optional follow-up):** Copy chosen images into **`public/`** in this repo and point the app at **local paths** so **your VPS** serves the files.

---

## 5. Process gate before calling it “production”

- The project **README** states: do **not** treat a public deployment as final **production** until a **full review** of idea, plan, and execution and a deliberate go-live decision.
- That checklist is referenced in the master plan: **Clarity4Vets master plan → §14** (parent folder: `AI Practice`), with modular status in **`docs/ROADMAP.md`**. If your file is still named `Vet to Vet Master Plan.md` or `MusterPoint Master Plan.md`, rename it or treat this as the same document.

---

## 6. Pre-flight checks (before or right after first deploy)

- Run **`npm run build`** locally (or rely on CI/Docker build) and resolve any build errors.
- On the **live HTTPS URL**, manually test **register**, **login**, and **spouse log** if those features matter for launch.
- Open **home** and **veteran info sheet** on the live site and confirm images load in a normal browser.
- Confirm **Dokploy** SSL and domain point to the app; confirm **database file or Postgres** survives a redeploy.

---

## 7. Risks / issues to watch (this plan is sound; these are the sharp edges)

1. **SQLite = usually one app instance** — Do not run **multiple replicas** against the same SQLite file. Scale out → PostgreSQL (or similar).
2. **Volume path + permissions** — The container runs as user **`nextjs` (uid 1001)**. The mounted directory for `prod.db` must be **writable** by that user (or adjust ownership in Dokploy/docs).
3. **Backups** — Nothing here **automatically** backs up `prod.db`. Plan copies (Hostinger snapshots, `rsync`, scheduled dump) before you trust real user data to it.
4. **Dokploy / reverse proxy** — If login redirects or callbacks misbehave, double-check **`NEXTAUTH_URL`** and that the proxy forwards **HTTPS** / `Host` correctly. (Add **`AUTH_TRUST_HOST=true`** in env only if NextAuth docs for your version recommend it behind your proxy.)
5. **External images** — Flag + vet-sheet photos still depend on **Wikimedia** (or whatever URL is in code) unless you self-host under `public/`.
6. **VPS resources** — KVM 2 has finite **RAM/CPU**; watch usage under Docker + Next + SQLite under load.
7. **Compliance / content** — Technical deploy ≠ legal or medical review; README gate still applies for calling it “production.”

---

## 8. What you still choose later

- **Hostinger:** at checkout, use promo code **`David`** (David Ondrej)—see **§0 Hostinger checkout** above.
- Exact **domain** and DNS at Hostinger.
- **Dokploy** project settings (healthcheck, restart policy, log retention).
- Legal / medical / compliance review — separate from this technical plan.

---

*Last updated: Docker + standalone wired for Hostinger KVM 2 + Dokploy + GitHub.*
