---
name: spark-streaming-lab
description: "Hands-on lab on Spark Structured Streaming: build a readStream, pick an output mode (append/update/complete), bound state with watermarks, and control micro-batches with triggers — learning PySpark streaming by running real code. Use for 'Spark streaming lab', 'Structured Streaming practice', 'readStream/writeStream', 'output modes', 'watermark for late data', 'streaming triggers', or a guided hands-on exercise. Teaches by doing, not just reading."
argument-hint: "The streaming task"
---

# Spark Structured Streaming Lab

A guided, hands-on lab that builds Structured Streaming intuition by writing and running PySpark — following
the teach-by-doing principles in [`AGENTS.md`](../../../AGENTS.md). Pairs with
[`spark-dataframe-lab`](../spark-dataframe-lab/SKILL.md) and [`data-pipeline-designer`](../data-pipeline-designer/SKILL.md).

## When to use

- The learner wants to *practice* streaming with the same DataFrame API used for batch.
- Reasoning about output modes, watermarks for late data, and trigger timing.

## Procedure

1. **Concept first.** Structured Streaming models a stream as an **unbounded table** run **incrementally** per
   micro-batch (Structured Streaming Guide, spark.apache.org, Spark 3.x; Armbrust et al., SIGMOD 2018).
2. **readStream.** Source a stream — `lines = spark.readStream.format("socket")
   .option("host", "localhost").option("port", 9999).load()` — still lazy, like batch.
3. **Transform + output mode.** Aggregate `counts = lines.groupBy("value").count()`, then pick
   **append** (new rows only), **update** (changed keys), or **complete** (whole result table).
4. **Watermark exercise.** For event-time windows, bound state:
   `events.withWatermark("ts", "10 minutes").groupBy(F.window("ts", "5 minutes")).count()` drops late data.
5. **Trigger + start.** `counts.writeStream.outputMode("complete").format("console")
   .trigger(processingTime="5 seconds").start()` — `start()` is the action that launches the query.
6. **Verify & pitfalls.** Watch `query.lastProgress`/`query.status` and console micro-batches, then close with
   the **Learning Footer** (`AGENTS.md`).

## Output shape

```
Task: … | source: spark.readStream.format(...)
Transform: groupBy(...).count()
Output mode: append | update | complete
Watermark: withWatermark("ts", "10 min") + F.window("ts", "5 min")
Trigger: processingTime="5 seconds"; .start() launches
Verify: query.lastProgress / console sink micro-batches
Learning Footer
```

## Tips

- `append` mode with aggregation needs a **watermark** so Spark knows when a window is final.
- `complete` mode re-emits the full result table each batch — its state grows; prefer watermarked windows.
- Always set a `checkpointLocation` on `writeStream` for fault-tolerant, exactly-once recovery.
- End with the **Learning Footer** (`AGENTS.md`) so the learner knows the next step.
