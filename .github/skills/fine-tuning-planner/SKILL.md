---
name: fine-tuning-planner
description: "Decide and plan among prompting, RAG, and fine-tuning for a task — weighing cost/benefit, data needs, method (LoRA/QLoRA vs full), and evaluation, then picking the lightest approach that works. Use for 'should I fine-tune or use RAG', 'do I need to fine-tune', 'LoRA vs full fine-tuning', 'how much data to fine-tune', 'customize an LLM', or 'cheaper than fine-tuning'. Teaches the decision, not just a training run."
argument-hint: "The task + data available"
---

# Fine-Tuning Planner

Decide whether to fine-tune at all — and if so, how — **explaining every trade-off** so the learner
picks the lightest approach that works, per the teaching principles in [`AGENTS.md`](../../../AGENTS.md).

## When to use

- The learner wants to customize model behavior and must choose among prompting, RAG, and fine-tuning.
- Pairs with `prompt-optimizer` and `rag-designer` (cheaper first) and `eval-designer` (to prove the gain).

## Procedure

1. **Frame the task & gap.** What must change — knowledge, format/style, or a skill? Collect real
   failures; note latency, cost, privacy, and how many labeled examples you actually have.
2. **Try the lighter tools first.** Prompting/few-shot fixes format and simple behavior; **RAG** adds
   missing or fresh *knowledge* without training (see `rag-designer`). Fine-tune mainly for durable
   *style/skill* or to shrink a large prompt.
3. **Check data readiness.** Fine-tuning needs quality, representative input→output pairs; a weak or
   biased set teaches the wrong thing. Hold out a test split *now*, before training.
4. **Pick a method by budget:** parameter-efficient **LoRA** (Hu et al., arXiv:2106.09685, 2021-06-17)
   or **QLoRA** on a quantized base (Dettmers et al., arXiv:2305.14314, 2023-05-23) — cheap, portable;
   vs. **full** fine-tuning — most capacity, most compute and higher risk of forgetting.
5. **Estimate cost/benefit** honestly: training + hosting + upkeep vs. the *measured* quality lift over
   the RAG/prompt baseline. Name the break-even point.
6. **Evaluate on the held-out set** against that baseline; watch overfitting and regressions (`eval-designer`).
7. End with the **Learning Footer** (`AGENTS.md`).

## Output shape

```
Task & gap: knowledge | format | skill …
Decision: prompt / RAG / fine-tune (+ why lighter options were ruled out)
Data: pairs available, quality, held-out split
Method: LoRA / QLoRA / full — with the trade-off
Cost/benefit: train + serve + upkeep vs. measured lift; break-even
Eval plan: baseline vs. tuned, overfit check
Learning Footer
```

## Tips

- Fine-tuning teaches **behavior**, not facts — reach for RAG when the gap is knowledge or freshness.
- Garbage or leaked training data is worse than none; curate and hold out before you train.
- A LoRA adapter is small and swappable — start there and go full only if the eval demands it.
- Close with the **Learning Footer** (`AGENTS.md`) so the learner knows the next step.
