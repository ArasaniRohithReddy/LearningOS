---
name: quiz-generator
description: "Create an adaptive quiz or mock exam with an answer key and explanations. Supports multiple-choice, true/false, short-answer, and code questions across difficulty levels, with scoring and per-question rationale. Use for 'quiz me', 'test my knowledge', 'give me practice questions', 'mock exam', or self-assessment on any topic."
argument-hint: "Topic + number of questions + level (and optional format: MCQ / short / code / mixed)"
---

# Quiz Generator

Assess and reinforce learning with well-designed questions — following [`AGENTS.md`](../../../AGENTS.md).

## When to use

- The learner wants to test themselves, or an agent needs to check understanding.
- Building a mock exam (pair with **Exam and Certification Coach**) or interview drill.

## Procedure

1. **Scope it:** topic, number of questions, difficulty (or "adaptive"), and format (MCQ, T/F,
   short answer, code, or mixed). Default to a mix that tests recall *and* application.
2. **Write quality items:**
   - One clearly-correct answer; distractors that reflect real misconceptions (no throwaways).
   - Test understanding and transfer, not trivia or wording tricks.
   - Vary Bloom levels: remember → understand → apply → analyze.
3. **Present the quiz first** (questions only), so the learner attempts before seeing answers.
4. **Provide an answer key** with a short **explanation for every option** — why the right one is
   right and why each distractor is wrong (this is where the learning happens).
5. **Score & adapt:** on request, grade responses, then generate a harder or remedial follow-up set
   targeting the missed concepts.
6. End with the **Learning Footer** (`AGENTS.md`).

## Output shape

```
Quiz — <topic> (<n> questions · <level>)
1. <question>  A) … B) … C) … D) …
…
--- Answer key ---
1. B — <why B is correct; why A/C/D are not>
Score guidance: <e.g., 8/10 = ready; <6 = revisit X, Y>
```

## Tips

- Facts must be correct and, where relevant, cited — never fabricate.
- For exam prep, mirror the real item style and time pressure.
- Feed misses into `flashcards` and `learning-roadmap` for follow-up.
