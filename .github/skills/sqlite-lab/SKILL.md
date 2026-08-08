---
name: sqlite-lab
description: "Hands-on lab: use SQLite locally — free, open-source, no subscription, no server, zero setup. Create a single-file database, define tables, and run SQL with the sqlite3 CLI (optionally in a container). Use for 'SQLite lab', 'run SQLite locally', 'embedded database', 'single-file database', 'sqlite3 practice', 'local database no subscription', or learning SQL with zero infrastructure."
argument-hint: "The lightweight DB"
---

# SQLite Lab

Learn SQLite by *creating a real database in a single file* — free, no server, no subscription — per
[`AGENTS.md`](../../../AGENTS.md). Pairs with [sql-coach](../sql-coach/SKILL.md) and [database-index-coach](../database-index-coach/SKILL.md).

## When to use

- The learner wants to practise SQL immediately with **zero setup** — no server, ports, or accounts.
- Prototyping a schema, or an app that needs an embedded, file-based database.

## Mental model

- SQLite is **serverless and embedded**: the whole database is one ordinary file, read and written
  in-process — no daemon, no port, no login (sqlite.org, *About SQLite*, 2024). That makes it the
  simplest place to learn SQL, and ideal for tests, CLIs, and local apps with a single writer.

## Procedure

1. **Concept:** unlike Postgres/MySQL there is **no server** — you open a file (`shop.db`) and SQL runs
   inside your own process. There is nothing to run, expose, or log in to.
2. **Run (no server):** install the official `sqlite3` CLI from sqlite.org, *or* run it inside the
   official `python` image (its bundled `sqlite3` module) for an isolated, throwaway toolchain.
3. **Connect:** `sqlite3 shop.db` — the prompt *is* your session; the file is created on first write.
4. **Exercise:** `CREATE TABLE products(...)`, `INSERT` rows, `SELECT`, then add an index and re-query;
   use `.schema` and `.tables` to inspect.
5. **Verify:** `.tables` lists your tables and the `shop.db` file now exists on disk with your data.
6. ⚠ **Clean up:** just delete the file — `Remove-Item shop.db` (no server or volume to tear down).

## Output shape

```
# No compose/server needed — SQLite is a single file.
sqlite3 shop.db          # official CLI (sqlite.org); or run inside the official `python` image

-- inside the sqlite3 prompt:
CREATE TABLE products(id INTEGER PRIMARY KEY, name TEXT, price REAL);
INSERT INTO products(name, price) VALUES ('pen', 1.5);
SELECT * FROM products;   .tables   .schema products   .quit
```

## Tips

- ⚠ Single-writer: SQLite allows one writer at a time — great for learning and local apps, not a high-concurrency web backend.
- Back up or version the `.db` file to save work; keep throwaway lab DBs in `.gitignore`, not in git.
- End with the **Learning Footer** (`AGENTS.md`) — one table to model + one index to add yourself.
