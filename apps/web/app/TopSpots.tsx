'use client'

import { useEffect, useMemo, useState } from 'react'

interface Theme {
  bg: string; surface: string; surfaceAlt: string; border: string
  text: string; textMuted: string; textFaint: string
  accent: string; accentFaint: string
}

interface SpotDef {
  id: string       // NOAA station ID
  name: string     // Station display name
  city: string     // City label
  slug: string     // Full path to tide page
}

const SPOTS: SpotDef[] = [
  { id: '8771341', name: 'Galveston Bay Entrance',         city: 'Galveston, TX',       slug: '/tides/us/texas/galveston-bay-entrance-north-jetty' },
  { id: '8720218', name: 'Mayport',                        city: 'Jacksonville, FL',    slug: '/tides/us/florida/pablo-creek-entrance' },
  { id: '8724580', name: 'Key West',                       city: 'Key West, FL',        slug: '/tides/us/florida/key-west' },
  { id: '8447930', name: 'Woods Hole',                     city: 'Cape Cod, MA',        slug: '/tides/us/massachusetts/provincetown' },
  { id: '9410660', name: 'Newport Bay Entrance',           city: 'Newport Beach, CA',   slug: '/tides/us/california/newport-bay-entrance-corona-del-mar' },
  { id: '8638863', name: 'Chesapeake Bay Bridge Tunnel',   city: 'Virginia Beach, VA',  slug: '/tides/us/virginia/chesapeake-bay-bridge-tunnel' },
  { id: '8651370', name: 'Duck',                           city: 'Outer Banks, NC',     slug: '/tides/us/north-carolina/duck' },
  { id: '9439040', name: 'Astoria',                        city: 'Astoria, OR',         slug: '/tides/us/oregon/astoria' },
]

interface LiveTide { label: 'High'|'Low'; time: string; height: number; hour: number; raw: string }

function colorForScore(s: number) {
  if (s >= 80) return { fill: '#10b981', label: 'EXCELLENT' }
  if (s >= 65) return { fill: '#22c55e', label: 'GOOD' }
  if (s >= 50) return { fill: '#eab308', label: 'OK' }
  if (s >= 35) return { fill: '#f97316', label: 'ROUGH' }
  return         { fill: '#ef4444', label: 'POOR' }
}

// Compact semi-circle gauge for cards (90px)
function MiniGauge({ score }: { score: number }) {
  const clamped = Math.max(0, Math.min(100, score))
  const c = colorForScore(clamped)
  const [shown, setShown] = useState(0)
  useEffect(() => {
    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / 1200)
      const ease = 1 - Math.pow(1 - t, 3)
      setShown(clamped * ease)
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [clamped])

  const size = 96
  const r = size * 0.42
  const cx = size / 2
  const cy = size * 0.62
  const stroke = size * 0.09
  const sweep = Math.PI * (shown / 100)
  const endX = cx - r * Math.cos(sweep)
  const endY = cy - r * Math.sin(sweep)
  const arc = `M ${cx - r} ${cy} A ${r} ${r} 0 ${sweep > Math.PI ? 1 : 0} 1 ${endX} ${endY}`
  const trackArc = `M ${cx - r} ${cy} A ${r} ${r} 0 1 1 ${cx + r} ${cy}`

  return (
    <svg width={size} height={size * 0.74} style={{ overflow: 'visible' }}>
      <path d={trackArc} fill="none" stroke="#1e293b" strokeWidth={stroke} strokeLinecap="round" />
      <path d={arc} fill="none" stroke={c.fill} strokeWidth={stroke} strokeLinecap="round" />
      <text x={cx} y={cy - 4} textAnchor="middle" style={{ fontSize: size * 0.3, fontWeight: 800, fill: c.fill, fontFamily: 'system-ui, sans-serif' }}>
        {Math.round(shown)}
      </text>
    </svg>
  )
}

