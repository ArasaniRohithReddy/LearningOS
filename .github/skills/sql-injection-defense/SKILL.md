---
name: sql-injection-defense
description: "Prevent SQL and NoSQL injection as a lesson — parameterized queries/prepared statements, safe ORM usage, input validation and allow-listing, and least-privilege DB accounts, with minimal vulnerable-vs-fixed examples. DEFENSIVE only. Use for 'is this query safe', 'prevent SQL injection', 'parameterized queries', 'NoSQL injection', 'sanitize input', or 'fix injection in this code'."
argument-hint: "The code/query + stack"
---

# SQL Injection Defense

**Prevent injection** by separating code from data — parameterize, validate, and least-privilege —
teaching each fix from first principles per [`AGENTS.md`](../../../AGENTS.md). Pairs with
[secure-code-review](../secure-code-review/SKILL.md) and [owasp-top10-explainer](../owasp-top10-explainer/SKILL.md).

## When to use

- The learner builds database queries from input and wants to confirm they're injection-safe.
- Fixing a flagged injection risk, or learning the defense across SQL and NoSQL.

## Defense (layer → control)

| Layer | Control | Example |
| --- | --- | --- |
| Query construction | Parameterized / prepared statements | Bind values, never concatenate |
| ORM/ODM | Safe query builders | Avoid raw string interpolation |
| Identifiers | Allow-list table/column/sort names | Map input to a fixed set |
| Input | Validate type/length/format | Reject unexpected; canonicalize |
| Database | Least-privilege account | No DDL/admin for the app user |

## Procedure

1. Find every place input reaches a query (SQL, NoSQL, ORM raw); confirm the code is the learner's.
2. Replace string-built queries with **parameterized** statements/bind variables — the primary defense.
3. For dynamic identifiers (columns, ORDER BY) that can't be bound, allow-list against a fixed set.
4. Validate and canonicalize input by type/length/format; for NoSQL, reject operator objects in user fields.
5. Run the app under a least-privilege DB account; add a test asserting malicious input is treated as data.
6. Show the vulnerable-vs-fixed pair; map to OWASP Top 10 A03:2021 and the Injection Prevention Cheat Sheet.

## Output shape

```
Where input meets query: <sinks> | Stack: …
Vulnerable (for understanding): <minimal concatenated query>
Fixed: <parameterized/bound version> — principle: code ≠ data
Extra layers: allow-list identifiers, validate input, least-privilege DB
Tests: injection-as-data regression | Ref: OWASP A03:2021
```

## Tips

- Parameterization is the fix; input filtering alone is a fragile band-aid, not a defense.
- Bind values and allow-list identifiers — never concatenate untrusted strings into a query.
- Least privilege caps the damage; end with the **Learning Footer** (`AGENTS.md`).
