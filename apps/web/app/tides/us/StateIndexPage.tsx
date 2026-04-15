'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import type { StationConfig } from '@/lib/florida-stations'

interface Props {
  stateName: string          // "Florida"
  stateSlug: string          // "florida"
  stateAbbr: string          // "FL"
  stations: StationConfig[]
  regions: string[]
  mapCenter: [number, number]
  mapZoom: number
  description: string
}

export default function StateIndexPage({
  stateName, stateSlug, stateAbbr, stations, regions, mapCenter, mapZoom, description,
}: Props) {
  const [search, setSearch]       = useState('')
  const [activeRegion, setRegion] = useState('All')
  const mapRef  = useRef<HTMLDivElement>(null)
  const leafRef = useRef<unknown>(null)

  // ── Leaflet map ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!mapRef.current || leafRef.current) return
    let destroyed = false

    import('leaflet').then(L => {
      if (destroyed || !mapRef.current) return

      import('leaflet/dist/leaflet.css')

      const map = L.map(mapRef.current, {
        center: mapCenter,
        zoom: mapZoom,
        zoomControl: true,
        attributionControl: true,
      })

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        subdomains: 'abc',
        maxZoom: 19,
        attribution: '© <a href="https://openstreetmap.org">OSM</a>',
      }).addTo(map)

      stations.forEach(s => {
        const icon = L.divIcon({
          html: `<div style="width:10px;height:10px;border-radius:50%;background:#38bdf8;border:2px solid white;box-shadow:0 0 8px rgba(56,189,248,0.6),0 0 0 3px rgba(56,189,248,0.2);"></div>`,
          className: '',
          iconSize: [10, 10],
          iconAnchor: [5, 5],
          popupAnchor: [0, -8],
        })

        const popup = `<div style="font-family:system-ui;font-size:12px;line-height:1.5;min-width:140px">
          <div style="font-weight:700;margin-bottom:2px">${s.name}</div>
          <div style="color:#64748b;font-size:11px;margin-bottom:6px">${s.region}</div>
          <a href="/tides/${stateSlug}/${s.slug}" style="display:inline-block;background:#3b82f6;color:white;padding:3px 10px;border-radius:6px;text-decoration:none;font-size:11px;font-weight:600">View tides →</a>
        </div>`

        L.marker([s.lat, s.lon], { icon }).addTo(map).bindPopup(popup, { maxWidth: 200 })
      })

      leafRef.current = map
    })

    return () => {
      destroyed = true
      if (leafRef.current) {
        ;(leafRef.current as { remove(): void }).remove()
        leafRef.current = null
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Filter logic ─────────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return stations
      .filter(s => {
        const regionMatch = activeRegion === 'All' || s.region === activeRegion
        const searchMatch = !q || s.name.toLowerCase().includes(q) || s.city.toLowerCase().includes(q)
        return regionMatch && searchMatch
      })
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [stations, search, activeRegion])

  const regionCounts = useMemo(() => {
    const counts: Record<string, number> = { All: stations.length }
    regions.forEach(r => { counts[r] = stations.filter(s => s.region === r).length })
    return counts
  }, [stations, regions])

  return (
    <main style={{ background: '#0a0e1a', color: '#f1f5f9', minHeight: '100vh', fontFamily: "'Inter','system-ui',sans-serif" }}>

      {/* Nav */}
      <nav style={{ borderBottom: '1px solid #1e2d45', background: 'rgba(10,14,26,0.95)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 200 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px', height: 64, display: 'flex', alignItems: 'center', gap: 8 }}>
          <a href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.webp" alt="TideChartsPro" style={{ height: 52, width: 'auto', display: 'block' }} />
          </a>
          <span style={{ color: '#475569', margin: '0 6px' }}>/</span>
          <a href="/tides" style={{ fontSize: 13, color: '#94a3b8', textDecoration: 'none' }}>Tides</a>
          <span style={{ color: '#475569', margin: '0 6px' }}>/</span>
          <span style={{ fontSize: 13, color: '#f1f5f9' }}>{stateName}</span>
        </div>
      </nav>

      {/* Hero + Search */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '28px 20px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 20 }}>
          <div>
            <div style={{ display: 'inline-block', fontSize: 11, fontWeight: 700, background: '#0c4a6e', color: '#38bdf8', border: '1px solid #38bdf844', padding: '3px 12px', borderRadius: 20, marginBottom: 10, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              {stations.length} {stateName} Locations
            </div>
            <h1 style={{ fontSize: 'clamp(20px,3.5vw,34px)', fontWeight: 700, marginBottom: 6, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
              {stateName} Tide Charts
            </h1>
            <p style={{ color: '#94a3b8', fontSize: 14, maxWidth: 520, lineHeight: 1.6, margin: 0 }}>
              {description}
            </p>
          </div>

          {/* Search */}
          <div style={{ position: 'relative', flexShrink: 0, width: 'min(100%, 300px)' }}>
            <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#475569', fontSize: 15, pointerEvents: 'none' }}>🔍</span>
            <input
              type="text"
              placeholder={`Search ${stateName} stations…`}
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px 10px 36px',
                background: '#111827',
                border: '1px solid #1e2d45',
                borderRadius: 10,
                color: '#f1f5f9',
                fontSize: 13,
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#475569', cursor: 'pointer', fontSize: 16, lineHeight: 1 }}
              >×</button>
            )}
          </div>
        </div>
      </div>

      {/* Map */}
      <div style={{ position: 'relative', height: 380, background: '#0f172a', borderTop: '1px solid #1e2d45', borderBottom: '1px solid #1e2d45' }}>
        <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
        <div style={{ position: 'absolute', bottom: 10, left: 12, zIndex: 1000, fontSize: 11, color: '#94a3b8', background: 'rgba(10,14,26,0.85)', padding: '4px 10px', borderRadius: 6, pointerEvents: 'none' }}>
          {stations.length} stations · click a marker to open
        </div>
      </div>

      {/* Region filter tabs */}
      <div style={{ borderBottom: '1px solid #1e2d45', background: '#0a0e1a', position: 'sticky', top: 64, zIndex: 100 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px', overflowX: 'auto', display: 'flex', gap: 4, height: 48, alignItems: 'center', scrollbarWidth: 'none' }}>
          {['All', ...regions].map(r => (
            <button
              key={r}
              onClick={() => setRegion(r)}
              style={{
                flexShrink: 0,
                padding: '5px 14px',
                borderRadius: 20,
                border: activeRegion === r ? '1px solid #38bdf8' : '1px solid #1e2d45',
                background: activeRegion === r ? '#0c4a6e' : 'transparent',
                color: activeRegion === r ? '#38bdf8' : '#94a3b8',
                fontSize: 12,
                fontWeight: activeRegion === r ? 700 : 400,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s',
              }}
            >
              {r} <span style={{ opacity: 0.65, fontSize: 11 }}>({regionCounts[r] ?? 0})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Station grid */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 20px 60px' }}>

        {/* Result count */}
        {(search || activeRegion !== 'All') && (
          <div style={{ fontSize: 12, color: '#475569', marginBottom: 16 }}>
            {filtered.length} result{filtered.length !== 1 ? 's' : ''}
            {search && <> for &ldquo;<span style={{ color: '#94a3b8' }}>{search}</span>&rdquo;</>}
            {activeRegion !== 'All' && <> in <span style={{ color: '#94a3b8' }}>{activeRegion}</span></>}
          </div>
        )}

        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#475569' }}>
            No stations found. <button onClick={() => { setSearch(''); setRegion('All') }} style={{ background: 'none', border: 'none', color: '#38bdf8', cursor: 'pointer', fontSize: 'inherit' }}>Clear filters</button>
          </div>
        ) : (
          /* Group by region when showing All, flat list when filtered */
          activeRegion !== 'All' || search ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 10 }}>
              {filtered.map(s => (
                <StationCard key={s.slug} s={s} stateSlug={stateSlug} stateAbbr={stateAbbr} />
              ))}
            </div>
          ) : (
            regions.map(region => {
              const rs = stations.filter(s => s.region === region).sort((a, b) => a.name.localeCompare(b.name))
              if (!rs.length) return null
              return (
                <div key={region} style={{ marginBottom: 36 }}>
                  <h2 style={{ fontSize: 13, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 12, borderBottom: '1px solid #1e2d45', paddingBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
                    <span>{region}</span>
                    <span style={{ fontWeight: 400, opacity: 0.6 }}>{rs.length} stations</span>
                  </h2>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 10 }}>
                    {rs.map(s => (
                      <StationCard key={s.slug} s={s} stateSlug={stateSlug} stateAbbr={stateAbbr} />
                    ))}
                  </div>
                </div>
              )
            })
          )
        )}

        <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid #1e2d45' }}>
          <a href="/" style={{ fontSize: 13, color: '#475569', textDecoration: 'none' }}>← Back to all states</a>
        </div>
      </div>
    </main>
  )
}

function StationCard({ s, stateSlug, stateAbbr }: { s: StationConfig; stateSlug: string; stateAbbr: string }) {
  return (
    <a
      href={`/tides/${stateSlug}/${s.slug}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: '#111827',
        border: '1px solid #1e2d45',
        borderRadius: 10,
        padding: '12px 14px',
        textDecoration: 'none',
        transition: 'border-color 0.15s, background 0.15s',
        gap: 8,
      }}
    >
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#f1f5f9', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {s.name}
        </div>
        <div style={{ fontSize: 11, color: '#475569' }}>
          {s.region} · {s.meanRange}ft range
        </div>
      </div>
      <span style={{ fontSize: 12, color: '#38bdf8', fontWeight: 700, flexShrink: 0 }}>→</span>
    </a>
  )
}
