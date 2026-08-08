---
name: data-catalog-coach
description: "Stand up a data catalog and lineage as a lesson — technical + business metadata, ownership, searchable discovery, and column-level lineage for governance — with explicit trade-offs. Use for 'data catalog', 'data lineage', 'column-level lineage', 'metadata management', 'data discovery / ownership', 'OpenLineage / DataHub', or learning data governance."
argument-hint: "The data estate"
---

# Data Catalog Coach

Build a catalog the reviewed way — metadata → ownership → discovery → lineage → governance —
following the teaching approach in [`AGENTS.md`](../../../AGENTS.md). Consumes assets from
[`data-pipeline-designer`](../data-pipeline-designer/SKILL.md); enforces the interfaces from [`data-contract-designer`](../data-contract-designer/SKILL.md) and gates in [`data-quality-checker`](../data-quality-checker/SKILL.md).

## When to use

- The learner needs to make a sprawling data estate discoverable, owned, and traceable.
- Establishing lineage so an incident or column change can be traced end to end.

## Metadata types (what the catalog stores)

| Type | Examples | Why it matters |
| --- | --- | --- |
| Technical | schema, types, partitions | discovery + validation |
| Business | definitions, owners, terms | trust + shared meaning |
| Operational | freshness, run status, volume | reliability + SLAs |

## Procedure

1. **Inventory sources** — DBs, warehouse, lakehouse tables, dashboards, and pipeline jobs.
2. **Harvest metadata** — ingest technical + operational metadata into a catalog (DataHub/OpenMetadata/Amundsen).
3. **Assign ownership** — every asset gets a human/team owner and a business definition (glossary terms).
4. **Capture lineage** — emit run events with OpenLineage; aim for column-level, not just table-level.
5. **Enable discovery** — searchable UI + tags/domains so consumers self-serve without pinging producers.
6. **Govern** — classify PII/sensitivity, wire access policies, and link contracts + quality checks to assets.

## Output shape

```
Estate: sources … | catalog: DataHub | OpenMetadata (why)
Metadata: technical + business + operational
Ownership: asset → owner/team + glossary term
Lineage: OpenLineage events, column-level
Flow: source → job → table → mart → dashboard (traced)
Discovery: search + domains/tags
Governance: PII class, access policy, contract link
```

## Tips

- Column-level lineage is what makes impact analysis real — table-level only tells half the story.
- Automate harvesting from pipelines; a hand-maintained catalog goes stale within weeks.
- End with the **Learning Footer** (`AGENTS.md`).
