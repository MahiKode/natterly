import { describe, expect, it } from "vitest";
import { parseWikipedia } from "./wikipedia";

describe("parseWikipedia", () => {
  it("keeps search order and drops pages without text", () => {
    const items = parseWikipedia({
      query: {
        pages: {
          "2": { title: "Culture of Egypt", extract: "Egyptian culture has six thousand years of recorded history.", index: 1, fullurl: "https://en.wikipedia.org/wiki/Culture_of_Egypt" },
          "1": { title: "Ancient Egypt", extract: "Ancient Egypt was a civilization...", index: 2 },
          "3": { title: "Empty", extract: "  ", index: 3 },
        },
      },
    });
    expect(items.map((i) => i.title)).toEqual(["Culture of Egypt", "Ancient Egypt"]);
    expect(items[1].url).toBe("https://en.wikipedia.org/wiki/Ancient_Egypt");
    expect(items[0].source).toBe("Wikipedia");
  });

  it("handles no results", () => {
    expect(parseWikipedia({})).toEqual([]);
  });
});
