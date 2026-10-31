import { describe, expect, it } from "vitest";
import { checkRateLimit, clientIp } from "./guard";

describe("checkRateLimit", () => {
  it("allows up to the limit then blocks until the window resets", () => {
    const now = 1_000_000;
    expect(checkRateLimit("ip-a", 2, now).ok).toBe(true);
    expect(checkRateLimit("ip-a", 2, now + 1).ok).toBe(true);
    const blocked = checkRateLimit("ip-a", 2, now + 2);
    expect(blocked).toMatchObject({ ok: false, status: 429 });
    expect(checkRateLimit("ip-a", 2, now + 60 * 60 * 1000 + 1).ok).toBe(true);
  });

  it("tracks clients separately", () => {
    expect(checkRateLimit("ip-b", 1, 0).ok).toBe(true);
    expect(checkRateLimit("ip-c", 1, 0).ok).toBe(true);
  });
});

describe("clientIp", () => {
  const req = (headers: Record<string, string>) => new Request("http://x", { headers });

  it("uses the right-most x-forwarded-for hop (the one our proxy added)", () => {
    expect(clientIp(req({ "x-forwarded-for": "1.1.1.1, 2.2.2.2" }))).toBe("2.2.2.2");
  });

  it("falls back to x-real-ip, then 'local'", () => {
    expect(clientIp(req({ "x-real-ip": "3.3.3.3" }))).toBe("3.3.3.3");
    expect(clientIp(req({}))).toBe("local");
  });
});
