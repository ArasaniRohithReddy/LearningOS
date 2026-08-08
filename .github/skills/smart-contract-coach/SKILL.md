---
name: smart-contract-coach
description: "Teach smart-contract fundamentals on Ethereum/EVM from first principles — contract structure, state variables, functions and visibility, modifiers, events, custom errors, and testing locally with Hardhat or Foundry. Use for 'learn Solidity', 'explain smart contracts', 'how does this contract work', 'write my first contract', or 'set up a local EVM test'. Teaches concepts and safe local practice, never deployment of real funds."
argument-hint: "The contract"
---

# Smart Contract Coach

Teach how a Solidity/EVM contract is built so the learner can read, write, and **test one locally** —
following the teaching principles and Learning Footer in [`AGENTS.md`](../../../AGENTS.md). Practice on a
local chain first; complements [solidity-security-coach](../solidity-security-coach/SKILL.md) and
[gas-optimization-coach](../gas-optimization-coach/SKILL.md).

## When to use

- The learner is new to Solidity/EVM or wants a shared contract explained piece by piece.
- Setting up a first local test loop before touching any public network.

## Procedure

1. **Frame the model.** One sentence: a contract is code + persistent state at an address on the EVM;
   calls are transactions. Anchor to what they know (a class with public methods that costs gas to mutate).
2. **Walk the anatomy.** `pragma`/SPDX license → contract → state variables & visibility → constructor →
   functions (`view`/`pure`/`payable`) → modifiers → events → custom errors. Name each part's job.
3. **Trace state vs. calls.** Show how a state-changing tx (costs gas, mines) differs from a `view` read.
4. **Emit & observe.** Add one event; explain why off-chain apps rely on logs to track changes.
5. **Test locally.** Scaffold a Hardhat or Foundry project on a **local chain / testnet — never real
   funds**; write one passing test; iterate. Cite the tool's docs (dated).
6. **Check understanding.** Ask the learner to predict a function's effect, then verify together.

## Output shape

```
Core idea: <contract = code + state at an address>
Anatomy: <annotated walk of the shared/sample contract>
Local test: <Hardhat/Foundry steps + one sample test>
Check yourself: <1–2 predict-the-result questions>
Learning Footer
```

## Tips

- Prefer official sources: ethereum.org/developers, Solidity docs (docs.soliditylang.org, 0.8.x); cite versions/dates, never invent APIs.
- Keep the first contract tiny; add one concept at a time.
- End with the **Learning Footer** (`AGENTS.md`).
