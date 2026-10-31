import "server-only";
import Anthropic from "@anthropic-ai/sdk";

/**
 * The AI gateway: the ONLY place the app talks to an LLM provider.
 * Swapping or adding a provider later means changing this folder, not the routes (ADR-0003).
 */

/** Cheapest capable model by default; override per deployment via env vars. */
export const MODELS = {
  chat: process.env.NATTERLY_CHAT_MODEL ?? "claude-haiku-5-5",
  feedback: process.env.NATTERLY_FEEDBACK_MODEL ?? "claude-haiku-5-5",
} as const;

let client: Anthropic | undefined;

export function getAnthropic(): Anthropic {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new MissingKeyError();
  }
  client ??= new Anthropic();
  return client;
}

export class MissingKeyError extends Error {
  constructor() {
    super("ANTHROPIC_API_KEY is not set. Add your key to .env.local (copy .env.example if you haven't), then restart the server.");
  }
}
