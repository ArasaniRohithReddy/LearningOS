---
name: distributed-sql-coach
description: "Understand and evaluate distributed SQL / NewSQL engines — CockroachDB, Google Spanner, YugabyteDB — from the mechanism up: range sharding, one Raft group per range/tablet, leaseholders, TrueTime commit-wait versus hybrid logical clocks and uncertainty intervals, serializable versus strictly serializable, retry loops, hotspot primary keys, and the honest latency cost of surviving a region. Includes a hard 'when NOT to'. Use for 'CockroachDB vs Postgres', 'do we need Spanner', 'YugabyteDB', 'NewSQL', 'distributed SQL latency', 'TrueTime', 'hybrid logical clock', 'serialization failure 40001', 'multi-region database', or 'our primary key is a hotspot'."
argument-hint: "Workload (read/write mix, TPS, dataset size) + regions + survival goal (zone | region) + what single-node Postgres/MySQL currently fails at"
---

# Distributed SQL Coach

Distributed SQL buys you **survival and horizontal write scale, paid for in round trips**. This skill teaches
the machinery that makes that trade — consensus per range, clocks, and isolation — so you can tell whether the
trade is worth making, in the first-principles style required by [`AGENTS.md`](../../../AGENTS.md).

## When to use

- Someone proposed CockroachDB/Spanner/YugabyteDB and you need the mechanism, not the marketing.
- You must survive the loss of a whole region without data loss, with SQL semantics intact.
- Writes are already sharded by hand and the application is drowning in cross-shard consistency code.
- You are hitting `40001` serialization failures, hotspot primary keys, or surprising multi-region latency.
- **Don't use it for** application-level sharding of a single-node engine — that's
  [sharding-strategy-coach](../sharding-strategy-coach/SKILL.md); for analytics — see
  [data-warehouse-modeling](../data-warehouse-modeling/SKILL.md); or for picking a database category at all —
  [database-selection-advisor](../database-selection-advisor/SKILL.md).

## First principles: shard the keyspace, replicate each shard by consensus

A distributed SQL engine is three ideas stacked:

1. **Range (or tablet) sharding.** The sorted keyspace is cut into contiguous ranges that split and merge
   automatically as they grow, and are rebalanced across nodes. Contiguity is what preserves ordered scans and
   `BETWEEN` predicates — and it is also why a monotonically increasing key concentrates all writes on one range.
2. **One Raft group per range.** Each range is independently replicated (3 or 5 replicas) and independently
   available. Consensus is *per range*, not per cluster, which is where horizontal write scale comes from — see
   [consensus-explainer](../consensus-explainer/SKILL.md) for the protocol itself. CockroachDB adds a
   **leaseholder** per range that serves reads without a Raft round trip.
3. **A clock discipline** that lets transactions on different ranges be ordered.

```mermaid
flowchart TB
  subgraph KS["Sorted keyspace"]
    R1["range 1: users [a–f)"]
    R2["range 2: users [f–p)"]
    R3["range 3: users [p–z]"]
  end
  R1 --> G1["Raft group 1<br/>leader+leaseholder: N1<br/>followers: N2, N3"]
  R2 --> G2["Raft group 2<br/>leader+leaseholder: N2<br/>followers: N1, N3"]
  R3 --> G3["Raft group 3<br/>leader+leaseholder: N3<br/>followers: N1, N2"]
  G1 --> N1[("Node 1<br/>region us-east")]
  G2 --> N2[("Node 2<br/>region us-central")]
  G3 --> N3[("Node 3<br/>region us-west")]
  TX["Transaction touching users 'a…' and 'q…'"] -. "2 Raft groups ⇒ distributed commit" .-> G1
  TX -. .-> G3
```

*Each range is its own replicated state machine; a single-range transaction commits with one quorum round trip,
a multi-range one needs a distributed commit protocol on top.*

### Clocks: the actual difference between Spanner and its open-source cousins

| | **Spanner** (Corbett et al., OSDI 2012) | **CockroachDB** (SIGMOD 2020) | **YugabyteDB** |
| --- | --- | --- | --- |
| Clock | **TrueTime**: GPS + atomic clocks; `TT.now()` returns an *interval* `[earliest, latest]` with bounded uncertainty ε | **Hybrid logical clock** (Kulkarni et al., OPODIS 2014) + a configured max offset | hybrid logical clock |
| How ordering is enforced | **commit-wait**: the transaction waits out ε before its commit is visible | uncertainty interval: a read that sees a value inside its window restarts/refreshes | same idea as CockroachDB |
| Guarantee | **external consistency** (strict serializability) | **serializable**; single-key linearizable; *not* strictly serializable in general | serializable when you ask for it |
| Cost of the guarantee | a wait proportional to ε on every commit | occasional transaction restarts under contention | occasional restarts |
| Clock failure mode | hardware-backed ε; nodes that lose sync are evicted | exceeding max offset can violate guarantees ⇒ nodes self-terminate | same class of risk |

The 2012 Spanner paper reported ε in the single-digit milliseconds; ⚠ treat any specific ε, and any current
CockroachDB `--max-offset` default, as **verify on the current page** — these are tuned and re-published.

