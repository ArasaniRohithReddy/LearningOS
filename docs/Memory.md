# LearningOS — Memory, Knowledge & RAG

Learning is cumulative, so LearningOS is designed to *remember the learner* and to *ground lessons in
retrieved sources*. This document describes the memory model and the RAG (retrieval-augmented
generation) approach.

## Three kinds of memory

| Layer | What it holds | How it's realized |
|---|---|---|
| **Learner profile** | Goals, current level, strengths, weak areas, completed topics, target certs/roles | A profile note the agent maintains (memory tool / a `learning-profile.md`) |
| **Progress & scheduling** | Spaced-repetition due-dates, quiz history, roadmap checkpoints | `flashcards` schedule + roadmap tracker + notes |
| **Knowledge graph** | Concepts and how they connect (prereqs, "see also") | Linked Markdown notes (concept → related concepts) |

### Learner profile

When an agent supports memory, it records durable facts about the learner ("prefers analogies",
"knows Python, learning Rust", "targeting DP-600 by March") and consults them next session so teaching
stays personalized and avoids re-explaining known material. Keep profiles small and factual; update or
remove entries that become stale.

### Spaced repetition

`flashcards` emits a review schedule (e.g. day 1 → 3 → 7 → 16 → 35, reset on a miss). Persist the
per-card state so reviews resume across sessions. This operationalizes the vision's "Active Recall"
and "Spaced Repetition" coaches.

### Knowledge graph

Represent a topic as notes that link to prerequisites and related ideas. Drona uses these links to
sequence lessons (teach prerequisites first) and to suggest the best next topic in the Learning
Footer. A simple convention: each note has a `## See also` section of relative links.

## RAG: retrieve, then teach

For anything factual or fast-moving, **retrieve before you teach**:

1. **Retrieve** from authoritative sources — official docs, RFCs, papers, repos — via `web`/`search`
   or, when configured, MCP servers (Microsoft Learn, Fetch, GitHub, PDF/Obsidian/Markdown). See
   [MCP.md](./MCP.md).
2. **Ground** the explanation in what was retrieved, and **cite** it with a date and source type
   (official / blog / paper / community) — see [`research-brief`](../.github/skills/research-brief/SKILL.md).
3. **Never fabricate.** If retrieval fails, say so rather than guessing (constitution rule in
   [`AGENTS.md`](../AGENTS.md)).

## What's implemented today

- **RAG**: source-disciplined retrieval via [`research-brief`](../.github/skills/research-brief/SKILL.md)
  + [`daily-digest`](../.github/skills/daily-digest/SKILL.md) and the Research & News Analyst.
- **Onboarding (first run)**: the [`learner-onboarding`](../.github/skills/learner-onboarding/SKILL.md)
  skill is the **front door for a new learner** — it welcomes them, interviews to build the
  `learning-profile.md` (role, goals, level, style, time, stack, strengths/gaps), offers a
  [`skill-assessment`](../.github/skills/skill-assessment/SKILL.md) placement diagnostic, drafts an initial
  plan, and persists it. Drona runs it automatically when no profile exists (step 1).
- **Learner memory (first-class)**: the [`learner-memory`](../.github/skills/learner-memory/SKILL.md)
  skill is the ongoing memory — at the **start** of a session it recalls the learner (goals, level, in-flight
  topics, due reviews); at the **end** it writes back progress and the next step. It manages a persistent
  [`learning-profile.template.md`](../templates/learning-profile.template.md) profile and is wired into
  **Drona's operating procedure** (step 1 "Recall the learner" + step 5 "Close the loop & remember").
- **Spaced repetition**: the [`spaced-repetition-scheduler`](../.github/skills/spaced-repetition-scheduler/SKILL.md)
  skill computes due-dates and records results; [`flashcards`](../.github/skills/flashcards/SKILL.md)
  emits the initial schedule.
- **Progress tracking**: the [`progress-tracker`](../.github/skills/progress-tracker/SKILL.md) skill records
  streaks, quiz scores, and completed milestones over the profile.
- **Knowledge graph**: the [`knowledge-graph`](../.github/skills/knowledge-graph/SKILL.md) skill builds
  and queries the concept graph as linked notes + a Mermaid diagram.

## Cross-session persistence (how memory survives)

Learning memory persists **across every session** through layered mechanisms, cheapest first:

1. **File on disk (default, zero-setup):** the profile lives at `learning-profile.md` in the workspace.
   Because it's a plain file, any new session reads the same profile — nothing to configure.
2. **Committed to the repo (roams with the project):** commit `learning-profile.md` so the same journey
   follows the learner across machines and clones. Great for a personal learning repo.
3. **Client-native Copilot Memory:** durable, per-user/per-repo facts the assistant recalls automatically
   in future sessions (goals, preferences, conventions) — complements the file for quick, ambient recall.
4. **MCP memory server (cross-workspace, optional):** for recall that spans *unrelated* projects, point a
   memory MCP server (e.g. a memory/knowledge-graph server) at the profile — see [MCP.md](./MCP.md).

Drona always **recalls first** (`learner-memory` → read) and **remembers last** (`learner-memory` → write),
so no session starts from zero and no learning is lost between sessions.

## Planned next ([Roadmap.md](./Roadmap.md))

Live MCP wiring (Microsoft Learn, GitHub, Fetch, RSS/arXiv) for grounded, current lessons, and a
learning-analytics harness (progress, gaps, streaks) over the persisted profile and schedule.

## Privacy

The learner profile is the learner's data. Keep it local, store no secrets in it, and let the learner
inspect, edit, or delete it at any time. See [Security.md](./Security.md).
