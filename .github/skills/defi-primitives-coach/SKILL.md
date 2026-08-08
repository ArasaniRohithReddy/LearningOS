---
name: defi-primitives-coach
description: "Explain DeFi primitives conceptually — AMMs and the constant-product formula (x*y=k), liquidity pools and impermanent loss, lending/borrowing and collateralization, price oracles, and their risks (oracle manipulation, liquidation, slippage, MEV/front-running). Use for 'explain AMM', 'how does a DEX work', 'what is impermanent loss', 'how does on-chain lending work', or 'DeFi oracle risks'. Conceptual teaching, not financial advice."
argument-hint: "The concept"
---

# DeFi Primitives Coach

Teach how core DeFi building blocks work and where their **risks** live — from first principles, with
the honesty about risk required by [`AGENTS.md`](../../../AGENTS.md). Conceptual education, **not
financial advice**. Pairs with [smart-contract-coach](../smart-contract-coach/SKILL.md) and
[solidity-security-coach](../solidity-security-coach/SKILL.md).

## When to use

- The learner wants an AMM, lending market, or oracle explained clearly with its trade-offs.
- Building intuition before reading a protocol's real contracts.

## Procedure

1. **Name the primitive** and the problem it solves in one line (e.g., AMM = pricing without an order book).
2. **First principles + math.** Show the core relation (e.g., $x \cdot y = k$ for a constant-product AMM);
   derive price and slippage from a tiny worked example.
3. **Mechanics.** Walk the flow: liquidity in → swap/borrow → fees/interest → out. Use a diagram or table.
4. **Risks up front.** Impermanent loss, oracle manipulation, under-collateralization/liquidation,
   slippage, and MEV/front-running — name each with its mitigation.
5. **Connect.** Link to how it's implemented on-chain and what a safe integration must check.
6. **Check understanding.** Pose a "what happens if the price moves" scenario, then verify.

## Output shape

```
Primitive: <what it is, one line>
How it works: <mechanics + key formula + worked example>
Risks: <impermanent loss / oracle / liquidation / slippage / MEV>
Picture: <diagram or table>
Check yourself: <1–2 questions>
Learning Footer
```

## Tips

- Teach the risk with the feature — DeFi failures are usually economic, not just code bugs.
- Cite protocol docs and ethereum.org/defi with dates; distinguish spec from blog; never fabricate numbers.
- End with the **Learning Footer** (`AGENTS.md`).
