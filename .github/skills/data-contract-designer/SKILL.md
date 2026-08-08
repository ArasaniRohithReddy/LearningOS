---
name: data-contract-designer
description: "Define a data contract between producers and consumers as a lesson — schema, semantics, SLAs, versioning, and enforcement — with explicit trade-offs. Use for 'data contract', 'schema contract', 'producer/consumer agreement', 'schema evolution / versioning', 'SLA on data', 'schema registry enforcement', or learning to decouple data producers from consumers."
argument-hint: "The interface + parties"
---

# Data Contract Designer

Design a data contract the reviewed way — schema → semantics → SLAs → versioning → enforcement —
following the teaching approach in [`AGENTS.md`](../../../AGENTS.md). Formalizes the interface behind
[`cdc-pipeline-coach`](../cdc-pipeline-coach/SKILL.md) and [`data-pipeline-designer`](../data-pipeline-designer/SKILL.md); registered in [`data-catalog-coach`](../data-catalog-coach/SKILL.md), verified by [`data-quality-checker`](../data-quality-checker/SKILL.md).

## When to use

- The learner needs a stable, owned interface between a data producer and its consumers.
- Deciding how schema changes roll out without breaking downstream jobs.

## Schema change compatibility (plan evolution)

| Change | Compatibility | Example |
| --- | --- | --- |
| Add optional field | backward | new nullable column |
| Remove/rename field | breaking | drop a column consumers read |
| Widen/narrow type | forward/breaking | int→long ok; string→int not |

## Procedure

1. **Name the parties** — the producing system/team and each consumer, plus the transport (topic/table/API).
2. **Pin the schema** — fields, types, nullability, keys; encode in Avro/Protobuf/JSON Schema.
3. **State semantics** — meaning, units, allowed values, PII class, and freshness — not just types.
4. **Set SLAs/SLOs** — freshness, completeness, availability; name who is paged when they're missed.
5. **Version explicitly** — semver + a compatibility mode (backward/forward/full); deprecate, don't surprise.
6. **Enforce in CI/registry** — a schema registry rejects incompatible changes before they ship.

## Output shape

```
Parties: producer → consumers | transport: topic/table
Schema: fields+types+nullability (Avro/Proto/JSON Schema)
Semantics: units, allowed values, PII, keys
SLAs: freshness … | completeness … | on-breach: page …
Versioning: semver + backward|forward|full
Enforcement: schema registry + CI check
```

## Tips

- A contract is semantics + SLAs, not just a schema — types alone don't say what the data *means*.
- Choose one compatibility mode up front; it dictates which changes are safe to ship unversioned.
- End with the **Learning Footer** (`AGENTS.md`).
