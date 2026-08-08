---
name: java-optional-lab
description: "Hands-on Java lab on Optional: create values with of/ofNullable/empty, transform them with map/flatMap/filter, supply fallbacks with orElse/orElseGet/orElseThrow, and avoid anti-patterns like Optional.get() without a check or Optional fields. Use for 'teach me Java Optional', 'hands-on Optional lab', 'map vs flatMap Optional', 'orElse vs orElseGet', 'Optional anti-patterns', or practicing null-safe return values with java.util.Optional."
argument-hint: "The nullable value"
---

# Java Optional Lab

Learn `Optional` by refactoring null-prone code yourself — a guided, hands-on lab following the teaching
principles and Learning Footer in [`AGENTS.md`](../../../AGENTS.md).

## When to use
- The learner wants to *understand* `Optional` as a return type and replace null checks with a pipeline.
- Reinforcing null-safety and clean APIs for **Coding Mentor** or a Java role-agent.

## Procedure
**Concept (60s):** `Optional<T>` is a container that holds a value or nothing, signalling a *possibly
absent* result so the caller can't ignore it — designed for return types (java.util.Optional, Java 8, 2014).

1. **Create:** `Optional.of(x)` (non-null), `ofNullable(x)` (may be null), `empty()` — never wrap and unwrap blindly.
2. **Transform:** `map` a present value; use `flatMap` when the function itself returns an `Optional`.
3. **Filter:** drop the value if a predicate fails, turning a present Optional into an empty one.
4. **Fall back:** `orElse(default)` (eager) vs. `orElseGet(supplier)` (lazy) vs. `orElseThrow()`.
5. **Refactor:** replace an `if (x != null)` chain below with a single `map(...).orElseGet(...)`.

**Reference sketch:**
```java
// look up a user's city, defaulting when any step is absent
String city = findUser(id)                 // Optional<User>
    .map(User::address)                    // map: value -> value
    .flatMap(Address::city)                // flatMap: value -> Optional<String>
    .filter(c -> !c.isBlank())
    .orElseGet(() -> lookupDefaultCity());  // lazy fallback; runs only when empty
```
**Pitfalls:** `get()` without `isPresent` (throws `NoSuchElementException`); `Optional` as a field or
method parameter; `Optional` in collections; `isPresent()/get()` instead of `map`/`orElse`; `orElse`
that always builds an expensive default (use `orElseGet`); wrapping then immediately `null`-checking.

## Output shape
```
Concept: Optional = possibly-absent return, not a null replacement everywhere
Steps 1–5: <pipeline you built + why>; map vs. flatMap choice; orElse vs. orElseGet
Check: no unguarded get()? no Optional fields/params? fallback laziness correct?
```

## Tips
- Predict whether each step needs `map` or `flatMap` before writing it (Socratic).
- Work one refactor fully with [`worked-example`](../worked-example/SKILL.md); drill more via [`practice-generator`](../practice-generator/SKILL.md).
- End with the **Learning Footer** (`AGENTS.md`).
