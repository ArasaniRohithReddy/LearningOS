---
name: oop-design-coach
description: "Teach object-oriented design with SOLID — assign responsibilities, encapsulate state, favor composition over inheritance, and model a small domain cleanly. Use for 'design these classes', 'is this good OOP', 'apply SOLID', 'fix this god class', 'composition vs inheritance', or modeling a domain with objects."
argument-hint: "The thing to model or code to improve"
---

# OOP Design Coach

Model a domain with objects that own clear responsibilities and hidden state — teaching the SOLID
principle behind each choice, per the coding standards and Learning Footer in [`AGENTS.md`](../../../AGENTS.md).

## When to use

- The learner is modeling a domain or has classes that are hard to change, test, or understand.
- Pairs with [design-patterns-coach](../design-patterns-coach/SKILL.md) and [refactoring-coach](../refactoring-coach/SKILL.md) to reshape existing code.

## SOLID (Martin, 2000 — so the learner can look it up)

- **S**RP — one reason to change per class. **O**CP — open to extension, closed to modification.
- **L**SP — subtypes substitutable for their base. **I**SP — small, client-specific interfaces.
- **D**IP — depend on abstractions, not concretions.

## Procedure

1. **Find the nouns & responsibilities.** List domain concepts; give each object one job (SRP) and a
   precise name. Split god classes that do several unrelated things.
2. **Encapsulate.** Hide fields behind behavior; expose intent, not data. Guard invariants inside the
   object ("tell, don't ask").
3. **Prefer composition over inheritance** (GoF, 1994). Use inheritance only for a true *is-a* that honors
   LSP; otherwise compose collaborators and program to interfaces (DIP).
4. **Model relationships** — has-a vs. is-a, cardinality; keep coupling low and cohesion high.
5. **Explain the why & trade-off** for each choice (flexibility vs. indirection); show before → after.

## Output shape

```
Domain: <concepts + responsibilities (SRP)>
Model: <classes/interfaces + relationships> (or a Mermaid classDiagram)
Encapsulation: <what's hidden / invariants guarded>
Composition vs inheritance: <choice + why>
SOLID applied: <which principles, where> | Trade-off: …
```

## Tips

- Start with behavior, not data; a class is a contract, not a struct wrapped in getters.
- Deep inheritance trees are a smell — flatten them with composition and interfaces.
- End with the **Learning Footer** (`AGENTS.md`) — the design habit to keep plus an exercise.