The practical consequence people miss: **serializable is not strictly serializable.** Serializable says the
outcome equals *some* serial order; strictly serializable additionally says that order respects real time. With
HLC-based engines, two transactions on disjoint keys, committed seconds apart by different clients, may be
ordered in a way that surprises an external observer. Spanner pays commit-wait to remove that surprise; the
others do not pay it, and document the difference.

### Isolation, and the retry loop you must write

| Engine | Default isolation | Other levels | Client obligation |
| --- | --- | --- | --- |
| CockroachDB | `SERIALIZABLE` | `READ COMMITTED` available in recent versions (verify for yours) | **retry on `40001`** |
| YugabyteDB YSQL | snapshot-based; `READ COMMITTED` maps to snapshot unless `yb_enable_read_committed_isolation` is on (verify on current docs) | Serializable, Snapshot, Read Committed | retry on `40001` |
| Spanner | external consistency for read-write transactions | stale/bounded-staleness reads | retry on aborted |
| Single-node PostgreSQL | `READ COMMITTED` | Repeatable Read, Serializable | retry only if you opt into Serializable |

Moving from PostgreSQL's default `READ COMMITTED` to a serializable engine changes your *application*: it will
now receive `ERROR: restart transaction … (SQLSTATE 40001)`, and the only correct response is to re-run the
whole transaction from the beginning. Compare semantics carefully with
[transaction-isolation-explainer](../transaction-isolation-explainer/SKILL.md).

## Procedure

1. **State the requirement that single-node cannot meet.** Write-throughput ceiling, dataset that exceeds one
   machine, or *survive losing a region with zero RPO*. If none of these is true, stop — a well-tuned single
   primary with replicas is faster, cheaper, and far simpler.
2. **Fix the survival goal**: zone-fault or region-fault survival. Region survival requires replicas in **3 or
   more regions**, and that requirement — not the product — sets your write latency floor.
3. **Compute the write latency floor** before benchmarking anything (see the worked example): a write costs one
   round trip from the leaseholder to the nearest replica that completes the quorum.
4. **Design the primary key against hotspots.** Sequential keys (`SERIAL`, `bigserial`, timestamp-prefixed) put
   every insert on one range. Prefer UUIDv4, a hash-prefixed key, or the engine's built-in
   (`gen_random_uuid()` / `unique_rowid()` in CockroachDB, hash-sharded primary keys in YugabyteDB).
5. **Run it locally, free**, and look at the ranges:
   ```bash
   # CockroachDB: a real 3-node cluster in one process, no licence, no cloud
   docker run --rm -it -p 26257:26257 -p 8080:8080 cockroachdb/cockroach:latest demo --nodes 3 --insecure
   ```
   ```sql
   CREATE TABLE users (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), email STRING UNIQUE, region STRING);
   SHOW RANGES FROM TABLE users;                 -- where each range lives and who holds the lease
   EXPLAIN ANALYZE SELECT * FROM users WHERE id = '…';   -- look for "network" / distribution in the plan
   ```
   ```bash
   # YugabyteDB alternative
   docker run --rm -d -p 5433:5433 -p 15433:15433 yugabytedb/yugabyte:latest \
     bin/yugabyted start --daemon=false --background=false
   ```
6. **Wrap every transaction in a retry loop** with jittered backoff on `40001`, and keep transactions short —
   long transactions in a serializable engine are contention amplifiers
   ([retry-backoff-coach](../retry-backoff-coach/SKILL.md)).
7. **Place data where it is read and written.** Geo-partitioning is the only real cure for cross-region write
   latency:
   ```sql
   ALTER DATABASE app SET PRIMARY REGION "us-east1";
   ALTER DATABASE app ADD REGION "europe-west1";
   ALTER TABLE users SET LOCALITY REGIONAL BY ROW;      -- each row homed in its own region
   SELECT * FROM users AS OF SYSTEM TIME follower_read_timestamp();  -- local, slightly stale reads
   ```
8. **Load-test the contention profile, not the throughput headline** — hot rows, secondary-index writes, and
   multi-range transactions are where distributed SQL diverges most from single-node intuition
   ([k6-load-test-lab](../k6-load-test-lab/SKILL.md)).
9. **Price it**: nodes × regions × egress × licence, against the cost of the failure you are buying insurance
   for. Then decide, record the decision as an ADR, and close with the **Learning Footer**.

## Output shape

```
Requirement single-node cannot meet: <write scale | dataset size | region survival | none ⇒ STOP>
Survival goal: <zone | region>   Regions: <list + pairwise RTT matrix>
Candidate: <CockroachDB | Spanner | YugabyteDB | stay single-node + replicas>
Sharding: range/tablet · replicas=<3|5> · quorum=<2|3> · leaseholder reads=<yes/no>
Clock model: <TrueTime commit-wait | HLC + uncertainty interval>   Guarantee: <strict serializable | serializable>
Isolation in use: <SERIALIZABLE | READ COMMITTED>  Retry loop on 40001 implemented: <yes/no>
Write latency floor: <RTT to quorum-completing replica> = <ms>   Measured p99 write: <ms>
Hotspot check: PK = <uuid | sequential ❌ | hash-sharded>   SHOW RANGES skew: <balanced | hot range>
Locality plan: <REGIONAL BY ROW | GLOBAL | none>   Follower reads used for: <queries>
Cost: <nodes × regions × $>   vs cost of the failure avoided: <$>
Verdict: <adopt | not yet — cheaper fix is X>
Next: <consensus-explainer | transaction-isolation-explainer | sharding-strategy-coach>
Learning Footer
```

