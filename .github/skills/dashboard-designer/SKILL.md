---
name: dashboard-designer
description: "Design an effective BI dashboard as a lesson — define the audience and the decisions, choose the right chart per question, structure layout and visual hierarchy, and avoid misleading visuals (truncated axes, chartjunk, pie overload). Use for 'design a dashboard', 'which chart should I use', 'build a report/KPI view', 'is this chart misleading', or learning data visualization (Power BI/Tableau/Looker)."
argument-hint: "The metric/audience + tool"
---

# Dashboard Designer

Design a dashboard that drives decisions — audience → decisions → charts → layout — honestly, following the
teaching approach in [`AGENTS.md`](../../../AGENTS.md). Pairs with [`dataset-explorer`](../dataset-explorer/SKILL.md)
and [`sql-coach`](../sql-coach/SKILL.md) for the data behind it.

## When to use

- The learner is building a dashboard/report and wants it to inform action, not just display numbers.
- Choosing the right chart and avoiding misleading or cluttered visuals.

## Chart chooser (match to the question)

| Question | Chart |
| --- | --- |
| Trend over time | line |
| Compare categories | bar |
| Part-to-whole | stacked/100% bar (rarely pie) |
| Distribution | histogram / box plot |
| Relationship | scatter |

## Procedure

1. **Audience & decisions**: name who reads it and what they *decide* — a dashboard is a decision tool, not a data dump
   (Few, *Information Dashboard Design*, 2nd ed., 2013).
2. **Metrics that map to decisions**: separate headline KPIs from diagnostic detail; add targets/deltas for context.
3. **Choose the chart** per question (table above); don't reuse one chart for every metric.
4. **Layout & hierarchy**: most important top-left (F/Z reading path), group related tiles, use small multiples for consistency.
5. **Maximize data-ink, cut chartjunk** (Tufte, *The Visual Display of Quantitative Information*, 1983); consistent scales.
6. **Avoid misleading visuals**: no truncated or dual y-axes, no 3D, no cherry-picked ranges; label units and time frame.
7. **Add definitions** so a metric means the same thing to everyone.

## Output shape

```
Audience → decisions: …
Metrics: KPIs … | diagnostics …
Chart map: <question> → <chart> (why)
Wireframe: [KPI][KPI][KPI] / [trend line][bar compare] / [detail table + filters]
Honesty checks: axes from 0, consistent scale, units, time frame
```

## Tips

- One primary question per view; if a tile doesn't drive a decision, cut it.
- Verify the numbers first (`dataset-explorer`/`sql-coach`) — a beautiful chart on wrong data misleads faster.
- End with the **Learning Footer** (`AGENTS.md`).
