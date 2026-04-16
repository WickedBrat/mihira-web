# Ask Scripture Guide — Design Spec
**Date:** 2026-04-17  
**Feature:** Ask tab revamp  
**Working Name:** Aksha Scripture Guide  
**Approach:** Reposition Ask from persona-led oracle chat to scripture-grounded guidance product

---

## Overview

The current Ask experience is a strong atmospheric chat product, but it is optimized around a voiced intermediary persona. The next version should optimize for **trust, grounding, and repeat usefulness**.

The user should feel:

- "I can bring real life questions here."
- "The response is rooted in Hindu wisdom traditions."
- "The app is interpreting the texts for me, not inventing spiritual-sounding advice."

The product should not behave like a prophecy engine, an omniscient guru, or a universal substitute for professional help. It should behave like a **scripture-grounded wisdom companion** that helps users interpret timeless teachings in the context of modern life.

---

## Product Promise

### Core promise

`Bring a life question. Receive guidance grounded in Hindu sacred texts.`

### Product framing

The app should be described as:

- A wisdom companion rooted in Hindu scripture
- A modern interface for ancient guidance
- A guided interpretation layer across sacred texts, not a single-voice chatbot

### Non-goals

The product is not:

- A replacement for therapy, medicine, legal counsel, clergy, or financial advice
- A prophecy or fortune-telling system
- A generic motivational chatbot dressed in spiritual language
- A complete digitization of all Hindu scripture on day one
- A final authority on sectarian or doctrinal disputes

---

## Product Principles

### 1. Grounding over performance

Answers should be anchored to identifiable texts and passages. Sacred atmosphere matters, but source traceability matters more.

### 2. Interpretation over quotation dump

Users do not want a stack of verses without help. The app should interpret carefully, then cite clearly.

### 3. Practical action over abstraction

Every strong response should help the user act, reflect, or reframe within the next 24 hours.

### 4. Multiple texts when needed

Some life problems benefit from more than one scripture. The product should be able to synthesize and compare perspectives.

### 5. Explicit boundaries

On self-harm, abuse, medical, psychiatric, legal, and major financial questions, the product must redirect appropriately and avoid false authority.

---

## Recommended Product Identity

### Recommendation

Build a **scripture-grounded guide with a sacred interface**.

### Why

This preserves the premium, reverent tone of Aksha while making the product more defensible and trustworthy than a pure mystical-medium experience.

### Role of Narad

Narad can remain as a light framing device or host, but not the primary trust anchor. The authority should shift from:

- `Narad as answerer`

to:

- `Narad as curator of scriptural wisdom`

If the interface keeps Narad, he should introduce or contextualize the answer, not function as the answer's source of truth.

---

## User Problems To Solve

The first version should focus on recurring life-question categories:

- Confusion about duty, career, or right action
- Grief, detachment, loss, and endings
- Anxiety, restlessness, anger, and inner discipline
- Relationships, family tension, and communication
- Self-worth, contentment, money anxiety, and desire
- Purpose, devotion, meaning, and spiritual practice

Avoid claiming to solve "all of life" in product copy. Build confidence by solving the above categories extremely well.

---

## Target Experience

### User input

The user asks a freeform question such as:

- "I feel stuck in a job I do not respect, but I am afraid to leave."
- "I am angry at my parents and guilty about it."
- "How do I stop comparing my life to everyone else's?"

### Product output

Each answer should contain four layers:

1. `Direct guidance`
2. `What the texts say`
3. `Why these passages apply`
4. `What to do today`

This structure is the core product behavior.

---

## UX Model

### Primary modes

The Ask tab should support three response modes:

1. `Quick Guidance`
Short answer, 2-3 supporting passages, 1-2 action steps.

2. `Deep Study`
Longer synthesis, 3-5 passages, richer interpretation, alternative views where relevant.

3. `Compare Texts`
Useful when traditions or emphases differ. Example: Gita vs Upanishadic framing of detachment.

