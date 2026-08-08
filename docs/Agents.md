# LearningOS — Agents

The personas of LearningOS. Each is a [`.github/agents/*.agent.md`](../.github/agents) file that
follows the shared constitution in [`AGENTS.md`](../AGENTS.md) and ends every substantive answer with
the **Learning Footer**.

## Core roster

| Agent | Delegable? | Tools | Use for |
|---|---|---|---|
| **Drona** (orchestrator) | entry point | read, search, edit, web, todo, agent | Any learning goal; routes to the rest. |
| **Coding Mentor** | yes | read, edit, search, execute, web | Learn to code; review/refactor/debug as a lesson. |
| **Research and News Analyst** | yes | web, search, read | Latest news, docs, blogs, RFCs, papers, digests. |
| **Interview Coach** | yes | read, search, web, todo | Mock interviews (coding / system design / behavioral). |
| **Exam and Certification Coach** | yes | read, search, web, edit, todo | Cert & exam prep, syllabus mapping, mock exams. |
| **Career Mentor** | yes | read, search, web, edit, todo | Resume, portfolio, LinkedIn, career roadmaps. |
| **Meeting and Presentation Coach** | yes | read, search, web, edit, todo | Meetings, talks, demos, workshops, Q&A prep. |

Plus **122 role-agents** (and counting) generated from [`.github/roles/`](../.github/roles) across
Software, Programming Languages, Web & Frameworks, AI/ML, Data & BI, Cloud & Platform, DevOps/SRE,
Security, QA & Testing, Design/Docs, Architecture, Product & Management, Emerging & Specialized Tech,
Business/Support/Growth, and Enterprise Platforms — see [Roles.md](./Roles.md), or browse them as
installable packs in [`marketplace/CATALOG.md`](../marketplace/CATALOG.md).

## How the original "50+ agents" list is served

The blueprint enumerated many specialist agents. Rather than 50 brittle files, LearningOS serves each
capability through the **core agent + a skill + (optionally) a role**. This table shows the mapping so
nothing from the vision is lost:

| Blueprint agent(s) | Served by |
|---|---|
| Learning Planner · Study/Revision Coach · Roadmap | `learning-roadmap` skill (via Drona) |
| Quiz Generator · Active Recall · Spaced Repetition | `quiz-generator` + `flashcards` skills |
| Flashcard Generator · Note/Mind-Map Generator | `flashcards` + `concept-explainer` skills |
| Knowledge Graph Builder | [Memory.md](./Memory.md) (notes + graph pattern) |
| Technical / HR / Behavioral / System-Design / Mock Interviewer | **Interview Coach** |
| Exam Coach · Certification Coach | **Exam and Certification Coach** |
| Documentation/Research/RFC/Standards/API/Changelog/Release-Notes | **Research and News Analyst** + `research-brief` |
| Coding Mentor · Debugging · Refactoring · Code/Perf/Security Reviewer · Testing Coach · Design-Pattern Mentor | **Coding Mentor** + `code-review-coach` |
| AI / GenAI / LLM / Agent / Prompt / Semantic-Kernel / MCP / RAG Mentor | `ai-engineer` + `azure-ai-engineer` roles |
| Software/Solution/Cloud/Enterprise/Data/AI Architecture Mentor | `solution-architect` role (+ domain roles) |
| Resume / Portfolio / LinkedIn / Salary / Career-Roadmap Coach | **Career Mentor** |
| Meeting / Presentation / Technical-Writing / Decision / Planning | **Meeting and Presentation Coach** |
| Technology-News / Blog / Release-Notes / Repo-Watcher / RSS / Paper-Tracker | **Research and News Analyst** + [News.md](./News.md) |

## Routing (how Drona decides)

Drona picks the **lightest route that fully serves the goal**:

1. **Teach inline** for quick concepts.
2. **Invoke a skill** for a defined workflow (roadmap, quiz, review, research brief…).
3. **Delegate to a specialist** when a persona's focus/tools help (run code, live research, scored mock).
4. **Delegate to a role-agent** for deep domain expertise (Data Engineer, DevOps, etc.).
5. **Combine** — e.g. roadmap → concept lessons → quiz → flashcards.

The full routing map lives in [`drona.agent.md`](../.github/agents/drona.agent.md).

## Authoring a new agent

Create a distinct persona only when it needs different **tools** or **context isolation** than the
core set. Otherwise prefer a **skill** (workflow) or a **role** (domain config).

```yaml
---
description: "Keyword-rich 'Use when…' line — this is the discovery surface."
name: "Persona Name"
tools: [read, search, web]          # minimal set the role needs
argument-hint: "What to pass it"
user-invocable: true
---
# Persona Name
Follow AGENTS.md. Sections: What you do · Procedure · Principles · Related skills · Learning Footer.
```

See [Standards.md](./Standards.md) for the house style and [Skills.md](./Skills.md) / [Roles.md](./Roles.md)
for when to choose a skill or role instead.
