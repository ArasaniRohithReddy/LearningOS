---
name: resume-tailor
description: "Tailor a resume to a specific role or job description — extract the JD's key requirements and keywords, map the learner's real experience to them, rewrite bullets as action-verb + quantified-impact (XYZ) statements, and flag honest gaps. Use for 'tailor my resume', 'match my resume to this JD', 'optimize my resume for X role', 'ATS keywords', or 'rewrite my bullet points'. Never invents experience."
argument-hint: "Target role/JD + the learner's current resume/experience"
---

# Resume Tailor

Tailor a resume to one target role **honestly** — coaching the learner to present their *real*
experience at its strongest, following [`AGENTS.md`](../../../AGENTS.md). Pairs with the **Career Mentor**.

## When to use

- The learner is applying to a specific role and wants their resume to match the JD.
- **No JD in hand** — tailor from the learner's profile: use the **target role** in
  [`learning-profile.md`](../learner-memory/SKILL.md) and a typical requirement set for that role.
- Beating ATS keyword filters, or turning weak duty-lists into impact bullets.

## Procedure

1. **Gather inputs:** the learner's current resume/experience, plus a target. Prefer a real **job
   description**; if none is given, derive the target from the learner's `learning-profile.md`
   (**objective** + target role) and tailor to a *typical* JD for that role — state that you're doing so,
   and offer to refine once they paste a real JD. Only the résumé is truly required.
2. **Establish the requirement set:** from the JD (or the typical role profile) list must-have skills,
   tools, responsibilities, and seniority signals; separate **must-have** from **nice-to-have**, with the
   exact **keywords** (for ATS).
3. **Map real experience** to each requirement — mark full match, partial, or **gap**. Only use
   what the learner actually did; ask probing questions to surface hidden wins.
4. **Rewrite bullets** in **XYZ** form: "Accomplished **X**, measured by **Y**, by doing **Z**."
   Lead with a strong action verb; prompt the learner for **real numbers** — never invent metrics.
5. **Weave in JD keywords** where truthful, and reorder so the strongest matches lead each section.
6. **Flag gaps** honestly: how to address them (learn, reframe, or de-emphasize) — never fabricate
   experience, titles, or dates to close a gap.

## Output shape

```
Fit snapshot: strong matches ✓ | partial ~ | gaps ✗
JD keywords (must-have / nice-to-have): …
Rewritten bullets:
  • Before → After (XYZ, quantified)  [metric to confirm: __]
Gaps & honest plan: <requirement → how to address>
Next tailoring pass: …
```

## Tips

- One tailored resume per role beats one generic resume for all — keep it to the JD's real needs.
- Metrics you can't verify are a liability; prompt the learner, leave a placeholder, never guess.
- For general strengthening (no specific JD), use [`resume-enhancer`](../resume-enhancer/SKILL.md) first.
- Finish with the **Learning Footer** (`AGENTS.md`).
