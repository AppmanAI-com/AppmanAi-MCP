---
name: aso-keyword-audit
description: Build a prioritised ASO keyword shortlist for one app in one country — expand seeds, size demand with SAP, check where the app already ranks, and rank the candidates by opportunity. Use when asked to audit keywords, find keywords to target, or decide which terms are worth chasing. Requires the AppmanAi MCP connector.
---

# ASO keyword audit

Turn a vague "which keywords should we target?" into a shortlist with numbers behind it.

## Inputs

Ask for whatever is missing before starting:

- **app** — a package id (`com.example.app`) or a name to resolve
- **store** — `ios` or `android`
- **country** — a two-letter code, default `US`

## Cost

Roughly **40–70 credits** for a standard run. Say the estimate before step 2 and let the user stop you. `user_balance` is free — check it first if the balance might be short.

## Steps

**1 · Resolve the app.** If you were given a name, `app_search` (2 credits) and confirm the match with the user before spending anything else. Skip when you already have a package id.

**2 · Establish the baseline.** `app_metrics_metadata` (3) for the current title, subtitle and category. The existing listing text is itself a keyword hypothesis — note which terms it already targets.

**3 · Collect candidates** from three sources, deduplicated:

- `keyword_app_suggestions` (6) — what the store associates with this app
- `keyword_suggestions` (5) on each of 1–3 seed terms from the title and category
- `generate_keywords` (12) — optional; use it when the obvious terms are clearly saturated, skip it when the first two already produced 40+ candidates

**4 · Size the demand.** `keyword_metrics_sap_batch` (9) over the whole candidate list in one call. Never loop `keyword_metrics_sap` per keyword — the batch tool exists for exactly this and costs a fraction.

Drop anything with negligible SAP. State the cutoff you used.

**5 · Find the current position.** `keyword_app_metrics_rankings_batch` (9) for the surviving list. This splits candidates into three groups that need different advice:

- already top-10 — defend, don't chase
- ranked 11–50 — the reachable wins, where effort pays fastest
- unranked or 50+ — the long game

**6 · Check difficulty on the shortlist only.** `keyword_metrics` (4 each) for the top 5–10 candidates by demand. This is the expensive step, so cap it and say how many you ran.

**7 · Report.** One table sorted by opportunity, columns: keyword · SAP · current rank · difficulty · verdict. Below it, three to five sentences of plain advice — which terms to put in the title, which in the subtitle, which to ignore and why.

## Rules

- **Batch tools over loops.** `_batch` exists for lists; using the single-keyword tool n times is the most common way to waste a user's credits.
- **Report the real numbers.** SAP and difficulty come back as values — quote them. Never describe a keyword as "high volume" without the number next to it.
- **Say what you skipped.** If you capped step 6 at 10 keywords, say so; the user may want the rest.
- **One country per run.** Cross-market questions belong to `keyword_suggestions_worldwide` and `keyword_app_metrics_rankings_worldwide`, which are different, pricier tools — offer them as a follow-up rather than looping countries.
