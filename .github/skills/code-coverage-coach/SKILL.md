---
name: code-coverage-coach
description: "Interpret and improve code coverage meaningfully — line vs branch vs condition coverage, what coverage cannot tell you, and how to target the uncovered gaps that actually carry risk. Use for 'code coverage', 'coverage report', 'line vs branch coverage', 'is 80% enough', 'coverage gaps', 'improve coverage', or learning what a coverage number really means."
argument-hint: "The codebase + current coverage"
---

# Code Coverage Coach

Teach the learner to read a coverage number **honestly** — what it proves, what it can't, and which gaps
are worth closing — per the teaching approach in [`AGENTS.md`](../../../AGENTS.md). Coverage is a map, not a score.

## When to use

- The learner has a coverage report and wants to raise quality, not just chase a percentage.
- Deciding where to add [test-writer](../test-writer/SKILL.md) tests, or verifying their strength with [mutation-testing-coach](../mutation-testing-coach/SKILL.md).

## Procedure

1. **Read the metric types.** *Line/statement* (was it executed) is weakest; *branch/decision* (were both
   true and false taken) is stronger; *condition/MC-DC* is strictest, for safety-critical code. Prefer branch.
2. **Name the core limit.** Coverage measures **execution, not assertion** — code can run with no
   meaningful check. It reliably shows what is *untested*, never proves what is *well-tested*.
3. **Rank gaps by risk.** Sort uncovered code by importance — core logic, **error/exception paths**, and
   complex branches first. Ignore trivial getters and generated code; a number chased there buys nothing.
4. **Target the gaps that matter.** Write behavior tests for the risky uncovered branches; missing
   error-handling and edge branches are the usual holes and the ones that bite in production.
5. **Verify quality, not quantity.** Confirm the new tests actually catch bugs with mutation testing —
   high coverage plus surviving mutants means weak assertions ([mutation-testing-coach](../mutation-testing-coach/SKILL.md)).
6. **Set a sane policy.** Enforce a floor and **diff coverage** on changed lines (no PR drops it) rather
   than a vanity 100%; explain why the last few percent rarely pay off.

## Output shape

```
Codebase + current: line NN% / branch MM%
Metric read: line vs branch vs condition — which to trust here
Risk-ranked gaps: <core logic / error paths / complex branch> at <loc>
Tests added: cover <branch> → why it mattered
Quality check: mutation score / surviving mutants
Policy: floor + diff coverage (not 100% vanity)
```

## Tips

- 100% line coverage with weak assertions catches nothing — pair coverage with mutation testing for truth.
- Terminology per the ISTQB glossary (statement, branch/decision, condition coverage); track diff, not total.
- Pair with `test-writer`; end with the **Learning Footer** (`AGENTS.md`).
