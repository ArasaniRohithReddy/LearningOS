---
name: pytorch-training-loop-lab
description: "Hands-on PyTorch lab on the training loop: forward pass, compute loss, zero_grad, backward, optimizer.step, and switch between model.train() and model.eval() — learning by running real code. Use for 'PyTorch training loop lab', 'how to train a model', 'loss.backward + optimizer.step', 'zero_grad order', 'train vs eval mode', 'no_grad in validation', or a guided hands-on exercise on optimization. Teaches by doing, not just reading."
argument-hint: "The training task"
---

# PyTorch Training Loop Lab

A guided, hands-on lab that assembles a correct training loop by writing and running code — following the
teach-by-doing principles in [`AGENTS.md`](../../../AGENTS.md). Pairs with
[`pytorch-nn-module-lab`](../pytorch-nn-module-lab/SKILL.md) and [`eval-designer`](../eval-designer/SKILL.md).

## When to use

- The learner has a model and needs the exact five steps that turn data into learned weights.
- Pairs with `ml-pipeline-designer` once the loop works and needs to scale toward production.

## Procedure

1. **Concept first.** Each step runs forward → loss → backward → update; the optimizer nudges parameters
   down the loss gradient (PyTorch *Optimizing Model Parameters*, pytorch.org).
2. **Frame the task.** Pick a loss (`nn.CrossEntropyLoss` for classification, `nn.MSELoss` for regression)
   and optimizer `opt = torch.optim.SGD(model.parameters(), lr=0.1)` (or Adam; Kingma & Ba, ICLR 2015).
3. **Exercise — one step.** In order: `opt.zero_grad()`; `out = model(x)`; `loss = criterion(out, y)`;
   `loss.backward()`; `opt.step()`. Print `loss.item()`.
4. **Exercise — the epoch.** Loop the five steps over batches; watch the training loss trend downward.
5. **Exercise — eval mode.** Switch `model.eval()` and wrap validation in `with torch.no_grad():`, then
   return to `model.train()` — `eval()` changes dropout/batchnorm; it does **not** disable grad.
6. **Reference solution sketch.** Show the five-line step plus the `train()`/`eval()` toggle.
7. **Pitfalls & Learning Footer.** Name the traps, then close with the **Learning Footer** (`AGENTS.md`).

## Output shape

```
Task: … | Loss + optimizer chosen
Step: opt.zero_grad() → out = model(x) → loss = criterion(out, y) → loss.backward() → opt.step()
Epoch: repeat over batches, track loss.item()
Eval: model.eval() + torch.no_grad(); then model.train()
Learning Footer
```

## Tips

- Call `zero_grad()` every step, or gradients from prior steps accumulate into corrupted updates.
- `model.eval()` and `torch.no_grad()` are different jobs — you usually need **both** for validation.
- Log `loss.item()` (a float), not `loss` (a graph-holding tensor), to avoid leaking memory.
- End with the **Learning Footer** (`AGENTS.md`) so the learner knows the next step.
