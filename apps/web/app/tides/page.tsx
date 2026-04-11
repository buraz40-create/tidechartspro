'use client'

import { useState, useEffect, useRef } from 'react'
import { FLORIDA_STATIONS }     from '@/lib/florida-stations'
import { ALABAMA_STATIONS }     from '@/lib/alabama-stations'
import { MISSISSIPPI_STATIONS } from '@/lib/mississippi-stations'
import { LOUISIANA_STATIONS }   from '@/lib/louisiana-stations'
import { TEXAS_STATIONS }       from '@/lib/texas-stations'

// ─── Live state configs ───────────────────────────────────────────────────────

const LIVE_STATES = [
  {
    name: 'Florida', abbr: 'FL', slug: 'florida', coast: 'Gulf & Atlantic',
    stations: FLORIDA_STATIONS,
    regions: ['Northeast Florida', 'East Central Florida', 'Southeast Florida', 'Florida Keys', 'Southwest Florida', 'Tampa Bay', 'Big Bend Florida', 'Florida Panhandle'],
    mapCenter: [27.8, -83.0] as [number, number], mapZoom: 6,
    blurb: 'Atlantic coast, Gulf Coast, Florida Keys and Panhandle.',
  },
  {
    name: 'Alabama', abbr: 'AL', slug: 'alabama', coast: 'Gulf Coast',
    stations: ALABAMA_STATIONS,
    regions: ['Alabama Gulf Coast', 'Mobile Bay'],
    mapCenter: [30.4, -87.9] as [number, number], mapZoom: 8,
    blurb: 'Mobile Bay, Gulf Shores, Orange Beach and Dauphin Island.',
  },
  {
    name: 'Mississippi', abbr: 'MS', slug: 'mississippi', coast: 'Gulf Coast',
    stations: MISSISSIPPI_STATIONS,
    regions: ['Mississippi Sound', 'Pascagoula Area'],
    mapCenter: [30.35, -89.0] as [number, number], mapZoom: 8,
    blurb: 'Mississippi Sound, Biloxi, Gulfport and Pascagoula.',
  },
  {
    name: 'Louisiana', abbr: 'LA', slug: 'louisiana', coast: 'Gulf Coast',
    stations: LOUISIANA_STATIONS,
    regions: ['Calcasieu / Sabine', 'Cameron', 'Vermilion / Atchafalaya', 'Barataria / New Orleans', 'Breton Sound / Mississippi Delta'],
    mapCenter: [29.4, -91.2] as [number, number], mapZoom: 7,
    blurb: 'New Orleans, Grand Isle, Cameron, Vermilion Bay and the Mississippi Delta.',
  },
  {
    name: 'Texas', abbr: 'TX', slug: 'texas', coast: 'Gulf Coast',
    stations: TEXAS_STATIONS,
    regions: ['Sabine / Beaumont', 'Galveston Bay', 'Matagorda Bay', 'Aransas / Corpus Christi', 'Lower Laguna Madre'],
    mapCenter: [28.5, -97.0] as [number, number], mapZoom: 6,
    blurb: 'Galveston Bay, Matagorda Bay, Corpus Christi and the Lower Laguna Madre.',
  },
]

// ─── Coming-soon states ───────────────────────────────────────────────────────

