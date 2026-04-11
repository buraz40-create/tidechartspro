'use client'

import { useEffect, useRef } from 'react'
import 'leaflet/dist/leaflet.css'

export interface NearbyStation {
  name: string
  lat: number
  lon: number
  slug: string
  distMi?: number
}

interface TideMapProps {
  lat: number
  lon: number
  name: string
  nearby: NearbyStation[]
  accent: string
  mode: 'dark' | 'light' | 'red'
}

export default function TideMap({ lat, lon, name, nearby, accent, mode }: TideMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = useRef<any>(null)

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    let destroyed = false

    import('leaflet').then(({ default: L }) => {
      if (destroyed || !containerRef.current) return

      const map = L.map(containerRef.current, {
        center:            [lat, lon],
        zoom:              13,
        zoomControl:       true,
        scrollWheelZoom:   false,
        attributionControl: false,
      })

      // Natural tile layer — always use standard OSM for accurate coastline/water
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        subdomains: 'abc',
        maxZoom: 19,
      }).addTo(map)

      L.control.attribution({ prefix: '© <a href="https://openstreetmap.org">OSM</a> © <a href="https://carto.com">CARTO</a>' }).addTo(map)

      // Main station marker
      const mainIcon = L.divIcon({
        html: `<div style="width:16px;height:16px;border-radius:50%;background:${accent};border:3px solid white;box-shadow:0 0 12px rgba(0,0,0,0.9),0 0 0 5px ${accent}55;"></div>`,
        className: '',
        iconSize:   [16, 16],
        iconAnchor: [8, 8],
        popupAnchor:[0, -12],
      })

      L.marker([lat, lon], { icon: mainIcon })
        .addTo(map)
        .bindPopup(`<div style="font-family:system-ui;font-size:12px;font-weight:700;line-height:1.4">${name}<br><span style="font-weight:400;color:#666">Current station</span></div>`)
        .openPopup()

      // Nearby markers
      nearby.forEach(s => {
        const nearbyIcon = L.divIcon({
          html: `<div style="width:11px;height:11px;border-radius:50%;background:#60a5fa;border:2px solid white;box-shadow:0 0 6px rgba(0,0,0,0.7);"></div>`,
          className: '',
          iconSize:   [11, 11],
          iconAnchor: [5, 5],
          popupAnchor:[0, -8],
        })
        const dist = s.distMi != null ? `<br><span style="color:#666">${s.distMi.toFixed(1)} mi away</span>` : ''
        L.marker([s.lat, s.lon], { icon: nearbyIcon })
          .addTo(map)
          .bindPopup(`<div style="font-family:system-ui;font-size:12px;font-weight:700;line-height:1.4">${s.name}${dist}</div>`)
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


  return <div ref={containerRef} style={{ width: '100%', height: '100%', minHeight: 320 }} />
}
