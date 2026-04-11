// Generates lib/{state}-stations.ts for Alabama, Mississippi, Louisiana, Texas
// Fetches station list from NOAA CO-OPS metadata API
// Run: node apps/web/scripts/generate-gulf-stations.mjs

import { writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

// ─── Fetch NOAA stations — merge tidepredictions + historicwl ────────────────

console.log('Fetching NOAA station lists…')
const UA = { 'User-Agent': 'TideChartsPro/1.0 (tidechartspro.com)' }
const [tpRes, hwlRes] = await Promise.all([
  fetch('https://api.tidesandcurrents.noaa.gov/mdapi/prod/webapi/stations.json?type=tidepredictions', { headers: UA }),
  fetch('https://api.tidesandcurrents.noaa.gov/mdapi/prod/webapi/stations.json?type=historicwl', { headers: UA }),
])
const tpJson  = await tpRes.json()
const hwlJson = await hwlRes.json()

// Merge, deduplicate by ID
const seenIds = new Set(tpJson.stations.map(s => s.id))
const merged  = [
  ...tpJson.stations,
  ...hwlJson.stations.filter(s => !seenIds.has(s.id) && s.tidal),
]
const allStations = merged
console.log(`tidepredictions: ${tpJson.stations.length} | historicwl_extra: ${merged.length - tpJson.stations.length} | merged total: ${merged.length}`)

// ─── State configs ────────────────────────────────────────────────────────────

const STATE_CONFIGS = {
  AL: {
    stateName: 'alabama',
    displayName: 'Alabama',
    stateAbbr: 'AL',
    constName: 'ALABAMA_STATIONS',
    exportSuffix: 'Alabama',
  },
  MS: {
    stateName: 'mississippi',
    displayName: 'Mississippi',
    stateAbbr: 'MS',
    constName: 'MISSISSIPPI_STATIONS',
    exportSuffix: 'Mississippi',
  },
  LA: {
    stateName: 'louisiana',
    displayName: 'Louisiana',
    stateAbbr: 'LA',
    constName: 'LOUISIANA_STATIONS',
    exportSuffix: 'Louisiana',
  },
  TX: {
    stateName: 'texas',
    displayName: 'Texas',
    stateAbbr: 'TX',
    constName: 'TEXAS_STATIONS',
    exportSuffix: 'Texas',
  },
}

// ─── Slug generation ─────────────────────────────────────────────────────────

function toSlug(name) {
  return name
    .toLowerCase()
    .replace(/\s*[-–—]\s*/g, '-')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 80)
}

// ─── Region assignment ────────────────────────────────────────────────────────

function getRegion(abbr, lat, lon) {
  switch (abbr) {
    case 'AL':
      if (lat < 30.35) return 'Alabama Gulf Coast'
      return 'Mobile Bay'
    case 'MS':
      if (lon > -88.8) return 'Pascagoula Area'
      return 'Mississippi Sound'
    case 'LA':
      if (lon < -93.5) return 'Calcasieu / Sabine'
      if (lon < -92.5) return 'Cameron'
      if (lon < -91.5) return 'Vermilion / Atchafalaya'
      if (lon < -90.5) return 'Barataria / New Orleans'
      return 'Breton Sound / Mississippi Delta'
    case 'TX':
      if (lon > -94.0) return 'Sabine / Beaumont'
      if (lon > -95.3) return 'Galveston Bay'
      if (lon > -96.5) return 'Matagorda Bay'
      if (lon > -97.5) return 'Aransas / Corpus Christi'
      return 'Lower Laguna Madre'
    default:
      return 'Gulf Coast'
  }
}

// ─── Tidal type (Gulf is predominantly diurnal) ───────────────────────────────

function getTidalType() {
  return 'diurnal'
}

// ─── Mean range (Gulf ranges are small) ──────────────────────────────────────

function getMeanRange(abbr, lat) {
  // Gulf of Mexico ranges: 1.0–1.8 ft depending on area
  if (abbr === 'AL') return lat > 30.5 ? 1.8 : 1.5
  if (abbr === 'MS') return 1.4
  if (abbr === 'LA') return 1.2
  if (abbr === 'TX') return lat > 29.5 ? 1.4 : 1.1
  return 1.3
}

// ─── Water temp defaults ──────────────────────────────────────────────────────

function getWaterTemp(abbr, lat) {
  if (lat > 30.2) return '68°F'
  if (lat > 29.0) return '72°F'
  return '76°F'
}

