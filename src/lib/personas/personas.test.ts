import { describe, expect, it } from "vitest";
import { buildChatSystemPrompt } from "@/lib/ai/prompts";
import { PERSONAS } from "./personas";
import { SCENARIOS } from "./scenarios";

describe("persona catalogue", () => {
  it("has unique, URL-safe ids", () => {
    const ids = PERSONAS.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id).toMatch(/^[a-z0-9-]+$/);
  });

  it("gives every persona a phrasebook and sane voice settings", () => {
    for (const p of PERSONAS) {
      expect(p.phrasebook.length).toBeGreaterThan(0);
      expect(p.voice.rate).toBeGreaterThan(0.5);
      expect(p.voice.rate).toBeLessThan(1.5);
    }
  });

  it("builds deterministic prompts (required for prompt caching)", () => {
    const a = buildChatSystemPrompt(PERSONAS[0], SCENARIOS[0]);
    const b = buildChatSystemPrompt(PERSONAS[0], SCENARIOS[0]);
    expect(a).toBe(b);
    expect(a).toContain(PERSONAS[0].name);
  });
});
