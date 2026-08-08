---
name: typesense-local-lab
description: "Hands-on Typesense lab — run the open-source (GPLv3) Typesense locally with Docker, free and offline, no subscription. Define a typed collection schema, import JSON documents, then run typo-tolerant search with query_by, filter_by, and facet_by faceting. Use for 'run Typesense locally', 'Typesense Docker lab', 'collection schema', 'query_by and facet_by', 'typo-tolerant faceted search', or a hands-on lab for local search."
argument-hint: "The searchable corpus"
---

# Typesense Local Lab

Learn schema-first, typo-tolerant search by running Typesense **on your own machine** — model, import,
and search — per [`AGENTS.md`](../../../AGENTS.md).
Pairs with [meilisearch-local-lab](../meilisearch-local-lab/SKILL.md) and [database-selection-advisor](../database-selection-advisor/SKILL.md).

## When to use

- The learner wants a local, free engine with an explicit typed schema and built-in faceting.
- Practising `query_by`/`facet_by` before wiring instant search into a UI.

## Mental model

- A **collection** has a typed **schema**; you search by naming fields in **`query_by`**, facet on fields
  flagged **`facet: true`**, and narrow with **`filter_by`** — all over REST on port **8108**, guarded by
  an API key. Typo-tolerance is built in, so near-miss spellings still match.

## Procedure

1. **Concept** — Typesense stores documents in a **collection** with a typed **schema**; you must name
   the fields to search (`query_by`) and mark fields `facet: true` to facet (typesense.org, *Guide*, 2025).
2. **Run it locally** — `docker run -p 8108:8108 -v ${PWD}/data:/data typesense/typesense:27.1 --data-dir /data --api-key=devKey`;
   GPLv3, no cloud. The API key gates every call.
3. **Create the collection** — `POST /collections` with a schema (e.g. `title: string`, `genre: string facet:true`, `year: int32`).
4. **Index documents** — `POST /collections/movies/documents/import?action=create` with JSONL (one document per line).
5. **Exercise — search + facet** — `GET /collections/movies/documents/search?q=intersteller&query_by=title` (typo still matches), then add `facet_by=genre` and `filter_by=year:>2000`.
6. ⚠ **Verify** — the search response `found` count and `facet_counts` look right. Fully local, no subscription.

## Output shape

```
Run: docker run -p 8108:8108 typesense/typesense:27.1 --api-key=devKey --data-dir /data
Schema: POST /collections { title:string, genre:string facet, year:int32 }
Ingest: POST /collections/movies/documents/import (JSONL)
Search: GET …/search?q=&query_by=title&filter_by=year:>2000&facet_by=genre
Verify: response.found + facet_counts correct · localhost:8108
```

## Tips

- Search fails unless `query_by` names at least one field; only `facet:true` fields can be faceted.
- Bulk-load with the JSONL `import` endpoint, not one POST per document, for speed.
- Compare settings-based filters in [meilisearch-local-lab](../meilisearch-local-lab/SKILL.md); choose with [database-selection-advisor](../database-selection-advisor/SKILL.md). End with the **Learning Footer** (`AGENTS.md`).
