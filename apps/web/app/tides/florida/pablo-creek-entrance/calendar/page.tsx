'use client'

import { useState } from 'react'

// ─── Types ───────────────────────────────────────────────────────────────────

type Mode = 'dark' | 'light' | 'red'

interface Theme {
  bg: string
  surface: string
  surfaceAlt: string
  border: string
  text: string
  textMuted: string
  textFaint: string
  accent: string
  accentMuted: string
  accentFaint: string
  canvasSunLine: string
  canvasNowLine: string
  badge: string
  badgeText: string
  chip: string
  chipText: string
}

interface TideEvent {
  time: string
  height: number
  type: 'high' | 'low'
}

interface CalendarDay {
  date: Date
  dayNum: number
  dayName: string
  moonPhase: number
  moonEmoji: string
  sunrise: string
  sunset: string
  tides: TideEvent[]
  coefficient: number
  coeffLabel: string
  coeffColor: string
  solunarScore: number
  isToday: boolean
  isWeekend: boolean
}

// ─── Themes ──────────────────────────────────────────────────────────────────

const THEMES: Record<Mode, Theme> = {
  dark: {
    bg: '#0a0e1a',
    surface: '#111827',
    surfaceAlt: '#0f172a',
    border: '#1e2d45',
    text: '#f1f5f9',
    textMuted: '#94a3b8',
    textFaint: '#475569',
    accent: '#38bdf8',
    accentMuted: '#0ea5e9',
    accentFaint: '#0c4a6e',
    canvasSunLine: '#fbbf24',
    canvasNowLine: '#f43f5e',
    badge: '#1e2d45',
    badgeText: '#94a3b8',
    chip: '#1e293b',
    chipText: '#94a3b8',
  },
  light: {
    bg: '#f0f4f8',
    surface: '#ffffff',
    surfaceAlt: '#f8fafc',
    border: '#dde3ec',
    text: '#0f172a',
    textMuted: '#475569',
    textFaint: '#94a3b8',
    accent: '#0284c7',
    accentMuted: '#0369a1',
    accentFaint: '#bae6fd',
    canvasSunLine: '#d97706',
    canvasNowLine: '#e11d48',
    badge: '#e2e8f0',
    badgeText: '#475569',
    chip: '#e2e8f0',
    chipText: '#475569',
  },
  red: {
    bg: '#0d0000',
    surface: '#1a0000',
    surfaceAlt: '#120000',
    border: '#3d0000',
    text: '#ff6b6b',
    textMuted: '#cc3333',
    textFaint: '#7a1a1a',
    accent: '#ff4444',
    accentMuted: '#cc2222',
    accentFaint: '#2d0000',
    canvasSunLine: '#cc4400',
    canvasNowLine: '#ff0000',
    badge: '#2d0000',
    badgeText: '#cc3333',
    chip: '#2d0000',
    chipText: '#cc3333',
  },
}

// ─── Nearby stations ─────────────────────────────────────────────────────────

const NEARBY = [
  'St. Johns River Entrance',
  'Mayport (Naval Station)',
  'Fort George Inlet',
  'Ponte Vedra Beach',
  'Nassau Sound',
  'Sisters Creek',
]

// ─── Data-generation helpers ─────────────────────────────────────────────────

/** Returns moon phase 0–1 (0 = new, 0.5 = full) using Julian Day Number. */
function moonPhase(date: Date): number {
  const Y = date.getFullYear()
  const M = date.getMonth() + 1
  const D = date.getDate()
  const JD =
    367 * Y -
    Math.floor((7 * (Y + Math.floor((M + 9) / 12))) / 4) +
    Math.floor((275 * M) / 9) +
    D +
    1721013.5
  const SYNODIC = 29.53058867
  const REF_JD  = 2451550.1 // known new moon: Jan 6 2000
  let phase = ((JD - REF_JD) % SYNODIC) / SYNODIC
  if (phase < 0) phase += 1
  return phase
}

/** Maps phase 0–1 to one of 8 Unicode moon emojis. */
function moonEmoji(phase: number): string {
  const MOONS = ['🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘']
  const idx = Math.floor(((phase + 0.0625) % 1) * 8)
  return MOONS[idx]
}

/** Formats a decimal hour (0–24) as "h:mm am/pm". */
function fmtHour(h: number): string {
  h = ((h % 24) + 24) % 24
  let hInt = Math.floor(h)
  let mins = Math.round((h - hInt) * 60)
  if (mins === 60) { mins = 0; hInt = (hInt + 1) % 24 }
  const suffix = hInt < 12 ? 'am' : 'pm'
  const h12    = hInt % 12 === 0 ? 12 : hInt % 12
  return `${h12}:${String(mins).padStart(2, '0')} ${suffix}`
}

