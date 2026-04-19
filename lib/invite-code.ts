/** Alphanumeric invite codes (uppercase), 10 chars — avoids ambiguous I/O/0/1 if we narrow charset later. */
export function generateInviteCodeCandidate(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID().replace(/-/g, "").slice(0, 10).toUpperCase();
  }
  const t = Date.now().toString(36).toUpperCase().replace(/[^A-Z0-9]/g, "");
  return `V${t}`.slice(0, 10).padEnd(10, "0");
}
