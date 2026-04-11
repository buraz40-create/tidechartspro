// Generates lib/florida-stations.ts from the NOAA CSV export
// Run: node apps/web/scripts/generate-florida-stations.mjs

import { readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// ─── Read CSV ────────────────────────────────────────────────────────────────

const csvPath = 'C:/Users/buraz/florida_tide_stations.csv'
const lines = readFileSync(csvPath, 'utf8').split('\n').slice(1) // skip header

const rawStations = []
for (const line of lines) {
  const trimmed = line.trim()
  if (!trimmed) continue
  // Format: ID,Name (may contain commas),Lat,Lon
  // Lat and Lon are always the last two comma-separated values
  const parts = trimmed.split(',')
  if (parts.length < 4) continue
  const id   = parts[0].trim()
  const lon  = parts[parts.length - 1].trim()
  const lat  = parts[parts.length - 2].trim()
  const name = parts.slice(1, parts.length - 2).join(',').trim()
  if (!id || !name || isNaN(parseFloat(lat)) || isNaN(parseFloat(lon))) continue
  rawStations.push({ id, name, lat: parseFloat(lat), lon: parseFloat(lon) })
}

console.log(`Read ${rawStations.length} stations`)

// ─── Slug generation ─────────────────────────────────────────────────────────

function toSlug(name) {
  return name
    .toLowerCase()
    .replace(/\s*[-–—]\s*/g, '-')  // dashes → hyphen
    .replace(/\s+/g, '-')           // spaces → hyphen
    .replace(/[^a-z0-9-]/g, '')    // remove everything else
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 80)
}

// Ensure unique slugs by appending station ID if collision
const slugsSeen = new Set()
function uniqueSlug(name, id) {
  let slug = toSlug(name)
  if (slugsSeen.has(slug)) {
    slug = `${slug}-${id}`
  }
  slugsSeen.add(slug)
  return slug
}

// ─── Region / type assignment based on station ID prefix ─────────────────────

function getRegion(id, lat, lon) {
  const n = parseInt(id)
  if (n < 8721000) return 'Northeast Florida'
  if (n < 8722000) return 'East Central Florida'
  if (n < 8723000) return 'Southeast Florida'
  if (n < 8725000) return 'Florida Keys'
  if (n < 8726000) return 'Southwest Florida'
  if (n < 8727000) return 'Tampa Bay'
  if (n < 8728000) return 'Big Bend Florida'
  return 'Florida Panhandle'
}

function getTidalType(id) {
  const n = parseInt(id)
  if (n >= 8728000) return 'diurnal'
  if (n >= 8723000 && n < 8727000) return 'mixed'
  return 'semidiurnal'
}

function getMeanRange(id) {
  const n = parseInt(id)
  if (n < 8721000) return 4.5
  if (n < 8722000) return 3.5
  if (n < 8723000) return 2.5
  if (n < 8725000) return 1.3
  if (n < 8726000) return 2.2
  if (n < 8727000) return 2.3
  if (n < 8728000) return 3.2
  return 1.4
}

function getWaterTemp(id) {
  const n = parseInt(id)
  if (n < 8721000) return '68°F'
  if (n < 8722000) return '72°F'
  if (n < 8723000) return '76°F'
  if (n < 8725000) return '79°F'
  if (n < 8726000) return '76°F'
  if (n < 8727000) return '74°F'
  if (n < 8728000) return '70°F'
  return '65°F'
}

function getSunParams(id, lat, lon) {
  const n = parseInt(id)
  const isPanhandle = n >= 8728000
  return {
    sunLat: Math.round(lat * 100) / 100,
    sunMeridian: isPanhandle ? 90 : 75,
    sunLon: Math.round(Math.abs(lon) * 100) / 100,
    utcOffset: isPanhandle ? 0 : 1,
    sunriseRef: +(7.2 - (lat - 30) * 0.06).toFixed(2),
    sunsetRef:  +(19.8 + (lat - 30) * 0.04).toFixed(2),
  }
}

// ─── Species templates by region ─────────────────────────────────────────────

