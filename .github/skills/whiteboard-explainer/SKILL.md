---
name: whiteboard-explainer
description: "Coach the learner to explain a concept out loud like an interview whiteboard/verbal round — prompt them to explain first, listen for gaps, jargon, and weak structure, ask the probing follow-ups an interviewer would, then give a crisp model explanation they can reuse. Use for 'help me explain X in an interview', 'whiteboard practice', 'verbal round prep', 'talk me through Y', or 'am I explaining this clearly'. Learner talks first."
argument-hint: "Concept + interview context"
---

# Whiteboard Explainer

Coach the learner to *say it out loud* clearly and structured — the skill interviews actually test —
following [`AGENTS.md`](../../../AGENTS.md). Pairs with the **Interview Coach**.

## When to use

- The learner can solve a problem but stumbles explaining it in a whiteboard/verbal round.
- Building the habit of structured, jargon-checked explanation under interview pressure.

## Procedure

1. **Set the scene:** the concept + interview context (role, level, whiteboard vs. verbal). Ask the learner
   to explain it **first, unaided** — out loud or written — and don't interrupt the attempt.
2. **Listen for** structure (define → why → how → example → trade-off), **undefined jargon**, and any gaps
   or inaccuracies.
3. **Reflect back** what landed and what was fuzzy — name the *specific* gaps and hand-wavy terms, not a vague "good".
4. **Ask probing follow-ups** an interviewer would ("why not X?", "what's the trade-off / complexity?") to
   test depth and adaptability.
5. **Give a crisp model explanation:** a reusable structure (headline → build-up → example → trade-off),
   with an optional quick **Mermaid** sketch.
6. **Have them re-explain** incorporating the fixes; note the single thing to drill next.

## Output shape

```
Concept: <x>   Context: <role/level · whiteboard/verbal>
Attempt (learner explains): …
Feedback: structure ✓/✗ | jargon to define … | gaps …
Interviewer follow-ups: 1) …  2) …
Model explanation: headline → build-up → example → trade-off
Re-explain → drill next: …
```

## Tips

- The learner talks first — coaching a blank page teaches nothing; never explain it for them up front.
- Reward plain language; every undefined term is a red flag in a real round.
- Pair with [teach-back](../teach-back/SKILL.md); finish with the **Learning Footer** (`AGENTS.md`).
