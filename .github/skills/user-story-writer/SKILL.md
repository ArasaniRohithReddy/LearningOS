---
name: user-story-writer
description: "Write clear user stories with acceptance criteria — role-goal-benefit format, INVEST quality checks, and Given/When/Then criteria, splitting stories that are too big. Use for 'write a user story', 'acceptance criteria for X', 'break this feature into stories', 'INVEST check', or 'turn this requirement into a backlog item'. Pairs with prd-writer and bdd-scenario-writer."
argument-hint: "The feature/need + user"
---

# User Story Writer

Turn a need into a small, testable story the team can actually build — following
[`AGENTS.md`](../../../AGENTS.md). Feeds [`prd-writer`](../prd-writer/SKILL.md) and [`bdd-scenario-writer`](../bdd-scenario-writer/SKILL.md).

## When to use

- The learner has a feature or need and wants a well-formed backlog item with acceptance criteria.
- Breaking a large requirement (epic) into small, independent, testable stories.

## Procedure

1. **Capture the user and need:** who benefits and the outcome they want — the value, not the UI.
2. Write it in **role-goal-benefit** form: "As a `<role>`, I want `<goal>`, so that `<benefit>`." The
   benefit is the *why*; drop it and you are guessing at value.
3. Add **acceptance criteria** in **Given / When / Then** (Gherkin): precondition → action →
   observable result. Cover the happy path plus key edge and error cases.
4. Run the **INVEST** check (Bill Wake): Independent, Negotiable, Valuable, Estimable, Small,
   Testable — flag any letter that fails.
5. **Split** stories that are too big — by workflow step, data variation, happy vs. edge path, or
   CRUD operation — so each vertical slice delivers value in one iteration.
6. Confirm it is **testable and demoable**; hand criteria to [`bdd-scenario-writer`](../bdd-scenario-writer/SKILL.md) or [`test-writer`](../test-writer/SKILL.md).

## Output shape

```
Story: <title>
As a <role>, I want <goal>, so that <benefit>.
Acceptance criteria:
  • Given <context>, when <action>, then <result>
  • …
INVEST check: I·N·V·E·S·T — flags: <e.g., "too big → split">
Split (if needed): 1) <slice> 2) <slice>
```

## Tips

- A story is a promise for a conversation, not a spec — leave room to negotiate the *how*.
- If you cannot write a test for it, it is not ready; vertical slices beat horizontal layers.
- Finish with the **Learning Footer** (`AGENTS.md`).
