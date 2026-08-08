---
name: sklearn-clustering-lab
description: "Hands-on lab: run scikit-learn k-means, choose k with the elbow and silhouette methods, and evaluate clusters — scaling first because k-means uses Euclidean distance. Use for 'clustering lab', 'k-means', 'how to choose k', 'elbow method', 'silhouette score', or a guided hands-on exercise on unsupervised clustering. Teaches by doing, not just reading."
argument-hint: "The dataset"
---

# scikit-learn Clustering Lab

A guided, hands-on lab that clusters data with scikit-learn k-means and judges the result — choosing k
deliberately instead of guessing — following the teach-by-doing principles in
[`AGENTS.md`](../../../AGENTS.md). Pairs with [`dataset-explorer`](../dataset-explorer/SKILL.md) and
[`feature-engineering-coach`](../feature-engineering-coach/SKILL.md).

## When to use

- The learner wants to *practice* k-means and cluster evaluation, not just read the algorithm.
- For exploratory segmentation with no labels; pairs with `dataset-explorer` and `eval-designer`.

## Procedure

1. **Concept first.** k-means partitions points into k groups by minimizing within-cluster squared distance
   to centroids; because it uses Euclidean distance it needs scaled features (Pedregosa et al., *Scikit-learn*, JMLR 12, 2011).
2. **Frame & scale.** State the segmentation goal; `StandardScaler().fit_transform(X)` so no feature dominates by unit.
3. **Fit k-means.** `KMeans(n_clusters=k, n_init="auto", random_state=0).fit(X_scaled)` (`n_init="auto"` is
   the default since scikit-learn 1.4, 2024); read `.labels_` and `.inertia_`.
4. **Exercise — choose k.** Plot inertia vs. k for the elbow, and `silhouette_score` (range −1..1, higher =
   better separated) across k; pick where both agree, not the lowest inertia.
5. **Exercise — evaluate.** Compare `silhouette_score`, `calinski_harabasz_score` (higher better), and
   `davies_bouldin_score` (lower better); if any true labels exist, `adjusted_rand_score` (User Guide §2.3
   *Clustering*, scikit-learn.org).
6. **Reference solution sketch.** Show scale → loop over k → metrics → refit the chosen k.
7. **Pitfalls & Learning Footer.** Name k-means' assumptions and downstream leakage, then close with the
   **Learning Footer** (`AGENTS.md`).

## Output shape

```
Goal: … | Features scaled (StandardScaler)
Choose k: inertia elbow + silhouette across k
Fit: KMeans(n_clusters=k, n_init="auto", random_state=0)
Evaluate: silhouette / Calinski-Harabasz / Davies-Bouldin
Chosen k: why (where the metrics agree)
Learning Footer
```

## Tips

- Always scale before k-means — unscaled features let large-unit columns dominate the distance.
- k-means assumes roughly spherical, similar-size clusters; for other shapes try DBSCAN or Gaussian mixtures.
- If clusters become features for a supervised model, fit the scaler and `KMeans` on training rows only — else you leak.
- End with the **Learning Footer** (`AGENTS.md`) so the learner knows the next step.
