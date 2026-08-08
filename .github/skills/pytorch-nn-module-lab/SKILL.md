---
name: pytorch-nn-module-lab
description: "Hands-on PyTorch lab on nn.Module: subclass Module, register layers in __init__, implement forward(), and inspect parameters() — learning by running real code. Use for 'PyTorch nn.Module lab', 'define a model', 'build a neural network', 'nn.Linear layers', 'forward pass', 'model.parameters()', or a guided hands-on exercise on model definition. Teaches by doing, not just reading."
argument-hint: "The model"
---

# PyTorch nn.Module Lab

A guided, hands-on lab that builds a model class from scratch by writing and running code — following the
teach-by-doing principles in [`AGENTS.md`](../../../AGENTS.md). Pairs with
[`pytorch-training-loop-lab`](../pytorch-training-loop-lab/SKILL.md) and [`feature-engineering-coach`](../feature-engineering-coach/SKILL.md).

## When to use

- The learner wants to *define* their own model, not just call a prebuilt one.
- Before the training loop, to understand where layers and parameters live.

## Procedure

1. **Concept first.** `nn.Module` is the base class for all models; it tracks submodules and their learnable
   `Parameter`s so `.parameters()` and `.to(device)` just work (PyTorch *Build the Neural Network*, pytorch.org).
2. **Frame the task.** Decide input/output sizes (e.g. 4 features → 3 classes) and one hidden-layer width.
3. **Exercise — define.** Subclass `nn.Module`; in `__init__` call `super().__init__()`, then create
   `self.fc1 = nn.Linear(4, 16)` and `self.fc2 = nn.Linear(16, 3)`.
4. **Exercise — forward.** Implement `forward(self, x)`: `x = F.relu(self.fc1(x))`; `return self.fc2(x)`.
   Never call `forward` directly — call `model(x)` so hooks run.
5. **Exercise — inspect.** Run `sum(p.numel() for p in model.parameters())` and loop `named_parameters()`
   to see each weight/bias `shape` and `requires_grad`.
6. **Reference solution sketch.** Show the `__init__` + `forward` class and a `model(torch.randn(2, 4))` call.
7. **Pitfalls & Learning Footer.** Name the traps, then close with the **Learning Footer** (`AGENTS.md`).

## Output shape

```
Model: in=4 → hidden=16 → out=3
Define: class Net(nn.Module): __init__ registers nn.Linear layers
Forward: x = F.relu(self.fc1(x)); return self.fc2(x)
Call: logits = model(torch.randn(2, 4))   # shape (2, 3)
Params: sum(p.numel() for p in model.parameters())
Learning Footer
```

## Tips

- Forgetting `super().__init__()` breaks module/parameter registration — always call it first.
- Assign layers as attributes (or use `nn.ModuleList`); plain Python lists hide params from `.parameters()`.
- Call `model(x)`, not `model.forward(x)`, so registered hooks and `__call__` logic execute.
- End with the **Learning Footer** (`AGENTS.md`) so the learner knows the next step.
