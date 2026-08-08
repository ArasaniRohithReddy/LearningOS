---
name: flaky-test-fixer
description: "Diagnose and fix a flaky (intermittently failing) test — reproduce the flakiness, locate the nondeterminism (timing/async, test order, shared state, randomness, network), and make it reliable while explaining the root cause. Use for 'this test is flaky', 'passes sometimes fails others', 'intermittent test failure', 'fix flaky tests', or learning why tests are nondeterministic."
argument-hint: "The flaky test + symptoms"
---

# Flaky Test Fixer

Turn an intermittently-failing test into a **deterministic** one by finding *why* it's nondeterministic —
following [`AGENTS.md`](../../../AGENTS.md). A flaky test erodes trust in the whole suite.

## When to use

- A test passes and fails without code changes, and the learner wants the real cause, not a `retry`.
- Applying the [debugging-coach](../debugging-coach/SKILL.md) method specifically to tests.

## Procedure

1. **Reproduce the flakiness.** Run repeatedly, shuffle order, and vary parallelism until you can force
   the failure — a flake you can't repeat can't be verified fixed.
2. **Localize the nondeterminism** by category: **timing/async** (sleeps, races), **order/shared state**
   (globals, DB, singletons leaking between tests), **randomness/time/locale**, **external I/O**
   (network, clock, filesystem), or **unordered results** (map/set iteration).
3. **Confirm the cause** by changing one variable — pin the clock/seed, isolate state, or run the test
   alone — and watch the failure appear or vanish.
4. **Fix at the root:** await a real condition instead of `sleep`, seed randomness, inject a fake clock,
   reset/seed state per test, assert on sorted/normalized output. Avoid blind retries.
5. **Prevent recurrence** — enforce test isolation and randomized order in CI so leaks surface early.
6. Name the **root-cause class** so the learner recognizes it next time.

## Output shape

```
Repro: <how you forced the failure> (fail rate before)
Category: timing | order/shared-state | randomness | I/O | ordering
Root cause: … (this is a <class>)
Fix: <deterministic change + why> (fail rate after: 0)
Prevention: randomized order / isolation / pinned clock
```

## Tips

- Never "fix" flakiness with retries or bigger `sleep`s — that hides the defect, it doesn't remove it.
- Reference: Martin Fowler, *Eradicating Non-Determinism in Tests* (2011).
- Pair with `test-writer`; end with the **Learning Footer** (`AGENTS.md`).
