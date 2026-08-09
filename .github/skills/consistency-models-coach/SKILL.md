---
name: consistency-models-coach
description: "Teach distributed-systems consistency for system design — the CAP theorem (and why 'pick 2' oversimplifies), PACELC, the consistency spectrum from linearizable to eventual, quorums (R + W > N) and tunable consistency, consensus (Raft/Paxos) at a conceptual level, and how to CHOOSE a model from a requirement. Use for 'CAP theorem', 'consistency models', 'eventual vs strong consistency', 'quorum', 'R + W > N', 'consensus Raft/Paxos', 'PACELC', 'read-your-writes', or 'which consistency level should I pick?'."
argument-hint: "The system/requirement (e.g. 'multi-region cart') + your current level"
---

# Consistency Models Coach

Consistency is a **requirements** conversation, not a database feature list: decide what an anomaly would
cost, then buy the weakest model that prevents it — per [`AGENTS.md`](../../../AGENTS.md).
Complements [system-design-drill](../system-design-drill/SKILL.md).

## When to use

- A design review asks "strong or eventual?" and the learner can only recite "CAP: pick two".
- Choosing a replication or quorum setting (Cassandra/DynamoDB/Cosmos/Mongo levels) and needing the *why*.
- Pairs with [caching-strategy-coach](../caching-strategy-coach/SKILL.md) and
  [sharding-strategy-coach](../sharding-strategy-coach/SKILL.md) — caches and shards are replication too.

> Conceptual by design. Named systems and their consistency levels change between versions — **verify every
> specific against that system's official documentation (with a date) before quoting it.**

## The consistency spectrum

Each row costs more latency and availability than the one below it. Examples are illustrative and
configurable — check the vendor docs.

| Model | Guarantee (plain English) | Cost / latency | Typical example |
|---|---|---|---|
| **Linearizable (strong)** | Every read sees the latest committed write; the system behaves like one copy in real time | Highest — cross-node coordination per operation; unavailable on the minority side of a partition | Consensus-backed stores (etcd, ZooKeeper); Spanner-style external consistency |
| **Sequential** | All nodes see writes in the *same* order, not necessarily real-time order | High, slightly cheaper than linearizable | Replicated state machines |
| **Causal** | Operations that are causally related are seen in order; concurrent ones may differ | Moderate — track causality (vector clocks / versions) | COPS-style stores; some cloud DB "session"/causal tiers |
| **Read-your-writes** | *You* always see your own writes (a session guarantee) | Low — sticky routing or a session token | Session consistency tiers; sticky read replicas |
| **Monotonic reads / writes** | Reads never go backwards in time; your writes apply in order | Low | Session guarantees layered on eventual stores |
| **Eventual** | If writes stop, replicas converge — no ordering promise meanwhile | Lowest — local read/write, best availability | Dynamo-style stores, CDNs, DNS |

## CAP, honestly

