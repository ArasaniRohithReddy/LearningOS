---
name: vector-db-selector
description: "Choose and configure a vector database and index: pick a distance metric, compare index types (flat/exact, IVF, HNSW, PQ), trade recall against latency and memory, add metadata filtering, and plan for scale. Use for 'which vector DB', 'HNSW vs IVF vs flat', 'recall vs latency tuning', 'ANN index choice', 'metadata filtering', or 'scale my embeddings search'. Teaches the trade-offs, not a brand."
argument-hint: "The use case + scale"
---

# Vector DB Selector

Choose a vector store by its **trade-offs, not its logo** — recall, latency, memory, and filtering — per
the source-discipline principles in [`AGENTS.md`](../../../AGENTS.md).

## When to use

- The learner has embeddings to search and must pick/tune an index that fits their scale and latency budget.
- Pairs with `rag-designer` (the retrieval step) and `eval-designer` (measure recall@k, not just speed).

## Procedure

1. **Frame the workload:** vector count and dimension, queries/sec, latency budget, filter needs, update rate,
   and memory/cost ceiling — these decide the index, not brand preference.
2. **Match the metric to the embedding.** Cosine, dot-product, or Euclidean must match how the model was
   trained; the wrong metric silently wrecks recall.
3. **Start exact (flat).** Brute-force gives 100% recall and a correctness baseline; it is fine up to ~100k
   vectors before latency and cost bite.
4. **Go approximate (ANN) to scale**, trading recall < 100% for speed: **HNSW** (graph, low-latency, high
   memory — Malkov & Yashunin, arXiv:1603.09320, 2016-03-30) vs **IVF/PQ** (partition + compress, memory-thrifty
   — Johnson et al., *FAISS*, arXiv:1702.08734, 2017-02-28).
5. **Tune the recall↔latency knobs** (HNSW `M`/`efSearch`, IVF `nlist`/`nprobe`) and *measure* recall against
   the flat baseline (ANN-Benchmarks — Aumüller et al., arXiv:1807.05614, 2018).
6. **Plan filtering & scale:** metadata pre/post-filtering, updates/deletes, sharding, and persistence — filters
   can quietly cripple ANN recall, so test filtered queries specifically.
7. End with the **Learning Footer** (`AGENTS.md`).

## Output shape

```
Workload: N vectors × dim, QPS, latency budget, filters, updates
Metric: cosine / dot / L2 (+ why it matches the embedder)
Index: flat vs HNSW vs IVF/PQ (+ the deciding constraint)
Tuning: knobs + measured recall@k vs flat baseline
Filtering & scale: metadata, updates, sharding, persistence
Learning Footer
```

## Tips

- Benchmark recall on *your* data — ANN recall and latency depend on the distribution, not vendor claims.
- HNSW usually wins latency but costs RAM; IVF/PQ saves memory at some recall — pick by your tightest constraint.
- Filtering interacts with the index; a filter that looks cheap can slash recall, so measure filtered queries.
- Close with the **Learning Footer** (`AGENTS.md`) so the learner knows the next step.
