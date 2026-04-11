// Generates lib/{state}-stations.ts + all route page.tsx files
// for GA, SC, NC, VA, MD, DE, NJ, NY, CT, RI, MA, NH, ME, CA, OR, WA, AK, HI
// Run: node apps/web/scripts/generate-all-states.mjs

import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

// ─── Fetch NOAA stations ──────────────────────────────────────────────────────

console.log('Fetching NOAA station data…')
const UA = { 'User-Agent': 'TideChartsPro/1.0 (tidechartspro.com)' }
const [tpRes, hwlRes] = await Promise.all([
  fetch('https://api.tidesandcurrents.noaa.gov/mdapi/prod/webapi/stations.json?type=tidepredictions', { headers: UA }),
  fetch('https://api.tidesandcurrents.noaa.gov/mdapi/prod/webapi/stations.json?type=historicwl',      { headers: UA }),
])
const tpStations  = (await tpRes.json()).stations
const hwlStations = (await hwlRes.json()).stations
const tpIds = new Set(tpStations.map(s => s.id))
const ALL   = [...tpStations, ...hwlStations.filter(s => !tpIds.has(s.id) && s.tidal)]
console.log(`Merged: ${ALL.length} total stations`)

// ─── State configurations ─────────────────────────────────────────────────────

const STATES = [
  // Atlantic Southeast
  { abbr:'GA', slug:'georgia',        displayName:'Georgia',        constName:'GEORGIA_STATIONS',        coast:'Atlantic Coast',  tz:'eastern', mapCenter:[31.5,-81.3],  mapZoom:7 },
  { abbr:'SC', slug:'south-carolina', displayName:'South Carolina', constName:'SOUTH_CAROLINA_STATIONS', coast:'Atlantic Coast',  tz:'eastern', mapCenter:[33.0,-80.2],  mapZoom:7 },
  { abbr:'NC', slug:'north-carolina', displayName:'North Carolina', constName:'NORTH_CAROLINA_STATIONS', coast:'Atlantic Coast',  tz:'eastern', mapCenter:[35.2,-76.8],  mapZoom:7 },
  // Atlantic Mid
  { abbr:'VA', slug:'virginia',       displayName:'Virginia',       constName:'VIRGINIA_STATIONS',       coast:'Atlantic Coast',  tz:'eastern', mapCenter:[37.2,-76.5],  mapZoom:7 },
  { abbr:'MD', slug:'maryland',       displayName:'Maryland',       constName:'MARYLAND_STATIONS',       coast:'Atlantic Coast',  tz:'eastern', mapCenter:[38.8,-76.4],  mapZoom:7 },
  { abbr:'DE', slug:'delaware',       displayName:'Delaware',       constName:'DELAWARE_STATIONS',       coast:'Atlantic Coast',  tz:'eastern', mapCenter:[39.0,-75.4],  mapZoom:8 },
  { abbr:'NJ', slug:'new-jersey',     displayName:'New Jersey',     constName:'NEW_JERSEY_STATIONS',     coast:'Atlantic Coast',  tz:'eastern', mapCenter:[39.8,-74.4],  mapZoom:7 },
  { abbr:'NY', slug:'new-york',       displayName:'New York',       constName:'NEW_YORK_STATIONS',       coast:'Atlantic Coast',  tz:'eastern', mapCenter:[40.9,-73.4],  mapZoom:7 },
  { abbr:'CT', slug:'connecticut',    displayName:'Connecticut',    constName:'CONNECTICUT_STATIONS',    coast:'Atlantic Coast',  tz:'eastern', mapCenter:[41.3,-72.6],  mapZoom:8 },
  { abbr:'RI', slug:'rhode-island',   displayName:'Rhode Island',   constName:'RHODE_ISLAND_STATIONS',   coast:'Atlantic Coast',  tz:'eastern', mapCenter:[41.6,-71.5],  mapZoom:9 },
  { abbr:'MA', slug:'massachusetts',  displayName:'Massachusetts',  constName:'MASSACHUSETTS_STATIONS',  coast:'Atlantic Coast',  tz:'eastern', mapCenter:[42.0,-70.5],  mapZoom:7 },
  { abbr:'NH', slug:'new-hampshire',  displayName:'New Hampshire',  constName:'NEW_HAMPSHIRE_STATIONS',  coast:'Atlantic Coast',  tz:'eastern', mapCenter:[43.0,-70.8],  mapZoom:9 },
  { abbr:'ME', slug:'maine',          displayName:'Maine',          constName:'MAINE_STATIONS',          coast:'Atlantic Coast',  tz:'eastern', mapCenter:[44.5,-68.5],  mapZoom:7 },
  // Pacific
  { abbr:'CA', slug:'california',     displayName:'California',     constName:'CALIFORNIA_STATIONS',     coast:'Pacific Coast',   tz:'pacific', mapCenter:[37.0,-122.0], mapZoom:6 },
  { abbr:'OR', slug:'oregon',         displayName:'Oregon',         constName:'OREGON_STATIONS',         coast:'Pacific Coast',   tz:'pacific', mapCenter:[44.5,-124.0], mapZoom:7 },
  { abbr:'WA', slug:'washington',     displayName:'Washington',     constName:'WASHINGTON_STATIONS',     coast:'Pacific Coast',   tz:'pacific', mapCenter:[47.5,-122.5], mapZoom:7 },
  { abbr:'AK', slug:'alaska',         displayName:'Alaska',         constName:'ALASKA_STATIONS',         coast:'Pacific Coast',   tz:'alaska',  mapCenter:[60.0,-150.0], mapZoom:4 },
  { abbr:'HI', slug:'hawaii',         displayName:'Hawaii',         constName:'HAWAII_STATIONS',         coast:'Pacific Coast',   tz:'hawaii',  mapCenter:[20.5,-157.0], mapZoom:7 },
]