CAP (Brewer's conjecture; proved by Gilbert & Lynch, 2002) says: **when a network partition occurs**, a
system must sacrifice consistency (linearizability) or availability. "Pick 2 of 3" is misleading because
**partitions are not a design choice** — networks fail, so P is a given. The real choice is:
*what do we do during a partition?* And **PACELC** (Abadi, 2012) completes it:
**if Partition → A or C; Else → Latency or Consistency.** Even with a healthy network, replication makes
you trade latency against staleness — that's the trade you make every single day, not just during outages.

## Quorums, visually

With `N` replicas, `W` write acks and `R` read replies: if **R + W > N**, the read and write sets must
overlap on at least one replica, so a read is guaranteed to see the newest acknowledged write. Tuning
`R`/`W` moves you along the spectrum without changing the store.

```mermaid
sequenceDiagram
  participant C as Client
  participant Co as Coordinator
  participant R1 as Replica 1
  participant R2 as Replica 2
  participant R3 as Replica 3
  Note over C,R3: N = 3, W = 2, R = 2 — so R + W = 4 exceeds N, overlap guaranteed
  C->>Co: WRITE x = 5
  Co->>R1: replicate x=5
  Co->>R2: replicate x=5
  Co->>R3: replicate x=5 (may lag)
  R1-->>Co: ack
  R2-->>Co: ack
  Co-->>C: OK (W = 2 acks)
  C->>Co: READ x
  Co->>R2: read
  Co->>R3: read
  R2-->>Co: x = 5 (v2)
  R3-->>Co: x = 4 (v1, stale)
  Co-->>C: x = 5 (newest version wins; R3 read-repaired)
```

Common presets: `W=N, R=1` (fast reads, slow/fragile writes) · `W=1, R=N` (fast writes) ·
`W=R=⌈(N+1)/2⌉` (balanced majority quorum). With `R + W ≤ N` you are explicitly choosing eventual reads.

## Procedure

1. **Start from the requirement, never the database.** Ask what a stale or reordered read would actually
   *cost*: double-charging money, overselling the last item, a stale like count, a slightly old feed.
   Write the concrete anomaly down — it is the whole basis of the decision.
2. **Frame CAP correctly.** Partitions are given; the design question is the partition behavior
   (**CP**: refuse writes on the minority side, stay correct — **AP**: keep accepting writes, reconcile
   later). Then apply **PACELC** to name the *everyday* else-branch trade: latency vs. staleness.
3. **Place the requirement on the spectrum** (table above) and **pick the weakest model that prevents the
   anomaly**. Most "we need strong consistency" requests are satisfied by read-your-writes or causal
   consistency at a fraction of the latency.
4. **Translate it to a mechanism.** Choose the replication shape (single-leader, multi-leader,
   leaderless) and set `N` / `R` / `W`; show whether `R + W > N` holds and what that buys. Note conflict
   handling for AP designs: last-write-wins (lossy — clock-dependent), version vectors, or CRDTs.
5. **Add consensus only where you truly need a single order.** Conceptually, **Raft** and **Multi-Paxos** elect a
   **leader** that appends to a **replicated log**; an entry commits once a **majority** persists it, so the
   cluster survives `⌊(n-1)/2⌋` failures and stays correct — at the price of a round trip and no writes
   without a quorum. Use it for leader election, metadata, locks, and config — not for every hot-path write.
6. **Budget the cost.** Quantify the extra round trips (especially cross-region: an inter-continental RTT is
   tens to hundreds of ms), the availability floor during a partition, and the staleness window an eventual
   design leaves. Numbers turn an opinion into a design.
7. **Design for the anomalies you accepted.** Sticky sessions or a session token for read-your-writes,
   idempotency keys and monotonic tokens against reordering, read repair / anti-entropy for convergence,
   and a UI story for stale data (optimistic display, "syncing" state).
8. **Verify and cite.** Confirm the actual guarantee names and defaults in the chosen system's official
   docs — vendor terminology differs and defaults change between versions.

## Output shape

```
Requirement: <what the system must never do>
Cost of an anomaly: <stale read → …> | <reorder → …> | <lost update → …>
CAP framing: partition behavior = <CP: reject writes | AP: accept + reconcile> (why)
PACELC: if P → <A|C>; else → <L|C>   (everyday trade: <latency vs staleness>)
Chosen model: <linearizable|sequential|causal|read-your-writes|monotonic|eventual> — weakest that works
Mechanism: replication = <single-leader|multi-leader|leaderless> | N=<> R=<> W=<> | R+W>N? <yes/no>
Conflict handling: <LWW | version vectors | CRDT> (loss risk: …)
Consensus needed? <yes/no> — for <leader election|metadata|locks>; quorum tolerates <⌊(n-1)/2⌋> failures
Cost: <+? round trips, +? ms cross-region> | availability during partition: <…>
Anomalies accepted + mitigation: <sticky session | idempotency key | read repair | UI "syncing">
Verify in docs: <system + doc page + date>
```

## Tips

- "Pick 2 of 3" is the myth — partitions aren't optional, so CAP is really *"what do we do during one?"*
- Pick the **weakest** model that prevents the anomaly; strong consistency you didn't need is pure latency.
- Session guarantees (read-your-writes, monotonic reads) fix most perceived "eventual consistency bugs" cheaply.
- `R + W > N` gives overlap, **not** linearizability by itself — concurrent writes still need version reconciliation.
- Last-write-wins silently drops data when clocks skew; say so out loud before recommending it.
- Consensus needs a majority alive: an even-sized cluster buys no extra fault tolerance (use 3, 5, 7).
- Cite the system's official docs with a date; consistency-level names and defaults vary and change.
- Cross-link [caching-strategy-coach](../caching-strategy-coach/SKILL.md) and
  [sharding-strategy-coach](../sharding-strategy-coach/SKILL.md).
  End with the **Learning Footer** (`AGENTS.md`).
