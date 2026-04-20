# Secret Rotation Runbook

## Purpose
- Rotate production secrets safely without breaking auth/billing.

## Secrets in scope
- `NEXTAUTH_SECRET`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET` (if webhook enabled)
- `VA_API_KEY` (if used)

## Rotation steps
1. Create new secret value in source system (Stripe, VA API, etc.).
2. Update Dokploy environment variable.
3. Restart/redeploy app.
4. Validate:
   - login session creation,
   - billing checkout start,
   - webhook signature verification (if applicable).
5. Revoke old key/secret after validation.

## Important cautions
- Rotating `NEXTAUTH_SECRET` invalidates active sessions; notify operators/users as needed.
- Keep secrets out of Git and local screenshots.
- Rotate one system at a time to simplify rollback.

## Incident fallback
- If auth/billing breaks after rotation, restore prior secret immediately and redeploy.
