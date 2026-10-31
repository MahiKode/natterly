import { describe, expect, it } from "vitest";
import { mergeConsecutive, withOpeningCue } from "./messages";

describe("withOpeningCue", () => {
  it("adds a user cue when the conversation is empty or starts with the Local", () => {
    expect(withOpeningCue([], "cue")).toEqual([{ role: "user", content: "cue" }]);
    expect(withOpeningCue([{ role: "assistant", content: "Hi" }], "cue")[0]).toEqual({ role: "user", content: "cue" });
  });

  it("leaves learner-first conversations alone", () => {
    const msgs = [{ role: "user" as const, content: "Hello" }];
    expect(withOpeningCue(msgs, "cue")).toBe(msgs);
  });
});

describe("mergeConsecutive", () => {
  it("joins back-to-back turns from the same speaker without mutating input", () => {
    const input = [
      { role: "user" as const, content: "a" },
      { role: "user" as const, content: "b" },
      { role: "assistant" as const, content: "c" },
    ];
    expect(mergeConsecutive(input)).toEqual([
      { role: "user", content: "a\nb" },
      { role: "assistant", content: "c" },
    ]);
    expect(input[0].content).toBe("a");
  });
});