// ─── Slug helpers ─────────────────────────────────────────────────────────────

function toSlug(name) {
  return name.toLowerCase()
    .replace(/\s*[-–—]\s*/g, '-').replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-').replace(/^-|-$/g, '').substring(0, 80)
}

// ─── Region assignment ────────────────────────────────────────────────────────

function getRegion(abbr, lat, lon) {
  switch (abbr) {
    case 'GA':
      if (lat > 32.0) return 'Savannah / Tybee Island'
      if (lat > 31.5) return 'Golden Isles / Brunswick'
      return 'St. Marys / Cumberland Island'
    case 'SC':
      if (lat > 33.5) return 'Grand Strand / Myrtle Beach'
      if (lat > 32.7) return 'Charleston / Lowcountry'
      return 'Beaufort / Sea Islands'
    case 'NC':
      if (lon > -76.2) return 'Outer Banks / Pamlico Sound'
      if (lat > 34.8) return 'Albemarle Sound'
      if (lat > 34.2) return 'New Bern / Crystal Coast'
      return 'Cape Fear / Wilmington'
    case 'VA':
      if (lon > -75.8) return 'Virginia Coast / Eastern Shore'
      if (lat > 37.8) return 'Upper Chesapeake Bay'
      if (lat > 37.2) return 'Lower Chesapeake Bay / Hampton Roads'
      return 'Virginia Beach / Currituck Sound'
    case 'MD':
      if (lon > -75.3) return 'Maryland Ocean Shore'
      if (lat > 39.2) return 'Upper Chesapeake Bay'
      if (lat > 38.8) return 'Middle Chesapeake Bay'
      return 'Lower Chesapeake Bay / Potomac'
    case 'DE':
      if (lon > -75.2) return 'Delaware Ocean Shore'
      return 'Delaware Bay'
    case 'NJ':
      if (lat > 40.5) return 'New York Harbor / Raritan Bay'
      if (lat > 39.7) return 'Jersey Shore North'
      if (lat > 39.2) return 'Jersey Shore South'
      return 'Delaware Bay NJ'
    case 'NY':
      if (lon > -74.0 && lat > 40.6) return 'New York Harbor / East River'
      if (lat > 41.1) return 'Long Island Sound'
      if (lon < -72.5) return 'Eastern Long Island'
      if (lat > 40.6) return 'Long Island South Shore'
      return 'Hudson River'
    case 'CT':
      if (lon > -72.0) return 'Eastern Long Island Sound'
      if (lon > -72.8) return 'Central Long Island Sound'
      return 'Western Long Island Sound'
    case 'RI':
      if (lat > 41.7) return 'Narragansett Bay'
      return 'Rhode Island Sound'
    case 'MA':
      if (lon > -70.0) return 'Cape Cod & Islands'
      if (lon > -70.8 && lat < 42.0) return 'Cape Cod Bay'
      if (lat > 42.4 && lon > -71.1) return 'Boston Harbor / South Shore'
      if (lat > 42.5) return 'North Shore Massachusetts'
      return 'Buzzards Bay / South Coast'
    case 'NH':
      return 'New Hampshire Seacoast'
    case 'ME':
      if (lat < 43.5) return 'York County / Southern Maine'
      if (lat < 43.9) return 'Casco Bay / Portland'
      if (lat < 44.5) return 'Midcoast Maine'
      return 'Downeast Maine / Acadia'
    case 'CA':
      if (lat < 33.5) return 'San Diego'
      if (lat < 34.5) return 'Los Angeles / Orange County'
      if (lat < 35.5) return 'Santa Barbara / Ventura'
      if (lat < 37.0) return 'Central California'
      if (lat < 38.5) return 'San Francisco Bay Area'
      return 'North Coast California'
    case 'OR':
      if (lat > 46.0) return 'Columbia River / Astoria'
      if (lat > 44.5) return 'Central Oregon Coast'
      return 'Southern Oregon Coast'
    case 'WA':
      if (lon < -124.0) return 'Washington Ocean Coast'
      if (lat < 46.5) return 'Columbia River WA'
      if (lat < 47.2) return 'South Puget Sound'
      if (lat < 47.8) return 'Central Puget Sound / Seattle'
      if (lat < 48.4) return 'North Puget Sound'
      return 'San Juan Islands / Strait of Juan de Fuca'
    case 'AK':
      if (lon > -133) return 'Southeast Alaska'
      if (lon > -148) return 'Gulf of Alaska'
      if (lon > -152) return 'Cook Inlet / Prince William Sound'
      if (lon > -157) return 'Kodiak Island'
      return 'Western Alaska / Aleutians'
    case 'HI':
      if (lat > 21.5) return 'Kauai / Niihau'
      if (lat > 21.2) return 'Oahu'
      if (lat > 20.5 && lon < -156.5) return 'Maui / Molokai'
      if (lat < 20.3) return 'Hawaii (Big Island)'
      return 'Hawaii (Big Island)'
    default: return 'Coast'
  }
}

