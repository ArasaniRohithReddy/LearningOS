---
name: dbt-duckdb-lab
description: "Hands-on lab on dbt + DuckDB locally: build models, tests, and docs with zero cloud warehouse — free, local, and no subscription. Use for 'dbt DuckDB lab', 'learn dbt without a warehouse', 'dbt tests locally', 'analytics engineering offline', 'dbt run/test/build', or practicing ELT by doing on your laptop."
argument-hint: "The models + local .duckdb"
---

# dbt + DuckDB Lab

A hands-on lab that teaches dbt end-to-end — models, tests, docs — against a local DuckDB file so there
is *zero cloud cost*, following the teach-by-doing principles in [`AGENTS.md`](../../../AGENTS.md).
Deepen structure/materializations with [`dbt-model-coach`](../dbt-model-coach/SKILL.md); pairs with
[`duckdb-lab`](../duckdb-lab/SKILL.md) and [`sql-coach`](../sql-coach/SKILL.md).

## When to use

- The learner wants to practice dbt (ELT) with no cloud warehouse and no subscription.
- Building a real project (models + tests + docs) offline before targeting Snowflake/BigQuery.

## Procedure

1. **Concept first.** dbt compiles `ref()`-wired `SELECT`s into a DAG and materializes them; the
   **dbt-duckdb** adapter runs it all against a local `.duckdb` file (dbt docs, *DuckDB setup*,
   docs.getdbt.com; github.com/duckdb/dbt-duckdb, 2024).
2. **Install & configure locally (free/OSS).** `pip install dbt-duckdb`; in `profiles.yml` set
   `type: duckdb` and `path: dev.duckdb`; run `dbt debug` to confirm the connection.
3. **Exercise — models.** Create `models/staging/stg_*.sql` and `models/marts/*.sql` wired with
   `ref()`/`source()`; `dbt run` builds them into the DuckDB file.
4. **Exercise — tests & docs.** Add generic tests (`unique`, `not_null`, `relationships`) in `schema.yml`;
   run `dbt test`, then `dbt docs generate && dbt docs serve` to browse lineage.
5. **Build all.** `dbt build` runs models *and* tests together in DAG order.
6. **Verify.** `dbt build` is green; query the marts with the DuckDB CLI to confirm rows and grain.
7. **Pitfalls & Learning Footer.** Name the traps, then close with the **Learning Footer** (`AGENTS.md`).

## Output shape

```
Adapter: dbt-duckdb | Target: dev.duckdb (local, no cloud, no subscription)
profiles.yml: type: duckdb, path: dev.duckdb
Models: stg_*.sql → mart_*.sql (ref/source DAG)
Tests: not_null / unique / relationships (schema.yml)
Run: dbt debug → dbt build → dbt docs serve
Verify: dbt build green · marts queried in DuckDB
Learning Footer
```

## Tips

- Keep staging thin and 1:1 with sources; see [`dbt-model-coach`](../dbt-model-coach/SKILL.md) for materialization trade-offs.
- The whole warehouse is one `dev.duckdb` file — delete it for a clean rebuild, and keep it out of git.
- The same project can later point at a real warehouse by swapping the profile; the SQL stays identical.
- End with the **Learning Footer** (`AGENTS.md`) so the learner knows the next step.
