---
name: learning-roadmap
description: "Generate a dated, personalized learning roadmap or skill tree (30/60/90-day or custom) with phases, weekly and daily goals, milestones, curated resources, checkpoints, and a way to track progress. Use for 'where do I start', 'study plan', 'roadmap to become X', 'plan to learn Y in N weeks', or sequencing a large topic into a realistic schedule."
argument-hint: "Goal + timeframe + hours/week + current level (e.g. 'Azure AI Engineer, 90 days, 1h/day, intermediate')"
---

# Learning Roadmap

Turn a big goal into a **realistic, sequenced, dated plan** — following [`AGENTS.md`](../../../AGENTS.md).

## When to use

- The learner wants a path from where they are to a defined goal (role, cert, skill, project).
- Any multi-week learning effort that needs structure and pacing.

## Procedure

1. **Capture inputs:** goal, deadline/timeframe, hours/week, current level, and constraints. If the
   goal is a certification, anchor to its official objectives (hand off to **Exam and Certification
   Coach** for the syllabus).
2. **Decompose** the goal into 3–6 **phases** (foundations → core → advanced → applied/project).
3. **Sequence by dependency and leverage** — teach prerequisites first; front-load high-impact skills.
4. **Schedule** into weeks and daily tasks that fit the hours/week. Each week has a clear **outcome**
   and a **checkpoint** (a quiz, a mini-project, or a teach-back).
5. **Attach resources** — prefer official docs/courses; mark each as read/watch/build. Pull the best
   **free** options (YouTube, MOOCs like CS50/freeCodeCamp/MIT OCW, interactive sites like exercism/The
   Odin Project) from [`data/learning-resources.json`](../../../data/learning-resources.json) or hand off
   to [learning-resource-finder](../learning-resource-finder/SKILL.md). When the goal maps to a known path,
   point to the matching **roadmap.sh** roadmap from
   [`data/roadmaps.json`](../../../data/roadmaps.json) and adapt its structure to the learner's level
   (link-out only — never copy roadmap node content; credit: roadmaps courtesy of roadmap.sh by Kamran
   Ahmed).
6. **Add milestones & a progress tracker** (checklist or table the learner can tick off).
7. Offer to **save** the plan to a file. End with the **Learning Footer** (`AGENTS.md`).

## Output shape

```
Goal · Timeframe · Hours/week · Level
Phase 1 — <name> (Weeks 1–2) → outcome
  Week 1: daily tasks … → checkpoint
  Week 2: …
Phase 2 — …
Milestones: …
How you'll know you're on track: …
```

## Tips

- Be honest about scope: if the timeframe is too short, say so and offer a focused subset.
- Build in **spaced review** and **hands-on** time, not just reading (pair with `flashcards`,
  `practice-generator`, `quiz-generator`).
- Prefer one great resource per topic over ten mediocre ones.
