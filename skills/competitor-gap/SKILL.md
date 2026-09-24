---
name: competitor-gap
description: Find the keywords competitors rank for that a given app does not, ranked by how reachable each one is. Use when asked for a keyword gap analysis, what rivals rank for, or where an app is losing search traffic to competitors. Requires the AppmanAi MCP connector.
---

# Competitor keyword gap

The classic ASO question: what are they getting that we aren't?

## Inputs

- **app** — yours, as a package id or a name
- **competitors** — optional; derive them if not given
- **store** — `ios` or `android`
- **country** — two-letter code, default `US`

## Cost

Roughly **35–60 credits** with a derived competitor set. Say the estimate before step 3.

## Steps

**1 · Resolve your app.** `app_search` (2) if you were given a name; confirm the match.

**2 · Establish the competitor set.** If the user named competitors, resolve each with `app_search` (2 each). Otherwise `app_similar` (5) — the store's own notion of adjacency, which is cheaper and less biased than guessing.

Cap the set at **three to five apps**. Show it and get a nod before spending on it. A set the user disagrees with makes every later number worthless.

**3 · Pull each side's keyword surface.** `keyword_app_suggestions` (6) for your app and for each competitor. `keyword_app_overlap` (7) answers the overlap question directly when there are exactly two apps — prefer it for a head-to-head.

**4 · Compute the gap.** Terms that appear for one or more competitors and not for you. Rank by how many competitors hold each term: a keyword three rivals rank for is a stronger signal than one only a single app holds.

**5 · Size it.** `keyword_metrics_sap_batch` (9) over the gap list in one call. Drop the terms with no real demand — a gap nobody searches for is not a gap.

**6 · Check reachability.** `keyword_metrics` (4 each) on the top 5–8 by demand, and `keyword_top_apps` (5) on the two or three most attractive to see who actually holds the top slots. A term owned by three entrenched giants is not the same opportunity as one held by apps your size.

**7 · Report.** A table: keyword · how many competitors rank · SAP · difficulty · who holds the top slots · verdict. Then a short paragraph naming the two or three terms worth acting on this quarter, and why the rest can wait.

## Rules

- **Get the competitor set agreed before spending.** It is the one decision every later number depends on.
- **A gap is not automatically an opportunity.** Always pair it with demand and difficulty before recommending it.
- **Name the holders.** "You'd be displacing X and Y" is more useful than a difficulty score alone.
- **Batch the demand check.** One `keyword_metrics_sap_batch` call, never a loop.
