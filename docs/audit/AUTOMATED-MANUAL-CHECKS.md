# Automated Manual Checks

This adds a tiny local automation for these 5 checks:

1. bad email rejected on `/register`
2. bad password shows error on `/login`
3. restricted account gets `403` on `/api/journal`
4. full-access account gets `200` on `/api/journal`
5. admin account can load `/admin/feedback`

## Test files

- `scripts/setup-manual-check-users.mjs`
- `scripts/run-manual-checks.mjs`

## Exact run command

1) Start the app locally (leave it running):

```bash
npm run dev
```

2) In another terminal, create/update the test users:

```bash
npm run checks:manual:setup-users
```

3) Run the automated checks:

```bash
npm run checks:manual
```

## Exact test-account setup steps

The setup command above creates/updates these local users:

- `restricted.test@local.dev` (restricted access)
- `full.test@local.dev` (full access)
- `admin.test@local.dev` (admin + full access)

Default password for all three:

- `TestPass123!`

Optional custom password:

```bash
MANUAL_CHECKS_PASSWORD="YourPass123!" npm run checks:manual:setup-users
MANUAL_CHECKS_PASSWORD="YourPass123!" npm run checks:manual
```

If your app runs on a different local URL:

```bash
MANUAL_CHECKS_BASE_URL="http://localhost:3001" npm run checks:manual
```

## Notes

- These checks do not change app logic.
- They only use local test users and live local HTTP requests.
- User setup script has a safety stop and only runs when connected to local SQLite dev DB.

## Completion workflow gate (required)

Before marking related work complete:

- Run `npm run checks:manual` and record output.
- List remaining manual checks.
- Get explicit confirmation for manual auth, billing, admin, and trust-critical flows.
- Generate an outside-review bundle.
- Run external AI review on changed files.
- Fix critical findings or document deferrals.
