# Contributing to LearningOS

Thanks for helping grow LearningOS — the config-driven GitHub Copilot Agent framework for learning,
teaching, research, and career growth. Contributions are small and composable by design.

## Ways to contribute (easiest first)

### 1. Add a role (one YAML file) — recommended
The highest-leverage contribution. Cover a new career/specialty without writing a prompt.

1. `cp .github/roles/_TEMPLATE.role.yml .github/roles/<your-role>.role.yml`
2. Fill in at least `name` and `skills` (see the schema in [docs/Roles.md](docs/Roles.md)).
3. Generate the agent: `/role-composer .github/roles/<your-role>.role.yml`
4. Add your role to the catalog in [docs/Roles.md](docs/Roles.md).

### 2. Add a skill (one folder)
A reusable workflow invocable with `/`.

1. Create `.github/skills/<name>/SKILL.md` (folder name must equal the `name` field).
2. Follow the format and progressive-loading guidance in [docs/Skills.md](docs/Skills.md).
3. List it in [docs/Skills.md](docs/Skills.md).

### 3. Add an agent (one file)
Only when a persona needs different **tools** or **context isolation** than the core set. Follow the
house style in [docs/Standards.md](docs/Standards.md) and register it in Drona's `agents:` list.

### 4. Improve docs
The `docs/` folder is the framework's brain. Keep it accurate, cited, and concise.

## House rules

- **Follow the constitution.** Everything obeys [`AGENTS.md`](AGENTS.md): teach (don't just answer),
  cite sources with dates, never fabricate, and end substantive answers with the Learning Footer.
- **Descriptions are the discovery surface.** Use keyword-rich "Use when…" descriptions.
- **Minimal tools.** Give agents the least privilege they need (see [docs/Security.md](docs/Security.md)).
- **Validate before you commit.** Run the same checks CI runs:
  `node scripts/build-registry.mjs && node scripts/validate.mjs`
  (verifies counts, folder==name, resolvable Drona allow-list, Learning Footer, `## Output shape`, no
  secrets). See also the checklist in [docs/Testing.md](docs/Testing.md).
- **Don't fabricate** cert codes, doc URLs, or product facts — verify or leave a `TODO:`.

## Pull requests

1. Keep PRs focused (one role/skill/doc where possible).
2. In the description, say what you added and paste a golden-prompt example showing it works.
3. Confirm you ran the structural checks in [docs/Testing.md](docs/Testing.md).

## Code of Conduct

By participating you agree to the [Code of Conduct](CODE_OF_CONDUCT.md).
