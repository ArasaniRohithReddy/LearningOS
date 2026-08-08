---
name: hackathon-planner
description: "Plan a hackathon project end to end for a fixed timebox — scope to what's actually buildable, assign roles, draw an MVP cut-line (must/should/won't), order the build as a vertical slice, and plan the demo. Use for 'plan our hackathon', 'what can we build in 24/48 hours', 'hackathon idea to demo', 'scope this for a sprint', or racing a prototype to a working demo."
argument-hint: "Idea + team (size/skills) + time (e.g. '48h, 4 people, AI note app')"
---

# Hackathon Planner

Win by **finishing something that demos**, not by planning everything — following
[`AGENTS.md`](../../../AGENTS.md). This is a ruthless-timebox plan; for a paced, portfolio project use
[`project-mentor`](../project-mentor/SKILL.md) instead.

## When to use
- The learner has an idea and a hard deadline (hours to days) and needs a plan to a working demo.
- Scoping any time-boxed prototype where a working slice beats a broad, half-built app.

## Procedure
1. **Confirm** the idea, team size/skills, exact time budget, and judging criteria — build for the rubric.
2. **Cut scope with MoSCoW:** Must (demo-critical) / Should / Could / **Won't** — write the *Won't* list
   explicitly. The Must set *is* the MVP, and it must be finishable in ~60% of the time.
3. **Define the demo first** (demo-driven dev): the exact 2–3 minute story you'll show, then build only
   what it needs — one **vertical slice** (UI → logic → data) over many half-features.
4. **Assign roles** to parallelize (build / integrate / demo + deck), with a shared interface agreed early.
5. **Build order & checkpoints:** spike the riskiest/unknown part first, then thread the slice, then
   polish. Set a **hard freeze** (~80% mark) — after it, only fix bugs and rehearse.
6. **Plan the demo:** a script, a backup (recording/screenshots) for when live fails, and who says what.

## Output shape
```
Project: <name> — <team>, <time>
MVP (Must): … | Won't: …
Demo story (2–3 min): …
Build order: 1) spike risk 2) vertical slice 3) polish | Freeze at: <time>
Roles: build / integrate / demo
```

## Tips
- Scope down until it feels boring — then it might finish. A tiny working thing beats a big broken one.
- Always record a **backup demo**; live demos fail at the worst possible moment.
- Draft the pitch with [`demo-script`](../demo-script/SKILL.md) and
  [`slide-outline`](../slide-outline/SKILL.md). End with the **Learning Footer** (`AGENTS.md`).
