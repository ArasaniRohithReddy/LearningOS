---
name: data-pipeline-designer
description: "Design a batch ETL/ELT data pipeline as a lesson — sources, ingestion (full vs incremental/CDC), medallion transform layers (bronze/silver/gold), orchestration, idempotency, and data-quality gates, with explicit trade-offs. Use for 'design a data pipeline', 'ETL vs ELT', 'build a data warehouse/lakehouse load', 'medallion architecture', 'how do I ingest this source', or learning batch data engineering."
argument-hint: "The sources + target + use case"
---

# Data Pipeline Designer

Design a batch pipeline the way it's reviewed — sources → ingestion → layered transforms → orchestration →
quality — following the teaching approach in [`AGENTS.md`](../../../AGENTS.md). Feeds
[`data-quality-checker`](../data-quality-checker/SKILL.md); contrast with [`streaming-pipeline-designer`](../streaming-pipeline-designer/SKILL.md).

## When to use

- The learner is moving data from sources into a warehouse/lakehouse on a schedule.
- Choosing ETL vs. ELT, incremental loads, and how to make reruns safe (idempotent).

## ETL vs. ELT (pick the shape)

| | ETL (transform then load) | ELT (load then transform) |
| --- | --- | --- |
| Transform runs in | a separate engine | the warehouse (SQL) |
| Best when | heavy cleansing, small target | cheap elastic compute, raw kept |
| Trade-off | less raw history, more moving parts | warehouse compute cost |

## Procedure

1. **Clarify** sources, target, volume, and freshness SLA (how stale is acceptable?).
2. **Choose ETL vs. ELT** — ELT + a lakehouse keeps raw for replay; ETL suits pre-load cleansing.
3. **Ingest**: full snapshot vs. incremental (watermark/CDC). Incremental cuts cost but needs a reliable cursor.
4. **Layer transforms** (Databricks *Medallion Lakehouse Architecture*): bronze=raw, silver=cleaned/conformed,
   gold=marts (star schema per Kimball & Ross, *The Data Warehouse Toolkit*, 3rd ed., 2013).
5. **Orchestrate** a DAG with dependencies, retries, and backfills (e.g., Apache Airflow).
6. **Make it idempotent**: deterministic partitions + `MERGE`/upsert on a key so reruns don't duplicate.
7. **Gate on quality** before publishing gold (hand off to `data-quality-checker`).

## Output shape

```
Sources → target | freshness SLA: …
Pattern: ETL | ELT (why)
Ingestion: full | incremental (cursor/CDC)
Layers: bronze … | silver … | gold (marts) …
Flow: Sources → Bronze(raw) → Silver(clean) → Gold(marts) → BI
Orchestration: DAG, retries, backfill
Idempotency: partitions + MERGE on <key>
Quality gates: <checks>
```

## Tips

- Prefer batch when minutes-to-hours latency is fine; reach for streaming only when seconds matter (cost + complexity rise).
- Always keep raw (bronze) so you can reprocess without re-ingesting; model gold for real query patterns (`data-modeling-drill`).
- End with the **Learning Footer** (`AGENTS.md`).
