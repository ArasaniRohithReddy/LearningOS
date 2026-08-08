---
name: gas-optimization-coach
description: "Teach EVM gas optimization without sacrificing safety — storage vs. memory vs. calldata, struct/variable packing, caching storage reads in memory, minimizing SSTOREs, loop costs, custom errors over require strings, immutable/constant, and how to MEASURE gas with Hardhat or Foundry. Use for 'reduce gas', 'optimize this contract', 'why is this so expensive', 'gas profiling', or 'make my Solidity cheaper'. Measure before and after; never trade away correctness."
argument-hint: "The contract"
---

# Gas Optimization Coach

Teach where EVM gas goes and how to cut it **without weakening safety** — following the teaching
principles and Learning Footer in [`AGENTS.md`](../../../AGENTS.md). Always measure, don't guess.
Pairs with [solidity-security-coach](../solidity-security-coach/SKILL.md) (never optimize away a check)
and [smart-contract-coach](../smart-contract-coach/SKILL.md).

## When to use

- The learner wants a contract to cost less gas and to understand *why* each change helps.
- Comparing before/after on a **local chain / testnet — no real funds** needed to measure.

## Procedure

1. **Measure first.** Get a baseline with `forge test --gas-report` or a Hardhat gas reporter; name the
   hot path. Optimization without a number is a guess.
2. **Storage dominates.** Explain SLOAD/SSTORE cost; cache storage reads in memory; pack
   variables/structs into fewer 32-byte slots; prefer `calldata` for external read-only args.
3. **Trim the loop.** Cache `array.length`, avoid repeated storage writes inside loops, batch where safe.
4. **Cheaper idioms.** Custom errors vs. long `require` strings; `immutable`/`constant` for fixed values.
5. **Re-measure & guard.** Show the delta; confirm tests still pass and no safety check was removed.

## Output shape

```
Baseline: <gas per hot path>
Change → why → savings:
  - Pack struct fields → 2 slots → −Xk gas
  - Cache storage read in memory → −Xk gas
After: <new gas> (tests still green, safety intact)
Learning Footer
```

## Tips

- Never remove a validation to save gas; correctness beats cost.
- Cite sources: Solidity docs (docs.soliditylang.org) and EVM opcode gas costs; note versions/dates.
- End with the **Learning Footer** (`AGENTS.md`).
