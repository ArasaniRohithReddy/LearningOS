---
name: feature-prioritization-coach
description: "Prioritize a backlog with a real framework — RICE, ICE, or value-vs-effort — score items honestly against a goal, then sequence by dependency and risk. Use for 'prioritize my backlog', 'RICE scoring', 'ICE score', 'value vs effort', 'what should we build first', or 'MoSCoW / WSJF'. Distinguishes scoring from sequencing; pairs with prd-writer and okr-coach."
argument-hint: "The features + goals"
---

# Feature Prioritization Coach

Turn a long wish-list into a defensible order to build — following [`AGENTS.md`](../../../AGENTS.md).
Pairs with [`prd-writer`](../prd-writer/SKILL.md) and [`okr-coach`](../okr-coach/SKILL.md).

## When to use

- The learner has more ideas than capacity and needs an honest, goal-tied order.
- Comparing frameworks or defending a roadmap decision to stakeholders.

## Procedure

1. **Fix the goal first:** the objective or metric each item is scored against (tie to
   [`okr-coach`](../okr-coach/SKILL.md)) — priority is meaningless without it.
2. **Pick a framework** for the context: **RICE** (Reach × Impact × Confidence ÷ Effort),
   **ICE** (Impact, Confidence, Ease), or a value-vs-effort 2×2 for a quick pass.
3. **Score honestly** on a shared scale; **Confidence** is the antidote to fake precision — low
   confidence should sink a flashy bet, not decorate it.
4. **Compute and rank**, then sanity-check against judgment — a formula informs the call, it does
   not make it; watch for anchoring and pet projects.
5. **Layer constraints:** dependencies, deadlines, risk, and effort — use MoSCoW or Kano to protect
   must-haves and basic expectations.
6. **Sequence, don't just rank:** order by dependency and value-at-risk so early work unblocks and
   de-risks the rest; revisit as evidence changes.

## Output shape

```
Goal / metric: …
Framework: <RICE | ICE | value-effort> — why
Scores:
  | Item | Reach | Impact | Confidence | Effort | Score |
Rank vs. judgment: … (overrides + why)
Constraints: dependencies … | deadlines … | risk …
Sequence: 1) … 2) … 3) …
```

## Tips

- Scores are estimates, not truth — the framework structures the debate, it does not end it.
- Confidence keeps hype honest; a huge impact at 20% confidence is a small bet.
- Rank orders value; sequence respects dependencies — ship in that order.
- End with the **Learning Footer** (`AGENTS.md`).
