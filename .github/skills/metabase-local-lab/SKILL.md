---
name: metabase-local-lab
description: "Hands-on lab on running Metabase (OSS) locally: connect a database and build a dashboard — free, local business intelligence with no subscription. Use for 'Metabase lab', 'build a dashboard locally', 'connect a DB', 'query builder', 'native SQL question', 'self-service BI', or learning BI by doing."
argument-hint: "The DB + dashboard question"
---

# Metabase Local Lab

A hands-on lab that stands up the open-source Metabase BI tool *locally* and turns SQL into a shareable
dashboard — following the teach-by-doing principles in [`AGENTS.md`](../../../AGENTS.md). Pairs with
[`sql-coach`](../sql-coach/SKILL.md), [`dataset-explorer`](../dataset-explorer/SKILL.md), and
[`dbt-duckdb-lab`](../dbt-duckdb-lab/SKILL.md) (model data, then chart it).

## When to use

- The learner wants a free BI tool running locally to explore a database and publish a dashboard.
- Practising self-service analytics without a paid cloud BI subscription.

## Procedure

1. **Concept first.** Metabase (OSS) is a self-service BI app: connect a database, ask **questions**
   (visual query builder or native SQL), and pin their charts to **dashboards** (Metabase docs, metabase.com/docs, 2024).
2. **Run locally (free/OSS).** `docker run -d -p 3000:3000 --name metabase metabase/metabase`
   (or `java -jar metabase.jar`); open `http://localhost:3000` and create the admin user.
3. **Exercise — connect a DB.** Add a data source — the built-in Sample Database, or your own Postgres/MySQL —
   and let Metabase sync the schema.
4. **Exercise — build a question.** Use the query builder to summarise/group a table and pick a
   visualization; or drop to native SQL for full control.
5. **Exercise — dashboard.** Save questions, add them to a new dashboard, and wire a filter/parameter to a column.
6. **Verify.** The dashboard renders and changing the filter updates every linked card.
7. **Pitfalls & Learning Footer.** Name the traps, then close with the **Learning Footer** (`AGENTS.md`).

## Output shape

```
App: Metabase OSS @ localhost:3000 (local, no subscription; Docker/JAR)
DB: <Sample / Postgres / MySQL> connected + synced
Question: group/aggregate (builder) or native SQL → chart
Dashboard: saved questions + linked filter
Verify: filter change updates all cards
Learning Footer
```

## Tips

- The default H2 application database is fine for a local lab; use Postgres as the app DB for anything real.
- Start in the query builder to learn the model, then drop to native SQL (see [`sql-coach`](../sql-coach/SKILL.md)) when you outgrow it.
- Load your [`dbt-duckdb-lab`](../dbt-duckdb-lab/SKILL.md) marts into a Metabase-supported DB (e.g., Postgres) to chart modeled data.
- End with the **Learning Footer** (`AGENTS.md`) so the learner knows the next step.
