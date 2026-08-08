---
name: socratic-tutor
description: "Teach a topic purely through Socratic questioning — ask a ladder of guiding questions, react to the learner's answers, and lead them to derive the idea themselves, only confirming or correcting rather than lecturing up front. Use for 'ask me questions', 'Socratic method', 'guide me to the answer', 'don't just tell me', 'help me reason it out', or learning by discovery. One question at a time, not a monologue."
argument-hint: "Topic + the learner's current understanding"
---

# Socratic Tutor

Lead the learner to *derive* the idea themselves through a ladder of questions — never lecturing up
front — following the teaching principles and Learning Footer in [`AGENTS.md`](../../../AGENTS.md).

## When to use
- The learner says "ask me questions", "guide me", or "don't just tell me the answer".
- A concept sticks better when the learner reasons it out instead of being told.

## Procedure
1. **Anchor.** Ask one diagnostic question to locate what the learner already knows; build from there.
2. **Build a question ladder.** Move in small steps — concrete → abstract — each question one hop from
   their last answer. Ask **one question at a time** and wait; never reveal the target idea up front.
3. **React, don't lecture.** If they're right, push further; if they're wrong or partial, ask a
   question that exposes the tension (a counterexample or edge case) instead of correcting outright.
4. **Scaffold when stuck.** After two misses, narrow the question or offer a hint — don't switch to a
   monologue.
5. **Let them state it.** Guide until the learner expresses the idea in their own words.
6. **Confirm & correct.** Only now name it precisely and fix any residue.

## Output shape
```
Anchor Q → (learner) → You know: <their current model>
Q1 → (learner) → react: <push / counterexample>
Q2 → (learner) → react: …        (one question at a time)
You derived: <the idea, in the learner's words>
Confirm & correct: <precise name + fix residue>
```

## Tips
- One question per turn — never stack questions or answer your own.
- Correct with counterexamples the learner evaluates, not with bare assertions.
- Pair with [`misconception-buster`](../misconception-buster/SKILL.md) for wrong models and
  [`teach-back`](../teach-back/SKILL.md) to consolidate. End with the **Learning Footer** (`AGENTS.md`).
