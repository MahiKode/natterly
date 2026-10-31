import type { ChatMessage } from "@/lib/api-schema";

/** The API requires the first message to be from the user; Locals often speak first. */
export function withOpeningCue(messages: ChatMessage[], cue: string): ChatMessage[] {
  if (messages.length === 0 || messages[0].role === "assistant") {
    return [{ role: "user", content: cue }, ...messages];
  }
  return messages;
}

/** Defensive: join accidental back-to-back turns from the same speaker (e.g. after a failed reply). */
export function mergeConsecutive(messages: ChatMessage[]): ChatMessage[] {
  const out: ChatMessage[] = [];
  for (const m of messages) {
    const last = out[out.length - 1];
    if (last && last.role === m.role) last.content += `\n${m.content}`;
    else out.push({ ...m });
  }
  return out;
}
