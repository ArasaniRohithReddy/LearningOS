---
name: java-streams-lab
description: "Hands-on Java lab on the Streams API: build a map/filter/reduce/collect pipeline, understand lazy intermediate vs. eager terminal operations, use Collectors (toList, groupingBy), and avoid pitfalls like reusing a consumed stream or mutating shared state. Use for 'teach me Java streams', 'hands-on streams lab', 'map filter reduce collect', 'why is my stream lazy', 'Collectors.groupingBy', or practicing java.util.stream by building pipelines."
argument-hint: "The data transform"
---

# Java Streams Lab

Learn the Streams API by building a pipeline yourself — a guided, hands-on lab following the teaching
principles and Learning Footer in [`AGENTS.md`](../../../AGENTS.md).

## When to use
- The learner wants to *understand* `map`/`filter`/`reduce`/`collect` and laziness by writing pipelines.
- Reinforcing functional data transforms for **Coding Mentor** or a Java role-agent.

## Procedure
**Concept (60s):** a `Stream` is a lazy pipeline over a source; *intermediate* ops (`map`, `filter`)
build the plan and *terminal* ops (`collect`, `reduce`) run it once (java.util.stream, Java 8, 2014).

1. **Source it:** start from `list.stream()`; note a stream is single-use, not a data structure.
2. **Filter then map:** keep matching elements, then transform each — order affects work done.
3. **Prove laziness:** add `.peek(System.out::println)` and see nothing prints until a terminal op runs.
4. **Reduce:** fold with `reduce(0, Integer::sum)`; the accumulator must be associative and stateless.
5. **Collect richer:** replace the loop below with `Collectors.groupingBy` to bucket by a key.

**Reference sketch:**
```java
import java.util.*; import java.util.stream.*;

Map<Boolean, List<Integer>> byEven = IntStream.rangeClosed(1, 10).boxed()
    .filter(n -> n > 2)                       // intermediate: lazy
    .collect(Collectors.partitioningBy(n -> n % 2 == 0));  // terminal: runs the pipeline
int sumOfSquares = Stream.of(1, 2, 3).map(n -> n * n).reduce(0, Integer::sum);  // 14
```
**Pitfalls:** reusing a terminated stream (`IllegalStateException`); side effects in `map`/`peek`;
non-associative reducers; `forEach` when you meant `collect`; boxing in hot loops — prefer `IntStream`.

## Output shape
```
Concept: lazy pipeline, terminal op triggers work
Steps 1–5: <pipeline you built + why>; final collector/reducer
Check: single-use respected? intermediate lazy? reducer associative + stateless?
```

## Tips
- Predict what `peek` prints before running it — laziness becomes obvious (Socratic).
- Work one transform fully with [`worked-example`](../worked-example/SKILL.md); drill more via [`practice-generator`](../practice-generator/SKILL.md).
- End with the **Learning Footer** (`AGENTS.md`).
