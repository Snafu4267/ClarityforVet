# Admin Feedback Fix Summary

## Files changed

- `app/admin/feedback/page.tsx`
- `docs/audit/ADMIN-FEEDBACK-FIX-SUMMARY.md`

## Exact fix applied

- Removed redirect behavior for signed-out users on `/admin/feedback`.
- Changed signed-out handling from:
  - `redirect("/login?callbackUrl=/admin/feedback")`
  to:
  - `notFound()`
- Kept existing non-admin handling as `notFound()`.
- Kept existing admin data-fetch/render behavior unchanged.

## Access behavior now enforced

- **Signed-out user:** blocked from `/admin/feedback` (Not Found).
- **Signed-in non-admin user:** blocked from `/admin/feedback` (Not Found).
- **Signed-in admin user:** allowed to access and view feedback log page.
