# Examples

Runnable calls against the AppmanAi HTTP API — the same data the MCP tools serve, for when you want it in a script instead of a chat.

Create a key in the [dashboard](https://appmanai.com/app) and export it:

```bash
export APPMANAI_KEY=appmanai_live_xxx
```

| File | What it shows |
| --- | --- |
| [`curl.sh`](curl.sh) | The raw shape of every request type — free lookup, search, list parameters, POST |
| [`python/keyword_audit.py`](python/keyword_audit.py) | Resolve an app, pull its keywords, size them in one batch call |
| [`typescript/keyword-audit.ts`](typescript/keyword-audit.ts) | The same, typed, with the credit headers read back |

Base URL is `https://appmanai.com/api/v1`. Everything is a `GET` except the two `/generate/*` endpoints. Full spec: [`../openapi.yaml`](../openapi.yaml).