const COMING_SOON = [
  { name: 'Georgia',        abbr: 'GA', coast: 'Atlantic Coast',  blurb: 'Savannah, Brunswick and Golden Isles.' },
  { name: 'South Carolina', abbr: 'SC', coast: 'Atlantic Coast',  blurb: 'Charleston, Hilton Head and Myrtle Beach.' },
  { name: 'North Carolina', abbr: 'NC', coast: 'Atlantic Coast',  blurb: 'Outer Banks, Wilmington and Beaufort.' },
  { name: 'Virginia',       abbr: 'VA', coast: 'Atlantic Coast',  blurb: 'Chesapeake Bay, Virginia Beach and Hampton Roads.' },
  { name: 'Maryland',       abbr: 'MD', coast: 'Atlantic Coast',  blurb: 'Chesapeake Bay, Annapolis and Ocean City.' },
  { name: 'New Jersey',     abbr: 'NJ', coast: 'Atlantic Coast',  blurb: 'Cape May, Atlantic City and Sandy Hook.' },
  { name: 'New York',       abbr: 'NY', coast: 'Atlantic Coast',  blurb: 'New York Harbor, Long Island and Montauk.' },
  { name: 'Massachusetts',  abbr: 'MA', coast: 'Atlantic Coast',  blurb: 'Cape Cod, Boston Harbor and Nantucket.' },
  { name: 'Maine',          abbr: 'ME', coast: 'Atlantic Coast',  blurb: 'Portland, Bar Harbor and Acadia.' },
  { name: 'California',     abbr: 'CA', coast: 'Pacific Coast',   blurb: 'San Diego, Los Angeles, San Francisco and Monterey.' },
  { name: 'Oregon',         abbr: 'OR', coast: 'Pacific Coast',   blurb: 'Astoria, Newport and Coos Bay.' },
  { name: 'Washington',     abbr: 'WA', coast: 'Pacific Coast',   blurb: 'Puget Sound, Seattle and the San Juan Islands.' },
  { name: 'Alaska',         abbr: 'AK', coast: 'Pacific Coast',   blurb: 'Juneau, Ketchikan, Anchorage and Kodiak.' },
  { name: 'Hawaii',         abbr: 'HI', coast: 'Pacific Coast',   blurb: 'Honolulu, Maui, Kona and Hilo.' },
]

const COASTS = ['All Coasts', 'Gulf & Atlantic', 'Gulf Coast', 'Atlantic Coast', 'Pacific Coast']

const totalLive = LIVE_STATES.reduce((n, s) => n + s.stations.length, 0)

// ─── All map pins (live stations) ────────────────────────────────────────────

const ALL_PINS = LIVE_STATES.flatMap(state =>
  state.stations.map(s => ({
    lat: s.lat, lon: s.lon,
    name: s.name,
    stateSlug: state.slug,
    slug: s.slug,
  }))
)

