---
name: role-composer
description: "Compose a brand-new specialist agent from a small YAML role config — the config-driven way to add role-agents (Data Engineer, Azure AI Engineer, DevOps/SRE, Security, Power BI, etc.) without hand-writing a prompt. Reads a .github/roles/*.role.yml file and generates a correctly-formatted .github/agents/<slug>.agent.md, then wires it into Drona. Use for 'create a <role> agent', 'build an agent from this config', 'add a new specialist', or 'turn this role.yml into an agent'."
argument-hint: "Path to a .role.yml (or a role name to scaffold one from the template first)"
---

# Role Composer

Build new specialist agents **from configuration**, not from scratch — the mechanism that lets
LearningOS cover *any* technical role. Follows the agent format and teaching principles in
[`AGENTS.md`](../../../AGENTS.md).

## When to use

- The learner wants a new role-agent (e.g., "Data Engineer", "Azure AI Engineer", "DevOps Engineer").
- You have (or will create) a `.role.yml` describing the role's skills, sources, certs, and tools.

## Inputs

A role config in [`.github/roles/`](../../roles/). If none exists, copy
[`_TEMPLATE.role.yml`](../../roles/_TEMPLATE.role.yml) and fill it in first (or infer sensible values
from the learner's description and confirm). See the worked examples
[`data-engineer.role.yml`](../../roles/data-engineer.role.yml) and
[`azure-ai-engineer.role.yml`](../../roles/azure-ai-engineer.role.yml).

## Procedure

1. **Load & validate the config.** Read the `.role.yml`. Ensure it has at least `name` and `skills`.
   Fill missing optional fields with sensible defaults; if a critical field is ambiguous, ask once.
2. **Derive identity.**
   - `name` → the agent's display `name` (Title Case, e.g. `"Data Engineer"`).
   - slug = lowercase-hyphenated name → output file `.github/agents/<slug>.agent.md`.
3. **Map config → agent frontmatter:**
   - `description`: write a keyword-rich "Use when…" line from `role.summary` + `skills` + `focus`
     (this is the discovery surface — include trigger terms).
   - `tools`: from `role.tools` if given, else a sensible default (`[read, search, web, edit]`;
     add `execute` only if the role writes/runs code, e.g. engineering roles).
   - `argument-hint`: a short prompt tailored to the role.
   - `user-invocable: true`.
4. **Map config → agent body** (keep the house style: reference `AGENTS.md`, then sections):
   - **What you do** — from `skills` and `focus`.
   - **Knowledge sources** — from `docs`/`sources` (list the official docs to prefer) + the global
     source-priority rule.
   - **How you teach** — mentor persona from `personality`; always teach, cite, and use the Learning
     Footer.
   - **Stay current / News** — from `news` (topics to watch via the Research & News Analyst).
   - **Certifications** — from `certifications` (hand off to the Exam & Certification Coach).
   - **Related skills** — `concept-explainer`, `practice-generator`, `quiz-generator`, etc.
5. **Write the file** to `.github/agents/<slug>.agent.md` in the exact format above.
6. **Wire it into Drona.** Add the new display `name` to the `agents:` allow-list in
   [`drona.agent.md`](../../agents/drona.agent.md) and add a routing row so Drona can delegate to it.
   (Optional) add it to the roster table in [`AGENTS.md`](../../../AGENTS.md) and the README.
7. **Validate:** frontmatter is valid YAML between `---` markers; `name` is present; `description`
   is meaningful and keyword-rich; file is under `.github/agents/`. Report what was created and how
   to invoke it (agent picker or `@<name>`).

## Config → agent field map (quick reference)

| Config field | Becomes |
|---|---|
| `name` | agent `name` + file slug |
| `summary` / `focus` | first line of the body + part of `description` |
| `personality` | teaching persona/tone |
| `skills` | "What you do" + `description` keywords |
| `docs` / `sources` | "Knowledge sources" (preferred official docs) |
| `news` | "Stay current" watch-list (→ Research & News Analyst) |
| `certifications` | "Certifications" (→ Exam & Certification Coach) |
| `tools` | frontmatter `tools` (default `[read, search, web, edit]`) |
| `mcp` | note recommended MCP servers to enable (if the client supports them) |

## Output shape

```
.github/agents/<slug>.agent.md   (created)
---
description: "<keyword-rich Use-when line with trigger terms>"
name: "<Display Name>"
tools: [read, search, web, edit]
argument-hint: "<role-tailored prompt>"
user-invocable: true
---
# <Display Name>
What you do · Knowledge sources · How you teach · Stay current · Certifications · Related skills
```
+ Drona `agents:` allow-list updated and a routing row added; (optional) roster row in AGENTS.md/README.

## Tips

- **No new engine, just config** — every role-agent shares the same constitution and skills; only the
  domain knobs differ. This is what makes the framework scale to hundreds of roles.
- Keep generated agents consistent with the existing ones (same sections, same footer).
- Don't fabricate certifications, docs URLs, or product facts — verify or leave a `TODO:` note.
