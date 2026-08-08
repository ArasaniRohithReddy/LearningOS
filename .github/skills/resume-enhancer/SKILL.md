---
name: resume-enhancer
description: "Strengthen a résumé/CV even without a target job description — turn duty-lists into quantified action-verb + impact (XYZ) bullets, fix scope/level signaling, tighten the summary, standardize structure and dates, add an ATS-friendly skills section, and remove filler. Works from the learner's `learning-profile.md` when no résumé exists yet. Use for 'improve/enhance my resume', 'make my resume stronger', 'ATS-friendly resume', 'quantify my bullets', or 'build a resume from my profile'. Never invents experience."
argument-hint: "The résumé to enhance (or 'from my profile'); optional target role"
---

# Résumé Enhancer

Make a résumé measurably stronger and honest, following [`AGENTS.md`](../../../AGENTS.md) — coaching the
learner so they can self-edit next time. Complements [`resume-tailor`](../resume-tailor/SKILL.md) (which
matches one specific JD); this pass strengthens the résumé **generally**, with or without a target role.
Pairs with the **Career Mentor**.

## When to use
- "Enhance / improve / strengthen my résumé", "make it ATS-friendly", "quantify my bullets".
- No résumé yet — **build one from the [`learning-profile.md`](../learner-memory/SKILL.md)** (role, goal, projects, skills).
- No specific JD in hand (if there is one, use `resume-tailor` instead or after this pass).

## Procedure
1. **Gather source:** the current résumé, or — if none — pull experience, projects, and skills from the
   learner's `learning-profile.md`; ask a few probing questions to surface real, quantifiable wins.
2. **Diagnose** against what recruiters/ATS screen for: impact vs. duties, missing metrics, weak verbs,
   inconsistent tense/dates, scope/level mismatch, bloated summary, keyword coverage, length/format.
3. **Rewrite bullets** in **XYZ** form ("Accomplished **X**, measured by **Y**, by doing **Z**"): strong
   lead verb, real numbers (prompt for them — never fabricate), one idea each.
4. **Sharpen the top:** a 2–3 line summary aligned to the learner's **objective** ("preparing for"), and
   an ATS-readable **skills** section grouped by category.
5. **Standardize:** consistent dates/tense/formatting, reverse-chronological, cut filler and clichés.
6. **Report** before→after with the reasoning, and flag anything the learner must confirm (metrics).

## Output shape
```
Résumé health: impact ✓/✗ · metrics ✓/✗ · ATS keywords ✓/✗ · consistency ✓/✗ · length <n> pages
Summary (rewritten): …
Bullets:  • Before → After (XYZ, quantified)   [confirm metric: __]
Skills (ATS, grouped): …
Fixes applied / still needed: …
```

## Tips
- Impact over responsibilities; a number beats an adjective. Never invent metrics, titles, or dates.
- Without a JD, align to the learner's **objective** from their profile; hand to `resume-tailor` once a JD appears.
- Pairs with `resume-tailor`, `cover-letter`, `linkedin-optimizer`, `star-story-builder`. End with the **Learning Footer** (`AGENTS.md`).
