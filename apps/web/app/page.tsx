'use client'

import { useState, useMemo, useRef } from 'react'
import dynamic from 'next/dynamic'
import type { MapStation } from './HomeMap'
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
  arr.map(s => ({ name: `${s.name}, ${abbr}`, lat: s.lat, lon: s.lon, slug: `/tides/${slug}/${s.slug}`, live: true }))

const FL_MAP_STATIONS: MapStation[] = FLORIDA_STATIONS.map(s => ({
  name: `${s.name}, FL`, lat: s.lat, lon: s.lon, slug: s.slug, live: true,
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

// AL_MAP_STATIONS kept for the station grid section below
const AL_MAP_STATIONS = mkPins('AL', 'alabama',     ALABAMA_STATIONS)
const MS_MAP_STATIONS = mkPins('MS', 'mississippi', MISSISSIPPI_STATIONS)
const LA_MAP_STATIONS = mkPins('LA', 'louisiana',   LOUISIANA_STATIONS)
const TX_MAP_STATIONS = mkPins('TX', 'texas',       TEXAS_STATIONS)

// Full search pool (all 23 states including AK/HI)
const SEARCH_POOL = [
  ...STATIONS,
  ...mkPins('AK', 'alaska', ALASKA_STATIONS),
  ...mkPins('HI', 'hawaii', HAWAII_STATIONS),
]

// State chips for the hero quick-nav
const STATE_CHIPS = [
  { abbr: 'FL', slug: 'florida' },        { abbr: 'AL', slug: 'alabama' },
  { abbr: 'MS', slug: 'mississippi' },    { abbr: 'LA', slug: 'louisiana' },
  { abbr: 'TX', slug: 'texas' },          { abbr: 'GA', slug: 'georgia' },
  { abbr: 'SC', slug: 'south-carolina' }, { abbr: 'NC', slug: 'north-carolina' },
  { abbr: 'VA', slug: 'virginia' },       { abbr: 'MD', slug: 'maryland' },
  { abbr: 'DE', slug: 'delaware' },       { abbr: 'NJ', slug: 'new-jersey' },
  { abbr: 'NY', slug: 'new-york' },       { abbr: 'CT', slug: 'connecticut' },
  { abbr: 'RI', slug: 'rhode-island' },   { abbr: 'MA', slug: 'massachusetts' },
  { abbr: 'NH', slug: 'new-hampshire' },  { abbr: 'ME', slug: 'maine' },
  { abbr: 'CA', slug: 'california' },     { abbr: 'OR', slug: 'oregon' },
  { abbr: 'WA', slug: 'washington' },     { abbr: 'AK', slug: 'alaska' },
  { abbr: 'HI', slug: 'hawaii' },
]

const FEATURES = [
  { icon: '🌊', title: 'Live tide charts',       desc: 'Real-time water level plotted on predicted curve. See exactly where the tide is right now.' },
  { icon: '🎣', title: 'Fishing score',           desc: 'Daily A–F grade combining tide phase, pressure trend, solunar periods, and water temp.' },
  { icon: '🐟', title: 'Species bite times',      desc: 'Location-aware guide — what\'s biting today, best windows, hot baits, and regulations.' },
  { icon: '🌙', title: 'Solunar periods',         desc: 'Major and minor feeding periods based on lunar transit, aligned with your local tide.' },
  { icon: '🔴', title: 'Red night vision mode',   desc: 'Preserves your natural night vision while checking tides. Built for serious night anglers.' },
  { icon: '📍', title: 'Fishing map',             desc: 'Tide stations, boat ramps, piers, and marinas on one interactive map.' },
]

const STATES = [
  { name: 'Florida',        count: `${FLORIDA_STATIONS.length} stations`,        slug: 'florida',        live: true },
  { name: 'Alabama',        count: `${ALABAMA_STATIONS.length} stations`,        slug: 'alabama',        live: true },
  { name: 'Mississippi',    count: `${MISSISSIPPI_STATIONS.length} stations`,    slug: 'mississippi',    live: true },
  { name: 'Louisiana',      count: `${LOUISIANA_STATIONS.length} stations`,      slug: 'louisiana',      live: true },
  { name: 'Texas',          count: `${TEXAS_STATIONS.length} stations`,          slug: 'texas',          live: true },
  { name: 'Georgia',        count: `${GEORGIA_STATIONS.length} stations`,        slug: 'georgia',        live: true },
  { name: 'South Carolina', count: `${SOUTH_CAROLINA_STATIONS.length} stations`, slug: 'south-carolina', live: true },
  { name: 'North Carolina', count: `${NORTH_CAROLINA_STATIONS.length} stations`, slug: 'north-carolina', live: true },
  { name: 'Virginia',       count: `${VIRGINIA_STATIONS.length} stations`,       slug: 'virginia',       live: true },
  { name: 'Maryland',       count: `${MARYLAND_STATIONS.length} stations`,       slug: 'maryland',       live: true },
  { name: 'Delaware',       count: `${DELAWARE_STATIONS.length} stations`,       slug: 'delaware',       live: true },
  { name: 'New Jersey',     count: `${NEW_JERSEY_STATIONS.length} stations`,     slug: 'new-jersey',     live: true },
  { name: 'New York',       count: `${NEW_YORK_STATIONS.length} stations`,       slug: 'new-york',       live: true },
  { name: 'Connecticut',    count: `${CONNECTICUT_STATIONS.length} stations`,    slug: 'connecticut',    live: true },
  { name: 'Rhode Island',   count: `${RHODE_ISLAND_STATIONS.length} stations`,   slug: 'rhode-island',   live: true },
  { name: 'Massachusetts',  count: `${MASSACHUSETTS_STATIONS.length} stations`,  slug: 'massachusetts',  live: true },
  { name: 'New Hampshire',  count: `${NEW_HAMPSHIRE_STATIONS.length} stations`,  slug: 'new-hampshire',  live: true },
  { name: 'Maine',          count: `${MAINE_STATIONS.length} stations`,          slug: 'maine',          live: true },
  { name: 'California',     count: `${CALIFORNIA_STATIONS.length} stations`,     slug: 'california',     live: true },
  { name: 'Oregon',         count: `${OREGON_STATIONS.length} stations`,         slug: 'oregon',         live: true },
  { name: 'Washington',     count: `${WASHINGTON_STATIONS.length} stations`,     slug: 'washington',     live: true },
  { name: 'Alaska',         count: `${ALASKA_STATIONS.length} stations`,         slug: 'alaska',         live: true },
  { name: 'Hawaii',         count: `${HAWAII_STATIONS.length} stations`,         slug: 'hawaii',         live: true },
]

export default function Home() {
  const [mode, setMode]       = useState<'dark' | 'light' | 'red'>('dark')
  const [query, setQuery]       = useState('')
  const [dropOpen, setDropOpen] = useState(false)
  const [openState, setOpenState] = useState<string | null>(null)
  const searchRef = useRef<HTMLDivElement>(null)

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
        {/* Search with live dropdown */}
        <div ref={searchRef} style={{ position: 'relative', maxWidth: 460, margin: '0 auto 20px' }}>
          <div style={{ display: 'flex', borderRadius: 12, overflow: 'hidden', border: `1px solid ${dropOpen && searchResults.length ? t.accent : t.border}`, transition: 'border-color 0.15s' }}>
            <input
              type="text"
              placeholder="Search station, inlet, city…"
              value={query}
              onChange={e => { setQuery(e.target.value); setDropOpen(true) }}
              onFocus={() => setDropOpen(true)}
              onBlur={() => setTimeout(() => setDropOpen(false), 150)}
              onKeyDown={e => {
                if (e.key === 'Enter' && searchResults.length) {
                  const r = searchResults[0]
                  window.location.href = r.slug.startsWith('/') ? r.slug : `/tides/florida/${r.slug}`
                }
              }}
              style={{ flex: 1, background: t.surface, border: 'none', outline: 'none', padding: '12px 16px', fontSize: 14, color: t.text }}
            />
            {query && (
              <button onClick={() => { setQuery(''); setDropOpen(false) }} style={{ background: t.surface, border: 'none', padding: '0 12px', color: t.textFaint, cursor: 'pointer', fontSize: 18, lineHeight: 1 }}>×</button>
            )}
            <button
              onClick={() => { if (searchResults.length) { const r = searchResults[0]; window.location.href = r.slug.startsWith('/') ? r.slug : `/tides/florida/${r.slug}` } }}
              style={{ background: t.accent, border: 'none', padding: '12px 20px', fontSize: 14, fontWeight: 600, color: '#fff', cursor: 'pointer', flexShrink: 0 }}
            >
              Search
            </button>
          </div>

          {/* Dropdown results */}
          {dropOpen && searchResults.length > 0 && (
            <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: t.surface, border: `1px solid ${t.border}`, borderTop: 'none', borderRadius: '0 0 12px 12px', zIndex: 500, overflow: 'hidden', boxShadow: '0 8px 24px rgba(0,0,0,0.3)' }}>
              {searchResults.map((r, i) => {
                const href = r.slug.startsWith('/') ? r.slug : `/tides/florida/${r.slug}`
                const parts = r.name.split(', ')
                const abbr = parts[parts.length - 1]
                const label = parts.slice(0, -1).join(', ')
                return (
                  <a
                    key={i}
                    href={href}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', textDecoration: 'none', borderTop: i > 0 ? `1px solid ${t.border}` : 'none', transition: 'background 0.1s' }}
                    onMouseEnter={e => (e.currentTarget.style.background = t.accentFaint)}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <span style={{ fontSize: 13, color: t.text, fontWeight: 500 }}>{label}</span>
                    <span style={{ fontSize: 11, color: t.accent, fontWeight: 700, flexShrink: 0, marginLeft: 8 }}>{abbr}</span>
                  </a>
                )
              })}
            </div>
          )}
        </div>

        {/* State chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center', maxWidth: 560, margin: '0 auto' }}>
          {STATE_CHIPS.map(s => (
            <a
              key={s.abbr}
              href={`/tides/${s.slug}`}
              style={{ background: t.surface, border: `1px solid ${t.border}`, color: t.textMuted, borderRadius: 20, padding: '4px 13px', fontSize: 12, fontWeight: 600, textDecoration: 'none', transition: 'border-color 0.15s, color 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = t.accent; e.currentTarget.style.color = t.accent }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = t.border; e.currentTarget.style.color = t.textMuted }}
            >
              {s.abbr}
            </a>
          ))}
        </div>
      </section>

      {/* MAP */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px 48px' }}>
        <div style={{
          borderRadius: 16,
          overflow: 'hidden',
          border: `1px solid ${t.border}`,
          height: 'clamp(340px, 50vw, 560px)',
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

      {/* Stats */}
      <section style={{ borderTop: `1px solid ${t.border}`, borderBottom: `1px solid ${t.border}`, background: t.surface }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '28px 20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 20, textAlign: 'center' }}>
          {[
            { n: '3,300+', l: 'Tide stations' },
            { n: '6 min',  l: 'Update frequency' },
            { n: '25+',    l: 'Species tracked' },
            { n: '23',     l: 'Coastal states' },
          ].map(s => (
            <div key={s.l}>
              <div style={{ fontSize: 24, fontWeight: 700, color: t.accent }}>{s.n}</div>
              <div style={{ fontSize: 12, color: t.textMuted, marginTop: 4 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Browse by state */}
      <section style={{ background: t.surface, borderTop: `1px solid ${t.border}` }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 20px' }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, textAlign: 'center', marginBottom: 6 }}>Browse tide charts by state</h2>
          <p style={{ color: t.textMuted, fontSize: 13, textAlign: 'center', marginBottom: 28 }}>All 23 US coastal states — live tide charts &amp; fishing forecasts</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10 }}>
            {STATES.map(s => (
              <a key={s.name} href={`/tides/${s.slug}`} style={{
                display: 'block', background: t.surfaceAlt, border: `1px solid ${t.border}`,
                borderRadius: 10, padding: '16px', textAlign: 'center', textDecoration: 'none',
              }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: t.text }}>{s.name}</div>
                <div style={{ fontSize: 11, color: t.accent, marginTop: 4, fontWeight: 600 }}>{s.count}</div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '56px 20px' }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, textAlign: 'center', marginBottom: 8 }}>Everything you need on the water</h2>
        <p style={{ color: t.textMuted, textAlign: 'center', fontSize: 14, marginBottom: 36 }}>Built for anglers, by anglers — not just a tide table</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
          {FEATURES.map(f => (
            <div key={f.title} style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 12, padding: '20px' }}>
              <div style={{ fontSize: 26, marginBottom: 10 }}>{f.icon}</div>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>{f.title}</div>
              <div style={{ fontSize: 13, color: t.textMuted, lineHeight: 1.6 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Station accordion */}
      <section style={{ borderTop: `1px solid ${t.border}` }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 20px' }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Explore stations by state</h2>
          <p style={{ color: t.textMuted, fontSize: 13, marginBottom: 24 }}>Click any state to browse all tide chart locations</p>
          {([
            { name: 'Florida',     slug: 'florida',     sub: 'Atlantic coast, Gulf Coast, Keys & Panhandle', stations: FL_MAP_STATIONS,  suffix: 'FL' },
            { name: 'Alabama',     slug: 'alabama',     sub: 'Mobile Bay, Gulf Shores & Dauphin Island',      stations: AL_MAP_STATIONS,  suffix: 'AL' },
            { name: 'Mississippi', slug: 'mississippi', sub: 'Mississippi Sound, Biloxi & Gulfport',          stations: MS_MAP_STATIONS,  suffix: 'MS' },
            { name: 'Louisiana',   slug: 'louisiana',   sub: 'New Orleans, Grand Isle & Vermilion Bay',       stations: LA_MAP_STATIONS,  suffix: 'LA' },
            { name: 'Texas',       slug: 'texas',       sub: 'Galveston Bay, Corpus Christi & Lower Laguna Madre', stations: TX_MAP_STATIONS, suffix: 'TX' },
          ] as const).map(({ name, slug, sub, stations, suffix }) => (
            <div key={slug} style={{ borderBottom: `1px solid ${t.border}` }}>
              {/* Accordion header */}
              <button
                onClick={() => setOpenState(openState === slug ? null : slug)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  background: 'none', border: 'none', padding: '16px 0', cursor: 'pointer', textAlign: 'left',
                }}
              >
                <div>
                  <span style={{ fontSize: 15, fontWeight: 700, color: t.text }}>{name} Tide Charts</span>
                  <span style={{ fontSize: 12, color: t.textMuted, marginLeft: 12 }}>{sub}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
                  <span style={{ fontSize: 11, color: t.accent, fontWeight: 600 }}>{stations.length} stations</span>
                  <span style={{ fontSize: 16, color: t.textMuted, transform: openState === slug ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', display: 'inline-block' }}>▾</span>
                </div>
              </button>
              {/* Expanded grid */}
              {openState === slug && (
                <div style={{ paddingBottom: 24 }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
                    <a href={`/tides/${slug}`} style={{ fontSize: 12, color: t.accent, textDecoration: 'none', fontWeight: 600 }}>View full {name} page →</a>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 8 }}>
                    {stations.map(s => (
                      <a
                        key={s.slug}
                        href={s.slug.startsWith('/') ? s.slug : `/tides/florida/${s.slug}`}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: t.surface, border: `1px solid ${t.border}`, borderRadius: 8, padding: '10px 14px', textDecoration: 'none' }}
                      >
                        <span style={{ fontSize: 13, fontWeight: 600, color: t.text }}>{s.name.replace(`, ${suffix}`, '')}</span>
                        <span style={{ fontSize: 11, color: t.accent, fontWeight: 700 }}>→</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
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
