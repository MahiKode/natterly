import { describe, expect, it } from "vitest";
import { checkRateLimit } from "./guard";

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
