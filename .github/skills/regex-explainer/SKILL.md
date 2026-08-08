---
name: regex-explainer
description: "Explain a regular expression part by part, or build one from a matching goal — break the pattern into a table of tokens, show what it matches (and doesn't) on real examples, warn about catastrophic backtracking, and give a tested final pattern. Use for 'explain this regex', 'what does this pattern do', 'write a regex for…', 'is this regex safe', or learning regex."
argument-hint: "A regex to explain OR a matching goal + language/flavor"
---

# Regex Explainer

Make a regular expression *understandable*, not magic — decompose it token by token and prove it on
examples, per the teaching approach and Learning Footer in [`AGENTS.md`](../../../AGENTS.md).

## When to use

- The learner has a cryptic pattern to decode, or a matching goal and no pattern yet.
- Reinforcing regex fundamentals for **Coding Mentor** or a language role-agent.

## Mental model

- A regex is a tiny matching machine: **anchors** (`^ $ \b`), **classes** (`\d [a-z]`), **quantifiers**
  (`* + ? {n,m}`), **groups/alternation** (`(…|…)`). Flavors differ — confirm JS, PCRE, Python `re`,
  .NET, or POSIX first, since escapes, lookbehind, and atomic groups vary between them.

## Procedure

1. **Confirm flavor & goal**: which engine/flags, and what must match vs. must not match.
2. **Tokenize**: split the pattern into parts; put each in a table with its meaning.
3. **Trace matches**: run it against 2–3 positive and 2–3 negative examples; show the captures.
4. **Check for danger**: flag catastrophic backtracking (ReDoS) from nested/overlapping quantifiers
   (e.g. `(a+)+`); prefer specific classes, atomic groups, or possessive quantifiers where supported.
5. **Deliver tested regex**: give the final pattern with flags, and note anchoring/escaping choices.

## Output shape

```
Flavor: <JS/PCRE/…> | Goal: match … not …
| Token | Means |
| ----- | ----- |
| ^     | start |
Matches: "…" ✓  "…" ✗ (why)
Backtracking risk: <none | where + safer form>
Final: /…/flags
```

## Tips

- Verify by actually running the pattern on the examples — never claim a match you haven't checked.
- Prefer readable, anchored patterns over clever ones; comment complex regex (verbose/`x` mode).
- End with the **Learning Footer** (`AGENTS.md`) — the token to remember + a pattern to build yourself.
