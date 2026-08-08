---
name: runbook-writer
description: "Write an operational runbook for a task or incident — prerequisites, step-by-step actions with expected output, verification, rollback, and escalation, with explicit safety notes on destructive steps. Use for 'write a runbook', 'document this operational procedure', 'incident playbook', 'on-call steps for X', or 'how do we safely do Y in prod'. Written for a stressed operator; flags every irreversible action."
argument-hint: "The operation/incident + system"
---

# Runbook Writer

Write a procedure any qualified on-call can execute safely under pressure — following
[`AGENTS.md`](../../../AGENTS.md). A runbook is a **how-to** in Diátaxis terms; see [`documentation-planner`](../documentation-planner/SKILL.md).

## When to use

- A recurring operational task or incident response needs a repeatable, safe procedure.
- De-risking work where a wrong or ambiguous step could cause an outage or data loss.

## Procedure

1. **Define trigger & goal:** when to run this, the owning system/service, and the end state that
   means success.
2. **List prerequisites:** access and permissions, tools, environment, and pre-checks to confirm
   *before* touching anything.
3. **Write numbered actions:** exact, copy-pasteable commands, each followed by the **expected
   output** so the operator knows it worked. Keep steps small and idempotent where possible.
4. **Flag danger explicitly:** mark destructive or irreversible steps (⚠), require a backup or
   confirmation first, and never bury them in prose.
5. **Add verify, rollback, and escalation:** how to confirm success, how to undo safely, and who to
   page (and when) if it fails.
6. **Write for 3 a.m.:** unambiguous, no assumed context; test the steps if you can — never publish an
   untested destructive command.

## Output shape

```
Runbook: <operation> — <system> | Trigger: … | Success = …
Prerequisites: access … | tools … | pre-checks …
Steps:
  1. `<command>`  → expect: <output>
  2. ⚠ `<destructive command>` — back up first → expect: …
Verify: … | Rollback: … | Escalate to: <team/on-call> when …
```

## Tips

- Every command needs an expected result; ambiguity is dangerous under pressure.
- Always provide a rollback and flag every irreversible action before it runs.
- Finish with the **Learning Footer** (`AGENTS.md`).
