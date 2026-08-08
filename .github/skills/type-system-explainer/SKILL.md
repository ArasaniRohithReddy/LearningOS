---
name: type-system-explainer
description: "Explain a language's type system — static vs dynamic, generics, variance (co/contra), type inference, sum/product (algebraic) types, and nullability — with concrete examples. Use for 'static vs dynamic typing', 'how do generics work', 'explain covariance', 'what are algebraic data types', 'why null is a mistake', or understanding a language's types."
argument-hint: "The language + the typing concept"
---

# Type System Explainer

Explain what a type system proves *before the program runs*, so the learner reads type errors as help —
from first principles with examples, per the teaching guidance and Learning Footer in [`AGENTS.md`](../../../AGENTS.md).

## When to use

- The learner wants to understand typing in a language, or a confusing type/compiler error.
- Pairs with [concept-explainer](../concept-explainer/SKILL.md) and [functional-programming-coach](../functional-programming-coach/SKILL.md) for algebraic data types.

## Procedure

1. **Static vs dynamic.** Static = checked at compile time (Java, Rust, TS); dynamic = at run time
   (Python, Ruby). Frame types as a lightweight proof that rules out a class of bugs (Pierce, *TAPL*, 2002).
2. **Generics (parametric polymorphism).** One implementation over many types: `List<T>`; explain why it
   beats casting or duplication while keeping type safety.
3. **Variance.** When is `List<Cat>` a `List<Animal>`? Covariant (out), contravariant (in), or invariant —
   show a concrete producer/consumer example plus one unsound case.
4. **Inference.** The compiler deduces types (Hindley–Milner / local inference); show what it can and
   cannot infer, and when an annotation is required.
5. **Sum & product types.** Product = "and" (record/tuple/struct); sum = "or" (enum/union/`Result`);
   pattern-match exhaustively — this is how you make illegal states unrepresentable.
6. **Nullability.** `null` as the "billion-dollar mistake" (Hoare, 2009); contrast with `Option`/`Maybe`
   and non-nullable references.

## Output shape

```
Concept: <static-dynamic / generics / variance / inference / ADT / null>
Example: <minimal typed snippet in the learner's language>
What it proves: <bug class ruled out>
Gotcha: <unsound variance / any / null> | Trade-off: <safety vs flexibility>
```

## Tips

- Types are documentation the compiler checks — name the exact bug class each rule prevents.
- Model the domain with sum/product types so invalid states simply won't compile.
- Verify against the language's spec/docs; never invent syntax. End with the **Learning Footer** (`AGENTS.md`).
