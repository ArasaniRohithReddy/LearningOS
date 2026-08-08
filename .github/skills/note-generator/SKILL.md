---
name: note-generator
description: "Turn a topic, lesson, or source into clean, structured study notes — summary, key points, a worked example, a diagram, common pitfalls, self-test questions, and links — using a consistent template. Use for 'take notes on X', 'summarize this into notes', 'make study notes', or capturing a lesson for later revision. Notes feed flashcards and the knowledge graph."
argument-hint: "Topic/lesson/source to turn into notes (+ depth)"
---

# Note Generator

Capture a lesson as durable, reusable notes — following [`AGENTS.md`](../../../AGENTS.md). Uses the
[`lesson-notes` template](../../../templates/lesson-notes.template.md).

## When to use
- After a lesson or while reading a source, to capture it for revision.
- Building inputs for `flashcards`, `spaced-repetition-scheduler`, and `knowledge-graph`.

## Procedure
1. Confirm the **topic/source** and depth (quick recap vs. thorough).
2. Produce notes using the template sections:
   - **Summary** (the idea in 2–3 sentences).
   - **Key points** (atomic, one idea each).
   - **Worked example** (concrete).
   - **Diagram** (Mermaid) when structure helps.
   - **Pitfalls / misconceptions**.
   - **Self-test questions** (turn into flashcards later).
   - **See also** (relative links to related notes → knowledge graph).
3. **Cite sources** with dates for anything factual; never fabricate.
4. Offer to **save** to a file (e.g. `notes/<topic>.md`) and to generate flashcards from the self-test
   questions.

## Output shape
```
Follows lesson-notes.template.md:
Summary → Key points → Worked example → Diagram → Why/trade-offs →
Pitfalls → Self-test → See also → Sources
```
Keep it skimmable — headings, short bullets, and one diagram max unless asked.

## Tips
- Atomic notes are easier to review and to link.
- Hand the self-test questions to `flashcards` and the "See also" links to `knowledge-graph`. End with
  the **Learning Footer** (`AGENTS.md`).
