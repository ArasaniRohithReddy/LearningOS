---
name: aws-well-architected-review
description: "Review an architecture against the AWS Well-Architected Framework's six pillars — operational excellence, security, reliability, performance efficiency, cost optimization, and sustainability — surfacing risks as prioritized findings with fixes. Use for 'well-architected review', 'AWS architecture review', 'WAFR', 'is my AWS design solid', 'find risks in my AWS workload', or learning the Well-Architected pillars."
argument-hint: "The AWS architecture/workload"
---

# AWS Well-Architected Review

Pressure-test an AWS workload the way a solutions architect does — pillar by pillar, risks ranked by
blast radius — per [`AGENTS.md`](../../../AGENTS.md). Pairs with [architecture-diagram](../architecture-diagram/SKILL.md) and [tech-comparison](../tech-comparison/SKILL.md).

## When to use

- The learner wants a structured risk review of an AWS design, before or after building it.
- Reinforcing cloud trade-offs for a **cloud/solutions-architect** role-agent.

## Pillars

| Pillar | Core question |
| --- | --- |
| Operational excellence | can you run, observe, and improve it? |
| Security | is data and access protected in depth? |
| Reliability | does it recover from failure automatically? |
| Performance efficiency | right resources, scaled to demand? |
| Cost optimization | paying only for value delivered? |
| Sustainability | minimizing the energy/resource footprint? |

## Procedure

1. **Scope the workload:** business goal, users, data sensitivity, RTO/RPO, cost ceiling — findings are
   meaningless without context.
2. **Interrogate each pillar** with the framework's questions (AWS Well-Architected Framework;
   sustainability added 2021); note what's missing, not just what's present.
3. **Rate each finding** by risk — High (HRI) / Medium / Low, from likelihood × impact.
4. **Prioritize:** fix High-Risk Issues first; sequence the rest against effort and the cost ceiling.
5. ⚠ **Recommend safely:** flag any change touching prod, IAM, or spend; verify blast radius before applying.

## Output shape

```
Workload: … | RTO/RPO: … | Cost ceiling: …
Findings by pillar:
  [Security]    HRI: public S3 bucket → Block Public Access + SSE
  [Reliability] MED: single-AZ RDS → Multi-AZ failover
  [Cost]        LOW: idle NAT gateways → consolidate
Top 3 fixes (ranked): 1 … 2 … 3 …
```

## Tips

- Pillars trade off — more reliability usually costs more; make the trade explicit, don't hide it.
- Cite the framework and re-review after big changes; a WAFR is a habit, not a one-off.
- End with the **Learning Footer** (`AGENTS.md`) — the top HRI to fix + one pillar to deepen yourself.