## Worked example — what surviving a region actually costs, in milliseconds

Three regions, replication factor 3, one replica per region. Measured round-trip times:

| | us-east | us-central | us-west |
| --- | --- | --- | --- |
| **us-east** | — | 30 ms | 60 ms |
| **us-central** | 30 ms | — | 40 ms |
| **us-west** | 60 ms | 40 ms | — |

A write commits when a **majority (2 of 3)** has durably appended it. The leaseholder is one of the two, so it
needs exactly **one** remote acknowledgement — the fastest one:

- Leaseholder in **us-central**: min(30, 40) = **30 ms** per write, plus local fsync and execution.
- Leaseholder in **us-east**: min(30, 60) = **30 ms**.
- Leaseholder in **us-west**: min(40, 60) = **40 ms**.

So the *best case* for region survival on this topology is ~30 ms per commit — meaning **at most ~33
sequential commits per second per connection**, however fast your hardware is. Compare with the same cluster
inside one region (three zones, RTT ≈ 1 ms): ~1 ms per commit, ~1000 sequential commits/s per connection. The
factor of 30 is not a product weakness; it is the speed of light and the definition of a quorum.

Now check the 5-replica variant, because the intuition "more replicas = safer = slower" is only half right.
With 5 replicas across 5 regions at RTTs of 20, 30, 40, 60, 80 ms from the leaseholder, quorum is 3 — the
leaseholder plus **two** remotes — so latency is the **second**-nearest: 30 ms, not 80 ms. Adding replicas
raises fault tolerance from 1 to 2 regions while raising latency only from 20 ms to 30 ms here. Quorum latency
is governed by the *k*-th nearest replica, not the farthest — a useful and frequently mis-taught fact
(the same maths as [consensus-explainer](../consensus-explainer/SKILL.md)).

**The mitigation that actually works** is not tuning; it is placement. With `REGIONAL BY ROW`, a European
user's rows are homed in `europe-west1` and their writes commit against European replicas at local RTT, while
still surviving the loss of that region because copies exist elsewhere. And an application that batches 50
inserts into one transaction pays 30 ms once rather than 50 × 30 ms = 1.5 s — batch size is the single
highest-leverage application change in a multi-region deployment.

**When NOT to adopt distributed SQL:**

| Situation | Cheaper answer |
| --- | --- |
| Dataset fits on one machine (still true for the majority of OLTP systems) | tuned PostgreSQL/MySQL + read replicas |
| Single-region, latency-sensitive writes | single primary; a quorum can only be slower |
| Analytics, wide scans, aggregation | a columnar engine ([clickhouse-local-lab](../clickhouse-local-lab/SKILL.md), [duckdb-lab](../duckdb-lab/SKILL.md)) |
| Heavy dependence on engine extensions (e.g. PostGIS) or exotic SQL | stay on the engine that has them |
| Small keyspace with extreme contention on a few rows | redesign the contention away first — distribution makes contention *worse* |
| The real problem is "our schema/index is bad" | [database-index-coach](../database-index-coach/SKILL.md), [query-plan-tuning-lab](../query-plan-tuning-lab/SKILL.md) |

## Tips

- Consensus per range is the whole scaling story: N ranges = N independent Raft groups = writes that scale with
  nodes. A single hot range scales with nothing.
- Sequential primary keys are the number-one performance defect in these engines — they turn a distributed
  cluster into one very expensive node.
- Serializable engines *will* abort your transactions. If your code has no retry loop on `40001`, you have a
  correctness bug that will surface exactly under load.
- Keep transactions short and touching as few ranges as possible; a multi-range transaction pays a distributed
  commit and holds locks across the network.
- Follower/stale reads (`AS OF SYSTEM TIME`) are the cheap win: most read traffic tolerates a few seconds of
  staleness — reason about it with [consistency-models-coach](../consistency-models-coach/SKILL.md).
- These engines are MVCC systems with garbage collection, like PostgreSQL — old versions accumulate under long
  transactions ([mvcc-vacuum-explainer](../mvcc-vacuum-explainer/SKILL.md)).
- Try Spanner semantics for free with [gcp-spanner-emulator-lab](../gcp-spanner-emulator-lab/SKILL.md); size the
  cluster with [capacity-planning-coach](../capacity-planning-coach/SKILL.md) and the connection budget with
  [connection-pooling-coach](../connection-pooling-coach/SKILL.md); record the choice with
  [adr-writer](../adr-writer/SKILL.md). Cite the Spanner (OSDI 2012) and CockroachDB (SIGMOD 2020) papers by
  name when you teach this, and end with the **Learning Footer** (`AGENTS.md`).
