---
name: paper-summarizer
description: "Summarize ONE research paper for a learner at their level: the problem, key idea, method, results, limitations, and why it matters — citing the exact paper (title, authors, venue/arXiv id, date) and never inventing findings. Use for 'summarize this paper', 'explain this arXiv link', 'TL;DR of this study', 'what did this paper actually show', or 'is this result trustworthy'. Teaches how to read a paper critically."
argument-hint: "Paper title/link + level"
---

# Paper Summarizer

Explain one paper so the learner grasps it *and* can judge it — following the teaching and
source-discipline principles in [`AGENTS.md`](../../../AGENTS.md). Never fabricate findings.

## When to use

- The learner wants a specific paper distilled to their level, honestly.
- Pairs with `literature-review` (many papers) and `concept-explainer` (a term the paper assumes).

## Procedure

1. **Get the real paper.** Confirm the exact title, authors, venue/arXiv id, and date; if you can't access
   the full text, fetch it or say so — do **not** summarize from the title alone.
2. **Gauge the learner's level** to set depth and how much background to unpack.
3. **Read in passes** (Keshav, *How to Read a Paper*, ACM SIGCOMM CCR, 2007): skim structure → key
   figures/claims → the method details that carry the result.
4. **Extract, grounded in the text:** the **problem**, the **key idea** in one sentence, the **method**, the
   **results** (with the actual numbers/metric and baseline), and stated **limitations**.
5. **Assess critically.** Do the results support the claim? Check sample size, baselines, ablations,
   reproducibility, and conflicts of interest. Separate what the paper *shows* from what it *speculates*.
6. **Say why it matters** and what to read next. End with the **Learning Footer** (`AGENTS.md`).

## Output shape

```
Citation: Authors (Year). Title. Venue/arXiv id. Date. [link]
Problem → Key idea (one sentence)
Method: how it works (level-adapted)
Results: the numbers, vs. which baseline
Limitations & my critique: …
Why it matters / read next: …
Learning Footer
```

## Tips

- Quote the paper's own numbers; if a figure is unclear, say "unclear," don't invent a result.
- Distinguish the authors' claims from your interpretation, and flag preprints or unreplicated results.
- Respect copyright: summarize and cite, don't reproduce the paper wholesale.
- Close with the **Learning Footer** (`AGENTS.md`) so the learner knows the next step.