// ─── Sun / timezone params ────────────────────────────────────────────────────

const TZ_PARAMS = {
  eastern: { sunMeridian: 75,  utcOffset:  1 },
  central: { sunMeridian: 90,  utcOffset:  0 },
  pacific: { sunMeridian: 120, utcOffset: -2 },
  alaska:  { sunMeridian: 135, utcOffset: -3 },
  hawaii:  { sunMeridian: 150, utcOffset: -4 },
}
function getSunParams(tz, lat, lon) {
  const p = TZ_PARAMS[tz]
  const riseBase = tz === 'pacific' ? 6.5 : tz === 'alaska' ? 7.0 : tz === 'hawaii' ? 6.2 : 7.2
  const setBase  = tz === 'pacific' ? 19.3 : tz === 'alaska' ? 18.5 : tz === 'hawaii' ? 18.6 : 19.8
  return {
    sunLat:      Math.round(lat * 100) / 100,
    sunMeridian: p.sunMeridian,
    sunLon:      Math.round(Math.abs(lon) * 100) / 100,
    utcOffset:   p.utcOffset,
    sunriseRef:  +(riseBase - (lat - 30) * 0.06).toFixed(2),
    sunsetRef:   +(setBase  + (lat - 30) * 0.04).toFixed(2),
  }
}

// ─── Tidal type ───────────────────────────────────────────────────────────────

function getTidalType(abbr) {
  if (['CA','OR','WA','AK'].includes(abbr)) return 'mixed'
  if (abbr === 'HI') return 'mixed'
  return 'semidiurnal'
}

// ─── Mean range ───────────────────────────────────────────────────────────────

function getMeanRange(abbr, lat) {
  switch (abbr) {
    case 'GA': return 7.2
    case 'SC': return lat > 33.0 ? 4.5 : 6.0
    case 'NC': return lat > 36.0 ? 3.5 : 2.0
    case 'VA': return lat > 37.5 ? 1.8 : 2.5
    case 'MD': return 1.2
    case 'DE': return 4.2
    case 'NJ': return lat > 40.5 ? 4.8 : 4.2
    case 'NY': return lat > 41.0 ? 3.0 : 4.6
    case 'CT': return 4.0
    case 'RI': return 3.5
    case 'MA': return lat > 42.5 ? 9.0 : 4.5
    case 'NH': return 8.5
    case 'ME': return lat < 43.8 ? 8.5 : lat < 44.5 ? 10.0 : 12.0
    case 'CA': return lat > 37.5 ? 4.5 : 4.0
    case 'OR': return 5.5
    case 'WA': return lat > 48.0 ? 12.0 : lat > 47.5 ? 10.0 : lat > 47.0 ? 14.0 : 4.5
    case 'AK': return lat > 59.0 ? 22.0 : lat > 57.0 ? 12.0 : 8.0
    case 'HI': return 1.5
    default: return 3.5
  }
}

// ─── Water temp ───────────────────────────────────────────────────────────────

function getWaterTemp(abbr, lat) {
  const temps = { GA:72, SC:70, NC:66, VA:62, MD:58, DE:57, NJ:56, NY:54, CT:54, RI:53, MA:52, NH:50, ME:48, CA:57, OR:52, WA:50, AK:42, HI:78 }
  return (temps[abbr] ?? 58) + '°F'
}

// ─── Species templates ────────────────────────────────────────────────────────

function getCoastalZone(abbr) {
  if (['GA','SC'].includes(abbr)) return 'atlantic-se'
  if (abbr === 'NC')              return 'atlantic-nc'
  if (['VA','MD','DE','NJ'].includes(abbr)) return 'atlantic-mid'
  if (['NY','CT','RI'].includes(abbr))      return 'atlantic-ne-south'
  if (['MA','NH','ME'].includes(abbr))      return 'atlantic-ne-north'
  if (abbr === 'CA')              return 'pacific-ca'
  if (['OR','WA'].includes(abbr)) return 'pacific-nw'
  if (abbr === 'AK')              return 'alaska'
  if (abbr === 'HI')              return 'hawaii'
  return 'atlantic-mid'
}

