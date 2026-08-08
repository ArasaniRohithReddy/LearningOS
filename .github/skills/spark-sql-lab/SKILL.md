---
name: spark-sql-lab
description: "Hands-on lab on Spark SQL: register a DataFrame as a temp view, run SQL queries with spark.sql(), and freely mix SQL with the DataFrame API — learning PySpark by running real code. Use for 'Spark SQL lab', 'practice Spark SQL', 'createOrReplaceTempView', 'temp view', 'mix SQL and DataFrame API', 'spark.sql query', or a guided hands-on exercise. Teaches by doing, not just reading."
argument-hint: "The SQL query"
---

# Spark SQL Lab

A guided, hands-on lab that builds Spark SQL fluency by writing and running PySpark — following the
teach-by-doing principles in [`AGENTS.md`](../../../AGENTS.md). Pairs with
[`spark-dataframe-lab`](../spark-dataframe-lab/SKILL.md) and [`data-modeling-drill`](../data-modeling-drill/SKILL.md).

## When to use

- The learner wants to *practice* SQL over DataFrames and blend it with the fluent API.
- Reasoning about temp views, and proving SQL and DataFrames share one Catalyst plan.

## Procedure

1. **Concept first.** Spark SQL and the DataFrame API are two front-ends to the **same Catalyst** engine, so
   both compile to identical plans and stay **lazy** (Armbrust et al., *Spark SQL*, SIGMOD 2015;
   SQL Programming Guide, spark.apache.org, Spark 3.x).
2. **Register a view.** From a DataFrame, run `df.createOrReplaceTempView("sales")` (session-scoped) or
   `df.createGlobalTempView(...)` for cross-session access via `global_temp.sales`.
3. **Exercise — query.** `spark.sql("SELECT region, SUM(amt) AS total FROM sales GROUP BY region")` —
   the `GROUP BY` is a **wide** op, so expect a shuffle stage.
4. **Exercise — mix.** Take that SQL result and keep going in the API:
   `result.where(F.col("total") > 100).orderBy("total")`.
5. **Verify.** Confirm `spark.sql(q).explain()` matches the equivalent DataFrame chain's physical plan —
   same engine, same optimization; nothing runs until an action like `show()`.
6. **Pitfalls & Learning Footer.** Name the traps, then close with the **Learning Footer** (`AGENTS.md`).

## Output shape

```
Task: … | view: df.createOrReplaceTempView("t")
SQL: spark.sql("SELECT … FROM t GROUP BY …")   # GROUP BY → shuffle
Mix: result.where(F.col("total") > 100).orderBy(…)
Verify: SQL plan == DataFrame plan via .explain()
Action: .show() triggers the job
Learning Footer
```

## Tips

- Temp views are lazy names, not caches — call `df.cache()` if the source is reused across queries.
- Session temp views vanish with the SparkSession; use `global_temp.<name>` to share across sessions.
- Build queries with the DataFrame API or parameters, not raw f-string concatenation, to avoid injection bugs.
- End with the **Learning Footer** (`AGENTS.md`) so the learner knows the next step.
