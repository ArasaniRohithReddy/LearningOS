---
name: misconception-buster
description: "Surface and correct the common misconceptions on a topic — list the frequent wrong mental models, explain why each is tempting, give the correct model with a disconfirming example, and a quick check. Use for 'common misconceptions', 'what do people get wrong about X', 'is it true that…', 'debunk this', 'myth-bust', or fixing a specific false belief. Replaces bad intuitions, not just facts."
argument-hint: "Topic or a specific belief to test"
---

# Misconception Buster

Find the wrong mental models a learner is likely holding and replace them with the correct one —
following the teaching principles in [`AGENTS.md`](../../../AGENTS.md).

## When to use
- The learner asks "what do people get wrong about X", "is it true that…", or wants a myth debunked.
- A topic is notorious for tempting-but-false intuitions (e.g., `==` vs `is`, Big-O, floating point).

## Procedure
1. **List the misconceptions.** Name 2–5 common wrong models for the topic; if the learner stated a
   belief, test that one first.
2. **Explain the pull.** For each, say *why it's tempting* — the grain of truth, bad analogy, or
   overgeneralized rule behind it.
3. **State the correct model** plainly, citing an official source for any factual claim (dated).
4. **Disconfirm.** Give a concrete case where the wrong model makes a **wrong prediction** — have the
   learner predict first, then reveal what actually happens.
5. **Quick check.** Pose one question only the correct model answers right.

## Output shape
```
Topic: …
❌ Misconception 1: <wrong belief>
   Why it's tempting: <grain of truth / bad analogy>
   ✅ Correct model: … (source, dated)
   Disconfirming example: <predict → reveal what really happens>
❌ Misconception 2: …
Quick check: <question only the right model gets right>
```

## Tips
- Predict-then-reveal: the surprise of a failed prediction is what dislodges a myth.
- Attack the model, respect the learner — always name the grain of truth first.
- Feed sticky myths to [`flashcards`](../flashcards/SKILL.md) and teach the fix with
  [`concept-explainer`](../concept-explainer/SKILL.md). End with the **Learning Footer** (`AGENTS.md`).
