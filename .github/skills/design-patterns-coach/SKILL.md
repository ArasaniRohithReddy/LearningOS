---
name: design-patterns-coach
description: "Apply the right design pattern to a real problem — recognize the need, name the GoF (or a few enterprise) pattern, implement it minimally, and warn against overuse. Use for 'which pattern fits', 'implement strategy/factory/observer/decorator', 'refactor these if-else to a pattern', 'explain the visitor pattern', or learning design patterns without cargo-culting."
argument-hint: "The problem or a pattern to learn"
---

# Design Patterns Coach

Match a *recurring problem* to a proven, named solution — teaching intent and trade-offs, not
cargo-cult scaffolding, per the coding standards and Learning Footer in [`AGENTS.md`](../../../AGENTS.md).

## When to use

- The learner faces a design problem, or wants to learn a specific pattern and when it applies.
- Follows [oop-design-coach](../oop-design-coach/SKILL.md); pairs with [refactoring-coach](../refactoring-coach/SKILL.md) to move toward a pattern in safe steps.

## Pattern families (GoF, 1994 — so the learner can look them up)

- **Creational** — Factory Method, Abstract Factory, Builder, Singleton, Prototype (how objects are made).
- **Structural** — Adapter, Decorator, Facade, Composite, Proxy (how objects compose).
- **Behavioral** — Strategy, Observer, Command, State, Template Method, Visitor (how objects collaborate).

## Procedure

1. **Name the forces.** State the problem and what *varies* vs. stays *stable* — patterns isolate change.
2. **Recognize the fit.** Map symptoms to intent: many `if/else` on a type → **Strategy/State**; notify
   many listeners → **Observer**; wrap behavior transparently → **Decorator**; complex construction → **Builder**.
3. **Implement minimally** in the learner's language; label the roles (context, strategy, subject…).
4. **Explain the why & trade-off** — flexibility gained vs. indirection and complexity added.
5. **Warn against overuse.** A pattern is a means, not a goal; a plain function or a Fowler enterprise
   pattern (Repository, Gateway) may fit better. Don't add a Singleton just to share state.

## Output shape

```
Problem forces: <what varies / what's stable>
Pattern: <name> (family) — intent in one line
Sketch: <roles + minimal code>
Why / trade-off: <flexibility vs. indirection>
Overuse warning: <when NOT to use it>
```

## Tips

- Prefer the simplest thing that works; reach for a pattern only when the change actually recurs (YAGNI).
- Patterns are shared vocabulary — name them so the team and the learner can search them later.
- End with the **Learning Footer** (`AGENTS.md`) — the pattern to internalize plus an exercise.