const SPECIES = {
  'Northeast Florida': `[
    { name: 'Redfish',          icon: '🎣', color: '#f97316', bait: 'Mullet chunk, DOA shrimp',          regulation: 'Slot 18–27″ · 1/day',  when: 'Dawn & dusk outgoing tide' },
    { name: 'Spotted Seatrout', icon: '🐟', color: '#60a5fa', bait: 'Mirrolure, live shrimp',            regulation: 'Slot 15–19″ · 3/day',  when: 'Early morning flats' },
    { name: 'Black Drum',       icon: '🐟', color: '#a78bfa', bait: 'Blue crab, fiddler crab, shrimp',   regulation: '14″ min · 5/day',      when: 'Incoming tide · bridges & channels' },
    { name: 'Flounder',         icon: '🐡', color: '#34d399', bait: 'Gulp! shrimp, mud minnow',          regulation: '12″ min · 10/day',     when: 'Incoming tide near drop-offs' },
    { name: 'Sheepshead',       icon: '🐡', color: '#facc15', bait: 'Fiddler crab, barnacle',            regulation: '12″ min · 8/day',      when: 'Structure — bridges & pilings' },
  ]`,
  'East Central Florida': `[
    { name: 'Redfish',          icon: '🎣', color: '#f97316', bait: 'Mullet, shrimp, crab',              regulation: 'Slot 18–27″ · 1/day',  when: 'Outgoing tide on flats' },
    { name: 'Snook',            icon: '🐟', color: '#60a5fa', bait: 'Live pilchard, DOA shrimp',         regulation: 'Slot 28–33″ · 1/day',  when: 'Dawn · outgoing tide at passes' },
    { name: 'Spotted Seatrout', icon: '🐟', color: '#38bdf8', bait: 'Mirrolure TT, live shrimp',         regulation: 'Slot 15–19″ · 3/day',  when: 'Early morning incoming tide' },
    { name: 'Flounder',         icon: '🐡', color: '#34d399', bait: 'Gulp! shrimp, finger mullet',       regulation: '12″ min · 10/day',     when: 'Incoming tide near drop-offs' },
    { name: 'Pompano',          icon: '🐡', color: '#facc15', bait: 'Sand fleas, Fishbites',             regulation: '11″ min · 6/day',      when: 'Surf — wave troughs, incoming tide' },
  ]`,
  'Southeast Florida': `[
    { name: 'Snook',            icon: '🐟', color: '#60a5fa', bait: 'Live pilchard, white bait',         regulation: 'Slot 28–33″ · 1/day',  when: 'Outgoing tide at inlets, dawn' },
    { name: 'Redfish',          icon: '🎣', color: '#f97316', bait: 'Mullet chunk, crab',                regulation: 'Slot 18–27″ · 1/day',  when: 'Outgoing tide on flats' },
    { name: 'Tarpon',           icon: '🐟', color: '#a78bfa', bait: 'Live mullet, crab',                 regulation: 'Catch & release only',  when: 'Major solunar, incoming tide' },
    { name: 'Pompano',          icon: '🐡', color: '#facc15', bait: 'Sand fleas, Fishbites',             regulation: '11″ min · 6/day',      when: 'Surf — wave troughs, incoming tide' },
    { name: 'Spanish Mackerel', icon: '🐡', color: '#34d399', bait: 'Gotcha plug, Clarkspoon',           regulation: '12″ min · 7/day',      when: 'Outgoing tide near inlets' },
  ]`,
  'Florida Keys': `[
    { name: 'Bonefish',         icon: '🎣', color: '#f97316', bait: 'Live shrimp, crab, Crazy Charlie',  regulation: 'Catch & release only', when: 'Incoming tide on flats, 8–10 AM' },
    { name: 'Tarpon',           icon: '🐟', color: '#a78bfa', bait: 'Live mullet, crab, Clouser',        regulation: 'Catch & release only',  when: 'Major solunar, incoming tide' },
    { name: 'Permit',           icon: '🐡', color: '#60a5fa', bait: 'Live crab, EP shrimp fly',          regulation: 'Catch & release only',  when: 'Incoming tide — wrecks & flats' },
    { name: 'Snook',            icon: '🐟', color: '#34d399', bait: 'Pilchard, DOA shrimp',              regulation: 'Slot 28–33″ · 1/day',  when: 'Outgoing tide at mangrove points' },
    { name: 'Mutton Snapper',   icon: '🐡', color: '#facc15', bait: 'Live pilchard, squid',              regulation: '16″ min · 10/day',     when: 'Deeper water — incoming tide' },
  ]`,
  'Southwest Florida': `[
    { name: 'Snook',            icon: '🐟', color: '#60a5fa', bait: 'Live pilchard, white bait',         regulation: 'Slot 28–33″ · 1/day',  when: 'Outgoing tide at passes, dawn' },
    { name: 'Redfish',          icon: '🎣', color: '#f97316', bait: 'Mullet, DOA shrimp, crab',          regulation: 'Slot 18–27″ · 1/day',  when: 'Outgoing tide on flats' },
    { name: 'Spotted Seatrout', icon: '🐟', color: '#38bdf8', bait: 'Mirrolure, live shrimp',            regulation: 'Slot 15–19″ · 3/day',  when: 'Early morning grass flats' },
    { name: 'Tarpon',           icon: '🐟', color: '#a78bfa', bait: 'Live mullet, crab',                 regulation: 'Catch & release only',  when: 'Major solunar, passes at dawn' },
    { name: 'Sheepshead',       icon: '🐡', color: '#facc15', bait: 'Fiddler crab, barnacle, shrimp',    regulation: '12″ min · 8/day',      when: 'Structure — docks & pilings' },
  ]`,
  'Tampa Bay': `[
    { name: 'Snook',            icon: '🐟', color: '#60a5fa', bait: 'Live pilchard, white bait',         regulation: 'Slot 28–33″ · 1/day',  when: 'Outgoing tide at passes, dawn' },
    { name: 'Redfish',          icon: '🎣', color: '#f97316', bait: 'Mullet, DOA shrimp, crab',          regulation: 'Slot 18–27″ · 1/day',  when: 'Outgoing tide on flats' },
    { name: 'Spotted Seatrout', icon: '🐟', color: '#38bdf8', bait: 'Mirrolure, live shrimp',            regulation: 'Slot 15–19″ · 3/day',  when: 'Early morning grass flats' },
    { name: 'Tarpon',           icon: '🐟', color: '#a78bfa', bait: 'Live mullet, crab',                 regulation: 'Catch & release only',  when: 'Major solunar, passes at dawn' },
    { name: 'Sheepshead',       icon: '🐡', color: '#facc15', bait: 'Fiddler crab, barnacle, shrimp',    regulation: '12″ min · 8/day',      when: 'Structure — docks & pilings' },
  ]`,
  'Big Bend Florida': `[
    { name: 'Redfish',          icon: '🎣', color: '#f97316', bait: 'Mullet chunk, DOA shrimp, crab',    regulation: 'Slot 18–27″ · 1/day',  when: 'Outgoing tide on grass flats' },
    { name: 'Spotted Seatrout', icon: '🐟', color: '#60a5fa', bait: 'Mirrolure, live shrimp',            regulation: 'Slot 15–19″ · 3/day',  when: 'Early morning grass flats' },
    { name: 'Flounder',         icon: '🐡', color: '#34d399', bait: 'Gulp! shrimp, mud minnow',          regulation: '12″ min · 10/day',     when: 'Incoming tide near drop-offs' },
    { name: 'Spanish Mackerel', icon: '🐡', color: '#facc15', bait: 'Gotcha, Clarkspoon, live bait',     regulation: '12″ min · 7/day',      when: 'Open water — passes & nearshore' },
    { name: 'Sheepshead',       icon: '🐡', color: '#a78bfa', bait: 'Fiddler crab, barnacle',            regulation: '12″ min · 8/day',      when: 'Structure — bridges & pilings' },
  ]`,
  'Florida Panhandle': `[
    { name: 'Redfish',          icon: '🎣', color: '#f97316', bait: 'Mullet, DOA shrimp, popping cork',  regulation: 'Slot 18–27″ · 1/day', when: 'Outgoing tide, dawn & dusk' },
    { name: 'Spotted Seatrout', icon: '🐟', color: '#60a5fa', bait: 'Mirrolure, live shrimp',            regulation: 'Slot 15–19″ · 3/day', when: 'Early morning grass flats' },
    { name: 'Flounder',         icon: '🐡', color: '#34d399', bait: 'Gulp! shrimp, mud minnow',          regulation: '12″ min · 10/day',    when: 'Incoming tide near drop-offs' },
    { name: 'Cobia',            icon: '🐟', color: '#a78bfa', bait: 'Live eel, crab, bucktail jig',      regulation: '33″ min · 1/day',     when: 'Spring migration — nearshore, solunar major' },
    { name: 'Spanish Mackerel', icon: '🐡', color: '#facc15', bait: 'Gotcha plug, Clarkspoon',           regulation: '12″ min · 7/day',     when: 'Open water — outgoing tide' },
  ]`,
}

