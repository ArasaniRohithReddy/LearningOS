---
name: duckdb-lab
description: "Hands-on lab on DuckDB, an in-process (embedded) OLAP database: query Parquet and CSV and run analytical SQL on your laptop with no server — free, local, and no subscription. Use for 'DuckDB lab', 'query Parquet with SQL', 'analyze a CSV locally', 'embedded OLAP', 'no-server warehouse', or learning columnar analytics by doing."
argument-hint: "The dataset/files to query"
---

# DuckDB Lab

A hands-on lab that builds analytical-SQL fluency by running an *in-process* database on your own
laptop — no server, no subscription — following the teach-by-doing principles in
[`AGENTS.md`](../../../AGENTS.md). Pairs with [`sql-coach`](../sql-coach/SKILL.md),
[`dataset-explorer`](../dataset-explorer/SKILL.md), and [`dbt-duckdb-lab`](../dbt-duckdb-lab/SKILL.md).

## When to use

- The learner wants fast analytical SQL over local Parquet/CSV without standing up a warehouse.
- Prototyping queries, EDA, or file-to-file transforms on a single machine.

## Procedure

1. **Concept first.** DuckDB is an *in-process* OLAP engine — a columnar, vectorized database that runs
   inside your Python/CLI process, no server to manage (DuckDB docs, *Why DuckDB*, duckdb.org, 2024).
2. **Install & run locally (free/OSS).** `pip install duckdb` (Python) or grab the standalone CLI; open a
   session with `duckdb my.duckdb`, or `import duckdb` and use `duckdb.sql("…")`.
3. **Exercise — query files directly.** `SELECT * FROM 'trips.parquet'`, `read_csv('trips.csv')`, or
   `read_parquet('data/*.parquet')` to glob many files as one table (DuckDB docs, *CSV/Parquet Import*, duckdb.org, 2024).
4. **Exercise — analytics.** Run `GROUP BY`, window functions, and joins; DuckDB can also query a pandas
   DataFrame in place via replacement scans: `duckdb.sql("SELECT * FROM my_df")`.
5. **Persist & export.** `CREATE TABLE AS SELECT …` into `my.duckdb`; `COPY (…) TO 'out.parquet' (FORMAT PARQUET)`.
6. **Verify.** Compare `SELECT count(*)` to source rows; use `DESCRIBE` and `EXPLAIN` to confirm schema and pushdown.
7. **Pitfalls & Learning Footer.** Name the traps, then close with the **Learning Footer** (`AGENTS.md`).

## Output shape

```
Data: <files/globs> | Engine: DuckDB in-process (no server, no subscription)
Load: read_parquet('data/*.parquet') / read_csv('f.csv')
Query: SELECT … GROUP BY … (+ window / join / DataFrame)
Persist: CTAS → my.duckdb | Export: COPY … TO 'out.parquet'
Verify: count(*) vs source · DESCRIBE · EXPLAIN
Learning Footer
```

## Tips

- Query files with no import/ETL step; `read_csv` sniffs types, but pin them when it guesses wrong.
- `:memory:` (the default) is ephemeral — connect to a `.duckdb` file to persist tables across sessions.
- Push filters and column lists into the scan (predicate/projection pushdown) so Parquet reads stay cheap.
- End with the **Learning Footer** (`AGENTS.md`) so the learner knows the next step.
