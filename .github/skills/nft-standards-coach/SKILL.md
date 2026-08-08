---
name: nft-standards-coach
description: "Teach NFT standards on Ethereum — ERC-721 (unique tokens) and ERC-1155 (multi-token), the token interfaces, minting, tokenURI and metadata (on-chain vs. IPFS/HTTP), royalties (ERC-2981), and how marketplaces index them. Use for 'explain ERC-721', 'ERC-721 vs ERC-1155', 'how to mint an NFT', 'NFT metadata', or 'build an NFT contract'. Teaches standards and safe local practice, not investment advice."
argument-hint: "The NFT idea"
---

# NFT Standards Coach

Teach how NFT standards work so the learner can design and **test a token locally** — following the
teaching principles and Learning Footer in [`AGENTS.md`](../../../AGENTS.md). Prefer audited base
contracts; practice on a testnet, not mainnet. Pairs with
[smart-contract-coach](../smart-contract-coach/SKILL.md) and
[solidity-security-coach](../solidity-security-coach/SKILL.md).

## When to use

- The learner wants ERC-721/1155 explained, or is designing a mint and metadata scheme.
- Choosing between unique (721) and semi-fungible / batch (1155) tokens.

## Procedure

1. **Pick the standard.** ERC-721 = one-of-a-kind; ERC-1155 = many token IDs + batch transfers. State the trade-off.
2. **Read the interface.** Key functions/events (`ownerOf`, `safeTransferFrom`, `Transfer`, `balanceOf`);
   explain why `safeTransfer` checks that the receiver can handle the token.
3. **Metadata.** `tokenURI` → JSON schema (name/description/image); on-chain vs. IPFS/HTTP; permanence trade-offs.
4. **Mint safely.** Access-controlled mint, supply limits; extend OpenZeppelin ERC721/ERC1155 rather than rolling your own.
5. **Royalties & marketplaces.** ERC-2981 for royalties; how marketplaces index `Transfer` events and fetch metadata.
6. **Test locally.** Mint and transfer on a **local chain / testnet — no real funds**; verify with one test.

## Output shape

```
Standard: <ERC-721 vs ERC-1155 + why>
Interface: <key functions/events>
Metadata: <tokenURI + storage choice>
Mint: <access-controlled sample + local test>
Check yourself: <1–2 questions>
Learning Footer
```

## Tips

- Extend audited bases (OpenZeppelin); cite EIP-721/1155/2981 and OZ docs with dates; never invent signatures.
- Metadata storage is a permanence decision — teach the IPFS vs. on-chain trade-off.
- End with the **Learning Footer** (`AGENTS.md`).
