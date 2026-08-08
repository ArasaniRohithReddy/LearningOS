---
name: aws-cloudwatch-lab
description: "Hands-on AWS lab: build CloudWatch observability end to end — send and query logs, read built-in and custom metrics, create an alarm that notifies via SNS, and assemble a dashboard. Use for 'AWS CloudWatch lab', 'CloudWatch Logs Insights', 'CloudWatch metrics', 'create a CloudWatch alarm', 'CloudWatch dashboard', 'monitor a Lambda', 'CloudWatch hands-on lab', or learning cloud observability by doing."
argument-hint: "The monitoring"
---

# AWS CloudWatch Lab

Learn CloudWatch by instrumenting a service — collect logs, watch metrics, alarm, then dashboard — per
[`AGENTS.md`](../../../AGENTS.md). Pairs with [aws-lambda-lab](../aws-lambda-lab/SKILL.md) and [aws-sns-lab](../aws-sns-lab/SKILL.md).

## When to use

- The learner wants guided, real telemetry — logs, an alarm, a dashboard — not just theory.
- Reinforcing observability (logs, metrics, alarms) for a **cloud/backend/DevOps** role-agent.

## Mental model

CloudWatch has three pillars: **Logs** (streams grouped in log groups), **Metrics** (time series in
namespaces with dimensions), and **Alarms** (a metric threshold → an action). Many services emit these for
free — a Lambda auto-creates its log group (Amazon CloudWatch User Guide, *What is Amazon CloudWatch?*).

## Procedure

1. **Collect logs:** point a service (e.g., a Lambda) at a log group and **set retention** — the default is
   *Never expire*, which quietly grows storage cost.
2. **Query with Logs Insights:** run `fields @timestamp, @message | filter @message like /ERROR/` to find
   errors fast instead of scrolling streams.
3. **Read & emit metrics:** watch built-in metrics (Errors, Duration), then publish a **custom metric** with
   `PutMetricData` or the embedded metric format for app-level signals.
4. **Create an alarm:** set a threshold (e.g., Errors ≥ 1 over 5 min) with an SNS action so it *notifies*
   someone — states are OK / ALARM / INSUFFICIENT_DATA ([aws-sns-lab](../aws-sns-lab/SKILL.md)).
5. **Build a dashboard:** add metric and log widgets so the signal is visible at a glance.
6. ⚠ **Secure & clean up:** scope IAM to the specific log group (not `*`), then delete alarms, dashboards,
   and log groups — ingested logs, custom metrics, and dashboards all bill.

## Output shape

```
Logs: /aws/lambda/<fn> | retention 14d (not Never)
Insights: filter @message like /ERROR/
Metrics: Errors, Duration + custom PutMetricData
Alarm: Errors ≥ 1 / 5m → SNS notify (OK/ALARM)
Dashboard: metric + logs widgets
Cleanup: delete alarms + dashboard + log groups  [⚠ stops ingest cost]
```

## Tips

- Practice free and offline first with [floci-aws-local-lab](../floci-aws-local-lab/SKILL.md); emulated CloudWatch is approximate — confirm alarm behavior on real AWS.
- Always set log retention on day one — *Never expire* is the top silent CloudWatch cost.
- End with the **Learning Footer** (`AGENTS.md`) — one custom metric to publish + one alarm threshold to tune yourself.
