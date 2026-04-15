import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const webLibDir = join(__dirname, '../../web/lib')
const outDir = join(__dirname, '../src/data')
const outFile = join(outDir, 'stations.ts')

const STATE_MAP = {
  AL:'alabama', AK:'alaska', CA:'california', CT:'connecticut',
  DE:'delaware', FL:'florida', GA:'georgia', HI:'hawaii',
  LA:'louisiana', ME:'maine', MD:'maryland', MA:'massachusetts',
  MS:'mississippi', NH:'new-hampshire', NJ:'new-jersey', NY:'new-york',
  NC:'north-carolina', OR:'oregon', RI:'rhode-island', SC:'south-carolina',
  TX:'texas', VA:'virginia', WA:'washington',
}

mkdirSync(outDir, { recursive: true })

const result = {}
const regionMap = {}  // code -> sorted unique region names

for (const [code, slug] of Object.entries(STATE_MAP)) {
  const src = readFileSync(join(webLibDir, `${slug}-stations.ts`), 'utf-8')
  const stations = []
  const regionSet = new Set()
  // Extract id, name, region, lat, lon (field order: id, name, region, lat, lon)
  const re = /id:\s*"(\d+)"[^}]*?name:\s*"([^"]+)"[^}]*?region:\s*"([^"]+)"[^}]*?lat:\s*([\d.-]+),\s*lon:\s*([\d.-]+)/gs
  let m
  while ((m = re.exec(src)) !== null) {
    stations.push({ id: m[1], name: m[2], region: m[3], lat: parseFloat(m[4]), lon: parseFloat(m[5]) })
    regionSet.add(m[3])
  }
  result[code] = stations
  regionMap[code] = [...regionSet].sort((a, b) => a.localeCompare(b))
  console.log(`${code}: ${stations.length} stations, ${regionSet.size} regions`)
}

const out = `// AUTO-GENERATED — run: node apps/mobile/scripts/generate-stations.mjs
export type BStation = { id: string; name: string; lat: number; lon: number; region: string }
export const STATIONS: Record<string, BStation[]> = ${JSON.stringify(result)}
export const REGIONS: Record<string, string[]> = ${JSON.stringify(regionMap)}
`
writeFileSync(outFile, out)
console.log(`\nWrote ${outFile}`)
