'use client'

import { useState, useEffect, useRef } from 'react'
import { FLORIDA_STATIONS }        from '@/lib/florida-stations'
import { ALABAMA_STATIONS }        from '@/lib/alabama-stations'
import { MISSISSIPPI_STATIONS }    from '@/lib/mississippi-stations'
import { LOUISIANA_STATIONS }      from '@/lib/louisiana-stations'
import { TEXAS_STATIONS }          from '@/lib/texas-stations'
import { GEORGIA_STATIONS }        from '@/lib/georgia-stations'
import { SOUTH_CAROLINA_STATIONS } from '@/lib/south-carolina-stations'
import { NORTH_CAROLINA_STATIONS } from '@/lib/north-carolina-stations'
import { VIRGINIA_STATIONS }       from '@/lib/virginia-stations'
import { MARYLAND_STATIONS }       from '@/lib/maryland-stations'
import { DELAWARE_STATIONS }       from '@/lib/delaware-stations'
import { NEW_JERSEY_STATIONS }     from '@/lib/new-jersey-stations'
import { NEW_YORK_STATIONS }       from '@/lib/new-york-stations'
import { CONNECTICUT_STATIONS }    from '@/lib/connecticut-stations'
import { RHODE_ISLAND_STATIONS }   from '@/lib/rhode-island-stations'
import { MASSACHUSETTS_STATIONS }  from '@/lib/massachusetts-stations'
import { NEW_HAMPSHIRE_STATIONS }  from '@/lib/new-hampshire-stations'
import { MAINE_STATIONS }          from '@/lib/maine-stations'
import { CALIFORNIA_STATIONS }     from '@/lib/california-stations'
import { OREGON_STATIONS }         from '@/lib/oregon-stations'
import { WASHINGTON_STATIONS }     from '@/lib/washington-stations'
import { ALASKA_STATIONS }         from '@/lib/alaska-stations'
import { HAWAII_STATIONS }         from '@/lib/hawaii-stations'

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
  {
    name: 'Georgia', abbr: 'GA', slug: 'georgia', coast: 'Atlantic Coast',
    stations: GEORGIA_STATIONS,
    regions: ['Savannah / Tybee Island', 'Golden Isles / Brunswick', 'St. Marys / Cumberland Island'],
    mapCenter: [31.5, -81.3] as [number, number], mapZoom: 7,
    blurb: 'Savannah, Brunswick, Golden Isles and Cumberland Island.',
  },
  {
    name: 'South Carolina', abbr: 'SC', slug: 'south-carolina', coast: 'Atlantic Coast',
    stations: SOUTH_CAROLINA_STATIONS,
    regions: ['Grand Strand / Myrtle Beach', 'Charleston / Lowcountry', 'Beaufort / Sea Islands'],
    mapCenter: [33.0, -80.2] as [number, number], mapZoom: 7,
    blurb: 'Charleston, Hilton Head, Myrtle Beach and the Sea Islands.',
  },
  {
    name: 'North Carolina', abbr: 'NC', slug: 'north-carolina', coast: 'Atlantic Coast',
    stations: NORTH_CAROLINA_STATIONS,
    regions: ['Outer Banks / Pamlico Sound', 'Albemarle Sound', 'New Bern / Crystal Coast', 'Cape Fear / Wilmington'],
    mapCenter: [35.0, -77.5] as [number, number], mapZoom: 7,
    blurb: 'Outer Banks, Wilmington, Cape Fear and Pamlico Sound.',
  },
  {
    name: 'Virginia', abbr: 'VA', slug: 'virginia', coast: 'Atlantic Coast',
    stations: VIRGINIA_STATIONS,
    regions: ['Virginia Coast / Eastern Shore', 'Lower Chesapeake Bay / Hampton Roads', 'Virginia Beach / Currituck Sound', 'Upper Chesapeake Bay'],
    mapCenter: [37.5, -76.0] as [number, number], mapZoom: 7,
    blurb: 'Chesapeake Bay, Virginia Beach, Hampton Roads and the Eastern Shore.',
  },
  {
    name: 'Maryland', abbr: 'MD', slug: 'maryland', coast: 'Atlantic Coast',
    stations: MARYLAND_STATIONS,
    regions: ['Maryland Ocean Shore', 'Lower Chesapeake Bay / Potomac', 'Middle Chesapeake Bay', 'Upper Chesapeake Bay'],
    mapCenter: [38.5, -76.0] as [number, number], mapZoom: 7,
    blurb: 'Chesapeake Bay, Annapolis, Ocean City and the Potomac River.',
  },
  {
    name: 'Delaware', abbr: 'DE', slug: 'delaware', coast: 'Atlantic Coast',
    stations: DELAWARE_STATIONS,
    regions: ['Delaware Bay', 'Delaware Ocean Shore'],
    mapCenter: [39.0, -75.5] as [number, number], mapZoom: 8,
    blurb: 'Delaware Bay, Lewes, Rehoboth Beach and the Delaware Seashore.',
  },
  {
    name: 'New Jersey', abbr: 'NJ', slug: 'new-jersey', coast: 'Atlantic Coast',
    stations: NEW_JERSEY_STATIONS,
    regions: ['New York Harbor / Raritan Bay', 'Jersey Shore North', 'Jersey Shore South', 'Delaware Bay NJ'],
    mapCenter: [39.5, -74.5] as [number, number], mapZoom: 7,
    blurb: 'Jersey Shore, Cape May, Atlantic City and Sandy Hook.',
  },
  {
    name: 'New York', abbr: 'NY', slug: 'new-york', coast: 'Atlantic Coast',
    stations: NEW_YORK_STATIONS,
    regions: ['New York Harbor / East River', 'Eastern Long Island', 'Long Island Sound'],
    mapCenter: [41.0, -73.5] as [number, number], mapZoom: 7,
    blurb: 'New York Harbor, Long Island, Montauk and Long Island Sound.',
  },
  {
    name: 'Connecticut', abbr: 'CT', slug: 'connecticut', coast: 'Atlantic Coast',
    stations: CONNECTICUT_STATIONS,
    regions: ['Eastern Long Island Sound', 'Central Long Island Sound', 'Western Long Island Sound'],
    mapCenter: [41.4, -72.5] as [number, number], mapZoom: 8,
    blurb: 'Long Island Sound from Greenwich to the Thames River.',
  },
  {
    name: 'Rhode Island', abbr: 'RI', slug: 'rhode-island', coast: 'Atlantic Coast',
    stations: RHODE_ISLAND_STATIONS,
    regions: ['Rhode Island Sound', 'Narragansett Bay'],
    mapCenter: [41.5, -71.5] as [number, number], mapZoom: 9,
    blurb: "Narragansett Bay, Newport, Block Island and Rhode Island Sound.",
  },
  {
    name: 'Massachusetts', abbr: 'MA', slug: 'massachusetts', coast: 'Atlantic Coast',
    stations: MASSACHUSETTS_STATIONS,
    regions: ['Boston Harbor / South Shore', 'Buzzards Bay / South Coast', 'Cape Cod Bay', 'Cape Cod & Islands'],
    mapCenter: [41.9, -70.5] as [number, number], mapZoom: 7,
    blurb: "Cape Cod, Boston Harbor, Martha's Vineyard and Nantucket.",
  },
  {
    name: 'New Hampshire', abbr: 'NH', slug: 'new-hampshire', coast: 'Atlantic Coast',
    stations: NEW_HAMPSHIRE_STATIONS,
    regions: ['New Hampshire Seacoast'],
    mapCenter: [43.0, -70.8] as [number, number], mapZoom: 9,
    blurb: 'Portsmouth, Rye Harbor, Hampton Beach and the Seacoast.',
  },
  {
    name: 'Maine', abbr: 'ME', slug: 'maine', coast: 'Atlantic Coast',
    stations: MAINE_STATIONS,
    regions: ['Downeast Maine / Acadia', 'Midcoast Maine', 'Casco Bay / Portland', 'York County / Southern Maine'],
    mapCenter: [44.5, -69.0] as [number, number], mapZoom: 7,
    blurb: 'Portland, Bar Harbor, Acadia and Downeast Maine.',
  },
  {
    name: 'California', abbr: 'CA', slug: 'california', coast: 'Pacific Coast',
    stations: CALIFORNIA_STATIONS,
    regions: ['San Diego', 'Los Angeles / Orange County', 'Santa Barbara / Ventura', 'Central California', 'San Francisco Bay Area', 'North Coast California'],
    mapCenter: [37.0, -122.0] as [number, number], mapZoom: 6,
    blurb: 'San Diego, Los Angeles, San Francisco and the California coast.',
  },
  {
    name: 'Oregon', abbr: 'OR', slug: 'oregon', coast: 'Pacific Coast',
    stations: OREGON_STATIONS,
    regions: ['Southern Oregon Coast', 'Central Oregon Coast', 'Columbia River / Astoria'],
    mapCenter: [44.5, -124.0] as [number, number], mapZoom: 7,
    blurb: 'Astoria, Newport, Coos Bay and the Oregon coast.',
  },
  {
    name: 'Washington', abbr: 'WA', slug: 'washington', coast: 'Pacific Coast',
    stations: WASHINGTON_STATIONS,
    regions: ['Columbia River WA', 'Washington Ocean Coast', 'South Puget Sound', 'North Puget Sound', 'Central Puget Sound / Seattle', 'San Juan Islands / Strait of Juan de Fuca'],
    mapCenter: [47.5, -122.5] as [number, number], mapZoom: 7,
    blurb: 'Puget Sound, Seattle, San Juan Islands and the Strait of Juan de Fuca.',
  },
  {
    name: 'Alaska', abbr: 'AK', slug: 'alaska', coast: 'Pacific Coast',
    stations: ALASKA_STATIONS,
    regions: ['Southeast Alaska', 'Gulf of Alaska', 'Cook Inlet / Prince William Sound', 'Kodiak Island', 'Western Alaska / Aleutians'],
    mapCenter: [60.0, -150.0] as [number, number], mapZoom: 4,
    blurb: 'Juneau, Ketchikan, Anchorage, Kodiak and the Aleutians.',
  },
  {
    name: 'Hawaii', abbr: 'HI', slug: 'hawaii', coast: 'Pacific Coast',
    stations: HAWAII_STATIONS,
    regions: ['Kauai / Niihau', 'Oahu', 'Maui / Molokai', 'Hawaii (Big Island)'],
    mapCenter: [20.5, -157.0] as [number, number], mapZoom: 7,
    blurb: 'Honolulu, Maui, Kona, Hilo and the Hawaiian island chain.',
  },
]

