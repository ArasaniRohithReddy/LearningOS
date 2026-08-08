---
name: web3-integration-coach
description: "Teach connecting a dApp frontend to Ethereum — wallets (MetaMask / EIP-1193), providers and signers with ethers.js or viem, reading chain state (view calls), sending transactions and awaiting confirmations, handling chain IDs / network switching, and errors/reverts. Use for 'connect wallet', 'ethers vs viem', 'send a transaction from the frontend', 'read contract state in React', or 'integrate my dApp'. Teaches integration and safe local/testnet practice."
argument-hint: "The dApp"
---

# Web3 Integration Coach

Teach how a frontend talks to the chain so the learner can wire up a dApp safely — following the
teaching principles and Learning Footer in [`AGENTS.md`](../../../AGENTS.md). Test against a local
chain/testnet first. Pairs with [smart-contract-coach](../smart-contract-coach/SKILL.md) and
[auth-designer](../auth-designer/SKILL.md) (wallet sign-in ≠ backend session).

## When to use

- The learner has (or wants) a contract and needs the browser/wallet integration explained.
- Choosing ethers.js vs. viem, or debugging provider/signer/transaction flow.

## Procedure

1. **Map the pieces.** Provider (read) vs. signer (write); wallet via EIP-1193; the contract ABI + address.
2. **Connect a wallet.** Request accounts, read `chainId`, handle network switching and user rejection gracefully.
3. **Read state.** Call a `view` function through a provider — no gas, no signature; render the result.
4. **Send a transaction.** Build via the signer, `await tx.wait()` for confirmations; surface pending/failed states.
5. **Handle reality.** Reverts, gas estimation, and re-orgs; never trust client input — re-validate on-chain.
6. **Test locally.** Point at a **local chain / testnet — never real funds**; verify one read and one write.

## Output shape

```
Pieces: <provider / signer / ABI / address>
Connect: <wallet + chainId handling>
Read: <view call sample>
Write: <tx + wait + error handling>
Check yourself: <1–2 questions>
Learning Footer
```

## Tips

- Prefer official docs: ethers.js, viem, ethereum.org/developers, MetaMask (EIP-1193); cite versions/dates.
- A wallet connection is not authorization — validate on-chain; never fabricate an ABI.
- End with the **Learning Footer** (`AGENTS.md`).
