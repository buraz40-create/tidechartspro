'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import dynamic from 'next/dynamic'
import type { MapStation } from './HomeMap'
import TopSpots from './TopSpots'
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

const HomeMap = dynamic(() => import('./HomeMap'), { ssr: false })

const THEMES = {
  dark: {
    bg: '#0a0f1a',
    surface: '#111827',
    surfaceAlt: '#0f172a',
    border: '#1e2d40',
    text: '#f1f5f9',
    textMuted: '#94a3b8',
    textFaint: '#475569',
    accent: '#3b82f6',
    accentFaint: '#1e3a5f',
    nav: 'rgba(10,15,26,0.92)',
  },
  light: {
    bg: '#f0f4f8',
    surface: '#ffffff',
    surfaceAlt: '#f8fafc',
    border: '#d1dce8',
    text: '#0f172a',
    textMuted: '#475569',
    textFaint: '#94a3b8',
    accent: '#2563eb',
    accentFaint: '#dbeafe',
    nav: 'rgba(240,244,248,0.95)',
  },
  red: {
    bg: '#0d0500',
    surface: '#1a0800',
    surfaceAlt: '#150600',
    border: '#3b1000',
    text: '#ffe8d6',
    textMuted: '#c2694a',
    textFaint: '#7a3520',
    accent: '#ef4444',
    accentFaint: '#450a0a',
    nav: 'rgba(13,5,0,0.94)',
  },
}

// Map stations per state (slug = full path for non-FL states)
const mkPins = (abbr: string, slug: string, arr: typeof FLORIDA_STATIONS): MapStation[] =>
  arr.map(s => ({ name: `${s.name}, ${abbr}`, lat: s.lat, lon: s.lon, slug: `/tides/us/${slug}/${s.slug}`, state: abbr, live: true }))

const FL_MAP_STATIONS: MapStation[] = FLORIDA_STATIONS.map(s => ({
  name: `${s.name}, FL`, lat: s.lat, lon: s.lon, slug: s.slug, state: 'FL', live: true,
}))

// Continental US stations for home map (AK/HI excluded for performance)
const STATIONS: MapStation[] = [
  ...FL_MAP_STATIONS,
  ...mkPins('AL', 'alabama',        ALABAMA_STATIONS),
  ...mkPins('MS', 'mississippi',    MISSISSIPPI_STATIONS),
  ...mkPins('LA', 'louisiana',      LOUISIANA_STATIONS),
  ...mkPins('TX', 'texas',          TEXAS_STATIONS),
  ...mkPins('GA', 'georgia',        GEORGIA_STATIONS),
  ...mkPins('SC', 'south-carolina', SOUTH_CAROLINA_STATIONS),
  ...mkPins('NC', 'north-carolina', NORTH_CAROLINA_STATIONS),
  ...mkPins('VA', 'virginia',       VIRGINIA_STATIONS),
  ...mkPins('MD', 'maryland',       MARYLAND_STATIONS),
  ...mkPins('DE', 'delaware',       DELAWARE_STATIONS),
  ...mkPins('NJ', 'new-jersey',     NEW_JERSEY_STATIONS),
  ...mkPins('NY', 'new-york',       NEW_YORK_STATIONS),
  ...mkPins('CT', 'connecticut',    CONNECTICUT_STATIONS),
  ...mkPins('RI', 'rhode-island',   RHODE_ISLAND_STATIONS),
  ...mkPins('MA', 'massachusetts',  MASSACHUSETTS_STATIONS),
  ...mkPins('NH', 'new-hampshire',  NEW_HAMPSHIRE_STATIONS),
  ...mkPins('ME', 'maine',          MAINE_STATIONS),
  ...mkPins('CA', 'california',     CALIFORNIA_STATIONS),
  ...mkPins('OR', 'oregon',         OREGON_STATIONS),
  ...mkPins('WA', 'washington',     WASHINGTON_STATIONS),
]

