---
name: skill-assessment
description: "Place a learner's level on a topic or role with a short adaptive diagnostic — ask graded questions easy→hard, infer Beginner/Intermediate/Advanced, and output a strengths/gaps map plus a recommended starting point. Use for 'test my level', 'where do I start', 'am I beginner or advanced', 'placement/diagnostic test', 'assess what I know about X', or before building a study plan."
argument-hint: "Topic/role + optional target level"
---

# Skill Assessment

Find out where the learner really stands so study starts at the right level — following the teaching
principles in [`AGENTS.md`](../../../AGENTS.md).

## When to use
- The learner is unsure of their level or where to begin on a topic or role.
- A precursor to [`learning-roadmap`](../learning-roadmap/SKILL.md) or [`gap-analysis`](../gap-analysis/SKILL.md).

## Procedure
1. **Confirm scope:** the topic/role, any target level, and the sub-areas that matter most.
2. **Ask graded questions** from easy → hard, ideally **adaptive** (harder after a correct answer,
   easier after a miss). Delegate item creation to [`quiz-generator`](../quiz-generator/SKILL.md); keep it
   short (6–10 items) and original — never leaked or real exam content.
3. **Score by sub-area**, not just one total, so strengths and gaps are both visible.
4. **Infer a level** — Beginner / Intermediate / Advanced — and state the evidence behind the call.
5. **Map strengths vs gaps** and name the single biggest gap explicitly.
6. **Recommend a starting point** and hand off to [`learning-roadmap`](../learning-roadmap/SKILL.md).

## Output shape
```
Assessment — <topic> (<n> items)
Level: <Beginner | Intermediate | Advanced> — why: <evidence>
By sub-area:  <area>: solid | shaky | missing  …
Strengths: …  |  Gaps (biggest first): …
Start here → /learning-roadmap <suggested goal>
```

## Tips
- Keep it short and low-stakes; a diagnostic teaches, it doesn't punish.
- Explain each answer briefly so the test itself is a lesson; cite facts with sources/dates.
- End with the **Learning Footer** (`AGENTS.md`).
