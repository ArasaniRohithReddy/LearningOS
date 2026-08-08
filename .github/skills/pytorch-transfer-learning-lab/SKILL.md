---
name: pytorch-transfer-learning-lab
description: "Hands-on PyTorch lab on transfer learning: load a pretrained torchvision model, freeze the backbone, replace the classifier head, and fine-tune on a new task — learning by running real code. Use for 'PyTorch transfer learning lab', 'use a pretrained model', 'freeze layers', 'fine-tune a head', 'feature extraction vs fine-tuning', 'ResNet weights', or a guided hands-on exercise on adapting pretrained networks. Teaches by doing, not just reading."
argument-hint: "The task + pretrained model"
---

# PyTorch Transfer Learning Lab

A guided, hands-on lab that adapts a pretrained model to a new task by writing and running code — following
the teach-by-doing principles in [`AGENTS.md`](../../../AGENTS.md). Pairs with
[`pytorch-nn-module-lab`](../pytorch-nn-module-lab/SKILL.md) and [`ml-pipeline-designer`](../ml-pipeline-designer/SKILL.md).

## When to use

- The learner has a small dataset and wants strong results without training from scratch.
- After the training loop works; pairs with `eval-designer` to measure the fine-tuned model.

## Procedure

1. **Concept first.** Early layers learn general features that transfer; you reuse them and retrain only the
   head (Yosinski et al., *How transferable are features in deep networks?*, NeurIPS 2014).
2. **Frame the task.** Match input preprocessing to the pretrained model and set the new class count.
3. **Exercise — load pretrained.** `from torchvision.models import resnet18, ResNet18_Weights`;
   `model = resnet18(weights=ResNet18_Weights.DEFAULT)` (the `weights=` API replaced `pretrained=True` in
   torchvision 0.13, 2022).
4. **Exercise — freeze.** `for p in model.parameters(): p.requires_grad = False`, keeping the backbone
   fixed (feature extraction).
5. **Exercise — swap the head.** Set `model.fc = nn.Linear(model.fc.in_features, num_classes)`; its new
   params default to `requires_grad=True`. Pass only those to the optimizer, then train.
6. **Reference solution sketch.** Show load → freeze → new head → optimizer on head params → train step.
7. **Pitfalls & Learning Footer.** Name the traps, then close with the **Learning Footer** (`AGENTS.md`).

## Output shape

```
Task + model: … | new class count = C
Load: resnet18(weights=ResNet18_Weights.DEFAULT)
Freeze: for p in model.parameters(): p.requires_grad = False
Head: model.fc = nn.Linear(model.fc.in_features, C)
Optimizer: optim.SGD(model.fc.parameters(), lr=…)   # head only
Learning Footer
```

## Tips

- Match the pretrained model's expected preprocessing (size, mean/std) or accuracy collapses.
- Feature-extract first (frozen backbone); unfreeze for full fine-tuning only with enough data and a low LR.
- The head attribute differs by architecture — `model.fc` (ResNet) vs `model.classifier` (VGG/DenseNet).
- End with the **Learning Footer** (`AGENTS.md`) so the learner knows the next step.
