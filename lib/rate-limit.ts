import { NextResponse } from "next/server";

type Bucket = { count: number; resetAt: number };
type Store = Map<string, Bucket>;

function getStore(): Store {
  const g = globalThis as unknown as { __c4v_rate_limit_store__?: Store };
  if (!g.__c4v_rate_limit_store__) g.__c4v_rate_limit_store__ = new Map<string, Bucket>();
  return g.__c4v_rate_limit_store__;
}

function clientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]?.trim() || "unknown";
  return req.headers.get("x-real-ip")?.trim() || "unknown";
}

/**
 * Fixed-window in-memory rate limit.
 * Best-effort protection for public endpoints; replace with shared store for multi-instance setups.
 */
export function rateLimitResponse(
  req: Request,
  opts: { key: string; limit: number; windowMs: number },
): NextResponse | null {
  const now = Date.now();
  const store = getStore();
  const bucketKey = `${opts.key}:${clientIp(req)}`;
  const existing = store.get(bucketKey);

  if (!existing || existing.resetAt <= now) {
    store.set(bucketKey, { count: 1, resetAt: now + opts.windowMs });
    return null;
  }

  existing.count += 1;
  if (existing.count <= opts.limit) return null;

  // Cheap opportunistic cleanup so the map does not grow forever.
  if (store.size > 5000) {
    for (const [k, v] of store) {
      if (v.resetAt <= now) store.delete(k);
    }
  }

  const retryAfterSeconds = Math.max(1, Math.ceil((existing.resetAt - now) / 1000));
  return NextResponse.json(
    { error: "Too many requests. Please try again soon." },
    { status: 429, headers: { "Retry-After": String(retryAfterSeconds) } },
  );
}
