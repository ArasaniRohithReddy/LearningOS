---
name: spark-rdd-lab
description: "Hands-on lab on Spark RDDs: create RDDs with parallelize/textFile, chain transformations (map/filter/flatMap) vs. actions (collect/count/reduce), and watch lazy evaluation and lineage in action — learning PySpark by running real code. Use for 'Spark RDD lab', 'practice RDDs', 'transformations vs actions', 'why is Spark lazy', 'what triggers a Spark job', or a guided hands-on exercise on RDD basics. Teaches by doing, not just reading."
argument-hint: "The low-level task"
---

# Spark RDD Lab

A guided, hands-on lab that builds Spark's core RDD intuition by writing and running PySpark — following
the teach-by-doing principles in [`AGENTS.md`](../../../AGENTS.md). Pairs with
[`spark-job-coach`](../spark-job-coach/SKILL.md) and [`pandas-lab`](../pandas-lab/SKILL.md).

## When to use

- The learner wants to *practice* RDD creation, transformations vs. actions, and lazy evaluation.
- Before moving to DataFrames, to feel the execution model underneath Spark's higher-level APIs.

## Procedure

1. **Concept first.** An RDD is an immutable, partitioned collection rebuilt from a **lineage** DAG;
   transformations are **lazy** and actions are **eager** (Zaharia et al., *RDDs*, NSDI 2012;
   RDD Programming Guide, spark.apache.org, Spark 3.x).
2. **Create.** `sc = SparkContext.getOrCreate()`; build with `sc.parallelize([1,2,3,4])` or
   `sc.textFile("data.txt")`; check `rdd.getNumPartitions()`.
3. **Exercise — transform (lazy).** Chain `rdd.map(lambda x: x*2).filter(lambda x: x>4)`; note that
   *nothing runs yet* — you only built a new RDD and extended the lineage.
4. **Exercise — act (eager).** Trigger a job with `collect()`, `count()`, `take(3)`, or `reduce(lambda a,b: a+b)`;
   only now does Spark schedule stages and compute.
5. **Verify.** Print `rdd.toDebugString()` to read the lineage, and watch the Spark UI show a job appear
   *only* when the action fires — proof of laziness.
6. **Pitfalls & Learning Footer.** Name the traps, then close with the **Learning Footer** (`AGENTS.md`).

## Output shape

```
Task: … | source: parallelize/textFile | partitions: N
Transform (lazy): rdd.map(...).filter(...)   # no job yet
Action (eager): .collect() / .count()        # triggers the job
Lineage: rdd.toDebugString()
Verify: job appears in Spark UI only on the action
Learning Footer
```

## Tips

- `collect()` pulls every row to the driver — use `take(n)` to sample and avoid OOM on big RDDs.
- Call `rdd.cache()` only when an RDD is reused across actions, else it is recomputed from lineage each time.
- Prefer DataFrames for structured data; RDDs skip the Catalyst optimizer (SQL Programming Guide, spark.apache.org).
- End with the **Learning Footer** (`AGENTS.md`) so the learner knows the next step.
