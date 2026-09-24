#!/usr/bin/env node
// Rewrites the tool table in README.md from the live catalogue, so the published
// names, descriptions and credit costs cannot drift from what the server registers.
//
//   node scripts/generate-tool-table.mjs
//
// The catalogue is the same one the MCP server builds its tools from, served at
// https://appmanai.com/api/mcp-tools.

import { readFile, writeFile } from 'node:fs/promises'

const SOURCE = 'https://appmanai.com/api/mcp-tools'
const README = new URL('../README.md', import.meta.url)
const START = '<!-- tools:start -->'
const END = '<!-- tools:end -->'

const GROUPS = [
  ['Apps', ['app_search', 'app_similar', 'app_metrics_metadata', 'app_metrics_metadata_batch', 'app_metrics_ratings_worldwide', 'app_metrics_ratings_history', 'app_reviews']],
  ['Keywords by app', ['keyword_app_metrics_rankings', 'keyword_app_metrics_rankings_batch', 'keyword_app_metrics_rankings_history', 'keyword_app_metrics_rankings_worldwide', 'keyword_app_suggestions', 'keyword_app_competitors', 'keyword_app_overlap']],
  ['Keywords', ['keyword_metrics', 'keyword_metrics_sap', 'keyword_metrics_sap_batch', 'keyword_metrics_volatility', 'keyword_metrics_volatility_worldwide', 'keyword_top_apps', 'keyword_suggestions', 'keyword_suggestions_worldwide']],
  ['Charts and categories', ['category_top_apps', 'app_category_rankings', 'app_category_rankings_single', 'app_category_rankings_history', 'app_category_start_rankings']],
  ['Generation', ['generate_keywords', 'generate_app_metadata']],
  ['Reference (free)', ['list_countries', 'list_categories', 'list_features']],
  ['Account (free)', ['user_balance', 'user_api_usage', 'list_tools']],
]

const res = await fetch(SOURCE)
if (!res.ok) throw new Error(`${SOURCE} responded ${res.status}`)
const tools = new Map((await res.json()).data.map((t) => [t.name, t]))

const lines = []
for (const [label, names] of GROUPS) {
  const group = names.map((name) => {
    const tool = tools.get(name)
    if (!tool) throw new Error(`${name} is in GROUPS but not in the catalogue`)
    tools.delete(name)
    return tool
  })

  const costs = group.map((t) => t.credits)
  const range = costs.every((c) => c === 0)
    ? 'free'
    : `${Math.min(...costs)}–${Math.max(...costs)} credits`

  lines.push(
    '<details>',
    `<summary><b>${label}</b> — ${group.length} tools, ${range}</summary>`,
    '',
    '| Tool | Credits | What it does |',
    '| --- | ---: | --- |',
  )
  for (const tool of group) {
    lines.push(`| \`${tool.name}\` | ${tool.credits || 'free'} | ${tool.description.replace(/\|/g, '\\|')} |`)
  }
  lines.push('', '</details>', '')
}
if (tools.size) throw new Error(`ungrouped tools: ${[...tools.keys()].join(', ')}`)

const readme = await readFile(README, 'utf8')
const before = readme.indexOf(START)
const after = readme.indexOf(END)
if (before === -1 || after === -1) throw new Error('README.md is missing the tools markers')

await writeFile(
  README,
  `${readme.slice(0, before + START.length)}\n\n${lines.join('\n')}${readme.slice(after)}`,
)
console.log('README.md tool table updated')
