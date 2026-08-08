---
name: system-design-drill
description: "Run a practice system-design problem end to end — clarify requirements and scale, do back-of-envelope estimates, propose an architecture with a Mermaid diagram, define the data model and APIs, then discuss bottlenecks and trade-offs, and score the answer against a rubric. Use for 'system design practice', 'design Twitter / a URL shortener', 'design interview prep', or learning to architect scalable systems."
argument-hint: "System to design + constraints"
---

# System Design Drill

Practice designing systems the way senior engineers reason — requirements → estimate → architecture →
trade-offs — per [`AGENTS.md`](../../../AGENTS.md). Complements the **Interview Coach**.

## When to use

- The learner wants reps on open-ended design, with feedback and a score.
- Prepping for a design interview, or making a real architecture decision.

## Procedure

1. **Clarify** functional and non-functional requirements; nail the **scale** (users, QPS, read/write
   ratio, data size). Don't design until the problem is bounded.
2. **Estimate** back-of-envelope: traffic, storage, bandwidth — and state every assumption.
3. **Propose an architecture** and draw it in **Mermaid** (clients → API → services → stores → cache →
   queue). Justify each component.
4. **Data model & APIs:** key entities, storage choice (SQL vs. NoSQL and *why*), core endpoints.
5. **Stress it:** find bottlenecks; apply scaling levers (caching, sharding, replication, CDN, async)
   and name the **trade-offs** (CAP, consistency vs. availability, cost).
6. **Score against the rubric** and give the single top improvement.

## Output shape

```
Requirements: functional … | non-functional … | scale …
Estimates: QPS … storage … (assumptions)
Architecture:
  ```mermaid
  graph LR; Client-->API-->Svc-->DB; Svc-->Cache
  ```
Data model / APIs: …
Bottlenecks → fixes → trade-offs: …
Score: Reqs/Scale/Design/Trade-offs/Comms _/5 — top fix: …
```

## Tips

- There's no single right answer — reward justified trade-offs over memorized diagrams.
- Make the learner drive; ask "what breaks first at 10×?". Pair with [mock-exam](../mock-exam/SKILL.md).
- End with the **Learning Footer** (`AGENTS.md`).
