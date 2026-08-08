---
name: case-study
description: "Build or analyze a real-world case study for learning — frame the problem and context, walk the approach and key decisions with their trade-offs, extract transferable lessons, and pose discussion questions. Use for 'case study on X', 'analyze how company Y solved Z', 'system design case study', 'learn from this incident/postmortem', or 'break down this architecture decision'. Grounds facts in cited sources."
argument-hint: "Scenario/company/system + learning objective"
---

# Case Study

Turn a real system, company, or scenario into a teaching case — following the source discipline in
[`AGENTS.md`](../../../AGENTS.md). Understanding the *why* matters more than the summary.

## When to use

- The learner wants to learn from a real system, decision, incident, or company move.
- Studying architecture, product, or engineering trade-offs through a concrete example.

## Procedure

1. **Set the objective and subject:** the learning goal and the company/system/scenario; decide
   whether to **build** a fresh case or **analyze** an existing one.
2. **Frame problem and context:** goals, constraints, stakeholders, and what was at stake — the
   forces that made the decision hard.
3. **Walk the approach and key decisions:** at each fork, the alternatives considered and the
   **trade-offs** (why this, not that) — cost, speed, risk, scale.
4. **Ground every fact** in real, **cited, dated** sources (per `AGENTS.md`); clearly separate
   documented fact from your own inference. Never fabricate details, metrics, or quotes.
5. **Extract transferable lessons:** what generalizes to other contexts vs. what was situation-specific.
6. **Pose discussion questions** to test understanding and provoke debate (hand off to
   [`quiz-generator`](../quiz-generator/SKILL.md) or [`teach-back`](../teach-back/SKILL.md)).

## Output shape

```
Case: <subject> — learning objective: …
Context & problem: constraints … | stakes …
Decisions & trade-offs:
  • <decision> — options: … | chose … because … | trade-off: …  [source, YYYY-MM-DD]
Outcome: … (fact vs. inference labeled)
Lessons (transferable): 1) … 2) …
Discussion questions: 1) … 2) …
```

## Tips

- Label fact vs. inference — a case is only as trustworthy as its sources.
- The trade-offs are the lesson; a decision without its alternatives teaches little.
- Finish with the **Learning Footer** (`AGENTS.md`).
