---
name: js-prototypes-lab
description: "A hands-on lab in JavaScript on prototypes and this — the prototype chain, delegation and inheritance, how class desugars to prototypes, and the four this binding rules (default/implicit/explicit/new) plus arrow-function lexical this. Use for 'prototypes lab', 'how does this work', 'prototype chain exercises', 'class vs prototype', or learning JS objects and inheritance by doing."
argument-hint: "The object/inheritance need"
---

# JS Prototypes & this Lab

Demystify prototypes and `this` by **inspecting the chain and rebinding `this` yourself** — following the
teach-by-doing principles and Learning Footer in [`AGENTS.md`](../../../AGENTS.md).

## When to use

- The learner wants to understand inheritance, `class` internals, and `this` binding hands-on.
- Reviewing OO code — see one solved in [`worked-example`](../worked-example/SKILL.md); check yours with [`code-review-coach`](../code-review-coach/SKILL.md).

## Procedure

1. **Concept, briefly.** Objects delegate to a **prototype** via `[[Prototype]]`; a lookup walks the chain
   until found or `null`. `class` is largely sugar over this (MDN, *Inheritance and the prototype chain*;
   `class` is ES2015, `#private` fields ES2022).
2. **Exercise 1 — walk the chain.** Build `{}`, inspect `Object.getPrototypeOf(obj)`, add a method on a
   prototype, and call it from an instance. Predict where the lookup stops.
3. **Exercise 2 — class ≡ prototype.** Write a `class Animal` with a method, then re-create it with a
   constructor function + `Animal.prototype.method`. Confirm they behave the same.
4. **Exercise 3 — the four this rules.** Call one function as `fn()`, `obj.fn()`, `fn.call(x)`, and
   `new fn()`; compare `this`. Then make an arrow method and show it ignores `call` (lexical `this`).
5. **Reference solution sketch.** `class` methods live on `.prototype`; `bind` fixes lost `this` in callbacks.
6. **Pitfalls.** Losing `this` when passing a method as a callback; arrow methods you can't rebind; forgetting `new`.

## Output shape

```
Chain: obj → Proto → Object.prototype → null (lookup walks up)
class ≡ constructor fn + Class.prototype.method
this rules: default · implicit(obj.fn) · explicit(call/bind) · new
Arrow: lexical this (ignores call/bind)
Pitfalls: lost this in callbacks · unbindable arrows · missing new
Your turn → <one inheritance/this exercise>
```

## Tips

- Prefer `Object.getPrototypeOf` over the legacy `__proto__` accessor when inspecting the chain.
- Reach for `class` for readability, but know it is prototypes underneath — that is what `this` follows.
- End with the **Learning Footer** (`AGENTS.md`).
