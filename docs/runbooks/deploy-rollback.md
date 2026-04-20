# Deploy and Rollback Runbook

## Purpose
- Standardize safe Dokploy deploys with explicit DB sync step.
- Provide a fast rollback path without data loss surprises.

## Deploy (normal)
1. Confirm commit SHA to deploy.
2. Verify env values in Dokploy (`NEXTAUTH_URL`, `NEXTAUTH_SECRET`, Stripe keys, `DATABASE_URL`).
3. Run one-off schema sync only when needed:
   - `npm run db:push`
4. Deploy app container (normal start should not run schema mutation).
5. Smoke-check:
   - `/`, `/learn`, `/start-here`, `/login`, one gated route, `/admin/feedback` (admin only).

## Rollback
1. Select previous known-good image/commit in Dokploy.
2. Redeploy previous version.
3. Validate critical routes and auth flow.
4. If issue is data/schema related:
   - restore DB from backup only after owner approval,
   - re-run smoke checks.

## Do not
- Do not run blind schema changes during incident pressure.
- Do not rotate secrets and rollback simultaneously unless required.

## Record after each deploy
- commit SHA
- deploy start/end time
- operator name
- smoke-check result
- rollback needed (yes/no)
