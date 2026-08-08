---
name: embeddings-explainer
description: "Explain and choose embeddings plus vector search: what embeddings capture, similarity metrics (cosine/dot/L2), dimensionality, index types (flat/HNSW/IVF), and how to evaluate retrieval quality. Use for 'what are embeddings', 'which embedding model', 'cosine vs dot product', 'HNSW vs IVF', 'vector database/index choice', or 'embeddings for search/RAG/clustering'. Teaches the concept and the trade-offs."
argument-hint: "The use case (search/RAG/clustering)"
---

# Embeddings Explainer

Explain what embeddings capture and choose the right vector search for the job — **with every
trade-off** — per the teaching principles in [`AGENTS.md`](../../../AGENTS.md).

## When to use

- The learner needs semantic search, RAG retrieval, clustering, or dedup and must pick a model + index.
- Pairs with `rag-designer` (the retrieval step), `dataset-explorer`, and `eval-designer` (retrieval quality).

## Procedure

1. **Build intuition.** An embedding maps text/image to a vector so that *meaning* ≈ geometric nearness;
   similar items land close (word2vec: Mikolov et al., arXiv:1301.3781, 2013-01-16).
2. **Pick an embedding model** for the domain, language, and input length; sentence-level models suit
   search (Reimers & Gurevych, *Sentence-BERT*, arXiv:1908.10084, 2019-08-27). The *same* model must
   embed queries and items.
3. **Choose a similarity metric.** Cosine (angle) vs. dot product (angle + magnitude) vs. L2; normalize
   vectors so the metric means what you think, and match what the model was trained with.
4. **Weigh dimensionality.** Higher dims can carry more nuance but cost memory, storage, and speed —
   more isn't automatically better.
5. **Select an index by scale:** exact **flat** search (small, precise) vs. ANN — **HNSW** (Malkov &
   Yashunin, arXiv:1603.09320, 2016-03-30) or **IVF** (Johnson et al., *FAISS*, arXiv:1702.08734,
   2017-02-28) — trading recall for speed and memory.
6. **Evaluate retrieval** (recall@k, MRR/nDCG) on held-out query→relevant pairs before trusting it (`eval-designer`).
7. End with the **Learning Footer** (`AGENTS.md`).

## Output shape

```
Use case: search / RAG / clustering / dedup
Model: choice + why (domain, language, length)
Similarity: cosine / dot / L2 (+ normalization)
Dimensionality: value vs. cost
Index: flat / HNSW / IVF — recall vs. speed vs. memory
Eval: recall@k / MRR on held-out pairs
Learning Footer
```

## Tips

- Embed queries and items with the **same** model, or the distances are meaningless.
- ANN indexes trade a little recall for big speed/memory wins — measure the recall you actually lose.
- Cosine and dot product agree only on normalized vectors; normalize deliberately.
- Close with the **Learning Footer** (`AGENTS.md`) so the learner knows the next step.
