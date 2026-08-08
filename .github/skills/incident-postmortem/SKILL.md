---
name: incident-postmortem
description: "Write a blameless incident postmortem that teaches — timeline, quantified impact, root cause via the 5 Whys, contributing factors, what went well/poorly, and tracked action items with owners. Use for 'write a postmortem', 'incident retrospective', 'blameless RCA', 'root cause analysis', or 'after-action review'. Focus on fixing systems, never blaming people."
argument-hint: "The incident details"
---

# Incident Postmortem

Turn an incident into durable learning with a **blameless** postmortem that fixes systems, not
people — following [`AGENTS.md`](../../../AGENTS.md). Pairs with
[runbook-writer](../runbook-writer/SKILL.md) and [debugging-coach](../debugging-coach/SKILL.md).

## When to use

- After an outage, security incident, or near-miss the learner is authorized to review.
- Practicing incident analysis and root-cause reasoning as a skill.

## Procedure

1. **Summarize:** one-paragraph what-happened, severity, and the systems/users affected.
2. **Build the timeline:** detection → diagnosis → mitigation → recovery, with timestamps (UTC)
   and who did what — factually, without blame.
3. **Quantify impact:** duration, scope, error rate, data/revenue/SLA effect; how it was detected.
4. **Find root cause:** apply the **5 Whys** past the symptom; list contributing factors (technical,
   process, monitoring). Distinguish the trigger from the underlying cause.
5. **What went well / poorly:** honest reflection on detection, response, and communication.
6. **Action items:** each with an **owner, due date, and type** (prevent / detect / mitigate);
   file them as tracked issues. End with lessons learned.

## Output shape

```
Incident: <title> | Severity: <Sev> | Date: <UTC> | Status: resolved
Impact: <who/what, duration, magnitude>
Timeline (UTC): HH:MM detect → HH:MM mitigate → HH:MM recover
Root cause (5 Whys): symptom → … → underlying cause
Contributing factors: …
Went well / Went poorly: …
Action items: [owner] <fix> — due <date> — prevent/detect/mitigate
```

## Tips

- Blameless means system-focused language: "the deploy lacked a gate", not "X broke it".
- A cause you can't act on isn't the root cause — keep asking why until you reach a control.
- For security incidents, align with NIST SP 800-61r2 (2012); close with the **Learning Footer** (`AGENTS.md`).
