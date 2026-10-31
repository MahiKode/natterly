import "server-only";

/**
 * Cheap protection for the AI endpoints so a public URL can't run up the API bill.
 *
 * - Access code: if NATTERLY_ACCESS_CODE is set, requests must send it in the
 *   `x-natterly-access` header (the UI asks once and remembers it).
 * - Rate limit: fixed one-hour window per client IP, kept in memory.
 *
 * In-memory limits reset when the server restarts and are per-instance on serverless
 * hosts. That is acceptable for the beta; Phase 2 moves this to Redis with user accounts.
 */

const WINDOW_MS = 60 * 60 * 1000;
const buckets = new Map<string, { count: number; resetAt: number }>();

export type GuardResult = { ok: true } | { ok: false; status: number; message: string };

export function guardRequest(req: Request): GuardResult {
  const code = process.env.NATTERLY_ACCESS_CODE;
  if (code && req.headers.get("x-natterly-access") !== code) {
    return { ok: false, status: 401, message: "Please enter your beta access code." };
  }

  const limit = Number(process.env.NATTERLY_RATE_LIMIT_PER_HOUR ?? 60);
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  return checkRateLimit(ip, limit, Date.now());
}

/** Exported for tests. */
export function checkRateLimit(key: string, limit: number, now: number): GuardResult {
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { ok: true };
  }
  if (bucket.count >= limit) {
    const minutes = Math.ceil((bucket.resetAt - now) / 60000);
    return { ok: false, status: 429, message: `You've reached the hourly practice limit. Try again in ${minutes} min.` };
  }
  bucket.count++;
  return { ok: true };
}

export function jsonError(status: number, message: string): Response {
  return Response.json({ error: message }, { status });
}
