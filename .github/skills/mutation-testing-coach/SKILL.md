---
name: mutation-testing-coach
description: "Teach mutation testing to measure how good a test suite really is — what mutants are, how to read the mutation score, killing surviving mutants by adding assertions, and the technique's limits and cost. Use for 'mutation testing', 'is my test suite actually good', 'mutation score', 'Stryker/PIT/mutmut', 'kill survivors', or learning test-suite quality beyond coverage."
argument-hint: "Code + existing tests + tool/language"
---

# Mutation Testing Coach

Measure whether tests actually *catch bugs* — not merely execute lines — by mutating the code and
seeing if tests notice, per [`AGENTS.md`](../../../AGENTS.md). Coverage says code ran; mutation says it's tested.

## When to use

- The learner has passing tests and high coverage but wants to know if the suite is genuinely *strong*.
- Hardening a suite built with [test-writer](../test-writer/SKILL.md) or [tdd-coach](../tdd-coach/SKILL.md).

## Procedure

1. **Explain the idea.** A tool makes small changes (**mutants**) — flip `>` to `>=`, `+` to `-`, drop a
   line. If a test fails, the mutant is **killed**; if all still pass, it **survives**.
2. **Run the tool** for the language (e.g., Stryker for JS/TS/.NET, PIT for the JVM, mutmut/cosmic-ray
   for Python) on one focused module — mutation runs are slow, so scope them.
3. **Read the mutation score** = killed ÷ (total − equivalent). Treat it as a *quality* signal stronger
   than line coverage, not a vanity 100%.
4. **Investigate survivors** — each is a real gap: a missing assertion or an untested branch. Add a test
   that fails on that mutant, then rerun to confirm the kill.
5. **Spot equivalent mutants** — mutations that don't change behavior can't be killed; exclude them and
   explain why they distort the denominator.
6. **State the limits:** slow, sometimes noisy, and no substitute for good test design or a
   [test-plan-designer](../test-plan-designer/SKILL.md) strategy.

## Output shape

```
Tool/scope: <tool> on <module>
Mutation score: killed/total = NN% (vs line coverage MM%)
Survivor: <mutant> at <loc> → missing check → test added → killed
Equivalent mutants excluded: … (why)
Verdict: suite strength + top gap to close
```

## Tips

- Weak tests assert too little — a surviving mutant points straight at the missing assertion.
- Concept origin: DeMillo, Lipton & Sayward (1978); scope runs to keep feedback fast.
- Pair with `code-review-coach`; end with the **Learning Footer** (`AGENTS.md`).