// ─── Nearby stations (3 nearest within 50 miles) ─────────────────────────────

function haversineMi(lat1, lon1, lat2, lon2) {
  const R = 3958.8
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)**2
  return R * 2 * Math.asin(Math.sqrt(a))
}

// Pre-assign slugs first so nearby refs are consistent
const stationMeta = rawStations.map(s => ({
  ...s,
  slug: uniqueSlug(s.name, s.id),
  region: getRegion(s.id, s.lat, s.lon),
}))

function getNearby(s) {
  return stationMeta
    .filter(o => o.id !== s.id)
    .map(o => ({ ...o, dist: haversineMi(s.lat, s.lon, o.lat, o.lon) }))
    .sort((a, b) => a.dist - b.dist)
    .slice(0, 4)
    .map(o => `    { name: ${JSON.stringify(o.name)}, lat: ${o.lat}, lon: ${o.lon}, slug: ${JSON.stringify(o.slug)} }`)
    .join(',\n')
}

// ─── Build TypeScript source ─────────────────────────────────────────────────

let output = `// AUTO-GENERATED — do not edit by hand.
// Source: NOAA CO-OPS tide prediction stations, Florida
// Regenerate: node apps/web/scripts/generate-florida-stations.mjs

export interface NearbyStation {
  name: string
  lat: number
  lon: number
  slug: string
}

export interface Species {
  name: string
  icon: string
  color: string
  bait: string
  regulation: string
  when: string
}

export interface StationConfig {
  id: string
  waterTempId: string
  name: string
  slug: string
  state: string
  city: string
  region: string
  lat: number
  lon: number
  latDisplay: string
  lonDisplay: string
  sunLat: number
  sunMeridian: number
  sunLon: number
  utcOffset: number
  sunriseRef: number
  sunsetRef: number
  tidalType: 'semidiurnal' | 'mixed' | 'diurnal'
  meanRange: number
  waterTempDefault: string
  nearby: NearbyStation[]
  species: Species[]
}

export const FLORIDA_STATIONS: StationConfig[] = [
`

