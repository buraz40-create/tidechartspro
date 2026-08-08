const fs = require('fs')
const path = require('path')

const libDir = 'D:/tidechartspro.com/apps/web/lib'
const outFile = 'D:/tidechartspro.com/apps/mobile/src/data/tempStations.ts'

const files = fs.readdirSync(libDir).filter(f => /-stations\.ts$/.test(f))
const map = {}
let total = 0, selfMapped = 0
const re = /id:\s*"([^"]+)"\s*,\s*waterTempId:\s*"([^"]+)"/g

for (const f of files) {
  const txt = fs.readFileSync(path.join(libDir, f), 'utf8')
  let m
  while ((m = re.exec(txt)) !== null) {
    const id = m[1], temp = m[2]
    total++
    if (temp === id) selfMapped++
    map[id] = temp
  }
}

// Sort keys for a stable, diff-friendly output
const keys = Object.keys(map).sort()
const lines = keys.map(k => `  "${k}": "${map[k]}",`).join('\n')

const out = `// AUTO-GENERATED — do not edit by hand.
// Source: apps/web/lib/*-stations.ts (station id -> nearest live NOAA water-temp station).
// Regenerate: node scripts/gen-temp-map.cjs
//
// Every tide station maps to a NOAA station that actually reports water
// temperature. Dead temp stations were already filtered out on the web side.

export const TEMP_STATION_MAP: Record<string, string> = {
${lines}
}

/** Resolve the water-temperature station id for a given tide station. */
export function tempStationFor(noaaId: string, fallback?: string): string {
  return TEMP_STATION_MAP[noaaId] ?? fallback ?? noaaId
}
`

fs.writeFileSync(outFile, out)
console.log(`Wrote ${keys.length} mappings (${total} stations scanned, ${selfMapped} self-mapped) -> ${outFile}`)
console.log('Spot checks:')
;['8720232', '8720001', '8720218'].forEach(id => console.log(`  ${id} -> ${map[id] ?? '(not found)'}`))
