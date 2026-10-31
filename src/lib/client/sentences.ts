/**
 * Split streamed text into complete sentences plus an unfinished remainder.
 *
 * A sentence ends at . ! ? or … (possibly repeated, possibly followed by a closing
 * quote or bracket) **followed by whitespace**. Requiring whitespace means "3.5" or
 * "e.g." mid-stream isn't split too early; the final sentence is spoken by flush().
 */
const SENTENCE = /[\s\S]*?[.!?…]+["'”’)]?\s+/y;

export function splitSentences(buffer: string): { sentences: string[]; rest: string } {
  const sentences: string[] = [];
  SENTENCE.lastIndex = 0;
  let consumed = 0;
  let match: RegExpExecArray | null;
  while ((match = SENTENCE.exec(buffer))) {
    sentences.push(match[0].trim());
    consumed = SENTENCE.lastIndex;
  }
  return { sentences, rest: buffer.slice(consumed) };
}
