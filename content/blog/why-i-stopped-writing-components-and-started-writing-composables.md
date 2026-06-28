---
title: Why I Stopped Writing Components and Started Writing Composables
description: Using components as the primary unit of reuse couples logic to
  rendering and breeds 600-line files. The mental model shift that makes Vue 3
  codebases navigable six months later.
date: 2026-06-17
image: https://images.pexels.com/photos/3993855/pexels-photo-3993855.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1
minRead: 6
author:
  name: Junaid Rasheed
  username: junaidrasheed
  to: https://github.com/junaidrasheed
  avatar:
    src: /avatars/me.png
    alt: Junaid Rasheed
---

There's a pattern every Vue developer goes through. You start writing components. Then you write more components. Then you write components that contain other components. Then one day you open a file and there's a 600-line component that does seventeen things and you have no idea how it got that way.

The answer is always the same: you put logic where the framework made it easy to put logic. And in Vue 2, that was the component. The Options API encouraged it. `data`, `methods`, `computed` — all neatly organized by type, not by concern. It looked tidy. It wasn't.

## The real problem with component-first thinking

The issue isn't components themselves — it's using them as the primary unit of reuse. When your instinct is "I need to reuse this, I'll make a component," you end up with two problems.

**You couple logic to rendering.** A component that fetches data and displays it is doing two completely separate jobs. Reusing the display means dragging along the fetching. Reusing the fetching means dragging along the display. Neither is what you actually wanted.

**You create implicit dependencies.** Components communicate through props and emits, which is fine at small scale and progressively painful as the tree deepens. By the time you're prop-drilling through four levels or reaching for an event bus, you've built a distributed system inside your UI layer. Congratulations, you've invented microservices for your frontend. Nobody is happy about this.

## What composables actually are

The Vue 3 Composition API introduced composables — functions that encapsulate reactive logic and can be used in any component, regardless of what that component renders.

The mental model shift is this: a composable is not a component without a template. It's a unit of behavior. It owns state and the logic that operates on that state. It doesn't care about rendering at all.

A component's job is to decide what to show and how to respond to user input. A composable's job is to manage the logic and state that the component needs to do that. When you split them cleanly, both become dramatically simpler.

## Where the shift shows up

**Data fetching.** This is the clearest win. A composable that handles fetching, loading state, error state, and retry logic can be dropped into any component that needs it. The component just consumes the result. You write the fetching logic once, test it independently, and never think about it again in the context of a specific component.

**Form handling.** Forms are where component-first thinking produces the most pain. Validation logic, field state, submission handling, error display — none of that needs to live in the component. A composable that takes a schema and returns field state and validation results keeps the component focused on layout and nothing else.

**Shared reactive state.** When multiple components need access to the same piece of state, the composable becomes the single source of truth. Not a store for everything — just a scoped, intentional owner of one concept. This is often the right tool before reaching for a full state management solution.

## The rules that make composables actually work

Not all composables are created equal. The pattern can produce beautiful, reusable logic or a different kind of mess if you're not deliberate about it.

**Name them by what they do, not what they're for.** `useUserProfile` is a component-specific name. `useAsyncData` or `useFormValidation` is a behavioral name. The behavioral name travels. The component-specific name doesn't.

**Return only what the consumer needs.** It's tempting to expose everything from a composable "just in case." Resist this. Every exposed value is a contract. The smaller the surface area, the easier the composable is to use, test, and change later.

**Keep them focused on one concern.** A composable that handles fetching AND caching AND error formatting AND retry logic is a component in disguise. Split it. Composables compose — that's the whole point. A composable can call another composable.

**Don't reach for composables for everything.** Simple derived state that's only used in one place belongs in the component. The overhead of extracting it into a composable isn't worth it. Extract when there's a genuine reuse case or when the logic is complex enough to warrant isolated testing.

## The testing benefit nobody talks about enough

Composables are just functions. Functions are easy to test. You don't need to mount a component, simulate user interactions, or worry about the DOM. You call the function, interact with the returned state, and assert the result.

This is a significant quality-of-life improvement. Testing component logic that lives inside the component requires testing through the component. Testing the same logic in a composable is three lines of setup. The tests are faster, more focused, and much easier to read and maintain.

If you find yourself writing complex component tests to cover logic, that logic probably belongs in a composable.

## The mental model in one sentence

Components decide what to show. Composables decide what's true.

When that division is clear, components get simpler, logic gets reusable, and the codebase becomes something you can actually navigate six months after writing it. Which, in frontend development, is about as close to utopia as we get.
