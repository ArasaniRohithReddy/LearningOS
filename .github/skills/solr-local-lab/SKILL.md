---
name: solr-local-lab
description: "Hands-on Apache Solr lab — run the open-source (Apache-2.0) Solr locally with Docker, free and offline, no subscription. Create a core, define or auto-guess a schema, index JSON documents, then run Lucene queries with filters and faceting. Use for 'run Apache Solr locally', 'Solr Docker lab', 'create a core', 'managed schema fields', 'Solr query and facet', or a hands-on lab for local search."
argument-hint: "The searchable corpus"
---

# Apache Solr Local Lab

Learn the classic Lucene search server by running Solr **on your own machine** — core, schema, and query —
per [`AGENTS.md`](../../../AGENTS.md).
Pairs with [elasticsearch-local-lab](../elasticsearch-local-lab/SKILL.md) and [database-selection-advisor](../database-selection-advisor/SKILL.md).

## When to use

- The learner wants a local, free, mature Lucene engine with an Admin UI and rich faceting.
- Comparing Solr's core/schema model against Elasticsearch's index/mapping.

## Mental model

- A **core** is one Lucene index plus its config; a **schema** (explicit fields, or schemaless field
  guessing) types each document, and documents become searchable only after a **commit**. You query with
  Lucene syntax over port **8983**, and the built-in **Admin UI** lets you inspect cores and run queries.

## Procedure

1. **Concept** — Solr serves search from a **core** (an index + config); a **schema** defines field
   types, or schemaless mode guesses them on first ingest (solr.apache.org, *Reference Guide 9*, 2024).
2. **Run it locally** — `docker run -p 8983:8983 solr:9 solr-precreate books` starts Solr (Apache 2.0) and
   pre-creates a core; the Admin UI is at `http://localhost:8983/solr`.
3. **Define the schema** — add fields via the Schema API (`POST /solr/books/schema` with `add-field`), or let schemaless mode infer types.
4. **Index documents** — `POST /solr/books/update?commit=true` with a JSON array; `commit=true` makes them searchable.
5. **Exercise — query + facet** — `GET /solr/books/select?q=title:dune&fq=year:[2000 TO *]&facet=true&facet.field=genre`; read `numFound` and `facet_counts`.
6. ⚠ **Verify** — `select?q=*:*` returns your document count and the Admin UI lists the core. Fully local.

## Output shape

```
Run: docker run -p 8983:8983 solr:9 solr-precreate books   (Admin UI /solr)
Schema: POST /solr/books/schema { add-field: {name,type,…} }  | or schemaless
Ingest: POST /solr/books/update?commit=true  (JSON array)
Query: GET /solr/books/select?q=&fq=&facet=true&facet.field=genre
Verify: numFound == inserts · core in Admin UI · localhost:8983
```

## Tips

- Documents stay invisible until a **commit** — pass `commit=true` (or `softCommit`) after loading.
- Schemaless mode is convenient for learning, but define field types explicitly for anything real.
- Contrast the JSON Query DSL in [elasticsearch-local-lab](../elasticsearch-local-lab/SKILL.md); pick with [database-selection-advisor](../database-selection-advisor/SKILL.md). End with the **Learning Footer** (`AGENTS.md`).
