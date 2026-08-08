---
name: rag-designer
description: "Design a retrieval-augmented generation (RAG) pipeline as a lesson: chunking strategy, embedding model choice, vector store, retrieval and re-ranking, prompt assembly with citations, and evaluation — surfacing the trade-offs at each step. Use for 'build a RAG system', 'chat with my docs/PDFs', 'ground the LLM on my data', 'reduce hallucination with retrieval', 'chunking/embedding/vector DB choices', or 'why is my RAG returning junk'. Teaches the design, not just a stack."
argument-hint: "The knowledge source + use case"
---

# RAG Designer

Design a retrieval-augmented generation pipeline and **explain every trade-off** — following the
teaching and source-discipline principles in [`AGENTS.md`](../../../AGENTS.md).

## When to use

- The learner wants an LLM grounded on their own documents/data, with citations and less hallucination.
- Complements `eval-designer` (retrieval + answer quality) and `concept-explainer` (embeddings/attention).

## Procedure

1. **Frame the use case:** questions to answer, corpus size/format, freshness, latency/cost budget, who verifies.
2. **Ingest & chunk.** Choose chunk size/overlap by content structure (headings, code, tables): too big
   dilutes retrieval, too small loses context. Keep metadata (source, section, date) for citations.
3. **Embed.** Pick an embedding model (dimension, language, domain, cost); the *same* model must embed
   queries and chunks. Weigh vs. keyword/BM25 and hybrid search.
4. **Store & index** in a vector DB (exact vs. ANN like HNSW): recall vs. speed vs. memory.
5. **Retrieve & re-rank.** Fetch top-k, then optionally re-rank with a cross-encoder for precision; add
   hybrid + metadata filters. Mind context position (Liu et al., *Lost in the Middle*, arXiv:2307.03172,
   2023-07-06).
6. **Assemble the prompt.** Insert retrieved context, instruct the model to answer *only* from it and
   **cite sources**, and handle "not found" (foundation: Lewis et al., arXiv:2005.11401, 2020-05-22).
7. **Evaluate** retrieval (recall/hit-rate@k) and answers (faithfulness, relevance) — hand to `eval-designer`.
8. End with the **Learning Footer** (`AGENTS.md`).

## Output shape

```
Use case & constraints: …
Pipeline: ingest → chunk → embed → store → retrieve → re-rank → assemble → generate (diagram)
Choices & trade-offs: per step, with the knob that matters most
Failure modes: bad chunking, wrong embed model, low recall, ignored context
Eval plan: retrieval metrics + answer metrics
Learning Footer
```

## Tips

- Most RAG failures are **retrieval** failures — inspect what was retrieved before blaming the LLM.
- Start simplest (fixed chunks + top-k + one model), measure, then add re-ranking/hybrid only if the eval demands it.
- Costs compound (embedding + storage + per-query tokens); estimate before scaling the corpus.
- Close with the **Learning Footer** (`AGENTS.md`) so the learner knows the next step.
