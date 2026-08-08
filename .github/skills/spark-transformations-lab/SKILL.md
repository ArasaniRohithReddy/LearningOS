---
name: spark-transformations-lab
description: "Hands-on lab on Spark transformations: tell narrow (map/filter/flatMap) from wide (reduceByKey/groupByKey/join) ops, build a word count, and see exactly where a shuffle and stage boundary appear — learning PySpark by running real code. Use for 'Spark transformations lab', 'narrow vs wide transformations', 'what causes a shuffle', 'reduceByKey vs groupByKey', 'map vs flatMap', or a guided hands-on exercise. Teaches by doing, not just reading."
argument-hint: "The transform"
---

# Spark Transformations Lab

A guided, hands-on lab that makes Spark's shuffle model concrete by writing and running PySpark — following
the teach-by-doing principles in [`AGENTS.md`](../../../AGENTS.md). Pairs with
[`spark-partitioning-lab`](../spark-partitioning-lab/SKILL.md) and [`spark-job-coach`](../spark-job-coach/SKILL.md).

## When to use

- The learner wants to *practice* classifying transformations and predicting where shuffles happen.
- Understanding why some ops are cheap (pipelined) and others force a stage boundary.

## Procedure

1. **Concept first.** **Narrow** ops (one input partition → one output) pipeline within a stage; **wide** ops
   redistribute by key and force a **shuffle**, a new stage (RDD Programming Guide — *Shuffle operations*,
   spark.apache.org, Spark 3.x; Zaharia et al., NSDI 2012).
2. **Narrow exercise.** `words = rdd.flatMap(lambda s: s.split())` (1→many) then
   `pairs = words.map(lambda w: (w, 1))` — both stay within a partition, no shuffle.
3. **Wide exercise.** `counts = pairs.reduceByKey(lambda a, b: a + b)` — data moves across the network by key;
   this is the shuffle. Trigger it with `counts.collect()`.
4. **Compare.** Swap in `pairs.groupByKey().mapValues(sum)` and observe a larger shuffle — `reduceByKey`
   combines **map-side** before the shuffle, so it moves far less data.
5. **Verify.** `counts.toDebugString()` shows a `ShuffledRDD` stage boundary, and the Spark UI splits the job
   into two stages with shuffle read/write bytes between them.
6. **Pitfalls & Learning Footer.** Name the traps, then close with the **Learning Footer** (`AGENTS.md`).

## Output shape

```
Task: … | narrow: map/filter/flatMap | wide: reduceByKey/join
Narrow: rdd.flatMap(...).map(lambda w: (w,1))   # no shuffle
Wide: .reduceByKey(lambda a,b: a+b)             # shuffle + stage boundary
Compare: reduceByKey (map-side combine) vs groupByKey (moves all values)
Verify: toDebugString / Spark UI shows 2 stages + shuffle bytes
Learning Footer
```

## Tips

- Prefer `reduceByKey`/`aggregateByKey` over `groupByKey`: map-side combine shrinks the shuffle and avoids OOM.
- `map` is 1→1; `flatMap` is 1→0..n and flattens — use it to split or expand rows.
- Every wide op is a stage boundary; count your shuffles to estimate a job's cost before running it.
- End with the **Learning Footer** (`AGENTS.md`) so the learner knows the next step.
