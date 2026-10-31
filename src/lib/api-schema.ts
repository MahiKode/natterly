import { z } from "zod";

/**
 * Limits here are deliberately generous; the client sends at most the last 24 chat turns
 * (useConversation.ts) and 40 turns for feedback (client/api.ts), so normal use never hits them.
 *
 * Request/response contracts shared by the API routes (server) and the UI (client).
 * Keeping them in one file means a contract change is a compile error on both sides.
 */

export const ChatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(4000),
});
export type ChatMessage = z.infer<typeof ChatMessageSchema>;

const SourceItemSchema = z.object({
  title: z.string().max(300),
  summary: z.string().max(2000),
  url: z.string().max(1000),
  source: z.string().max(100),
  published: z.string().max(100).optional(),
});

export const BriefingSchema = z.object({
  topic: z.string().min(1).max(200),
  kind: z.enum(["news", "explainer"]),
  items: z.array(SourceItemSchema).min(1).max(10),
});

export const ChatRequestSchema = z.discriminatedUnion("mode", [
  z.object({
    mode: z.literal("chat"),
    personaId: z.string().max(50),
    scenarioId: z.string().max(50),
    messages: z.array(ChatMessageSchema).max(60),
  }),
  z.object({
    mode: z.literal("briefing"),
    personaId: z.string().max(50),
    briefing: BriefingSchema,
    messages: z.array(ChatMessageSchema).max(60),
  }),
]);
export type ChatRequest = z.infer<typeof ChatRequestSchema>;

export const BriefingRequestSchema = z.object({
  topicId: z.string().max(50).optional(),
  query: z.string().max(200).optional(),
});

export const FeedbackRequestSchema = z.object({
  personaId: z.string().max(50),
  scenarioTitle: z.string().max(100),
  messages: z.array(ChatMessageSchema).min(1).max(60),
});

/** The AI part of the Playback report (the numbers are computed on-device). */
export const CoachFeedbackSchema = z.object({
  summary: z.string().describe("Two warm sentences summarising how the learner did."),
  strengths: z.array(z.string()).describe("1-3 specific things they did well."),
  improvements: z
    .array(
      z.object({
        youSaid: z.string().describe("A short quote of what the learner said."),
        better: z.string().describe("A more natural or professional way to say it."),
        why: z.string().describe("One short sentence explaining the change."),
      }),
    )
    .describe("Up to 4 concrete rephrasings, most useful first."),
  phrasesToTry: z.array(z.string()).describe("2-3 useful phrases to practise next time."),
});
export type CoachFeedback = z.infer<typeof CoachFeedbackSchema>;

/** Events streamed (as newline-delimited JSON) from /api/chat. */
export type StreamEvent = { type: "text"; text: string } | { type: "error"; message: string } | { type: "done" };
