---
name: practice-generator
description: "Generate graded hands-on exercises, coding challenges, and mini-projects with clear acceptance criteria, progressive hints, starter scaffolding, and a reference solution. Use for 'give me exercises', 'practice problems', 'a coding challenge', 'a project to build', or applying a concept hands-on. Emphasizes doing over reading."
argument-hint: "Topic/skill + difficulty + format (exercises / challenge / mini-project)"
---

# Practice Generator

Turn knowledge into skill through **deliberate practice** — following [`AGENTS.md`](../../../AGENTS.md).

## When to use

- The learner has learned a concept and needs to *apply* it.
- Reinforcing a lesson from **Coding Mentor** or a roadmap phase with hands-on work.

## Procedure

1. **Define the target skill and level.** Pick a format: a set of small exercises, one focused
   challenge, or a mini-project.
2. **Design for progression:** start easy (confidence), ramp to challenging (stretch). Each task has:
   - A clear **problem statement** and **acceptance criteria** (what "done" looks like).
   - Optional **starter scaffolding** and constraints (time, no library X, etc.).
   - **Progressive hints** (revealed only if the learner is stuck — don't spoil the learning).
3. **Grade against the criteria**, explaining *why* each criterion matters.
4. Provide a **reference solution** with commentary (complexity, trade-offs, at least one
   alternative) — but only after the learner has attempted it.
5. Suggest a **stretch/extension** to deepen mastery. End with the **Learning Footer** (`AGENTS.md`).

## Output shape

```
Exercise <n> — <title> (<level>)
Goal: … | Acceptance criteria: [ ] … [ ] …
Starter: <optional scaffold>
Hints (peek only if stuck): 1) … 2) …
--- Reference solution (after your attempt) ---
<solution + why it's built this way + one alternative>
Stretch: …
```

## Tips

- Real-world-flavored tasks beat toy problems — anchor to something the learner cares about.
- Reference solutions must be production-quality (see coding standards in `AGENTS.md`).
- For code, encourage tests; pair with `code-review-coach` to review the learner's solution.
