---
name: csharp-generics-lab
description: "Hands-on C# lab on generics: generic classes and methods, type-parameter constraints (where T : ...), and variance (covariant out / contravariant in) on interfaces. Use for 'teach me C# generics', 'hands-on generics lab', 'generic constraints explained', 'covariance vs contravariance', 'where T : notnull', or practicing reusable typed C# by building it."
argument-hint: "The reusable code"
---

# C# Generics Lab

Learn generics by writing one type-safe container that works for any type — a guided, hands-on lab
following the teaching principles and Learning Footer in [`AGENTS.md`](../../../AGENTS.md).

## When to use
- The learner keeps duplicating code per type (or reaching for `object`) and wants reuse without casts.
- Teaching constraints and variance for **Coding Mentor** or an [`oop-design-coach`](../oop-design-coach/SKILL.md) session.

## Procedure
**Concept (60s):** a generic takes a *type parameter* `T`, so one implementation serves many types with no
boxing and full compile-time safety (learn.microsoft.com, "Generics in C#", C# 2.0, 2005).

1. **Generic type:** write `class Box<T>` with a `T Value`; use it as `Box<int>` and `Box<string>`.
2. **Generic method:** add `static T Max<T>(T a, T b) where T : IComparable<T>` — infer `T` from arguments.
3. **Constrain:** try `where T : class`, `struct`, `new()`, `notnull` and read the errors each one rules out.
4. **Covariance (out):** assign `IEnumerable<string>` to `IEnumerable<object>` — legal because `T` is `out`.
5. **Contravariance (in):** pass an `IComparer<object>` where `IComparer<string>` is expected (`in`).

**Reference sketch:**
```csharp
public class Box<T>                        // one type, many T (int, string, …)
{
    public T Value { get; init; }
}

static T Max<T>(T a, T b) where T : IComparable<T>   // constraint unlocks CompareTo
    => a.CompareTo(b) >= 0 ? a : b;
```
**Pitfalls:** `object` + casts instead of `<T>` loses safety and boxes value types; a member needs a
constraint before you can call it; variance applies to interfaces and delegates, not classes.

## Output shape
```
Concept: a generic is one implementation over many types (T)
Steps 1–5: <what you built + why>; constraint chosen + what it unlocks
Check: constraint present for the member used? variance direction (out vs in) correct?
```

## Tips
- Add the *weakest* constraint that unlocks the members you call — no more.
- Review your generic API with [`code-review-coach`](../code-review-coach/SKILL.md); drill more via [`practice-generator`](../practice-generator/SKILL.md).
- End with the **Learning Footer** (`AGENTS.md`).
