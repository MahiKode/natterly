import { notFound } from "next/navigation";
import { getPersona } from "@/lib/personas/personas";
import { getScenario, SCENARIOS } from "@/lib/personas/scenarios";
import { CuppaChat } from "./CuppaChat";

export default async function CuppaChatPage({
  params,
  searchParams,
}: {
  params: Promise<{ personaId: string }>;
  searchParams: Promise<{ scenario?: string }>;
}) {
  const { personaId } = await params;
  const { scenario: scenarioId } = await searchParams;
  const persona = getPersona(personaId);
  if (!persona) notFound();
  const scenario = getScenario(scenarioId ?? "") ?? SCENARIOS[0];

  return <CuppaChat personaId={persona.id} scenarioId={scenario.id} />;
}