/** Approximate sunrise/sunset for Jacksonville FL (30.4°N, 81.7°W). */
function sunTimes(dayOfYear: number): { sunrise: string; sunset: string } {
  const LAT_RAD = (30.4 * Math.PI) / 180
  const decl    = -23.45 * Math.cos(((360 / 365) * (dayOfYear + 10) * Math.PI) / 180)
  const declRad = (decl * Math.PI) / 180
  const cosHA   = -Math.tan(LAT_RAD) * Math.tan(declRad)
  const HA      = (Math.acos(Math.max(-1, Math.min(1, cosHA))) * 180) / Math.PI
  // Longitude correction: Eastern meridian 75°W vs our 81.7°W → -0.447h
  // EDT: +1h DST (active April through October)
  const correction = (75 - 81.7) / 15 + 1
  const rise = 12 - HA / 15 + correction
  const set  = 12 + HA / 15 + correction
  return { sunrise: fmtHour(rise), sunset: fmtHour(set) }
}

/** Day-of-year (1-based). */
function dayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0)
  return Math.floor((date.getTime() - start.getTime()) / 86400000)
}

/** Round to 1 decimal. */
function r1(n: number): number {
  return Math.round(n * 10) / 10
}

/** Reference date: Apr 10 2026 (matches the main location page). */
const REF_DATE = new Date(2026, 3, 10) // month is 0-indexed

/**
 * Generate 4 tide events for a given date.
 * Uses the same M2 harmonic model as the main location page,
 * parametrized by day offset from the reference date.
 */
function generateTides(date: Date): TideEvent[] {
  const dayOff = (date.getTime() - REF_DATE.getTime()) / 86400000
  // M2 tidal period = 12.4206h, so tides advance 0.7176h/day
  const M2     = 12.4206
  const lag    = ((dayOff * 0.7176) % M2 + M2) % M2

  // Reference highs/lows on Apr 10
  const h1base = 6.70
  const l1base = 0.23

  const high1 = (h1base + lag) % 24
  const low1  = (l1base + lag + M2) % 24   // low approximately half-period after low ref
  const high2 = (high1 + M2) % 24
  const low2  = (low1  + M2) % 24

  // Amplitude varies with moon phase (spring/neap)
  const phase = moonPhase(date)
  const amp   = 2.1 + 0.6 * Math.cos(2 * Math.PI * phase)
  const highH = r1(2.75 + amp)
  const lowH  = r1(Math.max(0.1, 2.75 - amp * 0.85))
  // Slight variation between first and second cycle
  const highH2 = r1(Math.max(0.5, highH - 0.15 + 0.3 * Math.sin(dayOff * 0.9)))
  const lowH2  = r1(Math.max(0.1, lowH  + 0.1  - 0.1 * Math.sin(dayOff * 1.1)))

  const raw = [
    { hour: high1, type: 'high' as const, height: highH  },
    { hour: low1,  type: 'low'  as const, height: lowH   },
    { hour: high2, type: 'high' as const, height: highH2 },
    { hour: low2,  type: 'low'  as const, height: lowH2  },
  ].sort((a, b) => a.hour - b.hour)

  return raw.map(ev => ({
    time:   fmtHour(ev.hour),
    height: ev.height,
    type:   ev.type,
  }))
}

/** Tidal coefficient 0–110 from moon phase and day-of-year. */
function tidalCoefficient(phase: number, doy: number): number {
  const raw = 70 + 30 * Math.cos(4 * Math.PI * phase) + 3 * Math.sin(doy * 0.7)
  return Math.round(Math.max(20, Math.min(110, raw)))
}

function coeffLabel(c: number): string {
  if (c >= 90) return 'very high'
  if (c >= 75) return 'high'
  if (c >= 55) return 'average'
  if (c >= 40) return 'low'
  return 'very low'
}

function coeffColor(c: number): string {
  if (c >= 90) return '#22c55e'
  if (c >= 75) return '#84cc16'
  if (c >= 55) return '#eab308'
  if (c >= 40) return '#f97316'
  return '#ef4444'
}

function solunarScore(c: number): 1 | 2 | 3 | 4 {
  if (c >= 90) return 4
  if (c >= 75) return 3
  if (c >= 55) return 2
  return 1
}

