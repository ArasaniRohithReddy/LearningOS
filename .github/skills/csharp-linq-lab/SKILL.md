---
name: csharp-linq-lab
description: "Hands-on C# lab on LINQ: query syntax vs method (fluent) syntax, deferred vs immediate execution, and core operators (Where, Select, OrderBy, GroupBy, First, Aggregate). Use for 'teach me LINQ', 'hands-on LINQ lab', 'query vs method syntax', 'deferred execution explained', 'ToList forces execution', or practicing C# LINQ by writing queries."
argument-hint: "The data query"
---

# C# LINQ Lab

Learn LINQ by querying in-memory data two ways yourself — a guided, hands-on lab following the teaching
principles and Learning Footer in [`AGENTS.md`](../../../AGENTS.md).

## When to use
- The learner wants to filter, project, and group collections and *see* how a query actually runs.
- Teaching query vs method syntax and deferred execution for **Coding Mentor** or a backend role-agent.

## Procedure
**Concept (60s):** LINQ integrates queries into C#; the compiler rewrites query syntax into the same method
calls, and a query is *lazy* — it runs when you enumerate it (learn.microsoft.com, "LINQ", C# 3.0, 2007).

1. **Two syntaxes:** write `from n in nums where n > 2 select n`, then the same as `nums.Where(n => n > 2)`.
2. **Prove deferral:** define a query over a `List<int>`, add an item, then `foreach` — the new item appears.
3. **Force execution:** call `.ToList()`/`.ToArray()` to snapshot results now, not on the next enumeration.
4. **Shape data:** chain `Select` (project), `OrderBy`/`ThenBy` (sort), and `GroupBy` (buckets).
5. **Reduce:** collapse with `Count`, `Sum`, `First`/`Single`, or a custom `Aggregate`.

**Reference sketch:**
```csharp
int[] nums = { 5, 3, 8, 1, 3 };

var query = from n in nums               // deferred: nothing runs yet
            where n > 2
            orderby n
            select n * n;

List<int> result = query.ToList();       // executes now → [9, 9, 25, 64]
```
**Pitfalls:** re-enumerating a deferred query re-runs it (cache with `ToList`); `Single` throws on 0 or 2+
matches (use `First`/`FirstOrDefault`); capturing a loop variable in a query can change what it sees.

## Output shape
```
Concept: a LINQ query is lazy; it runs on enumeration
Steps 1–5: <what you queried + why>; query syntax vs .Where(...).Select(...)
Check: deferred (re-runs) or materialized (ToList)? Single vs First chosen right?
```

## Tips
- Materialize with `ToList` when you enumerate more than once or the source may change.
- Trace a query step by step with [`worked-example`](../worked-example/SKILL.md); drill more via [`practice-generator`](../practice-generator/SKILL.md).
- End with the **Learning Footer** (`AGENTS.md`).
