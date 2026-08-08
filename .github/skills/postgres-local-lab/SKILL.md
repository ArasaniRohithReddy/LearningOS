---
name: postgres-local-lab
description: "Hands-on lab: run PostgreSQL locally with Docker — free, open-source, no subscription. Start the official postgres image, create a database, connect with psql, and run real SQL (DDL + queries). Use for 'PostgreSQL lab', 'run Postgres locally', 'Postgres in Docker', 'connect with psql', 'local Postgres no subscription', or learning relational databases by doing."
argument-hint: "The DB task"
---

# PostgreSQL Local Lab

Learn Postgres by *running a real server on your own machine* — free, no cloud, no subscription — per
[`AGENTS.md`](../../../AGENTS.md). Pairs with [sql-coach](../sql-coach/SKILL.md) and [database-index-coach](../database-index-coach/SKILL.md).

## When to use

- The learner wants a throwaway, local Postgres to practise SQL, schemas, and transactions.
- Reinforcing relational concepts before touching a managed cloud database.

## Mental model

- The **official `postgres` image** boots a full server; only `POSTGRES_PASSWORD` is required, and
  `POSTGRES_USER`/`POSTGRES_DB` default to `postgres` (Docker Official Image `postgres`,
  hub.docker.com, 2024). A named **volume** on `/var/lib/postgresql/data` keeps data across restarts.

## Procedure

1. **Concept:** Postgres is a client/server RDBMS listening on TCP **5432**; you talk to it with the
   `psql` client — no data leaves your laptop.
2. **Run (Docker):** start the compose below, then `docker ps` to confirm it is healthy *before* connecting.
3. **Connect:** `docker exec -it pg psql -U postgres` runs the client inside the container.
4. **Exercise:** `CREATE DATABASE shop;` then `\c shop`, create a `products` table, `INSERT` a few
   rows, and `SELECT` — read what each statement returns.
5. **Verify:** `\dt` lists your tables and `SELECT count(*) FROM products;` matches your inserts.
6. ⚠ **Clean up:** `docker compose down` (add `-v` **only** when you truly want to delete the volume).

## Output shape

```
# compose.yaml
services:
  db:
    image: postgres:16
    environment: { POSTGRES_PASSWORD: devpass, POSTGRES_DB: shop }
    ports: ["127.0.0.1:5432:5432"]   # dev only — bound to localhost
    volumes: [pgdata:/var/lib/postgresql/data]
volumes: { pgdata: {} }

docker compose up -d && docker exec -it <container> psql -U postgres -d shop
# CREATE TABLE … / INSERT … / SELECT … ;  →  \dt  →  docker compose down
```

## Tips

- ⚠ Dev only: bind the port to `127.0.0.1`, never expose 5432 publicly, and use a throwaway password.
- Data lives in the **volume**, not the container — `down -v` destroys it; omit `-v` to keep practising.
- End with the **Learning Footer** (`AGENTS.md`) — one table to model + one query to write yourself.
