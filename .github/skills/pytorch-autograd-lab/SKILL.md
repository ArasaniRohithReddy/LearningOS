---
name: pytorch-autograd-lab
description: "Hands-on PyTorch lab on autograd: set requires_grad, run a forward pass, call backward() to compute gradients, read .grad, and disable tracking with torch.no_grad() — learning by running real code. Use for 'PyTorch autograd lab', 'practice gradients', 'requires_grad', 'backward()', 'what is .grad', 'zero_grad / gradient accumulation', 'no_grad for inference', or a guided hands-on exercise on automatic differentiation. Teaches by doing, not just reading."
argument-hint: "The gradient need"
---

# PyTorch Autograd Lab

A guided, hands-on lab that builds intuition for automatic differentiation by writing and running code —
following the teach-by-doing principles in [`AGENTS.md`](../../../AGENTS.md). Pairs with
[`pytorch-tensors-lab`](../pytorch-tensors-lab/SKILL.md) and [`worked-example`](../worked-example/SKILL.md).

## When to use

- The learner wants to *see* gradients computed by hand vs. autograd, not just trust `backward()`.
- Before the training loop, to understand what `loss.backward()` and `zero_grad()` actually do.

## Procedure

1. **Concept first.** Autograd records ops on tensors with `requires_grad=True` into a graph, then
   reverse-mode differentiates it (Paszke et al., *Automatic differentiation in PyTorch*, NeurIPS-W 2017).
2. **Frame the task.** Pick a tiny scalar function, e.g. `y = x**2`, and predict `dy/dx` before running.
3. **Exercise — backward.** `x = torch.tensor(2.0, requires_grad=True)`; `y = x**2`; `y.backward()`;
   read `x.grad` (should be `4.0`) and check it matches your hand calc.
4. **Exercise — accumulation.** Call `backward()` twice without clearing; watch `.grad` *add up*, then reset
   with `x.grad.zero_()` — this is why training calls `optimizer.zero_grad()` each step.
5. **Exercise — no_grad.** Wrap an eval-style computation in `with torch.no_grad():` and confirm the result
   has `requires_grad=False`; contrast with `.detach()` (PyTorch *Autograd mechanics*, pytorch.org).
6. **Reference solution sketch.** Show forward → backward → read grad → zero → no_grad in ~8 lines.
7. **Pitfalls & Learning Footer.** Name the traps, then close with the **Learning Footer** (`AGENTS.md`).

## Output shape

```
Need: … | Function: y = f(x), predicted dy/dx
Setup: x = torch.tensor(2.0, requires_grad=True)
Backward: y = x**2 → y.backward() → x.grad == 4.0
Accumulation: grad adds up → x.grad.zero_() before next step
no_grad: with torch.no_grad(): … → result.requires_grad == False
Learning Footer
```

## Tips

- Gradients **accumulate** by default; forgetting `zero_grad()` silently corrupts training updates.
- `backward()` needs a scalar — call `.sum()`/`.mean()` first, or pass an explicit `gradient=` vector.
- Use `torch.no_grad()` for inference to skip graph-building — less memory, faster, no accidental grads.
- End with the **Learning Footer** (`AGENTS.md`) so the learner knows the next step.
