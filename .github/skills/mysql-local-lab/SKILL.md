---
name: mysql-local-lab
description: "Hands-on lab: run MySQL locally with Docker — free, open-source, no subscription. Start the official mysql image, create a schema, connect with the mysql client, and run DDL and queries. Use for 'MySQL lab', 'run MySQL locally', 'MySQL in Docker', 'connect to MySQL', 'local MySQL no subscription', or learning relational databases by doing."
argument-hint: "The DB task"
---

# MySQL Local Lab

Learn MySQL by *running a real server locally* — free, no cloud, no subscription — per
[`AGENTS.md`](../../../AGENTS.md). Pairs with [sql-coach](../sql-coach/SKILL.md) and [database-index-coach](../database-index-coach/SKILL.md).

## When to use

- The learner wants a disposable local MySQL to practise schemas, joins, and indexes.
- Reinforcing relational fundamentals before using a managed cloud database.

## Mental model

- The **official `mysql` image** requires `MYSQL_ROOT_PASSWORD`; `MYSQL_DATABASE` auto-creates a schema
  and `MYSQL_USER`/`MYSQL_PASSWORD` make a non-root account (Docker Official Image `mysql`,
  hub.docker.com, 2024). A named **volume** on `/var/lib/mysql` persists data across restarts.

## Procedure

1. **Concept:** MySQL is a client/server RDBMS on TCP **3306**; the `mysql` CLI is your client, and here
   a *schema* and a *database* are the same thing.
2. **Run (Docker):** start the compose below, then `docker ps` to confirm it is healthy *before* connecting.
3. **Connect:** `docker exec -it my mysql -uroot -p` (enter the password) — no host install needed.
4. **Exercise:** `CREATE DATABASE shop;` `USE shop;` create a `customers` table, `INSERT` rows, then
   `SELECT` and a two-table `JOIN` — read each result set.
5. **Verify:** `SHOW TABLES;` and `DESCRIBE customers;` match what you created.
6. ⚠ **Clean up:** `docker compose down` (add `-v` **only** when you truly want to delete the volume).

## Output shape

```
# compose.yaml
services:
  db:
    image: mysql:8
    environment: { MYSQL_ROOT_PASSWORD: devpass, MYSQL_DATABASE: shop }
    ports: ["127.0.0.1:3306:3306"]   # dev only — bound to localhost
    volumes: [mysqldata:/var/lib/mysql]
volumes: { mysqldata: {} }

docker compose up -d && docker exec -it <container> mysql -uroot -p shop
# CREATE TABLE … / INSERT … / SELECT … ;  →  SHOW TABLES;  →  docker compose down
```

## Tips

- ⚠ Dev only: bind 3306 to `127.0.0.1`, never expose it publicly, and use a throwaway root password.
- Prefer utf8mb4 and InnoDB (defaults in MySQL 8) so text and transactions behave as learners expect.
- End with the **Learning Footer** (`AGENTS.md`) — one schema to design + one JOIN to write yourself.
