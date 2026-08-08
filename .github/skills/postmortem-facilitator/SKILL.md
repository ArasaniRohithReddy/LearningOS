---
name: postmortem-facilitator
description: "Facilitate a blameless postmortem meeting as a lesson — prep and invites, walk the timeline together, run a group 5 Whys root-cause discussion, and leave with owned, tracked actions. Distinct from writing the doc. Use for 'run a postmortem meeting', 'facilitate an incident review', 'lead a blameless RCA', 'postmortem agenda', or learning facilitation. Grounded in the Google SRE books."
argument-hint: "The incident"
---

# Postmortem Facilitator

Run the postmortem *meeting* so a team learns out loud and leaves with commitments — blameless and
systems-focused — per [`AGENTS.md`](../../../AGENTS.md). Writes up via [incident-postmortem](../incident-postmortem/SKILL.md).

## When to use

- The learner must facilitate the review meeting after an incident, not just draft the doc.
- Practicing blameless facilitation for an **SRE**/DevOps or eng-lead role-agent.

## Agenda (timeboxed)

| Segment | Focus |
| --- | --- |
| Ground rules | state blameless intent (~2 min) |
| Timeline walk | agree the facts together |
| Root cause | group 5 Whys + contributing factors |
| Actions | owners, due dates, tracking |

## Procedure

1. **Prep:** schedule within days while memory is fresh; circulate the draft doc and timeline
   beforehand (→ [incident-postmortem](../incident-postmortem/SKILL.md)); invite the responders, not an audience.
2. **Set the tone:** open by stating blameless ground rules — assume everyone acted reasonably on
   what they knew (Retrospective Prime Directive; Google SRE book, *Postmortem Culture*, 2016).
3. **Walk the timeline together:** fill gaps and correct facts as a group; guard against **hindsight
   bias** — what was actually known at each moment?
4. **Facilitate root cause:** run the **5 Whys** as a discussion, separate trigger from underlying
   cause, and capture contributing factors (technical, process, monitoring).
5. **Drive owned actions:** every action leaves with an **owner + due date + tracking issue**; wire
   preventive fixes into runbooks and alerts (→ [oncall-runbook-coach](../oncall-runbook-coach/SKILL.md)).
6. **Close & share:** publish notes broadly — org-wide learning is the point, not a filed document.

## Output shape

```
Incident: … | Meeting date: … | Facilitator + attendees: …
Ground rules: blameless, systems-focused (stated aloud)
Timeline: agreed together, no hindsight blame
Root cause: group 5 Whys → underlying cause + factors
Actions: [owner] <fix> — due <date> — tracked issue
```

## Tips

- Facilitate, don't interrogate: your job is a safe room, not a verdict on a person.
- No action without a named owner and a date, or nothing changes before the next incident.
- End with the **Learning Footer** (`AGENTS.md`) — one facilitation move to try + one action to assign.
