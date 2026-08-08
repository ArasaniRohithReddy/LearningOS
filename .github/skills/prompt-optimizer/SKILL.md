---
name: prompt-optimizer
description: "Improve a prompt iteratively as a teaching exercise: clarify the goal and failure modes, apply proven techniques (clear instructions, few-shot examples, output structure, task decomposition), define a quick eval, and show a before/after diff. Use for 'fix/improve my prompt', 'why is my prompt failing', 'make the model do X reliably', 'prompt engineering help', or 'add few-shot/structure'. Teaches the technique, not just a rewrite."
argument-hint: "The prompt + goal + what's going wrong"
---

# Prompt Optimizer

Turn a shaky prompt into a reliable one **while teaching why each change helps** — following the
teaching principles in [`AGENTS.md`](../../../AGENTS.md). Optimize for understanding, not just a rewrite.

## When to use

- A prompt gives wrong, vague, inconsistent, or unsafe output and the learner wants it fixed *and* explained.
- Pairs with `concept-explainer` (to teach a technique) and `eval-designer` (to measure the gain).

## Procedure

1. **State the goal & failure modes.** Define "correct" output; collect 1–3 real bad outputs and label
   each failure (wrong format, hallucination, ignored constraint, verbosity, refusal).
2. **Diagnose before rewriting.** Map each failure to a likely cause (ambiguous instruction, missing
   context, no examples, no output schema, task too big).
3. **Apply techniques one at a time**, so the learner sees each effect:
   - **Clear, specific instructions** + role/context; put constraints up front.
   - **Few-shot examples** for format/edge cases (Brown et al., *GPT-3*, arXiv:2005.14165, 2020-05-28).
   - **Output structure** (JSON/schema, delimiters) to make parsing and grading deterministic.
   - **Decomposition / step-by-step** for reasoning (Wei et al., *Chain-of-Thought*, arXiv:2201.11903,
     2022-01-28) — or split into multiple calls.
4. **Define a quick eval:** 5–10 representative inputs + a pass rule; run old vs. new (see `eval-designer`).
5. **Show before/after** with the annotated diff and measured change; iterate on the biggest remaining failure.
6. End with the **Learning Footer** (`AGENTS.md`).

## Output shape

```
Goal & failure modes: … (with example bad outputs)
Diagnosis: failure → cause
Optimized prompt: <full text, changes annotated>
Why it works: technique → the failure it fixes
Quick eval: N cases, before X/N → after Y/N
Next iteration: the biggest remaining gap
Learning Footer
```

## Tips

- Change one thing at a time — otherwise you can't attribute the improvement.
- Output is **non-deterministic** and **model-specific**; re-run a few times and pin the model/version.
- More context/examples cost tokens and latency — stop when the eval passes, not when the prompt is longest.
- Close with the **Learning Footer** (`AGENTS.md`) so the learner leaves with the next step.