### Default mode

Start with `Quick Guidance` as default. It is the most usable chat mode and keeps answers compact.

### Follow-up actions

Each answer should support:

- `Ask a follow-up from these texts`
- `Show alternate sources`
- `Save this passage`
- `Open full study view`

---

## Response Structure

### User-facing answer layout

Each AI response should render in sections:

1. `Guidance`
One concise, modern-language interpretation for the user's actual problem.

2. `From the scriptures`
Two to five citations with source labels.

3. `Interpretation`
Why each cited passage is relevant in this context.

4. `Practice for today`
One to three practical actions, reflections, or journaling prompts.

5. `Boundary note`
Shown only when necessary for high-risk topics.

### Example UI skeleton

```text
[Question]
I feel torn between ambition and peace.

[Guidance]
The texts do not ask you to kill ambition. They ask you to loosen your bondage to outcome while keeping integrity in action.

[From the Scriptures]
Bhagavad Gita 2.47
Katha Upanishad 1.3.x
Yoga Sutras 1.12

[Why These Apply]
These passages address action without attachment, the discipline of the mind, and the difference between impulse and higher direction.

[Practice for Today]
- Finish one necessary task without checking for validation.
- Write down the outcome you are gripping most tightly.
- Sit in silence for 10 minutes before making your next major decision.
```

---

## Structured Output Contract

The Ask backend should return strict structured JSON. Suggested shape:

```ts
interface ScriptureGuideResponse {
  answer: {
    title?: string;
    summary: string;
    practical_guidance: string;
  };
  sources: Array<{
    id: string;
    scripture: string;
    book?: string;
    chapter?: string;
    verse?: string;
    citation_label: string;
    original_text?: string;
    transliteration?: string;
    translation: string;
    relevance_reason: string;
    confidence: 'high' | 'medium' | 'low';
  }>;
  interpretation: {
    synthesis: string;
    alternate_view?: string;
  };
  action_steps: string[];
  follow_up_prompts: string[];
  safety: {
    has_boundary: boolean;
    note?: string;
    escalation_type?: 'self_harm' | 'medical' | 'legal' | 'financial' | 'abuse' | 'mental_health';
  };
}
```

### Output requirements

- No uncited verse references
- No source labels the retriever did not provide
- No fake precision on disputed verses or broad scriptural claims
- `relevance_reason` must explain why the source was chosen
- `confidence` should reflect retrieval strength, not model confidence theater

---

## Corpus Strategy

### MVP corpus

Start with a curated, high-signal corpus rather than "all Hindu sacred texts".

Recommended MVP set:

- Bhagavad Gita
- Principal Upanishads
- Ramayana
- Mahabharata selected dharma sections
- Yoga Sutras of Patanjali
- Yoga Vasistha selected passages
- Sri Suktam
- Bhaja Govindam
- Vivekachudamani selected passages

### Why a curated corpus first

- Better retrieval quality
- Lower contradiction noise
- Easier metadata tagging
- Easier safety review
- Easier editorial QA

### Phase 2 corpus expansion

After the MVP is reliable:

- Shiva Purana selected sections
- Bhagavata Purana selected sections
- Devi Mahatmya selected sections
- Manusmriti only if tightly scoped and editorially mediated
- Additional stotras and samhitas by use case

---

## Corpus Data Model

Each canonical passage should include:

```ts
interface ScripturePassage {
  id: string;
  scripture_name: string;
  tradition?: string;
  book?: string;
  chapter?: string;
  verse?: string;
  section_title?: string;
  original_language: 'sanskrit' | 'other';
  original_text?: string;
  transliteration?: string;
  translation: string;
  commentary_summary?: string;
  themes: string[];
  life_topics: string[];
  source_edition: string;
  source_url?: string;
  editorial_confidence: 'high' | 'medium' | 'low';
}
```

### Required metadata

