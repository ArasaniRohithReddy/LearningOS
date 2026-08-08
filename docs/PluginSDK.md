# LearningOS — Plugin & Distribution (the "SDK")

The vision called for a **Plugin SDK** with discovery, enable/disable, versioning, and marketplace
distribution. In the GitHub Copilot world, that SDK already exists — it's the **agent + skill file
format**. LearningOS is therefore a "plugin" you distribute simply by sharing folders.

## What a LearningOS "plugin" is

A plugin = a self-contained bundle of Copilot customizations:

```
<plugin>/
├── AGENTS.md                 # shared behavior (optional if only adding to an existing repo)
├── .github/agents/*.agent.md # personas
├── .github/skills/*/SKILL.md # workflows (+ scripts/, references/, assets/)
└── .github/roles/*.role.yml  # config-driven role definitions
```

This maps 1:1 to the capabilities the blueprint wanted a plugin to expose:

| Blueprint plugin field | Where it lives in a LearningOS plugin |
|---|---|
| Name / Description | agent/skill `name` + `description` frontmatter |
| Version / Author | repo (git tag) + `CONTRIBUTING.md` / commit history |
| Capabilities | the skills and agents included |
| Required Tools | agent `tools:` / skill body |
| MCP Requirements | role `mcp:` + [MCP.md](./MCP.md) |
| Configuration | `.role.yml` files + `.vscode/settings.json` |
| Permissions | tool restrictions in agent frontmatter (`tools: []`, read-only, etc.) |
| Commands | skills = `/` slash commands |
| Prompt Templates | agents / skills / (optional) `*.prompt.md` |
| Tests | [Testing.md](./Testing.md) |
| Documentation | this `docs/` folder |

## Discovery & enable/disable

- **Discovery** is automatic: VS Code and the CLI pick up `.github/agents/`, `.github/skills/`, and
  (for skills) any location listed in `chat.agentSkillsLocations` (already set in
  [`.vscode/settings.json`](../.vscode/settings.json)).
- **Enable/disable** a skill or agent by adding/removing its file, or toggling `user-invocable` /
  `disable-model-invocation` in frontmatter.

## Versioning

Treat the repo as the package: tag releases (`v1.0.0`), keep a changelog, and document breaking
changes to the `.role.yml` schema in [Roadmap.md](./Roadmap.md). Individual skills can note a version
in their body if they evolve independently.

## Distribution

Three supported paths, smallest to largest:

1. **Copy folders** into a target repo → instant LearningOS in that project.
2. **Git submodule / template repo** → clone-and-go for teams.
3. **User-profile install** → put agents/skills under your VS Code user profile so they roam across
   all workspaces (see [README](../README.md) → "Use it in another project").

A public marketplace is out of scope here, but nothing prevents publishing this repo as a template
others fork — that *is* the marketplace model for prompt/skill packs today.
