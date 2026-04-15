// Tide engine — same algorithm as TideLocationPage.tsx on the website
// Reference: Pablo Creek Entrance, CAL_REF = April 10, 2026

export interface TidePoint {
  time: Date
  height: number
}

export interface TideExtreme {
  time: Date
  height: number
  type: 'H' | 'L'
}

// ── Constants (must match website exactly) ────────────────────────────────────
const CAL_REF  = new Date(2026, 3, 10).getTime()   // April 10 2026 midnight local
const M2       = 12.4206                             // M2 tidal period (hours)
const MOON_REF = new Date('2000-01-06').getTime()   // known new moon
const MOON_CYC = 29.530588853                        // days

// Reference hi/lo for April 10 2026 (from TIDE_EVENTS in website)
// High1 hour: 6.70, Low1 hour: 0.23
const REF_HIGH_HOUR = 6.70
const REF_LOW_HOUR  = 0.23

// Solunar reference: major1 = 8.75h on April 10 2026
const SOL_REF_MAJOR = 8.75   // hours on CAL_REF date
const SOL_ADV       = 50/60  // hours per day the transit advances

// ── Moon phase (0–1) ─────────────────────────────────────────────────────────
export function moonPhase(date: Date): number {
  const diff = (date.getTime() - MOON_REF) / (MOON_CYC * 86400_000)
  return diff - Math.floor(diff)
}

// ── Lag for any date (how many hours the M2 tide is offset from reference) ───
function lagForDate(date: Date): number {
  const dayOff = (date.getTime() - CAL_REF) / 86400_000
  return ((dayOff * 0.7176) % M2 + M2) % M2
}

// ── Amplitude based on moon phase ────────────────────────────────────────────
function ampForDate(date: Date): number {
  const phase = moonPhase(date)
  return 2.1 + 0.6 * Math.cos(2 * Math.PI * phase)
}

// ── Hi/Lo events for a given date ────────────────────────────────────────────
export interface TideEvent {
  type: 'H' | 'L'
  hour: number   // decimal hours in local time (0–24)
  height: number // feet MLLW
  time: Date
}

export function tideEventsForDate(date: Date): TideEvent[] {
  const dayOff = (date.getTime() - CAL_REF) / 86400_000
  const lag    = lagForDate(date)
  const amp    = ampForDate(date)

  const high1 = (REF_HIGH_HOUR + lag) % 24
  const low1  = (REF_LOW_HOUR  + lag + M2) % 24
  const high2 = (high1 + M2) % 24
  const low2  = (low1  + M2) % 24

  const hH  = Math.round((2.75 + amp) * 10) / 10
  const lH  = Math.round(Math.max(0.1, 2.75 - amp * 0.85) * 10) / 10
  const hH2 = Math.round(Math.max(0.5, hH - 0.15 + 0.3 * Math.sin(dayOff * 0.9)) * 10) / 10
  const lH2 = Math.round(Math.max(0.1, lH  + 0.1  - 0.1 * Math.sin(dayOff * 1.1)) * 10) / 10

  const midnight = new Date(date); midnight.setHours(0, 0, 0, 0)

  const events: TideEvent[] = [
    { type: 'H', hour: high1, height: hH,  time: new Date(midnight.getTime() + high1 * 3600_000) },
    { type: 'L', hour: low1,  height: lH,  time: new Date(midnight.getTime() + low1  * 3600_000) },
    { type: 'H', hour: high2, height: hH2, time: new Date(midnight.getTime() + high2 * 3600_000) },
    { type: 'L', hour: low2,  height: lH2, time: new Date(midnight.getTime() + low2  * 3600_000) },
  ]

  return events.sort((a, b) => a.hour - b.hour)
}

// ── Continuous tide curve (288 pts = 5-min resolution for one day) ───────────
export function tideCurveForDate(date: Date): TidePoint[] {
  const midnight = new Date(date); midnight.setHours(0, 0, 0, 0)
  const dayOff   = (date.getTime() - CAL_REF) / 86400_000
  const lag      = lagForDate(date)
  const amp      = ampForDate(date)
  const pts: TidePoint[] = []

  for (let i = 0; i <= 288; i++) {
    const t  = (i / 288) * 24
    const ts = t - lag
    const h  = 2.75
      + amp * Math.cos((ts * 2 * Math.PI) / M2)
      + (amp * 0.167) * Math.cos((ts * 4 * Math.PI) / M2)
      + 0.12 * Math.sin(((t - 3) * 2 * Math.PI) / 24)
    pts.push({
      time:   new Date(midnight.getTime() + t * 3600_000),
      height: Math.max(0, Math.round(h * 100) / 100),
    })
  }
  return pts
}

// ── Generate a curve spanning multiple days ───────────────────────────────────
// startMs = start timestamp, hours = total hours to cover
export function generateCurve(startMs: number, hours = 24): TidePoint[] {
  const start   = new Date(startMs)
  const endMs   = startMs + hours * 3600_000
  const result: TidePoint[] = []

  // Generate day by day and concatenate
  const d0 = new Date(start); d0.setHours(0, 0, 0, 0)
  let day = d0.getTime()
  while (day < endMs + 86400_000) {
    const pts = tideCurveForDate(new Date(day))
    result.push(...pts.filter(p => p.time.getTime() >= startMs && p.time.getTime() <= endMs))
    day += 86400_000
  }
  return result
}

