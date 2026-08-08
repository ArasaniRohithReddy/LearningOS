---
name: load-balancing-coach
description: "Design load balancing from first principles: L4 vs L7, algorithms (round-robin, least-connections, hashing), health checks, session affinity/stickiness, TLS termination, and failover. Use for 'design a load balancer', 'L4 vs L7', 'which LB algorithm', 'health checks', 'sticky sessions', or scaling a service across replicas."
argument-hint: "The service + traffic"
---

# Load Balancing Coach

Teach how to spread traffic across replicas reliably — the trade-offs, not just a config — per the
teaching approach and Learning Footer in [`AGENTS.md`](../../../AGENTS.md).

## When to use

- The learner is scaling a service horizontally or choosing a load-balancing strategy.
- Grounding failover and health checking before DNS (GSLB) or networking topics.

## Mental model

A load balancer is a **reverse proxy** that sends each request/connection to a **healthy** backend.
**L4** routes by IP:port (fast, opaque); **L7** parses HTTP (host/path/header — smarter, TLS-aware).

## Procedure

1. **Clarify traffic.** Protocol (HTTP/gRPC/TCP), stateful vs stateless, RPS, latency goals.
2. **Pick the layer.** L4 for raw TCP/UDP throughput; L7 for path/host routing, retries, TLS termination.
3. **Choose an algorithm.** Round-robin (uniform), least-connections (uneven durations), hash/IP-hash (affinity), weighted (mixed capacity).
4. **Health checks.** Active probes + passive ejection; define healthy/unhealthy thresholds so bad backends drain.
5. **Affinity.** Prefer stateless + shared session store; use stickiness only when forced — it skews balance.
6. **Failover.** Redundant LBs, cross-zone spread, connection draining on deploy. End with the **Learning Footer**.

## Output shape

```
Traffic: <proto, stateful?, RPS/latency>
Layer: L4 (IP:port) vs L7 (HTTP) → <choice + why>
Algorithm: <round-robin / least-conn / hash / weighted> — <reason>
Health: <probe path, thresholds, draining>
Affinity: <none / sticky — trade-off>
Failover: <redundant LBs, cross-zone>
```

## Tips

- Stateless backends scale best — push session state to a store, not the LB.
- Health checks are the safety net; tune them before chasing a fancier algorithm.
- Pair with `dns-coach` (GSLB) and `networking-fundamentals-coach`; end with the **Learning Footer** (`AGENTS.md`).
