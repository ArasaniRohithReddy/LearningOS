---
name: pytorch-dataloader-lab
description: "Hands-on PyTorch lab on Dataset & DataLoader: write a custom Dataset with __len__/__getitem__, batch and shuffle with DataLoader, and apply transforms — learning by running real code. Use for 'PyTorch DataLoader lab', 'custom Dataset', '__getitem__', 'batching and shuffling', 'num_workers', 'apply transforms', or a guided hands-on exercise on data loading. Teaches by doing, not just reading."
argument-hint: "The data"
---

# PyTorch Dataset & DataLoader Lab

A guided, hands-on lab that builds a data pipeline by writing and running code — following the
teach-by-doing principles in [`AGENTS.md`](../../../AGENTS.md). Pairs with
[`pytorch-training-loop-lab`](../pytorch-training-loop-lab/SKILL.md) and [`feature-engineering-coach`](../feature-engineering-coach/SKILL.md).

## When to use

- The learner needs to feed *their own* data to a model in shuffled, batched form.
- Before or alongside the training loop, which iterates over the `DataLoader`.

## Procedure

1. **Concept first.** A `Dataset` maps an index to one `(sample, label)`; a `DataLoader` wraps it to batch,
   shuffle, and parallel-load (PyTorch *Datasets & DataLoaders*, pytorch.org).
2. **Frame the task.** Decide what one sample is and what `__getitem__(i)` should return (tensor + target).
3. **Exercise — custom Dataset.** Subclass `Dataset`; implement `__len__` (count) and `__getitem__(i)`
   (return a transformed sample and its label).
4. **Exercise — transforms.** Apply per-sample transforms in `__getitem__` (e.g. `transforms.Compose([...])`
   from torchvision) so raw data becomes model-ready tensors.
5. **Exercise — DataLoader.** `loader = DataLoader(ds, batch_size=32, shuffle=True, num_workers=2)`; iterate
   `for xb, yb in loader:` and print `xb.shape` to see the added batch dimension.
6. **Reference solution sketch.** Show the Dataset class plus the `DataLoader` and one iteration.
7. **Pitfalls & Learning Footer.** Name the traps, then close with the **Learning Footer** (`AGENTS.md`).

## Output shape

```
Data: … | one sample = (tensor, label)
Dataset: __len__ → N; __getitem__(i) → (transform(x_i), y_i)
Transforms: transforms.Compose([...]) applied per sample
DataLoader: DataLoader(ds, batch_size=32, shuffle=True, num_workers=2)
Batch: for xb, yb in loader: xb.shape == (32, …)
Learning Footer
```

## Tips

- Shuffle the **training** loader, not validation/test — you want stable, comparable eval batches.
- On Windows, run DataLoader iteration under `if __name__ == "__main__":` when `num_workers>0` (spawn start).
- Do heavy per-sample work in `__getitem__`; workers parallelize it, keeping the model fed.
- End with the **Learning Footer** (`AGENTS.md`) so the learner knows the next step.
