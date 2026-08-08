---
name: chroma-vector-local-lab
description: "Hands-on Chroma lab — run the open-source Chroma vector database locally with no API key, no subscription, and no cost, fully offline. Create a collection, add documents/embeddings, and run similarity queries; persist to disk and pick a distance metric. Use for 'local vector database', 'Chroma tutorial', 'store embeddings locally', 'offline vector search', 'PersistentClient', or a hands-on lab for local vector search."
argument-hint: "The vectors"
---

# Chroma Vector Local Lab

Learn a vector database by running Chroma **on your own machine** — create, add, and query — while seeing
how embeddings power similarity search, per [`AGENTS.md`](../../../AGENTS.md).
Pairs with [vector-db-selector](../vector-db-selector/SKILL.md) and [embeddings-explainer](../embeddings-explainer/SKILL.md).

## When to use

- The learner wants the simplest local, free vector store to hold embeddings and run nearest-neighbor queries offline.
- The storage step for [ollama-rag-lab](../ollama-rag-lab/SKILL.md); compare a server-style store in [qdrant-local-lab](../qdrant-local-lab/SKILL.md).

## Procedure

1. **Concept** — a vector DB stores embeddings and finds nearest neighbors by distance; Chroma is
   open-source and runs **in-process**, no server or cloud needed (docs.trychroma.com, *Getting Started*, 2025).
2. **Install & client** — `pip install chromadb`, then `chromadb.Client()` (in-memory) or
   `chromadb.PersistentClient(path="./db")` to save to disk — the in-memory client forgets on exit.
3. **Create a collection** — `client.create_collection("docs")`; by default Chroma embeds text with a
   **local** model (all-MiniLM-L6-v2, 384-dim), so no API key is required.
4. **Add & query** — `collection.add(documents=[...], ids=[...])`, then
   `collection.query(query_texts=["..."], n_results=3)` returns the nearest documents with distances.
5. **Exercise — tune the metric** — recreate the collection with cosine space
   (`metadata={"hnsw:space": "cosine"}`) and compare results vs. the default L2; the metric must match your embedder.
6. ⚠ **Verify** — reopen a `PersistentClient` on the same path and confirm the data survived; sanity-check
   that returned neighbors are actually relevant (a small default embedder ⇒ modest quality).

## Output shape

```
Client: Client() in-memory | PersistentClient(path) on disk
Collection: create_collection("docs")  [+ hnsw:space=cosine]
Embed: local default all-MiniLM-L6-v2 (384-dim) · no API key
Add: add(documents, ids[, embeddings, metadatas])
Query: query(query_texts, n_results=k) → ids + distances
Verify: reopen path → data persists · neighbors relevant
```

## Tips

- The in-memory `Client()` forgets on exit — use `PersistentClient(path=...)` (or `chroma run --path`) to keep data.
- The built-in embedder is small; for better recall bring your own vectors (e.g., from [ollama-rag-lab](../ollama-rag-lab/SKILL.md)) via `embeddings=`.
- Great for learning and small corpora, not billions of vectors — choose deliberately with [vector-db-selector](../vector-db-selector/SKILL.md); end with the **Learning Footer** (`AGENTS.md`).
