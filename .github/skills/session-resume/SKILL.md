---
name: session-resume
description: "Rich 'welcome back' that resumes a learner exactly where they left off — read `learning-profile.md` and show a since-last-time recap, momentum (streak, recently completed), what's in progress, what's due for review today, and the single best next action to start now. Use for 'resume', 'welcome back', 'continue', 'where did I leave off', or the start of any returning session. The other half of learner-memory."
argument-hint: "'resume' (or a topic to resume), optional"
---

# Session Resume

Bring a returning learner back into flow in seconds, following [`AGENTS.md`](../../../AGENTS.md) — so no
momentum is lost between sessions. This is the read-side companion to
[`learner-memory`](../learner-memory/SKILL.md); it reads the same `learning-profile.md` and turns it into a
motivating, actionable **welcome-back card**.

## When to use
- The start of a **returning** session, or the learner says "resume", "continue", "welcome back".
- Drona's step 1 finds an existing profile and should re-engage the learner (not onboard).

## Procedure
1. **Read the profile** (`learning-profile.md`): goal/objective, level, *Next step*, in-progress topic,
   completed topics, review state, last-active date.
2. **Compute the recap:** *since last time* (days away), **momentum** via
   [`progress-tracker`](../progress-tracker/SKILL.md) (streak, recently completed), and what changed.
3. **Surface what's due** today via [`spaced-repetition-scheduler`](../spaced-repetition-scheduler/SKILL.md)
   so overdue reviews aren't silently missed.
4. **Pick ONE best next action** — the recorded *Next step*, or the next roadmap item — and make it a
   concrete, do-it-now task (not a vague "keep learning").
5. **Offer branches:** continue the in-progress topic · clear due reviews · adjust the goal/plan.
6. Keep it short and encouraging; then start the chosen action immediately.

## Output shape
```
Welcome back, <name>!  (last active <n> days ago · 🔥 streak <n>)
Goal: <objective / cert>            Level: <…>
Since last time: <what you completed>
In progress: <topic>  →  Next step: <one concrete action to start now>
Due for review today: <topics/cards>  (say "review" to clear them)
Pick: [continue] · [review] · [adjust plan]
```

## Tips
- Lead with the **next action**, not a status dump — reduce friction to restart.
- Always pull due reviews so streaks and retention don't quietly decay.
- Writes back via `learner-memory` at the end of the session. Pairs with `learner-onboarding` (first run),
  `progress-tracker`, `spaced-repetition-scheduler`. End with the **Learning Footer** (`AGENTS.md`).
