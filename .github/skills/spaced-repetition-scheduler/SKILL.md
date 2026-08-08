---
name: spaced-repetition-scheduler
description: "Manage a spaced-repetition review schedule for flashcards or topics — compute next due dates (expanding intervals like 1, 3, 7, 16, 35 days, or an SM-2-style ease factor), record results, and tell the learner what's due today and what's coming. Use for 'what should I review today', 'schedule my reviews', 'spaced repetition plan', or 'track my flashcards'."
argument-hint: "Cards/topics to schedule + last results (or 'what's due today')"
---

# Spaced-Repetition Scheduler

Make review durable and efficient — following [`AGENTS.md`](../../../AGENTS.md). Persists the learner's
schedule per the memory model in [`docs/Memory.md`](../../../docs/Memory.md).

## When to use
- The learner uses `flashcards` and wants to know **what to review when**.
- Tracking retention over time so nothing is forgotten or over-reviewed.

## Procedure
1. Take the **cards/topics** and each item's **last result** (again / hard / good / easy) and last date.
2. Compute the **next interval**:
   - Simple ladder: `1 → 3 → 7 → 16 → 35 → 90` days; advance on success, **reset to 1 on a miss**.
   - Or SM-2-style: adjust an *ease factor* and multiply the interval; harder cards come back sooner.
3. **Record** results and next-due dates in a review log (or the learner's
   [`learning-profile`](../../../templates/learning-profile.template.md)).
4. Output **what's due today**, what's upcoming this week, and current retention at a glance.

## Output shape
```
Due today (n): <card> (last: good, +7d) …
Upcoming: Wed 3 · Fri 5 …
After you review, tell me the result per card and I'll reschedule.
Retention snapshot: mature X · learning Y · lapsed Z
```

## Tips
- Keep the state small and human-readable so the learner owns their data (see privacy in
  `docs/Memory.md`).
- Pair with `flashcards` (make cards) and `quiz-generator` (test). End with the **Learning Footer**
  (`AGENTS.md`).
