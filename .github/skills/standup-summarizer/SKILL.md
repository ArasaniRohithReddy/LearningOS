---
name: standup-summarizer
description: "Turn raw updates into a crisp standup or status report — yesterday, today, and blockers per person, with risks surfaced and filler removed. Use for 'summarize our standup', 'write my daily status', 'async standup update', 'turn these notes into a status report', or 'what are the blockers'. Focuses on flow and blockers, not status theater; pairs with retrospective-facilitator and progress-tracker."
argument-hint: "The raw updates/notes"
---

# Standup Summarizer

Compress messy updates into a scannable standup that surfaces blockers and risks — following
[`AGENTS.md`](../../../AGENTS.md). Pairs with [`retrospective-facilitator`](../retrospective-facilitator/SKILL.md) and [`progress-tracker`](../progress-tracker/SKILL.md).

## When to use

- The learner has raw notes or updates and needs a clean daily standup or written status.
- Running an async standup where clarity and surfaced blockers matter most.

## Procedure

1. **Gather raw input** per person; group by owner and drop chatter, duplicates, and filler.
2. Structure each person around the classic **three questions**: **Yesterday** (done), **Today**
   (plan), **Blockers** (what is stopping them).
3. Keep items **outcome-focused** and specific — "merged auth PR," not "worked on stuff"; link
   tickets where useful.
4. **Surface blockers and risks to the top**, each with an **owner and a clear ask** — the standup
   exists to unblock flow, not to report up to a boss.
5. Note **cross-team dependencies** and anything slipping versus the sprint goal (feed
   [`retrospective-facilitator`](../retrospective-facilitator/SKILL.md) if a blocker recurs).
6. Keep it **short and skimmable** — a standup summary should read in under a minute.

## Output shape

```
Standup: <team> — <date>
Per person:
  <name> — Yesterday: … | Today: … | Blocker: <what> (needs: <who/what>)
Blockers & risks (top):
  • <blocker> — owner: <name>, ask: …
At risk vs. sprint goal: …
```

## Tips

- Blockers are the point — surface them loudly with a clear ask and an owner.
- Status ≠ activity; report outcomes, cut filler, keep it under a minute to read.
- Finish with the **Learning Footer** (`AGENTS.md`).
