import { describe, expect, it } from "vitest";
import { cleanText, parseFeed } from "./rss";

const RSS = `<?xml version="1.0"?>
<rss version="2.0"><channel><title>BBC</title>
  <item><title><![CDATA[Trains disrupted by storm]]></title><description>Commuters face &amp; delays.</description><link>https://bbc.co.uk/1</link><pubDate>Fri, 30 Oct 2026 08:00:00 GMT</pubDate></item>
  <item><title>Second story</title><description><![CDATA[<p>With <b>HTML</b></p>]]></description><link>https://bbc.co.uk/2</link></item>
</channel></rss>`;

const ATOM = `<?xml version="1.0"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <entry><title>Atom story</title><summary>Short summary</summary><link href="https://example.com/a"/><updated>2026-10-30T08:00:00Z</updated></entry>
</feed>`;

describe("parseFeed", () => {
  it("parses RSS items and cleans HTML", () => {
    const items = parseFeed(RSS, "BBC News");
    expect(items).toHaveLength(2);
    expect(items[0]).toMatchObject({ title: "Trains disrupted by storm", summary: "Commuters face & delays.", url: "https://bbc.co.uk/1", source: "BBC News" });
    expect(items[1].summary).toBe("With HTML");
  });

  it("parses Atom entries", () => {
    const items = parseFeed(ATOM, "Example");
    expect(items[0]).toMatchObject({ title: "Atom story", url: "https://example.com/a", published: "2026-10-30T08:00:00Z" });
  });

  it("respects the limit and tolerates junk", () => {
    expect(parseFeed(RSS, "BBC", 1)).toHaveLength(1);
    expect(parseFeed("<html></html>", "x")).toEqual([]);
  });
});

describe("cleanText", () => {
  it("strips tags and decodes common entities", () => {
    expect(cleanText("<b>Tea</b> &amp; biscuits&nbsp;&#39;n&#39; more")).toBe("Tea & biscuits 'n' more");
    expect(cleanText(undefined)).toBe("");
  });
});
