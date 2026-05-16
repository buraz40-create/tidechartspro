// Test every NOAA station listed as having water temp to confirm it actually returns data.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const tempData = JSON.parse(fs.readFileSync(path.resolve(__dirname, '..', '..', '..', 'noaa-temp-stations.json'), 'utf8'))

const stations = tempData.stations.map(s => ({
  id: s.id, name: s.name, state: s.state,
  lat: parseFloat(s.lat), lon: parseFloat(s.lng),
})).filter(s => Number.isFinite(s.lat) && Number.isFinite(s.lon))

console.log(`Testing ${stations.length} NOAA temp stations...`)

const live = []
const dead = []
const BATCH = 10

for (let i = 0; i < stations.length; i += BATCH) {
  const chunk = stations.slice(i, i + BATCH)
  const results = await Promise.all(chunk.map(async s => {
    const url = `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?station=${s.id}&product=water_temperature&time_zone=LST_LDT&interval=h&units=english&application=TideChartsPro&format=json&range=24`
    try {
      const r = await fetch(url)
      const d = await r.json()
      return { s, ok: !d.error && d.data?.length > 0 }
    } catch {
      return { s, ok: false }
    }
  }))
  for (const { s, ok } of results) {
    if (ok) live.push(s); else dead.push(s)
  }
  process.stdout.write(`\r${Math.min(i + BATCH, stations.length)}/${stations.length}`)
}
console.log()
console.log(`Live: ${live.length}, Dead: ${dead.length}`)

fs.writeFileSync(
  path.resolve(__dirname, '..', '..', '..', 'noaa-temp-stations-live.json'),
  JSON.stringify({ count: live.length, stations: live }, null, 2),
)
console.log('Wrote noaa-temp-stations-live.json')
