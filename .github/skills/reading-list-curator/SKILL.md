---
name: reading-list-curator
description: "Curate a structured, sequenced reading and resource list for self-study — foundational → intermediate → advanced, each with why it matters, format, effort, and an honest quality note. Use for 'what should I read to learn X', 'best resources/books/papers on Y', 'reading list', 'where do I start reading', or building a trustworthy source path for a topic."
argument-hint: "Topic + level + time budget (e.g. 'distributed systems, intermediate, 20 hours')"
---

# Reading List Curator

Curate a **sequenced path of sources**, not a random pile of links — following the source discipline in
[`AGENTS.md`](../../../AGENTS.md). This is the *what to read and why*; to schedule it into weeks use
[`learning-roadmap`](../learning-roadmap/SKILL.md).

## When to use
- The learner wants trustworthy sources to self-study a topic, in a sensible order.
- Assembling a bibliography of docs, books, papers, and talks with rationale.

## Procedure
1. **Confirm** topic, current level, goal, and time budget — so the list is actually finishable.
2. **Prioritize primary/official sources** (docs → standards → vendor blogs → papers → trusted
   community), per `AGENTS.md`. One authoritative source per subtopic beats ten mediocre ones.
3. **Sequence foundational → advanced**, so each item builds on the last; note prerequisites.
4. **For each item:** title + author/publisher, **format** (doc/book/paper/video), **effort** (time),
   **why it matters**, and an **honest quality note** (bias, age, difficulty, paywall).
5. **Cite dates and versions;** flag anything you can't verify and say so — never invent titles or links.
6. **Tier it:** a "start here" set, a core path, and an "if you have more time" list; mark must-read vs. optional.
7. Point the learner to [`concept-explainer`](../concept-explainer/SKILL.md) for anything a source glosses over.

## Output shape
```
Topic: <name> — <level>, ~<time budget>
Start here → 1) <title> (author, YYYY) · format · effort · why · note
Core      → 2) … 3) …
Advanced  → 4) …
Optional / if time: …
```

## Tips
- Honesty over hype: name a resource's weaknesses; recommend the *current* edition and cite the date.
- A short finishable list beats an exhaustive one nobody completes.
- Pair with [`research-brief`](../research-brief/SKILL.md) for a synthesized summary. End with the
  **Learning Footer** (`AGENTS.md`).
