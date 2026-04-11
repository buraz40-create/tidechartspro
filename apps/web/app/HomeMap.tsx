'use client'

import { useEffect, useRef } from 'react'
import 'leaflet/dist/leaflet.css'

export interface MapStation {
  name: string
  lat: number
  lon: number
  slug: string
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

export default function HomeMap({ stations, mode }: HomeMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = useRef<any>(null)
  const modeRef = useRef(mode)

  useEffect(() => {
    modeRef.current = mode
  }, [mode])

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    let destroyed = false

    import('leaflet').then(({ default: L }) => {
      if (destroyed || !containerRef.current) return

      const map = L.map(containerRef.current, {
        center:             [36, -96],
        zoom:               4,
        zoomControl:        true,
        scrollWheelZoom:    true,
        attributionControl: false,
        minZoom: 2,
        maxZoom: 18,
      })

      // Same tile as Pablo Creek page — standard OSM
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        subdomains: 'abc',
        maxZoom: 19,
      }).addTo(map)

      L.control.attribution({
        prefix: '© <a href="https://openstreetmap.org">OSM</a>',
        position: 'bottomright',
      }).addTo(map)

      stations.forEach(s => {
        const accent = ACCENT[modeRef.current]
        const color = s.live ? accent : '#6b7280'
        const size = s.live ? 14 : 9
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
               <div style="color:#3b82f6;font-size:11px">● Live tides available</div>
               <a href="${s.slug.startsWith('/') ? s.slug : `/tides/florida/${s.slug}`}" style="display:inline-block;margin-top:6px;background:#3b82f6;color:white;padding:3px 10px;border-radius:6px;text-decoration:none;font-size:11px;font-weight:600">View tides →</a>
             </div>`
          : `<div style="font-family:system-ui;font-size:12px;line-height:1.5">
               <div style="font-weight:700">${s.name}</div>
               <div style="color:#9ca3af;font-size:11px">Coming soon</div>
             </div>`

        L.marker([s.lat, s.lon], { icon })
          .addTo(map)
          .bindPopup(popupContent, { maxWidth: 200 })
      })

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
  }, [])

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
}
