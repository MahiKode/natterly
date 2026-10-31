/**
 * A "Local" is an AI conversation partner with a regional voice and personality.
 *
 * Personas are plain data on purpose: adding a new Local means adding one object
 * to `personas.ts` — no new components or API routes. See
 * docs/handbook/04-how-to/add-a-local.md.
 */
export interface Persona {
  /** URL-safe, stable identifier. Never rename once shipped (it is stored in user history). */
  id: string;
  name: string;
  /** Short label shown on the card, e.g. "Birmingham (Brummie)". */
  accentLabel: string;
  /** One-line description shown in the gallery. */
  tagline: string;
  /** Emoji used as the avatar until we commission illustrations. */
  emoji: string;
  /** Tailwind gradient classes for the avatar badge. */
  gradient: string;
  /** Who this person is — fed to the AI. Keep it warm and respectful, never a caricature. */
  background: string;
  /** How they talk: rhythm, typical phrases, slang. */
  speechStyle: string;
  /** A few authentic phrases the learner may hear; shown in the "Phrasebook" panel. */
  phrasebook: { phrase: string; meaning: string }[];
  /** Browser text-to-speech hints. Real regional voices arrive with premium TTS (ADR-0004). */
  voice: {
    /** BCP-47 language tag used to pick a system voice. */
    lang: string;
    /** 0.1–10, 1 is normal. */
    rate: number;
    /** 0–2, 1 is normal. */
    pitch: number;
    /** Preferred voice gender, used as a soft hint when choosing among system voices. */
    gender: "female" | "male";
    /** Installed voice names to try first, e.g. "Fiona" (Scottish voice on Apple devices). */
    preferredVoices?: string[];
  };
}

/** A scenario frames the conversation (casual chat, job interview, keynote rehearsal…). */
export interface Scenario {
  id: string;
  title: string;
  emoji: string;
  description: string;
  /** Instructions appended to the persona prompt. */
  brief: string;
  /** Who usually starts: in some scenarios the Local opens, in others the learner does. */
  localOpens: boolean;
}
