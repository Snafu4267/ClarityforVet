type SecurityLevel = "warn" | "error";

/**
 * Lightweight security log hook (stdout/stderr only).
 * Intentionally simple so real log shipping can plug in later.
 */
export function logSecurityEvent(event: string, details: Record<string, unknown> = {}, level: SecurityLevel = "warn") {
  const payload = {
    event,
    at: new Date().toISOString(),
    ...details,
  };
  if (level === "error") {
    console.error("[security]", payload);
    return;
  }
  console.warn("[security]", payload);
}
