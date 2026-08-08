---
name: literature-review
description: "Survey multiple primary sources on a topic into a structured mini literature review: define scope, gather papers/docs, group by theme or approach, compare methods and findings, and separate consensus from open questions — all cited and dated. Use for 'review the literature on X', 'survey approaches to Y', 'what does the research say about Z', 'compare these papers', or 'state of the art in ...'. Complements `research-brief`; never fabricates sources."
argument-hint: "Topic + scope (time window, depth)"
---

# Literature Review

Turn many primary sources into one **structured, honest** synthesis — following the source discipline
in [`AGENTS.md`](../../../AGENTS.md). Grounding beats coverage; never invent a citation.

## When to use

- The learner needs the landscape of a topic across several papers/sources, not a single answer.
- Broader and deeper than `research-brief` (news-oriented); pairs with `paper-summarizer` per source.

## Procedure

1. **Define scope & question.** Topic, time window, inclusion/exclusion criteria, and depth (how many sources).
2. **Search primary sources** (arXiv, official docs, peer-reviewed venues). Record each with title, authors,
   venue, date; keep screening transparent (PRISMA 2020: Page et al., *BMJ*, 2021).
3. **Extract per source** (reuse `paper-summarizer`): problem, approach, key result, limitations.
4. **Group by theme or approach**, not one-by-one — a synthesis matrix (source × dimension) reveals structure
   (Kitchenham & Charters, *SLR Guidelines in Software Engineering*, 2007).
5. **Compare & contrast.** Where do sources **agree** (consensus), disagree (and why — data, method, era),
   or stay silent (**open questions/gaps**)? Note the newest and most authoritative.
6. **Synthesize** the state of the art with balanced weight and every claim cited + dated.
7. End with the **Learning Footer** (`AGENTS.md`).

## Output shape

```
Scope: topic, window, criteria, N sources
Synthesis matrix: source | approach | key finding | limitation | date
Themes: Theme A — sources + what they collectively show …
Consensus vs. open questions: …
State of the art & gaps to explore: …
References: full, dated citations
Learning Footer
```

## Tips

- Group by idea, not by paper — a list of summaries is not a review.
- Weight by evidence quality and recency; flag preprints and surface conflicting results instead of averaging them.
- State your scope's limits (what you did *not* search) so the gaps are honest.
- Close with the **Learning Footer** (`AGENTS.md`) so the learner knows the next step.
