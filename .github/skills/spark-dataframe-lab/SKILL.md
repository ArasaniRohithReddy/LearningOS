---
name: spark-dataframe-lab
description: "Hands-on lab on Spark DataFrames: build a DataFrame with an explicit schema, then select/filter/withColumn and read the Catalyst optimizer's plans via explain() — learning PySpark by running real code. Use for 'Spark DataFrame lab', 'practice PySpark DataFrames', 'select vs filter vs withColumn', 'define a schema', 'what is Catalyst', 'df.explain()', or a guided hands-on exercise. Teaches by doing, not just reading."
argument-hint: "The dataframe task"
---

# Spark DataFrame Lab

A guided, hands-on lab that builds PySpark DataFrame fluency by writing and running code — following the
teach-by-doing principles in [`AGENTS.md`](../../../AGENTS.md). Pairs with
[`spark-job-coach`](../spark-job-coach/SKILL.md) and [`data-modeling-drill`](../data-modeling-drill/SKILL.md).

## When to use

- The learner wants to *practice* column operations, schemas, and reading query plans.
- Moving up from RDDs to the structured API and its Catalyst-driven optimizations.

## Procedure

1. **Concept first.** A DataFrame is a distributed table of named, typed columns; ops are **lazy** and compiled
   by the **Catalyst** optimizer into an optimized physical plan (Armbrust et al., *Spark SQL*, SIGMOD 2015;
   SQL Programming Guide, spark.apache.org, Spark 3.x).
2. **Create with a schema.** `spark = SparkSession.builder.getOrCreate()`; build
   `df = spark.createDataFrame(data, schema)` or `spark.read.parquet(...)`; inspect `df.printSchema()`.
3. **Exercise — transform.** With `from pyspark.sql import functions as F`, chain
   `df.select("id", F.col("qty")).where(F.col("qty") > 0).withColumn("total", F.col("qty") * F.col("price"))`.
4. **Trigger.** Call an action (`df.show()`, `count()`, `write`) — only now does Catalyst run the plan.
5. **Verify.** Run `df.explain(True)` to read the **parsed → analyzed → optimized → physical** plans;
   spot the predicate/projection **pushdown** the optimizer added for free.
6. **Pitfalls & Learning Footer.** Name the traps, then close with the **Learning Footer** (`AGENTS.md`).

## Output shape

```
Task: … | schema: df.printSchema()
Transform: df.select(...).where(F.col("x") > 0).withColumn("c", …)
Action: df.show()   # triggers Catalyst
Plans: df.explain(True) → parsed/analyzed/optimized/physical
Verify: pushdown + pruning visible in the physical plan
Learning Footer
```

## Tips

- Reference columns with `F.col("x")` (or `df["x"]`) so expressions compose and optimize cleanly.
- Prefer built-in `pyspark.sql.functions` over Python UDFs — UDFs are opaque to Catalyst and slower.
- Define schemas explicitly for production reads; inference costs an extra pass and can guess wrong.
- End with the **Learning Footer** (`AGENTS.md`) so the learner knows the next step.
