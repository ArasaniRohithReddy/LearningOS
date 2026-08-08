---
name: gap-analysis
description: "Compare a learner's current skills against a target role or goal and produce a prioritized gap report — required competencies, current vs target level per skill, biggest/highest-leverage gaps first, and a plan to close them. Use for 'skill gap analysis', 'what am I missing to become X', 'current vs target skills', 'am I ready for this role', or turning a job description into a learning plan."
argument-hint: "Current skills + target role/goal"
---

# Gap Analysis

Turn the distance between where the learner is and where they want to be into a **prioritized, closeable
plan** — following [`AGENTS.md`](../../../AGENTS.md).

## When to use
- The learner has a target role/goal and wants to know exactly what to learn and in what order.
- Following a [`skill-assessment`](../skill-assessment/SKILL.md), or when a job description is the target.

## Procedure
1. **Define the target competencies.** Derive the required skills and expected level from **official or
   primary sources** (job posts, cert objectives, framework docs) — cite them; don't invent requirements.
2. **Capture current skills** — self-reported, shown by evidence (repos/projects), or measured via a
   [`skill-assessment`](../skill-assessment/SKILL.md).
3. **Map current vs target** per competency and size the gap (none / small / large).
4. **Prioritize gaps** by leverage and dependency — highest-impact and prerequisite skills first.
5. **Draft a closing move** per top gap (what to learn, one resource, a way to prove it).
6. **Hand off** to [`learning-roadmap`](../learning-roadmap/SKILL.md) to schedule it.

## Output shape
```
Target: <role/goal>   Source(s): <cited, dated>
Competency        Current → Target   Gap     Priority
<skill>           Int → Adv          large   1
…
Close the top gaps: 1) <skill> — <how>  2) …
Next → /learning-roadmap <goal>
```

## Tips
- Rank by impact, not by what's easy or fun to learn.
- Be honest when a gap is large; also credit strengths already at target.
- Requirements must be cited and dated. End with the **Learning Footer** (`AGENTS.md`).
