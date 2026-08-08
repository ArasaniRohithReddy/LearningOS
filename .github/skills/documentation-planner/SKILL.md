---
name: documentation-planner
description: "Plan a documentation set with the Diátaxis framework — map audiences and their tasks to tutorials, how-to guides, reference, and explanation, then decide the writing order. Use for 'plan my docs', 'structure the documentation', 'what docs do we need', 'organize our docs site', or 'apply Diátaxis to my project'. Separates the four modes so each page serves one need."
argument-hint: "Product/topic + audiences"
---

# Documentation Planner

Design a documentation set where every page has a clear job — following [`AGENTS.md`](../../../AGENTS.md).
Feeds [`readme-generator`](../readme-generator/SKILL.md), [`runbook-writer`](../runbook-writer/SKILL.md),
and [`technical-writing-coach`](../technical-writing-coach/SKILL.md).

## When to use

- A product or topic needs a docs structure, not just one page.
- Existing docs are a disorganized pile and readers can't find (or trust) them.

## Procedure

1. **Map audiences & tasks:** who reads the docs (newcomer, task-focused user, implementer,
   decision-maker) and what each needs to accomplish.
2. **Apply the four Diátaxis modes** — each serves a distinct need, so keep them separate:
   **Tutorials** (learning), **How-to guides** (a task), **Reference** (information),
   **Explanation** (understanding).
3. **Draft the structure:** list concrete pages under each mode — a quickstart is a tutorial, a
   runbook is a how-to, an API list is reference, a "why" is explanation.
4. **Find gaps & overlaps:** every key audience task should have a home; flag mixed-mode pages to
   split (a page that teaches *and* references usually serves neither).
5. **Sequence the writing** by audience value — often a quickstart tutorial plus the top how-tos and
   reference first, with explanation filled in as you go.
6. Cite the **Diátaxis** framework and hand each page to the right sibling skill.

## Output shape

```
Docs plan: <product> — audiences: …
Diátaxis map:
  Tutorials (learn):    • …
  How-to (task):        • …  (→ runbook-writer)
  Reference (info):     • …
  Explanation (why):    • …
Gaps to fill: … | Pages to split: …
Writing order: 1) … 2) … 3) …
```

## Tips

- Four needs, four modes — don't make one page do two jobs.
- Start where the audience gets the most value soonest, not with the easiest page to write.
- Finish with the **Learning Footer** (`AGENTS.md`).
