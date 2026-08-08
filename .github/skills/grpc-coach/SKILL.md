---
name: grpc-coach
description: "Design gRPC services with Protocol Buffers as a lesson — messages and field numbers, the four RPC/streaming types, wire compatibility and versioning, deadlines and status codes, and when gRPC beats REST. Use for 'design a gRPC service', 'protobuf schema', 'gRPC streaming', 'proto backward compatibility', 'gRPC vs REST', or learning contract-first RPC."
argument-hint: "The service"
---

# gRPC Coach

Teach contract-first RPC so the learner reasons about the wire format, streaming, and compatibility — per
[`AGENTS.md`](../../../AGENTS.md). Complements [api-design-review](../api-design-review/SKILL.md).

## When to use

- Internal, low-latency, polyglot, or streaming service-to-service calls where a typed contract pays off.
- Pairs with [graphql-schema-coach](../graphql-schema-coach/SKILL.md) and [message-queue-coach](../message-queue-coach/SKILL.md).

## Procedure

1. **Define messages in protobuf** — model request/response messages and pick stable **field numbers**;
   the number, not the name, is the wire identity (Protocol Buffers proto3 guide, protobuf.dev).
2. **Design the service & RPC type** — choose per method: **unary**, **server-streaming**, **client-streaming**,
   or **bidirectional streaming** over HTTP/2 (grpc.io); stream only when the payload is naturally a sequence.
3. **Plan for compatibility** — add fields as optional, never reuse or renumber a tag, and `reserved` retired
   ones; proto3 has no required fields and unset scalars read as defaults, so absence is ambiguous.
4. **Handle errors & deadlines** — use gRPC status codes (not HTTP 200/500 mapping), always set a client
   **deadline**, and pass cross-cutting data in metadata.
5. **Version deliberately** — package/namespace your protos; prefer additive evolution and a new method over
   breaking a shipped one; keep the `.proto` as the single source of truth in a shared repo.
6. **Decide gRPC vs REST** — gRPC for internal high-throughput/streaming; REST/JSON for public, browser, and
   human-debuggable APIs. Bridge with grpc-web or a gateway when browsers must call in.

## Output shape

```
service OrderSvc {
  rpc GetOrder(GetOrderReq) returns (Order);            // unary
  rpc WatchOrders(WatchReq) returns (stream OrderEvent); // server-stream
}
message Order { string id = 1; Money total = 2; reserved 3; }
Compat: add-only, no renumber, reserved … | deadline: 2s | codes: NOT_FOUND …
Choice: gRPC (why) vs REST (why)
```

## Tips

- Cite protobuf.dev and grpc.io with dates; field numbers and proto3 defaults are contract rules, not style.
- Breaking change #1 is reusing a field tag — treat retired numbers as permanently `reserved`.
- End with the **Learning Footer** (`AGENTS.md`).
