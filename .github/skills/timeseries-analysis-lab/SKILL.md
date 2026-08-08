---
name: timeseries-analysis-lab
description: "Hands-on lab on time series in pandas: build a DatetimeIndex, resample to change frequency, smooth with rolling windows, and lag with shift/diff — learning by running real code. Use for 'time series lab', 'practice resampling', 'datetime index', 'rolling mean', 'shift/lag', 'pct_change', 'downsample to monthly', or a guided hands-on time-series exercise. Teaches the reasoning and avoids look-ahead bias."
argument-hint: "The time-series data"
---

# Time Series Analysis Lab

A guided, hands-on lab on pandas time series — indexing, resampling, rolling, and shifting — explaining each
step, per the teaching principles in [`AGENTS.md`](../../../AGENTS.md). Pairs with
[`groupby-aggregation-lab`](../groupby-aggregation-lab/SKILL.md) and [`feature-engineering-coach`](../feature-engineering-coach/SKILL.md).

## When to use

- The learner has timestamped data and needs to change frequency, smooth, or build lag features.
- Before forecasting, to handle dates correctly and avoid leaking the future into features.

## Procedure

1. **Concept first.** A `DatetimeIndex` makes time a first-class, sortable axis; most time operations require
   it (pandas User Guide: *Time series / date functionality*, pandas.pydata.org).
2. **Index by time.** `df["ts"] = pd.to_datetime(df["ts"]); df = df.set_index("ts").sort_index()`.
3. **Exercise — resample.** Change frequency: `df.resample("D").mean()` to downsample, or `"h"` to upsample;
   compare `resample` to a time-based `groupby`.
4. **Exercise — rolling.** Smooth with `df.rolling(window=7).mean()`; note the leading `NaN`s before the window fills.
5. **Exercise — shift/diff.** Build a lag with `shift(1)`, a step change with `diff()`, growth with `pct_change()`.
6. **Reference solution sketch.** Show index → resample → rolling → lag as one ordered pipeline.
7. **Pitfalls & Learning Footer.** Name the traps, then close with the **Learning Footer** (`AGENTS.md`).

## Output shape

```
Data: timestamp col → DatetimeIndex (sorted)
Resample: df.resample("D"|"ME").agg(…)  # down/upsample
Rolling: df.rolling(7).mean()  → leading NaNs
Lag/Change: shift(1) | diff() | pct_change()
Check: index sorted, tz consistent, no future leak
Result + Learning Footer
```

## Tips

- `resample` and `rolling` need a sorted `DatetimeIndex` — call `sort_index()` first or results are wrong.
- Avoid look-ahead bias: build features from **past** rows (`shift`), and skip `center=True` for live signals.
- Offset aliases matter: `"D"` day, `"W"` week, `"ME"` month-end, `"h"` hour — check the target frequency.
- End with the **Learning Footer** (`AGENTS.md`) so the learner knows the next step.
