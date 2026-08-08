---
name: csharp-nullable-lab
description: "Hands-on C# lab on nullable reference types: enabling the context, ? annotations, null-state flow analysis and its warnings, the null-forgiving operator (!), and null-check patterns. Use for 'teach me nullable reference types', 'hands-on nullable lab', 'Nullable enable', 'null-forgiving operator', 'CS8602 dereference of a possibly null reference', or practicing C# null safety by building it."
argument-hint: "The null safety"
---

# C# Nullable Reference Types Lab

Learn nullable reference types by letting the compiler catch nulls before runtime — a guided, hands-on
lab following the teaching principles and Learning Footer in [`AGENTS.md`](../../../AGENTS.md).

## When to use
- The learner wants to eliminate `NullReferenceException` by making nullability explicit and checked.
- Teaching annotations and flow analysis for **Coding Mentor** or a backend role-agent.

## Procedure
**Concept (60s):** with the nullable context on, `string` is non-null and `string?` may be null; the compiler
tracks each variable's *null-state* and warns on unsafe use (learn.microsoft.com, "Nullable reference types", C# 8, 2019).

1. **Enable it:** add `<Nullable>enable</Nullable>` to the csproj (or `#nullable enable` per file).
2. **Annotate:** declare `string name` (non-null) vs `string? middle` (maybe null); read the warnings.
3. **Dereference:** touch `middle.Length` unguarded → **CS8602**; guard with `if (middle is not null)`.
4. **Narrow:** watch the warning vanish inside the check — flow analysis proves it's non-null there.
5. **Override carefully:** use `!` (null-forgiving) only when *you* can prove non-null but the compiler can't.

**Reference sketch:**
```csharp
#nullable enable
string Greet(string? name)
{
    if (name is null)                       // flow analysis: name is non-null after this
        return "Hello, stranger";
    return $"Hello, {name.Length}-char name";   // no CS8602 warning here
}
// var s = maybe!;   // ! suppresses the warning — you assert non-null, you don't prove it
```
**Pitfalls:** `!` silences the warning without removing the null (masks bugs); non-nullable fields must be set
in the constructor (**CS8618**); warnings aren't errors unless you opt in; annotations don't change runtime.

## Output shape
```
Concept: string = non-null, string? = maybe; the compiler tracks null-state
Steps 1–5: <what you annotated + why>; warning cleared by a guard vs by !
Check: guarded before dereference? ! only where truly justified? fields initialized?
```

## Tips
- Fix the null-state with a real check; reserve `!` for cases you can prove but the compiler can't.
- Trace flow analysis with [`worked-example`](../worked-example/SKILL.md); review usages via [`code-review-coach`](../code-review-coach/SKILL.md).
- End with the **Learning Footer** (`AGENTS.md`).
