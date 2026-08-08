---
name: opensearch-local-lab
description: "Hands-on OpenSearch lab — run the Apache-2.0 OpenSearch locally with Docker, free and offline, no subscription. Create an index with mappings, bulk-index JSON documents, run Query DSL searches, and explore results in OpenSearch Dashboards. Use for 'run OpenSearch locally', 'OpenSearch Docker lab', 'OpenSearch Dashboards Dev Tools', 'index documents and search', 'Elasticsearch open-source fork', or a hands-on lab for local search."
argument-hint: "The searchable corpus"
---

# OpenSearch Local Lab

Learn search on the fully open-source (Apache-2.0) fork of Elasticsearch — index, query, and visualize —
running **on your own machine**, per [`AGENTS.md`](../../../AGENTS.md).
Pairs with [elasticsearch-local-lab](../elasticsearch-local-lab/SKILL.md) and [database-selection-advisor](../database-selection-advisor/SKILL.md).

## When to use

- The learner wants a permissively licensed, local, free search engine plus a UI to explore data.
- Practising the same Query DSL as Elasticsearch without a source-available license.

## Mental model

- Same model as Elasticsearch — JSON **documents** in an **index** with a **mapping**, served over REST
  on **9200** — plus **OpenSearch Dashboards** on **5601**, whose **Dev Tools** console and **Discover**
  view let you run queries and browse hits without writing client code.

## Procedure

1. **Concept** — OpenSearch forked Elasticsearch 7.10 under **Apache 2.0**; it stores JSON documents in
   indices with mappings and ships **OpenSearch Dashboards** for exploration (opensearch.org, *About*, 2025).
2. **Run it locally** — Compose `opensearchproject/opensearch:2` (REST 9200) + `opensearch-dashboards:2`
   (UI 5601); set `discovery.type=single-node` and, since 2.12, a strong `OPENSEARCH_INITIAL_ADMIN_PASSWORD`.
3. **Create the index + mapping** — in Dashboards **Dev Tools**, `PUT /movies` with `mappings.properties` (e.g. `title: text`, `genre: keyword`).
4. **Index documents** — `PUT /movies/_doc/1 {json}` or the `_bulk` API; refresh to make them searchable.
5. **Exercise — query + visualize** — run `GET /movies/_search` with `match`/`bool` queries, then create an index pattern and browse hits in **Discover**.
6. ⚠ **Verify** — `GET /movies/_count` equals your inserts and the docs appear in Dashboards. Fully local, no subscription.

## Output shape

```
Run: docker compose up  → opensearch:9200 + dashboards:5601
Secure: discovery.type=single-node · OPENSEARCH_INITIAL_ADMIN_PASSWORD=…
Index: PUT /movies { mappings.properties: { title: text, genre: keyword } }
Ingest: PUT /movies/_doc/1 {…}  |  POST /_bulk
Query: GET /movies/_search { match | bool }  → Discover / Dev Tools
Verify: _count == inserts · hits visible at localhost:5601
```

## Tips

- API-compatible with older Elasticsearch — most `_search` Query DSL transfers straight across.
- ⚠ Keep the security plugin on and bind ports to `127.0.0.1` outside disposable labs.
- Compare the source-available original in [elasticsearch-local-lab](../elasticsearch-local-lab/SKILL.md); choose with [database-selection-advisor](../database-selection-advisor/SKILL.md). End with the **Learning Footer** (`AGENTS.md`).
