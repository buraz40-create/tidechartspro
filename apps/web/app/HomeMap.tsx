'use client'

import { useEffect, useRef, useState } from 'react'
import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'

// Singleton promise - load leaflet first, set on window, THEN load plugin.
// This avoids Turbopack chunk evaluation racing the global assignment.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let leafletReady: Promise<any> | null = null
function loadLeafletWithCluster() {
  if (!leafletReady) {
    leafletReady = (async () => {
      const mod = await import('leaflet')
      // Leaflet ships both default + namespace; prefer default if present, else namespace
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const L = (mod as any).default ?? mod
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(window as any).L = L
      // Use require so chunk evaluation happens AFTER window.L is set
      // (dynamic import() can have its evaluation hoisted by Turbopack)
      await new Promise<void>((resolve, reject) => {
        const s = document.createElement('script')
        s.src = 'https://unpkg.com/leaflet.markercluster@1.5.3/dist/leaflet.markercluster.js'
        s.async = true
        s.onload = () => resolve()
        s.onerror = () => reject(new Error('markercluster failed to load'))
        document.head.appendChild(s)
      })
      return L
    })()
  }
  return leafletReady
}

export interface MapStation {
  id?: string
  name: string
  lat: number
  lon: number
  slug: string
  state?: string  // 2-letter state code (FL, CA, etc) for cluster grouping
  live?: boolean
}

interface HomeMapProps {
  stations: MapStation[]
  mode: 'dark' | 'light' | 'red'
}

const ACCENT = {
  dark: '#3b82f6',
  light: '#2563eb',
  red: '#ef4444',
}

// Distinct cluster colors per state, grouped roughly by region
const STATE_COLOR: Record<string, string> = {
  // Gulf Coast - warm reds/oranges
  TX: '#dc2626', LA: '#ea580c', MS: '#f59e0b', AL: '#d97706',
  // South Atlantic - tropical greens
  FL: '#10b981', GA: '#059669', SC: '#0d9488', NC: '#14b8a6',
  // Mid Atlantic - blues
  VA: '#0ea5e9', MD: '#0284c7', DE: '#0369a1', NJ: '#1d4ed8',
  // Northeast - purples
  NY: '#7c3aed', CT: '#8b5cf6', RI: '#a855f7', MA: '#c026d3', NH: '#db2777', ME: '#be185d',
  // Pacific - cool teals/cyans
  CA: '#06b6d4', OR: '#0891b2', WA: '#0e7490',
  // Other
  AK: '#64748b', HI: '#eab308',
}

