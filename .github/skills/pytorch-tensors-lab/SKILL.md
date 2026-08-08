---
name: pytorch-tensors-lab
description: "Hands-on PyTorch lab on tensors: create tensors, inspect shape/dtype, reshape, broadcast, move between CPU and GPU (device), and run element-wise & matmul ops — learning by running real code. Use for 'PyTorch tensors lab', 'practice tensors', 'tensor shapes', 'broadcasting rules', 'reshape vs view', 'move tensor to GPU / .to(device)', or a guided hands-on exercise on tensor basics. Teaches by doing, not just reading."
argument-hint: "The tensor task"
---

# PyTorch Tensors Lab

A guided, hands-on lab that builds PyTorch tensor fluency by writing and running code — following the
teach-by-doing principles in [`AGENTS.md`](../../../AGENTS.md). Pairs with
[`pytorch-autograd-lab`](../pytorch-autograd-lab/SKILL.md) and [`worked-example`](../worked-example/SKILL.md).

## When to use

- The learner wants to *practice* creating, reshaping, broadcasting, and moving tensors, not just read about it.
- Before autograd or models, to get comfortable with shapes, dtypes, and device placement.

## Procedure

1. **Concept first.** A tensor is an n-dimensional array with a `dtype`, `shape`, and `device`; it is the
   core structure PyTorch runs ops on (Paszke et al., *PyTorch: An Imperative Style…*, NeurIPS 2019).
2. **Frame the task & create.** State the shape you need; build with `torch.tensor([...])`, `torch.zeros`,
   `torch.ones`, `torch.arange`, or `torch.randn`; inspect `t.shape`, `t.dtype`, `t.device`.
3. **Exercise — reshape.** Change layout with `t.reshape(r, c)`, `t.view(...)`, `t.unsqueeze(0)`,
   `t.squeeze()`; confirm the element count stays constant.
4. **Exercise — broadcast.** Add a `(3,1)` to a `(1,4)` tensor; trailing dims align and size-1 dims stretch
   (PyTorch *Broadcasting semantics*, pytorch.org).
5. **Exercise — device & ops.** Set `dev = "cuda" if torch.cuda.is_available() else "cpu"`, `t.to(dev)`,
   then run `a * b` (element-wise) and `a @ b` / `torch.matmul` (matrix).
6. **Reference solution sketch.** Show create → reshape → broadcast → `.to(dev)` → matmul in ~8 lines.
7. **Pitfalls & Learning Footer.** Name the traps, then close with the **Learning Footer** (`AGENTS.md`).

## Output shape

```
Task: … | Tensor: shape + dtype + device
Create: torch.randn(3, 4)  →  t.shape, t.dtype
Reshape: t.view(2, 6)  |  t.unsqueeze(0) → (1, 3, 4)
Broadcast: (3,1) + (1,4) → (3,4)
Device: t = t.to("cuda" if torch.cuda.is_available() else "cpu")
Ops: a * b (element-wise)  |  a @ b (matmul)
Learning Footer
```

## Tips

- `view` needs contiguous memory and shares storage; `reshape` may copy — reach for `reshape` when unsure.
- Ops need operands on the *same* device and compatible dtypes, or PyTorch raises a runtime error.
- No GPU? Everything here runs on CPU — `cuda.is_available()` guards keep code portable, just slower.
- End with the **Learning Footer** (`AGENTS.md`) so the learner knows the next step.
