---
name: review-mining
description: Pull an app's reviews and turn them into grouped, sized themes — the recurring complaints and requests behind a rating, with the rating history that shows when they started. Use when asked what users complain about, why a rating fell, or for feature requests from reviews. Requires the AppmanAi MCP connector.
---

# Review mining

Turn a wall of reviews into a short list of things worth fixing, sized by how often they come up.

## Inputs

- **app** — package id or name
- **store** — `ios` or `android`
- **country** — two-letter code, default `US`

## Cost

Roughly **15–25 credits**.

## Steps

**1 · Resolve the app.** `app_search` (2) if you were given a name.

**2 · Read the shape of the rating first.** `app_metrics_ratings_worldwide` (6) for the star histogram. A 4.2 built from 5s and 1s is a different problem from a flat 4.2 — the first is a broken segment, the second is mediocrity. Say which one this is.

**3 · Pull reviews.** `app_reviews` (4). Take the largest sample the tool will return.

**4 · Group into themes.** Cluster by what the user is actually complaining about, not by wording. For each theme record: how many reviews, the star ratings they carry, the date range, and one representative quote.

Keep themes concrete. "Bad UX" is not a theme; "can't find the export button" is.

**5 · Date the themes.** `app_metrics_ratings_history` (5). Line the theme date ranges up against the rating curve. A complaint that starts the week the rating fell is your headline; an evergreen one that has run for a year is a different kind of problem.

**6 · Report.** Themes ordered by count, each with: the theme, the count and share, the typical star rating, when it started, and one quote. Then a short paragraph separating *what is dragging the rating right now* from *what is chronic*.

## Rules

- **Size every theme.** "Users complain about sync" is worthless without "in 14 of 60 reviews, all 1–2 star, starting in March".
- **One sample, one country.** Reviews are per-country; do not blend markets in one theme list without saying so.
- **Quote, don't paraphrase.** One real sentence per theme, verbatim.
- **Separate volume from severity.** Twenty complaints about a cosmetic bug and three about data loss are not ranked by count alone — flag the severe ones explicitly.
- **Don't invent causes.** Reviews tell you what users noticed, not why it happened.
