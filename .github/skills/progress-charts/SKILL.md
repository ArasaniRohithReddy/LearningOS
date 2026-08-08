---
name: progress-charts
description: "Visualize a learner's progress as real charts using the Flint-Chart MCP server — render an activity/streak trend, topics completed by domain, mastery/coverage, and a spaced-repetition review burn-down from `learning-profile.md` and the progress log. Charts render locally (SVG/PNG); data never leaves the machine. Use for 'show my progress', 'progress chart/graph', 'visualize my learning', 'mastery by topic', or 'am I on track'. Falls back to a Mermaid/table view if no chart MCP is available."
argument-hint: "What to visualize (e.g. 'streak', 'mastery by domain', 'all'), optional"
---

# Progress Charts

Turn the learner's tracked progress into clear visuals, following [`AGENTS.md`](../../../AGENTS.md) — so
momentum, coverage, and gaps are seen at a glance. Reads the same data as
[`progress-tracker`](../progress-tracker/SKILL.md) / [`learner-memory`](../learner-memory/SKILL.md) and
renders it with the **Flint-Chart MCP** (`flint-chart`), which ships with LearningOS and registers
automatically on install (see [MCP.md](../../../docs/MCP.md)). Charts render on-device; data stays local.

## When to use
- "Show my progress", "visualize my learning", "mastery by topic", "am I on track".
- Inside a `session-resume` / review to make the recap visual and motivating.

## Procedure
1. **Gather data** from `learning-profile.md` + the progress log: sessions/streak over time, topics
   **completed** (by domain), self-rated or quiz **mastery**, and the **review queue** (due vs. done).
2. **Pick the chart(s)** for the question:
   - **Activity/streak** → line or calendar-heatmap over dates.
   - **Topics completed by domain** → bar chart.
   - **Mastery / coverage** → radar (per domain) or grouped bar (target vs. current).
   - **Review burn-down** → line (due items remaining over time).
3. **Render via the Flint-Chart MCP:** write a compact **Flint spec**, `validate_chart`, then `render_chart`
   (SVG/PNG) or `create_chart_view` for an interactive view. Keep encodings honest (zero-baseline bars,
   labeled axes, real dates).
4. **If the MCP isn't available**, degrade gracefully to a **Mermaid** chart or a Markdown table so the
   learner still sees the trend.
5. **Read the chart for them:** 2–3 sentences — what's improving, what's stalling, the next lever.
6. Offer to save the image next to the profile and to re-render after the next session.

## Output shape
```
Progress — <learner> (<date>)
[chart: streak/activity]      🔥 streak <n>, <sessions> in <period>
[chart: completed by domain]  top: <domain> (<n>) · thin: <domain> (<n>)
[chart: mastery radar]        strong: <…>  gaps: <…>
[chart: review burn-down]     due today <n> · overdue <n>
Read-out: <what's improving / stalling / next lever>
```

## Tips
- Charts illustrate the profile — never invent data points; if a metric is missing, show what exists.
- Honest visuals only: labeled axes, zero-baseline bars, no cherry-picked ranges.
- Pairs with `progress-tracker` (data), `session-resume` (welcome-back), `spaced-repetition-scheduler`
  (due items), `learner-memory` (source of truth). End with the **Learning Footer** (`AGENTS.md`).