// Live countdown to the next tide event
function NextEvent({ events }: { events: LiveTide[] }) {
  const [now, setNow] = useState<Date>(() => new Date(2026, 0, 1)) // SSR-safe init
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
    setNow(new Date())
    const i = setInterval(() => setNow(new Date()), 30_000)
    return () => clearInterval(i)
  }, [])

  if (!mounted || !events.length) {
    return <div style={{ fontSize: 11, color: '#475569', minHeight: 16 }}> </div>
  }

  // Find next future event today
  const today = now.toISOString().slice(0, 10)
  const upcoming = events
    .filter(e => e.raw.startsWith(today))
    .filter(e => new Date(e.raw.replace(' ', 'T')).getTime() > now.getTime())
    .sort((a, b) => new Date(a.raw.replace(' ', 'T')).getTime() - new Date(b.raw.replace(' ', 'T')).getTime())[0]

  if (!upcoming) return <div style={{ fontSize: 11, color: '#475569', minHeight: 16 }}>No more tides today</div>

  const diffMs = new Date(upcoming.raw.replace(' ', 'T')).getTime() - now.getTime()
  const totalMin = Math.floor(diffMs / 60000)
  const hrs = Math.floor(totalMin / 60)
  const mins = totalMin % 60
  const label = hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`

  return (
    <div style={{ fontSize: 11, color: '#64748b' }}>
      Next <span style={{ color: upcoming.label === 'High' ? '#3b82f6' : '#94a3b8', fontWeight: 700 }}>{upcoming.label.toUpperCase()}</span>{' '}
      in <span style={{ color: '#cbd5e1', fontWeight: 700 }}>{label}</span> · {upcoming.height.toFixed(1)} ft
    </div>
  )
}

export default function TopSpots({ t }: { t: Theme }) {
  const [data, setData] = useState<Record<string, LiveTide[]>>({})

  useEffect(() => {
    const pad = (n: number) => String(n).padStart(2, '0')
    const d = new Date()
    const fmt = `${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}`
    const BASE = 'https://api.tidesandcurrents.noaa.gov/api/prod/datagetter'
    Promise.all(SPOTS.map(s =>
      fetch(`${BASE}?product=predictions&interval=hilo&begin_date=${fmt}&end_date=${fmt}&station=${s.id}&datum=MLLW&time_zone=lst_ldt&units=english&format=json&application=TideChartsPro`)
        .then(r => r.json())
        .then((res: { predictions?: {t:string, v:string, type:string}[] }): [string, LiveTide[]] => {
          const events: LiveTide[] = (res.predictions ?? []).map(p => {
            const [, time] = p.t.split(' ')
            const [hh, mm] = time.split(':').map(Number)
            const h12 = hh % 12 === 0 ? 12 : hh % 12
            return {
              label: (p.type === 'H' ? 'High' : 'Low') as 'High'|'Low',
              time: `${h12}:${pad(mm)} ${hh < 12 ? 'am' : 'pm'}`,
              height: parseFloat(p.v),
              hour: hh + mm / 60,
              raw: p.t,
            }
          })
          return [s.id, events]
        })
        .catch((): [string, LiveTide[]] => [s.id, []]),
    )).then(pairs => {
      const map: Record<string, LiveTide[]> = {}
      for (const [id, evs] of pairs) map[id] = evs
      setData(map)
    })
  }, [])

  // Compute scores and sort by highest
  const ranked = useMemo(() => {
    return SPOTS.map(s => {
      const events = data[s.id] ?? []
      let score = 0
      if (events.length >= 2) {
        const highs = events.filter(e => e.label === 'High').map(e => e.height)
        const lows  = events.filter(e => e.label === 'Low').map(e => e.height)
        if (highs.length && lows.length) {
          const range = Math.max(...highs) - Math.min(...lows)
          score = Math.round(Math.max(20, Math.min(100, (range / 5.5) * 100)))
        }
      }
      return { ...s, events, score, c: colorForScore(score) }
    }).sort((a, b) => b.score - a.score)
  }, [data])

  const loaded = Object.keys(data).length > 0

  return (
    <section style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 20px 56px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          fontSize: 10, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase',
          color: '#10b981',
          background: 'rgba(16, 185, 129, 0.12)',
          border: '1px solid rgba(16, 185, 129, 0.35)',
          padding: '4px 10px', borderRadius: 999,
        }}>
          <span style={{
            width: 7, height: 7, borderRadius: '50%', background: '#10b981',
            boxShadow: '0 0 8px #10b981',
            animation: 'tcp-live-pulse 1.8s ease-in-out infinite',
          }} />
          LIVE
        </span>
        <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Top fishing spots right now</h2>
      </div>
      <p style={{ color: t.textMuted, fontSize: 13, marginBottom: 22 }}>
        Today&apos;s tide intelligence across the country - sorted by fishing score
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: 12,
      }}>
        {ranked.map(s => (
          <a key={s.id} href={s.slug} style={{
            display: 'flex', flexDirection: 'column', gap: 8,
            background: t.surface, border: `1px solid ${t.border}`,
            borderRadius: 14, padding: '16px 16px 14px',
            textDecoration: 'none', color: t.text,
            transition: 'transform 0.15s, border-color 0.15s, box-shadow 0.15s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-3px)'
            e.currentTarget.style.borderColor = s.c.fill + '88'
            e.currentTarget.style.boxShadow = `0 8px 24px ${s.c.fill}22`
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.borderColor = t.border
            e.currentTarget.style.boxShadow = 'none'
          }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.2, marginBottom: 2 }}>{s.city}</div>
                <div style={{ fontSize: 11, color: t.textFaint, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.name}</div>
              </div>
              {loaded && <MiniGauge score={s.score} />}
            </div>
            {loaded && (
              <div style={{
                display: 'inline-block', alignSelf: 'flex-start',
                fontSize: 10, fontWeight: 800, letterSpacing: '0.1em',
                color: s.c.fill,
                background: s.c.fill + '14',
                border: `1px solid ${s.c.fill}33`,
                padding: '2px 8px', borderRadius: 999,
              }}>
                {s.c.label}
              </div>
            )}
            <NextEvent events={s.events} />
            <div style={{
              marginTop: 4, fontSize: 12, fontWeight: 600, color: t.accent,
              display: 'flex', alignItems: 'center', gap: 4,
            }}>
              View forecast <span>›</span>
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}