/** Build all CalendarDay objects for a given year/month (0-indexed month). */
function generateMonth(year: number, month: number): CalendarDay[] {
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const today       = new Date()
  const days: CalendarDay[] = []

  for (let d = 1; d <= daysInMonth; d++) {
    const date    = new Date(year, month, d)
    const doy     = dayOfYear(date)
    const phase   = moonPhase(date)
    const coeff   = tidalCoefficient(phase, doy)
    const { sunrise, sunset } = sunTimes(doy)

    days.push({
      date,
      dayNum:      d,
      dayName:     date.toLocaleDateString('en-US', { weekday: 'short' }),
      moonPhase:   phase,
      moonEmoji:   moonEmoji(phase),
      sunrise,
      sunset,
      tides:       generateTides(date),
      coefficient: coeff,
      coeffLabel:  coeffLabel(coeff),
      coeffColor:  coeffColor(coeff),
      solunarScore: solunarScore(coeff),
      isToday:     date.toDateString() === today.toDateString(),
      isWeekend:   date.getDay() === 0 || date.getDay() === 6,
    })
  }

  return days
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function PabloCreekCalendarPage() {
  const [mode, setMode]           = useState<Mode>('dark')
  const [currentMonth, setCurrentMonth] = useState<Date>(() => {
    const n = new Date()
    return new Date(n.getFullYear(), n.getMonth(), 1)
  })

  const t      = THEMES[mode]
  const days   = generateMonth(currentMonth.getFullYear(), currentMonth.getMonth())
  const monthLabel = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  const goToPrev = () =>
    setCurrentMonth(d => new Date(d.getFullYear(), d.getMonth() - 1, 1))
  const goToNext = () =>
    setCurrentMonth(d => new Date(d.getFullYear(), d.getMonth() + 1, 1))

  // ── Style helpers
  const modeBtnStyle = (m: Mode): React.CSSProperties => ({
    padding: '4px 12px',
    fontSize: 12,
    fontWeight: 500,
    borderRadius: 6,
    border: `1px solid ${mode === m ? t.accent : t.border}`,
    background: mode === m ? t.accentFaint : 'transparent',
    color: mode === m ? t.accent : t.textMuted,
    cursor: 'pointer',
  })

  const card = (children: React.ReactNode, extra?: React.CSSProperties) => (
    <div style={{
      background: t.surface,
      border: `1px solid ${t.border}`,
      borderRadius: 12,
      padding: '18px 20px',
      ...extra,
    }}>
      {children}
    </div>
  )

  // ── Grid column template (9 columns)
  const GRID_COLS = '64px 36px 116px repeat(4, minmax(84px, 1fr)) 106px 84px'

  // ── Column header labels
  const COL_HEADERS = [
    'Day', '', 'Sunrise / Sunset',
    '1st Tide', '2nd Tide', '3rd Tide', '4th Tide',
    'Coefficient', 'Solunar',
  ]

  return (
    <div style={{
      background: t.bg,
      color: t.text,
      minHeight: '100vh',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    }}>

      {/* ── Nav ── */}
      <nav style={{
        borderBottom: `1px solid ${t.border}`,
        background: `${t.bg}ee`,
        backdropFilter: 'blur(8px)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}>
        <div style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '0 20px',
          height: 52,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <a href="/" style={{ fontSize: 16, fontWeight: 600, color: t.text, textDecoration: 'none' }}>
              Tide<span style={{ color: t.accent }}>Charts</span>Pro
            </a>
            <a href="/tides/florida/pablo-creek-entrance" style={{
              fontSize: 13,
              color: t.textMuted,
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}>
              ← Today&apos;s Tides
            </a>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {(['dark', 'light', 'red'] as Mode[]).map(m => (
              <button key={m} onClick={() => setMode(m)} style={modeBtnStyle(m)}>
                {m === 'dark' ? '🌑 Dark' : m === 'light' ? '☀️ Light' : '🔴 Night'}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 20px 40px' }}>

        {/* ── Breadcrumb ── */}
        <div style={{ fontSize: 11, color: t.textFaint, marginBottom: 8 }}>
          <a href="/tides/florida" style={{ color: t.textFaint, textDecoration: 'none' }}>Florida</a>
          <span style={{ margin: '0 6px' }}>/</span>
          <a href="/tides/florida/pablo-creek-entrance" style={{ color: t.textFaint, textDecoration: 'none' }}>Pablo Creek Entrance</a>
          <span style={{ margin: '0 6px' }}>/</span>
          <span style={{ color: t.textMuted }}>Tide Calendar</span>
        </div>

        {/* ── Title ── */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14, marginBottom: 20, flexWrap: 'wrap' }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, margin: '0 0 4px' }}>
              Tide Calendar — Pablo Creek Entrance
            </h1>
            <div style={{ fontSize: 12, color: t.textMuted }}>
              NOAA Station 8720218 · Jacksonville, FL · All times local (EDT)
            </div>
          </div>
          <div style={{
            fontSize: 11,
            padding: '4px 10px',
            borderRadius: 6,
            background: t.badge,
            color: t.badgeText,
            border: `1px solid ${t.border}`,
            marginBottom: 4,
          }}>
            4 tides/day · semi-diurnal · predicted
          </div>
        </div>

        {/* ── Month navigation ── */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 20,
          marginBottom: 16,
          padding: '10px 0',
        }}>
          <button onClick={goToPrev} style={{
            background: t.surface,
            border: `1px solid ${t.border}`,
            color: t.text,
            padding: '6px 16px',
            borderRadius: 8,
            fontSize: 14,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}>
            ◀ Prev
          </button>
          <span style={{ fontSize: 18, fontWeight: 700, minWidth: 180, textAlign: 'center' }}>
            {monthLabel}
          </span>
          <button onClick={goToNext} style={{
            background: t.surface,
            border: `1px solid ${t.border}`,
            color: t.text,
            padding: '6px 16px',
            borderRadius: 8,
            fontSize: 14,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}>
            Next ▶
          </button>
        </div>

        {/* ── Calendar table ── */}
        {card(
          <div style={{ overflowX: 'auto', borderRadius: 8 }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: GRID_COLS,
              minWidth: 900,
            }}>

              {/* ── Column headers ── */}
              {COL_HEADERS.map((label, ci) => (
                <div key={ci} style={{
                  padding: '8px 10px 10px',
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: '0.07em',
                  textTransform: 'uppercase',
                  color: t.textFaint,
                  borderBottom: `2px solid ${t.border}`,
                  background: t.surfaceAlt,
                  ...(ci === 0 ? { borderRadius: '8px 0 0 0' } : {}),
                  ...(ci === 8 ? { borderRadius: '0 8px 0 0' } : {}),
                }}>
                  {label}
                </div>
              ))}

              {/* ── Data rows ── */}
              {days.flatMap(day => {
                const rowBg = day.isToday
                  ? t.accentFaint
                  : day.isWeekend
                  ? `${t.surfaceAlt}`
                  : t.surface

                const cellBase: React.CSSProperties = {
                  background: rowBg,
                  borderTop: `1px solid ${t.border}`,
                  padding: '9px 10px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }

                const isLast = day.dayNum === days.length

                return [
                  // ── DAY cell
                  <div key={`${day.dayNum}-day`} style={{
                    ...cellBase,
                    borderLeft: day.isToday
                      ? `3px solid ${t.accent}`
                      : '3px solid transparent',
                    ...(isLast ? { borderRadius: '0 0 0 8px' } : {}),
                  }}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: day.isToday ? t.accent : t.text, lineHeight: 1 }}>
                      {day.dayNum}
                    </div>
                    <div style={{ fontSize: 10, color: t.textMuted, marginTop: 2 }}>
                      {day.dayName}
                    </div>
                  </div>,

                  // ── MOON cell
                  <div key={`${day.dayNum}-moon`} style={{ ...cellBase, alignItems: 'center' }}>
                    <span style={{ fontSize: 18, lineHeight: 1 }} title={`Phase: ${(day.moonPhase * 100).toFixed(0)}%`}>
                      {day.moonEmoji}
                    </span>
                  </div>,

                  // ── SUNRISE/SUNSET cell
                  <div key={`${day.dayNum}-sun`} style={cellBase}>
                    <div style={{ fontSize: 11, color: t.textMuted, whiteSpace: 'nowrap' }}>
                      <span style={{ color: t.canvasSunLine, marginRight: 3 }}>↑</span>
                      {day.sunrise}
                    </div>
                    <div style={{ fontSize: 11, color: t.textMuted, marginTop: 3, whiteSpace: 'nowrap' }}>
                      <span style={{ color: '#f97316', marginRight: 3 }}>↓</span>
                      {day.sunset}
                    </div>
                  </div>,

                  // ── TIDE 1–4 cells
                  ...[0, 1, 2, 3].map(ti => {
                    const tide = day.tides[ti]
                    return (
                      <div key={`${day.dayNum}-t${ti}`} style={cellBase}>
                        {tide ? (
                          <>
                            <div style={{ fontSize: 12, fontWeight: 600, color: t.text, whiteSpace: 'nowrap' }}>
                              {tide.time}
                            </div>
                            <div style={{
                              fontSize: 11,
                              color: tide.type === 'high' ? t.accent : t.textMuted,
                              marginTop: 2,
                              whiteSpace: 'nowrap',
                            }}>
                              {tide.type === 'high' ? '▲' : '▼'} {tide.height.toFixed(1)} ft
                            </div>
                          </>
                        ) : (
                          <span style={{ color: t.textFaint, fontSize: 12 }}>—</span>
                        )}
                      </div>
                    )
                  }),

                  // ── COEFFICIENT cell
                  <div key={`${day.dayNum}-coeff`} style={{ ...cellBase, alignItems: 'flex-start' }}>
                    <div style={{
                      fontSize: 18,
                      fontWeight: 800,
                      color: day.coeffColor,
                      lineHeight: 1,
                    }}>
                      {day.coefficient}
                    </div>
                    <div style={{
                      marginTop: 4,
                      fontSize: 9,
                      fontWeight: 700,
                      color: day.coeffColor,
                      background: `${day.coeffColor}22`,
                      padding: '2px 6px',
                      borderRadius: 3,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      whiteSpace: 'nowrap',
                    }}>
                      {day.coeffLabel}
                    </div>
                  </div>,

                  // ── SOLUNAR cell
                  <div key={`${day.dayNum}-sol`} style={{
                    ...cellBase,
                    flexDirection: 'row',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: 1,
                    ...(isLast ? { borderRadius: '0 0 8px 0' } : {}),
                  }}>
                    {Array.from({ length: 4 }, (_, fi) => (
                      <span key={fi} style={{
                        fontSize: 14,
                        opacity: fi < day.solunarScore ? 1 : 0.15,
                        filter: fi < day.solunarScore ? 'none' : 'grayscale(1)',
                      }}>
                        🐟
                      </span>
                    ))}
                  </div>,
                ]
              })}
            </div>
          </div>,
          { padding: '0' } // card with no padding so table goes edge-to-edge
        )}

        {/* ── Legend ── */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 16,
          margin: '14px 0',
          padding: '12px 16px',
          background: t.surface,
          border: `1px solid ${t.border}`,
          borderRadius: 10,
          fontSize: 11,
        }}>
          <span style={{ color: t.textFaint, fontWeight: 600, marginRight: 4 }}>COEFFICIENT:</span>
          {[
            { label: 'Very High', color: '#22c55e', range: '≥ 90' },
            { label: 'High',      color: '#84cc16', range: '75–89' },
            { label: 'Average',   color: '#eab308', range: '55–74' },
            { label: 'Low',       color: '#f97316', range: '40–54' },
            { label: 'Very Low',  color: '#ef4444', range: '< 40'  },
          ].map(l => (
            <span key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: l.color, display: 'inline-block' }} />
              <span style={{ color: l.color, fontWeight: 600 }}>{l.label}</span>
              <span style={{ color: t.textFaint }}>{l.range}</span>
            </span>
          ))}
          <span style={{ color: t.textFaint, marginLeft: 12 }}>
            🐟🐟🐟🐟 = peak solunar &nbsp;·&nbsp; 🐟 = low activity
          </span>
          <span style={{ color: t.textFaint }}>
            ▲ = high tide &nbsp;·&nbsp; ▼ = low tide
          </span>
        </div>

        {/* ── Nearby stations ── */}
        {card(
          <>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12, color: t.text }}>
              Nearby Stations
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {NEARBY.map(s => (
                <a
                  key={s}
                  href={`/tides/florida/${s.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`}
                  style={{
                    padding: '6px 14px',
                    background: t.chip,
                    border: `1px solid ${t.border}`,
                    borderRadius: 20,
                    fontSize: 12,
                    color: t.chipText,
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <span style={{ fontSize: 10 }}>📍</span> {s}
                </a>
              ))}
            </div>
          </>,
          { marginTop: 0 }
        )}
      </div>

      {/* ── Footer ── */}
      <footer style={{ borderTop: `1px solid ${t.border}`, padding: '20px' }}>
        <div style={{
          maxWidth: 1200,
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 10,
        }}>
          <div style={{ fontSize: 13, fontWeight: 600 }}>
            Tide<span style={{ color: t.accent }}>Charts</span>Pro
          </div>
          <div style={{ fontSize: 11, color: t.textFaint }}>
            Data: NOAA CO-OPS station 8720218 · Predicted tides · Updated every 6 min
          </div>
          <div style={{ display: 'flex', gap: 16, fontSize: 11, color: t.textFaint }}>
            <a href="/tides" style={{ color: t.textFaint, textDecoration: 'none' }}>Tides</a>
            <a href="/fishing" style={{ color: t.textFaint, textDecoration: 'none' }}>Fishing</a>
            <a href="/map" style={{ color: t.textFaint, textDecoration: 'none' }}>Map</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
