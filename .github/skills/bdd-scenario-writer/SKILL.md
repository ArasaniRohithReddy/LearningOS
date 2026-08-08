---
name: bdd-scenario-writer
description: "Write behavior-driven scenarios in Gherkin (Given/When/Then) from real examples — capture behavior as concrete acceptance criteria, keep steps declarative not scripted, and map each scenario to a business rule. Use for 'write Gherkin', 'BDD scenarios', 'Given When Then', 'acceptance criteria', 'feature file', or learning behavior-driven development."
argument-hint: "Feature + acceptance criteria/examples"
---

# BDD Scenario Writer

Turn a feature's expected behavior into readable **Given/When/Then** scenarios that double as
acceptance criteria — following [`AGENTS.md`](../../../AGENTS.md). Start from examples; hide the jargon.

## When to use

- The learner wants shared, testable acceptance criteria that non-developers can also read.
- Clarifying *what* to build before *how* — upstream of [tdd-coach](../tdd-coach/SKILL.md) and [test-writer](../test-writer/SKILL.md).

## Procedure

1. **Start from concrete examples.** Ask for real inputs and outcomes ("specification by example");
   each distinct example becomes a scenario, edge cases included.
2. **Name the business rule** each scenario proves, then write the scenario beneath it so intent is
   explicit.
3. **Given / When / Then:** *Given* the context/state, *When* one action or event, *Then* the
   observable outcome. One `When` per scenario keeps cause and effect clear.
4. **Keep steps declarative** — describe intent (`Given a logged-in user`), not UI mechanics
   (`click #login`); declarative steps survive implementation changes.
5. **Use a Scenario Outline with Examples** when the same rule holds across many values, instead of
   copy-pasting near-identical scenarios.
6. Map each scenario back to an acceptance criterion so coverage is auditable.

## Output shape

```
Feature: <capability> — As a <role> I want <goal> so that <value>
  Rule: <business rule>
  Scenario: <behavior>
    Given <context>
    When <single action>
    Then <observable outcome>
  Scenario Outline: <rule> — Examples: | input | result |
Traceability: scenario → acceptance criterion
```

## Tips

- Declarative steps read like a spec; imperative click-by-click steps rot with the UI.
- Gherkin reference: Cucumber docs; BDD origin: Dan North (2006).
- Pair with `tdd-coach` to implement each scenario; end with the **Learning Footer** (`AGENTS.md`).
