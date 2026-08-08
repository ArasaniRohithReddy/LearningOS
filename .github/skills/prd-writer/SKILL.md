---
name: prd-writer
description: "Draft a concise, testable product requirements document (PRD) — problem, goals and non-goals, target users, requirements, success metrics, and open questions. Use for 'write a PRD', 'product requirements doc for X', 'spec out this feature', 'define goals and non-goals', or 'one-page product spec'. Pairs with user-story-writer, okr-coach, and slide-outline."
argument-hint: "The product/feature"
---

# PRD Writer

Turn a fuzzy idea into a clear one-pager the team can align on and test — following
[`AGENTS.md`](../../../AGENTS.md). Feeds [`user-story-writer`](../user-story-writer/SKILL.md) and [`okr-coach`](../okr-coach/SKILL.md).

## When to use

- The learner must specify a product or feature so engineering, design, and stakeholders align.
- Framing the problem and success metrics before writing stories or code.

## Procedure

1. **State the problem first:** who hurts, how much, and the evidence — not the solution.
2. Define **goals and non-goals**: what success delivers, and what is explicitly out of scope
   (non-goals stop scope creep and endless debate).
3. Describe **users and use cases**: the primary persona, their job-to-be-done, and key scenarios.
4. List **requirements** as testable statements, prioritized (must / should / could); keep them
   solution-light so design keeps room to explore.
5. Define **success metrics** — measurable outcomes with a baseline → target (pair with
   [`okr-coach`](../okr-coach/SKILL.md)) — so "done" is provable, not a feeling.
6. Capture **open questions, risks, and dependencies**; a PRD is a living draft, not a contract.

## Output shape

```
PRD: <product/feature> — author · date · status
Problem: … (evidence)
Goals: … | Non-goals: …
Users & use cases: <persona> — <job-to-be-done> …
Requirements: [must] … [should] … [could] …
Success metrics: <metric>: <baseline> → <target>
Open questions / risks / dependencies: …
```

## Tips

- Lead with the problem; a solution in search of a problem fails review.
- Every requirement must be testable — if you cannot measure "done," rewrite it.
- Keep it to a page and link out for detail. Finish with the **Learning Footer** (`AGENTS.md`).
