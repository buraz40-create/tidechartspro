// One-shot migration: remap waterTempId to nearest NOAA station with water temp data.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const libDir = path.resolve(__dirname, '..', 'lib')

const tempData = JSON.parse(fs.readFileSync(path.resolve(__dirname, '..', '..', '..', 'noaa-temp-stations.json'), 'utf8'))
const tempStations = tempData.stations.map(s => ({
  id: s.id,
  name: s.name,
  state: s.state,
  lat: parseFloat(s.lat),
  lon: parseFloat(s.lng),
})).filter(s => Number.isFinite(s.lat) && Number.isFinite(s.lon))

function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371
  const toRad = d => d * Math.PI / 180
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a = Math.sin(dLat/2)**2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon/2)**2
  return 2 * R * Math.asin(Math.sqrt(a))
}

function nearest(lat, lon) {
  let best = null, bestDist = Infinity
  for (const t of tempStations) {
    const d = haversine(lat, lon, t.lat, t.lon)
    if (d < bestDist) { bestDist = d; best = t }
  }
  return { station: best, distKm: bestDist }
}

const files = fs.readdirSync(libDir).filter(f => f.endsWith('-stations.ts'))
let totalUpdated = 0
let totalUnchanged = 0

for (const file of files) {
  const fullPath = path.join(libDir, file)
  let content = fs.readFileSync(fullPath, 'utf8')

  // Match each station block: capture id, waterTempId, and the lat/lon line
  const stationRe = /id:\s*"(\d+)",\s*waterTempId:\s*"(\d+)",[\s\S]*?lat:\s*(-?\d+\.?\d*),\s*lon:\s*(-?\d+\.?\d*)/g

  let updated = 0
  let unchanged = 0

  content = content.replace(stationRe, (match, id, currentTempId, lat, lon) => {
    const { station, distKm } = nearest(parseFloat(lat), parseFloat(lon))
    if (!station) return match
    if (station.id === currentTempId) {
      unchanged++
      return match
    }
    updated++
    return match.replace(`waterTempId: "${currentTempId}"`, `waterTempId: "${station.id}"`)
  })

  if (updated > 0) {
    fs.writeFileSync(fullPath, content)
    console.log(`${file}: ${updated} updated, ${unchanged} unchanged`)
  } else {
    console.log(`${file}: no changes (${unchanged} already correct)`)
  }
  totalUpdated += updated
  totalUnchanged += unchanged
}

console.log(`\nTotal: ${totalUpdated} stations updated, ${totalUnchanged} unchanged`)