// ─── Sun params (all Central Time) ───────────────────────────────────────────

function getSunParams(lat, lon) {
  return {
    sunLat:     Math.round(lat * 100) / 100,
    sunMeridian: 90,
    sunLon:     Math.round(Math.abs(lon) * 100) / 100,
    utcOffset:  0,
    sunriseRef: +(6.9 - (lat - 30) * 0.06).toFixed(2),
    sunsetRef:  +(19.7 + (lat - 30) * 0.04).toFixed(2),
  }
}

// ─── Species templates ────────────────────────────────────────────────────────

const SPECIES = {
  // Alabama regions
  'Alabama Gulf Coast': `[
    { name: 'Red Snapper',      icon: '🎣', color: '#ef4444', bait: 'Squid, cigar minnow, live shrimp',  regulation: '16″ min · 2/day · season',  when: 'Offshore reefs & rigs — major solunar' },
    { name: 'Redfish',          icon: '🎣', color: '#f97316', bait: 'Mullet chunk, shrimp, DOA crab',    regulation: 'Slot 18–27″ · 5/day',       when: 'Outgoing tide on flats & marsh edges' },
    { name: 'Speckled Trout',   icon: '🐟', color: '#60a5fa', bait: 'Mirrolure, live shrimp, gulp',      regulation: 'Slot 12–15″ · 15/day',      when: 'Early morning grass flats — incoming' },
    { name: 'Flounder',         icon: '🐡', color: '#34d399', bait: 'Gulp! shrimp, finger mullet',       regulation: '12″ min · 10/day',          when: 'Incoming tide near passes & drop-offs' },
    { name: 'Spanish Mackerel', icon: '🐡', color: '#facc15', bait: 'Gotcha plug, Clarkspoon, pilchard', regulation: '12″ min · 7/day',           when: 'Open water — outgoing tide & passes' },
  ]`,
  'Mobile Bay': `[
    { name: 'Redfish',          icon: '🎣', color: '#f97316', bait: 'Mullet chunk, shrimp, soft plastic', regulation: 'Slot 18–27″ · 5/day',      when: 'Outgoing tide on flats & grass beds' },
    { name: 'Speckled Trout',   icon: '🐟', color: '#60a5fa', bait: 'Mirrolure, live shrimp, croaker',   regulation: 'Slot 12–15″ · 15/day',     when: 'Early morning grass flats' },
    { name: 'Flounder',         icon: '🐡', color: '#34d399', bait: 'Gulp! shrimp, live mud minnow',     regulation: '12″ min · 10/day',         when: 'Incoming tide near drop-offs & channels' },
    { name: 'Sheepshead',       icon: '🐡', color: '#a78bfa', bait: 'Fiddler crab, barnacle, shrimp',    regulation: '10″ min · 8/day',          when: 'Structure — bridges, piers, pilings' },
    { name: 'Black Drum',       icon: '🐟', color: '#94a3b8', bait: 'Crab, shrimp, cut mullet',          regulation: '12″ min · 5/day',          when: 'Incoming tide — channels & shell beds' },
  ]`,
  // Mississippi regions
  'Mississippi Sound': `[
    { name: 'Speckled Trout',   icon: '🐟', color: '#60a5fa', bait: 'Mirrolure, live shrimp, popping cork', regulation: 'Slot 12–15″ · 15/day', when: 'Early morning grass flats — incoming tide' },
    { name: 'Redfish',          icon: '🎣', color: '#f97316', bait: 'Mullet chunk, shrimp, gold spoon',     regulation: 'Slot 18–27″ · 5/day',  when: 'Outgoing tide on flats & marsh edges' },
    { name: 'Flounder',         icon: '🐡', color: '#34d399', bait: 'Gulp! shrimp, finger mullet',          regulation: '12″ min · 10/day',     when: 'Incoming tide near drop-offs' },
    { name: 'Sheepshead',       icon: '🐡', color: '#a78bfa', bait: 'Fiddler crab, barnacle',               regulation: '10″ min · 8/day',      when: 'Structure — pilings & jetties' },
    { name: 'Red Snapper',      icon: '🎣', color: '#ef4444', bait: 'Squid, live shrimp, menhaden',         regulation: '16″ min · 2/day · season', when: 'Offshore reefs & artificial structures' },
  ]`,
  'Pascagoula Area': `[
    { name: 'Speckled Trout',   icon: '🐟', color: '#60a5fa', bait: 'Mirrolure, live shrimp, popping cork', regulation: 'Slot 12–15″ · 15/day', when: 'Early morning grass flats — incoming tide' },
    { name: 'Redfish',          icon: '🎣', color: '#f97316', bait: 'Mullet, shrimp, crab imitation',        regulation: 'Slot 18–27″ · 5/day',  when: 'Outgoing tide on flats' },
    { name: 'Red Snapper',      icon: '🎣', color: '#ef4444', bait: 'Squid, cigar minnow, live bait',        regulation: '16″ min · 2/day · season', when: 'Offshore — major solunar' },
    { name: 'Flounder',         icon: '🐡', color: '#34d399', bait: 'Gulp! shrimp, finger mullet',           regulation: '12″ min · 10/day',     when: 'Incoming tide near passes' },
    { name: 'Cobia',            icon: '🐟', color: '#a78bfa', bait: 'Live eel, crab, bucktail jig',          regulation: '33″ min · 1/day',      when: 'Spring migration — nearshore, solunar major' },
  ]`,
  // Louisiana regions
  'Calcasieu / Sabine': `[
    { name: 'Redfish',          icon: '🎣', color: '#f97316', bait: 'Shrimp, crab, gold spoon',           regulation: 'Slot 16–27″ · 5/day',  when: 'Outgoing tide on marsh edges & flats' },
    { name: 'Speckled Trout',   icon: '🐟', color: '#60a5fa', bait: 'Mirrolure, live shrimp, popping cork', regulation: 'Slot 12–25″ · 25/day', when: 'Early morning grass flats' },
    { name: 'Flounder',         icon: '🐡', color: '#34d399', bait: 'Gulp! shrimp, finger mullet',         regulation: '10″ min · 15/day',     when: 'Incoming tide near drop-offs & jetties' },
    { name: 'Sheepshead',       icon: '🐡', color: '#a78bfa', bait: 'Fiddler crab, barnacle, shrimp',      regulation: '10″ min · 15/day',     when: 'Structure — jetties & pilings' },
    { name: 'Black Drum',       icon: '🐟', color: '#94a3b8', bait: 'Crab, shrimp, cut mullet',            regulation: '12″ min · 5/day',      when: 'Incoming tide — channels & shell beds' },
  ]`,
  'Cameron': `[
    { name: 'Redfish',          icon: '🎣', color: '#f97316', bait: 'Shrimp under cork, gold spoon, crab',  regulation: 'Slot 16–27″ · 5/day',  when: 'Outgoing tide on marsh flats' },
    { name: 'Speckled Trout',   icon: '🐟', color: '#60a5fa', bait: 'Mirrolure, live shrimp',               regulation: 'Slot 12–25″ · 25/day', when: 'Early morning grass flats' },
    { name: 'Flounder',         icon: '🐡', color: '#34d399', bait: 'Gulp! shrimp, mud minnow',             regulation: '10″ min · 15/day',     when: 'Incoming tide near drop-offs' },
    { name: 'Tripletail',       icon: '🐡', color: '#facc15', bait: 'Live shrimp, small jig',               regulation: '17″ min · 5/day',      when: 'Floating debris & crab traps — major solunar' },
    { name: 'Cobia',            icon: '🐟', color: '#a78bfa', bait: 'Live eel, crab, bucktail jig',         regulation: '33″ min · 1/day',      when: 'Spring nearshore migration — solunar major' },
  ]`,
  'Vermilion / Atchafalaya': `[
    { name: 'Redfish',          icon: '🎣', color: '#f97316', bait: 'Shrimp, crab, gold spoon',           regulation: 'Slot 16–27″ · 5/day',  when: 'Outgoing tide on marsh edges & ponds' },
    { name: 'Speckled Trout',   icon: '🐟', color: '#60a5fa', bait: 'Mirrolure, live shrimp',             regulation: 'Slot 12–25″ · 25/day', when: 'Early morning grass flats' },
    { name: 'Flounder',         icon: '🐡', color: '#34d399', bait: 'Gulp! shrimp, finger mullet',        regulation: '10″ min · 15/day',     when: 'Incoming tide near shell pads & channels' },
    { name: 'Tripletail',       icon: '🐡', color: '#facc15', bait: 'Live shrimp, small bucktail jig',    regulation: '17″ min · 5/day',      when: 'Floating structure — major solunar' },
    { name: 'Black Drum',       icon: '🐟', color: '#94a3b8', bait: 'Crab, shrimp, cut mullet',           regulation: '12″ min · 5/day',      when: 'Incoming tide — channels & shell pads' },
  ]`,
  'Barataria / New Orleans': `[
    { name: 'Redfish',          icon: '🎣', color: '#f97316', bait: 'Shrimp under cork, crab, gold spoon', regulation: 'Slot 16–27″ · 5/day',  when: 'Outgoing tide on marsh flats & ponds' },
    { name: 'Speckled Trout',   icon: '🐟', color: '#60a5fa', bait: 'Mirrolure, live shrimp',              regulation: 'Slot 12–25″ · 25/day', when: 'Early morning points & grass flats' },
    { name: 'Sheepshead',       icon: '🐡', color: '#a78bfa', bait: 'Fiddler crab, barnacle, shrimp',      regulation: '10″ min · 15/day',     when: 'Structure — pilings, bridges, jetties' },
    { name: 'Flounder',         icon: '🐡', color: '#34d399', bait: 'Gulp! shrimp, finger mullet',         regulation: '10″ min · 15/day',     when: 'Incoming tide near drop-offs & passes' },
    { name: 'Tripletail',       icon: '🐡', color: '#facc15', bait: 'Live shrimp, small jig',              regulation: '17″ min · 5/day',      when: 'Floating crab traps & debris — major solunar' },
  ]`,
  'Breton Sound / Mississippi Delta': `[
    { name: 'Redfish',          icon: '🎣', color: '#f97316', bait: 'Live shrimp, crab, gold spoon',      regulation: 'Slot 16–27″ · 5/day',  when: 'Outgoing tide on flats & pass edges' },
    { name: 'Speckled Trout',   icon: '🐟', color: '#60a5fa', bait: 'Mirrolure, live shrimp, popping cork', regulation: 'Slot 12–25″ · 25/day', when: 'Early morning grass flats & bay shorelines' },
    { name: 'Flounder',         icon: '🐡', color: '#34d399', bait: 'Gulp! shrimp, mud minnow',           regulation: '10″ min · 15/day',     when: 'Incoming tide near passes & drop-offs' },
    { name: 'Sheepshead',       icon: '🐡', color: '#a78bfa', bait: 'Fiddler crab, barnacle, shrimp',     regulation: '10″ min · 15/day',     when: 'Structure — jetties, pilings, shell pads' },
    { name: 'Black Drum',       icon: '🐟', color: '#94a3b8', bait: 'Crab, shrimp, cut mullet',           regulation: '12″ min · 5/day',      when: 'Incoming tide — channels & shell beds' },
  ]`,
  // Texas regions
  'Sabine / Beaumont': `[
    { name: 'Redfish',          icon: '🎣', color: '#f97316', bait: 'Shrimp, crab, gold spoon',           regulation: 'Slot 20–28″ · 3/day',  when: 'Outgoing tide on flats & marsh edges' },
    { name: 'Speckled Trout',   icon: '🐟', color: '#60a5fa', bait: 'Mirrolure, live shrimp, gulp',       regulation: 'Slot 15–25″ · 5/day',  when: 'Early morning grass flats' },
    { name: 'Flounder',         icon: '🐡', color: '#34d399', bait: 'Gulp! shrimp, live mud minnow',      regulation: '14″ min · 10/day',     when: 'Incoming tide near passes & drop-offs' },
    { name: 'Sheepshead',       icon: '🐡', color: '#a78bfa', bait: 'Fiddler crab, barnacle, shrimp',     regulation: '12″ min · no limit',   when: 'Structure — piers, jetties, pilings' },
    { name: 'Black Drum',       icon: '🐟', color: '#94a3b8', bait: 'Crab, shrimp, sand worm',            regulation: 'Slot 14–30″ · 5/day',  when: 'Incoming tide — channels & shell beds' },
  ]`,
  'Galveston Bay': `[
    { name: 'Speckled Trout',   icon: '🐟', color: '#60a5fa', bait: 'Mirrolure, live shrimp, gulp',       regulation: 'Slot 15–25″ · 5/day',  when: 'Early morning grass flats & bay shorelines' },
    { name: 'Redfish',          icon: '🎣', color: '#f97316', bait: 'Shrimp, crab, gold spoon',           regulation: 'Slot 20–28″ · 3/day',  when: 'Outgoing tide on flats & reefs' },
    { name: 'Flounder',         icon: '🐡', color: '#34d399', bait: 'Gulp! shrimp, live mud minnow',      regulation: '14″ min · 10/day',     when: 'Incoming tide near passes & drop-offs' },
    { name: 'Black Drum',       icon: '🐟', color: '#94a3b8', bait: 'Crab, shrimp, sand worm',            regulation: 'Slot 14–30″ · 5/day',  when: 'Incoming tide — channels & oyster reefs' },
    { name: 'Sheepshead',       icon: '🐡', color: '#a78bfa', bait: 'Fiddler crab, barnacle, shrimp',     regulation: '12″ min · no limit',   when: 'Structure — jetties, pilings, wrecks' },
  ]`,
  'Matagorda Bay': `[
    { name: 'Speckled Trout',   icon: '🐟', color: '#60a5fa', bait: 'Mirrolure, live shrimp, gulp',       regulation: 'Slot 15–25″ · 5/day',  when: 'Early morning grass flats — incoming tide' },
    { name: 'Redfish',          icon: '🎣', color: '#f97316', bait: 'Shrimp, crab, gold spoon, topwater',  regulation: 'Slot 20–28″ · 3/day',  when: 'Outgoing tide on seagrass flats' },
    { name: 'Flounder',         icon: '🐡', color: '#34d399', bait: 'Gulp! shrimp, finger mullet',         regulation: '14″ min · 10/day',     when: 'Incoming tide near passes & channels' },
    { name: 'Black Drum',       icon: '🐟', color: '#94a3b8', bait: 'Crab, shrimp, sand worm',             regulation: 'Slot 14–30″ · 5/day',  when: 'Incoming tide — channels & oyster reefs' },
    { name: 'Cobia',            icon: '🐡', color: '#facc15', bait: 'Live eel, crab, bucktail jig',        regulation: '33″ min · 1/day',      when: 'Spring nearshore migration — major solunar' },
  ]`,
  'Aransas / Corpus Christi': `[
    { name: 'Speckled Trout',   icon: '🐟', color: '#60a5fa', bait: 'Mirrolure, live shrimp, gulp',       regulation: 'Slot 15–25″ · 5/day',  when: 'Early morning grass flats — incoming tide' },
    { name: 'Redfish',          icon: '🎣', color: '#f97316', bait: 'Shrimp, crab, gold spoon, topwater',  regulation: 'Slot 20–28″ · 3/day',  when: 'Outgoing tide on shallow flats' },
    { name: 'Black Drum',       icon: '🐟', color: '#94a3b8', bait: 'Crab, shrimp, sand worm',             regulation: 'Slot 14–30″ · 5/day',  when: 'Incoming tide — channels & oyster reefs' },
    { name: 'Flounder',         icon: '🐡', color: '#34d399', bait: 'Gulp! shrimp, live mud minnow',       regulation: '14″ min · 10/day',     when: 'Incoming tide near passes & drop-offs' },
    { name: 'Cobia',            icon: '🐡', color: '#facc15', bait: 'Live eel, crab, bucktail jig',        regulation: '33″ min · 1/day',      when: 'Spring nearshore — solunar major' },
  ]`,
  'Lower Laguna Madre': `[
    { name: 'Speckled Trout',   icon: '🐟', color: '#60a5fa', bait: 'Mirrolure, live shrimp, gulp',       regulation: 'Slot 15–25″ · 5/day',  when: 'Early morning ultra-shallow flats (wade fishing)' },
    { name: 'Redfish',          icon: '🎣', color: '#f97316', bait: 'Shrimp, crab, gold spoon',           regulation: 'Slot 20–28″ · 3/day',  when: 'Tailing fish on shallow flats — incoming tide' },
    { name: 'Black Drum',       icon: '🐟', color: '#94a3b8', bait: 'Crab, shrimp, sand worm',            regulation: 'Slot 14–30″ · 5/day',  when: 'Shell pads & channels — incoming tide' },
    { name: 'Flounder',         icon: '🐡', color: '#34d399', bait: 'Gulp! shrimp, live mud minnow',      regulation: '14″ min · 10/day',     when: 'Incoming tide near passes & drop-offs' },
    { name: 'Sheepshead',       icon: '🐡', color: '#a78bfa', bait: 'Fiddler crab, barnacle, shrimp',     regulation: '12″ min · no limit',   when: 'Structure — pilings & jetties' },
  ]`,
}

