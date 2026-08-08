---
name: trino-local-lab
description: "Hands-on lab on running Trino locally with Docker: federated SQL that joins across multiple data sources with one engine — free, local, OSS, and no subscription. Use for 'Trino lab', 'federated query', 'join Postgres and files', 'query engine', 'tpch catalog', 'connectors', or learning distributed SQL by doing."
argument-hint: "The sources to federate"
---

# Trino Local Lab

A hands-on lab that runs the Trino query engine *locally in Docker* and joins across data sources with
one SQL statement — following the teach-by-doing principles in [`AGENTS.md`](../../../AGENTS.md).
Pairs with [`sql-coach`](../sql-coach/SKILL.md), [`data-pipeline-designer`](../data-pipeline-designer/SKILL.md),
and (embedded contrast) [`duckdb-lab`](../duckdb-lab/SKILL.md).

## When to use

- The learner wants to **join across multiple sources** (e.g., Postgres + built-in data) with one ANSI-SQL engine.
- Learning federated / MPP query concepts locally before touching a real cluster.

## Mental model

- Trino is a distributed SQL **query engine**, not storage: a *coordinator* plans, *workers* execute, and
  **connectors** expose each source as a `catalog.schema.table` you can join across (Trino docs, *Trino concepts*, trino.io, 2024).

## Procedure

1. **Concept first.** Separate the engine from the data: connectors + catalogs make many sources look like one database.
2. **Run locally (Docker, free/OSS).** `docker run --name trino -d -p 8080:8080 trinodb/trino`; the image ships
   example catalogs including `tpch` (Trino docs, *Trino in a Docker container*, trino.io, 2024).
3. **Exercise — first query.** `docker exec -it trino trino`, then `SELECT count(*) FROM tpch.sf1.nation;`;
   open the web UI at `http://localhost:8080`.
4. **Exercise — add a source.** Mount a catalog file at `/etc/trino/catalog/pg.properties`
   (`connector.name=postgresql` + JDBC URL/creds) so a Postgres DB appears as catalog `pg`.
5. **Exercise — federate.** `SELECT … FROM pg.public.orders o JOIN tpch.sf1.customer c ON …` — one query
   spanning two sources.
6. **Verify.** `SHOW CATALOGS;` lists both, and the cross-source join returns rows.
7. **Pitfalls & Learning Footer.** Name the traps, then close with the **Learning Footer** (`AGENTS.md`).

## Output shape

```
Engine: Trino (Docker) @ localhost:8080 (local, OSS, no subscription)
Catalogs: tpch (built-in) + pg (postgresql connector)
Connect: docker exec -it trino trino
Federate: SELECT … FROM pg.public.t JOIN tpch.sf1.u ON …
Verify: SHOW CATALOGS · cross-source join returns rows
Learning Footer
```

## Tips

- Reference tables fully qualified as `catalog.schema.table`; use `SHOW CATALOGS/SCHEMAS/TABLES` to explore.
- Trino computes, it does not store — pushdown-friendly filters keep connector reads cheap.
- ⚠ `docker rm -f trino` deletes the container; only catalogs mounted from a volume persist across it.
- End with the **Learning Footer** (`AGENTS.md`) so the learner knows the next step.