const SPECIES = {
  'atlantic-se': `[
    { name: 'Red Drum (Redfish)',  icon: '🎣', color: '#f97316', bait: 'Mullet, shrimp, DOA crab',             regulation: 'Slot 18–27″ · 5/day',     when: 'Outgoing tide on flats & creek mouths' },
    { name: 'Flounder',           icon: '🐡', color: '#34d399', bait: 'Gulp! shrimp, finger mullet, minnow',  regulation: '12″ min · 10/day',        when: 'Incoming tide near drop-offs & channels' },
    { name: 'Spotted Seatrout',   icon: '🐟', color: '#60a5fa', bait: 'Mirrolure, live shrimp, popping cork', regulation: 'Slot 12–19″ · 5/day',     when: 'Early morning grass flats — incoming tide' },
    { name: 'Sheepshead',         icon: '🐡', color: '#a78bfa', bait: 'Fiddler crab, barnacle, shrimp',       regulation: '10″ min · 10/day',        when: 'Structure — bridges, jetties, pilings' },
    { name: 'Cobia',              icon: '🐟', color: '#facc15', bait: 'Live eel, blue crab, bucktail jig',    regulation: '33″ min · 2/day',         when: 'Spring–fall nearshore — major solunar' },
  ]`,
  'atlantic-nc': `[
    { name: 'Red Drum',           icon: '🎣', color: '#f97316', bait: 'Mullet, shrimp, soft plastic crab',    regulation: 'Slot 18–27″ · 1/day',     when: 'Outgoing tide — inlets & marsh edges' },
    { name: 'Summer Flounder',    icon: '🐡', color: '#34d399', bait: 'Gulp! shrimp, bucktail jig, spearing', regulation: '14″ min · 10/day',        when: 'Incoming tide near structure & channels' },
    { name: 'Spotted Seatrout',   icon: '🐟', color: '#60a5fa', bait: 'Mirrolure, live shrimp, popping cork', regulation: '12″ min · 10/day',        when: 'Early morning grass flats & sound edges' },
    { name: 'Striped Bass',       icon: '🎣', color: '#38bdf8', bait: 'Bunker chunk, swim shad, live eel',    regulation: '18″ min · check season',  when: 'Moving tide — inlets & surf' },
    { name: 'Spanish Mackerel',   icon: '🐡', color: '#facc15', bait: 'Gotcha plug, Clarkspoon, spoons',      regulation: '12″ min · 7/day',         when: 'Open water — outgoing tide & inlets' },
  ]`,
  'atlantic-mid': `[
    { name: 'Striped Bass',       icon: '🎣', color: '#38bdf8', bait: 'Bunker (menhaden), live eel, swim shad', regulation: '28″ min · check season', when: 'Moving tide — rips, inlets, structure' },
    { name: 'Summer Flounder',    icon: '🐡', color: '#34d399', bait: 'Gulp! shrimp, squid strip, bucktail jig', regulation: '14″ min · 10/day',      when: 'Incoming tide near channels & drop-offs' },
    { name: 'Bluefish',           icon: '🐟', color: '#60a5fa', bait: 'Metal jig, popper, bunker chunk',        regulation: '10″ min · 10/day',      when: 'Moving tide — surface feeding, inlets' },
    { name: 'Weakfish (Seatrout)',icon: '🐟', color: '#a78bfa', bait: 'Bucktail jig, live shrimp, soft plastic', regulation: '13″ min · 10/day',      when: 'Dawn & dusk — incoming tide on grass beds' },
    { name: 'Tautog (Blackfish)', icon: '🐡', color: '#facc15', bait: 'Green crab, fiddler crab, sand flea',    regulation: '16″ min · varies',       when: 'Slack tide — wrecks, rocks, jetties' },
  ]`,
  'atlantic-ne-south': `[
    { name: 'Striped Bass',       icon: '🎣', color: '#38bdf8', bait: 'Live bunker, swim shad, live eel',      regulation: '28″ min · check season', when: 'Moving tide — rips, inlets & structure' },
    { name: 'Bluefish',           icon: '🐟', color: '#60a5fa', bait: 'Metal jig, popper, live bunker',         regulation: '10″ min · 10/day',       when: 'Moving tide — surface action, inlets' },
    { name: 'Summer Flounder',    icon: '🐡', color: '#34d399', bait: 'Gulp! shrimp, bucktail, spearing',       regulation: '14″ min · 10/day',       when: 'Incoming tide near channels & drop-offs' },
    { name: 'Tautog (Blackfish)', icon: '🐡', color: '#a78bfa', bait: 'Green crab, fiddler crab',               regulation: '16″ min · varies',       when: 'Slack water — wrecks, rocks, jetties' },
    { name: 'Scup (Porgy)',       icon: '🐡', color: '#facc15', bait: 'Sandworm, clam, small jig',              regulation: '9″ min · 30/day',        when: 'Incoming tide — nearshore & structure' },
  ]`,
  'atlantic-ne-north': `[
    { name: 'Striped Bass',       icon: '🎣', color: '#38bdf8', bait: 'Live bunker, swim shad, live eel, lure', regulation: '28″ min · check season', when: 'Moving tide — rips, rocky points, surfcasting' },
    { name: 'Bluefish',           icon: '🐟', color: '#60a5fa', bait: 'Metal jig, popper, topwater',             regulation: '10″ min · 10/day',       when: 'Outgoing tide — inlets & open water schools' },
    { name: 'Tautog (Blackfish)', icon: '🐡', color: '#a78bfa', bait: 'Green crab, fiddler crab, sand flea',    regulation: '16″ min · varies',       when: 'Slack tide — wrecks, rocks, ledges, jetties' },
    { name: 'Atlantic Cod',       icon: '🐡', color: '#34d399', bait: 'Clam, squid, jig, cut fish',              regulation: '21″ min · check season', when: 'Cold water deep structure — moving tide' },
    { name: 'Pollock',            icon: '🐡', color: '#facc15', bait: 'Jig, metal spoon, soft plastic',          regulation: 'No minimum · no limit',  when: 'Moving tide — midwater column near structure' },
  ]`,
  'pacific-ca': `[
    { name: 'California Halibut', icon: '🐡', color: '#34d399', bait: 'Live anchovy, sardine, swimshad',       regulation: '22″ min · 5/day',        when: 'Incoming tide on sandy flats & bay entrances' },
    { name: 'Striped Bass',       icon: '🎣', color: '#38bdf8', bait: 'Live shad, swimshad, pencil popper',     regulation: '18″ min · 2/day',        when: 'Outgoing tide — bay mouths, bridges, structure' },
    { name: 'White Seabass',      icon: '🐟', color: '#a78bfa', bait: 'Live squid, large swimbait, sardine',    regulation: '28″ min · 3/day',        when: 'Twilight — kelp edges, major solunar' },
    { name: 'Yellowtail',         icon: '🐡', color: '#facc15', bait: 'Live mackerel, iron jig, sardine',       regulation: '24″ min · 10/day',       when: 'Moving tide — structure, kelp paddies, offshore' },
    { name: 'Rockfish',           icon: '🐟', color: '#f97316', bait: 'Jig, cut squid, live bait',              regulation: 'Check bag limits · vary', when: 'Moving tide — reef & rocky structure' },
  ]`,
  'pacific-nw': `[
    { name: 'Chinook Salmon',     icon: '🎣', color: '#f97316', bait: 'Herring, anchovy, spoon, spinner',      regulation: 'Check season & limit',   when: 'Incoming tide — river mouths & nearshore' },
    { name: 'Lingcod',            icon: '🐡', color: '#34d399', bait: 'Large jig, lead head, live baitfish',   regulation: '22″ min · 2/day',        when: 'Moving tide — rocky reef & deep structure' },
    { name: 'Pacific Halibut',    icon: '🐡', color: '#60a5fa', bait: 'Herring, octopus, large jig',           regulation: 'Check season & limit',   when: 'Slack tide — sandy bottom near drop-offs' },
    { name: 'Rockfish',           icon: '🐟', color: '#a78bfa', bait: 'Jig, cut squid, lead head',             regulation: 'Check bag limits · vary', when: 'Moving tide — rocky reef & pinnacles' },
    { name: 'Dungeness Crab',     icon: '🦀', color: '#facc15', bait: 'Crab pot — chicken, squid, fish heads', regulation: 'Check season · 6¼″ min', when: 'Year-round — bay edges & sandy bottom' },
  ]`,
  'alaska': `[
    { name: 'Pacific Halibut',    icon: '🐡', color: '#60a5fa', bait: 'Herring, octopus, large leadhead jig',  regulation: 'Check IFQ/sport season',  when: 'Slack tide — deep sandy bottom, 60–500 ft' },
    { name: 'King Salmon',        icon: '🎣', color: '#f97316', bait: 'Herring plug-cut, spoon, flasher rig',  regulation: 'Check ADF&G limits',      when: 'Incoming tide — river mouths, nearshore' },
    { name: 'Silver (Coho) Salmon',icon: '🎣', color: '#38bdf8', bait: 'Jig, spoon, fly, chartreuse lure',    regulation: 'Check ADF&G limits',      when: 'Moving tide — inlets & river mouths' },
    { name: 'Rockfish',           icon: '🐟', color: '#a78bfa', bait: 'Jig, cut herring, soft plastic',        regulation: 'Check bag limits · vary', when: 'Moving tide — reef & rocky structure' },
    { name: 'Dungeness Crab',     icon: '🦀', color: '#facc15', bait: 'Crab pot — herring, salmon carcass',   regulation: 'Check ADF&G season',      when: 'Year-round — tidal flats & bay edges' },
  ]`,
  'hawaii': `[
    { name: 'Mahi-Mahi (Dorado)', icon: '🐟', color: '#60a5fa', bait: 'Trolling lure, flying fish, squid',    regulation: 'No minimum · no limit',  when: 'Open ocean — major solunar periods' },
    { name: 'Yellowfin Tuna (Ahi)',icon: '🎣', color: '#f97316', bait: 'Popper, jig, trolling lure',           regulation: 'No minimum · no limit',  when: 'Blue water — dawn & major solunar' },
    { name: 'Blue Marlin',        icon: '🎣', color: '#38bdf8', bait: 'Trolling lure, live bait, circle hook', regulation: 'Catch & release encouraged', when: 'Deep water — major solunar midday' },
    { name: "Bonefish (O'io)",   icon: '🐡', color: '#34d399', bait: 'Live shrimp, crab fly, bonefish jig',  regulation: 'Bag limit: 10/day',      when: 'Incoming tide on shallow flats — dawn' },
    { name: 'Ulua (Giant Trevally)',icon: '🐡', color: '#a78bfa', bait: 'Live bait, large popper, jig',        regulation: '10″ min · 1 per species/day', when: 'Moving tide — rocky shores & channel edges' },
  ]`,
}

