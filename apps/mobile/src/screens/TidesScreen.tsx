import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import {
  View, Text, ScrollView, StyleSheet, RefreshControl,
  ActivityIndicator, Dimensions, TouchableOpacity, Linking,
} from 'react-native'
import { WebView } from 'react-native-webview'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import TideChart from '../components/TideChart'
import {
  generateCurve, findExtremes, currentHeight,
  nextHighLow, nextMajorSolunar, solunarForDate, moonPhase,
  tideEventsForDate,
  fmtTime, fmtHeight,
  type TidePoint, type TideExtreme,
} from '../lib/tides'
import { grade, type Colors } from '../lib/theme'
import { useTheme } from '../lib/ThemeContext'
import { useStation } from '../lib/StationContext'
import { STATIONS } from '../data/stations'
import { tempStationFor } from '../data/tempStations'
import { speciesFor } from '../data/stationSpecies'

const W = Dimensions.get('window').width

export interface StationType {
  name: string
  city: string
  noaaId: string
  waterTempId: string
  lat: number
  lon: number
  meanRange: number
  species: string[]
}

const DEFAULT_STATION: StationType = {
  name: 'Pablo Creek Entrance',
  city: 'Jacksonville, FL',
  noaaId:      '8720232',
  waterTempId: '8720218',
  lat: 30.3953,
  lon: -81.4316,
  meanRange: 4.6,
  species: ['Redfish', 'Flounder', 'Speckled Trout', 'Sheepshead', 'Black Drum'],
}

const STATE_NAMES: Record<string, string> = {
  ME: 'Maine', NH: 'New Hampshire', MA: 'Massachusetts', RI: 'Rhode Island', CT: 'Connecticut',
  NY: 'New York', NJ: 'New Jersey', DE: 'Delaware', MD: 'Maryland', VA: 'Virginia', NC: 'North Carolina',
  SC: 'South Carolina', GA: 'Georgia', FL: 'Florida', AL: 'Alabama', MS: 'Mississippi', LA: 'Louisiana',
  TX: 'Texas', CA: 'California', OR: 'Oregon', WA: 'Washington', AK: 'Alaska', HI: 'Hawaii',
}

// Build a smooth 5-min tide curve from hi/lo events using cosine interpolation.
// Needs events from day before + day after for smooth chart edges.
function buildCurveFromHilo(events: TideExtreme[], startMs: number, endMs: number): TidePoint[] {
  const sorted = [...events].sort((a, b) => a.time.getTime() - b.time.getTime())
  if (sorted.length < 2) return []
  const pts: TidePoint[] = []
  const step = 5 * 60_000
  for (let t = startMs; t <= endMs; t += step) {
    const ni = sorted.findIndex(e => e.time.getTime() >= t)
    if (ni <= 0) {
      pts.push({ time: new Date(t), height: sorted[Math.max(0, ni === -1 ? sorted.length - 1 : 0)].height })
      continue
    }
    const prev = sorted[ni - 1], next = sorted[ni]
    const frac = (t - prev.time.getTime()) / (next.time.getTime() - prev.time.getTime())
    // cosine interpolation: smooth S-curve between consecutive hi and lo
    const h = (prev.height + next.height) / 2 - (next.height - prev.height) / 2 * Math.cos(frac * Math.PI)
    pts.push({ time: new Date(t), height: Math.max(0, Math.round(h * 100) / 100) })
  }
  return pts
}


