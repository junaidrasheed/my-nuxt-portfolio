---
title: "Paginating Complex CTEs in PostgreSQL: Lessons from a Real Chat App"
description: OFFSET feels right and embarrasses you in production. A practical
  look at cursor pagination, structuring CTEs honestly, and the DISTINCT ON trap,
  drawn from a real chat app.
date: 2026-05-20
image: https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1
minRead: 7
author:
  name: Junaid Rasheed
  username: junaidrasheed
  to: https://github.com/junaidrasheed
  avatar:
    src: /avatars/me.png
    alt: Junaid Rasheed
---

Pagination. The feature that sounds like it takes an afternoon and somehow consumes three days of your life. You've been there. We've all been there. Now imagine doing it inside a CTE that's already juggling message counts, unread badges, last-message previews, and participant lookups — all in a single RPC call.

This is a post about how that goes, what breaks, and what actually works.

## OFFSET pagination: the tempting lie

The first version always uses OFFSET. It always does. OFFSET is the pagination equivalent of duct tape — it works, it's fast to write, and it will absolutely embarrass you in production.

The problem is that PostgreSQL still scans and discards all the skipped rows on every single request. At small scale, you don't notice. At real scale, query time grows linearly with page number. Page 1 is fast. Page 500 is a customer complaint.

There's also the classic "ghost row" bug: if a new record is inserted between page 1 and page 2 fetches, your offset shifts. The user either sees a duplicate or silently skips a row. The data is lying to you and the frontend has no idea.

## Cursor-based pagination: the right answer (with sharp edges)

Cursor pagination solves both problems. Instead of "give me rows 40–60," you say "give me rows that come after this specific row." Stable, consistent, and index-friendly regardless of how deep you go.

The cursor is typically the value you're ordering by, combined with a unique ID as a tiebreaker. This matters more than you'd think — two records can absolutely have the same timestamp, and databases will find that edge case on a Friday afternoon when you least want them to.

PostgreSQL's row value comparisons are clean for this:

```sql
WHERE (ordered_at, id) < (cursor_ordered_at, cursor_id)
```

This hits your index correctly and stays fast whether you're on page 1 or page 1000. Cursor pagination doesn't degrade. That's the whole point.

## Structuring complex CTEs for pagination

When a query has multiple concerns — aggregations, joins, computed fields — CTEs are the natural way to break it apart. But where you apply the pagination filter matters enormously.

The instinct is to filter early: "let me cut the dataset down first, then do the rest." This is wrong. If you filter before computing aggregations, your counts and summaries are based on the filtered set, not the full one. You end up with correct-looking but subtly wrong numbers.

The right pattern is to compute everything first, then paginate at the last step. Structure it roughly like:

1. **Base CTE** — filter to the relevant scope (e.g. records for this user)
2. **Enrichment CTEs** — joins, aggregations, computed fields
3. **Final CTE** — apply the cursor filter and `LIMIT` here, not before

This keeps your aggregations honest and your pagination clean.

## Getting total count without a second query

A common pattern is to fire two queries: one for the page of data, one for the total count (so the frontend knows whether there's a next page). That works, but it's an extra round trip you don't need.

PostgreSQL's window functions handle this elegantly. Adding `COUNT(*) OVER()` to your final SELECT gives you the total matching rows alongside each result row — no separate query, no extra latency. One call, full information.

It's one of those features that feels almost too convenient when you first discover it.

## The DISTINCT ON trap

If you're using `DISTINCT ON` to get the "latest record per group" — a common pattern for things like last message per conversation — there's a subtle ordering rule that will burn you at least once.

The `ORDER BY` clause inside a `DISTINCT ON` query must lead with the `DISTINCT ON` column. If your outer query needs results sorted differently, you have to wrap it in a subquery and re-sort outside. PostgreSQL won't warn you when you get this wrong. It'll just return data that looks right but isn't.

Always verify `DISTINCT ON` results with multi-record test data. Single-record test cases hide this bug completely.

## Test with multiple users early

This applies to anything with per-user state — unread counts, permissions, personalized feeds. Single-user testing will give you false confidence.

The bugs in per-user aggregations only appear when two or more users are actually interacting with the same data simultaneously. If you're not testing that, you're testing a much simpler system than the one you've actually built.

Set up proper multi-user test fixtures early. It's annoying to do and extremely worth it.

## Lessons learned

- OFFSET is fine for internal tools. For user-facing features at scale, use cursors.
- Always include a unique tiebreaker in your cursor. Timestamps are not unique.
- Apply pagination filters at the final CTE step, not the first.
- `DISTINCT ON` has ordering constraints. Read them carefully.
- `COUNT(*) OVER()` eliminates the need for a separate count query.
- Test aggregations with real multi-user scenarios from the start.

The query that comes out the other side of this process isn't always pretty. But it's correct, fast, and won't wake you up at 3am. In production database work, that's basically the win condition.
