---
name: dns-coach
description: "Teach DNS and troubleshoot it: record types (A/AAAA/CNAME/MX/TXT/NS), the recursive resolution flow, TTL/caching, and diagnosing propagation and lookup failures with dig/nslookup. Use for 'how does DNS work', 'DNS not resolving', 'what is a CNAME', 'MX records', 'DNS propagation', or fixing a name-resolution problem."
argument-hint: "The DNS task or problem"
---

# DNS Coach

Teach DNS as the internet's phone book — the resolution path and caching — then diagnose failures
methodically, per the teaching approach and Learning Footer in [`AGENTS.md`](../../../AGENTS.md).

## When to use

- The learner wants to understand DNS, or a lookup/propagation is failing.
- Grounding name resolution before load balancing (GSLB) or TLS (hostname/SNI) topics.

## Mental model

A name resolves through a **hierarchy** — root → TLD → authoritative — and resolvers **cache** each
answer for its **TTL**. That cache is why record changes appear to "propagate" slowly (RFC 1034/1035).

## Procedure

1. **Clarify goal.** New record, a migration, or a failing lookup? Get the exact name + expected value.
2. **Records.** A/AAAA (IP), CNAME (alias), MX (mail), TXT (SPF/verification), NS (delegation).
3. **Resolution flow.** Stub → recursive resolver → root → TLD → authoritative → cached answer.
4. **TTL & caching.** Lower the TTL *before* a change; expect stale answers until the old TTL expires.
5. **Diagnose.** `dig +trace <name>`; query the authoritative server directly (`dig @ns <name>`); check the resolver cache.
6. **Verify.** Confirm from multiple resolvers and watch the TTL count down. End with the **Learning Footer**.

## Output shape

```
Goal: <add / migrate / debug>  name=<fqdn>
Record: <A/CNAME/MX/TXT>  expected=<value>
Flow: stub → resolver → root → TLD → authoritative
Cache: TTL=<n> → propagation window
Check: dig +trace <name> ; dig @<authoritative> <name>
```

## Tips

- Lower the TTL a day *before* migrating a record to shrink the propagation window.
- A CNAME can't coexist with other records at the same name (never at the zone apex).
- Pair with `linux-command-coach` for `dig`/`nslookup`; end with the **Learning Footer** (`AGENTS.md`).
