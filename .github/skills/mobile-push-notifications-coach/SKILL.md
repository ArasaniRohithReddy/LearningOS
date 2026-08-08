---
name: mobile-push-notifications-coach
description: "Implement mobile push notifications as a lesson — APNs and FCM, device tokens, runtime permissions, notification channels, and payloads on iOS and Android. Use for 'push notifications', 'APNs', 'FCM', 'device token', 'notification permission', 'POST_NOTIFICATIONS', 'notification channel', 'silent/background push', or 'notifications not arriving'."
argument-hint: "The notification need"
---

# Mobile Push Notifications Coach

Wire up push notifications end to end — provider path, permissions, tokens, and payloads on iOS and
Android — per the coding standards and Learning Footer in
[`AGENTS.md`](../../../AGENTS.md). Pairs with [api-design-review](../api-design-review/SKILL.md).

## When to use

- The learner is adding push and needs tokens, permissions, and payloads done right.
- Notifications aren't arriving and the delivery path needs debugging.

## Procedure

1. **Understand the path** — your server → APNs (iOS) / FCM (Android) → device; you need a per-device
   token and provider auth (Apple, *Registering your app with APNs*; Firebase, *FCM*, 2024).
2. **Request permission** — iOS: `UNUserNotificationCenter.requestAuthorization`; Android 13+: request
   the `POST_NOTIFICATIONS` runtime permission (API 33). Ask in context; handle denial.
3. **Register & manage tokens** — iOS: `registerForRemoteNotifications` → `didRegister…DeviceToken`;
   Android: `FirebaseMessagingService.onNewToken`. Upload/refresh server-side (see [api-design-review](../api-design-review/SKILL.md)).
4. **Create channels** — Android 8+ requires a `NotificationChannel` (API 26); iOS groups via
   categories/thread-id.
5. **Design payloads** — iOS `aps` (`alert`/`badge`/`sound`, `content-available` for silent,
   `mutable-content` for a service extension); FCM notification vs data messages. Keep them small.
6. **Handle taps & debug** — deep-link on tap; check token validity, provider auth, and entitlements.

## Output shape

```
Path: server → APNs/FCM → device (token + provider auth)
Permission: UNUserNotificationCenter / POST_NOTIFICATIONS (API 33)
Token: register → didRegister… / onNewToken → upload
Channel: NotificationChannel (API 26) · iOS category/thread
Payload: aps{alert,badge,sound,content-available} · FCM data
Tap/debug: deep link · why-not-delivered checklist
```

## Tips

- Silent push (`content-available:1`) is throttled and best-effort — never rely on it for critical delivery.
- A denied permission is sticky — ask in context and degrade gracefully.
- Test on a real device (APNs tokens are unreliable on the Simulator); end with the **Learning Footer** (`AGENTS.md`).
