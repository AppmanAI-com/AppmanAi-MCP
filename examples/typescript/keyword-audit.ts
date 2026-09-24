/**
 * Resolve an app by name, pull the keywords it should target, and size them.
 *
 *   export APPMANAI_KEY=appmanai_live_xxx
 *   npx tsx examples/typescript/keyword-audit.ts "habit tracker" ios US
 *
 * Costs about 17 credits: 2 to search, 6 for the suggestions, 9 for the batch.
 * No dependencies — Node 22+ has fetch built in.
 */

const API = 'https://appmanai.com/api/v1'
const KEY = process.env.APPMANAI_KEY
if (!KEY) throw new Error('export APPMANAI_KEY=appmanai_live_xxx first')

type Params = Record<string, string | string[]>

/** GET a v1 endpoint. Array values repeat the parameter, as the API expects. */
async function get<T = any>(path: string, params: Params): Promise<T> {
  const query = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    for (const one of Array.isArray(value) ? value : [value]) query.append(key, one)
  }

  const res = await fetch(`${API}/${path}?${query}`, {
    headers: { Authorization: `Bearer ${KEY}` },
  })
  if (!res.ok) {
    const { error } = await res.json().catch(() => ({ error: { message: res.statusText } }))
    throw new Error(`${path} failed: ${error?.code ?? res.status} ${error?.message ?? ''}`)
  }

  console.error(
    `  ${path} — ${res.headers.get('x-credit-cost') ?? '?'} credits, ` +
      `${res.headers.get('x-credit-balance') ?? '?'} left`,
  )
  return (await res.json()).data
}

/** A list response nests its array under data; a single one is the object itself. */
function rows(data: any): any[] {
  if (Array.isArray(data)) return data
  if (data && typeof data === 'object') {
    const list = Object.values(data).find(Array.isArray)
    if (list) return list as any[]
  }
  return data ? [data] : []
}

const [query = 'habit tracker', store = 'ios', country = 'US'] = process.argv.slice(2)

const [app] = rows(await get('apps/search', { store, country, q: query, limit: '1' }))
if (!app) throw new Error(`no app matched "${query}"`)
const pkg = app.package ?? app.app_id
console.log(`\n${app.title ?? pkg}  (${pkg})\n`)

const suggested = rows(await get('keywords/app/suggestions', { store, country, package: pkg }))
const keywords = suggested.map((k) => k.keyword).filter(Boolean).slice(0, 25)
if (!keywords.length) throw new Error('no keyword suggestions came back')

// One batch call for the whole list — looping the single-keyword endpoint would
// cost several times as much for the same answer.
const sized = rows(await get('keywords/metrics/sap/batch', { country, keywords }))
sized.sort((a, b) => (b.sap ?? 0) - (a.sap ?? 0))

console.log('keyword'.padEnd(34) + 'SAP'.padStart(6))
for (const k of sized.slice(0, 20)) {
  console.log(String(k.keyword ?? '').padEnd(34) + String(k.sap ?? 0).padStart(6))
}