// All state station arrays for the accordion
const STATE_ACCORDIONS = [
  { name: 'Alabama',        slug: 'alabama',        sub: 'Mobile Bay, Gulf Shores & Dauphin Island',            stations: mkPins('AL', 'alabama',         ALABAMA_STATIONS),        suffix: 'AL' },
  { name: 'Alaska',         slug: 'alaska',         sub: 'Southeast Alaska, Cook Inlet & Prince William Sound', stations: mkPins('AK', 'alaska',          ALASKA_STATIONS),         suffix: 'AK' },
  { name: 'California',     slug: 'california',     sub: 'San Diego, Los Angeles, San Francisco & Eureka',      stations: mkPins('CA', 'california',      CALIFORNIA_STATIONS),     suffix: 'CA' },
  { name: 'Connecticut',    slug: 'connecticut',    sub: 'Long Island Sound, Thames River & Connecticut River', stations: mkPins('CT', 'connecticut',     CONNECTICUT_STATIONS),    suffix: 'CT' },
  { name: 'Delaware',       slug: 'delaware',       sub: 'Delaware Bay, Delaware River & Inland Bays',          stations: mkPins('DE', 'delaware',        DELAWARE_STATIONS),       suffix: 'DE' },
  { name: 'Florida',        slug: 'florida',        sub: 'Atlantic coast, Gulf Coast, Keys & Panhandle',        stations: FL_MAP_STATIONS,                                          suffix: 'FL' },
  { name: 'Georgia',        slug: 'georgia',        sub: 'Savannah River, Altamaha River & Golden Isles',       stations: mkPins('GA', 'georgia',         GEORGIA_STATIONS),        suffix: 'GA' },
  { name: 'Hawaii',         slug: 'hawaii',         sub: 'Oahu, Maui, Big Island & Kauai',                      stations: mkPins('HI', 'hawaii',          HAWAII_STATIONS),         suffix: 'HI' },
  { name: 'Louisiana',      slug: 'louisiana',      sub: 'New Orleans, Grand Isle & Vermilion Bay',             stations: mkPins('LA', 'louisiana',       LOUISIANA_STATIONS),      suffix: 'LA' },
  { name: 'Maine',          slug: 'maine',          sub: 'Portland, Bar Harbor, Penobscot Bay & Eastport',      stations: mkPins('ME', 'maine',           MAINE_STATIONS),          suffix: 'ME' },
  { name: 'Maryland',       slug: 'maryland',       sub: 'Chesapeake Bay, Ocean City & Baltimore Harbor',       stations: mkPins('MD', 'maryland',        MARYLAND_STATIONS),       suffix: 'MD' },
  { name: 'Massachusetts',  slug: 'massachusetts',  sub: 'Boston Harbor, Cape Cod, Nantucket & Cape Ann',       stations: mkPins('MA', 'massachusetts',   MASSACHUSETTS_STATIONS),  suffix: 'MA' },
  { name: 'Mississippi',    slug: 'mississippi',    sub: 'Mississippi Sound, Biloxi & Gulfport',                stations: mkPins('MS', 'mississippi',     MISSISSIPPI_STATIONS),    suffix: 'MS' },
  { name: 'New Hampshire',  slug: 'new-hampshire',  sub: 'Great Bay, Hampton Harbor & Piscataqua River',        stations: mkPins('NH', 'new-hampshire',   NEW_HAMPSHIRE_STATIONS),  suffix: 'NH' },
  { name: 'New Jersey',     slug: 'new-jersey',     sub: 'Jersey Shore, Delaware Bay & New York Harbor',        stations: mkPins('NJ', 'new-jersey',      NEW_JERSEY_STATIONS),     suffix: 'NJ' },
  { name: 'New York',       slug: 'new-york',       sub: 'Long Island Sound, New York Harbor & Hudson River',   stations: mkPins('NY', 'new-york',        NEW_YORK_STATIONS),       suffix: 'NY' },
  { name: 'North Carolina', slug: 'north-carolina', sub: 'Outer Banks, Cape Fear & Pamlico Sound',              stations: mkPins('NC', 'north-carolina',  NORTH_CAROLINA_STATIONS), suffix: 'NC' },
  { name: 'Oregon',         slug: 'oregon',         sub: 'Columbia River, Coos Bay & Tillamook Bay',            stations: mkPins('OR', 'oregon',          OREGON_STATIONS),         suffix: 'OR' },
  { name: 'Rhode Island',   slug: 'rhode-island',   sub: 'Narragansett Bay, Newport & Providence River',        stations: mkPins('RI', 'rhode-island',    RHODE_ISLAND_STATIONS),   suffix: 'RI' },
  { name: 'South Carolina', slug: 'south-carolina', sub: 'Charleston Harbor, Myrtle Beach & Port Royal Sound',  stations: mkPins('SC', 'south-carolina',  SOUTH_CAROLINA_STATIONS), suffix: 'SC' },
  { name: 'Texas',          slug: 'texas',          sub: 'Galveston Bay, Corpus Christi & Lower Laguna Madre',  stations: mkPins('TX', 'texas',           TEXAS_STATIONS),          suffix: 'TX' },
  { name: 'Virginia',       slug: 'virginia',       sub: 'Chesapeake Bay, Hampton Roads & Virginia Beach',      stations: mkPins('VA', 'virginia',        VIRGINIA_STATIONS),       suffix: 'VA' },
  { name: 'Washington',     slug: 'washington',     sub: 'Puget Sound, Columbia River & Strait of Juan de Fuca', stations: mkPins('WA', 'washington',     WASHINGTON_STATIONS),     suffix: 'WA' },
] as const

