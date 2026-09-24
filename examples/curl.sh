#!/usr/bin/env bash
# The shape of every AppmanAi request type. Needs APPMANAI_KEY in the environment.
set -euo pipefail

: "${APPMANAI_KEY:?export APPMANAI_KEY=appmanai_live_xxx first}"
API=https://appmanai.com/api/v1
AUTH=(-H "Authorization: Bearer $APPMANAI_KEY")

# Reference data is free — a good way to check a key works without spending.
echo '— supported countries (0 credits)'
curl -s "${AUTH[@]}" "$API/resources/countries" | head -c 300; echo

# A plain lookup. Note -G + --data-urlencode so spaces survive.
echo '— app search (2 credits)'
curl -s -G "${AUTH[@]}" "$API/apps/search" \
  --data-urlencode "store=ios" \
  --data-urlencode "country=US" \
  --data-urlencode "q=habit tracker" \
  --data-urlencode "limit=5" | head -c 500; echo

# List parameters repeat. One batch call is far cheaper than a loop.
echo '— keyword demand, batched (9 credits)'
curl -s -G "${AUTH[@]}" "$API/keywords/metrics/sap/batch" \
  --data-urlencode "country=US" \
  --data-urlencode "keywords=habit tracker" \
  --data-urlencode "keywords=daily planner" \
  --data-urlencode "keywords=routine builder" | head -c 500; echo

# The credit and rate-limit headers are on every response.
echo '— headers'
curl -s -o /dev/null -D - -G "${AUTH[@]}" "$API/resources/countries" \
  | grep -iE 'x-request-id|x-credit|x-ratelimit'
