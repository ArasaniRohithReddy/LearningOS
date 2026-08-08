---
name: technical-writing-coach
description: "Coach the learner to improve a piece of technical writing as a lesson — pin down audience and purpose, fix structure, and cut jargon, passive voice, and ambiguity, naming the principle behind every edit. Use for 'improve my docs', 'edit this README/spec', 'make this clearer', 'proofread as a lesson', or 'why is my writing confusing'. Teaches Diátaxis and plain language, not just fixes."
argument-hint: "The draft + audience/purpose"
---

# Technical Writing Coach

Improve a piece of writing *and* teach the principles behind each edit — following the teaching and
source discipline in [`AGENTS.md`](../../../AGENTS.md). Pairs with [`documentation-planner`](../documentation-planner/SKILL.md).

## When to use

- The learner has a draft (doc, README, spec, PR description) they want sharper and clearer.
- They want to learn *why* an edit helps, so their next draft is better unaided.

## Procedure

1. **Pin down audience & purpose:** who reads this, their level, and what they must do afterward.
   Classify the **Diátaxis** mode (tutorial / how-to / reference / explanation) — mixing modes is the
   most common structural flaw.
2. **Fix structure:** lead with the point (inverted pyramid); add headings, steps, and lists so a
   scanner finds what they need. Reorder around the reader's task, not the author's process.
3. **Cut for clarity:** passive → active voice, long → short sentences, define or remove jargon, kill
   ambiguity and hedging, prefer concrete words — per the Google and Microsoft style guides.
4. **Edit as a lesson:** for each change show **before → after** and **name the principle**, so the
   learner internalizes the pattern rather than just accepting the fix.
5. **Check correctness & accessibility:** descriptive link text, alt text, and verify every command,
   API, and claim — never fabricate to smooth a sentence.
6. **Summarize reusable patterns** and hand polishing of related docs to the right sibling skill.

## Output shape

```
Audience & purpose: … | Diátaxis mode: tutorial/how-to/reference/explanation
Top issues: 1) … 2) … 3) …
Edits (before → after — principle):
  • "<before>" → "<after>"  — active voice / plain language / structure
Revised draft: …
Patterns to reuse next time: …
```

## Tips

- One document, one job — don't blend a tutorial with reference material.
- Prefer active voice and short sentences; write for scanning, not for reading every word.
- Finish with the **Learning Footer** (`AGENTS.md`).
