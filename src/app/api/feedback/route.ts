import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { getAnthropic, MissingKeyError, MODELS } from "@/lib/ai/client";
import { FEEDBACK_SYSTEM_PROMPT } from "@/lib/ai/prompts";
import { CoachFeedbackSchema, FeedbackRequestSchema } from "@/lib/api-schema";
import { getPersona } from "@/lib/personas/personas";
import { guardRequest, jsonError } from "@/lib/server/guard";

/**
 * POST /api/feedback — one AI call per session that turns the learner's lines into
 * coaching (the "Playback" report). Numbers like pace and fillers are computed on-device.
 */
export async function POST(req: Request) {
  const guard = guardRequest(req);
  if (!guard.ok) return jsonError(guard.status, guard.message);

  const parsed = FeedbackRequestSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return jsonError(400, "Invalid request.");
  const { personaId, scenarioTitle, messages } = parsed.data;
  const persona = getPersona(personaId);

  const transcript = messages
    .map((m) => `${m.role === "user" ? "LEARNER" : (persona?.name ?? "PARTNER").toUpperCase()}: ${m.content}`)
    .join("\n");

  try {
    const response = await getAnthropic().messages.parse({
      model: MODELS.feedback,
      max_tokens: 4096,
      output_config: { effort: "medium", format: zodOutputFormat(CoachFeedbackSchema) },
      system: FEEDBACK_SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Scenario: ${scenarioTitle}\n\nConversation transcript:\n${transcript}\n\nGive feedback on the LEARNER's English only.`,
        },
      ],
    });
    if (response.stop_reason === "refusal" || !response.parsed_output) {
      return jsonError(502, "Couldn't create feedback for this session.");
    }
    return Response.json(response.parsed_output);
  } catch (e) {
    if (e instanceof MissingKeyError) return jsonError(500, e.message);
    if (e instanceof Anthropic.RateLimitError) return jsonError(429, "The AI service is busy. Please try again shortly.");
    console.error("feedback route error", e);
    return jsonError(502, "Couldn't create feedback right now.");
  }
}
