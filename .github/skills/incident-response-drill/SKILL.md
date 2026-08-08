---
name: incident-response-drill
description: "Run a DEFENSIVE blue-team incident-response tabletop as a lesson — assign roles (IC, ops, comms, scribe), then walk detection, triage, containment, eradication, communication, and recovery for a simulated scenario, ending in a blameless postmortem. Authorized and simulated only. Use for 'run an incident tabletop', 'IR drill', 'practice on-call', 'incident roles', or learning incident management. Defense only."
argument-hint: "The scenario/system"
---

# Incident Response Drill

Rehearse incident handling the way calm on-call teams do — **authorized, simulated** blue-team practice
to build muscle memory, never a real attack — per [`AGENTS.md`](../../../AGENTS.md). Pairs with [runbook-writer](../runbook-writer/SKILL.md).

## When to use

- The learner wants reps on coordinating an incident for a system they own or may review.
- Practicing on-call, roles, and comms for an **SRE**/DevOps role-agent — simulated only.

## Roles

| Role | Owns |
| --- | --- |
| Incident Commander | decisions, coordination, declaring severity |
| Ops / Responder | investigation and mitigations |
| Comms | stakeholder and customer updates |
| Scribe | timeline and decisions |

## Procedure

1. **Set scope:** confirm the scenario is authorized and **simulated**; assign roles and declare a
   severity.
2. **Detect:** what signal fired — an alert or SLO burn (→ [slo-designer](../slo-designer/SKILL.md))? Separate facts from guesses.
3. **Triage:** assess impact and blast radius, set/adjust severity, and open one channel + one incident doc
   as the single source of truth.
4. **Contain & eradicate:** stop the bleeding first (roll back, isolate, feature-flag) with reversible
   mitigations before chasing root cause; use [runbook-writer](../runbook-writer/SKILL.md) steps.
5. **Communicate:** send stakeholder updates on a fixed cadence, even "no change yet."
6. **Recover & learn:** verify health, then write a **blameless** postmortem with action items (Google
   SRE book, *Postmortem Culture*, 2016).

## Output shape

```
Scenario (simulated, authorized): … | Severity: …
Roles: IC … | Ops … | Comms … | Scribe …
Timeline: detect → triage → contain → eradicate → recover
Comms: audience → cadence → channel (single source of truth)
Postmortem: what / impact / timeline / root cause / actions (blameless)
```

## Tips

- Blue-team only: practice defense, coordination, and comms — never real intrusion or attack steps.
- Mitigate before you fully understand root cause; blameless postmortems fix systems, not people.
- End with the **Learning Footer** (`AGENTS.md`) — the role to rehearse + one detection gap to close.
