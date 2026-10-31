"use client";

import { useCallback } from "react";
import { Conversation } from "@/components/Conversation";
import type { ChatMessage } from "@/lib/api-schema";
import { getPersona } from "@/lib/personas/personas";
import { getScenario } from "@/lib/personas/scenarios";

/** Client wrapper: Conversation needs a request-builder function, which can't cross the server boundary. */
export function CuppaChat({ personaId, scenarioId }: { personaId: string; scenarioId: string }) {
  const persona = getPersona(personaId)!;
  const scenario = getScenario(scenarioId)!;

  const buildRequest = useCallback(
    (messages: ChatMessage[]) => ({ mode: "chat" as const, personaId, scenarioId, messages }),
    [personaId, scenarioId],
  );

  return (
    <Conversation
      kind="cuppa"
      persona={persona}
      title={`${scenario.emoji} ${scenario.title}`}
      buildRequest={buildRequest}
      localOpens={scenario.localOpens}
    />
  );
}