// ── Find extremes (hi/lo) from a curve ───────────────────────────────────────
export function findExtremes(points: TidePoint[]): TideExtreme[] {
  const extremes: TideExtreme[] = []
  for (let i = 1; i < points.length - 1; i++) {
    const prev = points[i - 1].height
    const curr = points[i].height
    const next = points[i + 1].height
    if (curr > prev && curr > next) {
      extremes.push({ time: points[i].time, height: curr, type: 'H' })
    } else if (curr < prev && curr < next) {
      extremes.push({ time: points[i].time, height: curr, type: 'L' })
    }
  }
  return extremes
}

// ── Next hi/lo events from now (uses exact event times, more accurate) ────────
export function nextHighLow(nowMs: number): { nextHigh: TideEvent | null; nextLow: TideEvent | null } {
  // Check today + next 2 days to always find both
  let nextHigh: TideEvent | null = null
  let nextLow:  TideEvent | null = null

  for (let d = 0; d <= 2; d++) {
    const date = new Date(nowMs + d * 86400_000)
    const events = tideEventsForDate(date)
    for (const e of events) {
      if (e.time.getTime() > nowMs) {
        if (!nextHigh && e.type === 'H') nextHigh = e
        if (!nextLow  && e.type === 'L') nextLow  = e
      }
      if (nextHigh && nextLow) break
    }
    if (nextHigh && nextLow) break
  }
  return { nextHigh, nextLow }
}

// ── Current tide height by interpolating the curve ───────────────────────────
export function currentHeight(nowMs: number): number {
  const date    = new Date(nowMs)
  const pts     = tideCurveForDate(date)
  const idx     = Math.round(((date.getHours() * 60 + date.getMinutes()) / (24 * 60)) * 288)
  const clamped = Math.max(0, Math.min(pts.length - 1, idx))
  return pts[clamped].height
}

// ── Tide phase 0–1 (0 = just after low, 0.5 = just after high) ───────────────
export function tidePhase(nowMs: number): number {
  const nowDate = new Date(nowMs)
  const events  = tideEventsForDate(nowDate)
  // also check yesterday/tomorrow for surrounding events
  const yesterday = tideEventsForDate(new Date(nowMs - 86400_000))
  const tomorrow  = tideEventsForDate(new Date(nowMs + 86400_000))
  const all       = [...yesterday, ...events, ...tomorrow].sort((a, b) => a.time.getTime() - b.time.getTime())

  const prev = [...all].reverse().find(e => e.time.getTime() <= nowMs)
  const next  = all.find(e => e.time.getTime() > nowMs)
  if (!prev || !next) return 0.5

  const total   = next.time.getTime() - prev.time.getTime()
  const elapsed = nowMs - prev.time.getTime()
  return elapsed / total
}

// ── Solunar periods for a date — same formula as website ─────────────────────
export interface SolunarPeriod {
  type:  'major' | 'minor'
  start: number  // ms timestamp
  end:   number
  label: string
}

export function solunarForDate(date: Date): SolunarPeriod[] {
  const dayOff = (date.getTime() - CAL_REF) / 86400_000
  const midnight = new Date(date); midnight.setHours(0, 0, 0, 0)
  const ms0 = midnight.getTime()

  const major1H = (((SOL_REF_MAJOR + dayOff * SOL_ADV) % 24) + 24) % 24
  const major2H = (major1H + 12.42) % 24
  const minor1H = ((major1H - 6.21) % 24 + 24) % 24
  const minor2H = (major1H + 6.21) % 24

  const toMs = (h: number) => ms0 + h * 3600_000
  const fmtH = (h: number) => {
    const hr  = Math.floor(h) % 24
    const min = Math.round((h % 1) * 60)
    const ap  = hr >= 12 ? 'PM' : 'AM'
    return `${hr % 12 || 12}:${String(min).padStart(2,'0')} ${ap}`
  }

  return [
    { type: 'minor' as const, start: toMs(minor1H) - 1800_000, end: toMs(minor1H) + 1800_000, label: fmtH(minor1H) },
    { type: 'major' as const, start: toMs(major1H) - 3600_000, end: toMs(major1H) + 3600_000, label: fmtH(major1H) },
    { type: 'minor' as const, start: toMs(minor2H) - 1800_000, end: toMs(minor2H) + 1800_000, label: fmtH(minor2H) },
    { type: 'major' as const, start: toMs(major2H) - 3600_000, end: toMs(major2H) + 3600_000, label: fmtH(major2H) },
  ].sort((a, b) => a.start - b.start)
}

// ── Next solunar major — checks today + tomorrow ──────────────────────────────
export function nextMajorSolunar(nowMs: number): SolunarPeriod | null {
  for (let d = 0; d <= 1; d++) {
    const date    = new Date(nowMs + d * 86400_000)
    const periods = solunarForDate(date)
    const found   = periods.find(p => p.type === 'major' && p.end > nowMs)
    if (found) return found
  }
  return null
}

// ── Formatting helpers ────────────────────────────────────────────────────────
export function fmtTime(d: Date): string {
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

export function fmtHeight(h: number): string {
  return `${h.toFixed(2)} ft`
}
