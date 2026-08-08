---
name: dbt-model-coach
description: "Build and structure dbt models as a lesson — staging/intermediate/marts layering, ref() and sources, generic + singular tests, docs, materializations (view/table/incremental/ephemeral), and incremental models — with trade-offs. Use for 'build a dbt model', 'structure my dbt project', 'incremental model', 'dbt tests', 'which materialization', or learning analytics engineering (ELT)."
argument-hint: "The transformation + warehouse"
---

# dbt Model Coach

Build dbt models the reviewed way — staging → intermediate → marts, with refs, tests, and the right materialization —
following the teaching approach in [`AGENTS.md`](../../../AGENTS.md). Sits in the ELT step of [`data-pipeline-designer`](../data-pipeline-designer/SKILL.md); pairs with [`sql-coach`](../sql-coach/SKILL.md).

## When to use

- The learner transforms data *in* the warehouse with dbt and wants a maintainable structure.
- Choosing a materialization or making a model incremental without breaking correctness.

## Materializations (pick per model)

| Type | Builds | Trade-off |
| --- | --- | --- |
| view | query on read | fresh, no storage; slow if reused |
| table | rebuilt each run | fast reads; full recompute cost |
| incremental | new/changed rows only | cheap at scale; late-data care |
| ephemeral | inlined CTE | no object; not queryable alone |

## Procedure

1. **Confirm** the warehouse (Snowflake/BigQuery/Redshift/Postgres) and the transformation goal.
2. **Layer** (dbt Labs, *Best Practices — How we structure our dbt projects*): staging (1:1 source, rename/cast) →
   intermediate (reusable logic) → marts (business entities, star schema).
3. **Wire with `ref()`/`source()`** so dbt builds the DAG + lineage — never hardcode table names.
4. **Choose a materialization** per model using the table above (freshness vs. compute cost).
5. **Incremental models**: `is_incremental()` + `unique_key` + merge; trade-off vs. full refresh (cost vs. correctly
   catching late/updated rows) — schedule periodic full refreshes.
6. **Test & document**: generic tests (`unique`, `not_null`, `relationships`, `accepted_values`) + singular tests, in YAML.
7. **Build**: `dbt build` runs models + tests in DAG order; inspect failures before publishing.

## Output shape

```
Warehouse: … | goal: …
Layers: stg_… → int_… → mart_…
models/
  staging/stg_orders.sql (view)
  marts/fct_orders.sql (incremental, unique_key=order_id)
Tests: not_null(order_id), relationships(customer_id→dim_customer)
DAG: src → stg → int → mart
```

## Tips

- Keep staging thin and 1:1 with the source; put business logic in intermediate/marts.
- One grain per mart (`data-modeling-drill`); test the grain's key for uniqueness.
- End with the **Learning Footer** (`AGENTS.md`).
