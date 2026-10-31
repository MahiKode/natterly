# 6. Glossary

| Term | Meaning |
|---|---|
| **Local** | An AI conversation persona (e.g. Dave, the Brummie cabbie). |
| **Scenario** | The situation framing a chat (casual, shop, meeting, interview, stage, debate). |
| **Cuppa** | One-to-one conversation feature. |
| **The Briefing** | News/topic narrator feature with Q&A. |
| **Playback** | Post-session feedback report. |
| **Phrasebook** | A Local's slang list with meanings. |
| **Listening mode** | Subtitles hidden so the learner practises listening. |
| **Huddle / Soapbox** | Future multi-Local room / debate mode (Phase 3). |
| **AI gateway** | `src/lib/ai/`: the only code that calls an LLM provider. |
| **STT / TTS** | Speech-to-text / text-to-speech. |
| **Web Speech API** | Browser-built-in STT (`SpeechRecognition`) and TTS (`speechSynthesis`). |
| **NDJSON** | Newline-delimited JSON: one JSON object per line, used for streaming replies. |
| **Prompt caching** | The AI provider reuses an unchanged prompt prefix more cheaply. Requires deterministic prompts. |
| **Effort** | Claude setting trading thinking depth for speed/cost (`low` for chat). |
| **Structured output** | Asking the model to return JSON matching a schema (used for feedback). |
| **wpm** | Words per minute. Conversational English is roughly 120–160. |
| **Filler** | Words like "um", "like", "you know" that add no meaning. |
| **Clarity** | Average speech-recognition confidence: a rough proxy for clear pronunciation. |
| **ADR** | Architecture Decision Record (`docs/adr/`). |
| **PWA** | Progressive Web App: a website installable like an app. |
| **RP** | Received Pronunciation: the "standard" southern British accent. |
