import { describe, expect, it } from "vitest";
import { splitSentences } from "./sentences";

describe("splitSentences", () => {
  it("returns one entry per complete sentence and keeps the unfinished tail", () => {
    expect(splitSentences("Ay up! How are you? I'm grand. And yo")).toEqual({
      sentences: ["Ay up!", "How are you?", "I'm grand."],
      rest: "And yo",
    });
  });

  it("waits for whitespace so decimals and a trailing full stop are not split early", () => {
    expect(splitSentences("It costs 3.5 quid.")).toEqual({ sentences: [], rest: "It costs 3.5 quid." });
  });

  it("handles closing quotes, ellipses and repeated punctuation", () => {
    expect(splitSentences("She said “sorted.” Well… Really?! Ok").sentences).toEqual(["She said “sorted.”", "Well…", "Really?!"]);
  });

  it("returns nothing for an empty buffer", () => {
    expect(splitSentences("")).toEqual({ sentences: [], rest: "" });
  });
});
