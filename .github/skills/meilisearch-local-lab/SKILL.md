---
name: meilisearch-local-lab
description: "Hands-on Meilisearch lab — run the open-source (MIT) Meilisearch locally with Docker, free and offline, no subscription. Create an index, add JSON documents, and run instant search with built-in typo-tolerance, filters, and facets. Use for 'run Meilisearch locally', 'Meilisearch Docker lab', 'instant search as-you-type', 'typo tolerance', 'filterable attributes and facets', or a hands-on lab for local search."
argument-hint: "The searchable corpus"
---

# Meilisearch Local Lab

Learn fast, typo-tolerant search by running Meilisearch **on your own machine** — index, search, filter —
per [`AGENTS.md`](../../../AGENTS.md).
Pairs with [typesense-local-lab](../typesense-local-lab/SKILL.md) and [database-selection-advisor](../database-selection-advisor/SKILL.md).

## When to use

- The learner wants the simplest local, free engine for instant, forgiving as-you-type search.
- Adding a search box to an app before reaching for a heavier Lucene stack.

## Mental model

- An **index** is a set of JSON **documents** sharing one **primary key**; Meilisearch ranks with a
  tunable rules pipeline and **typo-tolerance on by default**, serving search over REST on port **7700**.
  Writes are asynchronous — each returns a **task** you poll until `succeeded`.

## Procedure

1. **Concept** — Meilisearch indexes JSON documents and returns ranked hits in milliseconds, with
   **typo-tolerance** and prefix search **on by default**; writes are async **tasks** (meilisearch.com, *Quick start*, 2025).
2. **Run it locally** — `docker run -p 7700:7700 getmeili/meilisearch:v1.11 meilisearch --master-key="devMasterKey"`;
   MIT-licensed, no cloud. The master key gates the API.
3. **Create an index** — `POST /indexes` with `{ "uid": "movies", "primaryKey": "id" }`; each document needs a unique primary key.
4. **Index documents** — `POST /indexes/movies/documents` with a JSON array; poll `/tasks/{uid}` until the enqueued task is `succeeded`.
5. **Exercise — search + filter** — `POST /indexes/movies/search {"q":"intersteller"}` (the typo still matches), then set `filterableAttributes` and re-query with `filter` and `facets`.
6. ⚠ **Verify** — `GET /indexes/movies/stats` shows `numberOfDocuments`; misspelled queries still return the right hit. Fully local.

## Output shape

```
Run: docker run -p 7700:7700 getmeili/meilisearch:v1.11 --master-key=…
Index: POST /indexes { uid: movies, primaryKey: id }
Ingest: POST /indexes/movies/documents (JSON array) → task → succeeded
Search: POST /indexes/movies/search { q, filter, facets }
Settings: filterableAttributes = [ genre, year ]  (before filtering)
Verify: /stats numberOfDocuments · typo still matches · localhost:7700
```

## Tips

- Filtering needs `filterableAttributes` set **first**; querying an unconfigured field errors.
- Writes are asynchronous — always check the returned **task** status instead of assuming success.
- Compare schema-first faceting in [typesense-local-lab](../typesense-local-lab/SKILL.md); pick a store with [database-selection-advisor](../database-selection-advisor/SKILL.md). End with the **Learning Footer** (`AGENTS.md`).
