---
name: engineering-culture-coach
description: "Build a healthy engineering culture on purpose — articulate values, turn them into everyday norms, align incentives, and adopt blameless practices — so quality and learning are the default. Use for 'improve engineering culture', 'team values and norms', 'blameless postmortems', 'why do our incentives backfire', 'define our ways of working', or 'culture of ownership'. Pairs with team-health-coach and feedback-giver."
argument-hint: "The org/team"
---

# Engineering Culture Coach

Shape culture deliberately — values become norms, incentives reward them, blame gives way to learning —
following [`AGENTS.md`](../../../AGENTS.md). Pairs with [`team-health-coach`](../team-health-coach/SKILL.md) and [`feedback-giver`](../feedback-giver/SKILL.md).

## When to use

- Values on the wall don't match daily behavior, and you want to close the gap on purpose.
- Incentives are quietly rewarding the wrong things (heroics, shipping over quality, blame).

## Procedure

1. **Name a few real values as behaviors,** not slogans — "we review every change", "we write
   postmortems" — 3–5 you would actually hire, promote, and fire for.
2. **Turn values into norms:** the defaults in code review, on-call, planning, and docs — culture is
   what the team *does* under pressure, not the poster.
3. **Align incentives:** promotion, praise, and workload must reward the values — if heroics get
   promoted you will get fires; reward prevention and teamwork instead.
4. **Go blameless** (Google SRE, Etsy): postmortems attack the system, not the person — blame buys
   silence and hidden risk, while safety buys signal.
5. **Aim for a generative culture** (Westrum's typology): information flows, failure triggers inquiry,
   and new ideas are welcomed — a DORA-linked predictor of delivery performance.
6. **Model and reinforce:** leaders live the norms, give feedback ([`feedback-giver`](../feedback-giver/SKILL.md)) when they slip, and
   re-check team health ([`team-health-coach`](../team-health-coach/SKILL.md)) — culture is maintained, not declared.

## Output shape

```
Culture: <org/team>
Values (as behaviors): 1) … 2) … 3) …
Norms: code review · on-call · planning · docs defaults
Incentives: what gets promoted/praised — aligned?
Blameless: postmortems attack systems, not people
Next: model · reinforce · re-check health
```

## Tips

- Culture is the worst behavior a leader tolerates — norms and incentives beat value statements.
- Blameless is not consequence-free; it removes fear so you get the truth and fix the system.
- Finish with the **Learning Footer** (`AGENTS.md`).
