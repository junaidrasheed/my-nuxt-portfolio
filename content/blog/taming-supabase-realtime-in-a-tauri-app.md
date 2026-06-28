---
title: "Taming Supabase Realtime in a Tauri App: Sleep, Wake, and Reconnection"
description: Supabase Realtime and laptop sleep modes have a complicated
  relationship. Here's the hybrid reconnection approach that actually held up in
  production for a Tauri v2 desktop app.
date: 2026-05-13
image: https://images.pexels.com/photos/17489151/pexels-photo-17489151.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1
minRead: 5
author:
  name: Junaid Rasheed
  username: junaidrasheed
  to: https://github.com/junaidrasheed
  avatar:
    src: /avatars/me.png
    alt: Junaid Rasheed
---

So you've built a beautiful desktop app with Tauri. It's fast, it's native-ish, and you've wired up Supabase Realtime to push live updates straight to your users. It works great in dev. You demo it, everyone claps. You ship it.

Then someone closes their laptop lid.

Here's the thing nobody puts in the getting started guide: Supabase Realtime and laptop sleep modes have the kind of relationship that software engineers describe as "undefined behavior." The WebSocket connection drops when the machine sleeps, and when it wakes up, your channel just sits there — technically alive, spiritually gone. No error. No reconnect. Just silence. It's the software equivalent of a colleague who stopped responding to Slack three hours ago but their status still says "Active."

I ran into this building The-Tie-Bridge, a Tauri v2 desktop app backed by Supabase. Here's what I learned.

## The problem with WebView focus

Tauri wraps your frontend in a WebView, and WebView has its own lifecycle that doesn't always map neatly to what you'd expect. When the app loses focus — or the machine sleeps — the underlying WebSocket can go stale. The tricky part is that Supabase's client doesn't always *know* it's stale. It might even attempt to reconnect on its own, but in the process, it misses events that fired while it was out. Those events are just gone. No replay, no buffer.

This is not a bug in Supabase. It's just the reality of long-lived WebSocket connections in a desktop environment that has power management, focus states, and a WebView runtime that isn't a full browser.

## The wrong fix (that feels right)

The first instinct is to add a reconnect loop. Just check every N seconds if the channel is still alive and re-subscribe if not. Simple enough, right?

Except:

1. You're now polling inside a `setInterval`, which — surprise — is not reliable across sleep/wake cycles either. The interval can fire late, early, or get batched. JavaScript timers in a sleeping WebView are basically on vacation.

2. Even if you do reconnect, you've already missed anything that happened during the gap. Your UI is now silently stale. Congratulations, you've built an eventually-inconsistent desktop app. (Distributed systems engineers are nodding knowingly. Everyone else will be shortly.)

## The hybrid approach that actually works

The solution that held up in production is a combination of two things.

**1. Use Tauri's native window events, not JS timers.**

Tauri exposes `appWindow.onFocusChanged()` — a native-level listener that fires reliably when the window regains focus, regardless of what the JS runtime was doing while the app was sleeping. This is your trigger to revalidate the Realtime connection.

```typescript
import { appWindow } from "@tauri-apps/api/window";

appWindow.onFocusChanged(({ payload: focused }) => {
  if (focused) {
    checkAndReconnectChannels();
  }
});
```

This fires when the user alt-tabs back, opens the lid, or brings the window to the front. It's rock solid because it's operating at the OS level, not the JS event loop level.

**2. Back it up with a lightweight heartbeat + background poll.**

Realtime handles the live updates. But for any data that might have changed while the connection was dead, fire a one-time fetch on focus restore. Think of it as the app "catching up" before trusting the live stream again.

```typescript
async function checkAndReconnectChannels() {
  const isConnected = await pingRealtimeChannel();

  if (!isConnected) {
    await resubscribeAllChannels();
  }

  // Fetch any missed updates regardless
  await syncLatestState();
}
```

This hybrid gives you the best of both worlds: real-time updates when everything is healthy, and a reliable fallback that fills the gap when it isn't. Your users get a consistent experience without knowing any of this chaos is happening underneath.

## Lessons learned

- Never trust JS timers for reconnection logic in a desktop app. They lie.
- Tauri's native event listeners are underused and extremely reliable.
- Treat sleep/wake as a mini-deployment: assume state is stale and verify.
- The WebView is not a browser tab. Stop treating it like one.

If you're building anything with Tauri + Supabase Realtime, add the focus listener on day one. Future you — the one debugging a prod issue at 11pm because a user's chat stopped updating after their standup — will be grateful.

*Written from real scars. The-Tie-Bridge is a Tauri v2 + Supabase desktop app. The reconnection bugs described above were not hypothetical.*