// ─── Haversine distance ───────────────────────────────────────────────────────

function haversineMi(lat1, lon1, lat2, lon2) {
  const R = 3958.8
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2
  return R * 2 * Math.asin(Math.sqrt(a))
}

// ─── Generate each state ──────────────────────────────────────────────────────

for (const [abbr, cfg] of Object.entries(STATE_CONFIGS)) {
  const raw = allStations
    .filter(s => s.state === abbr)
    .map(s => ({
      id:   s.id,
      name: s.name,
      lat:  parseFloat(s.lat),
      lon:  parseFloat(s.lng),
    }))
    .filter(s => !isNaN(s.lat) && !isNaN(s.lon))

  console.log(`${abbr}: ${raw.length} stations`)

  // Assign slugs (unique per state)
  const slugsSeen = new Set()
  const stationMeta = raw.map(s => {
    let slug = toSlug(s.name)
    if (slugsSeen.has(slug)) slug = `${slug}-${s.id}`
    slugsSeen.add(slug)
    const region = getRegion(abbr, s.lat, s.lon)
    return { ...s, slug, region }
  })

  // Nearest 4 within state
  function getNearby(s) {
    return stationMeta
      .filter(o => o.id !== s.id)
      .map(o => ({ ...o, dist: haversineMi(s.lat, s.lon, o.lat, o.lon) }))
      .sort((a, b) => a.dist - b.dist)
      .slice(0, 4)
      .map(o => `    { name: ${JSON.stringify(o.name)}, lat: ${o.lat}, lon: ${o.lon}, slug: ${JSON.stringify(o.slug)} }`)
      .join(',\n')
  }

  // Build TypeScript source
  let output = `// AUTO-GENERATED — do not edit by hand.
// Source: NOAA CO-OPS tide prediction stations, ${cfg.displayName}
// Regenerate: node apps/web/scripts/generate-gulf-stations.mjs

import type { StationConfig, NearbyStation, Species } from './florida-stations'
export type { StationConfig, NearbyStation, Species }

export const ${cfg.constName}: StationConfig[] = [
`

  for (const s of stationMeta) {
    const sun = getSunParams(s.lat, s.lon)
    const latDeg = Math.abs(s.lat).toFixed(2)
    const lonDeg = Math.abs(s.lon).toFixed(2)
    const latDisplay = `${latDeg}°${s.lat >= 0 ? 'N' : 'S'}`
    const lonDisplay = `${lonDeg}°${s.lon >= 0 ? 'E' : 'W'}`
    const nearby = getNearby(s)
    const species = SPECIES[s.region] || SPECIES['Alabama Gulf Coast']

    output += `  {
    id: ${JSON.stringify(s.id)}, waterTempId: ${JSON.stringify(s.id)},
    name: ${JSON.stringify(s.name)}, slug: ${JSON.stringify(s.slug)},
    state: ${JSON.stringify(cfg.stateName)}, city: ${JSON.stringify(s.name + ', ' + abbr)}, region: ${JSON.stringify(s.region)},
    lat: ${s.lat}, lon: ${s.lon}, latDisplay: ${JSON.stringify(latDisplay)}, lonDisplay: ${JSON.stringify(lonDisplay)},
    sunLat: ${sun.sunLat}, sunMeridian: ${sun.sunMeridian}, sunLon: ${sun.sunLon}, utcOffset: ${sun.utcOffset},
    sunriseRef: ${sun.sunriseRef}, sunsetRef: ${sun.sunsetRef},
    tidalType: '${getTidalType()}', meanRange: ${getMeanRange(abbr, s.lat)}, waterTempDefault: '${getWaterTemp(abbr, s.lat)}',
    nearby: [
${nearby}
    ],
    species: ${species},
  },
`
  }

  output += `]

export function getStationBySlug(slug: string): StationConfig | undefined {
  return ${cfg.constName}.find(s => s.slug === slug)
}

export function getAllSlugs(): string[] {
  return ${cfg.constName}.map(s => s.slug)
}
`

  const outPath = join(root, `lib/${cfg.stateName}-stations.ts`)
  writeFileSync(outPath, output, 'utf8')
  console.log(`✓ Wrote ${stationMeta.length} stations → lib/${cfg.stateName}-stations.ts`)
}

console.log('\nDone.')
