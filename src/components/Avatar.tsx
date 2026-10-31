import type { Persona } from "@/lib/personas/types";

const SIZES = { sm: "h-9 w-9 text-lg", md: "h-12 w-12 text-2xl", lg: "h-20 w-20 text-4xl" } as const;

export function Avatar({ persona, size = "md", speaking = false }: { persona: Persona; size?: keyof typeof SIZES; speaking?: boolean }) {
  return (
    <div
      aria-hidden
      className={`grid shrink-0 place-items-center rounded-full bg-gradient-to-br ${persona.gradient} ${SIZES[size]} ${
        speaking ? "animate-pulse-ring" : ""
      }`}
    >
      {persona.emoji}
    </div>
  );
}
