# 1. Product overview

**Natterly** helps people speak English more fluently, naturally and professionally by talking to friendly AI characters ("**Locals**") with UK regional voices and personalities, then reviewing how they did.

## Names you'll see everywhere
| Name | What it is | Code |
|---|---|---|
| **Local** | An AI conversation partner (persona) | `src/lib/personas/personas.ts` |
| **Scenario** | The situation for a chat (casual, shop, meeting, interview, stage, debate) | `src/lib/personas/scenarios.ts` |
| **Cuppa** | One-to-one chat with a Local | `src/app/cuppa/` |
| **The Briefing** | A Local narrates news or any topic, then takes questions | `src/app/briefing/`, `src/lib/news/` |
| **Playback** | Post-session report: metrics + AI coaching | `src/app/playback/`, `src/lib/feedback/` |
| **Phrasebook** | A Local's slang with meanings, shown in chat | `persona.phrasebook` |
| **Listening mode** | Subtitles hidden to practise listening | `Conversation.tsx` |

## The Phase 1 Locals
| Local | Accent / role | Good for |
|---|---|---|
| Olivia | London barista | Casual chat, London slang |
| Dave | Birmingham (Brummie) cabbie | Regional accent, storytelling |
| Morag | Scottish (Glasgow) teacher | Scottish words, direct style |
| Priya | IT engineering manager | Meetings, workplace idioms |
| Raj | Leicester corner-shop owner | Shopping and everyday small talk |
| Jade | Gen-Z student (Manchester) | Young slang |
| Eleanor | RP speaking coach | Presentations, interviews, stage talks |

## Who it's for and what's next
See the [PRD](../product/PRD.md) and [roadmap](../product/roadmap.md).