// Full search pool (all 23 states including AK/HI)
const SEARCH_POOL = [
  ...STATIONS,
  ...mkPins('AK', 'alaska', ALASKA_STATIONS),
  ...mkPins('HI', 'hawaii', HAWAII_STATIONS),
]


const FEATURES = [
  { icon: '🌊', title: 'Live tide charts',       color: '#3b82f6', desc: 'Real-time water level plotted on predicted curve. See exactly where the tide is right now.' },
  { icon: '🎣', title: 'Fishing score',           color: '#10b981', desc: 'Daily A-F grade combining tide phase, pressure trend, solunar periods, and water temp.' },
  { icon: '🐟', title: 'Species bite times',      color: '#f97316', desc: 'Location-aware guide - what\'s biting today, best windows, hot baits, and regulations.' },
  { icon: '🌙', title: 'Solunar periods',         color: '#a855f7', desc: 'Major and minor feeding periods based on lunar transit, aligned with your local tide.' },
  { icon: '🔴', title: 'Red night vision mode',   color: '#ef4444', desc: 'Preserves your natural night vision while checking tides. Built for serious night anglers.' },
  { icon: '📍', title: 'Fishing map',             color: '#06b6d4', desc: 'Tide stations, boat ramps, piers, and marinas on one interactive map.' },
]

// State card metadata - color (matches map clusters), region, count
const STATES = [
  { name: 'Florida',        code: 'FL', count: FLORIDA_STATIONS.length,        slug: 'florida',        color: '#10b981', region: 'South Atlantic / Gulf' },
  { name: 'Alabama',        code: 'AL', count: ALABAMA_STATIONS.length,        slug: 'alabama',        color: '#d97706', region: 'Gulf Coast'           },
  { name: 'Mississippi',    code: 'MS', count: MISSISSIPPI_STATIONS.length,    slug: 'mississippi',    color: '#f59e0b', region: 'Gulf Coast'           },
  { name: 'Louisiana',      code: 'LA', count: LOUISIANA_STATIONS.length,      slug: 'louisiana',      color: '#ea580c', region: 'Gulf Coast'           },
  { name: 'Texas',          code: 'TX', count: TEXAS_STATIONS.length,          slug: 'texas',          color: '#dc2626', region: 'Gulf Coast'           },
  { name: 'Georgia',        code: 'GA', count: GEORGIA_STATIONS.length,        slug: 'georgia',        color: '#059669', region: 'South Atlantic'       },
  { name: 'South Carolina', code: 'SC', count: SOUTH_CAROLINA_STATIONS.length, slug: 'south-carolina', color: '#0d9488', region: 'South Atlantic'       },
  { name: 'North Carolina', code: 'NC', count: NORTH_CAROLINA_STATIONS.length, slug: 'north-carolina', color: '#14b8a6', region: 'South Atlantic'       },
  { name: 'Virginia',       code: 'VA', count: VIRGINIA_STATIONS.length,       slug: 'virginia',       color: '#0ea5e9', region: 'Mid-Atlantic'         },
  { name: 'Maryland',       code: 'MD', count: MARYLAND_STATIONS.length,       slug: 'maryland',       color: '#0284c7', region: 'Mid-Atlantic'         },
  { name: 'Delaware',       code: 'DE', count: DELAWARE_STATIONS.length,       slug: 'delaware',       color: '#0369a1', region: 'Mid-Atlantic'         },
  { name: 'New Jersey',     code: 'NJ', count: NEW_JERSEY_STATIONS.length,     slug: 'new-jersey',     color: '#1d4ed8', region: 'Mid-Atlantic'         },
  { name: 'New York',       code: 'NY', count: NEW_YORK_STATIONS.length,       slug: 'new-york',       color: '#7c3aed', region: 'Northeast'            },
  { name: 'Connecticut',    code: 'CT', count: CONNECTICUT_STATIONS.length,    slug: 'connecticut',    color: '#8b5cf6', region: 'Northeast'            },
  { name: 'Rhode Island',   code: 'RI', count: RHODE_ISLAND_STATIONS.length,   slug: 'rhode-island',   color: '#a855f7', region: 'Northeast'            },
  { name: 'Massachusetts',  code: 'MA', count: MASSACHUSETTS_STATIONS.length,  slug: 'massachusetts',  color: '#c026d3', region: 'Northeast'            },
  { name: 'New Hampshire',  code: 'NH', count: NEW_HAMPSHIRE_STATIONS.length,  slug: 'new-hampshire',  color: '#db2777', region: 'Northeast'            },
  { name: 'Maine',          code: 'ME', count: MAINE_STATIONS.length,          slug: 'maine',          color: '#be185d', region: 'Northeast'            },
  { name: 'California',     code: 'CA', count: CALIFORNIA_STATIONS.length,     slug: 'california',     color: '#06b6d4', region: 'Pacific Coast'        },
  { name: 'Oregon',         code: 'OR', count: OREGON_STATIONS.length,         slug: 'oregon',         color: '#0891b2', region: 'Pacific Coast'        },
  { name: 'Washington',     code: 'WA', count: WASHINGTON_STATIONS.length,     slug: 'washington',     color: '#0e7490', region: 'Pacific Coast'        },
  { name: 'Alaska',         code: 'AK', count: ALASKA_STATIONS.length,         slug: 'alaska',         color: '#64748b', region: 'Pacific Outpost'      },
  { name: 'Hawaii',         code: 'HI', count: HAWAII_STATIONS.length,         slug: 'hawaii',         color: '#eab308', region: 'Pacific Outpost'      },
]

