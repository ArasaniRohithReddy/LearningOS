# LearningOS — Enterprise Plugin Marketplace

The vision calls for an **Enterprise Plugin Marketplace**: a place to browse, pick, and install
LearningOS capabilities as **packs**, and for organizations, educators, and the community to publish
their own. This document defines that model. It builds directly on the plugin format in
[PluginSDK.md](./PluginSDK.md) — no new runtime, just a catalog over the primitives LearningOS already
uses (agents, skills, roles).

> **Key idea:** in the GitHub Copilot world, "installing a plugin" = *having its files in your
> workspace or user profile*. The marketplace is therefore a **catalog + packaging convention**, not a
> server. It works offline, in VS Code, and in the CLI.

## What's in the marketplace

A generated, machine-readable index lives at [`marketplace/registry.json`](../marketplace/registry.json),
with a human-readable view at [`marketplace/CATALOG.md`](../marketplace/CATALOG.md). Both are produced by
[`scripts/build-registry.mjs`](../scripts/build-registry.mjs), which scans:

- `.github/agents/*.agent.md` — every persona (Drona, the mentors, and all role-agents).
- `.github/skills/*/SKILL.md` — every reusable `/` workflow.
- `.github/roles/*.role.yml` — every config-driven role definition.

Re-generate it any time the catalog changes:

```bash
node scripts/build-registry.mjs
```

The registry records, per item: `name`, `description`, `tools`, source `path`, and (for roles) how many
certifications it maps to. It also groups agents into **packs** by domain (best-effort auto-tagging) so
the catalog is browsable.

## Packs (the unit of distribution)

A **pack** is a themed bundle you can copy as a unit — e.g. a *Data & BI* pack (Data Engineer, Analytics
Engineer, Data Architect, DBA, Power BI, Fabric, Databricks…), a *Security* pack, or a *Cloud* pack. A
pack is just a selection of the three primitives:

```
<pack>/
├── .github/agents/*.agent.md    # the personas in this pack
├── .github/skills/*/SKILL.md    # the workflows they rely on
└── .github/roles/*.role.yml     # the role configs behind the agents
```

Because every pack shares the same constitution ([`AGENTS.md`](../AGENTS.md)) and the same skills, packs
compose cleanly — installing two packs never conflicts as long as `name`s are unique (the generator
flags collisions).

## Install a pack

1. **Copy** the pack's `.github/agents`, `.github/skills`, and `.github/roles` files into your target
   repo (or your VS Code user profile to roam across all workspaces — see the [README](../README.md)).
2. Reload Copilot. The new agents appear in the picker; skills appear under `/`.
3. (Optional) enable any MCP servers a role recommends (`mcp:` field → [MCP.md](./MCP.md)).

To **uninstall**, delete the files. To **disable** without deleting, flip `user-invocable: false` (agent)
or remove the skill folder from `chat.agentSkillsLocations`.

## Publish a pack

1. Build the capability the normal way: add a [role](./Roles.md) (`/role-composer`) and/or a
   [skill](./Skills.md).
2. Run `node scripts/build-registry.mjs` and commit the updated `marketplace/` index.
3. Tag a release (`vX.Y.Z`) and share the repo — forking a template repo *is* the distribution model for
   prompt/skill packs today (see [PluginSDK.md](./PluginSDK.md) → Distribution).

## Governance & trust (enterprise)

- **Provenance**: every catalog entry links to its source file; review the diff before installing.
- **Permissions**: an agent can only use the tools in its `tools:` frontmatter — audit this per pack.
- **Safety**: security-domain agents are **defensive/authorized-only** by policy ([Security.md](./Security.md));
  packs must not weaken the constitution.
- **Versioning & quality**: no stubs — each item follows [Standards.md](./Standards.md) and is verifiable.

## Status

- **Now**: generated registry + catalog, pack convention, copy/profile install, template-repo publishing.
- **Next** ([Roadmap.md](./Roadmap.md)): a hosted index and one-command install, ratings, and signed
  packs for org distribution.
