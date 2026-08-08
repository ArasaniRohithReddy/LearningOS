---
name: java-generics-lab
description: "Hands-on Java lab on generics: write generic classes and methods with type parameters, apply bounded wildcards using PECS (Producer Extends, Consumer Super), and understand type erasure and its runtime limits. Use for 'teach me Java generics', 'hands-on generics lab', 'bounded wildcards', 'what is PECS', '? extends vs ? super', 'type erasure', or practicing generic API design for reusable, type-safe code."
argument-hint: "The reusable API"
---

# Java Generics Lab

Learn generics by designing a reusable, type-safe API yourself — a guided, hands-on lab following the
teaching principles and Learning Footer in [`AGENTS.md`](../../../AGENTS.md).

## When to use
- The learner wants to *understand* type parameters, wildcards, and erasure by writing generic code.
- Reinforcing type-safe API design for **Coding Mentor** or a Java role-agent.

## Procedure
**Concept (60s):** a type parameter `<T>` lets one class/method work over many types with compile-time
safety; wildcards widen what callers may pass; erasure removes types at runtime (JLS §4.5–§4.6, Java 5+).

1. **Parameterize:** write `Box<T>` with `set(T)`/`get()`; note no casts are needed by callers.
2. **Generic method:** add `static <T> T firstOf(List<T> xs)`; the `<T>` is inferred at the call site.
3. **Bound it:** constrain with `<T extends Comparable<T>>` so you can call `compareTo` inside.
4. **Apply PECS:** a `copy(dest, src)` reads from `? extends T` (producer) and writes to `? super T` (consumer).
5. **Hit erasure:** try `new T[n]` or `x instanceof List<String>` and see why the compiler refuses.

**Reference sketch:**
```java
// PECS: Producer Extends, Consumer Super (Effective Java, Bloch)
static <T> void copy(List<? super T> dest, List<? extends T> src) {
    for (T item : src) dest.add(item);        // read T out of src, write T into dest
}
static <T extends Comparable<T>> T max(List<? extends T> xs) {   // bounded + producer
    T best = xs.get(0);
    for (T x : xs) if (x.compareTo(best) > 0) best = x;
    return best;
}
```
**Pitfalls:** using a bare `List` (raw type) and losing safety; `List<Object>` where you meant
`List<?>`; expecting `List<String>.class` (erasure forbids it); `new T[]`; assuming `List<Dog>` is a
subtype of `List<Animal>` (it is not — use `? extends`).

## Output shape
```
Concept: <T> = compile-time safety; wildcards widen; erasure limits runtime
Steps 1–5: <generic API you built + why>; PECS applied; erasure limit hit
Check: no raw types? producer extends / consumer super? bounds enable the call?
```

## Tips
- Predict which wildcard each parameter needs *before* compiling — PECS becomes muscle memory (Socratic).
- Shape the API with [`oop-design-coach`](../oop-design-coach/SKILL.md); drill more via [`practice-generator`](../practice-generator/SKILL.md).
- End with the **Learning Footer** (`AGENTS.md`).