export default function HomeMap({ stations, mode }: HomeMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = useRef<any>(null)
  const modeRef = useRef(mode)
  const [isTouch, setIsTouch] = useState(false)
  const [active, setActive] = useState(false)

  useEffect(() => {
    modeRef.current = mode
  }, [mode])

  useEffect(() => {
    const touch = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0) && window.innerWidth < 900
    setIsTouch(touch)
    setActive(!touch) // desktop: immediately interactive; mobile: wait for tap
  }, [])

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    let destroyed = false

    loadLeafletWithCluster().then(L => {
      if (destroyed || !containerRef.current) return

      const accent = ACCENT[modeRef.current]

      const map = L.map(containerRef.current, {
        center:             [37, -96],
        zoom:               4,
        zoomControl:        true,
        scrollWheelZoom:    !isTouch,
        dragging:           !isTouch,        // disabled on touch until user taps overlay
        touchZoom:          !isTouch,
        doubleClickZoom:    !isTouch,
        boxZoom:            false,
        keyboard:           false,
        attributionControl: false,
        minZoom: 2,
        maxZoom: 18,
      })

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        subdomains: 'abc',
        maxZoom: 19,
      }).addTo(map)

      L.control.attribution({
        prefix: '© <a href="https://openstreetmap.org">OSM</a>',
        position: 'bottomright',
      }).addTo(map)

      // Theme-styled cluster icons: colored by dominant state with state code shown
      const clusterGroup = (L as unknown as { markerClusterGroup: (opts: object) => unknown }).markerClusterGroup({
        showCoverageOnHover: false,
        spiderfyOnMaxZoom: true,
        zoomToBoundsOnClick: true,
        maxClusterRadius: 60,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        iconCreateFunction: (cluster: any) => {
          const count = cluster.getChildCount()
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const children = cluster.getAllChildMarkers() as any[]
          // Tally state codes across all child markers
          const tally: Record<string, number> = {}
          for (const m of children) {
            const st = m.options?.tcpState as string | undefined
            if (st) tally[st] = (tally[st] ?? 0) + 1
          }
          const sorted = Object.entries(tally).sort((a, b) => b[1] - a[1])
          const dominant = sorted[0]
          const dominantState = dominant?.[0]
          const dominantPct = dominant ? dominant[1] / count : 0
          const color = (dominantState && STATE_COLOR[dominantState]) || accent
          const size = count >= 100 ? 60 : count >= 25 ? 50 : 42
          const codeFontSize = count >= 100 ? 12 : 11
          const countFontSize = count >= 100 ? 17 : 14
          const showCode = dominantPct >= 0.6 && dominantState
          return L.divIcon({
            html: `<div style="
              width:${size}px;height:${size}px;border-radius:50%;
              background:${color};
              border:3px solid rgba(255,255,255,0.95);
              box-shadow:0 0 0 4px ${color}33, 0 4px 12px rgba(0,0,0,0.45);
              display:flex;flex-direction:column;align-items:center;justify-content:center;
              color:#fff;font-family:system-ui,sans-serif;
            ">
              ${showCode ? `<span style="font-size:${codeFontSize}px;font-weight:700;letter-spacing:0.06em;opacity:0.92;line-height:1">${dominantState}</span>` : ''}
              <span style="font-size:${countFontSize}px;font-weight:800;letter-spacing:-0.02em;line-height:1.05">${count}</span>
            </div>`,
            className: '',
            iconSize: [size, size],
          })
        },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      }) as any

      const markers = stations.map(s => {
        const stateColor = (s.state && STATE_COLOR[s.state]) || accent
        const color = s.live ? stateColor : '#6b7280'
        const size  = s.live ? 14 : 9
        const border = s.live ? 3 : 2

        const icon = L.divIcon({
          html: `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${color};border:${border}px solid white;box-shadow:0 0 ${s.live ? 12 : 5}px rgba(0,0,0,0.8)${s.live ? `,0 0 0 4px ${color}44` : ''};"></div>`,
          className: '',
          iconSize:   [size, size],
          iconAnchor: [size / 2, size / 2],
          popupAnchor:[0, -size],
        })

        const popupContent = s.live
          ? `<div style="font-family:system-ui;font-size:12px;line-height:1.5">
               <div style="font-weight:700">${s.name}</div>
               <div style="color:${stateColor};font-size:11px">● Live tides available</div>
               <a href="${s.slug.startsWith('/') ? s.slug : `/tides/florida/${s.slug}`}" style="display:inline-block;margin-top:6px;background:${stateColor};color:white;padding:3px 10px;border-radius:6px;text-decoration:none;font-size:11px;font-weight:600">View tides →</a>
             </div>`
          : `<div style="font-family:system-ui;font-size:12px;line-height:1.5">
               <div style="font-weight:700">${s.name}</div>
               <div style="color:#9ca3af;font-size:11px">Coming soon</div>
             </div>`

        // tcpState is read by iconCreateFunction to color the cluster
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return L.marker([s.lat, s.lon], { icon, tcpState: s.state } as any).bindPopup(popupContent, { maxWidth: 220 })
      })

      clusterGroup.addLayers(markers)
      map.addLayer(clusterGroup)

      mapRef.current = map
    })

    return () => {
      destroyed = true
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTouch])

  // When user taps the overlay, enable touch interactions
  const activate = () => {
    setActive(true)
    const map = mapRef.current
    if (map) {
      map.dragging?.enable()
      map.touchZoom?.enable()
      map.doubleClickZoom?.enable()
    }
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
      {isTouch && !active && (
        <button
          onClick={activate}
          aria-label="Activate map"
          style={{
            position: 'absolute', inset: 0, zIndex: 400,
            background: 'rgba(10,15,26,0.35)',
            backdropFilter: 'blur(1px)',
            border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontFamily: 'inherit',
          }}
        >
          <div style={{
            background: 'rgba(15,23,42,0.92)',
            border: '1px solid rgba(255,255,255,0.18)',
            borderRadius: 12,
            padding: '12px 18px',
            fontSize: 13, fontWeight: 600,
            display: 'flex', alignItems: 'center', gap: 8,
            boxShadow: '0 6px 24px rgba(0,0,0,0.4)',
          }}>
            <span style={{ fontSize: 18 }}>👆</span>
            Tap to interact with map
          </div>
        </button>
      )}
    </div>
  )
}
