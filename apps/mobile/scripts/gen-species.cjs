const fs = require('fs')
const path = require('path')

const libDir = 'D:/tidechartspro.com/apps/web/lib'
const outFile = 'D:/tidechartspro.com/apps/mobile/src/data/stationSpecies.ts'

// String-aware matcher: from the '[' at startIdx, return index of the matching ']'
function matchBracket(txt, startIdx) {
  let depth = 0, inStr = null, esc = false
  for (let i = startIdx; i < txt.length; i++) {
    const c = txt[i]
    if (inStr) {
      if (esc) esc = false
      else if (c === '\\') esc = true
      else if (c === inStr) inStr = null
      continue
    }
    if (c === '"' || c === "'" || c === '`') inStr = c
    else if (c === '[') depth++
    else if (c === ']') { depth--; if (depth === 0) return i }
  }
  return -1
}

const files = fs.readdirSync(libDir).filter(f => /-stations\.ts$/.test(f))
const stationSpecies = {}   // noaaId -> mobile-shape species[]
let scanned = 0

for (const f of files) {
  const txt = fs.readFileSync(path.join(libDir, f), 'utf8')
  const m = /export const \w+\s*:\s*StationConfig\[\]\s*=\s*\[/.exec(txt)
  if (!m) { console.log('  (no station array)', f); continue }
  const openIdx = txt.indexOf('[', m.index + m[0].length - 1)
  const closeIdx = matchBracket(txt, openIdx)
  if (closeIdx < 0) { console.log('  (unbalanced)', f); continue }
  const arrText = txt.slice(openIdx, closeIdx + 1)
  let arr
  try { arr = (new Function('return ' + arrText))() } catch (e) { console.log('  eval failed', f, e.message); continue }
  for (const st of arr) {
    if (!st || !st.id) continue
    scanned++
    const sp = Array.isArray(st.species) ? st.species
      .filter(x => x && x.name)
      .map(x => ({
        name: String(x.name),
        icon: String(x.icon || '🐟'),
        regulation: String(x.regulation || ''),
        tip: String(x.when || x.tip || ''),
        tipColor: String(x.color || '#22c55e'),
        bait: String(x.bait || ''),
      })) : []
    if (sp.length) stationSpecies[st.id] = sp
  }
}

// Dedupe identical species sets
const setsIndex = new Map()
const sets = []
const stationToSet = {}
for (const [id, sp] of Object.entries(stationSpecies)) {
  const key = JSON.stringify(sp)
  let idx = setsIndex.get(key)
  if (idx === undefined) { idx = sets.length; sets.push(sp); setsIndex.set(key, idx) }
  stationToSet[id] = idx
}

const setsLines = sets.map(sp => '  ' + JSON.stringify(sp)).join(',\n')
const mapLines = Object.keys(stationToSet).sort().map(k => `  "${k}": ${stationToSet[k]},`).join('\n')

const out = `// AUTO-GENERATED — do not edit by hand.
// Source: apps/web/lib/*-stations.ts (per-station local species).
// Regenerate: node scripts/gen-species.cjs

export interface Species {
  name: string
  icon: string
  regulation: string
  tip: string
  tipColor: string
  bait: string
}

// Unique species sets (deduped — many stations share the same list).
export const SPECIES_SETS: Species[][] = [
${setsLines}
]

// Station id -> index into SPECIES_SETS.
export const STATION_SPECIES: Record<string, number> = {
${mapLines}
}

/** Local species for a station, or null if none is mapped (caller falls back). */
export function speciesFor(noaaId: string): Species[] | null {
  const i = STATION_SPECIES[noaaId]
  return i == null ? null : SPECIES_SETS[i]
}
`

fs.writeFileSync(outFile, out)
console.log(`Scanned ${scanned} stations; ${Object.keys(stationToSet).length} have species; ${sets.length} unique sets -> ${outFile}`)
