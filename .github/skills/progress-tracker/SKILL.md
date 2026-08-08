---
name: progress-tracker
description: "Track learning progress over time — record completed topics, quiz scores, streaks, and due reviews into a simple Markdown log, then summarize momentum and what to do next. Use for 'track my progress', 'learning log', 'how am I doing', 'update my streak', 'what's due', or 'log this session'. Operationalizes the LearningOS memory model."
argument-hint: "What to log / the learner's recent activity"
---

# Progress Tracker

Keep a simple, durable record of what the learner has studied so momentum is visible and the next step
is obvious — operationalizing the memory model in [`AGENTS.md`](../../../AGENTS.md).

## When to use
- The learner says "track my progress", "log this session", "update my streak", or "how am I doing?".
- After any lesson, quiz, or review, to capture the result and decide what's next.

## Procedure
1. **Open the log.** Read or create a plain-Markdown file (e.g., `progress.md`); keep it **append-only**
   so any tool can parse it.
2. **Record activity.** Append today's completed topics, quiz/mock scores, and time spent.
3. **Update streak & reviews.** Increment the day streak and pull due items from
   [`spaced-repetition-scheduler`](../spaced-repetition-scheduler/SKILL.md).
4. **Read the momentum.** Summarize the score trend, flag stalled topics, celebrate the streak.
5. **Recommend next.** Give the single best next action based on the log.

## Output shape
```
## Progress — <YYYY-MM-DD>
Done today: <topics> · Time: <min> · Scores: <quiz/mock> (trend ↑/↓)
Streak: <n> days 🔥 · Reviews due: <n>
Momentum: <one-line read> · Stalled: <topic>
Next: <single best action>
```

## Tips
- Track leading indicators (reviews done, streak), not just outcomes (scores).
- Keep it plain Markdown and append-only — a log you trust beats a fancy one you abandon.
- Route weak topics to [`gap-analysis`](../gap-analysis/SKILL.md) and due cards to
  [`flashcards`](../flashcards/SKILL.md). End with the **Learning Footer** (`AGENTS.md`).
