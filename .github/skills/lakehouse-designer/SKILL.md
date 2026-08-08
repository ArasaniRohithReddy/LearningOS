---
name: lakehouse-designer
description: "Design a lakehouse on an open table format as a lesson (Delta Lake / Apache Iceberg) — ACID on object storage, partitioning, compaction/clustering, and time travel — with explicit trade-offs. Use for 'lakehouse design', 'Delta vs Iceberg', 'ACID on S3/ADLS', 'partitioning strategy', 'small files / compaction', 'time travel', or learning open table formats."
argument-hint: "The workload + scale"
---

# Lakehouse Designer

Design a lakehouse the reviewed way — table format → ACID → partitioning → compaction → time travel —
following the teaching approach in [`AGENTS.md`](../../../AGENTS.md). Backs the layers of
[`data-pipeline-designer`](../data-pipeline-designer/SKILL.md) and [`spark-job-coach`](../spark-job-coach/SKILL.md); model gold with [`data-warehouse-modeling`](../data-warehouse-modeling/SKILL.md).

## When to use

- The learner wants warehouse-like ACID + BI on cheap object storage (S3/ADLS/GCS).
- Choosing a table format and a partitioning/compaction plan for a known workload and scale.

## Table formats (pick the metadata layer)

| Format | Strengths | Trade-off |
| --- | --- | --- |
| Delta Lake | mature on Spark/Databricks, `MERGE` | engine ecosystem leans Spark |
| Apache Iceberg | hidden partitioning, engine-neutral | ops/catalog setup heavier |
| Apache Hudi | record-level upserts, CDC-friendly | larger tuning surface |

## Procedure

1. **Confirm** workload (BI vs. streaming upserts), scale, and dominant query patterns.
2. **Choose a table format** — Delta Lake or Apache Iceberg give ACID + schema evolution on object storage.
3. **Partition for the queries** — by a low-cardinality filter (date); avoid over-partitioning into tiny files.
4. **Plan compaction** — `OPTIMIZE`/compaction + clustering (Z-order/liquid) to fix the small-files problem.
5. **Use snapshots/time travel** — versioned snapshots enable `AS OF` reads, audits, and rollback.
6. **Maintain** — expire old snapshots + vacuum to reclaim storage; balance retention vs. time-travel window.

## Output shape

```
Workload + scale: … | queries: …
Format: Delta | Iceberg (why)
Storage: s3/adls/gcs · ACID + schema evolution
Partition: by <col> (cardinality note)
Compaction: OPTIMIZE + Z-order/clustering
Time travel: snapshots, AS OF, rollback
Maintenance: expire snapshots + vacuum
```

## Tips

- Partition by real filter columns and keep files ~100MB–1GB; small files wreck read performance.
- Set snapshot/vacuum retention to cover your time-travel and replay window, then reclaim the rest.
- End with the **Learning Footer** (`AGENTS.md`).
