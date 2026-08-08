---
name: java-collections-lab
description: "Hands-on Java lab on the Collections Framework: choosing between List/Set/Map implementations (ArrayList vs. LinkedList, HashSet vs. TreeSet, HashMap vs. TreeMap), the equals/hashCode contract that makes hash-based collections work, and safe iteration/removal. Use for 'teach me Java collections', 'hands-on collections lab', 'ArrayList vs LinkedList', 'why override equals and hashCode', 'ConcurrentModificationException', or practicing java.util collections."
argument-hint: "The data structure"
---

# Java Collections Lab

Learn the Collections Framework by choosing and testing structures yourself — a guided, hands-on lab
following the teaching principles and Learning Footer in [`AGENTS.md`](../../../AGENTS.md).

## When to use
- The learner wants to *understand* which `List`/`Set`/`Map` to pick and why `equals`/`hashCode` matter.
- Reinforcing data-structure trade-offs for **Coding Mentor** or a Java role-agent.

## Procedure
**Concept (60s):** interfaces (`List`, `Set`, `Map`) name a contract; implementations trade ordering,
duplicates, and Big-O. Hash structures rely on the `equals`/`hashCode` contract (java.util, Java 8+).

1. **Pick by contract:** need order+duplicates → `List`; uniqueness → `Set`; keyed lookup → `Map`.
2. **Pick by cost:** `ArrayList` (O(1) index) vs. `LinkedList`; `HashMap` (O(1) avg) vs. `TreeMap` (sorted).
3. **Break a HashSet:** add a value object with no `hashCode` override — watch duplicates slip in.
4. **Honor the contract:** override both so equal objects share a hash code (`Object` docs, JLS).
5. **Iterate safely:** remove during a loop via `Iterator.remove()`, not `list.remove()` in a for-each.

**Reference sketch:**
```java
record Point(int x, int y) {}          // records auto-generate equals/hashCode (Java 16, 2021)

Set<Point> seen = new HashSet<>();
seen.add(new Point(1, 2)); seen.add(new Point(1, 2));  // size 1: value equality works
Iterator<Point> it = seen.iterator();
while (it.hasNext()) if (it.next().x() == 1) it.remove();  // safe structural removal
```
**Pitfalls:** overriding `equals` but not `hashCode` (lost lookups); mutating a key after insertion;
`list.remove(int)` vs. `remove(Object)` overload confusion; modifying a collection during a for-each
(`ConcurrentModificationException`); assuming `HashMap` preserves insertion order (use `LinkedHashMap`).

## Output shape
```
Concept: interface = contract; implementation = trade-off
Steps 1–5: <structure chosen + why>; equals/hashCode override; safe removal
Check: contract honored? iteration mutation safe? ordering assumption correct?
```

## Tips
- Predict the `Set` size before running step 3 — the contract failure is visible (Socratic).
- Model value objects with [`oop-design-coach`](../oop-design-coach/SKILL.md); drill more via [`practice-generator`](../practice-generator/SKILL.md).
- End with the **Learning Footer** (`AGENTS.md`).