function haversineMi(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3958.8
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = Math.sin(dLat / 2) ** 2
    + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function windDirDeg(dir: string): number {
  const map: Record<string, number> = {
    N:0, NNE:22, NE:45, ENE:67, E:90, ESE:112, SE:135, SSE:157,
    S:180, SSW:202, SW:225, WSW:247, W:270, WNW:292, NW:315, NNW:337,
  }
  return map[dir] ?? 0
}

function conditionEmoji(s: string): string {
  const l = s.toLowerCase()
  if (l.includes('thunder'))                        return '⛈️'
  if (l.includes('rain') || l.includes('shower'))   return '🌧️'
  if (l.includes('drizzle'))                        return '🌦️'
  if (l.includes('snow'))                           return '❄️'
  if (l.includes('fog'))                            return '🌫️'
  if (l.includes('cloud') && l.includes('part'))    return '⛅'
  if (l.includes('cloud') || l.includes('overcast')) return '☁️'
  return '☀️'
}

// Nearby stations computed dynamically per station — see nearbyStations useMemo below

interface WxHour {
  time: string; hour: number; temp: number
  windSpeed: number; windDir: string; precip: number; condition: string
}

const SPECIES_DATA = [
  {
    name: 'Redfish', icon: '🎣',
    regulation: '18–27" slot',
    tip: 'Outgoing tide on marsh edges & ponds',
    tipColor: '#22c55e',
    bait: 'Live shrimp · Mullet · Crabs',
  },
  {
    name: 'Flounder', icon: '🐟',
    regulation: '12" min',
    tip: 'Bridge pilings & channel drops',
    tipColor: '#60a5fa',
    bait: 'Live finger mullet · Mud minnows',
  },
  {
    name: 'Speckled Trout', icon: '🎣',
    regulation: '15–19" slot',
    tip: 'Grass flats at low light',
    tipColor: '#a78bfa',
    bait: 'Live shrimp · Soft plastics',
  },
  {
    name: 'Sheepshead', icon: '🐠',
    regulation: '10" min',
    tip: 'Structure & docks year-round',
    tipColor: '#f97316',
    bait: 'Fiddler crabs · Barnacles',
  },
  {
    name: 'Black Drum', icon: '🐡',
    regulation: '14–24" slot',
    tip: 'Oyster bars & nearshore flats',
    tipColor: '#eab308',
    bait: 'Shrimp · Crabs',
  },
]

function validCoord(lat: unknown, lon: unknown): boolean {
  return typeof lat === 'number' && typeof lon === 'number'
    && isFinite(lat) && isFinite(lon)
    && Math.abs(lat) <= 90 && Math.abs(lon) <= 180
    && !(lat === 0 && lon === 0)
}

function buildMapHtml(station: StationType, nearby: Array<{ dist: string; station: StationType }>): string {
  const stationValid = validCoord(station.lat, station.lon)

  const markers = nearby
    .filter(e => validCoord(e.station.lat, e.station.lon))
    .map(e => ({
      lat: e.station.lat, lon: e.station.lon,
      title: e.station.name, sub: `${e.dist} away`,
      payload: {
        name: e.station.name, noaaId: e.station.noaaId, waterTempId: e.station.waterTempId,
        lat: e.station.lat, lon: e.station.lon, city: e.station.city,
        meanRange: e.station.meanRange, species: e.station.species,
      },
    }))

  const lats = [...(stationValid ? [station.lat] : []), ...markers.map(m => m.lat)]
  const lons = [...(stationValid ? [station.lon] : []), ...markers.map(m => m.lon)]

  const data = {
    station: stationValid ? { lat: station.lat, lon: station.lon, title: station.name } : null,
    markers,
    bounds: lats.length ? {
      sw: [Math.min(...lats) - 0.04, Math.min(...lons) - 0.04],
      ne: [Math.max(...lats) + 0.04, Math.max(...lons) + 0.04],
    } : null,
  }
  // Embed as JSON (safe for apostrophes/quotes in names) and neutralise "<"
  // so a name containing "</script>" cannot break out of the script tag.
  const json = JSON.stringify(data).replace(/</g, '\\u003c')

  return `<!DOCTYPE html><html><head>
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<style>
  html,body{margin:0;padding:0;height:100%;background:#eef5f3;}
  #map{position:absolute;top:0;left:0;right:0;bottom:0;}
  #fallback{position:absolute;inset:0;display:none;align-items:center;justify-content:center;font-family:-apple-system,'Segoe UI',sans-serif;color:#6E8B87;font-size:13px;padding:24px;text-align:center;}
  .leaflet-popup-content-wrapper{background:#fff;color:#1e293b;border-radius:10px;box-shadow:0 2px 12px rgba(0,0,0,0.2);}
  .leaflet-popup-tip{background:#fff;}
  .leaflet-popup-content{margin:10px 14px 12px;}
  .pu-title{font-weight:700;font-size:13px;color:#0f172a;margin-bottom:2px;}
  .pu-sub{font-size:11px;color:#64748b;margin-bottom:8px;}
  .pu-btn{display:block;width:100%;padding:8px 0;background:#1EA593;color:#fff;border:none;border-radius:7px;font-size:12px;font-weight:700;cursor:pointer;text-align:center;letter-spacing:0.3px;}
  .pu-btn:active{background:#0F766E;}
  .leaflet-control-zoom{border:none!important;box-shadow:0 2px 8px rgba(0,0,0,0.2)!important;}
  .leaflet-control-zoom a{width:32px!important;height:32px!important;line-height:32px!important;font-size:18px!important;font-weight:700!important;background:#fff!important;color:#1e293b!important;border:none!important;}
  .leaflet-control-zoom a:first-child{border-radius:8px 8px 0 0!important;}
  .leaflet-control-zoom a:last-child{border-radius:0 0 8px 8px!important;}
  .leaflet-control-zoom a:hover{background:#f1f5f9!important;}
</style>
</head><body><div id="map"></div><div id="fallback">Map location unavailable for this station.</div><script>
(function(){
  var DATA=null;
  try { DATA = ${json}; } catch(e) { DATA = null; }
  function esc(s){ return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
  var hasAny = DATA && (DATA.station || (DATA.markers && DATA.markers.length));
  if (!hasAny || typeof L === 'undefined') {
    document.getElementById('map').style.display='none';
    document.getElementById('fallback').style.display='flex';
    return;
  }
  var map = L.map('map',{zoomControl:true,attributionControl:true});
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:18,attribution:'© OSM'}).addTo(map);
  if (DATA.station) { map.setView([DATA.station.lat,DATA.station.lon],11); }
  else if (DATA.bounds) { try { map.fitBounds([DATA.bounds.sw, DATA.bounds.ne],{padding:[20,20],maxZoom:12}); } catch(e) {} }

  (DATA.markers||[]).forEach(function(mk){
    var m = L.circleMarker([mk.lat, mk.lon], {radius:8,color:'#0F766E',fillColor:'#37D0BC',fillOpacity:0.85,weight:2}).addTo(map);
    var html = '<div class="pu-title">'+esc(mk.title)+'</div><div class="pu-sub">'+esc(mk.sub)+'</div>'
             + '<button class="pu-btn" data-p="'+esc(JSON.stringify(mk.payload))+'">📍 Load This Station</button>';
    m.bindPopup(html);
  });

  if (DATA.station) {
    L.circleMarker([DATA.station.lat, DATA.station.lon], {radius:11,color:'#0F766E',fillColor:'#1EA593',fillOpacity:1,weight:3})
      .bindPopup('<div class="pu-title">'+esc(DATA.station.title)+'</div><div class="pu-sub">📍 Current station</div>')
      .openPopup().addTo(map);
  }

  document.addEventListener('click', function(ev){
    var b = ev.target && ev.target.closest ? ev.target.closest('.pu-btn') : null;
    if (b && window.ReactNativeWebView) { window.ReactNativeWebView.postMessage(b.getAttribute('data-p')); }
  });

  function fixSize(){ try{ map.invalidateSize(true); }catch(e){} }
  window.addEventListener('load',function(){ setTimeout(fixSize,50); setTimeout(fixSize,400); });
  setTimeout(fixSize,650);
})();
</script></body></html>`
}

export default function TidesScreen() {
  const { colors } = useTheme()
  const s = useMemo(() => makeStyles(colors), [colors])
  const scrollRef = useRef<any>(null)
  const { station: contextStation } = useStation()
  const [stationOverride, setStationOverride] = useState<StationType | null>(null)
  const STATION = stationOverride ?? contextStation ?? DEFAULT_STATION

  // Which state this station belongs to (drives the breadcrumb + location pill)
  const stateName = useMemo(() => {
    for (const [code, list] of Object.entries(STATIONS)) {
      if (list.some(st => st.id === STATION.noaaId)) return STATE_NAMES[code] ?? ''
    }
    return ''
  }, [STATION.noaaId])

  // Per-station local species (falls back to the generic list if unmapped)
  const speciesList = useMemo(() => speciesFor(STATION.noaaId) ?? SPECIES_DATA, [STATION.noaaId])

  // Compute 10 nearest stations from all STATIONS data
  const nearbyStations = useMemo((): Array<{ dist: string; station: StationType }> => {
    const allStations: Array<{ id: string; name: string; lat: number; lon: number }> = []
    Object.values(STATIONS).forEach(arr => arr.forEach(s => allStations.push(s)))
    return allStations
      .filter(s => s.id !== STATION.noaaId)
      .map(s => ({ s, mi: haversineMi(STATION.lat, STATION.lon, s.lat, s.lon) }))
      .sort((a, b) => a.mi - b.mi)
      .slice(0, 10)
      .map(({ s, mi }) => ({
        dist: mi < 1 ? `${(mi * 5280).toFixed(0)} ft` : `${mi.toFixed(1)} mi`,
        station: { name: s.name, city: s.name, noaaId: s.id, waterTempId: s.id, lat: s.lat, lon: s.lon, meanRange: 0, species: [] },
      }))
  }, [STATION.noaaId, STATION.lat, STATION.lon])

  // Map HTML memoized on the station only — without this the whole screen
  // re-renders every 60s (the `now` clock) and the WebView reloads Leaflet +
  // OSM tiles from the CDN each time. Keyed on noaaId so it rebuilds only on
  // an actual station change.
  const mapSource = useMemo(
    () => ({ html: buildMapHtml(STATION, nearbyStations) }),
    [STATION.noaaId, nearbyStations]  // eslint-disable-line react-hooks/exhaustive-deps
  )

  const [now, setNow] = useState(Date.now())
  const [wxHourly,   setWxHourly]   = useState<WxHour[]>([])
  const [wxLoading,  setWxLoading]  = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  // Live NOAA hilo data — overrides harmonic model when available
  const [liveHilo, setLiveHilo] = useState<Map<string, TideExtreme[]> | null>(null)
  const [waterTemp, setWaterTemp] = useState<string | null>(null)

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 60_000)
    return () => clearInterval(id)
  }, [])

  // Midnight of current day — chart always shows full today
  const midnightMs = useMemo(() => {
    const d = new Date(now); d.setHours(0, 0, 0, 0); return d.getTime()
  }, [now])

  // Harmonic fallback curve
  const harmonicPoints = useMemo(() => generateCurve(midnightMs, 24), [midnightMs])
  // Live curve built from hilo events (cosine interpolation) — consistent with pins
  const points = useMemo(() => {
    if (!liveHilo) return harmonicPoints
    // Gather events spanning yesterday → tomorrow for smooth chart edges
    const allEvs: TideExtreme[] = []
    liveHilo.forEach(evs => allEvs.push(...evs))
    const curve = buildCurveFromHilo(allEvs, midnightMs, midnightMs + 24 * 3600_000)
    return curve.length > 10 ? curve : harmonicPoints
  }, [liveHilo, harmonicPoints, midnightMs])

  // Extremes for chart pins — use live hilo for today when available
  const chartExtremes = useMemo(() => {
    if (liveHilo) {
      const d = new Date(now)
      const dk = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
      const e = liveHilo.get(dk)
      if (e && e.length > 0) return e
    }
    return findExtremes(harmonicPoints)
  }, [liveHilo, harmonicPoints, now])

  const fetchWeather = useCallback(async () => {
    try {
      const UA = { 'User-Agent': 'TideChartsPro/1.0 (tidechartspro.com)' }
      const meta = await fetch(
        `https://api.weather.gov/points/${STATION.lat},${STATION.lon}`,
        { headers: UA }
      ).then(r => r.json())
      const hrData = await fetch(meta.properties.forecastHourly, { headers: UA }).then(r => r.json())
      const hours: WxHour[] = hrData.properties.periods.slice(0, 24).map((p: any) => ({
        time:      new Date(p.startTime).toLocaleTimeString('en-US', { hour: 'numeric' }),
        hour:      new Date(p.startTime).getHours(),
        temp:      p.temperature,
        windSpeed: parseInt(p.windSpeed) || 0,
        windDir:   p.windDirection,
        precip:    p.probabilityOfPrecipitation?.value ?? 0,
        condition: p.shortForecast,
      }))
      setWxHourly(hours)
    } catch {}
    finally { setWxLoading(false) }
  }, [])

  useEffect(() => { setWxHourly([]); setWxLoading(true); fetchWeather() }, [fetchWeather])

  // ── Live NOAA tide predictions (same fetch as website) ────────────────────
  useEffect(() => {
    setLiveHilo(null)
    setWaterTemp(null)
    const BASE   = 'https://api.tidesandcurrents.noaa.gov/api/prod/datagetter'
    const COMMON = `&datum=MLLW&station=${STATION.noaaId}&time_zone=lst_ldt&units=english&format=json&application=TideChartsPro`
    const pad    = (n: number) => String(n).padStart(2, '0')
    const fmt    = (d: Date) => `${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}`
    const today  = new Date()
    const yest   = new Date(today); yest.setDate(today.getDate() - 1)
    const plus7  = new Date(today); plus7.setDate(today.getDate() + 7)

    // Hilo events: yesterday → +7 days (yesterday needed for smooth chart start at midnight)
    fetch(`${BASE}?product=predictions&interval=hilo&begin_date=${fmt(yest)}&end_date=${fmt(plus7)}${COMMON}`)
      .then(r => r.json())
      .then((d: any) => {
        const raw = d.predictions
        if (!raw || raw.length < 2) return
        const map = new Map<string, TideExtreme[]>()
        for (const p of raw) {
          const dk       = p.t.slice(0, 10)
          const timePart = p.t.slice(11, 16)          // "HH:MM"
          const ev: TideExtreme = {
            type:   p.type === 'H' ? 'H' : 'L',
            time:   new Date(`${dk}T${timePart}:00`),
            height: parseFloat(p.v),
          }
          if (!map.has(dk)) map.set(dk, [])
          map.get(dk)!.push(ev)
        }
        setLiveHilo(map)
      })
      .catch(() => {})

    // Water temperature — range=6 tolerates NOAA's reporting delay (range=2 can
    // come back empty). Use plain index access instead of Array.at() for engine safety.
    fetch(`https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?station=${tempStationFor(STATION.noaaId, STATION.waterTempId)}&product=water_temperature&time_zone=LST_LDT&interval=h&units=english&application=TideChartsPro&format=json&range=6`)
      .then(r => r.json())
      .then((d: any) => {
        const rows = Array.isArray(d?.data) ? d.data : []
        const last = rows.length ? rows[rows.length - 1] : null
        const v = last && last.v != null ? parseFloat(last.v) : NaN
        if (isFinite(v)) setWaterTemp(`${Math.round(v)}°F`)
      })
      .catch(() => {})
  }, [STATION.noaaId, STATION.waterTempId])

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    await fetchWeather()
    setRefreshing(false)
  }, [fetchWeather])

  const height = useMemo(() => {
    if (points.length > 0) {
      const pt = points.reduce((best, p) =>
        Math.abs(p.time.getTime() - now) < Math.abs(best.time.getTime() - now) ? p : best
      )
      return pt.height
    }
    return currentHeight(now)
  }, [points, now])
  const nowHour = new Date(now).getHours() + new Date(now).getMinutes() / 60

  // Tide rate from live curve — same as website (ft/hr over last hour)
  const curveIdx  = Math.min(points.length - 1, Math.round((nowHour / 24) * (points.length - 1)))
  const pastIdx   = Math.max(0, curveIdx - 12)  // ~1 hr ago (12 pts × 5 min = 60 min)
  const curH      = points[curveIdx]?.height ?? 0
  const pastH     = points[pastIdx]?.height ?? curH
  const isRising  = curH >= pastH
  const ratePerHr = Math.abs(curH - pastH)

  // Near slack: within 25 min of any extreme (0.42 h = 25 min)
  const nearSlack = chartExtremes.some(e => {
    const eH = e.time.getHours() + e.time.getMinutes() / 60
    return Math.abs(eH - nowHour) < 0.42
  })
  const tideSpeed      = Math.min(100, Math.round((ratePerHr / 1.2) * 100))
  const tidePhaseScore = nearSlack ? 35 : Math.max(40, tideSpeed)

  const periods      = solunarForDate(new Date(now))
  const nextPeriod   = [...periods, ...solunarForDate(new Date(now + 86400_000))].sort((a,b)=>a.start-b.start).find(p => p.end > now)
  const activePeriod = periods.find(p => now >= p.start && now <= p.end)
  const activeMajor  = periods.find(p => p.type === 'major' && now >= p.start && now <= p.end)
  const bwMinsUntil  = (nextPeriod?.type === 'major') ? Math.max(0, Math.round((nextPeriod.start - now) / 60_000)) : 999

  // Solunar score — same thresholds as website
  const solunarScore = activeMajor ? 95 : bwMinsUntil <= 30 ? 85 : activePeriod ? 70 : 50

  // Wind score from live NOAA weather
  const curWind   = wxHourly.find(h => h.hour === Math.floor(nowHour))?.windSpeed ?? wxHourly[0]?.windSpeed ?? 0
  const windScore = curWind >= 25 ? 30 : curWind >= 20 ? 50 : curWind >= 15 ? 65 : curWind >= 10 ? 80 : 90

  // Water temp score — same thresholds as website
  const wTempNum      = waterTemp ? parseInt(waterTemp) : null
  const waterTempScore = wTempNum == null ? 70
    : wTempNum >= 65 && wTempNum <= 75 ? 90
    : wTempNum >= 60 && wTempNum < 65  ? 75
    : wTempNum > 75  && wTempNum <= 82  ? 75
    : wTempNum > 82                     ? 55 : 60

  // Moon score — peaks at new/full moon
  const mp = moonPhase(new Date(now))
  const moonScore = Math.round(80 - 30 * Math.sin(mp * 2 * Math.PI) ** 2)

  // Composite — all 6 factors, same as website
  const score = Math.round((tidePhaseScore + solunarScore + windScore + 70 + waterTempScore + moonScore) / 6)
  const { letter, color: gradeColor } = grade(score)

  // Today's extremes for the "Today's Tides" card
  const today = new Date(now)
  const todayExtremes = chartExtremes.filter(e =>
    e.time.getDate() === today.getDate() && e.time.getMonth() === today.getMonth()
  )
  const todayHighs = todayExtremes.filter(e => e.type === 'H')
  const todayLows  = todayExtremes.filter(e => e.type === 'L')
  const dayHigh = todayHighs.length ? Math.max(...todayHighs.map(e => e.height)) : 4.5
  const dayLow  = todayLows.length  ? Math.min(...todayLows.map(e => e.height))  : 0.1
  const gaugeRange = dayHigh - dayLow || 1
  const gaugePct = Math.max(0, Math.min(1, (height - dayLow) / gaugeRange))

  // Sunrise/sunset for Jacksonville FL (decimal hours, local time)
  const { sunriseH, sunsetH } = useMemo(() => {
    const d    = new Date(now)
    const doy  = Math.floor((d.getTime() - new Date(d.getFullYear(), 0, 0).getTime()) / 86400_000)
    const lat  = STATION.lat * Math.PI / 180
    const decl = -23.45 * Math.cos((360 / 365 * (doy + 10) * Math.PI) / 180) * Math.PI / 180
    const cosHA = -Math.tan(lat) * Math.tan(decl)
    const HA    = Math.acos(Math.max(-1, Math.min(1, cosHA))) * 180 / Math.PI
    const lon   = STATION.lon // -81.4316
    const tz    = -4          // EDT (UTC-4 in summer)
    const lonCorr = (75 - Math.abs(lon)) / 15  // offset from EST meridian 75°W
    return {
      sunriseH: 12 - HA / 15 + tz + lonCorr,
      sunsetH:  12 + HA / 15 + tz + lonCorr,
    }
  }, [now])

  // Stat cards — live NOAA hilo when available, harmonic fallback
  const { nextHigh, nextLow } = useMemo(() => {
    if (liveHilo) {
      const all: TideExtreme[] = []
      liveHilo.forEach(evs => all.push(...evs))
      all.sort((a, b) => a.time.getTime() - b.time.getTime())
      const toEv = (e: TideExtreme) => ({ ...e, hour: e.time.getHours() + e.time.getMinutes() / 60 })
      const nH = all.find(e => e.type === 'H' && e.time.getTime() > now)
      const nL = all.find(e => e.type === 'L' && e.time.getTime() > now)
      return { nextHigh: nH ? toEv(nH) : null, nextLow: nL ? toEv(nL) : null }
    }
    return nextHighLow(now)
  }, [liveHilo, now])
  const nextMajor = useMemo(() => nextMajorSolunar(now), [now])
  const tidalRange = useMemo(() => {
    let evs: { height: number; type: 'H' | 'L' }[] = []
    if (liveHilo) {
      const d = new Date(now)
      const dk = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
      evs = liveHilo.get(dk) ?? []
    }
    if (!evs.length) evs = tideEventsForDate(new Date(now))
    const highs = evs.filter(e => e.type === 'H').map(e => e.height)
    const lows  = evs.filter(e => e.type === 'L').map(e => e.height)
    if (!highs.length || !lows.length) return '—'
    return (Math.max(...highs) - Math.min(...lows)).toFixed(1) + ' ft'
  }, [liveHilo, now])

  const statCards = [
    { icon: '▲', label: 'Next High',    value: nextHigh ? `${fmtTime(nextHigh.time)}\n${fmtHeight(nextHigh.height)}` : '—', color: colors.tide    },
    { icon: '▼', label: 'Next Low',     value: nextLow  ? `${fmtTime(nextLow.time)}\n${fmtHeight(nextLow.height)}`  : '—', color: '#818cf8'       },
    { icon: '↕', label: 'Tidal Range',  value: tidalRange,                                                                  color: '#22c55e'       },
    { icon: '🌙', label: 'Solunar',      value: nextMajor ? `Major\n${fmtTime(new Date(nextMajor.start))}` : 'No major',    color: '#eab308'       },
  ]

  return (
    <SafeAreaView style={s.safe} edges={[]}>
      <ScrollView
        ref={scrollRef}
        style={s.scroll}
        contentContainerStyle={s.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} />}
        showsVerticalScrollIndicator={false}
      >

        {/* ── Gradient hero header ─────────────────────────── */}
        <LinearGradient
          colors={[colors.gradFrom, colors.gradTo]}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={s.hdr}
        >
          {stationOverride && (
            <TouchableOpacity onPress={() => setStationOverride(null)} style={{ marginBottom: 8, alignSelf: 'flex-start' }}>
              <Text style={s.hdrBack}>‹ Back to {DEFAULT_STATION.name}</Text>
            </TouchableOpacity>
          )}
          <Text style={s.crumb}>{stateName || 'US Coast'}</Text>

          <View style={s.stRow}>
            <View style={{ flex: 1 }}>
              <Text style={s.stName}>{STATION.name}</Text>
              <Text style={s.stCity}>
                {STATION.city} · {STATION.lat.toFixed(2)}°N {Math.abs(STATION.lon).toFixed(2)}°W
              </Text>
            </View>
            <View style={s.grade}>
              <Text style={s.gradeTop}>FISHING</Text>
              <Text style={[s.gradeLetter, { color: gradeColor }]}>{letter}</Text>
              <Text style={s.gradeScore}>{score}/100</Text>
            </View>
          </View>

          <View style={s.live}>
            <View>
              <View style={s.risingPill}>
                <Text style={s.risingText}>{isRising ? '▲ Rising' : '▼ Falling'}</Text>
              </View>
              <Text style={s.liveBig}>{height.toFixed(1)}<Text style={s.liveUnit}> ft</Text></Text>
            </View>
            <View style={s.liveNext}>
              <Text style={s.liveNextLab}>Next high</Text>
              <Text style={s.liveNextVal}>{nextHigh ? `${fmtTime(nextHigh.time)} · ${nextHigh.height.toFixed(1)} ft` : '—'}</Text>
              <Text style={[s.liveNextLab, { marginTop: 6 }]}>Next low</Text>
              <Text style={s.liveNextVal}>{nextLow ? `${fmtTime(nextLow.time)} · ${nextLow.height.toFixed(1)} ft` : '—'}</Text>
            </View>
          </View>
        </LinearGradient>

        {/* ── Stat grid (2×2) ──────────────────────────────── */}
        <View style={s.statGrid}>
          <View style={s.statCell}>
            <Text style={[s.statLab, { color: colors.tide }]}>🌡  WATER TEMP</Text>
            <Text style={s.statVal}>{waterTemp ?? '—'}</Text>
          </View>
          <View style={s.statCell}>
            <Text style={[s.statLab, { color: colors.green }]}>↕  TIDAL RANGE</Text>
            <Text style={s.statVal}>{tidalRange}</Text>
          </View>
          <View style={s.statCell}>
            <Text style={[s.statLab, { color: '#3B9AE0' }]}>💨  WIND</Text>
            <Text style={s.statVal}>
              {wxHourly.length > 0
                ? `${wxHourly.find(h => h.hour === Math.floor(nowHour))?.windDir ?? wxHourly[0].windDir} ${wxHourly.find(h => h.hour === Math.floor(nowHour))?.windSpeed ?? wxHourly[0].windSpeed} mph`
                : '—'}
            </Text>
          </View>
          <View style={s.statCell}>
            <Text style={[s.statLab, { color: colors.gold }]}>🐟  SOLUNAR</Text>
            <Text style={s.statVal}>{nextMajor ? `Major ${fmtTime(new Date(nextMajor.start))}` : 'No major'}</Text>
          </View>
        </View>

        {/* ── Solunar strip ────────────────────────────────── */}
        <View style={s.solunarStrip}>
          {activePeriod ? (
            <View style={[s.solunarActive, { backgroundColor: activePeriod.type === 'major' ? 'rgba(34,197,94,0.12)' : 'rgba(234,179,8,0.12)' }]}>
              <Ionicons name="ellipse" size={8} color={activePeriod.type === 'major' ? colors.green : colors.yellow} />
              <Text style={[s.solunarActiveText, { color: activePeriod.type === 'major' ? colors.green : colors.yellow }]}>
                {activePeriod.type === 'major' ? 'Major' : 'Minor'} solunar period active now — prime bite window
              </Text>
            </View>
          ) : nextPeriod ? (
            <View style={s.solunarNext}>
              <Ionicons name="moon-outline" size={13} color={colors.textMuted} />
              <Text style={s.solunarNextText}>
                Next {nextPeriod.type} window: {fmtTime(new Date(nextPeriod.start))} – {fmtTime(new Date(nextPeriod.end))}
              </Text>
            </View>
          ) : null}
        </View>

        {/* ── Tide Chart card ──────────────────────────────── */}
        <View style={s.card}>
          <View style={s.cardHeader}>
            <Text style={s.cardTitle}>Today's Tide Chart</Text>
            <Text style={s.cardChip}>{today.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</Text>
          </View>
          <Text style={s.cardSub}>Predicted tides · {STATION.name}</Text>
          {points.length > 0 && (
            <View style={{ marginTop: 10 }}>
              <TideChart
                points={points} extremes={chartExtremes} nowMs={now}
                sunriseH={sunriseH} sunsetH={sunsetH}
              />
            </View>
          )}
        </View>

        {/* ── Today's tides ────────────────────────────────── */}
        <View style={s.card}>
          <View style={s.cardHeader}>
            <Text style={s.cardTitle}>Today's Tides</Text>
            <Text style={s.cardChip}>{today.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</Text>
          </View>
          {todayExtremes.length === 0 ? (
            <Text style={s.empty}>Calculating…</Text>
          ) : (
            <View style={s.extremesGrid}>
              {todayExtremes.map((e, i) => (
                <View key={i} style={[s.extremeBox, { borderColor: e.type === 'H' ? colors.accent + '50' : colors.border }]}>
                  <Text style={[s.extremeType, { color: e.type === 'H' ? colors.accent : colors.textMuted }]}>
                    {e.type === 'H' ? '▲ HIGH' : '▼ LOW'}
                  </Text>
                  <Text style={s.extremeT}>{fmtTime(e.time)}</Text>
                  <Text style={[s.extremeH, { color: e.type === 'H' ? colors.tide : colors.text }]}>
                    {fmtHeight(e.height)}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* ── Hourly weather ───────────────────────────────── */}
        <View style={s.card}>
          <View style={s.cardHeader}>
            <Text style={s.cardTitle}>Weather Forecast</Text>
            <Text style={s.cardSub2}>Live NOAA · {STATION.city}</Text>
          </View>
          {wxLoading ? (
            <ActivityIndicator color={colors.accent} style={{ marginTop: 16 }} />
          ) : wxHourly.length === 0 ? (
            <Text style={s.empty}>Weather unavailable</Text>
          ) : (
            <>
              {/* Header row */}
              <View style={s.wxHeaderRow}>
                <Text style={[s.wxHdr, { width: 52 }]}>TIME</Text>
                <Text style={[s.wxHdr, { width: 22 }]}></Text>
                <Text style={[s.wxHdr, { width: 38 }]}>TEMP</Text>
                <Text style={[s.wxHdr, { width: 76 }]}>WIND</Text>
                <Text style={[s.wxHdr, { width: 36 }]}>PRECIP</Text>
                <Text style={[s.wxHdr, { width: 44 }]}>TIDE</Text>
                <Text style={[s.wxHdr, { width: 30 }]}>SOL</Text>
              </View>

              {wxHourly.map((h, i) => {
                const isNow       = h.hour === Math.floor(nowHour)
                const windColor   = h.windSpeed >= 20 ? colors.red : h.windSpeed >= 12 ? colors.yellow : colors.green
                const precipColor = h.precip >= 60 ? '#60a5fa' : h.precip >= 30 ? '#93c5fd' : colors.textMuted
                const deg         = windDirDeg(h.windDir)
                // Tide at this hour
                const tideIdx     = Math.min(points.length - 1, Math.round((h.hour / 24) * (points.length - 1)))
                const tideHt      = points[tideIdx]?.height ?? 0
                const tideRising  = tideIdx > 0 ? tideHt >= (points[tideIdx - 1]?.height ?? tideHt) : true
                const tideColor   = tideHt >= 3.5 ? colors.tide : tideHt >= 2 ? colors.textMuted : colors.textFaint
                // Solunar at this hour
                const hourMs      = midnightMs + h.hour * 3600_000
                const solPeriod   = periods.find(p => hourMs >= p.start && hourMs < p.end)

                return (
                  <View key={i} style={[
                    s.wxRow,
                    { backgroundColor: isNow ? colors.accentFaint : i % 2 === 0 ? colors.surfaceAlt : colors.surface },
                  ]}>
                    {isNow && <View style={s.nowAccent} />}
                    {/* Time */}
                    <Text style={[s.wxTime, isNow && { color: colors.accent, fontWeight: '700' }]}>
                      {isNow ? '▶' : ''}{h.time}
                    </Text>
                    {/* Condition emoji */}
                    <Text style={{ width: 22, fontSize: 14, lineHeight: 18 }}>{conditionEmoji(h.condition)}</Text>
                    {/* Temp */}
                    <Text style={s.wxTemp}>{h.temp}°</Text>
                    {/* Wind */}
                    <View style={s.wxWind}>
                      <Text style={{ fontSize: 11, color: windColor, transform: [{ rotate: `${deg}deg` }], lineHeight: 14 }}>↑</Text>
                      <Text style={{ fontSize: 11, color: windColor, marginLeft: 2 }}>{h.windDir} {h.windSpeed}</Text>
                    </View>
                    {/* Precip */}
                    <Text style={[s.wxPrecip, { color: precipColor }]}>{h.precip}%</Text>
                    {/* Tide */}
                    <Text style={[s.wxTide, { color: tideColor }]}>
                      {tideRising ? '▲' : '▼'}{tideHt.toFixed(1)}
                    </Text>
                    {/* Solunar */}
                    <Text style={s.wxSol}>
                      {solPeriod ? (solPeriod.type === 'major' ? '🐟🐟' : '🐟') : '—'}
                    </Text>
                  </View>
                )
              })}
            </>
          )}
        </View>

        {/* ── Solunar Activity ─────────────────────────────── */}
        <View style={s.card}>
          <View style={s.cardHeader}>
            <Text style={s.cardTitle}>Today's Bite Windows</Text>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <View style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: colors.green }} />
                <Text style={s.solLegendText}>Major</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <View style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: colors.yellow }} />
                <Text style={s.solLegendText}>Minor</Text>
              </View>
            </View>
          </View>

          {/* 24-hour visual timeline */}
          <View style={{ marginBottom: 18 }}>
            {/* Hour labels */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5, paddingHorizontal: 0 }}>
              {['12a','3a','6a','9a','12p','3p','6p','9p','12a'].map((l, idx) => (
                <Text key={idx} style={{ fontSize: 8, color: colors.textFaint, width: (W - 32) / 8, textAlign: 'center' }}>{l}</Text>
              ))}
            </View>
            {/* Track */}
            <View style={[s.solTrack, { width: W - 32 }]}>
              {/* Dawn/dusk shading */}
              <View style={[s.solDawn, { left: (sunriseH / 24) * (W - 32), width: Math.max(4, ((sunsetH - sunriseH) / 24) * (W - 32)) }]} />
              {/* Window blocks */}
              {periods.map((p, i) => {
                const sh = new Date(p.start).getHours() + new Date(p.start).getMinutes() / 60
                const eh = new Date(p.end).getHours()   + new Date(p.end).getMinutes()   / 60
                const isPast  = p.end < now
                const isMajor = p.type === 'major'
                const col = isMajor ? colors.green : colors.yellow
                const bw  = Math.max(6, ((eh - sh) / 24) * (W - 32))
                return (
                  <View key={i} style={[s.solBlock, {
                    left:            (sh / 24) * (W - 32),
                    width:           bw,
                    backgroundColor: isPast ? col + '28' : col + '90',
                    borderColor:     isPast ? col + '40' : col,
                    height:          isMajor ? 28 : 20,
                    top:             isMajor ? 2  : 6,
                  }]}>
                    <Text style={{ fontSize: 8, fontWeight: '800', color: isPast ? col + 'aa' : col }}>
                      {isMajor ? '★' : '◆'}
                    </Text>
                  </View>
                )
              })}
              {/* NOW needle */}
              <View style={[s.solNeedle, { left: (nowHour / 24) * (W - 32) }]} />
            </View>
            {/* NOW label */}
            <View style={{ position: 'relative', height: 14, width: W - 32 }}>
              <Text style={[s.solNowLabel, { left: Math.max(0, Math.min(W - 60, (nowHour / 24) * (W - 32) - 10)) }]}>
                NOW
              </Text>
            </View>
          </View>

          {/* Window rows */}
          <View style={{ gap: 8 }}>
            {periods.map((p, i) => {
              const isPast    = p.end < now
              const isActive  = p.start <= now && p.end >= now
              const isFuture  = p.start > now
              const isMajor   = p.type === 'major'
              const col       = isMajor ? colors.green : colors.yellow
              const duration  = Math.round((p.end - p.start) / 60_000)
              const durStr    = duration >= 60
                ? `${Math.floor(duration / 60)}h${duration % 60 > 0 ? ` ${duration % 60}m` : ''}`
                : `${duration}m`
              const minsUntil = Math.max(0, Math.round((p.start - now) / 60_000))
              const hUntil    = Math.floor(minsUntil / 60)
              const minUntil  = minsUntil % 60
              const countdown = hUntil > 0 ? `in ${hUntil}h ${minUntil}m` : `in ${minUntil}m`
              const progress  = isActive ? Math.min(1, (now - p.start) / (p.end - p.start)) : 0
              return (
                <View key={i} style={[s.solRow, isActive && { borderColor: col + '60', backgroundColor: col + '0c' }, isPast && { opacity: 0.72 }]}>
                  {/* Left accent bar */}
                  <View style={[s.solRowBar, { backgroundColor: col }]} />
                  <View style={{ flex: 1 }}>
                    {/* Top line: badge + times + duration */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                      <View style={[s.solBadge, { backgroundColor: col + '20', borderColor: col + '60' }]}>
                        <Text style={[s.solBadgeText, { color: col }]}>{isMajor ? '★ MAJOR' : '◆ MINOR'}</Text>
                      </View>
                      <Text style={[s.solRowTime, { color: isActive ? col : colors.text }]}>
                        {fmtTime(new Date(p.start))} – {fmtTime(new Date(p.end))}
                      </Text>
                      <Text style={s.solRowDur}>{durStr}</Text>
                    </View>
                    {/* Description */}
                    <Text style={s.solRowDesc}>
                      {isMajor ? '🐟 Peak feeding — fish are most active' : '🎣 Secondary bite — watch for surface activity'}
                    </Text>
                    {/* Status / progress */}
                    {isActive && (
                      <View style={{ marginTop: 7 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                            <View style={[s.solDot, { backgroundColor: col }]} />
                            <Text style={[s.solStatusText, { color: col }]}>Active now</Text>
                          </View>
                          <Text style={[s.solRowDur, { color: col }]}>{Math.round(progress * 100)}% through</Text>
                        </View>
                        <View style={s.solProgressTrack}>
                          <View style={[s.solProgressFill, { width: `${progress * 100}%` as any, backgroundColor: col }]} />
                        </View>
                      </View>
                    )}
                    {isFuture && <Text style={[s.solCountdown, { marginTop: 2 }]}>⏱ {countdown}</Text>}
                    {isPast   && <Text style={[s.solPassed, { marginTop: 2 }]}>✓ Passed</Text>}
                  </View>
                </View>
              )
            })}
          </View>
        </View>

        {/* ── Local Species ─────────────────────────────────── */}
        <View style={s.card}>
          <View style={s.cardHeader}>
            <Text style={s.cardTitle}>Local Species</Text>
            <Text style={[s.cardChip, { color: gradeColor, borderColor: gradeColor + '50' }]}>
              Fishing {letter}
            </Text>
          </View>
          <View style={s.scoreBarWrap}>
            <LinearGradient
              colors={['#ef4444', '#eab308', '#22c55e']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={s.scoreBarTrack}
            />
            <View style={s.scoreBarLabels}>
              <Text style={s.scoreBarLabel}>Poor</Text>
              <Text style={[s.scoreBarLabel, { color: gradeColor, fontWeight: '700' }]}>{score}/100</Text>
              <Text style={s.scoreBarLabel}>Excellent</Text>
            </View>
          </View>
          <View style={{ marginTop: 14 }}>
            {speciesList.map((sp, i) => (
              <View key={i} style={[s.spCard, i < speciesList.length - 1 && { marginBottom: 12 }]}>
                <View style={[s.spBorder, { backgroundColor: sp.tipColor }]} />
                <View style={{ flex: 1 }}>
                  <View style={s.spNameRow}>
                    <Text style={s.spIcon}>{sp.icon}</Text>
                    <Text style={s.spName}>{sp.name}</Text>
                    <View style={s.spRegBadge}>
                      <Text style={s.spRegText}>{sp.regulation}</Text>
                    </View>
                  </View>
                  <View style={[s.spTipPill, { backgroundColor: sp.tipColor + '20', borderColor: sp.tipColor + '50' }]}>
                    <Text style={[s.spTipText, { color: sp.tipColor }]}>{sp.tip}</Text>
                  </View>
                  <Text style={s.spBait}>🪱 {sp.bait}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* ── Location & Map ───────────────────────────────── */}
        <View style={s.card}>
          <View style={s.cardHeader}>
            <Text style={s.cardTitle}>Location & Map</Text>
            <Text style={s.cardChip}>Interactive</Text>
          </View>

          {/* Coordinate pills */}
          <View style={s.locRow}>
            <View style={s.locPill}>
              <Text style={s.locPillLabel}>LATITUDE</Text>
              <Text style={s.locPillVal}>{STATION.lat.toFixed(2)}°N</Text>
            </View>
            <View style={s.locPill}>
              <Text style={s.locPillLabel}>LONGITUDE</Text>
              <Text style={s.locPillVal}>{Math.abs(STATION.lon).toFixed(2)}°W</Text>
            </View>
            <View style={s.locPill}>
              <Text style={s.locPillLabel}>STATE</Text>
              <Text style={s.locPillVal}>{stateName || '—'}</Text>
            </View>
            <View style={[s.locPill, { flex: 1.4 }]}>
              <Text style={s.locPillLabel}>CITY</Text>
              <Text style={s.locPillVal}>{STATION.city.split(',')[0]}</Text>
            </View>
          </View>

          {/* Live Leaflet map */}
          <View style={s.mapWrap}>
            <WebView
              key={STATION.noaaId}
              style={s.mapWebView}
              originWhitelist={['*']}
              javaScriptEnabled
              domStorageEnabled
              mixedContentMode="always"
              source={mapSource}
              scrollEnabled={false}
              onMessage={e => {
                try {
                  const data = JSON.parse(e.nativeEvent.data)
                  if (data.noaaId) setStationOverride(data as StationType)
                } catch {}
              }}
            />
          </View>
          <TouchableOpacity
            style={s.mapOpenBtn}
            onPress={() => Linking.openURL(`https://maps.google.com/?q=${STATION.lat},${STATION.lon}`)}
          >
            <Text style={s.mapOpenText}>Open in Maps ↗</Text>
          </TouchableOpacity>

          {/* Nearby stations */}
          <Text style={s.nearbyTitle}>NEARBY STATIONS</Text>
          {nearbyStations.map((entry, i) => (
            <TouchableOpacity
              key={entry.station.noaaId}
              style={[s.nearbyRow, i < nearbyStations.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border }]}
              activeOpacity={0.7}
              onPress={() => { setStationOverride(entry.station); scrollRef.current?.scrollTo({ y: 0, animated: true }) }}
            >
              <View style={s.nearbyDist}>
                <Text style={s.nearbyDistText}>{entry.dist}</Text>
              </View>
              <Text style={s.nearbyName}>{entry.station.name}</Text>
              <Text style={s.nearbyArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  )
}

const makeStyles = (colors: Colors) => StyleSheet.create({
  safe:    { flex: 1, backgroundColor: colors.bg },
  scroll:  { flex: 1 },
  content: { padding: 16 },

  // Gradient hero header
  hdr:         { borderRadius: 24, padding: 18, marginBottom: 14, shadowColor: '#0B5248', shadowOpacity: 0.28, shadowRadius: 20, shadowOffset: { width: 0, height: 10 }, elevation: 5 },
  hdrBack:     { fontSize: 13, fontWeight: '600', color: '#EAFCF8' },
  crumb:       { fontSize: 12.5, color: '#CDF3EC', fontWeight: '500', marginBottom: 12 },
  stRow:       { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 },
  stName:      { fontSize: 23, fontWeight: '700', color: '#ffffff', letterSpacing: -0.3, lineHeight: 27 },
  stCity:      { fontSize: 12, color: '#C6F1E9', marginTop: 4 },
  grade:       { backgroundColor: '#ffffff', borderRadius: 18, paddingHorizontal: 14, paddingVertical: 8, alignItems: 'center', minWidth: 70, shadowColor: '#08322C', shadowOpacity: 0.22, shadowRadius: 10, shadowOffset: { width: 0, height: 5 }, elevation: 4 },
  gradeTop:    { fontSize: 8, fontWeight: '800', letterSpacing: 0.8, color: '#9DB6B1', textTransform: 'uppercase' as const },
  gradeLetter: { fontSize: 30, fontWeight: '900', lineHeight: 33, marginVertical: 1 },
  gradeScore:  { fontSize: 10.5, fontWeight: '800', color: '#5B7B76' },
  live:        { flexDirection: 'row', alignItems: 'flex-end', marginTop: 16, backgroundColor: 'rgba(255,255,255,0.12)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.16)', borderRadius: 16, padding: 14 },
  risingPill:  { backgroundColor: 'rgba(255,255,255,0.18)', paddingHorizontal: 9, paddingVertical: 3, borderRadius: 999, marginBottom: 6, alignSelf: 'flex-start' as const },
  risingText:  { fontSize: 12, fontWeight: '600', color: '#EAFCF8' },
  liveBig:     { fontSize: 32, fontWeight: '700', color: '#ffffff', letterSpacing: -0.5, lineHeight: 34 },
  liveUnit:    { fontSize: 14, fontWeight: '600', color: '#D3F4EE' },
  liveNext:    { marginLeft: 'auto', alignItems: 'flex-end' as const },
  liveNextLab: { fontSize: 10.5, color: '#CDF3EC' },
  liveNextVal: { fontSize: 13, fontWeight: '700', color: '#ffffff' },

  // Stat grid (2×2)
  statGrid:    { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 14 },
  statCell:    { flexBasis: '47%', flexGrow: 1, backgroundColor: colors.surface, borderRadius: 16, padding: 13, shadowColor: '#0F5A50', shadowOpacity: 0.08, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 1 },
  statLab:     { fontSize: 10, fontWeight: '700', letterSpacing: 0.3, marginBottom: 6, color: colors.textMuted },
  statVal:     { fontSize: 18, fontWeight: '800', color: colors.text, letterSpacing: -0.3 },

  // Back button
  backBtn:      { flexDirection: 'row', alignItems: 'center', marginBottom: 8, alignSelf: 'flex-start' as const },
  backBtnText:  { fontSize: 13, color: colors.accent, fontWeight: '600' },

  // Website-style header
  pageHeader:       { gap: 12, marginBottom: 18 },
  breadcrumb:       { fontSize: 11, color: colors.textFaint },
  stationRow:       { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  stationName:      { fontSize: 24, fontWeight: '700', color: colors.text, lineHeight: 28 },
  stationCity:      { fontSize: 12, color: colors.textMuted, marginTop: 4 },
  headerRight:      { alignItems: 'flex-end', minWidth: 90 },
  fishingLabel:     { fontSize: 10, color: colors.textFaint, fontWeight: '700', letterSpacing: 0.5 },
  fishingGrade:     { fontSize: 48, fontWeight: '800', lineHeight: 52 },
  fishingConditions:{ fontSize: 11 },

  // Stat cards (website style)
  statRow:       { flexDirection: 'row', gap: 8, marginBottom: 8 },
  statCard:      { flex: 1, backgroundColor: colors.surface, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, borderWidth: 1, borderColor: colors.border, borderTopWidth: 3 },
  statCardLabel: { fontSize: 9, fontWeight: '700', letterSpacing: 0.5, marginBottom: 5 },
  statCardValue: { fontSize: 14, fontWeight: '700', color: colors.text },

  // Solunar strip
  solunarStrip:      { marginTop: -6 },
  solunarActive:     { flexDirection: 'row', alignItems: 'center', gap: 8, borderRadius: 10, padding: 10 },
  solunarActiveText: { fontSize: 13, fontWeight: '600', flex: 1 },
  solunarNext:       { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: colors.surface, borderRadius: 10, padding: 10, borderWidth: 1, borderColor: colors.border },
  solunarNextText:   { fontSize: 12, color: colors.textMuted, flex: 1 },

  // Cards
  card:       { backgroundColor: colors.surface, borderRadius: 20, padding: 16, marginBottom: 14, shadowColor: '#0F5A50', shadowOpacity: 0.10, shadowRadius: 18, shadowOffset: { width: 0, height: 8 }, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 },
  cardTitle:  { fontSize: 15, fontWeight: '700', color: colors.text },
  cardChip:   { fontSize: 10, color: colors.textMuted, borderWidth: 1, borderColor: colors.border, borderRadius: 6, paddingHorizontal: 7, paddingVertical: 2 },
  cardSub:    { fontSize: 11, color: colors.textMuted, marginBottom: 6 },
  empty:      { fontSize: 13, color: colors.textMuted, paddingVertical: 12, textAlign: 'center' },

  // Extremes grid
  extremesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 8 },
  extremeBox:   { flex: 1, flexBasis: '45%', backgroundColor: colors.surfaceAlt, borderRadius: 12, padding: 12, borderWidth: 1 },
  extremeType:  { fontSize: 10, fontWeight: '700', letterSpacing: 0.5, marginBottom: 4 },
  extremeT:     { fontSize: 20, fontWeight: '800', color: colors.text, marginBottom: 3 },
  extremeH:     { fontSize: 12, color: colors.textMuted },

  // Score bar (in species card)
  scoreBarWrap: { gap: 6, marginBottom: 2 },
  scoreBarTrack:{ height: 8, borderRadius: 4, overflow: 'hidden', backgroundColor: colors.border },
  scoreBarLabels:{ flexDirection: 'row', justifyContent: 'space-between' },
  scoreBarLabel: { fontSize: 10, color: colors.textMuted },

  // Species cards
  spCard:     { flexDirection: 'row', alignItems: 'stretch' },
  spBorder:   { width: 4, borderRadius: 2, marginRight: 12 },
  spNameRow:  { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  spIcon:     { fontSize: 18 },
  spName:     { fontSize: 14, fontWeight: '700', color: colors.text, flex: 1 },
  spRegBadge: { backgroundColor: colors.surfaceAlt, borderRadius: 6, paddingHorizontal: 7, paddingVertical: 2, borderWidth: 1, borderColor: colors.border },
  spRegText:  { fontSize: 10, color: colors.textMuted, fontWeight: '600' },
  spTipPill:  { borderRadius: 8, paddingHorizontal: 9, paddingVertical: 4, borderWidth: 1, marginBottom: 5, alignSelf: 'flex-start' as const },
  spTipText:  { fontSize: 11, fontWeight: '600' as const },
  spBait:     { fontSize: 11, color: colors.textMuted },

  // Hourly wx
  cardSub2:     { fontSize: 11, color: colors.textFaint, marginBottom: 8 },
  wxHeaderRow:  { flexDirection: 'row', alignItems: 'center', marginBottom: 4, paddingHorizontal: 4 },
  wxHdr:        { fontSize: 9, fontWeight: '700', color: colors.textFaint, textTransform: 'uppercase' as const, letterSpacing: 0.5 },
  wxRow:        { flexDirection: 'row', alignItems: 'center', borderRadius: 6, marginBottom: 1, paddingVertical: 7, paddingHorizontal: 4 },
  nowAccent:    { position: 'absolute' as const, left: 0, top: 0, bottom: 0, width: 3, backgroundColor: colors.accent, borderRadius: 2 },
  wxTime:       { width: 52, fontSize: 11, color: colors.text },
  wxTemp:       { width: 38, fontSize: 13, fontWeight: '700' as const, color: '#facc15' },
  wxWind:       { width: 76, flexDirection: 'row' as const, alignItems: 'center' as const },
  wxPrecip:     { width: 36, fontSize: 11, fontWeight: '600' as const, textAlign: 'right' as const },
  wxTide:       { width: 44, fontSize: 11, fontWeight: '600' as const, textAlign: 'right' as const },
  wxSol:        { width: 30, fontSize: 13, textAlign: 'center' as const },

  // Location & map
  locRow:         { flexDirection: 'row', gap: 6, marginTop: 6, marginBottom: 12 },
  locPill:        { flex: 1, backgroundColor: colors.surfaceAlt, borderRadius: 8, padding: 8, borderWidth: 1, borderColor: colors.border },
  locPillLabel:   { fontSize: 8, fontWeight: '700', color: colors.textFaint, letterSpacing: 0.5, marginBottom: 3 },
  locPillVal:     { fontSize: 12, fontWeight: '700', color: colors.text },
  mapWrap:    { borderRadius: 12, overflow: 'hidden', marginBottom: 14 },
  mapWebView: { height: 300, borderRadius: 12, backgroundColor: '#eef5f3' },
  mapOpenBtn: { alignSelf: 'flex-end' as const, backgroundColor: colors.accent + '20', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 7, borderWidth: 1, borderColor: colors.accent + '60', marginTop: 8 },
  mapOpenText:{ fontSize: 12, color: colors.accent, fontWeight: '700' },
  nearbyTitle:    { fontSize: 9, fontWeight: '700', color: colors.textFaint, letterSpacing: 0.7, marginBottom: 8 },
  nearbyRow:      { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, gap: 10 },
  nearbyDist:     { backgroundColor: colors.accentFaint, borderRadius: 6, paddingHorizontal: 7, paddingVertical: 3, minWidth: 52, alignItems: 'center' },
  nearbyDistText: { fontSize: 11, color: colors.accent, fontWeight: '700' },
  nearbyName:     { flex: 1, fontSize: 13, color: colors.text, fontWeight: '500' },
  nearbyArrow:    { fontSize: 18, color: colors.textFaint },

  // Solunar timeline
  solLegendText:   { fontSize: 10, color: colors.textMuted },
  solTrack:        { height: 32, backgroundColor: colors.surfaceAlt, borderRadius: 8, overflow: 'hidden', position: 'relative' as const },
  solDawn:         { position: 'absolute' as const, top: 0, bottom: 0, backgroundColor: 'rgba(251,191,36,0.07)', borderRadius: 4 },
  solBlock:        { position: 'absolute' as const, borderRadius: 4, borderWidth: 1, justifyContent: 'center' as const, alignItems: 'center' as const },
  solNeedle:       { position: 'absolute' as const, top: 0, bottom: 0, width: 2, backgroundColor: colors.accent, borderRadius: 1 },
  solNowLabel:     { position: 'absolute' as const, fontSize: 8, color: colors.accent, fontWeight: '700' as const },
  // Solunar window rows
  solRow:          { flexDirection: 'row', gap: 10, backgroundColor: colors.surfaceAlt, borderRadius: 12, padding: 12, borderWidth: 1, borderColor: colors.border },
  solRowBar:       { width: 3, borderRadius: 2, alignSelf: 'stretch' as const },
  solBadge:        { borderRadius: 6, paddingHorizontal: 7, paddingVertical: 3, borderWidth: 1 },
  solBadgeText:    { fontSize: 10, fontWeight: '700' as const, letterSpacing: 0.3 },
  solRowTime:      { fontSize: 13, fontWeight: '700' as const, flex: 1 },
  solRowDur:       { fontSize: 10, color: colors.textFaint },
  solRowDesc:      { fontSize: 11.5, color: colors.text, lineHeight: 16 },
  solDot:          { width: 7, height: 7, borderRadius: 4 },
  solStatusText:   { fontSize: 12, fontWeight: '700' as const },
  solProgressTrack:{ height: 5, backgroundColor: colors.border, borderRadius: 3, overflow: 'hidden' as const },
  solProgressFill: { height: 5, borderRadius: 3 },
  solCountdown:    { fontSize: 12, color: colors.textMuted, fontWeight: '600' as const },
  solPassed:       { fontSize: 11, color: colors.textMuted, fontWeight: '600' as const },
})
