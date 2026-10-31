import { BriefingRequestSchema } from "@/lib/api-schema";
import { gatherBriefing } from "@/lib/news/gather";
import { guardRequest, jsonError } from "@/lib/server/guard";

/**
 * POST /api/briefing — gather source material for a topic (no AI, free).
 * The browser then sends the result to /api/chat (mode "briefing") for narration.
 */
export async function POST(req: Request) {
  const guard = guardRequest(req);
  if (!guard.ok) return jsonError(guard.status, guard.message);

  const parsed = BriefingRequestSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return jsonError(400, "Invalid request.");

  try {
    return Response.json(await gatherBriefing(parsed.data));
  } catch (e) {
    console.error("briefing gather failed", e);
    return jsonError(502, e instanceof Error ? e.message : "Couldn't gather that topic right now.");
  }
}