- Scripture name
- Citation label
- Translation source
- Themes
- Life-topic tags
- Editorial confidence

### Theme examples

- duty
- detachment
- grief
- anger
- discipline
- self-knowledge
- devotion
- prosperity
- family
- fear
- ego
- mind
- right action

---

## Retrieval And Generation Architecture

### Current state

The current Ask route in `app/api/narad+api.ts` is a one-shot generation pipeline:

1. User submits a message
2. Prompt instructs the model to behave as Narad
3. Model generates styled output

This should change.

### Target pipeline

#### Step 1: Query classification

Detect:

- life topic
- emotional state
- user intent
- risk level
- requested depth

Example output:

```ts
{
  primary_topic: 'career_dharma',
  secondary_topics: ['fear', 'self_worth'],
  response_mode: 'quick_guidance',
  risk_flags: [],
}
```

#### Step 2: Passage retrieval

Use semantic search plus metadata filtering across the curated corpus.

Selection goals:

- 3-7 candidate passages
- balance between relevance and diversity
- avoid five near-duplicate passages from the same local region unless the user explicitly wants deep study

#### Step 3: Passage ranking

Rank by:

- thematic match
- practical applicability
- editorial confidence
- diversity of source perspective

#### Step 4: Grounded synthesis

The LLM receives:

- user question
- risk flags
- selected passages
- passage metadata
- explicit instructions to answer only from these sources

#### Step 5: Response validation

Validate:

- citations are present in retrieved set
- answer includes at least one practical step unless blocked by safety policy
- no prohibited advice category violations
- no unsupported claims like "the Vedas clearly say" unless evidence actually supports it

---

## Prompting Strategy

### System prompt goals

The new system prompt should prioritize:

- faithfulness to retrieved sources
- careful interpretation
- explicit uncertainty when support is weak
- practical and humane language
- no invented citations

### Required guardrails

- Never cite a verse not present in retrieved passages
- Never claim unanimity across traditions without support
- Separate `translation` from `interpretation`
- If sources conflict, say so
- If the question is high-risk, switch to safety-forward mode

### Tone guidance

The voice should be:

- calm
- reverent
- direct
- lucid
- non-theatrical

Avoid:

- excessive mystical narration
- grandiose certainty
- archaic roleplay
- generic self-help language

---

## Safety And Trust Model

### High-risk categories

The product must gate and redirect on:

- self-harm or suicidal ideation
- abuse or immediate danger
- medical diagnosis or treatment decisions
- psychiatric crisis
- legal disputes
- high-stakes financial decisions

### Response behavior for high-risk topics

The app may still offer spiritual comfort or grounding, but must:

- state its limitation clearly
- encourage appropriate professional help
- avoid direct prescriptions in the regulated domain

### Trust features in UI

Every answer should show:

- exact source names
- whether the answer is a synthesis
- optional expansion into verse text
- alternate sources when available

This is what makes the experience defensible as a product rather than a pure vibe layer.

---

## Ask Tab UX Changes

### Current UI problem

The current Ask tab in `app/(tabs)/ask.tsx` is optimized for a linear chat bubble experience. That is not enough for a source-grounded product.

### Required UI changes

The response renderer should support:

- sectioned answer cards instead of one single blob
- expandable source cards
- visible citation labels
- saved passages
- alternate-source switching
- study mode expansion

### Proposed screen layout

```text
--------------------------------------------------
Ask Aksha
Guidance rooted in Hindu sacred texts
--------------------------------------------------

[chat stream]

User bubble

AI answer card
  Guidance
  From the Scriptures
    Source Card 1
    Source Card 2
    Source Card 3
  Why These Apply
  Practice for Today
  Ask follow-up / Alternate texts / Save

[input]
```

### Source card behavior

Collapsed:

- scripture name
- citation label
- one-line translation excerpt

Expanded:

- original text
- transliteration
- full translation
- why it was selected

---

## Narrative And Brand Recommendation

### Naming

