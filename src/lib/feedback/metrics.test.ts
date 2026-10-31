import { describe, expect, it } from "vitest";
import { computeMetrics, countFillers, describePace } from "./metrics";

describe("countFillers", () => {
  it("counts single and two-word fillers without double counting", () => {
    const counts = countFillers("Um, I mean, it was kind of, like, really good, you know?");
    expect(Object.fromEntries(counts)).toEqual({ um: 1, "i mean": 1, "kind of": 1, like: 1, "you know": 1 });
  });

  it("does not count 'like' used as a verb", () => {
    expect(countFillers("I like tea and we really like London").size).toBe(0);
    expect(countFillers("I'd like a coffee").size).toBe(0);
  });

  it("returns an empty map for clean speech", () => {
    expect(countFillers("The quarterly results were strong.").size).toBe(0);
  });
});

describe("computeMetrics", () => {
  it("computes pace from spoken turns only", () => {
    const m = computeMetrics([
      { text: "one two three four five six seven eight nine ten", durationSec: 5, confidence: 0.9 },
      { text: "typed reply with five words", durationSec: 0 },
    ]);
    expect(m.wordsPerMinute).toBe(120);
    expect(m.totalWords).toBe(15);
    expect(m.spokenTurns).toBe(1);
    expect(m.clarityScore).toBe(90);
  });

  it("handles an empty session", () => {
    const m = computeMetrics([]);
    expect(m.wordsPerMinute).toBeNull();
    expect(m.fillerRate).toBe(0);
    expect(m.clarityScore).toBeNull();
  });
});

describe("describePace", () => {
  it("buckets pace", () => {
    expect(describePace(null)).toMatch(/Speak/);
    expect(describePace(80)).toMatch(/slow/);
    expect(describePace(140)).toMatch(/natural/);
    expect(describePace(200)).toMatch(/fast/);
  });
});
