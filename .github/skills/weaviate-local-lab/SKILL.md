---
name: weaviate-local-lab
description: "Hands-on Weaviate lab — run the open-source (BSD-3) Weaviate vector database locally with Docker, free and offline, no subscription. Enable a local text2vec module, create a collection, import objects, then run semantic nearText, BM25 keyword, and hybrid search. Use for 'run Weaviate locally', 'Weaviate Docker lab', 'vector semantic search', 'text2vec module', 'nearText and hybrid search', or a hands-on lab for local vector search."
argument-hint: "The semantic corpus"
---

# Weaviate Local Lab

Learn semantic search by running the open-source Weaviate vector database **on your own machine** —
vectorize, import, and query — per [`AGENTS.md`](../../../AGENTS.md).
Pairs with [vector-db-selector](../vector-db-selector/SKILL.md) and [rag-designer](../rag-designer/SKILL.md).

## When to use

- The learner wants a local, free vector DB that embeds text for them via a pluggable module.
- The retrieval step for [rag-designer](../rag-designer/SKILL.md); embeddings background in [embeddings-explainer](../embeddings-explainer/SKILL.md).

## Mental model

- A **collection** stores objects **and their vectors**; a `text2vec-*` **module** embeds text on both
  import and query, so you can run **`nearText`** (semantic), **`bm25`** (keyword), or **`hybrid`** (fused)
  search — served over REST on **8080** and gRPC on **50051**, with no external embedding API.

## Procedure

1. **Concept** — Weaviate stores objects **with vectors** in a **collection** and searches by distance; a
   `text2vec-*` **module** vectorizes text at import and query time (weaviate.io, *Quickstart (local)*, 2025).
2. **Run it locally** — Compose `cr.weaviate.io/semitechnologies/weaviate` (REST 8080, gRPC 50051) with
   `ENABLE_MODULES=text2vec-ollama` (or `text2vec-transformers`) for offline embeddings; BSD-3, no cloud.
3. **Create a collection** — define it with a `vectorizer` (the module) so imports embed automatically; properties carry metadata for filters.
4. **Import objects** — batch-insert documents; the module turns each object's text into a vector — no manual embeddings or API key.
5. **Exercise — search** — run `nearText` (semantic) vs `bm25` (keyword) vs `hybrid` (both, fused) and compare which surfaces the right object.
6. ⚠ **Verify** — `http://localhost:8080/v1/objects` lists imported objects with vectors; hybrid beats either mode alone on mixed queries. Fully local.

## Output shape

```
Run: docker compose up  → weaviate:8080 (REST) + :50051 (gRPC)
Module: ENABLE_MODULES=text2vec-ollama · DEFAULT_VECTORIZER_MODULE (offline)
Collection: { name, vectorizer: text2vec-…, properties[…] }
Import: batch objects → auto-vectorized (no API key)
Query: nearText | bm25 | hybrid(alpha)  → top-k objects
Verify: /v1/objects lists vectors · hybrid ≥ single mode · localhost:8080
```

## Tips

- Pick a **local** module (`text2vec-ollama`/`text2vec-transformers`) to stay offline; hosted modules need keys.
- `hybrid` fuses vector + keyword via `alpha` — tune it per query type instead of defaulting to pure vector.
- Compare a filter-first vector store in [qdrant-local-lab](../qdrant-local-lab/SKILL.md); design retrieval with [rag-designer](../rag-designer/SKILL.md). End with the **Learning Footer** (`AGENTS.md`).
