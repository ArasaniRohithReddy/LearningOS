---
name: aws-stepfunctions-lab
description: "Hands-on AWS lab: build a Step Functions state machine end to end — define states in Amazon States Language, invoke Lambda with Task states, branch with Choice, and add Retry and Catch for error handling. Use for 'AWS Step Functions lab', 'build a state machine', 'Amazon States Language', 'Task and Choice states', 'Step Functions retry and catch', 'orchestrate Lambdas', 'Step Functions hands-on lab', or learning workflow orchestration by doing."
argument-hint: "The workflow"
---

# AWS Step Functions Lab

Learn Step Functions by building a workflow — sequence tasks, branch, then handle failure — per
[`AGENTS.md`](../../../AGENTS.md). Pairs with [aws-lambda-lab](../aws-lambda-lab/SKILL.md) and [serverless-designer](../serverless-designer/SKILL.md).

## When to use

- The learner wants a guided, runnable workflow that coordinates steps, not just theory.
- Reinforcing durable orchestration and retries for a **cloud/backend** role-agent.

## Mental model

A state machine is JSON in the **Amazon States Language**: each state does one thing and names the `Next`.
**Standard** workflows are exactly-once and run up to 1 year (auditable); **Express** are at-least-once for
high-volume runs ≤ 5 min (AWS Step Functions Developer Guide, *Choosing workflow type*; Express since 2019).

## Procedure

1. **Pick the type:** **Standard** for long, auditable, exactly-once orchestration; **Express** for
   high-volume, short event processing.
2. **Add Task states:** each `Task` invokes a Lambda or AWS service integration; give the state machine role
   only those `invoke` permissions — least privilege ([aws-lambda-lab](../aws-lambda-lab/SKILL.md)).
3. **Branch with Choice:** a `Choice` state routes on input (e.g., amount > 100 → review) so the workflow
   reacts to data, not just runs straight through.
4. **Handle errors:** add `Retry` with backoff (interval, maxAttempts) and `Catch` to route failures to a
   fallback state — don't let one error abort the run (*Error handling in Step Functions*).
5. **Verify:** start an execution and read the visual graph + execution history to see each state's
   input/output and any retries.
6. ⚠ **Watch cost & clean up:** Standard bills per **state transition**, so avoid needless states; delete the
   state machine and any test Lambdas when done.

## Output shape

```
Machine: <name> (Standard|Express)
States: Task(validate) → Choice → Task(charge) | Catch→Notify
Retry: interval 2s, maxAttempts 3, backoffRate 2
Role: least-privilege lambda:InvokeFunction only
Verify: start execution → graph + history
Cleanup: delete state machine (+ test fns)  [⚠ per-transition cost]
```

## Tips

- Practice free and offline first with [floci-aws-local-lab](../floci-aws-local-lab/SKILL.md) — build the machine + Lambdas on `localhost:4566`.
- Put retries in the workflow, not the function — the state machine sees the whole run and backs off cleanly.
- End with the **Learning Footer** (`AGENTS.md`) — one Choice branch to add + one Retry policy to tune yourself.
