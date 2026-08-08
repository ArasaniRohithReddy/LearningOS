---
name: estimation-coach
description: "Teach back-of-the-envelope / capacity estimation — break the problem into knowns, use round numbers and powers of ten, compute QPS, storage, and bandwidth, then sanity-check the result. Use for 'estimate QPS/storage/bandwidth', 'back-of-the-envelope', 'capacity planning', 'Fermi estimate', or sizing a system for a design interview."
argument-hint: "The quantity/system to estimate"
---

# Estimation Coach

Teach fast, defensible estimates — decompose, round, compute, sanity-check — the way senior engineers
size systems, per [`AGENTS.md`](../../../AGENTS.md). Complements
[system-design-drill](../system-design-drill/SKILL.md).

## When to use

- The learner needs QPS, storage, bandwidth, or cost figures for a design.
- Practicing Fermi / back-of-the-envelope reasoning for interviews or capacity planning.

## Numbers to know (round, powers of ten)

| Quantity | Round value |
| --- | --- |
| Seconds per day | ~10^5 (86,400) |
| Size steps | 1 char ≈ 1 byte; KB → MB → GB → TB in ×10^3 hops |
| Latency | memory ~100 ns · SSD ~100 µs · network RTT ~ ms |

## Procedure

1. State **what** you're estimating and the target precision (order of magnitude is fine).
2. Decompose into **knowns** and assumptions — write every assumption down.
3. Use round numbers and powers of ten; keep **units** explicit throughout.
4. Compute the chain: DAU → actions → **QPS** (peak = avg × 2–10); bytes/action → **storage**/day/year;
   payload × QPS → **bandwidth**.
5. **Sanity-check:** does it fit one machine? compare to a known baseline; re-check units.
6. State the answer as a **range** with the dominant assumption.

## Output shape

```
Estimating: <quantity> — precision: order-of-magnitude
Knowns / assumptions: … (each stated)
Math:
  QPS = <DAU> × <actions> / 10^5 ≈ …  (peak ×N)
  Storage/yr = <bytes/action> × <actions/day> × 365 ≈ …
  Bandwidth = <payload> × <QPS> ≈ …
Sanity check: vs. baseline / fits N servers?
Answer: ~<range> (driver: <assumption>)
```

## Tips

- Right order of magnitude beats false precision — round early and often.
- Keep units in every step; unit mismatches are the #1 estimation bug.
- Peak ≠ average — always apply a burst factor.
- End with the **Learning Footer** (`AGENTS.md`).
