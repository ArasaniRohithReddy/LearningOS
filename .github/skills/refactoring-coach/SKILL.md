---
name: refactoring-coach
description: "Refactor existing code as a lesson, not a silent rewrite — spot the code smells, name the target improvement, then apply small safe steps behind a test safety net, explaining the principle (SOLID, DRY, cohesion/coupling) behind each change. Use for 'refactor this', 'clean up my code', 'reduce duplication', 'this function is too long', or learning to improve code structure safely."
argument-hint: "Code to refactor + language + goal"
---

# Refactoring Coach

Improve the *structure* of working code **without changing its behavior** — teaching the principle
behind every move, per the coding standards and Learning Footer in [`AGENTS.md`](../../../AGENTS.md).

## When to use

- The learner has working code that's hard to read, extend, or test.
- **Coding Mentor** or [code-review-coach](../code-review-coach/SKILL.md) surfaced smells worth fixing.

## Name the smell (so the learner can look it up)

- **Bloaters** — long method, large class, long parameter list, primitive obsession.
- **Duplication** — copy-pasted logic (violates DRY).
- **Coupling** — feature envy, inappropriate intimacy, shotgun surgery.
- **Weak cohesion** — one unit doing several unrelated jobs (violates SRP).

## Procedure

1. **Pin behavior first.** Ensure tests exist; if not, add characterization tests as a safety net so
   the refactoring stays behavior-preserving (Fowler, *Refactoring* 2e, 2018).
2. **Identify the smell** and **name the target** ("extract function", "replace conditional with
   polymorphism"). One goal at a time.
3. **Apply one small step**, run tests, keep it green. Repeat. Never mix a refactor with a behavior
   change in the same step.
4. For each step explain the **why**: which principle improves (SOLID, DRY, cohesion↑/coupling↓) and
   the **trade-off** (e.g., more indirection vs. clearer intent).
5. Show **before → after** and confirm behavior is unchanged.

## Output shape

```
Smell: <named smell> — where and why it hurts
Target: <refactoring name> | Safety net: <tests in place?>
Step 1: <small change> → run tests → why (principle)
Step 2: …
Before → After: <short diff>
Principle recap: <SOLID / DRY / cohesion-coupling>
```

## Tips

- Refactor *or* add features — never both in one step; keep every change reversible.
- No tests yet? Write characterization tests first; pair with [test-writer](../test-writer/SKILL.md).
- End with the **Learning Footer** (`AGENTS.md`) — the one habit to carry forward + an exercise.
