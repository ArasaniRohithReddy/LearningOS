---
name: elasticsearch-local-lab
description: "Hands-on Elasticsearch lab — run Elasticsearch locally with Docker, free and offline, no cloud, no subscription. Create an index with explicit mappings, bulk-index JSON documents, then run Query DSL match/term/bool searches and aggregations. Use for 'run Elasticsearch locally', 'Elasticsearch Docker lab', 'index documents and mappings', 'Query DSL match vs term', 'full-text search tutorial', or a hands-on lab for local search."
argument-hint: "The searchable corpus"
---

# Elasticsearch Local Lab

Learn full-text search by running a real Elasticsearch node **on your own machine** — index, map, and
query — per [`AGENTS.md`](../../../AGENTS.md).
Pairs with [opensearch-local-lab](../opensearch-local-lab/SKILL.md) and [database-selection-advisor](../database-selection-advisor/SKILL.md).

## When to use

- The learner wants a local, free Lucene-based engine to practise mappings, analyzers, and Query DSL.
- Comparing full-text search against a datastore choice in [data-modeling-drill](../data-modeling-drill/SKILL.md).

## Mental model

- An **index** holds JSON **documents**, and the **mapping** gives each field a type + analyzer: `text`
  is tokenized and relevance-scored for full-text search, while `keyword` stays exact for filters, sorts,
  and aggregations — all served over REST on port **9200**, backed by an inverted index.

## Procedure

1. **Concept** — Elasticsearch stores JSON **documents** in an **index**; a **mapping** fixes field
   types and analyzers, and the inverted index powers relevance-ranked search (elastic.co, *Mapping*, 2025).
2. **Run it locally** — `docker run -p 9200:9200 -e discovery.type=single-node docker.elastic.co/elasticsearch/elasticsearch:8.16.0`;
   8.x enables security by default, so set `ELASTIC_PASSWORD` (or ⚠ dev-only `xpack.security.enabled=false`). AGPLv3 option added 2024.
3. **Create the index + mapping** — `PUT /books` with `mappings.properties` (e.g. `title: text`, `year: integer`); `text` is analyzed, `keyword` is exact.
4. **Index documents** — `PUT /books/_doc/1 {json}` for one, or the `_bulk` API (ndjson) for many; a `_refresh` makes them searchable.
5. **Exercise — query** — `GET /books/_search` with a `match` (analyzed) vs a `term` (exact) query, then combine in a `bool` and add an aggregation; compare `_score`.
6. ⚠ **Verify** — `GET /books/_count` matches your inserts and `GET /books/_mapping` shows expected types. Fully local, no cloud.

## Output shape

```
Run: docker run -p 9200:9200 -e discovery.type=single-node …elasticsearch:8.16.0
Index: PUT /books { mappings.properties: { title: text, year: integer } }
Ingest: PUT /books/_doc/1 {…}  |  POST /_bulk (ndjson)
Query: GET /books/_search { query: match | term | bool } (+ aggs)
Verify: _count == inserts · _mapping types correct · localhost:9200
```

## Tips

- `text` fields are analyzed (tokenized, lowercased) — add a `keyword` sub-field for exact match, sort, and facets.
- ⚠ Bind 9200 to `127.0.0.1` and keep security on outside throwaway labs; an open node is a classic breach.
- Same APIs as its Apache-2.0 fork — try [opensearch-local-lab](../opensearch-local-lab/SKILL.md); pick deliberately with [database-selection-advisor](../database-selection-advisor/SKILL.md). End with the **Learning Footer** (`AGENTS.md`).
