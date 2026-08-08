---
name: qdrant-local-lab
description: "Hands-on Qdrant lab — run the open-source Qdrant vector database locally via Docker with no API key, no subscription, and no cost, fully offline. Create a collection, upsert points with payloads, and run similarity search with metadata filtering. Use for 'local vector DB with Docker', 'Qdrant tutorial', 'vector search with filters', 'payload filtering', 'offline similarity search', or a hands-on lab for local ANN search."
argument-hint: "The vector search"
---

# Qdrant Local Lab

Run a production-style vector database on your own machine and learn ANN search **with filtering** —
trading a little recall for speed — per [`AGENTS.md`](../../../AGENTS.md).
Pairs with [vector-db-selector](../vector-db-selector/SKILL.md) and [chroma-vector-local-lab](../chroma-vector-local-lab/SKILL.md).

## When to use

- The learner wants a local, free vector service with payload filters and an HTTP/gRPC API, close to production.
- The storage/retrieval step for [ollama-rag-lab](../ollama-rag-lab/SKILL.md); embeddings background in [embeddings-explainer](../embeddings-explainer/SKILL.md).

## Procedure

1. **Concept** — Qdrant stores vectors plus JSON **payloads** and searches by distance using an HNSW index
   (approximate ⇒ recall < 100%, tunable) (qdrant.tech, *Quickstart*, 2025).
2. **Run it locally** — `docker run -p 6333:6333 -p 6334:6334 qdrant/qdrant` starts the service (REST 6333,
   gRPC 6334, dashboard at `/dashboard`); no Docker? use embedded `QdrantClient(":memory:")` or `path="./db"`.
3. **Create a collection** — with `qdrant-client`:
   `create_collection(name, vectors_config=VectorParams(size=D, distance=Distance.COSINE))` — size/metric must match the embedder.
4. **Upsert points** — `upsert(points=[PointStruct(id, vector, payload={"city": "Berlin"})])`; payloads carry
   metadata used for filtering and citations.
5. **Exercise — search + filter** — query with a vector plus a
   `Filter(must=[FieldCondition(key="city", match=MatchValue(value="Berlin"))])`; compare results with and without it.
6. ⚠ **Verify** — open `http://localhost:6333/dashboard`, confirm points/payloads, and note filters interact
   with ANN, so test *filtered* recall specifically. Fully local, no API key.

## Output shape

```
Run: docker run -p 6333:6333 qdrant/qdrant  (or :memory: / path)
Collection: VectorParams(size=D, distance=COSINE)
Upsert: PointStruct(id, vector, payload{...})
Search: query vector → top-k  [+ Filter must/should/must_not]
Dashboard: localhost:6333/dashboard · offline · no API key
Verify: filtered vs unfiltered recall checked
```

## Tips

- Match `size` and `distance` to your embedding model, or search silently degrades.
- Filters can cut ANN recall — always test the *filtered* query, not just the open one ([vector-db-selector](../vector-db-selector/SKILL.md)).
- `:memory:`/`path=` needs no Docker and is ideal for learning; scale and tuning (`hnsw_ef`, `m`) come later — end with the **Learning Footer** (`AGENTS.md`).
