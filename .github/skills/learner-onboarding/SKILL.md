---
name: learner-onboarding
description: "First-run experience for a new learner — welcome them, interview to build their `learning-profile.md` (role/status, goals, target cert/role, level, learning style, time, stack, strengths/gaps), optionally run a placement diagnostic, draft an initial study plan, and persist it so every future session is personalized. Use for 'I'm new', 'get started', 'set me up', 'onboard me', 'build my profile', or 'where do I begin'. The front door to LearningOS."
argument-hint: "Optional: your goal or role to start (e.g. 'aiming for DP-700'), or just 'get started'"
---

# Learner Onboarding

Give a brand-new learner a proper start following [`AGENTS.md`](../../../AGENTS.md): understand who they
are and where they want to go, then set up the persistent profile that makes every later session
personalized. This is the **front door** — it feeds [`learner-memory`](../learner-memory/SKILL.md) and
fills the [`learning-profile.template.md`](../../../templates/learning-profile.template.md). See
[Memory.md](../../../docs/Memory.md).

## When to use
- A **first-time** learner with no `learning-profile.md` yet ("I'm new", "get started", "set me up").
- Someone wants to (re)define their goals or reset their plan.
- Drona's step 1 finds no profile and needs to create one.

## Procedure
1. **Welcome & orient (brief).** A line or two on how LearningOS teaches — a mentor that explains the
   *why*, not an answer-machine, and that **remembers you across sessions** — then start; don't lecture.
2. **Ask what they're preparing for (the objective).** This routes everything: 🎯 first job/breaking in ·
   🔄 switching jobs · 📈 upskilling in the current job · ⬆️ promotion · 🔀 career change · 📜 certification ·
   🎤 interview prep · 🎓 academic exam · 🧠 personal growth. Record it as the profile's **objective**.
3. **Interview** to fill the rest of the profile from the
   [template](../../../templates/learning-profile.template.md): role/status, **primary goal**, target
   role/cert + date, current **level**, **learning style**, **time/day**, **stack**, strengths & weak areas.
   Ask a few at a time, infer sensibly, keep it short and **secret-free**.
4. **Place their level (optional but offered).** Run [`skill-assessment`](../skill-assessment/SKILL.md) —
   a short adaptive diagnostic — for an objective Beginner/Intermediate/Advanced + strengths/gaps map.
5. **Draft the first plan for that objective.** Use [`learning-roadmap`](../learning-roadmap/SKILL.md) for
   an initial dated plan; for a **job/interview** objective, also line up résumé/portfolio/interview prep
   (Career Mentor, `resume-enhancer`, `resume-tailor`), ending in the single best **first step**.
6. **Persist.** Write the profile via [`learner-memory`](../learner-memory/SKILL.md) (record *Objective*,
   *Onboarded on*, *Next step*) and schedule the first review so nothing is missed next session.
7. Confirm the profile, the first step, and how to resume later ("just say **resume**").

## Output shape
```
Welcome to LearningOS, <name>!
Profile created → learning-profile.md
Goal: <primary goal / cert>  ·  Level: <placement>  ·  Time: <…/day>  ·  Stack: <…>
Focus areas: <weak areas>   Strengths (won't re-teach): <…>
Your plan: <phase-1 outcome> — first step → <one concrete action>
Resume anytime by saying "resume".  First review: <date>.
```

## Tips
- **It's a conversation, not a form** — adapt to what the learner volunteers; never block on optional fields.
- The profile is the **learner's data** — local, editable/deletable, **no secrets**
  ([Security.md](../../../docs/Security.md)); it persists across sessions (see `learner-memory`).
- Hand back to Drona with the goal + level so the very first lesson is already personalized.
- Pairs with `skill-assessment`, `learning-roadmap`, `learner-memory`. End with the **Learning Footer** (`AGENTS.md`).
