---
name: cassandra-local-lab
description: "Hands-on lab: run Apache Cassandra locally with Docker — free, open-source, no subscription. Start the official cassandra image, create a keyspace and tables, run CQL, and learn partition keys with cqlsh. Use for 'Cassandra lab', 'run Cassandra locally', 'Cassandra in Docker', 'CQL practice', 'partition keys', 'local wide-column store no subscription', or learning distributed databases by doing."
argument-hint: "The wide-column data"
---

# Apache Cassandra Local Lab

Learn Cassandra by *running a real node locally* — free, open-source, no subscription — per
[`AGENTS.md`](../../../AGENTS.md). Pairs with [nosql-data-modeling](../nosql-data-modeling/SKILL.md) and [database-index-coach](../database-index-coach/SKILL.md).

## When to use

- The learner wants a disposable local Cassandra to practise CQL, keyspaces, and partitioning.
- Reinforcing query-first, wide-column modelling versus normalized relational design.

## Mental model

- Cassandra is a **distributed wide-column store**: rows group into **partitions** by the **partition
  key**, which decides placement and is the unit of fast lookup. You design tables *per query*, and
  `cqlsh` speaks CQL on TCP **9042** (Apache Cassandra docs, cassandra.apache.org, 2024).

## Procedure

1. **Concept:** the **partition key** must be in your `WHERE` clause — Cassandra is fast when you query
   by it and slow (or refused) otherwise. Model tables around reads, not entities.
2. **Run (Docker):** start the compose below; a fresh single node takes ~30–60s to accept CQL, so wait
   for `docker ps` to show it healthy *before* connecting.
3. **Connect:** `docker exec -it cs cqlsh` opens the CQL shell.
4. **Exercise:** `CREATE KEYSPACE shop WITH replication={'class':'SimpleStrategy','replication_factor':1};`
   then a table with `PRIMARY KEY ((user_id), created_at)`, `INSERT` rows, and a keyed `SELECT`.
5. **Verify:** `DESCRIBE KEYSPACE shop;` and a `SELECT` filtered by partition key return your rows.
6. ⚠ **Clean up:** `docker compose down` (add `-v` **only** when you truly want to delete the volume).

## Output shape

```
# compose.yaml
services:
  db:
    image: cassandra:5
    ports: ["127.0.0.1:9042:9042"]   # dev only — bound to localhost
    volumes: [cassdata:/var/lib/cassandra]
volumes: { cassdata: {} }

docker compose up -d && docker exec -it <container> cqlsh
# CREATE KEYSPACE … → CREATE TABLE … PRIMARY KEY ((pk), ck) → INSERT → SELECT
```

## Tips

- ⚠ Dev only: bind 9042 to `127.0.0.1`; a single-node lab is not a cluster — never treat it as prod.
- Never `ALLOW FILTERING` to "make a query work" — redesign the table around its partition key instead.
- End with the **Learning Footer** (`AGENTS.md`) — one access pattern to model + one partition key to choose yourself.
