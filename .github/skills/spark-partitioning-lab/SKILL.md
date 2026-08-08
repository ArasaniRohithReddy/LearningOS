---
name: spark-partitioning-lab
description: "Hands-on lab on Spark partitioning: compare repartition vs coalesce, diagnose data skew from straggler tasks, and prove partition pruning on a partitioned table — learning PySpark performance by running real code. Use for 'Spark partitioning lab', 'repartition vs coalesce', 'fix data skew', 'partition pruning', 'too many/few partitions', 'straggler tasks', or a guided hands-on exercise. Teaches by doing, not just reading."
argument-hint: "The performance issue"
---

# Spark Partitioning Lab

A guided, hands-on lab that turns Spark partitioning into muscle memory by writing and running PySpark —
following the teach-by-doing principles in [`AGENTS.md`](../../../AGENTS.md). Pairs with
[`spark-transformations-lab`](../spark-transformations-lab/SKILL.md) and [`spark-job-coach`](../spark-job-coach/SKILL.md).

## When to use

- The learner wants to *practice* controlling parallelism and diagnosing skew and pruning.
- A job is slow from too many/few partitions, straggler tasks, or reading data it could skip.

## Procedure

1. **Concept first.** A partition is Spark's unit of parallelism (~128 MB is a good target); `repartition`
   does a **full shuffle**, `coalesce` merges without one (SQL Performance Tuning, spark.apache.org, Spark 3.x).
2. **repartition vs coalesce.** From `df.rdd.getNumPartitions()`, grow/rebalance with
   `df.repartition(200, "key")` (shuffle) and shrink cheaply with `df.coalesce(10)` (no full shuffle).
3. **Skew exercise.** Skew a key so one partition dwarfs the rest; in the Spark UI watch a few **straggler**
   tasks run far longer — then enable AQE (`spark.sql.adaptive.enabled`, Spark 3.0, 2020) to auto-split them.
4. **Pruning exercise.** Write `df.write.partitionBy("date").parquet("out")`, then read back with
   `spark.read.parquet("out").where("date = '2024-01-01'")` so Spark skips the other date directories.
5. **Verify.** Check `getNumPartitions()` before/after, the task-duration spread for skew, and
   `df.explain()` for **PartitionFilters** proving pruning removed input files.
6. **Pitfalls & Learning Footer.** Name the traps, then close with the **Learning Footer** (`AGENTS.md`).

## Output shape

```
Issue: … | partitions before: N
repartition(n, "key")   # full shuffle, rebalance evenly
coalesce(n)             # narrow, shrink only
Skew: straggler tasks in UI → salt key or enable AQE
Pruning: write.partitionBy("date") → where("date=…") → PartitionFilters
Verify: getNumPartitions + explain() + task-time spread
Learning Footer
```

## Tips

- `coalesce` avoids a shuffle but can under-parallelize or OOM if you shrink too far — don't overshoot.
- `repartition` rebalances evenly but costs a full shuffle; use it before a wide join on a skewed key.
- Partition columns should be low-cardinality (e.g., date) — high-cardinality partitioning makes tiny files.
- End with the **Learning Footer** (`AGENTS.md`) so the learner knows the next step.
