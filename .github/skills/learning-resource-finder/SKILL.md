---
name: learning-resource-finder
description: "Recommend the best FREE learning resources for a topic — YouTube channels/playlists, MOOCs (freeCodeCamp, CS50, MIT OpenCourseWare, fast.ai, Full Stack Open), interactive platforms (exercism, Kaggle Learn, roadmap.sh, The Odin Project), official docs, and free books — matched to the learner's level and preferred format, then sequenced into a short path. Use for 'free resources to learn X', 'best YouTube channel/playlist for X', 'free course for X', 'where can I learn X for free', 'MOOC for X', or 'give me a free learning path'. Link-out only; suggests, never pirates."
argument-hint: "Topic + level + format preference (video / interactive / course / reading)"
---

# Free Learning-Resource Finder

Point the learner at the **best free** material for what they want to learn — and sequence it — following
[`AGENTS.md`](../../../AGENTS.md). Recommendations come from the curated, verified catalog
[`data/learning-resources.json`](../../../data/learning-resources.json) (YouTube channels/playlists, MOOCs,
interactive sites, official docs, free books). Pairs with [reading-list-curator](../reading-list-curator/SKILL.md),
[learning-roadmap](../learning-roadmap/SKILL.md), and the **Research and News Analyst**.

## When to use

- The learner asks for free ways to learn a topic, or the best YouTube channel / MOOC / interactive site for it.
- Turning a roadmap or study plan into concrete, no-cost resources they can start today.

## Procedure

1. **Clarify** the topic, the learner's **level** (beginner → advanced), and their **format preference**
   (video, interactive/hands-on, structured course, or reading) plus any time budget.
2. **Draw from the curated catalog** [`data/learning-resources.json`](../../../data/learning-resources.json)
   — filter by `domain`, `level`, and `type`. Prefer high-signal, genuinely free (or free-audit) sources;
   mark audit-only clearly. If the learner needs something not in the catalog, use the fetch tool /
   `research-analyst` to find an **official** source, and **verify the link resolves** — never invent a
   channel or course URL.
3. **Match formats to how people actually learn** a topic: intuition/visual → video (e.g., 3Blue1Brown,
   StatQuest); syntax/projects → interactive (exercism, Full Stack Open, The Odin Project); breadth →
   a MOOC (CS50, freeCodeCamp, MIT OCW); reference → official docs. Give **2–4 options per format**, not a dump.
4. **Sequence them into a path**: one *start-here* resource → one *go-deeper* → one *practice/apply* →
   *reference* to keep open. Note roughly how long each takes.
5. **Add active-learning glue**: pair a video with a hands-on rep and a spaced review — hand off to
   [quiz-generator](../quiz-generator/SKILL.md), [flashcards](../flashcards/SKILL.md), or a
   [competitive-programming-drill](../competitive-programming-drill/SKILL.md) so watching becomes doing.
6. **Optionally summarize a resource**: with the fetch tool, pull an official course/syllabus/docs page and
   give the learner a dated TL;DR of what it covers — but link out for the full content; never reproduce
   transcripts, paywalled, or copyrighted material.

## Match format to goal

| Learning goal | Best format | Catalog `type` |
|---|---|---|
| Intuition / mental model | Video | `youtube-channel`, `youtube-playlist` |
| Syntax & muscle memory | Interactive / hands-on | `interactive`, `practice` |
| Breadth / structured path | Course | `mooc` |
| Depth & correctness | Reading / reference | `docs`, `book` |

## Output shape

```
Topic · level · preferred format
Start here → <resource> (<type>, free) — why · ~<time>
Go deeper → <resource> — why
Practice   → <interactive/practice resource> — why
Reference  → <official docs/book>
By format:
  🎥 Video: <2–4 channels/playlists>   🧩 Interactive: <…>   🎓 Course/MOOC: <…>   📖 Reading/docs: <…>
Make it stick: <one exercise + a spaced-review nudge>
Links (all free/free-audit): <name → URL> …
```

## Tips

- Curate, don't dump — a short, sequenced set beats a wall of links; say **why** each earns its place.
- Prefer official/primary and well-known free sources; flag **free-audit** vs fully free honestly.
- Verify every link resolves before recommending; never fabricate a YouTube handle or course URL.
- Respect platforms: **link out**, summarize official pages via fetch, and never reproduce or pirate
  paywalled/copyrighted content (videos, transcripts, books).
- Match the format to the topic and the learner — video for intuition, interactive for skill, docs for depth.
- End with the **Learning Footer** (`AGENTS.md`).
