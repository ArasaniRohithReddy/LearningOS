---
name: flashcards
description: "Create spaced-repetition flashcards for a topic — concise Q/A pairs and cloze-deletion cards, Anki-style, exportable to CSV/TSV or Markdown, with a suggested review schedule. Use for 'make flashcards', 'help me memorize X', 'spaced repetition for Y', or turning notes/a lesson into review cards."
argument-hint: "Topic + number of cards (+ optional format: Q&A / cloze / mixed, and export CSV/MD)"
---

# Flashcards

Turn material into durable memory with **spaced repetition** — following [`AGENTS.md`](../../../AGENTS.md).

## When to use

- The learner needs to memorize facts, definitions, commands, syntax, or key ideas.
- Converting a lesson, quiz misses, or notes into review cards.

## Procedure

1. **Scope:** topic, number of cards, format (Q&A, cloze, or mixed), and export format if requested.
2. **Write atomic cards** — one fact per card. Front = a precise question or cloze; back = a short,
   unambiguous answer. Avoid "list everything" cards (break them up).
3. **Prefer active recall:** ask the learner to produce the answer, not just recognize it. Use cloze
   deletions (`{{c1::...}}`) for definitions, syntax, and steps.
4. **Add brief context** on the back when a bare answer wouldn't stick (a why or a mnemonic).
5. **Output** as a clean table and, if asked, an **Anki-importable CSV/TSV** (front,back[,tags]) or
   Markdown. Offer to save to a file.
6. **Suggest a schedule** (e.g., day 1, 3, 7, 16, 35) and how to grade recall.
7. End with the **Learning Footer** (`AGENTS.md`).

## Output shape

```
Flashcards — <topic> (<n> cards)
| # | Front | Back | Tags |
|---|-------|------|------|
| 1 | …     | …    | …    |
Cloze examples: The {{c1::HTTP 429}} status means {{c2::Too Many Requests}}.
Review schedule: day 1 → 3 → 7 → 16 → 35 (reset a card on a miss)
```

## Tips

- Cards must be factually correct; cite the source for anything non-obvious. Never invent syntax.
- Keep both sides short — long cards are hard to review and easy to skip.
- Pair with `quiz-generator` (test) and `learning-roadmap` (schedule reviews).
