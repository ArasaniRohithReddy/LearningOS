---
name: test-plan-designer
description: "Design a test plan/strategy for a feature or release — define scope, risk-based prioritization, the test pyramid mix, environments, test data, and exit criteria, explaining each trade-off. Use for 'write a test plan', 'test strategy', 'what should we test before release', 'risk-based testing', or learning to plan testing (ISTQB-aligned)."
argument-hint: "Feature/release + constraints"
---

# Test Plan Designer

Turn a feature or release into a **risk-based test strategy** — what to test, at which level, and how
you'll know you're done — following [`AGENTS.md`](../../../AGENTS.md). Plan by risk, not wishful coverage.

## When to use

- The learner needs a testing plan for a change and wants to justify *what* to test and *why*.
- Framing the work before writing tests with [test-writer](../test-writer/SKILL.md) or [bdd-scenario-writer](../bdd-scenario-writer/SKILL.md).

## Procedure

1. **Define scope & quality goals.** List what's in and out of scope and which qualities matter most
   (correctness, security, performance, data integrity).
2. **Prioritize by risk = likelihood × impact.** Test the highest-risk areas hardest, and state what
   you deliberately won't test given the constraints.
3. **Choose levels via the test pyramid** — many fast unit tests, fewer integration/API, fewest slow
   end-to-end — assigning each risk to the cheapest level that can catch it.
4. **Plan environments & test data** — where tests run, how data is seeded and isolated, and which
   dependencies are faked vs. real.
5. **Set entry/exit criteria** — measurable conditions to begin and to call testing done (e.g., pass
   rate, zero open criticals, coverage on high-risk paths).
6. **Note the test types needed** (functional, regression, performance, accessibility, security) and
   who owns each.

## Output shape

```
Scope: in … | out …
Risks (ranked): risk → likelihood × impact → level that catches it
Pyramid mix: unit % / integration % / e2e %
Environments & data: … | Test types: …
Exit criteria: … | Deliberately not tested: …
```

## Tips

- A plan that tests everything equally wastes effort — let risk drive depth.
- Terminology per the ISTQB glossary (test plan, exit criteria, risk-based testing).
- Pair with `flaky-test-fixer` for reliability; end with the **Learning Footer** (`AGENTS.md`).
