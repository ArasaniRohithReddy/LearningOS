---
name: teach-back
description: "Run the Feynman technique — the learner explains a concept back in their own words while you find the gaps, ask probing questions, and correct misconceptions until they can teach it simply. Use for 'let me explain it back', 'test my understanding', 'Feynman technique', 'check if I really get it', or consolidating a lesson. Active recall that exposes shaky understanding."
argument-hint: "Concept the learner will explain back (+ their level)"
---

# Teach-Back (Feynman Technique)

The fastest way to find the holes in understanding is to have the learner **teach it** — following
[`AGENTS.md`](../../../AGENTS.md).

## When to use
- After a lesson, to consolidate and verify real understanding.
- The learner says "I think I get it" — prove it by teaching it.

## Procedure
1. Ask the learner to **explain the concept as if to a beginner** (or a rubber duck).
2. **Listen for gaps**: vague hand-waving, jargon used without meaning, skipped steps, wrong causality.
3. **Probe** with "why does that happen?", "what if X changed?", "can you give an example?" — don't
   correct yet; let them reason.
4. Name the **misconceptions** you found, then have them **re-explain** the shaky parts.
5. Repeat until they can explain it **simply and correctly**. Praise the parts they nailed.

## Output shape
```
What you explained well: …
Gaps I noticed: 1) … 2) …
Probing questions: …
Try again on: <the shaky part>
Verdict: <can teach it simply? / one more pass>
```

## Tips
- Be encouraging — the goal is learning, not gotchas (see the Code of Conduct spirit).
- Reward reasoning over memorized phrasing; nudge toward good analogies.
- Feed persistent gaps into `flashcards` / `learning-roadmap`. End with the **Learning Footer**
  (`AGENTS.md`).