let count = 0
for (const s of stationMeta) {
  const sun = getSunParams(s.id, s.lat, s.lon)
  const latDeg = Math.abs(s.lat).toFixed(2)
  const lonDeg = Math.abs(s.lon).toFixed(2)
  const latDisplay = `${latDeg}°${s.lat >= 0 ? 'N' : 'S'}`
  const lonDisplay = `${lonDeg}°${s.lon >= 0 ? 'E' : 'W'}`
  const region = s.region
  const nearby = getNearby(s)
  const species = SPECIES[region] || SPECIES['Northeast Florida']

  output += `  {
    id: ${JSON.stringify(s.id)}, waterTempId: ${JSON.stringify(s.id)},
    name: ${JSON.stringify(s.name)}, slug: ${JSON.stringify(s.slug)},
    state: 'florida', city: ${JSON.stringify(s.name + ', FL')}, region: ${JSON.stringify(region)},
    lat: ${s.lat}, lon: ${s.lon}, latDisplay: ${JSON.stringify(latDisplay)}, lonDisplay: ${JSON.stringify(lonDisplay)},
    sunLat: ${sun.sunLat}, sunMeridian: ${sun.sunMeridian}, sunLon: ${sun.sunLon}, utcOffset: ${sun.utcOffset},
    sunriseRef: ${sun.sunriseRef}, sunsetRef: ${sun.sunsetRef},
    tidalType: '${getTidalType(s.id)}', meanRange: ${getMeanRange(s.id)}, waterTempDefault: '${getWaterTemp(s.id)}',
    nearby: [
${nearby}
    ],
    species: ${species},
  },
`
  count++
}

output += `]

export function getStationBySlug(slug: string): StationConfig | undefined {
  return FLORIDA_STATIONS.find(s => s.slug === slug)
}

export function getAllSlugs(): string[] {
  return FLORIDA_STATIONS.map(s => s.slug)
}
`

const outPath = join(__dirname, '../lib/florida-stations.ts')
writeFileSync(outPath, output, 'utf8')
console.log(`✓ Wrote ${count} stations to ${outPath}`)
