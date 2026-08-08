---
name: cloud-migration-planner
description: "Plan a cloud migration with the 6 Rs — rehost, replatform, refactor, repurchase, retire, retain — by assessing the estate, mapping each app to a strategy, and sequencing waves by risk and dependency. Use for 'plan a cloud migration', '6 Rs / 7 Rs', 'lift and shift vs refactor', 'migration wave planning', 'data center exit', or learning cloud migration strategy."
argument-hint: "The current estate + goals"
---

# Cloud Migration Planner

Plan a migration the way the Cloud Adoption Framework does — assess, choose a strategy per app, sequence
by risk — per [`AGENTS.md`](../../../AGENTS.md). Pairs with [tech-comparison](../tech-comparison/SKILL.md) and [estimation-coach](../estimation-coach/SKILL.md).

## When to use

- The learner is moving an estate to cloud and needs a defensible, sequenced plan.
- Reinforcing migration trade-offs for a **cloud/solutions-architect** role-agent.

## The 6 Rs

| Strategy | Move | Effort / reward |
| --- | --- | --- |
| Rehost | lift-and-shift as-is | low effort, low cloud-native gain |
| Replatform | minor optimize (e.g., managed DB) | medium / medium |
| Refactor | re-architect cloud-native | high / high |
| Repurchase | move to SaaS | drop-in, less control |
| Retire | decommission unused | pure savings |
| Retain | keep on-prem for now | deferred |

## Procedure

1. **Assess:** inventory apps, dependencies, data gravity, compliance, and cost — you can't sequence what
   you haven't mapped.
2. **Choose a strategy per app** against goals (speed vs. modernization vs. cost); default to rehost for
   speed, refactor where cloud-native value is high (AWS 6 R's, 2016; 7 R's adds *relocate*).
3. **Prioritize:** score by business value, risk, and dependency coupling; retire/repurchase easy wins
   early to build momentum.
4. **Sequence waves:** group low-risk, low-dependency apps first; keep tightly-coupled systems in one wave.
5. ⚠ **De-risk cutover:** pilot, plan data migration + rollback, and validate before decommissioning anything.

## Output shape

```
Estate: <N apps> | Goals: speed/modernize/cost | Deadline: …
Per-app: <app> → <R> — because …
Waves: 1 (low-risk/retire) → 2 (rehost) → 3 (refactor)
Cutover: pilot → migrate → validate → decommission (rollback ready)
Risks: data gravity … | dependency coupling … | compliance …
```

## Tips

- Not everything should move — retire and retain are wins, not failures.
- Rehost fast to exit a data center, then refactor in the cloud where it pays off.
- End with the **Learning Footer** (`AGENTS.md`) — one app to re-classify + one wave to sequence yourself.
