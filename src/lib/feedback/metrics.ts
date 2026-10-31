/**
 * Free, on-device speaking metrics for the Playback report.
 * No AI involved: these run in the browser on the learner's own transcripts.
 */

export interface SpokenTurn {
  text: string;
  /** Seconds the learner spent speaking this turn (0 if typed). */
  durationSec: number;
  /** Speech-recognition confidence 0–1, when the browser provides it. */
  confidence?: number;
}

export interface SpeakingMetrics {
  turns: number;
  spokenTurns: number;
  totalWords: number;
  /** Words per minute across spoken turns, or null if nothing was spoken. */
  wordsPerMinute: number | null;
  fillerCount: number;
  /** Filler words per 100 words. */
  fillerRate: number;
  topFillers: { word: string; count: number }[];
  /** Unique words / total words (0–1). Higher means more varied vocabulary. */
  vocabularyVariety: number;
  avgWordsPerTurn: number;
  /** Average speech-recognition confidence (0–100), a rough clarity signal. Null if unavailable. */
  clarityScore: number | null;
}

const TWO_WORD_FILLERS = new Set(["you know", "i mean", "sort of", "kind of"]);
const ONE_WORD_FILLERS = new Set(["basically", "literally", "actually", "um", "umm", "uh", "uhh", "er", "erm", "hmm", "like"]);
/** Words that, right before "like", mean it's the verb ("I like tea"), not a filler. */
const LIKE_AS_VERB_BEFORE = new Set(["i", "you", "we", "they", "would", "don't", "didn't", "really", "to", "i'd", "you'd", "we'd"]);

export function countWords(text: string): number {
  return tokenize(text).length;
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9'\s-]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

/**
 * Count filler words/phrases. Two-word fillers win over their parts ("kind of" is one filler).
 * Note: "like" is also a real verb ("I like tea"), so it is only counted when it is not
 * preceded by a subject pronoun — a cheap heuristic that is right most of the time.
 */
export function countFillers(text: string): Map<string, number> {
  const words = tokenize(text);
  const counts = new Map<string, number>();
  const add = (w: string) => counts.set(w, (counts.get(w) ?? 0) + 1);

  for (let i = 0; i < words.length; i++) {
    const pair = `${words[i]} ${words[i + 1] ?? ""}`;
    if (TWO_WORD_FILLERS.has(pair)) {
      add(pair);
      i++;
    } else if (ONE_WORD_FILLERS.has(words[i])) {
      if (words[i] === "like" && LIKE_AS_VERB_BEFORE.has(words[i - 1] ?? "")) continue;
      add(words[i]);
    }
  }
  return counts;
}


export function computeMetrics(turns: SpokenTurn[]): SpeakingMetrics {
  const allWords = turns.flatMap((t) => tokenize(t.text));
  const totalWords = allWords.length;

  const spoken = turns.filter((t) => t.durationSec > 0);
  const spokenWords = spoken.reduce((n, t) => n + countWords(t.text), 0);
  const spokenSeconds = spoken.reduce((n, t) => n + t.durationSec, 0);

  const fillerTotals = new Map<string, number>();
  for (const t of turns) {
    for (const [word, count] of countFillers(t.text)) fillerTotals.set(word, (fillerTotals.get(word) ?? 0) + count);
  }
  const fillerCount = [...fillerTotals.values()].reduce((a, b) => a + b, 0);

  const confidences = turns.map((t) => t.confidence).filter((c): c is number => typeof c === "number" && c > 0);

  return {
    turns: turns.length,
    spokenTurns: spoken.length,
    totalWords,
    wordsPerMinute: spokenSeconds >= 3 ? Math.round((spokenWords / spokenSeconds) * 60) : null,
    fillerCount,
    fillerRate: totalWords ? round1((fillerCount / totalWords) * 100) : 0,
    topFillers: [...fillerTotals.entries()]
      .map(([word, count]) => ({ word, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5),
    vocabularyVariety: totalWords ? round2(new Set(allWords).size / totalWords) : 0,
    avgWordsPerTurn: turns.length ? round1(totalWords / turns.length) : 0,
    clarityScore: confidences.length
      ? Math.round((confidences.reduce((a, b) => a + b, 0) / confidences.length) * 100)
      : null,
  };
}

/** Plain-English verdict on speaking pace. Conversational English is roughly 120–160 wpm. */
export function describePace(wpm: number | null): string {
  if (wpm === null) return "Speak a few turns to measure your pace.";
  if (wpm < 100) return "A bit slow — try linking your words more smoothly.";
  if (wpm <= 165) return "A natural conversational pace. Nice!";
  return "Quite fast — slow down and add pauses so listeners can follow.";
}

const round1 = (n: number) => Math.round(n * 10) / 10;
const round2 = (n: number) => Math.round(n * 100) / 100;
