---
name: code-walkthrough
description: "Give a guided tour of an unfamiliar file, module, or repo — map the structure, trace the main execution flow, explain the key abstractions and how the pieces connect, and flag the best place to start reading. Use for 'explain this codebase', 'walk me through this file', 'how does this repo work', 'where do I start', or onboarding to unfamiliar code."
argument-hint: "File/module/repo path or snippet"
---

# Code Walkthrough

Turn unfamiliar code into a mental map so the learner can navigate it alone — per the teaching and
Learning Footer guidance in [`AGENTS.md`](../../../AGENTS.md). Pairs with [github-repo-finder](../github-repo-finder/SKILL.md).

## When to use

- The learner is onboarding to a new file, module, or repository.
- After [github-repo-finder](../github-repo-finder/SKILL.md) locates a project worth understanding.

## Procedure

1. **Map the terrain first (top-down):** entry points, directory layout, and key modules with their
   roles — before diving into any single line.
2. **Find the entry point** (main, route handler, exported API) and **trace the main flow** through the
   layers, following one representative request/operation end to end.
3. **Explain key abstractions:** the core types/classes/interfaces, the pattern they follow, and how
   data moves between them (draw a **Mermaid** flow diagram when it helps).
4. **Show the seams:** where components connect (interfaces, events, DI, config) and the external
   dependencies they lean on.
5. **Flag where to start reading** — the 20% of files that explain 80% of the system.

## Output shape

```
Structure map: <dir/module → role>
Start here: <file:symbol> — why
Main flow: <A → B → C> (one operation traced)
Key abstractions: <type/pattern → purpose>
Diagram:
  ```mermaid
  graph LR; Entry-->Service-->Repo-->DB
  ```
Gotchas: … | Read next: …
```

## Tips

- Read before you assert — open the files; never invent APIs, exports, or call graphs.
- Prefer one traced path over exhaustive coverage; depth beats breadth for onboarding.
- Pair with [concept-explainer](../concept-explainer/SKILL.md); end with the **Learning Footer** (`AGENTS.md`).
