# Trial Access Verification

## Files inspected

- `lib/site-access.ts`
- `lib/auth.ts`
- `prisma/schema.prisma`
- `.env.example`
- `lib/api-full-site-access.ts`

## Exact rule found in code

From `lib/site-access.ts`:

- Paid statuses set: `active`, `trialing`
- `TRIAL_DAYS` read from env (`process.env.TRIAL_DAYS`), default `10`
- Access calculation:
  - If `subscriptionStatus` is `active` or `trialing` => `full`
  - Else if `Date.now() < createdAt + TRIAL_DAYS` => `full`
  - Else => `restricted`

Important boundary detail:

- Code uses strict `<` comparison, so at exact trial cutoff moment it becomes `restricted`.

## Exact fields involved

From `prisma/schema.prisma` (`User` model):

- `createdAt: DateTime`
- `subscriptionStatus: String` (default `"none"`)

From auth/session path:

- `lib/auth.ts` reads user `{ createdAt, subscriptionStatus }`
- `computeSiteAccess(...)` result stored in token/session as `session.user.siteAccess`
- `lib/api-full-site-access.ts` enforces full-only access when `siteAccess !== "full"` => `403`

## Local manual test protocol

Use Prisma Studio (`npx prisma studio`) and one test account:

1. Create or edit a user with:
   - valid `email`
   - valid `passwordHash`
   - `subscriptionStatus = "none"`
2. Case A (new user):
   - set `createdAt = now`
   - sign in again (new session)
   - call `/api/journal` while signed in
   - expect `200` (full access)
3. Case B (11-day unpaid user):
   - set `createdAt` to 11+ days ago
   - keep `subscriptionStatus = "none"`
   - sign in again (refresh session token)
   - call `/api/journal`
   - expect `403` (restricted)
4. Case C (subscribed user):
   - set `subscriptionStatus = "active"` (or `"trialing"`)
   - keep any `createdAt` (even older than 10 days)
   - sign in again
   - call `/api/journal`
   - expect `200` (full)

Optional fast local trial check:

- set `TRIAL_DAYS=0.001` in local env to force quick expiry behavior for manual validation.

## Expected results

- New user (<= trial window, unpaid): `full`
- 11-day-old unpaid user: `restricted`
- Active subscriber: `full`

## Final verdict

**Verified (code-level).**

The code implements the 10-day trial/full-access rule with subscription override exactly as specified.  
Manual runtime test is still recommended to confirm environment/session refresh behavior in your deployed test environment.
