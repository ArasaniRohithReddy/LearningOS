---
name: llm-cost-optimizer
description: "Cut LLM cost and latency without wrecking quality: model routing/tiering (small-first cascades), caching (prompt/semantic), batching, prompt/token reduction, output caps, and streaming — always behind a quality guardrail. Use for 'LLM is too expensive/slow', 'reduce token cost', 'cache prompts', 'route to a cheaper model', 'batch requests', or 'lower latency'. Teaches measured trade-offs, not blind cuts."
argument-hint: "The app + cost/latency issue"
---

# LLM Cost Optimizer

Reduce LLM spend and latency **while holding a quality bar** — measure before and after every change —
following the teaching and honesty principles in [`AGENTS.md`](../../../AGENTS.md).

## When to use

- The learner's LLM feature is too costly or too slow and they need cuts that don't quietly degrade answers.
- Pairs with `prompt-optimizer` (fewer tokens), `rag-designer` (retrieval cost), and `eval-designer` (the quality gate).

## Procedure

1. **Measure first.** Split cost into input + output tokens × price × call volume, and latency into queue +
   prefill + decode; find the dominant term before optimizing anything.
2. **Set a quality gate.** Pick metrics and a threshold up front so every change is checked for regressions
   (`eval-designer`) — cheaper is worthless if it's wrong.
3. **Reduce tokens.** Trim prompts, cap `max_tokens`, and retrieve instead of pasting (`prompt-optimizer`,
   `rag-designer`); output tokens usually cost more per token than input.
4. **Route/tier models.** Send easy queries to a small model and escalate only hard ones (cascade: FrugalGPT,
   Chen et al., arXiv:2305.05176, 2023-05-09; learned routing: RouteLLM, Ong et al., arXiv:2406.18665, 2024-06-26).
5. **Cache.** Reuse exact and semantic hits; provider prompt caching cuts repeated-prefix cost and latency
   (Anthropic prompt caching, anthropic.com, 2024-08-14) — but watch staleness and invalidation.
6. **Batch & stream.** Batch offline/bulk jobs for throughput; stream tokens to cut *perceived* latency
   (time-to-first-token) even when total compute is unchanged.
7. **Re-measure** cost, latency, and quality together; keep only the changes that pass the gate (`eval-designer`).
8. End with the **Learning Footer** (`AGENTS.md`).

## Output shape

```
Baseline: $/call, tokens in/out, p50/p95 latency, volume
Quality gate: metric + threshold
Token cuts: prompt, max_tokens, retrieval
Routing: small-first / learned, escalation rule
Caching + batching + streaming: where each applies
Re-measure: cost + latency + quality delta
Learning Footer
```

## Tips

- Optimize the dominant cost first — guessing wastes effort; profile input vs. output tokens and call volume.
- Every cut needs an eval gate; "cheaper and slightly wrong" is a regression, not a win.
- Streaming improves *perceived* latency, not total compute or cost — don't confuse the two.
- Close with the **Learning Footer** (`AGENTS.md`) so the learner knows the next step.