export default function TidesHubPage() {
  const [coast, setCoast]   = useState('All Coasts')
  const [search, setSearch] = useState('')
  const mapRef  = useRef<HTMLDivElement>(null)
  const leafRef = useRef<unknown>(null)

  // ── Map ────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!mapRef.current || leafRef.current) return
    let destroyed = false

    import('leaflet').then(L => {
      if (destroyed || !mapRef.current) return
      import('leaflet/dist/leaflet.css')

      const map = L.map(mapRef.current, {
        center: [30.0, -90.0],
        zoom: 5,
        zoomControl: true,
      })

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        subdomains: 'abc', maxZoom: 19,
        attribution: '© <a href="https://openstreetmap.org">OSM</a>',
      }).addTo(map)

      // State region outline rectangles (approximate bounding boxes)
      const STATE_BOUNDS: Record<string, [[number,number],[number,number]]> = {
        florida:     [[24.4, -87.6], [31.0, -79.9]],
        alabama:     [[30.1, -88.5], [31.0, -87.0]],
        mississippi: [[30.1, -89.6], [30.6, -88.4]],
        louisiana:   [[28.8, -94.1], [31.0, -88.8]],
        texas:       [[25.8, -97.7], [30.4, -93.5]],
      }
      Object.values(STATE_BOUNDS).forEach(bounds => {
        L.rectangle(bounds, { color: '#38bdf8', weight: 1, opacity: 0.2, fillOpacity: 0.03, dashArray: '4 4' }).addTo(map)
      })

      // Station pins
      ALL_PINS.forEach(p => {
        const icon = L.divIcon({
          html: `<div style="width:8px;height:8px;border-radius:50%;background:#38bdf8;border:1.5px solid white;box-shadow:0 0 6px rgba(56,189,248,0.5);"></div>`,
          className: '', iconSize: [8, 8], iconAnchor: [4, 4], popupAnchor: [0, -6],
        })
        const popup = `<div style="font-family:system-ui;font-size:12px;min-width:130px">
          <div style="font-weight:700;margin-bottom:4px">${p.name}</div>
          <a href="/tides/${p.stateSlug}/${p.slug}" style="display:inline-block;background:#3b82f6;color:white;padding:3px 10px;border-radius:6px;text-decoration:none;font-size:11px;font-weight:600">View tides →</a>
        </div>`
        L.marker([p.lat, p.lon], { icon }).addTo(map).bindPopup(popup, { maxWidth: 180 })
      })

      leafRef.current = map
    })

    return () => {
      destroyed = true
      if (leafRef.current) { (leafRef.current as { remove(): void }).remove(); leafRef.current = null }
    }
  }, [])

  // ── Filter ─────────────────────────────────────────────────────────────────
  const q = search.trim().toLowerCase()

  const filteredLive = LIVE_STATES.filter(s => {
    const coastMatch  = coast === 'All Coasts' || s.coast === coast || s.coast.includes(coast.replace(' Coast','').replace(' & Atlantic',''))
    const searchMatch = !q || s.name.toLowerCase().includes(q) || s.blurb.toLowerCase().includes(q)
    return coastMatch && searchMatch
  })

  const filteredSoon = COMING_SOON.filter(s => {
    const coastMatch  = coast === 'All Coasts' || s.coast === coast
    const searchMatch = !q || s.name.toLowerCase().includes(q)
    return coastMatch && searchMatch
  })

  return (
    <main style={{ background: '#0a0e1a', color: '#f1f5f9', minHeight: '100vh', fontFamily: "'Inter','system-ui',sans-serif" }}>

      {/* Nav */}
      <nav style={{ borderBottom: '1px solid #1e2d45', background: 'rgba(10,14,26,0.95)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 200 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px', height: 64, display: 'flex', alignItems: 'center', gap: 8 }}>
          <a href="/" style={{ textDecoration: 'none' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.webp" alt="TideChartsPro" style={{ height: 52, width: 'auto', display: 'block' }} />
          </a>
          <span style={{ color: '#475569', margin: '0 6px' }}>/</span>
          <span style={{ fontSize: 13, color: '#f1f5f9' }}>Tides</span>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '28px 20px 20px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'inline-block', fontSize: 11, fontWeight: 700, background: '#0c4a6e', color: '#38bdf8', border: '1px solid #38bdf844', padding: '3px 12px', borderRadius: 20, marginBottom: 10, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            {totalLive.toLocaleString()} live stations · {LIVE_STATES.length} states
          </div>
          <h1 style={{ fontSize: 'clamp(20px,3.5vw,34px)', fontWeight: 700, marginBottom: 6, letterSpacing: '-0.02em' }}>
            Tide Charts by State
          </h1>
          <p style={{ color: '#94a3b8', fontSize: 14, maxWidth: 520, lineHeight: 1.6, margin: 0 }}>
            Live tide charts, tides for fishing, solunar periods and hourly forecasts — Gulf Coast fully live, more states coming soon.
          </p>
        </div>

        {/* Search */}
        <div style={{ position: 'relative', width: 'min(100%, 280px)', flexShrink: 0 }}>
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#475569', fontSize: 14, pointerEvents: 'none' }}>🔍</span>
          <input
            type="text"
            placeholder="Search states or locations…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', padding: '10px 12px 10px 34px', background: '#111827', border: '1px solid #1e2d45', borderRadius: 10, color: '#f1f5f9', fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
          />
          {search && (
            <button onClick={() => setSearch('')} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#475569', cursor: 'pointer', fontSize: 16 }}>×</button>
          )}
        </div>
      </div>

      {/* Map */}
      <div style={{ position: 'relative', height: 400, background: '#0f172a', borderTop: '1px solid #1e2d45', borderBottom: '1px solid #1e2d45' }}>
        <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
        <div style={{ position: 'absolute', bottom: 10, left: 12, zIndex: 1000, fontSize: 11, color: '#94a3b8', background: 'rgba(10,14,26,0.85)', padding: '4px 10px', borderRadius: 6, pointerEvents: 'none' }}>
          {totalLive.toLocaleString()} live stations across {LIVE_STATES.length} states · click any marker
        </div>
      </div>

      {/* Coast filter tabs */}
      <div style={{ borderBottom: '1px solid #1e2d45', background: '#0a0e1a', position: 'sticky', top: 64, zIndex: 100 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px', overflowX: 'auto', display: 'flex', gap: 4, height: 48, alignItems: 'center', scrollbarWidth: 'none' }}>
          {COASTS.map(c => (
            <button
              key={c}
              onClick={() => setCoast(c)}
              style={{
                flexShrink: 0, padding: '5px 14px', borderRadius: 20,
                border: coast === c ? '1px solid #38bdf8' : '1px solid #1e2d45',
                background: coast === c ? '#0c4a6e' : 'transparent',
                color: coast === c ? '#38bdf8' : '#94a3b8',
                fontSize: 12, fontWeight: coast === c ? 700 : 400,
                cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.15s',
              }}
            >{c}</button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '28px 20px 60px' }}>

        {/* Live states */}
        {filteredLive.length > 0 && (
          <div style={{ marginBottom: 40 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: '#38bdf8', boxShadow: '0 0 8px #38bdf8' }} />
              Live — Full tide charts available
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 14 }}>
              {filteredLive.map(state => (
                <a
                  key={state.slug}
                  href={`/tides/${state.slug}`}
                  style={{ display: 'block', background: '#111827', border: '1px solid #1e2d45', borderRadius: 12, padding: '18px 20px', textDecoration: 'none', transition: 'border-color 0.15s, background 0.15s', position: 'relative', overflow: 'hidden' }}
                >
                  {/* Accent bar */}
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, #38bdf8, #3b82f6)' }} />

                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <span style={{ fontSize: 22, fontWeight: 800, color: '#f1f5f9', lineHeight: 1 }}>{state.abbr}</span>
                        <span style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9' }}>{state.name}</span>
                      </div>
                      <div style={{ fontSize: 11, color: '#475569' }}>{state.coast}</div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontSize: 20, fontWeight: 800, color: '#38bdf8', lineHeight: 1 }}>{state.stations.length}</div>
                      <div style={{ fontSize: 10, color: '#475569', marginTop: 2 }}>stations</div>
                    </div>
                  </div>

                  <p style={{ fontSize: 12, color: '#94a3b8', margin: '0 0 12px', lineHeight: 1.5 }}>{state.blurb}</p>

                  {/* Region pills */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 14 }}>
                    {state.regions.slice(0, 4).map(r => (
                      <span key={r} style={{ fontSize: 10, background: '#1e2d45', color: '#94a3b8', padding: '2px 8px', borderRadius: 20 }}>{r}</span>
                    ))}
                    {state.regions.length > 4 && (
                      <span style={{ fontSize: 10, color: '#475569', padding: '2px 0' }}>+{state.regions.length - 4} more</span>
                    )}
                  </div>

                  <div style={{ fontSize: 12, fontWeight: 700, color: '#38bdf8' }}>
                    View {state.name} tide charts →
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Coming soon states */}
        {filteredSoon.length > 0 && (
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: '#475569' }} />
              Coming soon
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 10 }}>
              {filteredSoon.map(state => (
                <div
                  key={state.abbr}
                  style={{ background: '#0f172a', border: '1px solid #1e2d45', borderRadius: 10, padding: '14px 16px', opacity: 0.6 }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 16, fontWeight: 800, color: '#94a3b8' }}>{state.abbr}</span>
                      <span style={{ fontSize: 14, fontWeight: 600, color: '#94a3b8' }}>{state.name}</span>
                    </div>
                    <span style={{ fontSize: 10, fontWeight: 700, background: '#1e2d45', color: '#475569', padding: '2px 8px', borderRadius: 20, letterSpacing: '0.04em' }}>SOON</span>
                  </div>
                  <div style={{ fontSize: 11, color: '#475569', marginBottom: 4 }}>{state.coast}</div>
                  <div style={{ fontSize: 11, color: '#334155', lineHeight: 1.4 }}>{state.blurb}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {filteredLive.length === 0 && filteredSoon.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#475569' }}>
            No states found.{' '}
            <button onClick={() => { setSearch(''); setCoast('All Coasts') }} style={{ background: 'none', border: 'none', color: '#38bdf8', cursor: 'pointer', fontSize: 'inherit' }}>
              Clear filters
            </button>
          </div>
        )}

        <div style={{ marginTop: 40, paddingTop: 24, borderTop: '1px solid #1e2d45' }}>
          <a href="/" style={{ fontSize: 13, color: '#475569', textDecoration: 'none' }}>← Back to home</a>
        </div>
      </div>
    </main>
  )
}
