---
name: redis-local-lab
description: "Hands-on lab: run Redis locally with Docker — free, no subscription. Start the official redis image and practise strings, hashes, and lists, set TTLs, and model a cache with redis-cli. Use for 'Redis lab', 'run Redis locally', 'Redis in Docker', 'redis-cli practice', 'TTL and caching', 'local cache no subscription', or learning key-value stores by doing."
argument-hint: "The cache/data"
---

# Redis Local Lab

Learn Redis by *running a real in-memory store locally* — free, no cloud, no subscription — per
[`AGENTS.md`](../../../AGENTS.md). Pairs with [caching-strategy-coach](../caching-strategy-coach/SKILL.md) and [nosql-data-modeling](../nosql-data-modeling/SKILL.md).

## When to use

- The learner wants a disposable local Redis to practise data types, TTLs, and cache patterns.
- Reinforcing when a cache helps — and when it silently serves stale data.

## Mental model

- Redis is an **in-memory key-value store**: data lives in RAM for microsecond access, with optional
  persistence (RDB snapshots / AOF) to survive restarts (redis.io/docs, 2024). Values are **typed** —
  strings, hashes, lists, sets — and any key can carry a **TTL** so it expires automatically.

## Procedure

1. **Concept:** Redis serves on TCP **6379**; `redis-cli` is your client. Treat it as a fast cache in
   front of a slower source of truth, not the source itself.
2. **Run (Docker):** start the compose below, then `docker ps` to confirm it is healthy *before* connecting.
3. **Connect:** `docker exec -it rd redis-cli` → `PING` should return `PONG`.
4. **Exercise:** `SET user:1 alice`, `HSET user:1:profile name alice`, `LPUSH recent 1 2 3`, then
   `EXPIRE user:1 30` and watch `TTL user:1` count down.
5. **Verify:** `GET`, `HGETALL`, `LRANGE recent 0 -1` return your data; the key vanishes after its TTL.
6. ⚠ **Clean up:** `docker compose down` (add `-v` **only** when you truly want to delete the volume).

## Output shape

```
# compose.yaml
services:
  cache:
    image: redis:7
    command: ["redis-server", "--appendonly", "yes"]
    ports: ["127.0.0.1:6379:6379"]   # dev only — bound to localhost
    volumes: [redisdata:/data]
volumes: { redisdata: {} }

docker compose up -d && docker exec -it <container> redis-cli
# SET k v → EXPIRE k 30 → TTL k → GET k → docker compose down
```

## Tips

- ⚠ Dev only: bind 6379 to `127.0.0.1` — an open Redis with no auth is a well-known attack target.
- A cache needs an expiry/eviction story: set TTLs and pick a `maxmemory-policy` — see [caching-strategy-coach](../caching-strategy-coach/SKILL.md).
- End with the **Learning Footer** (`AGENTS.md`) — one key to model + one TTL to reason about yourself.
