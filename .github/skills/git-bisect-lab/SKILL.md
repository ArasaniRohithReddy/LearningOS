---
name: git-bisect-lab
description: "Hands-on Git lab on bisect: binary-searching commit history to find the exact commit that introduced a regression, marking good/bad revisions, skipping untestable commits, and automating the hunt with git bisect run. Use for 'bisect lab', 'find the bad commit', 'when did this break', 'binary search a regression', 'automate git bisect', or a guided hands-on debugging exercise. Teaches the model, not just commands."
argument-hint: "The bug to find"
---

# Git Bisect Lab

A guided, hands-on lab on `git bisect` — a **binary search** over history to pinpoint the commit that broke
something — following the teaching principles and Learning Footer in [`AGENTS.md`](../../../AGENTS.md). Pairs
with [`git-coach`](../git-coach/SKILL.md) and [`worked-example`](../worked-example/SKILL.md); design flow in [`git-workflow-designer`](../git-workflow-designer/SKILL.md).

## When to use

- A regression appeared and the learner needs the *exact* offending commit, not a guess across hundreds.
- Teaching disciplined debugging: a reproducible test plus O(log n) commit checkouts finds the cause fast.

## Procedure

1. **Concept.** Bisect does binary search between a known **good** and **bad** commit, halving the suspect
   range each step — ~log₂(N) tests for N commits (`git-bisect(1)`, git-scm.com/docs, 2024).
2. **Reproduce first.** Write a one-line check that *fails* on the bug (exit non-zero) — bisect needs a verdict.
3. **Start.** `git bisect start`, then `git bisect bad` (current) and `git bisect good <old-sha/tag>`; Git checks
   out the midpoint. Or in one line: `git bisect start <bad> <good>`.
4. **Mark each step.** Run your check, then `git bisect good` or `git bisect bad`; use `git bisect skip` for a
   commit that won't build. Git converges to "<sha> is the first bad commit".
5. **Automate.** `git bisect run ./test.sh` marks each step from the script's exit code (0=good, 1–124=bad, 125=skip).
6. **Finish.** `git bisect reset` returns to your original branch; `git bisect log` / `replay` re-runs a session.
7. **Pitfalls & Learning Footer.** Name the traps, then close with the **Learning Footer** (`AGENTS.md`).

## Output shape

```
Reproduce: test.sh exits non-zero on the bug
Range: git bisect start <bad> <good>   (Git checks out the midpoint)
Loop: run test → git bisect good | bad | skip   → "first bad commit: <sha>"
Automate: git bisect run ./test.sh    Cleanup: git bisect reset
```

## Tips

- The `good`/`bad` labels are literal — an old working commit is *good*, the broken tip is *bad*; don't invert them.
- `git bisect run` exit codes: **0** good, **1–124/126–127** bad, **125** skip (untestable) — reserve 125 deliberately.
- Bisect only checks out commits; it rewrites nothing, so it's safe — but always `git bisect reset` when done.
- End with the **Learning Footer** (`AGENTS.md`) — the model to keep + a bisect drill to practice.
