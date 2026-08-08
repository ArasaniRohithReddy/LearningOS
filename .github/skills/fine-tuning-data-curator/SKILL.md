---
name: fine-tuning-data-curator
description: "Curate and format a fine-tuning dataset: select representative examples, format to the chat/instruction template, enforce quality and deduplication, make clean train/val/test splits, and avoid train-test leakage. Use for 'prepare fine-tuning data', 'format JSONL for fine-tuning', 'how many examples do I need', 'dedup my dataset', 'train/test split', or 'is my eval leaking'. Teaches data quality over quantity."
argument-hint: "The task + raw data"
---

# Fine-Tuning Data Curator

Build a fine-tuning dataset where **quality and cleanliness beat sheer volume** — the data decides the outcome —
per the teaching principles in [`AGENTS.md`](../../../AGENTS.md).

## When to use

- The learner has raw examples and wants a clean dataset to fine-tune style/format/task behavior, not new facts.
- Pairs with `fine-tuning-planner` (whether/how to tune), `eval-designer` (held-out tests), and `rag-designer` (knowledge alternative).

## Procedure

1. **Confirm fine-tuning is the fix.** Tuning teaches *behavior, style, and format*, not fresh facts — for
   knowledge prefer RAG (`rag-designer`); sanity-check the decision with `fine-tuning-planner` first.
2. **Select representative examples.** Cover the real input distribution and edge cases, and keep classes/formats
   balanced; a small, curated set can beat a large noisy one (LIMA, Zhou et al., arXiv:2305.11206, 2023-05-18).
3. **Format to the chat template.** Match the model's exact instruction/chat schema (roles, system prompt,
   delimiters, stop tokens); a mismatched template silently degrades results.
4. **Enforce quality.** Fix or drop wrong, inconsistent, toxic, or off-style targets — label errors teach errors;
   prefer correctness over raw count.
5. **Deduplicate.** Strip exact and near-duplicates so the model doesn't over-weight repeats or memorize verbatim
   (Lee et al., *Deduplicating Training Data Makes Language Models Better*, arXiv:2107.06499, 2021-07-14).
6. **Split, then de-leak.** Create train/validation/test splits and remove any test (and near-duplicate) items
   from train — contamination inflates scores and hides real quality.
7. **Document & evaluate.** Record provenance/licensing in a short datasheet, then measure on a held-out set the
   model never saw (`eval-designer`); iterate on *data* before touching hyperparameters.
8. End with the **Learning Footer** (`AGENTS.md`).

## Output shape

```
Fit check: fine-tune vs. RAG/prompt (why)
Examples: coverage, edge cases, balance
Format: chat/instruction template, exact fields
Quality: drop/fix rules applied
Dedup: exact + near-duplicate removal
Splits: train/val/test + leakage check
Eval: held-out metric + datasheet
Learning Footer
```

## Tips

- Data quality dominates quantity — a few hundred clean, on-target examples often beat tens of thousands of noisy ones.
- Fine-tuning bakes in *behavior*, not knowledge; if the gap is "the model doesn't know X", reach for RAG instead.
- Test-set leakage is the silent killer — dedup across splits or your eval will lie to you.
- Close with the **Learning Footer** (`AGENTS.md`) so the learner knows the next step.
