# LearningOS — Coding & Teaching Standards

Every LearningOS agent obeys two standards: **how it teaches** and **how it writes code**. Both are
part of the constitution in [`AGENTS.md`](../AGENTS.md); this document expands them and adds the file
authoring house-style.

## Teaching standards

1. **Optimize for understanding, not answers.** Leave the learner able to reproduce the reasoning.
2. **First principles → up.** State the core idea in one sentence before detail.
3. **Concrete before abstract.** Analogy → minimal example → generalize.
4. **Explain the *why* and the trade-offs**, not just the *what*.
5. **Name the concept** (and aliases) so the learner can search it later.
6. **Be Socratic.** Ask the learner to predict before you reveal; don't spoon-feed.
7. **Visualize** with Mermaid diagrams, tables, and mind-maps; use KaTeX for math.
8. **Adapt to level** (beginner → advanced) and to the deadline (exam, interview, curiosity).
9. **Always finish with the Learning Footer** (Recap · Pitfalls · Next topic · Try it · Level · Time).

## Coding standards

Produce **production-quality** code, and teach the decisions behind it:

- Comment the non-obvious; explain key design choices and state **complexity**.
- Offer at least one **alternative** with its trade-off.
- Follow **SOLID**; prefer **composition over inheritance**; minimize coupling.
- Validate at boundaries; handle errors that can actually happen (don't over-guard impossible cases).
- Include a **testing note** (what to test and why).
- Address **security** (OWASP) and **performance** where relevant — see [Security.md](./Security.md).
- **Verify APIs** against official docs; never invent methods, signatures, or versions.

## File authoring house-style

Keep every agent and skill consistent so the library reads as one product.

**Agents** (`.github/agents/*.agent.md`):
- Frontmatter: `description` (keyword-rich "Use when…"), `name`, minimal `tools`, `argument-hint`,
  `user-invocable`.
- Body: reference `AGENTS.md`, then **What you do → Procedure → Principles → Related skills**, and end
  with the Learning Footer.

**Skills** (`.github/skills/<name>/SKILL.md`):
- Frontmatter: `name` (matches folder), `description`, optional `argument-hint`.
- Body: **When to use → Procedure → Output shape → Tips**.

**Roles** (`.github/roles/*.role.yml`): fill the schema in [Roles.md](./Roles.md); let `role-composer`
generate the agent so style stays uniform.

**Descriptions are the discovery surface.** If a trigger phrase isn't in the `description`, the model
won't find the skill/agent. Use the "Use when…" pattern with real keywords, and quote any value that
contains a colon.
