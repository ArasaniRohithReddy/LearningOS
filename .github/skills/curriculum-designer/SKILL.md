---
name: curriculum-designer
description: "Design a multi-module curriculum or course for a topic using backward design — define learning objectives with Bloom's verbs, sequence modules by dependency, and give each module outcomes, activities, and aligned assessment. Use for 'design a course', 'build a curriculum', 'course outline', 'syllabus for X', 'teach a class on Y', or structuring a subject to teach others. A teaching plan, not a personal study schedule."
argument-hint: "Subject + audience + duration (e.g. 'intro Python for analysts, 6 weeks')"
---

# Curriculum Designer

Design a course to **teach others** — start from the outcomes, then work backward to content — following
the teaching principles in [`AGENTS.md`](../../../AGENTS.md). This is a *teaching* plan; for a personal
study schedule use [`learning-roadmap`](../learning-roadmap/SKILL.md).

## When to use
- The learner is building a course, workshop, or bootcamp to teach a topic to an audience.
- Structuring a large subject into modules with clear objectives and assessment.

## Procedure
1. **Capture inputs:** subject, audience (level, prior knowledge, goals), duration, and constraints
   (session count, format). Missing context changes the design — ask one question if it's unclear.
2. **Backward design** (Wiggins & McTighe, *Understanding by Design*, 2005): define **terminal
   outcomes** first — what a learner can *do* at the end — then assessment, then content.
3. **Write objectives with Bloom's verbs** (remember → understand → apply → analyze → evaluate → create).
   Make each observable and measurable; avoid bare "understand".
4. **Sequence modules by dependency and cognitive load** — prerequisites first, spiral back to reinforce.
5. **Per module:** outcome, key concepts, an active-learning **activity**, and an **assessment** that
   matches the objective's verb (constructive alignment — Biggs).
6. **Add a capstone** that integrates modules, plus review and spaced-practice checkpoints.
7. Offer to hand modules to [`lesson-plan-writer`](../lesson-plan-writer/SKILL.md). End with the footer.

## Output shape
```
Course: <title> — for <audience> (<duration>)
Terminal outcomes: by the end, learners can … (Bloom's: apply / analyze / create)
Module 1 — <name>: objective · concepts · activity · assessment
Module 2 — …
Capstone: … | Alignment map: objective → check
```

## Tips
- Objectives drive everything — if an activity or quiz doesn't map to one, cut it or fix the objective.
- Bloom's is a useful ladder, not a strict hierarchy; real learning revisits levels (state that caveat).
- Build assessments with [`quiz-generator`](../quiz-generator/SKILL.md) and
  [`rubric-grader`](../rubric-grader/SKILL.md). End with the **Learning Footer** (`AGENTS.md`).
