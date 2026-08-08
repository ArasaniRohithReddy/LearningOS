---
name: data-modeling-drill
description: "Practice data modeling end to end — turn requirements into an ER diagram (Mermaid) or a dimensional/star schema, choose keys and indexes, and normalize or denormalize with explicit trade-offs. Use for 'design a database schema', 'ER diagram', 'normalize this', 'star schema / data warehouse model', or learning relational vs. dimensional modeling."
argument-hint: "Domain/requirements + relational or dimensional"
---

# Data Modeling Drill

Practice modeling data the way it's done in review — requirements → entities → schema → keys/indexes →
trade-offs — following [`AGENTS.md`](../../../AGENTS.md). Complements
[system-design-drill](../system-design-drill/SKILL.md).

## When to use

- The learner needs reps turning a domain into a schema, with feedback.
- Choosing relational (OLTP) vs. dimensional (OLAP/warehouse) modeling.

## Relational vs. dimensional (pick the target)

| | Relational (3NF) | Dimensional (star) |
| --- | --- | --- |
| Optimized for | writes + integrity | reads + analytics |
| Shape | normalized entities | facts + dimensions |
| Trade-off | joins on read | duplicated, denormalized data |

## Procedure

1. Extract **entities, attributes, relationships** and cardinalities from the requirements.
2. Choose the target: normalize to 3NF for OLTP, or model facts/dimensions for OLAP.
3. Pick **keys** — natural vs. surrogate — and enforce integrity (FKs, uniqueness).
4. Draw the model in Mermaid `erDiagram`.
5. Plan **indexes** for the actual read patterns; note write cost and storage.
6. Decide any **denormalization** with the explicit trade-off (speed vs. update anomalies).

## Output shape

```
Entities & rules: … (cardinalities)
Target: relational-3NF | dimensional-star (why)
Diagram:
  ```mermaid
  erDiagram
    CUSTOMER ||--o{ ORDER : places
    ORDER ||--|{ LINE_ITEM : contains
  ```
Keys / indexes: PK/FK … ; indexes for <queries>
Normalization / denormalization trade-offs: …
```

## Tips

- Model for the query patterns you actually have, not hypothetical ones.
- Name normal-form violations (e.g., "transitive dependency → 3NF") so they're searchable.
- End with the **Learning Footer** (`AGENTS.md`).
