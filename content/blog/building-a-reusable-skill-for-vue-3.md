---
title: "Building a Reusable Skill for Vue 3: From Architecture Principles to a Published GitHub Standard"
description: When you've explained the same architectural pattern for the seventh
  time this month, that's not mentoring — it's a missing abstraction. How I
  codified senior-level Vue 3 patterns into a shareable standard.
date: 2026-06-03
image: https://images.pexels.com/photos/2004161/pexels-photo-2004161.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1
minRead: 7
author:
  name: Junaid Rasheed
  username: junaidrasheed
  to: https://github.com/junaidrasheed
  avatar:
    src: /avatars/me.png
    alt: Junaid Rasheed
---

At some point in every senior engineer's career, you have a realization: you've explained the same architectural pattern for the seventh time this month. Different engineer, different PR, same feedback. Same problem, same solution, same comment written slightly differently.

That's not mentoring. That's a missing abstraction.

This post is about what I did about it — and why codifying your standards into something shareable is one of the highest-leverage things a senior engineer can do.

## The problem with tribal knowledge

Most teams run on tribal knowledge. The senior engineers know how things should be done. Junior engineers learn by getting feedback on PRs, asking questions in Slack, and gradually absorbing the patterns over months of exposure. It works, eventually. But it's slow, it's inconsistent, and it scales terribly.

The senior engineer becomes a bottleneck. Every non-trivial PR needs their eye on it. Onboarding new engineers takes forever because there's no single source of truth — just a collection of examples scattered across the codebase and a handful of people who hold the context in their heads.

The worst part? When those people leave, the knowledge leaves with them. Tribal knowledge has no version history.

## What a "skill" actually is

I started thinking about this differently: what if the patterns I kept explaining in reviews were just... documentation? Not a wiki page that nobody reads, but an opinionated, structured reference that captures not just *what* to do but *why* — and that could be handed to any engineer (or AI coding assistant) and immediately produce code at the standard you actually want.

That's what I built for Vue 3. A skill — a compact, structured document that encodes senior-level patterns for the Composition API: how composables should be structured, how state should be managed, how components should be split, how validation should be handled, how tests should be written.

Not a style guide. Not a list of rules. A working standard with rationale.

## What goes into it

The key insight is that a useful standard has to answer three questions for every pattern it covers:

- **What** — the concrete pattern or structure being recommended
- **Why** — the reasoning behind it, not just "because I said so"
- **What not to do** — the anti-pattern it replaces, and why that's worse

Most style guides only answer the first question. That's why engineers ignore them under pressure — they follow rules they understand and skip the ones that feel arbitrary. When the reasoning is visible, engineers internalize the principle, not just the syntax. They apply it in situations the guide never anticipated.

For Vue 3 specifically, the areas that needed the most opinionated guidance were:

- **Composable design** — when to extract, how to name, what to expose
- **Component responsibility** — the boundary between "smart" and "dumb" components
- **TypeScript integration** — not just "use types" but how to type props, emits, and composable return values in a way that's actually useful
- **Testing philosophy** — what to test, what not to test, and why unit testing implementation details is a trap

## The process of writing it

Writing this kind of document is harder than it sounds, for one reason: you have to separate what you *do* from what you *should do*.

Senior engineers accumulate habits. Some of those habits are genuinely good patterns. Some are historical artifacts from older versions of the framework, or workarounds for problems that no longer exist, or just personal preferences that never got challenged. Writing a standard forces you to interrogate your own practices.

"Why do I do it this way? Is this actually better, or is it just familiar?"

That process is uncomfortable and extremely valuable. I rewrote sections multiple times after realizing I was documenting a habit rather than a principle. The final document was better for it — and so was my own understanding of the codebase.

## Communicating it to the team

A standard nobody knows about is just a file on GitHub. Getting the team to actually use it requires a different kind of effort than writing it.

A few things that helped:

**Frame it as a resource, not a mandate.** Engineers who feel like standards are being imposed on them resist them. Engineers who feel like they have access to a useful reference use it. The framing matters more than you'd expect.

**Walk through it in a team session.** Not a lecture — a conversation. Let engineers push back on the patterns, ask why, suggest alternatives. Some of the best additions to the standard came from those discussions. It also creates shared ownership, which is what makes standards actually stick.

**Reference it in reviews, don't replace reviews with it.** When you leave a comment pointing to a section of the standard, you're doing two things: giving specific actionable feedback, and reinforcing that the standard exists and is being actively used. Eventually engineers start referencing it themselves before submitting PRs.

## Why this is worth your time

The ROI on this kind of work is slow and invisible at first. You write the standard, you share it, and nothing obviously changes the next day.

But three months later, the PR feedback you're leaving has shifted. You're catching architectural issues earlier, because engineers are catching the obvious ones themselves. Onboarding new engineers is faster because there's something concrete to point them to. The tribal knowledge has a home. It's versioned. It can be updated. It can be shared outside the team.

And the next time you find yourself writing the same code review comment for the eighth time, you don't write it — you update the standard instead.

That's the compounding return. One document, maintained well, that makes every future review, every onboarding, and every architectural discussion slightly more efficient. Over a year, that's an enormous amount of recovered time and transferred knowledge.

Senior engineers are often evaluated on their code. The best ones get evaluated on how much better the engineers around them become. A published standard is one of the clearest ways to make that impact visible.
