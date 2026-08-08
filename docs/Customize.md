# Customizing LearningOS

Everything in LearningOS is **plain Markdown + YAML** — no build step to learn. You can add, edit, or
disable any skill or agent, then re-index. Two helper scripts do the boilerplate, and one validates the
result. Follow the house styles in [Skills.md](./Skills.md) and [Agents.md](./Agents.md).

```powershell
# after any change:
node scripts/build-registry.mjs   # re-scan → marketplace/registry.json + CATALOG.md
node scripts/validate.mjs         # self-check (counts, names, links, footer, Drona wiring)  → exit 1 on error
```

## Add a skill
```powershell
node scripts/new-skill.mjs my-new-skill "Do X as a lesson — ... Use for '...', '...'."
# → creates .github/skills/my-new-skill/SKILL.md  (fill in the placeholders)
node scripts/build-registry.mjs && node scripts/validate.mjs
```
Rules that `validate.mjs` enforces: folder name **==** the `name:` field; frontmatter order `name,
description, argument-hint`; a `[\`AGENTS.md\`](../../../AGENTS.md)` link (three `../`); a `## Output shape`
section; and a Learning-Footer note in `## Tips`.

## Add an agent
- **Role-agent (recommended):** use the [`role-composer`](../.github/skills/role-composer/SKILL.md) skill —
  describe the role (or write a `.github/roles/<role>.role.yml`) and it generates the agent **and** wires
  Drona for you.
- **By hand:**
  ```powershell
  node scripts/new-agent.mjs "My Specialist" "My Specialist — teaches ... Ends with the Learning Footer."
  # → creates .github/agents/my-specialist.agent.md AND adds it to Drona's allow-list (with a backup)
  node scripts/build-registry.mjs && node scripts/validate.mjs
  ```
  Then optionally add a routing row in [`drona.agent.md`](../.github/agents/drona.agent.md) so Drona
  delegates to it explicitly.

## Edit a skill or agent
Just edit the `SKILL.md` / `*.agent.md`. If you changed the `name` or `description`, re-run
`build-registry.mjs` so the marketplace catalog matches. Run `validate.mjs` to confirm you kept the style.

## Disable / remove
- **Skill:** move its folder out of `.github/skills/` (e.g. into a top-level `disabled/` folder) or delete
  it, then re-run `build-registry.mjs`.
- **Agent:** move/delete its `.github/agents/<slug>.agent.md` **and** remove the display name from Drona's
  `agents:` allow-list in `drona.agent.md`, then re-run `build-registry.mjs`. `validate.mjs` will fail if
  the allow-list still references a missing agent — a useful safety net.

## Per-user overrides (don't fork the repo)
Copilot merges customizations from multiple locations. To tweak behavior for **just you** without editing
the shared repo, add your own agents/skills at the user level (e.g. `~/.copilot/…` for the CLI, or your
VS Code user profile). Workspace/repo files take precedence for project-specific behavior. See
[Install.md](./Install.md).

## Keep it honest
- No stubs — every skill/agent should have real, specific content (`validate.mjs` and reviewers check this).
- Cite sources with dates; never fabricate APIs, docs, or certifications ([AGENTS.md](../AGENTS.md) §2).
- Re-run `build-registry.mjs` + `validate.mjs` before you commit; wire this into CI to prevent drift.
