---
name: cheat-sheet
description: "Produce a dense, well-organized one-page reference for a topic — syntax, common commands, key APIs, patterns, and gotchas — grouped logically and accurate, with sources/dates for version-specific facts. Use for 'cheat sheet', 'quick reference', 'one-pager for X', 'commands/syntax for Y', or a crib sheet. Complements deep understanding; it does not replace it."
argument-hint: "Topic/technology + (optional) version"
---

# Cheat Sheet

Pack the highest-value facts of a topic into a scannable one-pager — following the source discipline in
[`AGENTS.md`](../../../AGENTS.md).

## When to use
- The learner wants a fast reference for daily work or last-minute revision.
- Consolidating a topic they already broadly understand.

## Procedure
1. **Confirm topic and version** — a cheat sheet is only useful if it's accurate for the right version.
2. **Group logically** into a few sections: core syntax, common commands, key APIs/functions, patterns,
   and **gotchas**. Order each group by how often it's actually used.
3. **Keep entries terse** — a signature or command plus a one-line "what/when", not prose.
4. **Verify version-specific facts** against official docs and add a **source + date** for anything that
   changes across versions. Never invent flags, APIs, or defaults.
5. **Flag common mistakes** in a Gotchas section — the errors this sheet exists to prevent.
6. Point to [`concept-explainer`](../concept-explainer/SKILL.md) for the *why* behind any entry.

## Output shape
```
<Topic> Cheat Sheet — v<version>   (source, YYYY-MM-DD)
Core:     <item> — <one-liner>   …
Commands: <cmd>  — <what it does> …
Key APIs: <sig>  — <use>          …
Patterns: <name> — <when>         …
Gotchas:  ⚠ <mistake → fix>       …
```

## Tips
- Dense but correct beats big but wrong — verify before you include it.
- A cheat sheet is a memory aid, not a substitute for understanding; pair it with
  [`concept-explainer`](../concept-explainer/SKILL.md) or [`flashcards`](../flashcards/SKILL.md).
- End with the **Learning Footer** (`AGENTS.md`).
