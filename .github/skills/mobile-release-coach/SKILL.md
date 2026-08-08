---
name: mobile-release-coach
description: "Ship a mobile app to the stores as a lesson — code signing, App Store/Play review guidelines, phased and staged rollout, and versioning on iOS and Android. Use for 'mobile release', 'app store submission', 'code signing / provisioning profile', 'Play App Signing', 'phased release', 'staged rollout', 'versionCode vs versionName', or 'CFBundleVersion'."
argument-hint: "The release"
---

# Mobile Release Coach

Ship a mobile app to the App Store and Google Play — signing, review, rollout, and versioning —
teaching the why behind each gate, per the coding standards and Learning Footer in
[`AGENTS.md`](../../../AGENTS.md). Pairs with [api-design-review](../api-design-review/SKILL.md).

## When to use

- The learner is preparing a first submission or a safer update rollout.
- Untangling signing, versioning, or a store review rejection.

## Procedure

1. **Sign the build** — iOS: certificates + provisioning profiles (App Store Connect); Android: an
   upload key with Play App Signing (Apple, *Code Signing*; Android, *Sign your app*, 2024). Keep keys in a secret store.
2. **Version correctly** — iOS: `CFBundleShortVersionString` (marketing) + `CFBundleVersion` (build);
   Android: `versionName` + a monotonically increasing `versionCode`. Follow SemVer for the marketing version.
3. **Package artifacts** — iOS: archive → upload to App Store Connect / TestFlight; Android: build a
   signed Android App Bundle (`.aab`) for Play.
4. **Pass review** — read Apple *App Review Guidelines* and Google Play policies; prep privacy
   labels/data-safety, test accounts, and metadata before submitting.
5. **Roll out gradually** — App Store phased release (7-day) / Play staged rollout (%); watch
   crash-free rate and reviews, halt on regression.
6. **Prepare rollback & hotfix** — you can't unpublish easily; plan a fast follow-up and feature flags.

## Output shape

```
Signing: certs+profiles (iOS) · upload key+Play signing (Android)
Version: CFBundleShortVersionString/CFBundleVersion · versionName/versionCode
Artifact: archive→TestFlight · signed .aab→Play
Review: guidelines + privacy labels/data-safety + test creds
Rollout: phased(7d) / staged(%) — monitor crash-free
Rollback: halt rollout · feature flag · hotfix plan
```

## Tips

- Bump the build number on every upload — stores reject duplicates.
- Guard risky launches behind a feature flag so you can disable without a resubmission.
- Draft store metadata early — review rejects on metadata, not just code; end with the **Learning Footer** (`AGENTS.md`).
