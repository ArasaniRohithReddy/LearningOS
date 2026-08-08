---
name: excel-formula-coach
description: "Teach Excel formulas and analysis as a lesson — lookups (XLOOKUP, INDEX/MATCH), logical and aggregation functions (IF/IFS, SUMIFS, COUNTIFS), dynamic arrays (FILTER, UNIQUE, SORT), and PivotTables — with the why and the failure modes. Use for 'fix my formula', 'XLOOKUP vs VLOOKUP', 'why #N/A', 'sum by category', 'build a PivotTable', or learning Excel."
argument-hint: "The Excel task or a formula to fix"
---

# Excel Formula Coach

Teach Excel by the calculation model — references, spilling, and error types — then fix the formula,
per the teaching approach and Learning Footer in [`AGENTS.md`](../../../AGENTS.md). For heavier data
work, graduate to [sql-coach](../sql-coach/SKILL.md).

## When to use

- A formula errors or returns the wrong value and the learner wants to understand why.
- Choosing the right lookup/aggregation, or deciding formula vs. PivotTable, from scratch.

## Mental model

- A cell holds a **value** or a **formula** of **references**. Modern Excel **spills** array results
  (`FILTER`, `UNIQUE`, `SORT`) into neighboring cells — a `#SPILL!` means the range is blocked.
  Errors are signals: `#N/A` (no match), `#REF!` (deleted cell), `#VALUE!` (type mismatch). Prefer
  `XLOOKUP` over `VLOOKUP` — exact-match default, looks left, no fragile column-index number.

## Procedure

1. **Confirm the task & shape**: inputs, expected output, and where results should land.
2. **Pick the tool**: `XLOOKUP`/`INDEX`+`MATCH` for lookups; `SUMIFS`/`COUNTIFS` for conditional totals;
   a **PivotTable** when you're exploring/summarizing rather than wiring a live formula.
3. **Fix correctness first**: lock ranges with `$` absolute refs, set exact match, guard with `IFERROR`.
4. **Explain the failure mode**: name the error and what triggered it, not just the patch.
5. **Make it robust**: use structured **Table** references so ranges grow automatically.

## Output shape

```
Task: <inputs → expected output>
Tool: XLOOKUP | INDEX/MATCH | SUMIFS | PivotTable — why
Error → cause → fix: <#N/A → no exact match → add if_not_found>
Formula:
  =XLOOKUP(key, Table[ID], Table[Name], "Not found")
```

## Tips

- Check function arguments against Microsoft Support (support.microsoft.com, 2024); never invent arguments.
- Absolute `$` refs and Tables prevent most drag-fill bugs; `IFERROR` should explain, not hide, errors.
- End with the **Learning Footer** (`AGENTS.md`) — the reference rule to keep + a formula to rebuild yourself.
