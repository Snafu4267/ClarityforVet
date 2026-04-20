# Backup and Restore Runbook

## Purpose
- Protect SQLite production data (`DATABASE_URL` file path on persistent volume).
- Verify that restores work before a real incident.

## Scope
- Dokploy-hosted Clarity4Vets container with SQLite file database.
- Data includes accounts, journal entries, shares, and feedback.

## Backup steps (minimum)
1. Confirm production `DATABASE_URL` points to persistent mounted storage.
2. Stop writes briefly (maintenance window preferred) or snapshot volume at host level.
3. Copy DB file and journal file (if present) to timestamped backup:
   - `prod.db`
   - `prod.db-journal` (if exists)
4. Store backup off-instance (separate disk/bucket).
5. Record checksum and backup location in ops notes.

## Restore drill (monthly)
1. Restore latest backup into a staging path/container.
2. Start app against restored DB.
3. Verify:
   - login works,
   - one journal entry can be read,
   - one admin feedback row is visible for admin account.
4. Record elapsed restore time and any errors.

## Failure conditions
- Missing mounted volume or wrong file permissions (container user cannot read/write file).
- Backup only on same VPS (single point of failure).

## Minimum retention
- Daily backups: 14 days
- Weekly backups: 8 weeks
- Monthly backups: 6 months

## Notes
- Do not commit DB files to GitHub.
- Keep this runbook aligned with `docs/GO-LIVE-PLAN.md`.
