"use client";

import type { ChatMessage, ChatRequest, CoachFeedback, StreamEvent } from "@/lib/api-schema";
import type { Briefing } from "@/lib/news/types";

/**
 * Browser-side API helpers. All AI calls go through here so the beta access code
 * header and error handling live in one place.
 */

const ACCESS_KEY = "natterly.accessCode";
export const ACCESS_REQUIRED_EVENT = "natterly:access-required";

export function getAccessCode(): string {
  try {
    return localStorage.getItem(ACCESS_KEY) ?? "";
  } catch {
    return "";
  }
}

export function setAccessCode(code: string) {
  try {
    localStorage.setItem(ACCESS_KEY, code.trim());
  } catch {
    // Storage blocked (private mode): the code only lasts for this page view.
  }
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

async function post(path: string, body: unknown, signal?: AbortSignal): Promise<Response> {
  const res = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-natterly-access": getAccessCode() },
    body: JSON.stringify(body),
    signal,
  });
  if (!res.ok) {
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    if (res.status === 401) window.dispatchEvent(new Event(ACCESS_REQUIRED_EVENT));
    throw new ApiError(data.error ?? `Request failed (${res.status})`, res.status);
  }
  return res;
}

/** Stream a Local's reply. `onText` receives text chunks as they arrive. Returns the full reply. */
export async function streamChat(
  request: ChatRequest,
  onText: (chunk: string) => void,
  signal?: AbortSignal,
): Promise<string> {
  const res = await post("/api/chat", request, signal);
  const reader = res.body!.pipeThrough(new TextDecoderStream()).getReader();
  let buffer = "";
  let full = "";
  let finished = false;
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += value;
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? ""; // the last piece may be an incomplete line
    for (const line of lines) {
      if (!line.trim()) continue;
      const event = parseEvent(line);
      if (event.type === "text") {
        full += event.text;
        onText(event.text);
      } else if (event.type === "error") {
        throw new ApiError(event.message, 502);
      } else {
        finished = true;
      }
    }
  }
  // No "done" event means the connection was cut: don't save a half reply as if it were complete.
  if (!finished) throw new ApiError("The reply was cut off. Please try again.", 502);
  return full;
}

function parseEvent(line: string): StreamEvent {
  try {
    return JSON.parse(line) as StreamEvent;
  } catch {
    throw new ApiError("Received a garbled reply. Please try again.", 502);
  }
}

export async function fetchBriefing(input: { topicId?: string; query?: string }): Promise<Briefing> {
  return (await post("/api/briefing", input)).json();
}

/** Feedback looks at the most recent turns only (keeps the request inside the API's limits). */
export const MAX_TURNS_FOR_FEEDBACK = 40;

export async function fetchFeedback(input: {
  personaId: string;
  scenarioTitle: string;
  messages: ChatMessage[];
}): Promise<CoachFeedback> {
  const body = { ...input, messages: input.messages.slice(-MAX_TURNS_FOR_FEEDBACK) };
  return (await post("/api/feedback", body)).json();
}
