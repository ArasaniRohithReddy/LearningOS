---
name: glossary-builder
description: "Build a clear, alphabetized glossary of the key terms in a domain — concise, level-appropriate definitions with a quick example and 'see also' links between related terms. Use for 'glossary', 'define the key terms for X', 'terminology/jargon for Y', 'vocab list', or a jargon-buster before a course, meeting, or exam. Feeds the knowledge-graph."
argument-hint: "Domain/topic + level"
---

# Glossary Builder

Give the learner the vocabulary of a domain so every later explanation lands — following
[`AGENTS.md`](../../../AGENTS.md).

## When to use
- The learner is new to a field and keeps hitting unfamiliar terms.
- Prepping shared language before a course, meeting, exam, or research read.

## Procedure
1. **Scope the domain** and the learner's **level** — level sets how deep each definition goes.
2. **Collect the key terms** that actually matter, including important acronyms and their expansions.
3. **Define each in plain language:** 1–2 sentences at the learner's level, plus a **short example** or
   "why it matters". Avoid circular or self-referential definitions.
4. **Alphabetize** and add **"see also"** cross-links between related terms (prereqs, opposites, parts).
5. **Cite** any contested or version-specific definition with a source and date; never guess a meaning.
6. **Feed** the linked terms into [`knowledge-graph`](../knowledge-graph/SKILL.md) to map how they connect.

## Output shape
```
Glossary — <domain> (<level>)
API — <plain definition>. e.g. <example>.   See also: Endpoint, SDK
Endpoint — <plain definition>.              See also: API
…
Map related terms → /knowledge-graph
```

## Tips
- Define at the learner's level; don't explain a term using jargon defined later without a link to it.
- Keep definitions honest and sourced; prefer official wording for standards and APIs.
- End with the **Learning Footer** (`AGENTS.md`).
