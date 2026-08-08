---
name: pgvector-local-lab
description: "Hands-on pgvector lab — add vector similarity search inside your local PostgreSQL with no API key, no subscription, and no cost, fully offline. Enable the extension, add an embedding column, insert vectors, and run exact and HNSW approximate nearest-neighbor queries. Use for 'vector search in Postgres', 'pgvector tutorial', 'embedding column', 'ANN index in SQL', 'HNSW/IVFFlat', 'offline vector DB in Postgres', or a hands-on lab for pgvector."
argument-hint: "The vectors in Postgres"
---

# pgvector Local Lab

Learn vector search **inside a database you already know** — keep embeddings next to your rows in local
Postgres, with full SQL and ACID — per [`AGENTS.md`](../../../AGENTS.md).
Pairs with [vector-db-selector](../vector-db-selector/SKILL.md) and [embeddings-explainer](../embeddings-explainer/SKILL.md).

## When to use

- The learner wants vector search without a new service — just Postgres — running free and offline on their machine.
- An alternative store for [ollama-rag-lab](../ollama-rag-lab/SKILL.md); compare a dedicated engine in [qdrant-local-lab](../qdrant-local-lab/SKILL.md).

## Procedure

1. **Concept** — pgvector adds a `vector` type and distance operators to Postgres, so ANN search lives
   beside relational data (github.com/pgvector/pgvector, *README*, 2025).
2. **Enable it** — install the extension, then run `CREATE EXTENSION vector;` once per database (Postgres 13+).
3. **Model the data** — add a column sized to your embedder, e.g. `ALTER TABLE items ADD COLUMN embedding
   vector(384);` and `INSERT` rows with `'[...]'` literals.
4. **Query exactly** — `SELECT ... ORDER BY embedding <=> '[...]' LIMIT 5;` — operators: `<->` L2, `<=>`
   cosine, `<#>` (negative) inner product; **no index ⇒ exact, perfect recall**.
5. **Exercise — add an ANN index** — `CREATE INDEX ON items USING hnsw (embedding vector_cosine_ops);` and
   re-run; approximate search trades recall for speed, and the op-class must match the operator.
6. ⚠ **Verify** — `EXPLAIN` the query to confirm the index is used, and compare top-k before/after to *see*
   the recall trade-off. All local, no API key.

## Output shape

```
Extension: CREATE EXTENSION vector;   (Postgres 13+)
Column: embedding vector(384)   [match your embedder's dim]
Insert: INSERT ... VALUES ('[0.1, 0.2, ...]')
Exact: ORDER BY embedding <=> '[...]' LIMIT k   (perfect recall)
ANN: CREATE INDEX ... USING hnsw (embedding vector_cosine_ops)
Verify: EXPLAIN uses index · recall vs exact compared
```

## Tips

- Pick the operator that matches your embedding metric (`<=>` cosine is common) and the matching op-class (`vector_cosine_ops`).
- Indexed ANN can miss neighbors exact search finds — measure recall on your data, tune `hnsw.ef_search`/`ivfflat.probes` ([vector-db-selector](../vector-db-selector/SKILL.md)).
- Indexes cover up to 2,000 dimensions; keeping vectors in Postgres simplifies ops but competes for DB memory — end with the **Learning Footer** (`AGENTS.md`).