// ─── Haversine ────────────────────────────────────────────────────────────────

function haversine(lat1, lon1, lat2, lon2) {
  const R = 3958.8, dLat = (lat2-lat1)*Math.PI/180, dLon = (lon2-lon1)*Math.PI/180
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)**2
  return R * 2 * Math.asin(Math.sqrt(a))
}

// ─── Generate each state ──────────────────────────────────────────────────────

for (const cfg of STATES) {
  const raw = ALL
    .filter(s => s.state === cfg.abbr)
    .map(s => ({ id: s.id, name: s.name, lat: parseFloat(s.lat), lon: parseFloat(s.lng) }))
    .filter(s => !isNaN(s.lat) && !isNaN(s.lon))

  console.log(`${cfg.abbr}: ${raw.length} stations`)

  // Assign unique slugs
  const slugsSeen = new Set()
  const meta = raw.map(s => {
    let slug = toSlug(s.name)
    if (slugsSeen.has(slug)) slug = `${slug}-${s.id}`
    slugsSeen.add(slug)
    return { ...s, slug, region: getRegion(cfg.abbr, s.lat, s.lon) }
  })

  // Nearby 4 within state
  function getNearby(s) {
    return meta
      .filter(o => o.id !== s.id)
      .map(o => ({ ...o, dist: haversine(s.lat, s.lon, o.lat, o.lon) }))
      .sort((a, b) => a.dist - b.dist).slice(0, 4)
      .map(o => `    { name: ${JSON.stringify(o.name)}, lat: ${o.lat}, lon: ${o.lon}, slug: ${JSON.stringify(o.slug)} }`)
      .join(',\n')
  }

  // Unique regions actually present
  const presentRegions = [...new Set(meta.map(s => s.region))]

  // ── Write lib/{state}-stations.ts ──────────────────────────────────────────
  let libOut = `// AUTO-GENERATED — do not edit by hand.
// Source: NOAA CO-OPS tide prediction stations, ${cfg.displayName}
// Regenerate: node apps/web/scripts/generate-all-states.mjs

import type { StationConfig, NearbyStation, Species } from './florida-stations'
export type { StationConfig, NearbyStation, Species }

export const ${cfg.constName}: StationConfig[] = [
`
  for (const s of meta) {
    const sun = getSunParams(cfg.tz, s.lat, s.lon)
    const latD = `${Math.abs(s.lat).toFixed(2)}°${s.lat>=0?'N':'S'}`
    const lonD = `${Math.abs(s.lon).toFixed(2)}°${s.lon>=0?'E':'W'}`
    const zone = getCoastalZone(cfg.abbr)
    const species = SPECIES[zone] || SPECIES['atlantic-mid']
    const range = getMeanRange(cfg.abbr, s.lat)
    libOut += `  {
    id: ${JSON.stringify(s.id)}, waterTempId: ${JSON.stringify(s.id)},
    name: ${JSON.stringify(s.name)}, slug: ${JSON.stringify(s.slug)},
    state: ${JSON.stringify(cfg.slug)}, city: ${JSON.stringify(s.name + ', ' + cfg.abbr)}, region: ${JSON.stringify(s.region)},
    lat: ${s.lat}, lon: ${s.lon}, latDisplay: ${JSON.stringify(latD)}, lonDisplay: ${JSON.stringify(lonD)},
    sunLat: ${sun.sunLat}, sunMeridian: ${sun.sunMeridian}, sunLon: ${sun.sunLon}, utcOffset: ${sun.utcOffset},
    sunriseRef: ${sun.sunriseRef}, sunsetRef: ${sun.sunsetRef},
    tidalType: '${getTidalType(cfg.abbr)}', meanRange: ${range}, waterTempDefault: '${getWaterTemp(cfg.abbr, s.lat)}',
    nearby: [
${getNearby(s)}
    ],
    species: ${species},
  },
`
  }
  libOut += `]

export function getStationBySlug(slug: string): StationConfig | undefined {
  return ${cfg.constName}.find(s => s.slug === slug)
}
export function getAllSlugs(): string[] {
  return ${cfg.constName}.map(s => s.slug)
}
`
  writeFileSync(join(root, `lib/${cfg.slug}-stations.ts`), libOut, 'utf8')

  // ── Write app/tides/{state}/page.tsx ───────────────────────────────────────
  const stateDir = join(root, `app/tides/${cfg.slug}`)
  const stationDir = join(stateDir, '[station]')
  if (!existsSync(stateDir)) mkdirSync(stateDir, { recursive: true })
  if (!existsSync(stationDir)) mkdirSync(stationDir, { recursive: true })

  const regionList = presentRegions.map(r => JSON.stringify(r)).join(', ')
  const blurb = {
    GA: 'Savannah, Tybee Island, Golden Isles, Brunswick and Cumberland Island.',
    SC: 'Grand Strand, Charleston, Hilton Head and the Sea Islands.',
    NC: 'Outer Banks, Pamlico Sound, Crystal Coast, Cape Fear and Wilmington.',
    VA: 'Chesapeake Bay, Hampton Roads, Virginia Beach and the Eastern Shore.',
    MD: 'Chesapeake Bay, Annapolis, Baltimore, Potomac River and Ocean City.',
    DE: 'Delaware Bay, Lewes, Rehoboth Beach and the Delaware Seashore.',
    NJ: 'Delaware Bay, Jersey Shore, Sandy Hook, Raritan Bay and New York Harbor.',
    NY: 'New York Harbor, Long Island Sound, Long Island South Shore and Hudson River.',
    CT: 'Long Island Sound from Greenwich to the Thames River.',
    RI: 'Narragansett Bay, Newport, Block Island and Rhode Island Sound.',
    MA: 'Cape Cod, Boston Harbor, Martha\'s Vineyard, Nantucket and the South Coast.',
    NH: 'Portsmouth, Rye Harbor, Hampton Beach and the New Hampshire Seacoast.',
    ME: 'Portland, Casco Bay, Midcoast Maine, Acadia and Downeast Maine.',
    CA: 'San Diego, Los Angeles, San Francisco Bay, Monterey and the North Coast.',
    OR: 'Astoria, Columbia River, Newport, Coos Bay and the Oregon Coast.',
    WA: 'Puget Sound, Seattle, Tacoma, San Juan Islands and the Strait of Juan de Fuca.',
    AK: 'Southeast Alaska, Cook Inlet, Prince William Sound, Kodiak and the Aleutians.',
    HI: 'Oahu, Maui, the Big Island, Kauai and the Hawaiian island chain.',
  }[cfg.abbr] ?? `${cfg.displayName} coastal tide stations.`

  const canonicalUrl = `https://tidechartspro.com/tides/${cfg.slug}`
  const indexPage = `import type { Metadata } from 'next'
import { ${cfg.constName} } from '@/lib/${cfg.slug}-stations'
import StateIndexPage from '@/app/tides/StateIndexPage'

export const metadata: Metadata = {
  title: '${cfg.displayName} Tide Charts | Tides for Fishing | TideChartsPro',
  description: "${cfg.displayName} tide charts with live tide levels, tides for fishing, solunar periods and fishing forecasts. ${blurb}",
  keywords: ['${cfg.displayName.toLowerCase()} tide chart', '${cfg.displayName.toLowerCase()} tides for fishing', '${cfg.displayName.toLowerCase()} fishing tides', '${cfg.coast.toLowerCase()} tide chart'],
  alternates: { canonical: '${canonicalUrl}' },
  openGraph: {
    title: '${cfg.displayName} Tide Charts | Tides for Fishing | TideChartsPro',
    description: 'Live tide charts and fishing tides for every ${cfg.displayName} coastal location.',
    url: '${canonicalUrl}',
    siteName: 'TideChartsPro',
  },
}

const REGIONS = [${regionList}]

export default function ${cfg.displayName.replace(/\s+/g, '')}TidesIndex() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: '${cfg.displayName} Tide Charts',
          description: 'Tide charts and fishing tides for all ${cfg.displayName} coastal locations.',
          url: '${canonicalUrl}',
          breadcrumb: {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home',             item: 'https://tidechartspro.com' },
              { '@type': 'ListItem', position: 2, name: 'Tides',            item: 'https://tidechartspro.com/tides' },
              { '@type': 'ListItem', position: 3, name: '${cfg.displayName}', item: '${canonicalUrl}' },
            ],
          },
        })}}
      />
      <StateIndexPage
        stateName="${cfg.displayName}"
        stateSlug="${cfg.slug}"
        stateAbbr="${cfg.abbr}"
        stations={${cfg.constName}}
        regions={REGIONS}
        mapCenter={[${cfg.mapCenter[0]}, ${cfg.mapCenter[1]}]}
        mapZoom={${cfg.mapZoom}}
        description="${blurb}"
      />
    </>
  )
}
`
  writeFileSync(join(stateDir, 'page.tsx'), indexPage, 'utf8')

  // ── Write app/tides/{state}/[station]/page.tsx ─────────────────────────────
  const abbr = cfg.abbr
  const stateSlug = cfg.slug
  const stationPage = `import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getStationBySlug, getAllSlugs } from '@/lib/${stateSlug}-stations'
import TideLocationPage from '@/app/tides/florida/TideLocationPage'

interface Props { params: Promise<{ station: string }> }

export async function generateStaticParams() {
  return getAllSlugs().map(slug => ({ station: slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { station: slug } = await params
  const s = getStationBySlug(slug)
  if (!s) return {}
  const city = s.city.replace(/, ${abbr}$/, '')
  const title = \`\${city} Tide Chart | Tides for Fishing | TideChartsPro\`
  const description = \`\${s.city} tide chart with live tide levels, tides for fishing, solunar periods and hourly fishing forecast. \${city} tide level chart updated every 6 minutes. Best fishing tides for \${city} today.\`
  const url = \`https://tidechartspro.com/tides/${stateSlug}/\${slug}\`
  return {
    title, description,
    keywords: [\`\${city.toLowerCase()} tide chart\`, \`\${city.toLowerCase()} tides for fishing\`, \`\${city.toLowerCase()} fishing tides\`, '${cfg.displayName.toLowerCase()} tide chart', 'tides for fishing'],
    alternates: { canonical: url },
    openGraph: { type: 'website', url, title, description, siteName: 'TideChartsPro', images: [{ url: \`https://tidechartspro.com/og/tides/${stateSlug}/\${slug}.png\`, width: 1200, height: 630 }] },
    twitter: { card: 'summary_large_image', title, description },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 } },
  }
}

function buildJsonLd(slug: string) {
  const s = getStationBySlug(slug)
  if (!s) return null
  const city = s.city.replace(/, ${abbr}$/, '')
  const url = \`https://tidechartspro.com/tides/${stateSlug}/\${slug}\`
  return {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebPage', '@id': url, url, name: \`\${city} Tide Chart | Tides for Fishing\`,
        description: \`Live tide chart, tides for fishing, solunar periods and fishing forecast for \${s.city}.\`,
        inLanguage: 'en-US',
        isPartOf: { '@type': 'WebSite', url: 'https://tidechartspro.com', name: 'TideChartsPro' },
        breadcrumb: { '@type': 'BreadcrumbList', itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home',             item: 'https://tidechartspro.com' },
          { '@type': 'ListItem', position: 2, name: 'Tides',            item: 'https://tidechartspro.com/tides' },
          { '@type': 'ListItem', position: 3, name: '${cfg.displayName}', item: 'https://tidechartspro.com/tides/${stateSlug}' },
          { '@type': 'ListItem', position: 4, name: s.name,             item: url },
        ]},
      },
      { '@type': 'Dataset', name: \`\${city} Tide Predictions\`,
        description: \`Hourly tide predictions, high/low tide times, and fishing solunar data for \${s.city}.\`,
        url, creator: { '@type': 'Organization', name: 'TideChartsPro', url: 'https://tidechartspro.com' },
        spatialCoverage: { '@type': 'Place', name: s.city, geo: { '@type': 'GeoCoordinates', latitude: s.lat, longitude: s.lon } },
        variableMeasured: [{ '@type': 'PropertyValue', name: 'Tide Height', unitText: 'feet' }],
      },
      { '@type': 'FAQPage', mainEntity: [
        { '@type': 'Question', name: \`What time is high tide in \${city} today?\`,
          acceptedAnswer: { '@type': 'Answer', text: \`High and low tide times for \${city} are updated daily. Check the tide chart above for today's exact times.\` } },
        { '@type': 'Question', name: \`What are the best tides for fishing in \${city}?\`,
          acceptedAnswer: { '@type': 'Answer', text: \`The best fishing tides in \${city} are the 2 hours before and after high or low tide. Our fishing score combines tide phase, solunar periods, and weather for a daily A–F grade.\` } },
        { '@type': 'Question', name: \`What is the tidal range in \${city}?\`,
          acceptedAnswer: { '@type': 'Answer', text: \`The mean tidal range in \${city} is approximately \${s.meanRange} feet. \${s.tidalType === 'semidiurnal' ? 'Tides are semidiurnal — two high and two low tides per day.' : 'Tides are mixed — two unequal high and low tides per day.'}\` } },
      ]},
    ],
  }
}

export default async function StationPage({ params }: Props) {
  const { station: slug } = await params
  const station = getStationBySlug(slug)
  if (!station) notFound()
  const jsonLd = buildJsonLd(slug)
  return (
    <>
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />}
      <TideLocationPage station={station} />
    </>
  )
}
`
  writeFileSync(join(stationDir, 'page.tsx'), stationPage, 'utf8')

  console.log(`  ✓ lib/${cfg.slug}-stations.ts + routes`)
}

console.log('\nAll states generated.')
