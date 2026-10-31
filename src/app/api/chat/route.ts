import Anthropic from "@anthropic-ai/sdk";
import { getAnthropic, MissingKeyError, MODELS } from "@/lib/ai/client";
import { buildBriefingSystemPrompt, buildChatSystemPrompt, buildNarrationRequest } from "@/lib/ai/prompts";
import { mergeConsecutive, withOpeningCue } from "@/lib/ai/messages";
import { ChatRequestSchema, type ChatMessage, type StreamEvent } from "@/lib/api-schema";
import { briefingToContext } from "@/lib/news/gather";
import { getPersona } from "@/lib/personas/personas";
import { getScenario } from "@/lib/personas/scenarios";
import { guardRequest, jsonError } from "@/lib/server/guard";

/**
 * POST /api/chat — one conversational turn with a Local, streamed back as NDJSON.
 * Used by both Cuppa (mode "chat") and The Briefing (mode "briefing").
 * See docs/handbook/02-architecture.md → "How a voice message flows".
 */

// Only the most recent turns are sent, which caps cost per message on long chats.
const MAX_HISTORY = 24;
const JOIN_CUE = "[The learner has just joined. Greet them and open the conversation in character.]";

export async function POST(req: Request) {
  const guard = guardRequest(req);
  if (!guard.ok) return jsonError(guard.status, guard.message);

  const parsed = ChatRequestSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return jsonError(400, "Invalid request.");
  const body = parsed.data;

  const persona = getPersona(body.personaId);
  if (!persona) return jsonError(400, "Unknown Local.");

  let system: string;
  let messages: ChatMessage[];
  if (body.mode === "chat") {
    const scenario = getScenario(body.scenarioId);
    if (!scenario) return jsonError(400, "Unknown scenario.");
    system = buildChatSystemPrompt(persona, scenario);
    messages = withOpeningCue(body.messages.slice(-MAX_HISTORY), JOIN_CUE);
  } else {
    system = buildBriefingSystemPrompt(persona);
    // The source material always travels as the (hidden) first user turn, so follow-up
    // questions stay grounded in it.
    const narration = buildNarrationRequest(body.briefing.topic, briefingToContext(body.briefing));
    messages = [{ role: "user", content: narration }, ...body.messages.slice(-MAX_HISTORY)];
  }

  let client: Anthropic;
  try {
    client = getAnthropic();
  } catch (e) {
    if (e instanceof MissingKeyError) return jsonError(500, e.message);
    throw e;
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (event: StreamEvent) => controller.enqueue(encoder.encode(JSON.stringify(event) + "\n"));
      try {
        const response = client.messages.stream(
          {
            model: MODELS.chat,
            max_tokens: 2048,
            // Chat replies are short; low effort keeps latency and cost down.
            output_config: { effort: "low" },
            // Automatic prompt caching of the growing conversation prefix.
            cache_control: { type: "ephemeral" },
            system,
            messages: mergeConsecutive(messages),
          },
          { signal: req.signal },
        );
        for await (const event of response) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            send({ type: "text", text: event.delta.text });
          }
        }
        const final = await response.finalMessage();
        if (final.stop_reason === "refusal") {
          send({ type: "text", text: " Let's talk about something else, shall we?" });
        }
        send({ type: "done" });
      } catch (e) {
        send({ type: "error", message: describeError(e) });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "application/x-ndjson; charset=utf-8", "Cache-Control": "no-store" },
  });
}

function describeError(e: unknown): string {
  if (e instanceof Anthropic.RateLimitError) return "The AI service is busy. Please try again in a moment.";
  if (e instanceof Anthropic.AuthenticationError) return "The server's AI key is invalid. Please tell the admin.";
  if (e instanceof Anthropic.APIError) return "The AI service had a problem. Please try again.";
  if (e instanceof Error && e.name === "AbortError") return "Stopped.";
  console.error("chat route error", e);
  return "Something went wrong. Please try again.";
}
