---
name: analogy-generator
description: "Generate several strong analogies and metaphors for a hard concept, each mapped element-by-element to the real thing, with a note on where the analogy breaks down. Use for 'give me an analogy', 'explain with a metaphor', 'it's like…?', 'relate X to something familiar', or making an abstract idea concrete. Maps relationships, not just surface resemblance."
argument-hint: "Concept + the learner's familiar domain"
---

# Analogy Generator

Make a hard concept click by mapping it onto something the learner already understands — and naming
where the mapping leaks — following the teaching principles in [`AGENTS.md`](../../../AGENTS.md).

## When to use
- The learner asks "give me an analogy", "explain it like…", or relates better to metaphors than defs.
- An abstract idea needs a familiar hook before the formal treatment.

## Procedure
1. **Pin the target.** List the key elements and *relationships* of the concept any analogy must
   capture — relationships matter more than surface features.
2. **Choose source domains.** Prefer the learner's stated familiar domain; offer **2–3 varied**
   analogies so no single one over-anchors.
3. **Map element by element.** For each analogy, tabulate concept element ↔ analogy element.
4. **Name the leak.** Every analogy breaks somewhere — state the disanalogy so it won't seed a
   misconception (hand off to [`misconception-buster`](../misconception-buster/SKILL.md)).
5. **Recommend.** Pick the best-fit analogy for this learner and give a one-line "so remember…".

## Output shape
```
Concept: … | must capture: <elements + relations>
Analogy A — "<X> is like <Y>"
  | Concept element | Maps to |
  | … | … |
  Breaks down when: …
Analogy B — "…"   (map + leak)
Best for you: <A/B> because … → so remember: …
```

## Tips
- Map relationships, not just looks — a good analogy transfers structure the learner can reuse.
- Use the learner's world (sport, cooking, money); familiarity is the whole point.
- For the full treatment pair with [`concept-explainer`](../concept-explainer/SKILL.md). End with the
  **Learning Footer** (`AGENTS.md`).
