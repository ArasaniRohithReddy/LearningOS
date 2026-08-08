---
name: cryptography-basics-coach
description: "Apply cryptography correctly as a lesson — hashing vs encryption, symmetric vs asymmetric, password hashing with argon2/bcrypt/scrypt, authenticated encryption, and why you must not roll your own. DEFENSIVE only. Use for 'how should I hash passwords', 'encrypt vs hash', 'symmetric vs asymmetric', 'which algorithm', 'is MD5/SHA-1 ok', or 'don't roll your own crypto'."
argument-hint: "The use case"
---

# Cryptography Basics Coach

Use **cryptography** for the right job — hashing vs encryption, symmetric vs asymmetric, safe password
storage — with vetted libraries, per [`AGENTS.md`](../../../AGENTS.md). Pairs with
[auth-designer](../auth-designer/SKILL.md) and [secure-code-review](../secure-code-review/SKILL.md).

## When to use

- The learner must protect data (store passwords, encrypt, verify integrity) and needs the right primitive.
- Reviewing crypto choices for weak algorithms, or learning the concepts from first principles.

## Goal → primitive

| Goal | Primitive | Safe choice |
| --- | --- | --- |
| Verify integrity / fingerprint | Hash | SHA-256 (not MD5/SHA-1) |
| Store passwords | Slow password hash | argon2id / bcrypt / scrypt + salt |
| Confidentiality (shared key) | Symmetric AEAD | AES-256-GCM / ChaCha20-Poly1305 |
| Key exchange / signatures | Asymmetric | RSA-2048+, ECDSA / Ed25519 |
| Random tokens | CSPRNG | OS/library secure RNG, not `rand()` |

## Procedure

1. State the goal (integrity, confidentiality, authentication) and threat; confirm the use case is the learner's.
2. Pick the matching primitive from the table; reach for a **vetted library**, never a custom scheme.
3. For passwords, use a slow salted hash (argon2id/bcrypt) with sane cost — never plain SHA/MD5.
4. For confidentiality, use **authenticated** encryption (AEAD); never encrypt without integrity.
5. Generate keys/nonces/salts from a CSPRNG; store keys in a vault/KMS and plan rotation.
6. Prefer current, non-deprecated algorithms; map choices to NIST SP 800-131A and OWASP password guidance.

## Output shape

```
Goal: <integrity/confidentiality/auth> | Data & threat: …
Primitive: <hash/AEAD/asymmetric> — library: <vetted>
Passwords: argon2id/bcrypt + salt + cost
Keys & randomness: CSPRNG, vault/KMS, rotation
Avoid: MD5/SHA-1, ECB, home-grown | Ref: NIST SP 800-131A / OWASP
```

## Tips

- Don't roll your own crypto — use maintained libraries and standard, current algorithms.
- Hashing ≠ encryption: hashes are one-way (integrity/passwords); encryption is reversible (confidentiality).
- Passwords need slow salted hashes, not fast ones; end with the **Learning Footer** (`AGENTS.md`).
