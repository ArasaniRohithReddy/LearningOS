---
name: csharp-records-lab
description: "Hands-on C# lab on records and pattern matching: value-based equality, positional records, non-destructive with-expressions, and switch expressions with property, relational, and logical patterns. Use for 'teach me C# records', 'hands-on records lab', 'record value equality', 'with expression', 'switch pattern matching', or modeling immutable data in C# by building it."
argument-hint: "The data model"
---

# C# Records & Pattern Matching Lab

Learn records by modeling immutable data with value equality — a guided, hands-on lab following the
teaching principles and Learning Footer in [`AGENTS.md`](../../../AGENTS.md).

## When to use
- The learner needs an immutable data holder compared by *value*, not by reference identity.
- Teaching records and `switch` patterns for **Coding Mentor** or an [`oop-design-coach`](../oop-design-coach/SKILL.md) session.

## Procedure
**Concept (60s):** a `record` is a reference type whose `Equals`/`GetHashCode` compare by *value*, with a
built-in `with` for copies (learn.microsoft.com, "Records", C# 9, .NET 5, 2020).

1. **Declare:** write a positional `record Point(int X, int Y)` — you get init props, `Equals`, `ToString`.
2. **Value equality:** create two `Point(1, 2)`; `==` is `true` even though they're different objects.
3. **Non-destructive copy:** make `p2 = p1 with { Y = 9 }`; `p1` is unchanged (immutability preserved).
4. **Match:** use a `switch` with property patterns (`{ X: 0 }`), relational (`> 0`), and logical (`and`).
5. **Compare:** contrast with a `class` (reference equality) and a `record struct` (value type, C# 10).

**Reference sketch:**
```csharp
public record Point(int X, int Y);                 // value equality + ToString + with

var p1 = new Point(1, 2);
var p2 = p1 with { Y = 9 };                         // non-destructive copy → Point { X = 1, Y = 9 }

string Quadrant(Point p) => p switch
{
    { X: 0, Y: 0 } => "origin",
    { X: > 0, Y: > 0 } => "first",
    _ => "other",
};
```
**Pitfalls:** a mutable `set` property breaks record equality guarantees; reference-type members compare by
reference; `with` needs `init`/positional members; a non-exhaustive `switch` warns — add `_`.

## Output shape
```
Concept: record = value equality + with-copy; class = reference identity
Steps 1–5: <what you modeled + why>; record vs class vs record struct
Check: == compares by value? with keeps original? switch exhaustive (has _)?
```

## Tips
- Reach for records for DTOs/value objects; keep classes for entities with identity and behavior.
- Trace a `with` copy with [`worked-example`](../worked-example/SKILL.md); drill patterns via [`practice-generator`](../practice-generator/SKILL.md).
- End with the **Learning Footer** (`AGENTS.md`).
