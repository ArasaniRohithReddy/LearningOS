---
name: context-window-optimizer
description: "Optimize how an LLM app uses its finite context window: token budgeting, chunking, compression/summarization, memory (short/long-term), retrieval, and the 'lost in the middle' position effect. Use for 'context window is full/too small', 'reduce tokens', 'summarize chat history', 'what to put in the prompt', 'lost in the middle', 'my long context is ignored', or 'manage conversation memory'. Teaches the budget and its trade-offs."
argument-hint: "The app + context problem"
---

# Context Window Optimizer

Treat the context window as a **scarce, ordered budget** — decide what earns a token and where it sits —
following the teaching and source-discipline principles in [`AGENTS.md`](../../../AGENTS.md).

## When to use

- The learner's prompts overflow the window, cost too much, or the model ignores parts of a long input.
- Pairs with `rag-designer` (retrieval), `agent-designer` (memory), and `prompt-optimizer` / `eval-designer`.

## Procedure

1. **Budget the window.** Count tokens for system + instructions + retrieved context + history + reserved
   output; a bigger window is not free — more tokens mean more cost and latency, and recall can still drop.
2. **Cut before you compress.** Remove redundancy, boilerplate, and stale turns; keep only what changes the answer.
3. **Chunk & select** long sources by structure, then retrieve top-k instead of pasting everything (`rag-designer`).
4. **Compress** what remains: extractive (quote spans) or abstractive (summarize) — summaries are lossy and
   can introduce errors, so keep the raw source for anything you must cite.
5. **Manage memory** deliberately: rolling/summarized short-term history vs. long-term vector memory paged in
   on demand (MemGPT, Packer et al., arXiv:2310.08560, 2023-10-12); more memory means more tokens and stale-context risk.
6. **Place for salience.** Put the most important material at the **start or end** — models use the middle worst
   (Liu et al., *Lost in the Middle*, arXiv:2307.03172, 2023-07-06); for very long streams mind KV-cache limits
   (StreamingLLM, Xiao et al., arXiv:2309.17453, 2023-09-29).
7. **Measure** answer quality and token cost together; trim until quality starts to drop (`eval-designer`).
8. End with the **Learning Footer** (`AGENTS.md`).

## Output shape

```
App & budget: window size, tokens per section, output reserve
Keep / cut: what earns a token, what doesn't
Compression: extractive vs. abstractive, with loss note
Memory: short-term vs. long-term, paging policy
Placement: salient content first/last (mind the middle)
Eval: answer quality vs. token cost
Learning Footer
```

## Tips

- A full window is usually a design smell, not a hardware limit — most prompts carry dead tokens; cut first.
- Longer context ≠ better: it costs more, runs slower, and the middle still gets ignored — measure, don't assume.
- Summarizing history is lossy and can hide errors; keep raw sources for anything you must cite.
- Close with the **Learning Footer** (`AGENTS.md`) so the learner knows the next step.
