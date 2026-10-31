# Product Requirements: Natterly Phase 1

| | |
|---|---|
| Owner | Product Owner (MahiKode) |
| Status | Phase 1 built; private beta |
| Last updated | 2026-10-31 |

## 1. Problem
Many people speak English well enough on paper but freeze, ramble or sound unnatural in real conversations: small talk with locals, meetings, interviews, presentations. Classroom and app practice rarely sounds like the real UK, where accents and slang vary street by street. Human tutors are expensive and hard to schedule.

## 2. Target users
Any English speaker who wants to become more **fluent, articulate and professional**:
- **Newcomers to the UK**: students, NHS and IT workers who want to understand regional accents and slang.
- **Professionals**: running meetings, interviews, giving updates.
- **Presenters and stage speakers**: rehearsing talks with coaching.
- **Curious learners**: who enjoy talking about the news and culture.

## 3. Goals (Phase 1)
1. A learner can hold a voice conversation with a regional Local within 30 seconds of opening the app.
2. A learner gets actionable feedback after every session.
3. A learner can hear and discuss current news or any topic.
4. Running cost stays near zero for a small beta (target < £0.01 per session of AI cost).

**Non-goals for Phase 1:** user accounts, payments, multi-avatar rooms, friends in a room, native app store builds, premium accent voices. (See [roadmap](roadmap.md).)

## 4. Features and user stories

### 4.1 Cuppa: one-to-one conversation
- *As a learner, I can choose a Local and a scenario, so I practise the situation I care about.*
  - Given I'm on Cuppa, when I pick "Dave · Birmingham" and "Job interview" and press Start, the Local greets me in character within ~2 s.
- *As a learner, I can speak instead of typing.*
  - Given a supported browser, when I tap the mic and talk, my words appear live and are sent when I pause.
  - Given an unsupported browser (Firefox), I see a typing box with a hint explaining which browsers support voice.
- *As a learner, I hear the Local's reply spoken aloud* and can turn voice off.
- *As a learner, I can hide subtitles* (Listening mode) to train my ear.
- *As a learner, I can open the Local's Phrasebook* to understand slang.

### 4.2 The Briefing: interactive narrator
- *As a learner, I pick a news topic (UK, India, World, AI & tech, Business, Science) or type any topic, and choose a presenter.*
  - Given I choose "UK news", the app gathers current headlines and the presenter narrates 3–4 stories in about a minute, naming the source of each.
  - Given I type "Egyptian culture", the app uses encyclopedia sources and the presenter explains it.
- *As a learner, I can ask follow-up questions by voice.* Answers stay grounded in the sources; if something isn't covered, the presenter says so.
- *As a learner, I can see the sources* with links.

### 4.3 Playback: feedback report
- *As a learner, when I finish a session, I see my report:* words spoken, pace (wpm), fillers per 100 words with the top fillers, clarity (speech-recognition confidence), vocabulary variety.
- *…and coaching:* a summary, strengths, up to 4 "you said → better" rephrasings with reasons, and phrases to try next time.
- *As a learner, I can review past sessions and delete any of them.*

### 4.4 Platform
- Works on phone and desktop browsers; installable as an app (PWA).
- Sleek, minimal UI with light and dark mode.
- Private beta protection: optional access code and hourly rate limit.

## 5. Success metrics (beta)
| Metric | Target |
|---|---|
| Sessions with ≥ 5 learner turns | ≥ 50 % |
| Learners returning within 7 days | ≥ 30 % |
| "Feedback was useful" (survey) | ≥ 4 / 5 |
| AI cost per session | < £0.01 |

## 6. Risks
| Risk | Mitigation |
|---|---|
| Browser voices don't sound regional | Persona text carries the dialect; premium regional TTS in Phase 2 (ADR-0004). |
| Accents feel like caricatures | Persona-writing rules; native-speaker review before launch. |
| Public URL abused → API bill | Access code + rate limit (ADR-0006); spend cap at the provider. |
| News sources change or block | Several feeds per topic; failures degrade gracefully. |
| Privacy | No accounts; transcripts stay on device except when sent for a reply or feedback. |
