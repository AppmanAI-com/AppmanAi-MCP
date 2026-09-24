---
name: rank-drop-triage
description: Diagnose why an app's keyword ranking moved — separate a store algorithm shift from a change to the listing itself, using rank history and cross-country volatility. Use when a rank dropped or jumped, when asked what happened to a ranking, or whether an update caused a change. Requires the AppmanAi MCP connector.
---

# Rank drop triage

Most rank-drop panic is misdiagnosed. The first job is not to explain the drop — it is to find out whether the drop was *about you at all*.

## Inputs

- **app** — package id or name
- **keyword** — the term that moved
- **store** — `ios` or `android`
- **country** — two-letter code, default `US`
- **when** — roughly when it was noticed, if known

## Cost

Roughly **25–40 credits**. Cheaper if the algorithm check settles it early, which it often does.

## Steps

**1 · Confirm the move is real.** `keyword_app_metrics_rankings_history` (6) for the keyword, widest sensible `period`. Read the actual series before accepting the premise — "dropped 12 places" is sometimes one noisy day, or a position that had been sliding for a month.

State plainly what the data shows, including when it contradicts the user.

**2 · Ask whether the store moved, not the app.** `keyword_metrics_volatility` (8). This is the pivotal step, so run it before anything else. High volatility around the date means the store reshuffled results for that term, and the listing is very likely not the cause.

**3 · Localise it.** If volatility is high, `keyword_metrics_volatility_worldwide` (12) tells you whether it was a global reshuffle or one market. If the drop is in one country and nowhere else, the cause is local — a competitor's launch, a local editorial push, a per-country listing change.

If volatility is low, skip to step 4: the store was stable, so something app-side changed.

**4 · Look for an app-side cause.** `app_metrics_metadata` (3) for the current listing, and `app_metrics_ratings_history` (5) for the same window. A rating slide or a metadata change that lands on the same date is the likeliest explanation. Say "coincides with" — you have correlation, not proof.

**5 · Check who took the slot.** `keyword_top_apps` (5). A new entrant at the position you lost is itself the answer, and it changes the advice entirely.

**6 · Verdict.** Lead with one of three, in one sentence:

- **the store moved** — volatility spike, ride it out, don't touch the listing
- **the app moved** — a listing or rating change coincides, name it
- **a competitor moved** — someone took the slot, name them

Then the evidence in three or four lines, dates included, and a recommendation. If the evidence is genuinely ambiguous, say that rather than picking the most satisfying story.

## Rules

- **Volatility before blame.** Running this check first is the entire value of the workflow; skipping it is how teams rewrite a listing that was never the problem.
- **Verify the premise.** Pull the history before accepting that a drop happened as described.
- **Correlation, stated as correlation.** Dates lining up is evidence, not causation, and saying so protects the user from a bad rewrite.
- **Don't recommend a metadata rewrite on a single data point.** One bad week is not a trend.
