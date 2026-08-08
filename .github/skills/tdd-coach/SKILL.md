---
name: tdd-coach
description: "Coach test-driven development on a task — write the failing test first (red), make it pass simply (green), then refactor, in small cycles, explaining how TDD drives design and keeps steps small. Use for 'do this with TDD', 'test-first', 'red green refactor', 'help me practice TDD', or learning test-driven development in any language."
argument-hint: "Feature/behavior to build + language/framework"
---

# TDD Coach

Build a feature **test-first** so the tests drive the design — following the coding standards and
Learning Footer in [`AGENTS.md`](../../../AGENTS.md). Small red → green → refactor cycles, always.

## When to use

- The learner wants to practice test-driven development on a real behavior, not just read about it.
- Starting a new feature where design is still fluid ([test-writer](../test-writer/SKILL.md) tests code that exists; TDD writes the test first).

## Procedure (one small cycle at a time)

1. **Pick the next tiny behavior.** Slice the feature into the smallest observable steps and list them,
   so each cycle adds exactly one.
2. **Red — write a failing test first.** Express the expected behavior as a test and run it; watch it
   fail for the *right* reason. A test that passes immediately tested nothing.
3. **Green — make it pass simply.** Write the least code that passes (even a hardcoded value); resist
   designing ahead. Speed over elegance here.
4. **Refactor — now improve design.** With tests green, remove duplication and clarify names
   ([refactoring-coach](../refactoring-coach/SKILL.md)); rerun tests after each change.
5. **Repeat**, letting the tests you're forced to write **expose the design** — seams, dependencies,
   and awkward coupling show up as hard-to-write tests.
6. Narrate *why* each step matters: fast feedback, regression safety, and testable structure.

## Output shape

```
Behavior list: 1)… 2)… (current: n)
Red:      <failing test> → fails because <reason>
Green:    <minimal code> → passes
Refactor: <what improved> → tests still green
Design insight: <what writing the test revealed>
```

## Tips

- If you can't write the test, the behavior isn't defined yet — clarify it before coding.
- Keep cycles minutes long; a stuck green step means the step was too big — shrink it.
- Kent Beck, *Test-Driven Development: By Example* (2002). Pair with `test-writer`; end with the **Learning Footer** (`AGENTS.md`).
