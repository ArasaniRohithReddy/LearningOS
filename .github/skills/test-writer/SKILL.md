---
name: test-writer
description: "Write tests as a teaching exercise — identify the behaviors and edge cases, then produce clear arrange-act-assert tests covering happy, edge, and error paths, explaining what each test protects and why (test pyramid, good naming). Use for 'write tests for this', 'add unit tests', 'what should I test', 'improve coverage', or learning to test well in any framework."
argument-hint: "Code/behavior to test + framework"
---

# Test Writer

Turn a behavior into a suite of tests that *document and protect* it — teaching what to test and why,
per the coding standards and Learning Footer in [`AGENTS.md`](../../../AGENTS.md).

## When to use

- The learner has code (or a spec) and wants meaningful tests, not just a coverage number.
- Following a refactor ([refactoring-coach](../refactoring-coach/SKILL.md)) or a new feature build.

## Procedure

1. **Enumerate behaviors, not lines.** List each observable behavior with its inputs and expected
   outputs — this is the real spec.
2. **Find the edges:** boundaries, empty/null, large, duplicates, invalid input, concurrency, and
   error paths. Equivalence-partition to keep the set small but complete.
3. **Write each test arrange-act-assert**, one behavior per test, with a name that states the behavior
   (`returns_zero_for_empty_list`). One logical assertion per test.
4. **Explain what each test protects** — which regression it would catch — and where it sits on the
   **test pyramid** (many fast unit tests, fewer integration, fewest end-to-end).
5. Note **cost/complexity** (slow or flaky tests) and prefer deterministic, isolated units.

## Output shape

```
Behaviors: happy: … | edge: … | error: …
Test <n>: <descriptive name>
  Arrange: … | Act: … | Assert: …
  Protects against: <regression>
Pyramid note: <unit vs integration vs e2e> | Gaps left: …
```

## Tips

- Test **behavior, not implementation**, so tests survive refactoring.
- Avoid over-mocking; a test that can never fail protects nothing.
- Pair with [code-review-coach](../code-review-coach/SKILL.md); end with the **Learning Footer** (`AGENTS.md`).
