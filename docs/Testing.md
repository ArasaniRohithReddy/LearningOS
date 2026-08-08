# LearningOS — Testing & Evaluation

Agents and skills are prompts, but they still deserve testing. This document describes lightweight
checks that keep the library correct and consistent.

## 1. Structural validation (fast, do always)

For every new/edited agent, skill, or role file:

- **Frontmatter parses**: valid YAML between `---` markers; values with colons are quoted.
- **Naming**: skill folder name equals its `name`; agent `name` is present and unique.
- **Discovery surface**: `description` is present, meaningful, and keyword-rich ("Use when…").
- **Links resolve**: relative links (`../AGENTS.md`, `./Roles.md`, `../.github/...`) point to real files.
- **Tools are minimal**: no `edit`/`execute` on read-only agents.

In VS Code, the editor's Problems panel and the **Chat Customizations Evaluations** extension surface
most frontmatter issues automatically.

## 2. Behavioral evaluation (per agent/skill)

Keep a few **golden prompts** per agent/skill and confirm the response:

| Check | Passing looks like |
|---|---|
| Routes correctly | Drona picks the right skill/specialist for the prompt. |
| Teaches, not just answers | Explanation + why + example, not a bare answer. |
| Cites sources | Factual claims carry a dated, authoritative source. |
| Ends with the Learning Footer | Recap · Pitfalls · Next topic · Try it · Level · Time. |
| Stays in scope | Read-only agents don't edit; safe-execution respected. |
| No fabrication | Unverifiable items are flagged, not invented. |

Example golden prompts:

- Drona: *"Teach me the CAP theorem, then quiz me"* → concept lesson + offer of a quiz + footer.
- `research-brief`: *"What changed in MCP recently, official only"* → cited, dated TL;DR.
- Interview Coach: *"System design mock for a URL shortener, score me"* → one-question-at-a-time,
  rubric-scored, model answer after attempt.
- `role-composer`: run it on a `.role.yml` → a valid `.agent.md` appears and Drona can delegate to it.

## 3. Regression discipline

When you change the constitution ([`AGENTS.md`](../AGENTS.md)) or a shared skill, re-run the golden
prompts for anything that depends on it. Record notable failures and fixes so they don't recur.

## 4. Coding-content tests

When an agent teaches code, the code itself should be testable: include a **testing note** and, for
non-trivial snippets, a minimal test. See [Standards.md](./Standards.md) and
[`code-review-coach`](../.github/skills/code-review-coach/SKILL.md).
