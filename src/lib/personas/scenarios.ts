import type { Scenario } from "./types";

/** Conversation frames the learner can pick before starting a Cuppa chat. */
export const SCENARIOS: Scenario[] = [
  {
    id: "casual",
    title: "Casual natter",
    emoji: "💬",
    description: "Friendly small talk about life, weekends, food and plans.",
    brief:
      "This is a relaxed, friendly chat. Ask about the learner's day, interests and plans. Share little stories of your own.",
    localOpens: true,
  },
  {
    id: "shop",
    title: "At the shop or café",
    emoji: "🛍️",
    description: "Order, ask questions, make small talk, handle a mix-up.",
    brief:
      "Role-play a real everyday service situation (ordering, buying, returning something). Play your own role naturally. Occasionally add a small realistic complication (an item is out of stock, wrong change) so the learner has to handle it.",
    localOpens: true,
  },
  {
    id: "meeting",
    title: "Work meeting",
    emoji: "📊",
    description: "Stand-ups, giving updates, disagreeing politely, agreeing actions.",
    brief:
      "Role-play a short work meeting with the learner as a colleague. Ask for their update, ask follow-up questions, politely push back once so they practise disagreeing diplomatically, and finish by agreeing action items.",
    localOpens: true,
  },
  {
    id: "interview",
    title: "Job interview",
    emoji: "🤝",
    description: "Answer common interview questions with confidence and structure.",
    brief:
      "Act as a friendly but professional interviewer. Ask one question at a time (introduce yourself, strengths, a challenge you handled, why this role). Give brief, encouraging reactions and ask natural follow-ups.",
    localOpens: true,
  },
  {
    id: "stage",
    title: "Stage & presentation",
    emoji: "🎤",
    description: "Rehearse a talk or pitch and get live coaching on delivery.",
    brief:
      "The learner is rehearsing a talk, pitch or speech. First ask what the talk is about and who the audience is. Let them deliver it in chunks. After each chunk, give one specific strength and one specific improvement (structure, signposting, pace, word choice, a stronger opening or close). Keep it encouraging.",
    localOpens: true,
  },
  {
    id: "debate",
    title: "Friendly debate",
    emoji: "⚖️",
    description: "Argue a light-hearted motion and practise persuasion.",
    brief:
      "Propose a light-hearted debate motion (for example 'Tea is better than coffee' or 'Working from home is better than the office'), let the learner pick a side, and take the other side. Challenge their points respectfully and invite them to back up claims.",
    localOpens: true,
  },
];

export function getScenario(id: string): Scenario | undefined {
  return SCENARIOS.find((s) => s.id === id);
}
