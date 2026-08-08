---
name: java-records-lab
description: "Hands-on Java lab on records and sealed types: declare compact immutable data carriers, validate invariants in a compact canonical constructor, model a closed hierarchy with sealed interfaces, and destructure with record patterns in an exhaustive switch. Use for 'teach me Java records', 'hands-on records lab', 'sealed classes and interfaces', 'record patterns', 'pattern matching for switch', or practicing modern Java data modeling."
argument-hint: "The data model"
---

# Java Records Lab

Learn records and sealed types by modeling data yourself — a guided, hands-on lab following the teaching
principles and Learning Footer in [`AGENTS.md`](../../../AGENTS.md).

## When to use
- The learner wants to *understand* records, sealed hierarchies, and pattern matching by building a model.
- Reinforcing immutable data modeling and exhaustive dispatch for **Coding Mentor** or a Java role-agent.

## Procedure
**Concept (60s):** a `record` is a transparent, immutable carrier that auto-generates the constructor,
accessors, `equals`/`hashCode`/`toString`; a `sealed` type fixes its permitted subtypes so a `switch`
can be exhaustive (JEP 395, Java 16, 2021; JEP 409, Java 17, 2021).

1. **Declare:** `record Point(int x, int y) {}` — one line replaces boilerplate; call `p.x()` to read.
2. **Validate:** add a compact canonical constructor `Point { ... }` to guard invariants before assignment.
3. **Close the set:** `sealed interface Shape permits Circle, Rectangle {}` names every allowed variant.
4. **Implement variants:** make each a `record ... implements Shape` (records are implicitly `final`).
5. **Match:** write an exhaustive `switch` with record patterns — no `default` needed.

**Reference sketch:**
```java
sealed interface Shape permits Circle, Rectangle {}          // JEP 409, Java 17 (2021)
record Circle(double r) implements Shape {}                  // compact data carrier (Java 16)
record Rectangle(double w, double h) implements Shape {}

static double area(Shape s) {
    return switch (s) {                                      // exhaustive over the sealed set
        case Circle(double r)         -> Math.PI * r * r;   // record pattern (JEP 440, Java 21)
        case Rectangle(double w, double h) -> w * h;
    };
}
```
**Pitfalls:** treating records as deeply immutable (a mutable component stays mutable); trying to add
instance fields outside the header; expecting to `extend` a class (records can't); a subtype that isn't
`final`/`sealed`/`non-sealed`; adding a `default` that silently defeats exhaustiveness checking.

## Output shape
```
Concept: record = transparent immutable carrier; sealed = closed set for exhaustive match
Steps 1–5: <model you built + why>; canonical-constructor validation; exhaustive switch
Check: invariants validated? hierarchy sealed + permits complete? switch exhaustive without default?
```

## Tips
- Predict whether the `switch` compiles without a `default` before adding one (Socratic).
- Shape the model with [`oop-design-coach`](../oop-design-coach/SKILL.md); drill more via [`practice-generator`](../practice-generator/SKILL.md).
- End with the **Learning Footer** (`AGENTS.md`).
