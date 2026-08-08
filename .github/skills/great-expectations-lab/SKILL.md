---
name: great-expectations-lab
description: "Hands-on lab on Great Expectations (GX Core) locally: define data-quality expectations and validate a dataset with a checkpoint and Data Docs report — free, local, OSS, and no subscription. Use for 'Great Expectations lab', 'data quality checks', 'validate a DataFrame', 'expectation suite', 'checkpoint', or learning data validation by doing."
argument-hint: "The dataset + expectations"
---

# Great Expectations Lab

A hands-on lab that adds automated data-quality checks to a dataset by *running GX locally* — following
the teach-by-doing principles in [`AGENTS.md`](../../../AGENTS.md). Pairs with [`data-quality-checker`](../data-quality-checker/SKILL.md),
[`data-pipeline-designer`](../data-pipeline-designer/SKILL.md), and [`dataset-explorer`](../dataset-explorer/SKILL.md).

## When to use

- The learner wants automated checks (nulls, ranges, uniqueness) plus a readable validation report.
- Validating a DataFrame or table locally before it flows downstream.

## Mental model

- GX Core (1.x) flow: **Data Context** → **Data Source/Asset/Batch** (data) → **Expectations** in a **Suite** (rules)
  → a **Validation Definition** binds them → a **Checkpoint** runs it, emitting **Validation Results** + **Data Docs** (GX docs, *Try GX Core*, docs.greatexpectations.io, 2024).

## Procedure

1. **Install & context (free/OSS).** `pip install great_expectations`; then
   `import great_expectations as gx; context = gx.get_context()`.
2. **Connect & batch.** `ds = context.data_sources.add_pandas("pandas")`; `asset = ds.add_dataframe_asset(name="trips")`;
   `bd = asset.add_batch_definition_whole_dataframe("bd")`; `batch = bd.get_batch(batch_parameters={"dataframe": df})`.
3. **Exercise — suite.** `suite = context.suites.add(gx.core.expectation_suite.ExpectationSuite(name="trips"))`,
   then add `gx.expectations.ExpectColumnValuesToNotBeNull(column="id")` and `ExpectColumnValuesToBeBetween(column="fare", min_value=0)`.
4. **Exercise — validate.** Bind with a `ValidationDefinition`, wrap it in a `Checkpoint`, run
   `result = checkpoint.run()`, and read `result.describe()` (`success`, unexpected counts).
5. **Data Docs.** Build GX's browsable HTML report so humans can see exactly which rows failed.
6. **Verify.** A clean run is `success: true`; inject a bad row and watch the Expectation fail with metrics.
7. **Pitfalls & Learning Footer.** Name the traps, then close with the **Learning Footer** (`AGENTS.md`).

## Output shape

```
Context: gx.get_context() (local, OSS, no subscription)
Data: pandas asset → batch
Suite: not_null(id) + between(fare, 0, …)
Run: ValidationDefinition → Checkpoint.run()
Result: success + unexpected_count | Data Docs (HTML)
Verify: inject bad row → Expectation fails with metrics
Learning Footer
```

## Tips

- Expect on the grain's key first: `not_null` + `unique` catch the most damage early.
- Wire the Checkpoint into your pipeline so bad data **fails the run**, not just logs — see [`data-pipeline-designer`](../data-pipeline-designer/SKILL.md).
- GX Core 1.x differs from 0.x (`context.data_sources…`); match the docs to your installed `gx.__version__`.
- End with the **Learning Footer** (`AGENTS.md`) so the learner knows the next step.
