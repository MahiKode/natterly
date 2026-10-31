import "server-only";
import { timingSafeEqual } from "node:crypto";

/**
 * Cheap protection for the API endpoints so a public URL can't run up the AI bill (ADR-0006).
 *
 * - Access code: if NATTERLY_ACCESS_CODE is set, requests must send it in the
 *   `x-natterly-access` header (the UI asks once and remembers it). This is the real lock.
 * - Rate limit: fixed one-hour window per client IP, kept in memory. A speed bump, not a wall:
 *   it resets on restart and is per-instance on serverless hosts. Phase 2 moves it to Redis.
 * - Body size: requests over MAX_BODY_BYTES are rejected before parsing.
 */

const WINDOW_MS = 60 * 60 * 1000;
const DEFAULT_LIMIT = 60;
/** Prune expired entries once the map gets this big, so memory can't grow forever. */
const PRUNE_AT = 5000;
export const MAX_BODY_BYTES = 64 * 1024;

const buckets = new Map<string, { count: number; resetAt: number }>();

export type GuardResult = { ok: true } | { ok: false; status: number; message: string };

export function guardRequest(req: Request): GuardResult {
  const code = process.env.NATTERLY_ACCESS_CODE;
  if (code && !safeEqual(req.headers.get("x-natterly-access") ?? "", code)) {
    return { ok: false, status: 401, message: "Please enter your beta access code." };
  }
  return checkRateLimit(clientIp(req), rateLimit(), Date.now());
}

/**
 * The client IP as seen by our hosting proxy. Proxies *append* the address they saw to
 * x-forwarded-for, so the right-most entry is the one a client can't fake. (On Vercel the
 * header is rewritten and holds just the client IP.) Hosts without a proxy fall back to "local".
 */
export function clientIp(req: Request): string {
  const hops = req.headers.get("x-forwarded-for")?.split(",").map((h) => h.trim()).filter(Boolean);
  return hops?.at(-1) ?? req.headers.get("x-real-ip") ?? "local";
}

function rateLimit(): number {
  const n = Number.parseInt(process.env.NATTERLY_RATE_LIMIT_PER_HOUR ?? "", 10);
  return Number.isFinite(n) && n > 0 ? n : DEFAULT_LIMIT;
}

/** Exported for tests. */
export function checkRateLimit(key: string, limit: number, now: number): GuardResult {
  if (buckets.size >= PRUNE_AT) {
    for (const [k, b] of buckets) if (b.resetAt <= now) buckets.delete(k);
  }
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

/** Compare secrets in constant time so the code can't be guessed by timing responses. */
function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

/** Read a JSON body, refusing oversized requests. Returns null if missing, too big or invalid. */
export async function readJsonBody(req: Request): Promise<unknown> {
  if (Number(req.headers.get("content-length") ?? 0) > MAX_BODY_BYTES) return null;
  const text = await req.text().catch(() => "");
  if (!text || text.length > MAX_BODY_BYTES) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export function jsonError(status: number, message: string): Response {
  return Response.json({ error: message }, { status });
}
