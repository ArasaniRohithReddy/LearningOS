---
name: graphql-schema-coach
description: "Design a GraphQL schema as a lesson — types and fields, queries/mutations/subscriptions, resolvers, the N+1 problem and DataLoader batching, cursor connections, nullability, and additive versioning. Use for 'design a GraphQL schema', 'GraphQL resolvers', 'N+1 dataloader', 'GraphQL pagination', 'schema versioning', or learning GraphQL API design."
argument-hint: "The API/domain"
---

# GraphQL Schema Coach

Teach schema-first GraphQL so the learner reasons about the graph, resolver cost, and evolution — per
[`AGENTS.md`](../../../AGENTS.md). Complements [api-design-review](../api-design-review/SKILL.md).

## When to use

- Clients need flexible, typed queries over related data, or REST over/under-fetching is hurting them.
- Pairs with [api-pagination-coach](../api-pagination-coach/SKILL.md) and [grpc-coach](../grpc-coach/SKILL.md).

## Procedure

1. **Model the graph** — define object types, scalars, enums, and interfaces/unions from the domain, plus
   how types connect (edges). Schema is the contract (GraphQL Spec, spec.graphql.org, 2021).
2. **Design operations** — `Query` for reads, `Mutation` for writes (name them by intent, return the changed
   entity + errors), `Subscription` for realtime. Keep mutations coarse and transactional.
3. **Plan resolvers** — one resolver per field; map fields to data sources and note which are expensive so
   the graph doesn't hide N database round-trips.
4. **Kill N+1 with DataLoader** — nested resolvers fire per-parent queries; batch and per-request cache them
   with a DataLoader keyed by id (graphql/dataloader). This is the single biggest GraphQL performance trap.
5. **Paginate with connections** — use cursor-based `edges`/`pageInfo` (Relay Connections) and guard cost
   with query depth/complexity limits to prevent abusive queries.
6. **Evolve additively** — GraphQL has no URL versions; add fields, mark old ones `@deprecated`, and design
   nullability deliberately (a non-null field that errors nulls its whole parent).

## Output shape

```
Types: User, Order, … | interfaces/unions …
Query: … | Mutation: createX(input): XPayload | Subscription: …
Resolvers: field → source (expensive: …)
N+1: DataLoader(userById) batch+cache
Pagination: Connection(edges,pageInfo) | limits: depth/complexity
Evolution: add fields, @deprecated(reason) | nullability …
```

## Tips

- Cite the GraphQL spec, graphql.org, and DataLoader with dates; don't invent directives or type behavior.
- REST vs GraphQL vs gRPC is a trade-off — match it to callers (see [tech-comparison](../tech-comparison/SKILL.md)).
- End with the **Learning Footer** (`AGENTS.md`).