Working product names to test:

- Ask Aksha
- Scripture Guide
- Wisdom From the Texts
- Sacred Guidance

Avoid names that imply direct supernatural certainty.

### Narad treatment

Three viable options:

1. `Remove Narad from the core answer path`
Best for maximum trust and clarity.

2. `Keep Narad as intro host only`
Best balance between current brand continuity and new grounded product.

3. `Keep Narad as answer wrapper`
Lowest recommendation. Too much roleplay weakens textual authority.

Recommended: `Keep Narad as intro host only`.

---

## MVP Scope

### In scope

- One Ask experience with structured, cited responses
- Quick Guidance mode
- Curated MVP scripture corpus
- Passage retrieval and ranking
- Source cards in the response UI
- Safety gating for high-risk categories
- Saved passages

### Out of scope for MVP

- Streaming token-by-token output
- Full canon ingestion
- Sect-specific commentary modes
- Voice mode
- Community answers
- Personalized long-term study paths
- Debate mode between traditions

---

## Evaluation Framework

### Quality metrics

Before expanding the corpus, evaluate answers across at least 100 real questions.

Score each answer on:

- `faithfulness`: Are claims supported by the cited passages?
- `usefulness`: Does the answer help the user actually move?
- `clarity`: Is the interpretation easy to understand?
- `practicality`: Are action steps concrete?
- `safety`: Were boundaries handled correctly?
- `trust`: Would the user believe this was grounded in actual texts?

### Failure cases to track

- invented citations
- shallow verse stuffing
- generic motivational writing
- overconfident doctrinal claims
- source mismatch to user question
- unsafe handling of regulated or crisis topics

---

## Rollout Plan

### Phase 1: Product definition

- Finalize product promise
- Finalize non-goals
- Finalize MVP corpus list
- Finalize response JSON contract

### Phase 2: Corpus foundation

- Create canonical passage dataset
- Add metadata tags
- Add editorial confidence field
- Build import and QA workflow

### Phase 3: Backend grounding

- Replace persona-only generation with retrieval plus synthesis
- Add query classification
- Add passage ranking
- Add validation layer

### Phase 4: Ask UI redesign

- Update Ask renderer for sections and source cards
- Add follow-up and alternate-source actions
- Preserve premium visual language while reducing theatrical copy

### Phase 5: Evaluation and tuning

- Run internal eval set
- Review unsafe or weak responses
- Tune prompts and ranking

### Phase 6: Expansion

- Add Deep Study mode
- Add Compare Texts mode
- Expand corpus selectively

---

## Implementation Impact In Current Codebase

### Files likely to change first

- `app/(tabs)/ask.tsx`
- `features/ask/useNaradState.ts`
- `features/chat/ChatBubble.tsx`
- `lib/ai/prompts.ts`
- `app/api/narad+api.ts`

### New backend pieces likely needed

- `lib/ai/scriptureRetrieval.ts`
- `lib/ai/scriptureRanking.ts`
- `lib/ai/scriptureSafety.ts`
- `lib/scriptures/*` dataset and loaders

### New UI pieces likely needed

- `features/ask/SourceCard.tsx`
- `features/ask/ScriptureAnswer.tsx`
- `features/ask/StudyModeSheet.tsx`

---

## Open Questions

These should be resolved before implementation starts:

- Which translations and editions are acceptable as canonical sources?
- How much sectarian plurality should be visible in the MVP?
- Should the app ever show contradictory interpretations side by side?
- Is Narad kept as a host, or removed from the new Ask flow entirely?
- Should answers prefer breadth across texts or depth within one text by default?

---

## Recommendation Summary

The Ask revamp should move from a deity-voice chat into a **scripture-grounded guidance system**. The essential shift is:

- from `persona authority`
- to `text authority plus careful interpretation`

That is the right product move if the goal is durable trust, repeated usage, and a stronger long-term moat than a stylized spiritual chatbot.
