---
name: portfolio-reviewer
description: "Review a portfolio or GitHub profile as a lesson — assess the signal (pinned repos, project relevance, READMEs, commit history, contributions, profile bio) against a target role and give prioritized, concrete improvements. Use for 'review my portfolio', 'review my GitHub', 'GitHub profile feedback', 'is my portfolio good enough for X', or 'what should I fix on my profile'. Pairs with github-repo-finder."
argument-hint: "Portfolio/GitHub URL or description + target role"
---

# Portfolio Reviewer

Review a portfolio or GitHub profile the way a hiring manager scans it — then teach the fixes,
following [`AGENTS.md`](../../../AGENTS.md). Pairs with the **Career Mentor**.

## When to use

- The learner wants feedback on their portfolio site or GitHub profile for a target role.
- Deciding which projects to pin, what to build next, or how to strengthen READMEs.

## Procedure

1. **Confirm the target role** and get the URL or a description. If given a URL, read it (`web`);
   otherwise have the learner describe their pinned repos, projects, and profile.
2. **Assess the signal** against the role: pinned/relevant projects, README quality (problem, demo,
   setup, screenshots), commit history, contribution graph, and the profile README/bio.
3. **Judge the 30-second scan:** what a recruiter concludes at a glance — is the best work on top?
4. **Prioritize improvements** on impact × effort (quick wins first, then bigger builds).
5. **Give concrete fixes:** a README outline to copy, repos to pin or hide, a live demo or screenshot
   to add; use [`github-repo-finder`](../github-repo-finder/SKILL.md) to surface strong exemplars to model.
6. **Be honest:** don't imply skills the work doesn't show; if a gap is real, suggest a project to
   fill it (hand off to [`project-mentor`](../project-mentor/SKILL.md)).

## Output shape

```
Target role: … | First impression (30s scan): …
Signal scorecard: projects ▢ READMEs ▢ activity ▢ profile ▢
Top fixes (priority): 1) <fix — impact/effort> 2) … 3) …
Pin / hide: … | Build next: …
```

## Tips

- Recruiters skim in seconds — put the strongest, role-relevant work where they look first.
- A few polished projects beat many half-finished ones; depth and a clear README win.
- Finish with the **Learning Footer** (`AGENTS.md`).
