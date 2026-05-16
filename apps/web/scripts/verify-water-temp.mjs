// Verify every state's water temp fetch now returns real data.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const libDir = path.resolve(__dirname, '..', 'lib')
const files = fs.readdirSync(libDir).filter(f => f.endsWith('-stations.ts'))

async function checkStation(name, tempId) {
  const url = `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?station=${tempId}&product=water_temperature&time_zone=LST_LDT&interval=h&units=english&application=TideChartsPro&format=json&range=6`
  try {
    const r = await fetch(url)
    const d = await r.json()
    if (d.error) return { ok: false, msg: d.error.message.slice(0, 50) }
    const last = d.data?.at(-1)
    if (!last) return { ok: false, msg: 'no data points' }
    return { ok: true, temp: `${parseFloat(last.v).toFixed(1)}°F`, at: last.t }
  } catch (e) {
    return { ok: false, msg: e.message }
  }
}

const results = []
for (const file of files) {
  const state = file.replace('-stations.ts', '')
  const content = fs.readFileSync(path.join(libDir, file), 'utf8')
  // Grab first 3 stations from each state with name + tempId
  const matches = [...content.matchAll(/id:\s*"(\d+)",\s*waterTempId:\s*"(\d+)",\s*\n?\s*name:\s*"([^"]+)"/g)]
  const samples = [matches[0], matches[Math.floor(matches.length/2)], matches[matches.length-1]].filter(Boolean)
  const stateResults = []
  for (const m of samples) {
    const [, , tempId, name] = m
    const result = await checkStation(name, tempId)
    stateResults.push({ name, tempId, ...result })
  }
  const ok = stateResults.filter(r => r.ok).length
  const total = stateResults.length
  results.push({ state, ok, total, samples: stateResults })
  console.log(`${state.padEnd(20)} ${ok}/${total} ok — ${stateResults.map(r => r.ok ? r.temp : `FAIL(${r.tempId})`).join(', ')}`)
}

const fullyOk = results.filter(r => r.ok === r.total).length
const partial = results.filter(r => r.ok > 0 && r.ok < r.total).length
const broken = results.filter(r => r.ok === 0).length
console.log(`\n${fullyOk} states OK, ${partial} partial, ${broken} broken`)

if (partial || broken) {
  console.log('\nFAILURES:')
  for (const r of results) {
    if (r.ok < r.total) {
      for (const s of r.samples) {
        if (!s.ok) console.log(`  ${r.state}: ${s.name} (id=${s.tempId}) — ${s.msg}`)
      }
    }
  }
}
