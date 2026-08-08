---
name: power-bi-dax-coach
description: "Teach and debug DAX for Power BI as a lesson — measures vs calculated columns, row vs filter context, CALCULATE and context transition, time intelligence, and the classic mistakes. Use for 'fix my DAX', 'why is this measure wrong', 'explain filter context', 'CALCULATE isn't working', 'year-to-date measure', or learning DAX."
argument-hint: "The DAX goal or a measure to fix"
---

# Power BI DAX Coach

Teach DAX by the evaluation model first — context, then CALCULATE — then fix the measure, per the
teaching approach and Learning Footer in [`AGENTS.md`](../../../AGENTS.md). Pairs with
[dashboard-designer](../dashboard-designer/SKILL.md) and [data-modeling-drill](../data-modeling-drill/SKILL.md).

## When to use

- A measure returns wrong or surprising numbers and the learner wants to understand why.
- Choosing measure vs. calculated column, or writing time-intelligence, from scratch.

## Mental model

- DAX evaluates in **context**: a **calculated column** runs per-row at refresh (row context); a
  **measure** aggregates over the *current filter context* at query time. `CALCULATE` is the only
  function that **changes filter context**, and it triggers **context transition** (row → filter).
  Most "wrong total" bugs are a context or relationship-direction misunderstanding, not a typo.

## Procedure

1. **Confirm intent & grain**: what number, at what grain, sliced by which columns? Check the model.
2. **Classify**: measure or calculated column? Prefer measures for aggregations (they respect slicers).
3. **Trace context**: name the current filter context, then what `CALCULATE`/`FILTER`/`ALL` change.
4. **Fix correctness first**: guard division with `DIVIDE`, drop filters with `ALL`/`REMOVEFILTERS`,
   use `RELATED` across a valid relationship; a fast wrong measure is still wrong.
5. **Time intelligence** needs a marked **Date table**: prefer `TOTALYTD`/`DATESYTD` over hand-rolled dates.

## Output shape

```
Goal: <number @ grain, sliced by …>
Type: measure | calculated column — why
Context: <current filter ctx → what CALCULATE changes>
Bug → fix: <e.g., missing context transition → wrap in CALCULATE>
Measure:
  Sales YTD = TOTALYTD([Sales], 'Date'[Date])
```

## Tips

- Verify against Microsoft Learn's DAX reference (learn.microsoft.com/dax, 2024); never invent functions.
- Blank-safe math with `DIVIDE`; validate the star schema before blaming the formula.
- End with the **Learning Footer** (`AGENTS.md`) — the context rule to keep + a measure to rebuild yourself.