export default function Home() {
  const [mode, setMode] = useState<'dark' | 'light' | 'red'>(() => {
    if (typeof window !== 'undefined') return (localStorage.getItem('tcpMode') as 'dark' | 'light' | 'red') || 'dark'
    return 'dark'
  })
  useEffect(() => { localStorage.setItem('tcpMode', mode) }, [mode])
  const [query, setQuery]       = useState('')
  const [dropOpen, setDropOpen] = useState(false)
  const [openState, setOpenState] = useState<string | null>(null)
  const [geoStatus, setGeoStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [geoError, setGeoError] = useState<string>('')
  const [geoResults, setGeoResults] = useState<Array<typeof SEARCH_POOL[0] & { distMi: number }>>([])
  const searchRef = useRef<HTMLDivElement>(null)
  const [searchFocused, setSearchFocused] = useState(false)

  // Typewriter placeholder - cycles through example searches when input is empty + unfocused
  const TYPEWRITER_EXAMPLES = useMemo(() => [
    'Search Galveston, TX',
    'Search Mayport, FL',
    'Search Cape Cod, MA',
    'Search Newport Beach, CA',
    'Search Pablo Creek, FL',
    'Search Outer Banks, NC',
  ], [])
  const [typedPlaceholder, setTypedPlaceholder] = useState(TYPEWRITER_EXAMPLES[0])
  useEffect(() => {
    if (searchFocused || query) return
    let exampleIdx = 0
    let charIdx = TYPEWRITER_EXAMPLES[0].length
    let phase: 'pausing' | 'deleting' | 'typing' = 'pausing'
    let timer: ReturnType<typeof setTimeout>
    const tick = () => {
      const current = TYPEWRITER_EXAMPLES[exampleIdx]
      if (phase === 'pausing') {
        phase = 'deleting'
        timer = setTimeout(tick, 1400)
        return
      }
      if (phase === 'deleting') {
        charIdx = Math.max(0, charIdx - 1)
        setTypedPlaceholder(current.slice(0, charIdx))
        if (charIdx === 0) {
          phase = 'typing'
          exampleIdx = (exampleIdx + 1) % TYPEWRITER_EXAMPLES.length
        }
        timer = setTimeout(tick, 30)
        return
      }
      const next = TYPEWRITER_EXAMPLES[exampleIdx]
      charIdx = Math.min(next.length, charIdx + 1)
      setTypedPlaceholder(next.slice(0, charIdx))
      if (charIdx === next.length) {
        phase = 'pausing'
        timer = setTimeout(tick, 1800)
        return
      }
      timer = setTimeout(tick, 55)
    }
    timer = setTimeout(tick, 1800)
    return () => clearTimeout(timer)
  }, [searchFocused, query, TYPEWRITER_EXAMPLES])

  const findNearestAndShow = () => {
    if (!navigator.geolocation) {
      setGeoStatus('error')
      setGeoError('Geolocation not supported by this browser')
      return
    }
    setGeoStatus('loading')
    setGeoError('')
    setGeoResults([])
    navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude, longitude } = pos.coords
        const toRad = (d: number) => d * Math.PI / 180
        const withDist = SEARCH_POOL.map(s => {
          const dLat = toRad(s.lat - latitude)
          const dLon = toRad(s.lon - longitude)
          const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(latitude)) * Math.cos(toRad(s.lat)) * Math.sin(dLon / 2) ** 2
          const distKm = 2 * 6371 * Math.asin(Math.sqrt(a))
          return { ...s, distMi: distKm * 0.621371 }
        })
        withDist.sort((a, b) => a.distMi - b.distMi)
        setGeoResults(withDist.slice(0, 8))
        setGeoStatus('idle')
        setDropOpen(true)
      },
      err => {
        setGeoStatus('error')
        setGeoError(err.code === err.PERMISSION_DENIED ? 'Location access denied' : 'Could not get your location')
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 },
    )
  }

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return SEARCH_POOL.filter(s => s.name.toLowerCase().includes(q)).slice(0, 8)
  }, [query])
  const t = THEMES[mode]

  const modeBtn = (m: 'dark' | 'light' | 'red', label: string, icon: string) => (
    <button
      onClick={() => setMode(m)}
      style={{
        display: 'flex', alignItems: 'center', gap: 5,
        background: mode === m ? t.accent : t.surface,
        color: mode === m ? '#fff' : t.textMuted,
        border: `1px solid ${mode === m ? t.accent : t.border}`,
        borderRadius: 8,
        padding: '5px 12px',
        fontSize: 12,
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.15s',
      }}
    >
      <span style={{ fontSize: 14 }}>{icon}</span> {label}
    </button>
  )

  return (
    <div style={{ background: t.bg, color: t.text, minHeight: '100vh', fontFamily: "'Inter', 'system-ui', sans-serif", transition: 'background 0.2s, color 0.2s' }}>

      {/* Preload logos */}
      <div style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}>
        <img src="/logo.webp" alt="" />
        <img src="/logo_light.webp" alt="" />
        <img src="/logo_red.webp" alt="" />
      </div>

      {/* Nav */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: t.nav,
        borderBottom: `1px solid ${t.border}`,
        backdropFilter: 'blur(12px)',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px', height: 80, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          {/* Logo */}
          <a href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', flexShrink: 0 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={mode === 'light' ? '/logo_light.webp' : mode === 'red' ? '/logo_red.webp' : '/logo.webp'}
              alt="TideChartsPro"
              style={{ height: 52, width: 'auto', maxWidth: 180, objectFit: 'contain', display: 'block', borderRadius: 6 }}
            />
          </a>

          {/* Mode buttons */}
          <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
            {modeBtn('dark', 'Dark', '🌙')}
            {modeBtn('light', 'Light', '☀️')}
            {modeBtn('red', 'Night', '🔴')}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '60px 20px 32px', textAlign: 'center' }}>
        <div style={{
          display: 'inline-block', fontSize: 11, fontWeight: 700,
          background: t.accentFaint, color: t.accent,
          border: `1px solid ${t.accent}44`,
          padding: '4px 14px', borderRadius: 20, marginBottom: 20, letterSpacing: '0.05em',
          textTransform: 'uppercase',
        }}>
          Live tides · solunar periods · fishing forecast
        </div>
        <h1 style={{ fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 700, lineHeight: 1.2, marginBottom: 16, letterSpacing: '-0.02em' }}>
          Tide charts built for<br />
          <span style={{ color: t.accent }}>serious anglers</span>
        </h1>
        <p style={{ color: t.textMuted, fontSize: 16, maxWidth: 520, margin: '0 auto 28px', lineHeight: 1.6 }}>
          Real-time tides, solunar periods, species bite times, and fishing forecasts for 3,300+ locations across all US coastal states.
        </p>
        {/* Search with live dropdown - animated pulse draws attention */}
        <div
          ref={searchRef}
          style={{
            position: 'relative', maxWidth: 680, margin: '0 auto 20px',
            // CSS vars consumed by tcp-search-pulse keyframes
            ['--tcp-accent-glow' as string]: `${t.accent}30`,
            ['--tcp-accent-glow-soft' as string]: `${t.accent}14`,
          } as React.CSSProperties}
        >
          <div className="tcp-search-pulse" style={{ display: 'flex', borderRadius: 14, overflow: 'hidden', border: `2px solid ${t.accent}`, background: t.surface, transition: 'transform 0.15s' }}>
            <button
              onClick={findNearestAndShow}
              disabled={geoStatus === 'loading'}
              title="Find stations near my location"
              style={{
                background: t.accentFaint,
                border: 'none',
                borderRight: `1px solid ${t.accent}33`,
                padding: '0 18px',
                fontSize: 22,
                cursor: geoStatus === 'loading' ? 'wait' : 'pointer',
                color: t.accent,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                flexShrink: 0,
              }}
            >
              <span>{geoStatus === 'loading' ? '⏳' : '📍'}</span>
            </button>
            <input
              type="text"
              placeholder={typedPlaceholder + (typedPlaceholder ? '|' : '')}
              value={query}
              onChange={e => { setQuery(e.target.value); setGeoResults([]); setDropOpen(true) }}
              onFocus={() => { setDropOpen(true); setSearchFocused(true) }}
              onBlur={() => { setTimeout(() => setDropOpen(false), 150); setSearchFocused(false) }}
              onKeyDown={e => {
                if (e.key === 'Enter' && searchResults.length) {
                  const r = searchResults[0]
                  window.location.href = r.slug.startsWith('/') ? r.slug : `/tides/us/florida/${r.slug}`
                }
              }}
              style={{ flex: 1, background: t.surface, border: 'none', outline: 'none', padding: '18px 20px', fontSize: 17, color: t.text }}
            />
            {query && (
              <button onClick={() => { setQuery(''); setDropOpen(false) }} style={{ background: t.surface, border: 'none', padding: '0 12px', color: t.textFaint, cursor: 'pointer', fontSize: 18, lineHeight: 1 }}>×</button>
            )}
            <button
              onClick={() => { if (searchResults.length) { const r = searchResults[0]; window.location.href = r.slug.startsWith('/') ? r.slug : `/tides/us/florida/${r.slug}` } }}
              style={{ background: t.accent, border: 'none', padding: '18px 28px', fontSize: 15, fontWeight: 700, color: '#fff', cursor: 'pointer', flexShrink: 0, whiteSpace: 'nowrap' }}
            >
              See if it&apos;s fishy <span className="tcp-arrow">›</span>
            </button>
          </div>
          {geoError && (
            <div style={{ marginTop: 8, fontSize: 12, color: '#ef4444' }}>{geoError}</div>
          )}

          {/* Try: quick-pick popular stations */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 12, color: t.textFaint, fontWeight: 600 }}>Try:</span>
            {[
              { label: 'Galveston, TX',    href: '/tides/us/texas/galveston-bay-entrance-north-jetty' },
              { label: 'Mayport, FL',      href: '/tides/us/florida/pablo-creek-entrance' },
              { label: 'Cape Cod, MA',     href: '/tides/us/massachusetts/provincetown' },
              { label: 'Newport Beach, CA', href: '/tides/us/california/newport-bay-entrance-corona-del-mar' },
            ].map(c => (
              <a
                key={c.label}
                href={c.href}
                style={{
                  background: t.surface, border: `1px solid ${t.border}`, color: t.textMuted,
                  borderRadius: 999, padding: '6px 14px', fontSize: 12, fontWeight: 600,
                  textDecoration: 'none', transition: 'all 0.15s', whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = t.accent; e.currentTarget.style.color = t.accent; e.currentTarget.style.background = t.accentFaint }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = t.border; e.currentTarget.style.color = t.textMuted; e.currentTarget.style.background = t.surface }}
              >
                {c.label}
              </a>
            ))}
          </div>

          {/* Dropdown results - geo results take priority over search results */}
          {dropOpen && (geoResults.length > 0 || searchResults.length > 0) && (
            <div style={{ position: 'absolute', top: '100%', marginTop: 6, left: 0, right: 0, background: t.surface, border: `1px solid ${t.border}`, borderRadius: 12, zIndex: 500, overflow: 'hidden', boxShadow: '0 8px 24px rgba(0,0,0,0.3)' }}>
              {geoResults.length > 0 && (
                <div style={{ padding: '8px 16px', fontSize: 10, fontWeight: 700, color: t.textFaint, textTransform: 'uppercase', letterSpacing: '0.08em', background: t.surfaceAlt, borderBottom: `1px solid ${t.border}` }}>
                  📍 Nearest to you
                </div>
              )}
              {(geoResults.length > 0 ? geoResults : searchResults).map((r, i) => {
                const href = r.slug.startsWith('/') ? r.slug : `/tides/us/florida/${r.slug}`
                const parts = r.name.split(', ')
                const abbr = parts[parts.length - 1]
                const label = parts.slice(0, -1).join(', ')
                const distMi = 'distMi' in r ? (r as { distMi: number }).distMi : null
                return (
                  <a
                    key={i}
                    href={href}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 16px', textDecoration: 'none', borderTop: i > 0 ? `1px solid ${t.border}` : 'none', transition: 'background 0.1s' }}
                    onMouseEnter={e => (e.currentTarget.style.background = t.accentFaint)}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <span style={{ fontSize: 13, color: t.text, fontWeight: 500 }}>{label}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0, marginLeft: 8 }}>
                      {distMi !== null && (
                        <span style={{ fontSize: 11, color: t.textFaint }}>{distMi.toFixed(1)} mi</span>
                      )}
                      <span style={{ fontSize: 11, color: t.accent, fontWeight: 700 }}>{abbr}</span>
                    </span>
                  </a>
                )
              })}
            </div>
          )}
        </div>

      </section>

      {/* MAP */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px 48px' }}>
        <div style={{
          borderRadius: 16,
          overflow: 'hidden',
          border: `1px solid ${t.border}`,
          // Mobile: taller min for usability; desktop: scales with viewport
          height: 'clamp(420px, 55vh, 600px)',
          boxShadow: '0 4px 32px rgba(0,0,0,0.35)',
        }}>
          <HomeMap stations={STATIONS} mode={mode} />
        </div>
        <div style={{ display: 'flex', gap: 16, marginTop: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: t.textMuted }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: t.accent, border: '2px solid white', boxShadow: `0 0 0 3px ${t.accent}44` }} />
            Live tide data · 3,300+ stations
          </div>
        </div>
      </section>

      {/* Top fishing spots right now (live) */}
      <TopSpots t={t} />

      {/* Stats - interactive cards with icons, glow, and animated bars */}
      <section style={{ borderTop: `1px solid ${t.border}`, borderBottom: `1px solid ${t.border}`, background: t.surface, position: 'relative', overflow: 'hidden' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 20px' }}>
          <div className="tcp-stat-grid">
            {[
              { target: 3300, suffix: '+',     icon: '🌊', label: 'Tide stations',     color: '#3b82f6', live: false },
              { target: 6,    suffix: ' min',  icon: '⚡', label: 'Update frequency',  color: '#10b981', live: true  },
              { target: 25,   suffix: '+',     icon: '🐟', label: 'Species tracked',   color: '#f97316', live: false },
              { target: 23,   suffix: '',      icon: '🗺️', label: 'Coastal states',    color: '#a855f7', live: false },
            ].map(s => (
              <AnimatedStat
                key={s.label}
                target={s.target}
                suffix={s.suffix}
                label={s.label}
                color={s.color}
                icon={s.icon}
                live={s.live}
                muted={t.textMuted}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Browse by state - bold watermark cards with wave decoration */}
      <section style={{ background: t.surface, borderTop: `1px solid ${t.border}`, position: 'relative', overflow: 'hidden' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '64px 20px 72px', position: 'relative' }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, textAlign: 'center', marginBottom: 6, letterSpacing: '-0.02em' }}>
            Pick your <span style={{ color: t.accent }}>coast.</span>
          </h2>
          <p style={{ color: t.textMuted, fontSize: 13, textAlign: 'center', marginBottom: 40 }}>23 coastal states · 3,300+ live stations · sorted by region</p>
          <div className="tcp-state-grid">
            {[...STATES].sort((a, b) => a.name.localeCompare(b.name)).map(s => (
              <a
                key={s.code}
                href={`/tides/us/${s.slug}`}
                className="tcp-state-card"
                style={{
                  ['--tcp-state-color' as string]: s.color,
                  ['--tcp-surface' as string]: t.surfaceAlt,
                } as React.CSSProperties}
              >
                {/* Giant watermark state code */}
                <div className="tcp-state-watermark" aria-hidden>{s.code}</div>

                {/* Card content (over the watermark) */}
                <div className="tcp-state-content">
                  <div className="tcp-state-region">{s.region}</div>
                  <div className="tcp-state-name">{s.name}</div>
                  <div className="tcp-state-count">
                    <span className="tcp-state-count-num">{s.count.toLocaleString()}</span>
                    <span className="tcp-state-count-label">stations</span>
                  </div>
                  <div className="tcp-state-arrow">
                    Browse <span>→</span>
                  </div>
                </div>

                {/* Animated wave at the bottom */}
                <svg className="tcp-state-wave" viewBox="0 0 200 40" preserveAspectRatio="none" aria-hidden>
                  <path d="M0,20 Q25,5 50,20 T100,20 T150,20 T200,20 V40 H0 Z" fill="currentColor" opacity="0.45" />
                  <path d="M0,28 Q25,15 50,28 T100,28 T150,28 T200,28 V40 H0 Z" fill="currentColor" opacity="0.85" />
                </svg>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Features - animated icons + scroll reveal */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '64px 20px' }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, textAlign: 'center', marginBottom: 8, letterSpacing: '-0.02em' }}>
          Everything you need <span style={{ color: t.accent }}>on the water.</span>
        </h2>
        <p style={{ color: t.textMuted, textAlign: 'center', fontSize: 14, marginBottom: 40 }}>Built for anglers, by anglers - not just a tide table</p>
        <div className="tcp-feature-grid">
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className="tcp-feature-card tcp-reveal"
              style={{
                ['--tcp-feature-color' as string]: f.color,
                ['--tcp-feature-delay' as string]: `${i * 80}ms`,
              } as React.CSSProperties}
            >
              <div className="tcp-feature-icon">
                <span aria-hidden>{f.icon}</span>
              </div>
              <div className="tcp-feature-title">{f.title}</div>
              <div className="tcp-feature-desc">{f.desc}</div>
              <div className="tcp-feature-glow" aria-hidden />
            </div>
          ))}
        </div>
      </section>

      {/* Station accordion - color-coded by state */}
      <section style={{ borderTop: `1px solid ${t.border}`, background: t.bg }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '64px 20px 72px' }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 6, letterSpacing: '-0.02em' }}>
            Dive in by <span style={{ color: t.accent }}>state.</span>
          </h2>
          <p style={{ color: t.textMuted, fontSize: 13, marginBottom: 32 }}>Click any state to browse all tide chart locations</p>
          <div className="tcp-accordion">
            {STATE_ACCORDIONS.map(({ name, slug, sub, stations, suffix }) => {
              const meta = STATES.find(s => s.slug === slug)
              const color = meta?.color ?? t.accent
              const isOpen = openState === slug
              return (
                <div
                  key={slug}
                  className={`tcp-acc-row ${isOpen ? 'tcp-acc-open' : ''}`}
                  style={{ ['--tcp-state-color' as string]: color } as React.CSSProperties}
                >
                  <button
                    onClick={() => setOpenState(isOpen ? null : slug)}
                    className="tcp-acc-header"
                  >
                    <span className="tcp-acc-mark" aria-hidden>{meta?.code ?? ''}</span>
                    <span className="tcp-acc-bar" aria-hidden />
                    <div className="tcp-acc-info">
                      <span className="tcp-acc-name">{name} <span className="tcp-acc-name-soft">Tide Charts</span></span>
                      <span className="tcp-acc-sub">{sub}</span>
                    </div>
                    <span className="tcp-acc-count">{stations.length} stations</span>
                    <span className="tcp-acc-chev" aria-hidden>▾</span>
                  </button>
                  {isOpen && (
                    <div className="tcp-acc-body">
                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
                        <a href={`/tides/us/${slug}`} style={{ fontSize: 12, color, textDecoration: 'none', fontWeight: 700 }}>View full {name} page →</a>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 8 }}>
                        {stations.map(s => (
                          <a
                            key={s.slug}
                            href={s.slug.startsWith('/') ? s.slug : `/tides/us/florida/${s.slug}`}
                            className="tcp-acc-station"
                            style={{ ['--tcp-state-color' as string]: color } as React.CSSProperties}
                          >
                            <span style={{ fontSize: 13, fontWeight: 600, color: t.text }}>{s.name.replace(`, ${suffix}`, '')}</span>
                            <span style={{ fontSize: 11, color, fontWeight: 700 }}>→</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: `1px solid ${t.border}`, background: t.bg }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '28px 20px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={mode === 'light' ? '/logo_light.webp' : mode === 'red' ? '/logo_red.webp' : '/logo.webp'}
            alt="TideChartsPro"
            style={{ height: 44, width: 'auto', display: 'block', borderRadius: 4 }}
          />
          <div style={{ display: 'flex', gap: 20 }}>
            {[
              { label: 'Tide Charts', href: '/tides' },
              { label: 'Privacy Policy', href: '/privacy' },
            ].map(l => (
              <a key={l.label} href={l.href} style={{ fontSize: 12, color: t.textFaint, textDecoration: 'none' }}>{l.label}</a>
            ))}
          </div>
          <div style={{ fontSize: 11, color: t.textFaint }}>© 2026 TideChartsPro</div>
        </div>
      </footer>

    </div>
  )
}

// Interactive stat card - animated counter, icon, glow, progress bar
function AnimatedStat({
  target, suffix, label, color, icon, live, muted,
}: {
  target: number; suffix: string; label: string;
  color: string; icon: string; live?: boolean; muted: string;
}) {
  const [value, setValue] = useState(0)
  const [progress, setProgress] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const startedRef = useRef(false)

  useEffect(() => {
    if (!ref.current || startedRef.current) return
    const node = ref.current
    const observer = new IntersectionObserver(entries => {
      for (const e of entries) {
        if (e.isIntersecting && !startedRef.current) {
          startedRef.current = true
          const start = performance.now()
          const duration = 1600
          let raf = 0
          const tick = (now: number) => {
            const t = Math.min(1, (now - start) / duration)
            const ease = 1 - Math.pow(1 - t, 3)
            setValue(Math.round(target * ease))
            setProgress(ease * 100)
            if (t < 1) raf = requestAnimationFrame(tick)
          }
          raf = requestAnimationFrame(tick)
          observer.disconnect()
          return () => cancelAnimationFrame(raf)
        }
      }
    }, { threshold: 0.3 })
    observer.observe(node)
    return () => observer.disconnect()
  }, [target])

  const formatted = target >= 1000 ? value.toLocaleString() : String(value)
  return (
    <div
      ref={ref}
      className="tcp-stat-card"
      style={{ ['--tcp-stat-color' as string]: color } as React.CSSProperties}
    >
      <div className="tcp-stat-icon">
        <span aria-hidden>{icon}</span>
        {live && <span className="tcp-stat-live" aria-hidden />}
      </div>
      <div className="tcp-stat-num">
        {formatted}<span className="tcp-stat-suffix">{suffix}</span>
      </div>
      <div className="tcp-stat-label" style={{ color: muted }}>{label}</div>
      <div className="tcp-stat-track">
        <div className="tcp-stat-fill" style={{ width: `${progress}%` }} />
      </div>
    </div>
  )
}
