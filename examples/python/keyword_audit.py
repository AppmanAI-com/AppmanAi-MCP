#!/usr/bin/env python3
"""Resolve an app by name, pull the keywords it should target, and size them.

    export APPMANAI_KEY=appmanai_live_xxx
    python examples/python/keyword_audit.py "habit tracker" ios US

Costs about 17 credits: 2 to search, 6 for the suggestions, 9 for the batch.
Standard library only.
"""

import json
import os
import sys
import urllib.parse
import urllib.request

API = "https://appmanai.com/api/v1"
KEY = os.environ.get("APPMANAI_KEY")
if not KEY:
    sys.exit("export APPMANAI_KEY=appmanai_live_xxx first")


def get(path: str, **params) -> dict:
    """GET a v1 endpoint. List values repeat the parameter, as the API expects."""
    query = urllib.parse.urlencode(params, doseq=True)
    request = urllib.request.Request(
        f"{API}/{path}?{query}", headers={"Authorization": f"Bearer {KEY}"}
    )
    with urllib.request.urlopen(request) as response:
        body = json.load(response)
        cost = response.headers.get("X-Credit-Cost", "?")
        left = response.headers.get("X-Credit-Balance", "?")
        print(f"  {path} — {cost} credits, {left} left", file=sys.stderr)
    return body["data"]


def rows(data):
    """A list response nests its array under data; a single one is the object."""
    if isinstance(data, dict):
        for value in data.values():
            if isinstance(value, list):
                return value
    return data if isinstance(data, list) else [data]


def main() -> None:
    query = sys.argv[1] if len(sys.argv) > 1 else "habit tracker"
    store = sys.argv[2] if len(sys.argv) > 2 else "ios"
    country = sys.argv[3] if len(sys.argv) > 3 else "US"

    matches = rows(get("apps/search", store=store, country=country, q=query, limit=1))
    if not matches:
        sys.exit(f"no app matched {query!r}")
    app = matches[0]
    package = app.get("package") or app.get("app_id")
    print(f"\n{app.get('title', package)}  ({package})\n")

    suggested = rows(
        get("keywords/app/suggestions", store=store, country=country, package=package)
    )
    keywords = [k.get("keyword") for k in suggested if k.get("keyword")][:25]
    if not keywords:
        sys.exit("no keyword suggestions came back")

    # One batch call for the whole list — looping the single-keyword endpoint
    # would cost several times as much for the same answer.
    sized = rows(
        get("keywords/metrics/sap/batch", country=country, keywords=keywords)
    )
    sized.sort(key=lambda k: k.get("sap") or 0, reverse=True)

    print(f"{'keyword':<34} {'SAP':>6}")
    for keyword in sized[:20]:
        print(f"{keyword.get('keyword', ''):<34} {keyword.get('sap', 0):>6}")


if __name__ == "__main__":
    main()
