---
name: cosign-signing-lab
description: "Hands-on lab to run Cosign (Sigstore) locally as a defensive supply-chain tool — generate keys, then sign and verify your OWN container images and file artifacts (blobs) so consumers can prove integrity and provenance, with an optional keyless/OIDC flow. Free and open source. Use for 'Cosign lab', 'sign my container image', 'verify artifact signature', 'Sigstore locally', or 'supply-chain provenance'. Sign only artifacts you own."
argument-hint: "The image/artifact you want to sign"
---

# Cosign Signing Lab

Learn artifact signing by signing and verifying *your own* images and files with **Cosign
(Sigstore)** locally — a defensive, authorized lab per [`AGENTS.md`](../../../AGENTS.md). Complements
[dependency-audit](../dependency-audit/SKILL.md) and [trivy-scan-lab](../trivy-scan-lab/SKILL.md).

## When to use

- The learner wants to prove an image or artifact they built is authentic and untampered.
- Adding signature verification to a supply chain after scanning (scan → sign → verify).

## Two signing modes

- **Key-based:** a keypair you hold signs; verifiers use the public key. **Keyless:** short-lived certs
  from an OIDC identity (Fulcio) recorded in a transparency log (Rekor) — no long-lived key to leak.

## Procedure

1. Install Cosign (free/OSS); `cosign version`. Confirm you own the artifact you will sign.
2. **Keys:** `cosign generate-key-pair` → `cosign.key` (protect it) + `cosign.pub` (share it).
3. **Sign a file locally:** `cosign sign-blob --key cosign.key --bundle bundle.sigstore.json <file>` —
   no registry needed (Sigstore docs, *Signing Blobs*, docs.sigstore.dev, 2025).
4. **Verify:** `cosign verify-blob --key cosign.pub --bundle bundle.sigstore.json <file>` — then edit
   the file and re-verify to watch it **fail**, proving tamper-detection.
5. **Sign an image** (needs a registry you own): `cosign sign --key cosign.key <ref>`, then
   `cosign verify --key cosign.pub <ref>`; try keyless with `--yes` (OIDC → Fulcio/Rekor).
6. Store the public key/bundle with the artifact; document who is allowed to sign.

## Output shape

```
Artifact: <file/image> | Owned: yes | Mode: key-based | keyless (OIDC)
Keys: cosign.key (secret) + cosign.pub (shared)
Sign: sign-blob/sign → bundle.sigstore.json | Verify: verify-blob/verify → OK/FAIL
Tamper test: edit file → verify FAILs (integrity proven) | Signer identity: …
```

## Tips

- Protect `cosign.key` like any secret; prefer keyless to avoid long-lived keys entirely.
- Verification only means something if you pin the expected key/identity — never verify with an unknown key.
- End with the **Learning Footer** (`AGENTS.md`) — one blob to sign + one tamper-test to run yourself.
