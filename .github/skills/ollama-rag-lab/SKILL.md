---
name: ollama-rag-lab
description: "Hands-on local RAG lab — build a fully offline retrieval-augmented generation pipeline with Ollama plus a local embedding model (nomic-embed-text) and a local vector store, with no API key, no subscription, and no cost. Chunk your docs, embed them, retrieve top-k, and answer with citations from a local LLM. Use for 'chat with my docs offline', 'local RAG', 'private RAG no API key', 'Ollama embeddings', 'offline retrieval', or a hands-on lab for local RAG."
argument-hint: "The docs to query"
---

# Ollama RAG Lab

Build a private, offline RAG pipeline end to end and see why **retrieval quality**, not the model, usually
decides the answer — per the teaching principles in [`AGENTS.md`](../../../AGENTS.md).
Pairs with [rag-designer](../rag-designer/SKILL.md) and [embeddings-explainer](../embeddings-explainer/SKILL.md).

## When to use

- The learner wants an LLM grounded on their own documents with **zero cloud cost or API keys**, all on-device.
- After [ollama-local-llm-lab](../ollama-local-llm-lab/SKILL.md); design from [rag-designer](../rag-designer/SKILL.md), storage from [chroma-vector-local-lab](../chroma-vector-local-lab/SKILL.md).

## Procedure

1. **Concept** — RAG retrieves relevant chunks into the prompt so the LLM answers from *your* data,
   reducing hallucination (Lewis et al., arXiv:2005.11401, 2020-05-22); here every step runs locally.
2. **Ingest & chunk** — split docs into overlapping chunks by headings/size and keep metadata (source,
   section) for citations; poor chunking is the #1 cause of junk retrieval.
3. **Embed locally** — `ollama pull nomic-embed-text`, then call Ollama's embeddings API (`/api/embed`) for
   chunks *and* queries — it **must be the same model** for both (ollama.com, *Embedding models*, 2024).
4. **Store & retrieve** — put vectors in a local store (e.g., Chroma), embed the question, and fetch the
   top-k nearest chunks ([chroma-vector-local-lab](../chroma-vector-local-lab/SKILL.md)).
5. **Exercise — generate with citations** — stuff retrieved chunks into a `/api/chat` prompt instructing the
   local LLM to answer *only* from context, cite sources, and say "not found" when the context lacks the answer.
6. ⚠ **Verify** — inspect what was retrieved *before* blaming the model: wrong answer → check recall (right
   chunks?) then the prompt. Fully offline: no key, no network.

## Output shape

```
Docs: <corpus> | Chunk: size/overlap + metadata kept
Embed: nomic-embed-text via /api/embed (same for query+chunk)
Store: local vector DB (Chroma) → top-k retrieval
Answer: /api/chat, context-only + citations, "not found" path
Offline: no API key · no subscription · no network
Debug: bad answer → inspect retrieved chunks first
```

## Tips

- Most failures are **retrieval** failures — log the top-k chunks and scores before touching the prompt.
- Local embedders are smaller than hosted ones; test retrieval on real questions and fix chunking before swapping models.
- Free and private, but offline means **stale data** — re-ingest when docs change; end with the **Learning Footer** (`AGENTS.md`).
