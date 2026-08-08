---
name: learner-memory
description: "Maintain a persistent learner memory so nothing is forgotten across sessions — create/read/update a `learning-profile.md` (goals, level, strengths, gaps, completed topics, current projects), track what's in progress and what's due for review, and surface 'where you left off + what to do next' at the start of a session. Use for 'remember my progress', 'where did I leave off', 'what should I review', 'update my profile', or resuming learning. The memory backbone of LearningOS."
argument-hint: "What to remember/update, or 'resume' to pick up where you left off"
---

# Learner Memory

Give the learner a **memory that persists across sessions** so their goals, progress, and reviews are
never lost — following [`AGENTS.md`](../../../AGENTS.md). This is the backbone that makes LearningOS a
long-term companion rather than a set of one-off chats. It ties together the
[`learning-profile.template.md`](../../../templates/learning-profile.template.md),
[`progress-tracker`](../progress-tracker/SKILL.md), and
[`spaced-repetition-scheduler`](../spaced-repetition-scheduler/SKILL.md). See [Memory.md](../../../docs/Memory.md).

## When to use
- **Start of any session** — Drona reads the learner's memory to personalize and resume ("where you left off").
- The learner says "remember this", "update my goal", "what should I review today", or "resume".
- End of a session — record what was learned, what's next, and what's due.

## Procedure
1. **Locate the profile.** Look for `learning-profile.md` (the learner's local copy of the
   [template](../../../templates/learning-profile.template.md)). If none exists, offer to create one and
   ask a few quick questions (role/status, primary goal, level, time available, stack).
2. **Read & summarize the memory:** goals, level, strengths/gaps, **completed topics** (never re-teach
   these), **in progress**, current projects, and the **review queue** (what's due).
3. **On "resume":** surface *where you left off* + the single best next step, plus anything **due for
   review** today (via `spaced-repetition-scheduler`) so it isn't missed.
4. **On updates:** append/edit precisely — mark a topic completed, add a new goal, log a quiz score,
   record a new weak area. Keep it short, factual, **no secrets**.
5. **Close the loop:** after a lesson, write back what was learned, update in-progress/next, and schedule
   reviews so the learner can't silently fall behind.
6. Confirm what was remembered and what's due next.

## Output shape
```
Memory — <learner> (updated YYYY-MM-DD)
Goal: <primary goal / target cert> · Level: <…> · Time: <…/day>
Resume → you left off at: <topic/step>   Next: <one best next step>
Due for review today: <topics/cards> (spaced-repetition)
Completed: <recent> · In progress: <current> · Weak areas: <focus>
Updated: <what changed this session>
```

## Tips
- **Cross-session by design:** the profile is a **file on disk** (`learning-profile.md`), so it persists
  across sessions automatically. To carry it further: **commit it to the repo** (roams with the project),
  and/or use the client's built-in **Copilot Memory** or an **MCP memory server** for cross-machine,
  cross-workspace recall (see [MCP.md](../../../docs/MCP.md)). Same profile, every session.
- The profile is the **learner's data** — kept local, editable/deletable anytime, never contains secrets
  ([Security.md](../../../docs/Security.md)).
- Prefer small, durable facts over transcripts; remove stale entries.
- Pair with `progress-tracker` (streaks/scores), `spaced-repetition-scheduler` (due dates), and
  `knowledge-graph` (what to learn next). End with the **Learning Footer** (`AGENTS.md`).