const COASTS = ['All Coasts', 'Gulf & Atlantic', 'Gulf Coast', 'Atlantic Coast', 'Pacific Coast']

const totalLive = LIVE_STATES.reduce((n, s) => n + s.stations.length, 0)

// ─── All map pins (live stations — continental US only for performance) ───────

const ALL_PINS = LIVE_STATES
  .filter(state => state.abbr !== 'AK' && state.abbr !== 'HI')
  .flatMap(state =>
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
        center: [37.5, -91.0],
        zoom: 4,
        zoomControl: true,
      })

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        subdomains: 'abc', maxZoom: 19,
        attribution: '© <a href="https://openstreetmap.org">OSM</a>',
      }).addTo(map)

      // Station pins
      ALL_PINS.forEach(p => {
        const icon = L.divIcon({
          html: `<div style="width:7px;height:7px;border-radius:50%;background:#38bdf8;border:1.5px solid white;box-shadow:0 0 4px rgba(56,189,248,0.5);"></div>`,
          className: '', iconSize: [7, 7], iconAnchor: [3, 3], popupAnchor: [0, -5],
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
    const coastMatch  = coast === 'All Coasts' || s.coast === coast ||
      (coast === 'Gulf & Atlantic' && (s.coast === 'Gulf Coast' || s.coast === 'Atlantic Coast' || s.coast === 'Gulf & Atlantic'))
    const searchMatch = !q || s.name.toLowerCase().includes(q) || s.blurb.toLowerCase().includes(q)
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
            Live tide charts, tides for fishing, solunar periods and hourly forecasts for every US coastal state.
          </p>
        </div>

        {/* Search */}
        <div style={{ position: 'relative', width: 'min(100%, 280px)', flexShrink: 0 }}>
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#475569', fontSize: 14, pointerEvents: 'none' }}>🔍</span>
          <input
            type="text"
            placeholder="Search states…"
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
          {ALL_PINS.length.toLocaleString()} stations shown (continental US) · click any marker
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

        {filteredLive.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 14 }}>
            {filteredLive.map(state => (
              <a
                key={state.slug}
                href={`/tides/${state.slug}`}
                style={{ display: 'block', background: '#111827', border: '1px solid #1e2d45', borderRadius: 12, padding: '18px 20px', textDecoration: 'none', transition: 'border-color 0.15s', position: 'relative', overflow: 'hidden' }}
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
        ) : (
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
