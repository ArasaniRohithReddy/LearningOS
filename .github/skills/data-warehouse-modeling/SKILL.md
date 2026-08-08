---
name: data-warehouse-modeling
description: "Design a dimensional warehouse model as a lesson (Kimball) — pick the business process, declare grain, model facts vs. dimensions, choose SCD types, and weigh star vs. snowflake, with explicit trade-offs. Use for 'dimensional modeling', 'star schema design', 'fact vs dimension', 'grain', 'slowly changing dimensions / SCD type 2', 'star vs snowflake', or learning Kimball warehouse modeling."
argument-hint: "The business process + reporting"
---

# Data Warehouse Modeling

Model a warehouse the reviewed way — business process → grain → dimensions → facts → SCD —
following the teaching approach in [`AGENTS.md`](../../../AGENTS.md). Deepens the gold layer of
[`data-pipeline-designer`](../data-pipeline-designer/SKILL.md); pairs with [`data-modeling-drill`](../data-modeling-drill/SKILL.md) and [`dbt-model-coach`](../dbt-model-coach/SKILL.md).

## When to use

- The learner turns a business process into facts and dimensions for BI/reporting.
- Choosing a grain, SCD strategy, or star vs. snowflake for a warehouse/lakehouse mart.

## SCD types (how a dimension keeps history)

| Type | Change handling | Trade-off |
| --- | --- | --- |
| Type 1 | overwrite in place | simple; loses history |
| Type 2 | add row + effective dates | full history; grows, needs surrogate key |
| Type 3 | add "previous" column | one prior value; limited |

## Procedure

1. **Choose the business process** (orders, shipments) — the source of the fact, not a department.
2. **Declare the grain** — one row means exactly what? (e.g., one order line). Everything else follows.
3. **Identify dimensions** — the who/what/when/where (customer, product, date) at that grain.
4. **Identify facts** — the numeric measures; classify additive / semi-additive / non-additive.
5. **Pick SCD types** per dimension (table above); use surrogate keys so Type 2 history stays stable.
6. **Star vs. snowflake** — star denormalizes for simpler/faster reads; snowflake normalizes to save space at more joins (Kimball & Ross, *The Data Warehouse Toolkit*, 3rd ed., 2013).

## Output shape

```
Business process: … | grain: one row = …
Dimensions: dim_customer(SCD2), dim_product(SCD1), dim_date
Facts: fct_orders(amount additive, …) grain-keyed
Diagram:
  ```mermaid
  erDiagram
    DIM_CUSTOMER ||--o{ FCT_ORDERS : keys
    DIM_PRODUCT  ||--o{ FCT_ORDERS : keys
  ```
Shape: star | snowflake (why) · surrogate keys
```

## Tips

- Grain first; never mix grains in one fact table — split into separate facts instead.
- Conform shared dimensions (one dim_date, dim_customer) across marts for cross-process analysis.
- End with the **Learning Footer** (`AGENTS.md`).
