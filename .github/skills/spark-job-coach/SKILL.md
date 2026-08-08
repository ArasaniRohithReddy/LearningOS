---
name: spark-job-coach
description: "Write and optimize an Apache Spark job as a lesson — the lazy transformations-vs-actions model, narrow vs. wide (shuffles), partitioning, caching, data skew, broadcast joins, and columnar file formats — explaining the execution model. Use for 'optimize my Spark job', 'why is Spark slow/OOM', 'reduce shuffles', 'fix data skew', 'PySpark performance', or learning Spark internals."
argument-hint: "The job/goal + data size"
---

# Spark Job Coach

Optimize Spark by understanding *why* it's slow — the lazy DAG, shuffles, and skew — not by guessing knobs,
following the teaching approach in [`AGENTS.md`](../../../AGENTS.md). Pairs with [`sql-coach`](../sql-coach/SKILL.md)
for the query-planning mindset.

## When to use

- The learner has a Spark (PySpark/Scala) job that's slow or OOM, or is writing one.
- Reasoning about partitioning, shuffles, caching, skew, and file formats.

## Mental model

- Transformations are **lazy**; an **action** (`count`, `write`, `collect`) triggers a job.
- **Narrow** ops (map/filter) stay in a partition; **wide** ops (join/groupBy/repartition) force a **shuffle** —
  a stage boundary and the usual bottleneck (Zaharia et al., *Resilient Distributed Datasets*, NSDI 2012).

## Procedure

1. **Confirm** goal, data size, executors/cores, and format — prefer columnar Parquet/Delta over CSV/JSON.
2. **Transformations vs. actions**: minimize actions; never `collect()` big data to the driver.
3. **Cut shuffles**: push filters and column pruning early (predicate/projection pushdown); pick narrow ops where possible.
4. **Partitioning**: target ~128 MB/partition; `coalesce` to shrink without shuffle, `repartition` to grow/rebalance;
   tune `spark.sql.shuffle.partitions`.
5. **Skew**: broadcast the small side (broadcast join), salt hot keys, or enable AQE skew handling (Spark 3.0+, 2020).
6. **Cache** only DataFrames reused across actions, then `unpersist`; caching once-used data wastes memory.
7. **Read the Spark UI**: stages, shuffle read/write, spill, and straggler tasks reveal the real hotspot.

## Output shape

```
Goal | data size | format
Plan: narrow vs wide ops; where the shuffle is
Stages:
  ```mermaid
  flowchart LR
    Read --> Filter --> Shuffle((shuffle)) --> Join --> Write
  ```
Fixes: partitions … | skew: broadcast/salt/AQE | cache: <reused df>
Measure: Spark UI stage/shuffle/spill before & after
```

## Tips

- Measure with the Spark UI first — tune the proven hotspot, don't cargo-cult configs.
- Prefer built-in functions over Python UDFs (UDFs block optimizations; *Learning Spark*, 2nd ed., 2020).
- End with the **Learning Footer** (`AGENTS.md`).
