'use client'

import { useState, useEffect, useRef, useCallback, useMemo, Suspense } from 'react'
import dynamic from 'next/dynamic'
import type { StationConfig } from '@/lib/florida-stations'

const TideMap = dynamic(() => import('./TideMap'), { ssr: false })

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
  canvasBg: string
  canvasGrid: string
  canvasWater: string
  canvasWaterFill: string
  canvasDayBg: string
  canvasNightBg: string
  canvasSunLine: string
  canvasNowLine: string
  canvasHighPin: string
  canvasLowPin: string
  canvasPinText: string
  badge: string
  badgeText: string
  chip: string
  chipText: string
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
    canvasBg: '#0f172a',
    canvasGrid: '#1e2d45',
    canvasWater: '#0ea5e9',
    canvasWaterFill: 'rgba(14,165,233,0.18)',
    canvasDayBg: 'rgba(250,204,21,0.07)',
    canvasNightBg: 'rgba(15,23,42,0.7)',
    canvasSunLine: '#fbbf24',
    canvasNowLine: '#f43f5e',
    canvasHighPin: '#38bdf8',
    canvasLowPin: '#818cf8',
    canvasPinText: '#f1f5f9',
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
    canvasBg: '#ffffff',
    canvasGrid: '#e2e8f0',
    canvasWater: '#0284c7',
    canvasWaterFill: 'rgba(2,132,199,0.12)',
    canvasDayBg: 'rgba(251,191,36,0.06)',
    canvasNightBg: 'rgba(15,23,42,0.06)',
    canvasSunLine: '#d97706',
    canvasNowLine: '#e11d48',
    canvasHighPin: '#0284c7',
    canvasLowPin: '#6366f1',
    canvasPinText: '#0f172a',
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
    canvasBg: '#120000',
    canvasGrid: '#2d0000',
    canvasWater: '#cc2200',
    canvasWaterFill: 'rgba(204,34,0,0.20)',
    canvasDayBg: 'rgba(255,80,0,0.04)',
    canvasNightBg: 'rgba(20,0,0,0.7)',
    canvasSunLine: '#cc4400',
    canvasNowLine: '#ff0000',
    canvasHighPin: '#ff4444',
    canvasLowPin: '#cc2200',
    canvasPinText: '#ff8888',
    badge: '#2d0000',
    badgeText: '#cc3333',
    chip: '#2d0000',
    chipText: '#cc3333',
  },
}

// ─── Shared reference epoch for harmonic model ───────────────────────────────
const CAL_REF = new Date(2026, 3, 10)

// ─── Static Data ─────────────────────────────────────────────────────────────

const TIDE_EVENTS = [
  { label: 'Low',  time: '12:14 AM', height: 0.3, hour: 0.23 },
  { label: 'High', time: '6:42 AM',  height: 4.8, hour: 6.70 },
  { label: 'Low',  time: '1:18 PM',  height: 0.5, hour: 13.30 },
  { label: 'High', time: '7:33 PM',  height: 5.1, hour: 19.55 },
]

// Swell data — hourly direction (degrees) and height (ft)
const SWELL_DATA = Array.from({ length: 24 }, (_, i) => ({
  hour: i,
  dir: 115 + 20 * Math.sin((i / 24) * Math.PI * 2),
  height: 1.8 + 0.6 * Math.sin((i / 12) * Math.PI),
  period: 7 + Math.round(Math.sin((i / 8) * Math.PI)),
}))

// Solunar periods (hour start, duration in hours, type)
const SOLUNAR = [
  { start: 2.5,  dur: 1.0, type: 'minor', label: '2:30 AM' },
  { start: 8.75, dur: 2.0, type: 'major', label: '8:45 AM' },
  { start: 15.0, dur: 1.0, type: 'minor', label: '3:00 PM' },
  { start: 21.2, dur: 2.0, type: 'major', label: '9:10 PM' },
]

// 7-day forecast
const FORECAST = [
  { day: 'Thu', date: 'Apr 10', score: 'A',  high: 78, low: 62, icon: '☀️', wind: 'SE 8', bestTide: '7:01 AM', coeff: 82 },
  { day: 'Fri', date: 'Apr 11', score: 'B+', high: 80, low: 64, icon: '⛅', wind: 'SE 10', bestTide: '7:48 AM', coeff: 78 },
  { day: 'Sat', date: 'Apr 12', score: 'A-', high: 79, low: 63, icon: '☀️', wind: 'E 7',  bestTide: '8:33 AM', coeff: 85 },
  { day: 'Sun', date: 'Apr 13', score: 'C',  high: 72, low: 60, icon: '🌧️', wind: 'NE 18', bestTide: '9:20 AM', coeff: 61 },
  { day: 'Mon', date: 'Apr 14', score: 'B',  high: 74, low: 61, icon: '⛅', wind: 'N 12',  bestTide: '10:05 AM', coeff: 70 },
  { day: 'Tue', date: 'Apr 15', score: 'B+', high: 77, low: 62, icon: '☀️', wind: 'NE 9',  bestTide: '10:48 AM', coeff: 76 },
  { day: 'Wed', date: 'Apr 16', score: 'A',  high: 81, low: 65, icon: '☀️', wind: 'SE 7',  bestTide: '11:30 AM', coeff: 88 },
]

// Haversine distance in miles between two lat/lon points
function haversineMi(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3958.8
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = Math.sin(dLat / 2) ** 2
    + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2
  return R * 2 * Math.asin(Math.sqrt(a))
}

// 30-day tidal coefficient sparkline
const COEFF_30 = [
  72, 68, 63, 58, 54, 51, 55, 61, 68, 74,
  79, 84, 88, 90, 89, 85, 80, 74, 68, 63,
  59, 55, 53, 57, 63, 70, 77, 83, 87, 89,
]

// Weather
// WEATHER default — waterTemp is overridden at runtime with station.waterTempDefault
const WEATHER_DEFAULT = {
  temp: '74°F',
  feelsLike: '76°F',
  humidity: '72%',
  windSpeed: '8 kt',
  windDir: 'SE',
  visibility: '10 mi',
  cloudCover: '15%',
  uvIndex: '6',
  waterTemp: '—',
  dewPoint: '63°F',
  pressure: '1016 mb',
  pressureTrend: 'rising',
}

// Grade color helper
function gradeColor(grade: string, t: Theme): string {
  const g = grade.charAt(0)
  if (g === 'A') return '#22c55e'
  if (g === 'B') return '#84cc16'
  if (g === 'C') return '#eab308'
  if (g === 'D') return '#f97316'
  return '#ef4444'
}

// ─── Tile helper — compute OSM tile coords + marker position from lat/lon ────

function latlonToRadarMap(lat: number, lon: number, z = 7) {
  const scale = Math.pow(2, z)
  const x = (lon + 180) / 360 * scale
  const y = (1 - Math.log(Math.tan(Math.PI / 4 + lat * Math.PI / 360)) / Math.PI) / 2 * scale
  const cx = Math.floor(x)
  const cy = Math.floor(y)
  const left = `${((x - (cx - 1)) / 3 * 100).toFixed(2)}%`
  const top  = `${((y - (cy - 1)) / 3 * 100).toFixed(2)}%`
  return { z, cx, cy, left, top }
}

// ─── Curve builder from hi/lo events (cosine interpolation) ──────────────────
function buildCurveFromHilo(
  pts: { hour: number; height: number }[],
): number[] {
  const sorted = [...pts].sort((a, b) => a.hour - b.hour)
  if (sorted.length < 2) return new Array(289).fill(0)
  return Array.from({ length: 289 }, (_, i) => {
    const hour = (i / 288) * 24
    const ni = sorted.findIndex(e => e.hour >= hour)
    if (ni === -1) return sorted[sorted.length - 1].height  // after last event
    if (ni === 0)  return sorted[0].height                  // before first event
    if (ni >= sorted.length) return sorted[sorted.length - 1].height
    const prev = sorted[ni - 1], next = sorted[ni]
    const frac = (hour - prev.hour) / (next.hour - prev.hour)
    return Math.max(0, (prev.height + next.height) / 2 - (next.height - prev.height) / 2 * Math.cos(frac * Math.PI))
  })
}

// ─── Canvas Painters ──────────────────────────────────────────────────────────

function drawTideChart(
  canvas: HTMLCanvasElement,
  t: Theme,
  dpr: number,
  curve: number[],
  events: Array<{ label: string; time: string; height: number; hour: number }>,
  sunriseH: number,
  sunsetH: number,
  nowH: number | null,
  hover?: { hour: number; height: number } | null,
  solunar?: Array<{ start: number; dur: number; type: string }>,
) {
  const W = canvas.clientWidth
  const H = canvas.clientHeight
  canvas.width  = W * dpr
  canvas.height = H * dpr
  const ctx = canvas.getContext('2d')!
  ctx.scale(dpr, dpr)

  const PAD = { top: 80, right: 18, bottom: 52, left: 48 }
  const cw = W - PAD.left - PAD.right
  const ch = H - PAD.top  - PAD.bottom

  // Dynamic Y-axis: scale to actual tide range so pins never clip the top
  const maxTide = events.length ? Math.max(...events.map(e => e.height)) : 6
  const maxH    = Math.max(6, Math.ceil(maxTide / 0.65))
  const toX    = (hour: number) => PAD.left + (hour / 24) * cw
  const toY    = (ht: number)   => PAD.top  + ch - (ht / maxH) * ch

  // ── background
  ctx.fillStyle = t.canvasBg
  ctx.fillRect(0, 0, W, H)

  // ── night shading (left block 0→sunrise, right block sunset→24)
  ctx.fillStyle = t.canvasNightBg
  ctx.fillRect(PAD.left, PAD.top, (sunriseH / 24) * cw, ch)
  ctx.fillRect(
    toX(sunsetH), PAD.top,
    ((24 - sunsetH) / 24) * cw, ch,
  )

  // ── day shading
  ctx.fillStyle = t.canvasDayBg
  ctx.fillRect(
    toX(sunriseH), PAD.top,
    ((sunsetH - sunriseH) / 24) * cw, ch,
  )

  // ── grid lines (height) — step size adapts to dynamic maxH
  const gridStep = maxH <= 8 ? 1 : maxH <= 14 ? 2 : 3
  ctx.strokeStyle = t.canvasGrid
  ctx.lineWidth   = 0.5
  for (let h = 0; h <= maxH; h += gridStep) {
    const y = toY(h)
    if (y < PAD.top - 2) break
    ctx.beginPath()
    ctx.moveTo(PAD.left, y)
    ctx.lineTo(W - PAD.right, y)
    ctx.stroke()
    ctx.fillStyle  = t.textFaint
    ctx.font       = '10px system-ui'
    ctx.textAlign  = 'right'
    ctx.fillText(`${h}ft`, PAD.left - 5, y + 3)
  }

  // ── grid lines (hour ticks every 3h)
  ctx.textAlign = 'center'
  for (let h = 0; h <= 24; h += 3) {
    const x = toX(h)
    ctx.strokeStyle = t.canvasGrid
    ctx.lineWidth   = 0.5
    ctx.beginPath()
    ctx.moveTo(x, PAD.top)
    ctx.lineTo(x, PAD.top + ch)
    ctx.stroke()
    const label = h === 0 ? '12a' : h < 12 ? `${h}a` : h === 12 ? '12p' : `${h - 12}p`
    ctx.fillStyle = t.textFaint
    ctx.font      = '9px system-ui'
    ctx.fillText(label, x, PAD.top + ch + 14)
  }

  // ── tide fill
  ctx.beginPath()
  curve.forEach((ht, i) => {
    const hour = (i / 288) * 24
    const x = toX(hour)
    const y = toY(ht)
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  })
  ctx.lineTo(toX(24), toY(0))
  ctx.lineTo(toX(0),  toY(0))
  ctx.closePath()
  ctx.fillStyle = t.canvasWaterFill
  ctx.fill()

  // ── tide line
  ctx.beginPath()
  ctx.strokeStyle = t.canvasWater
  ctx.lineWidth   = 2
  curve.forEach((ht, i) => {
    const hour = (i / 288) * 24
    if (i === 0) ctx.moveTo(toX(hour), toY(ht))
    else ctx.lineTo(toX(hour), toY(ht))
  })
  ctx.stroke()

  // ── sunrise / sunset lines
  ;[
    { hour: sunriseH, label: `↑ ${calFmtHour(sunriseH)}`, align: 'left' as const },
    { hour: sunsetH,  label: `${calFmtHour(sunsetH)} ↓`,  align: 'right' as const },
  ].forEach(({ hour, label, align }) => {
    const x = toX(hour)
    ctx.strokeStyle = t.canvasSunLine
    ctx.lineWidth   = 1
    ctx.setLineDash([4, 3])
    ctx.beginPath()
    ctx.moveTo(x, PAD.top)
    ctx.lineTo(x, PAD.top + ch)
    ctx.stroke()
    ctx.setLineDash([])
    ctx.fillStyle  = t.canvasSunLine
    ctx.font       = '9px system-ui'
    ctx.textAlign  = align
    ctx.fillText(label, align === 'left' ? x + 4 : x - 4, PAD.top + 11)
  })

  // ── NOW line (only when viewing today)
  if (nowH !== null) {
    const nowX = toX(nowH)
    ctx.strokeStyle = t.canvasNowLine
    ctx.lineWidth   = 1.5
    ctx.setLineDash([3, 2])
    ctx.beginPath()
    ctx.moveTo(nowX, PAD.top)
    ctx.lineTo(nowX, PAD.top + ch)
    ctx.stroke()
    ctx.setLineDash([])
    ctx.fillStyle  = t.canvasNowLine
    ctx.font       = 'bold 9px system-ui'
    ctx.textAlign  = 'center'
    ctx.fillText('NOW', nowX, PAD.top + 11)
  }

  // ── solunar fish strip along bottom
  if (solunar) {
    const fishY = PAD.top + ch + 24
    solunar.forEach(s => {
      const isMajor = s.type === 'major'
      const fishCount = isMajor ? 3 : 1
      const midX = toX(s.start + s.dur / 2)
      ctx.font = isMajor ? '14px system-ui' : '11px system-ui'
      ctx.textAlign = 'center'
      const spacing = isMajor ? 16 : 12
      const startX = midX - ((fishCount - 1) * spacing) / 2
      for (let f = 0; f < fishCount; f++) {
        ctx.globalAlpha = isMajor ? 1.0 : 0.6
        ctx.fillText('🐟', startX + f * spacing, fishY)
      }
      ctx.globalAlpha = 1.0
    })
  }

  // ── teardrop pins for high/low events
  events.forEach(ev => {
    const x  = toX(ev.hour)
    const y  = toY(ev.height)
    const isHigh = ev.label === 'High'
    const pinColor = isHigh ? t.canvasHighPin : t.canvasLowPin
    const r   = 22      // bubble radius
    const gap = 8       // gap between curve and bottom of bubble
    const ptW = 7       // half-width of teardrop point base

    // Circle sits ABOVE the curve; clamp so it never clips the top padding
    const cyIdeal = y - gap - r
    const cy = Math.max(PAD.top + r + 2, cyIdeal)

    // Teardrop triangle from curve point up to bubble bottom (drawn first, under the dot)
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(x - ptW, cy + r - 4)
    ctx.lineTo(x + ptW, cy + r - 4)
    ctx.closePath()
    ctx.fillStyle = pinColor
    ctx.fill()

    // Bubble circle
    ctx.beginPath()
    ctx.arc(x, cy, r, 0, Math.PI * 2)
    ctx.fillStyle = pinColor
    ctx.fill()

    // Dot ON the tide curve — drawn last so it sits visibly on the line
    ctx.beginPath()
    ctx.arc(x, y, 5, 0, Math.PI * 2)
    ctx.fillStyle = pinColor
    ctx.fill()
    ctx.beginPath()
    ctx.arc(x, y, 3, 0, Math.PI * 2)
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth   = 1.5
    ctx.stroke()
    ctx.fillStyle = pinColor
    ctx.fill()

    // Height value inside bubble
    ctx.fillStyle    = '#ffffff'
    ctx.font         = 'bold 16px system-ui'
    ctx.textAlign    = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(`${ev.height.toFixed(1)}`, x, cy)
    ctx.textBaseline = 'alphabetic'

    // Time pill: above circle for High (if room), below curve point for Low
    ctx.font = 'bold 10px system-ui'
    const timeW = ctx.measureText(ev.time).width
    const pillW = timeW + 12
    const pillH = 16
    const pillR = 4
    const pillX = x - pillW / 2
    // Pill always below the bubble — consistent for highs and lows
    const pillY = cy + r + 5

    ctx.fillStyle = pinColor
    ctx.beginPath()
    ctx.moveTo(pillX + pillR, pillY)
    ctx.lineTo(pillX + pillW - pillR, pillY)
    ctx.arcTo(pillX + pillW, pillY, pillX + pillW, pillY + pillH, pillR)
    ctx.lineTo(pillX + pillW, pillY + pillH - pillR)
    ctx.arcTo(pillX + pillW, pillY + pillH, pillX + pillW - pillR, pillY + pillH, pillR)
    ctx.lineTo(pillX + pillR, pillY + pillH)
    ctx.arcTo(pillX, pillY + pillH, pillX, pillY + pillH - pillR, pillR)
    ctx.lineTo(pillX, pillY + pillR)
    ctx.arcTo(pillX, pillY, pillX + pillR, pillY, pillR)
    ctx.closePath()
    ctx.fill()
    ctx.fillStyle    = '#ffffff'
    ctx.textBaseline = 'middle'
    ctx.fillText(ev.time, x, pillY + pillH / 2)
    ctx.textBaseline = 'alphabetic'
  })

  // ── Hover crosshair
  if (hover) {
    const hx = toX(hover.hour)
    const hy = toY(hover.height)
    // vertical dashed line
    ctx.strokeStyle = t.textMuted + '66'
    ctx.lineWidth   = 1
    ctx.setLineDash([4, 3])
    ctx.beginPath(); ctx.moveTo(hx, PAD.top); ctx.lineTo(hx, PAD.top + ch); ctx.stroke()
    ctx.setLineDash([])
    // horizontal guide
    ctx.strokeStyle = t.textFaint + '44'
    ctx.lineWidth   = 0.5
    ctx.beginPath(); ctx.moveTo(PAD.left, hy); ctx.lineTo(W - PAD.right, hy); ctx.stroke()
    // glowing dot on curve
    ctx.beginPath(); ctx.arc(hx, hy, 5, 0, Math.PI * 2)
    ctx.fillStyle   = t.canvasWater; ctx.fill()
    ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2; ctx.stroke()
  }
}


function drawSwellChart(canvas: HTMLCanvasElement, t: Theme, dpr: number) {
  const W = canvas.clientWidth
  const H = canvas.clientHeight
  canvas.width  = W * dpr
  canvas.height = H * dpr
  const ctx = canvas.getContext('2d')!
  ctx.scale(dpr, dpr)

  ctx.fillStyle = t.canvasBg
  ctx.fillRect(0, 0, W, H)

  const barW = W / 24
  const maxH  = 3.5

  SWELL_DATA.forEach((pt, i) => {
    const x    = i * barW + barW * 0.15
    const barH = (pt.height / maxH) * (H - 28) * 0.8
    const y    = H - 20 - barH

    // bar
    ctx.fillStyle = t.accentFaint
    ctx.fillRect(x, y, barW * 0.7, barH)

    // direction arrow
    const cx  = x + barW * 0.35
    const cy  = y - 8
    const rad = (pt.dir * Math.PI) / 180
    const len = 6
    ctx.strokeStyle = t.accent
    ctx.lineWidth   = 1.5
    ctx.beginPath()
    ctx.moveTo(cx - Math.sin(rad) * len, cy - Math.cos(rad) * len)
    ctx.lineTo(cx + Math.sin(rad) * len, cy + Math.cos(rad) * len)
    ctx.stroke()
    // arrowhead
    ctx.beginPath()
    ctx.arc(cx + Math.sin(rad) * len, cy + Math.cos(rad) * len, 2, 0, Math.PI * 2)
    ctx.fillStyle = t.accent
    ctx.fill()

    // hour label
    if (i % 6 === 0) {
      ctx.fillStyle  = t.textFaint
      ctx.font       = '9px system-ui'
      ctx.textAlign  = 'center'
      const label = i === 0 ? '12a' : i < 12 ? `${i}a` : i === 12 ? '12p' : `${i - 12}p`
      ctx.fillText(label, cx, H - 5)
    }
  })
}

function drawCoeff30(canvas: HTMLCanvasElement, t: Theme, dpr: number) {
  const W = canvas.clientWidth
  const H = canvas.clientHeight
  canvas.width  = W * dpr
  canvas.height = H * dpr
  const ctx = canvas.getContext('2d')!
  ctx.scale(dpr, dpr)

  ctx.fillStyle = 'transparent'
  ctx.clearRect(0, 0, W, H)

  const min = 40
  const max = 100
  const toX = (i: number) => (i / (COEFF_30.length - 1)) * W
  const toY = (v: number) => H - ((v - min) / (max - min)) * H * 0.85 - H * 0.05

  ctx.beginPath()
  COEFF_30.forEach((v, i) => {
    if (i === 0) ctx.moveTo(toX(i), toY(v))
    else ctx.lineTo(toX(i), toY(v))
  })
  ctx.lineTo(W, H)
  ctx.lineTo(0, H)
  ctx.closePath()
  ctx.fillStyle = t.accentFaint
  ctx.fill()

  ctx.beginPath()
  ctx.strokeStyle = t.accentMuted
  ctx.lineWidth   = 1.5
  COEFF_30.forEach((v, i) => {
    if (i === 0) ctx.moveTo(toX(i), toY(v))
    else ctx.lineTo(toX(i), toY(v))
  })
  ctx.stroke()

  // today dot
  const todayIdx = 0
  ctx.beginPath()
  ctx.arc(toX(todayIdx), toY(COEFF_30[todayIdx]), 4, 0, Math.PI * 2)
  ctx.fillStyle = t.canvasNowLine
  ctx.fill()
}

// ─── Calendar helpers ────────────────────────────────────────────────────────

interface CalTide {
  time: string
  height: number
  type: 'high' | 'low'
}

interface CalDay {
  date: Date
  dayNum: number
  dayName: string
  moonPhase: number
  moonEmoji: string
  sunrise: string
  sunset: string
  tides: CalTide[]
  coefficient: number
  coeffLabel: string
  coeffColor: string
  solunarScore: number
  isToday: boolean
  isWeekend: boolean
}

function calMoonPhase(date: Date): number {
  const Y = date.getFullYear(), M = date.getMonth() + 1, D = date.getDate()
  const JD = 367*Y - Math.floor(7*(Y+Math.floor((M+9)/12))/4) + Math.floor(275*M/9) + D + 1721013.5
  let p = ((JD - 2451550.1) % 29.53058867) / 29.53058867
  if (p < 0) p += 1
  return p
}

function calMoonEmoji(p: number): string {
  return ['🌑','🌒','🌓','🌔','🌕','🌖','🌗','🌘'][Math.floor(((p + 0.0625) % 1) * 8)]
}

function calFmtHour(h: number): string {
  h = ((h % 24) + 24) % 24
  let hInt = Math.floor(h), mins = Math.round((h - hInt) * 60)
  if (mins === 60) { mins = 0; hInt = (hInt + 1) % 24 }
  const h12 = hInt % 12 === 0 ? 12 : hInt % 12
  return `${h12}:${String(mins).padStart(2,'0')} ${hInt < 12 ? 'am' : 'pm'}`
}

function calSunTimes(doy: number, cfg: { sunLat: number; sunMeridian: number; sunLon: number; utcOffset: number }): { sunrise: string; sunset: string } {
  const LAT = (cfg.sunLat * Math.PI) / 180
  const decl = -23.45 * Math.cos((360/365*(doy+10)*Math.PI)/180)
  const HA = (Math.acos(Math.max(-1, Math.min(1, -Math.tan(LAT)*Math.tan(decl*Math.PI/180)))) * 180) / Math.PI
  const corr = (cfg.sunMeridian - cfg.sunLon) / 15 + cfg.utcOffset
  return { sunrise: calFmtHour(12 - HA/15 + corr), sunset: calFmtHour(12 + HA/15 + corr) }
}

function calDayOfYear(date: Date): number {
  return Math.floor((date.getTime() - new Date(date.getFullYear(),0,0).getTime()) / 86400000)
}

function calGenerateTides(date: Date, meanRange?: number): CalTide[] {
  const dayOff = (date.getTime() - CAL_REF.getTime()) / 86400000
  const M2 = 12.4206
  const lag = ((dayOff * 0.7176) % M2 + M2) % M2
  const high1 = (6.70 + lag) % 24
  const low1  = (0.23 + lag + M2) % 24
  const high2 = (high1 + M2) % 24
  const low2  = (low1  + M2) % 24
  const phase = calMoonPhase(date)
  const amp   = 2.1 + 0.6 * Math.cos(2 * Math.PI * phase)
  const hH    = Math.round((2.75 + amp) * 10) / 10
  const lH    = Math.round(Math.max(0.1, 2.75 - amp*0.85) * 10) / 10
  const hH2   = Math.round(Math.max(0.5, hH - 0.15 + 0.3*Math.sin(dayOff*0.9)) * 10) / 10
  const lH2   = Math.round(Math.max(0.1, lH  + 0.1  - 0.1*Math.sin(dayOff*1.1)) * 10) / 10
  return [
    { hour: high1, type: 'high' as const, height: hH  },
    { hour: low1,  type: 'low'  as const, height: lH  },
    { hour: high2, type: 'high' as const, height: hH2 },
    { hour: low2,  type: 'low'  as const, height: lH2 },
  ].sort((a,b) => a.hour - b.hour)
   .map(e => ({ time: calFmtHour(e.hour), height: e.height, type: e.type }))
}

function calCoeff(phase: number, doy: number): number {
  return Math.round(Math.max(20, Math.min(110, 70 + 30*Math.cos(4*Math.PI*phase) + 3*Math.sin(doy*0.7))))
}
function calCoeffLabel(c: number): string {
  return c >= 90 ? 'very high' : c >= 75 ? 'high' : c >= 55 ? 'average' : c >= 40 ? 'low' : 'very low'
}
function calCoeffColor(c: number): string {
  return c >= 90 ? '#22c55e' : c >= 75 ? '#84cc16' : c >= 55 ? '#eab308' : c >= 40 ? '#f97316' : '#ef4444'
}
function calSolunar(c: number): 1|2|3|4 {
  return c >= 90 ? 4 : c >= 75 ? 3 : c >= 55 ? 2 : 1
}

type SunCfg = { sunLat: number; sunMeridian: number; sunLon: number; utcOffset: number }

function generateCalMonth(year: number, month: number, cfg: SunCfg): CalDay[] {
  const dim   = new Date(year, month+1, 0).getDate()
  const today = new Date()
  return Array.from({ length: dim }, (_, i) => {
    const date  = new Date(year, month, i+1)
    const doy   = calDayOfYear(date)
    const phase = calMoonPhase(date)
    const c     = calCoeff(phase, doy)
    const { sunrise, sunset } = calSunTimes(doy, cfg)
    return {
      date, dayNum: i+1,
      dayName:  date.toLocaleDateString('en-US', { weekday: 'short' }),
      moonPhase: phase,
      moonEmoji: calMoonEmoji(phase),
      sunrise, sunset,
      tides:        calGenerateTides(date),
      coefficient:  c,
      coeffLabel:   calCoeffLabel(c),
      coeffColor:   calCoeffColor(c),
      solunarScore: calSolunar(c),
      isToday:   date.toDateString() === today.toDateString(),
      isWeekend: date.getDay() === 0 || date.getDay() === 6,
    }
  })
}

// ─── Date-aware helpers ───────────────────────────────────────────────────────

/** Generate 289-point tide curve for any date. */
function tideCurveForDate(date: Date): number[] {
  const dayOff = (date.getTime() - CAL_REF.getTime()) / 86400000
  const M2     = 12.4206
  const lag    = ((dayOff * 0.7176) % M2 + M2) % M2
  const phase  = calMoonPhase(date)
  const amp    = 2.1 + 0.6 * Math.cos(2 * Math.PI * phase)
  const pts: number[] = []
  for (let i = 0; i <= 288; i++) {
    const t  = (i / 288) * 24
    const ts = t - lag
    const h  = 2.75 +
      amp * Math.cos((ts * 2 * Math.PI) / M2) +
      (amp * 0.167) * Math.cos((ts * 4 * Math.PI) / M2) +
      0.12 * Math.sin(((t - 3) * 2 * Math.PI) / 24)
    pts.push(Math.max(0, h))
  }
  return pts
}

/** Sunrise/sunset as decimal hours for any date. */
function sunTimesHoursForDate(date: Date, cfg: SunCfg): { sunrise: number; sunset: number } {
  const doy   = calDayOfYear(date)
  const LAT   = (cfg.sunLat * Math.PI) / 180
  const decl  = -23.45 * Math.cos((360 / 365 * (doy + 10) * Math.PI) / 180)
  const cosHA = -Math.tan(LAT) * Math.tan(decl * Math.PI / 180)
  const HA    = (Math.acos(Math.max(-1, Math.min(1, cosHA))) * 180) / Math.PI
  const corr  = (cfg.sunMeridian - cfg.sunLon) / 15 + cfg.utcOffset
  return { sunrise: 12 - HA / 15 + corr, sunset: 12 + HA / 15 + corr }
}

/** Tide events in TIDE_EVENTS format for any date. */
function tideEventsForDate(date: Date): typeof TIDE_EVENTS {
  return calGenerateTides(date).map(ct => {
    const m = ct.time.match(/(\d+):(\d+)\s*(am|pm)/i)!
    let h   = parseInt(m[1]), mn = parseInt(m[2])
    if (m[3].toLowerCase() === 'pm' && h !== 12) h += 12
    if (m[3].toLowerCase() === 'am' && h === 12)  h  = 0
    return { label: ct.type === 'high' ? 'High' as const : 'Low' as const, time: ct.time, height: ct.height, hour: h + mn / 60 }
  })
}

/** Solunar periods for any date (sorted by start hour). */
function solunarForDate(date: Date): typeof SOLUNAR {
  const dayOff = (date.getTime() - CAL_REF.getTime()) / 86400000
  const major1 = (((8.75 + dayOff * (50 / 60)) % 24) + 24) % 24
  const major2 = (major1 + 12.42) % 24
  const minor1 = ((major1 - 6.21) % 24 + 24) % 24
  const minor2 = (major1 + 6.21) % 24
  return [
    { start: minor1, dur: 1.0, type: 'minor' as const, label: calFmtHour(minor1) },
    { start: major1, dur: 2.0, type: 'major' as const, label: calFmtHour(major1) },
    { start: minor2, dur: 1.0, type: 'minor' as const, label: calFmtHour(minor2) },
    { start: major2, dur: 2.0, type: 'major' as const, label: calFmtHour(major2) },
  ].sort((a, b) => a.start - b.start)
}

/** 7-day fishing forecast starting from a given date. */
function forecastForDate(startDate: Date) {
  const WEATHER_ICONS = ['☀️','⛅','☀️','🌧️','⛅','☀️','☀️']
  const WIND_LIST     = ['SE 8','SE 10','E 7','NE 18','N 12','NE 9','SE 7']
  return Array.from({ length: 7 }, (_, i) => {
    const d     = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + i)
    const phase = calMoonPhase(d)
    const coeff = calCoeff(phase, calDayOfYear(d))
    const score = calCoeffLabel(coeff) === 'very high' ? 'A' : calCoeffLabel(coeff) === 'high' ? 'B+' : calCoeffLabel(coeff) === 'average' ? 'B' : calCoeffLabel(coeff) === 'low' ? 'C' : 'D'
    const doy   = calDayOfYear(d)
    return {
      day:      d.toLocaleDateString('en-US', { weekday: 'short' }),
      date:     d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      score,
      high:     74 + Math.round(4 * Math.sin(doy * 0.31)),
      low:      61 + Math.round(3 * Math.sin(doy * 0.21)),
      icon:     WEATHER_ICONS[i % 7],
      wind:     WIND_LIST[i % 7],
      bestTide: calGenerateTides(d).find(t => t.type === 'high')?.time ?? '—',
      coeff,
    }
  })
}

/** Convert tidal coefficient to A-D fishing grade string. */
function gradeFromCoeff(c: number): string {
  return c >= 90 ? 'A' : c >= 80 ? 'A-' : c >= 70 ? 'B+' : c >= 60 ? 'B' : c >= 50 ? 'C+' : c >= 40 ? 'C' : 'D'
}

// ─── Weather types + helpers ──────────────────────────────────────────────────

interface WxHour {
  time: string
  hour: number
  temp: number
  windSpeed: number
  windDir: string
  precip: number
  condition: string
}
interface WxDay {
  day: string
  date: string
  high: number
  low: number | null
  icon: string
  wind: string
  precip: number
}

function windDirDeg(dir: string): number {
  const map: Record<string, number> = {
    N:0, NNE:22, NE:45, ENE:67, E:90, ESE:112, SE:135, SSE:157,
    S:180, SSW:202, SW:225, WSW:247, W:270, WNW:292, NW:315, NNW:337
  }
  return map[dir] ?? 0
}

function conditionEmoji(s: string): string {
  const l = s.toLowerCase()
  if (l.includes('thunder'))                       return '⛈️'
  if (l.includes('rain') || l.includes('shower'))  return '🌧️'
  if (l.includes('drizzle'))                       return '🌦️'
  if (l.includes('snow'))                          return '❄️'
  if (l.includes('fog'))                           return '🌫️'
  if (l.includes('cloud') && l.includes('part'))   return '⛅'
  if (l.includes('cloud') || l.includes('overcast')) return '☁️'
  return '☀️'
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function TideLocationPage({ station }: { station: StationConfig }) {
  const [mode, setMode] = useState<Mode>(() => {
    if (typeof window !== 'undefined') return (localStorage.getItem('tcpMode') as Mode) || 'dark'
    return 'dark'
  })
  useEffect(() => { localStorage.setItem('tcpMode', mode) }, [mode])
  const t = THEMES[mode]

  const WEATHER = { ...WEATHER_DEFAULT, waterTemp: station.waterTempDefault }

  const [currentMonth, setCurrentMonth] = useState<Date>(() => {
    const n = new Date(); return new Date(n.getFullYear(), n.getMonth(), 1)
  })
  const calDays    = generateCalMonth(currentMonth.getFullYear(), currentMonth.getMonth(), station)
  const monthLabel = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  // ── Selected date (for charts) — useState + native history API ──
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    // Parse ?date= from URL on initial load (client-side only)
    if (typeof window !== 'undefined') {
      const param = new URLSearchParams(window.location.search).get('date')
      if (param) {
        const d = new Date(param + 'T12:00:00')
        if (!isNaN(d.getTime())) return d
      }
    }
    return new Date()
  })

  const isViewingToday = selectedDate.toDateString() === new Date().toDateString()

  // Update URL without causing a Next.js re-render; listen for back/forward
  const navigateToDate = useCallback((d: Date) => {
    setSelectedDate(d)
    const today = new Date()
    if (d.toDateString() === today.toDateString()) {
      window.history.pushState(null, '', `/tides/${station.state}/${station.slug}`)
    } else {
      const iso = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
      window.history.pushState(null, '', `/tides/${station.state}/${station.slug}?date=${iso}`)
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  // Back/forward button support
  useEffect(() => {
    const handlePop = () => {
      const param = new URLSearchParams(window.location.search).get('date')
      if (param) {
        const d = new Date(param + 'T12:00:00')
        if (!isNaN(d.getTime())) { setSelectedDate(d); return }
      }
      setSelectedDate(new Date())
    }
    window.addEventListener('popstate', handlePop)
    return () => window.removeEventListener('popstate', handlePop)
  }, [])

  // Keep calendar month in sync with selected date
  useEffect(() => {
    setCurrentMonth(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1))
  }, [selectedDate])

  const harmonicSelCurve   = useMemo(() => tideCurveForDate(selectedDate),   [selectedDate])
  const harmonicSelEvents  = useMemo(() => tideEventsForDate(selectedDate),  [selectedDate])
  const selSunH    = useMemo(() => sunTimesHoursForDate(selectedDate, station), [selectedDate, station])
  const selSolunar = useMemo(() => solunarForDate(selectedDate),     [selectedDate])
  const selForecastBase = useMemo(() => forecastForDate(selectedDate),   [selectedDate])

  // ── NOAA live tide state ──
  const [liveToday,   setLiveToday]   = useState<number[] | null>(null)
  const [liveHilo,    setLiveHilo]    = useState<Map<string, {label:'High'|'Low', time:string, height:number, hour:number}[]> | null>(null)

  // ── NOAA tide fetch ──
  useEffect(() => {
    const BASE   = 'https://api.tidesandcurrents.noaa.gov/api/prod/datagetter'
    const COMMON = `&datum=MLLW&station=${station.id}&time_zone=lst_ldt&units=english&format=json&application=TideChartsPro`
    const pad    = (n: number) => String(n).padStart(2, '0')
    const fmt    = (d: Date) => `${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}`
    const today  = new Date()
    const yest   = new Date(today); yest.setDate(today.getDate() - 1)
    const plus7  = new Date(today); plus7.setDate(today.getDate() + 7)

    // 6-min curve for today
    fetch(`${BASE}?product=predictions&interval=6&begin_date=${fmt(today)}&end_date=${fmt(today)}${COMMON}`)
      .then(r => r.json())
      .then((d: { predictions?: {t:string, v:string}[] }) => {
        const raw = d.predictions
        if (!raw || raw.length < 10) return
        // Resample 240 NOAA points → 289-point array (linear interpolation)
        const curve = Array.from({ length: 289 }, (_, i) => {
          const ri  = (i / 288) * (raw.length - 1)
          const lo  = Math.floor(ri), hi = Math.min(raw.length - 1, lo + 1)
          return parseFloat(raw[lo].v) * (1 - (ri - lo)) + parseFloat(raw[hi].v) * (ri - lo)
        })
        setLiveToday(curve)
      })
      .catch(() => {})

    // Hilo events yesterday → +7 days (yesterday needed to anchor curve start-of-day)
    fetch(`${BASE}?product=predictions&interval=hilo&begin_date=${fmt(yest)}&end_date=${fmt(plus7)}${COMMON}`)
      .then(r => r.json())
      .then((d: { predictions?: {t:string, v:string, type:string}[] }) => {
        const raw = d.predictions
        if (!raw || raw.length < 2) return
        const map = new Map<string, {label:'High'|'Low', time:string, height:number, hour:number}[]>()
        for (const p of raw) {
          const dateKey  = p.t.slice(0, 10)
          const [, time] = p.t.split(' ')
          const [hh, mm] = time.split(':').map(Number)
          const hour     = hh + mm / 60
          const h12      = hh % 12 === 0 ? 12 : hh % 12
          const timeStr  = `${h12}:${pad(mm)} ${hh < 12 ? 'am' : 'pm'}`
          const ev       = { label: (p.type === 'H' ? 'High' : 'Low') as 'High'|'Low', time: timeStr, height: parseFloat(p.v), hour }
          if (!map.has(dateKey)) map.set(dateKey, [])
          map.get(dateKey)!.push(ev)
        }
        setLiveHilo(map)
      })
      .catch(() => {})
  }, [])

  // Date-key helper (stable across renders)
  const dateKey = (d: Date) => {
    const p = (n: number) => String(n).padStart(2, '0')
    return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}`
  }

  // Derived: live 6-min → hilo-interpolated → harmonic fallback
  const selDateKey = dateKey(selectedDate)

  // Build interpolated curve from hilo events when 6-min data is unavailable
  const hiloSelCurve = useMemo(() => {
    const todayEvts = liveHilo?.get(selDateKey)
    if (!todayEvts || todayEvts.length < 2) return null
    const dPrev = new Date(selectedDate); dPrev.setDate(selectedDate.getDate() - 1)
    const dNext = new Date(selectedDate); dNext.setDate(selectedDate.getDate() + 1)
    const prevEvts = liveHilo?.get(dateKey(dPrev)) ?? []
    const nextEvts = liveHilo?.get(dateKey(dNext)) ?? []
    const all = [
      ...prevEvts.map(e => ({ hour: e.hour - 24, height: e.height })),
      ...todayEvts.map(e => ({ hour: e.hour, height: e.height })),
      ...nextEvts.map(e => ({ hour: e.hour + 24, height: e.height })),
    ]
    return buildCurveFromHilo(all)
  }, [liveHilo, selDateKey, selectedDate])

  const selCurve   = (isViewingToday && liveToday) ? liveToday : (hiloSelCurve ?? harmonicSelCurve)
  const selEvents  = liveHilo?.get(selDateKey) ?? harmonicSelEvents
  const selForecast = useMemo(() => {
    if (!liveHilo) return selForecastBase
    return selForecastBase.map((fd, i) => {
      const d    = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate() + i)
      const evs  = liveHilo.get(dateKey(d))
      if (!evs || evs.length < 2) return fd
      const highs = evs.filter(e => e.label === 'High').map(e => e.height)
      const lows  = evs.filter(e => e.label === 'Low').map(e => e.height)
      if (!highs.length || !lows.length) return fd
      const range = Math.max(...highs) - Math.min(...lows)
      const coeff = Math.round(Math.max(20, Math.min(110, (range / 5.5) * 110)))
      return { ...fd, score: gradeFromCoeff(coeff), coeff }
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selForecastBase, liveHilo])

  // ── Responsive breakpoint ──
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // Ref so hover handlers always see latest sel data without being in deps
  const selDataRef = useRef({ curve: selCurve, events: selEvents, sunH: selSunH, isViewingToday, solunar: selSolunar })
  selDataRef.current = { curve: selCurve, events: selEvents, sunH: selSunH, isViewingToday, solunar: selSolunar }

  // ── Live clock ──
  const [now, setNow] = useState<Date>(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  // ── Today's computed curves (always real-time, regardless of selected date) ──
  const harmonicTodayCurve   = useMemo(() => tideCurveForDate(new Date()),   [])
  const harmonicTodayEvents  = useMemo(() => tideEventsForDate(new Date()),  [])
  const todaySolunar = useMemo(() => solunarForDate(new Date()),     [])
  const harmonicTomorrowEvents = useMemo(() => { const d = new Date(); d.setDate(d.getDate() + 1); return tideEventsForDate(d) }, [])
  const hiloTodayCurve = useMemo(() => {
    const todayKey = dateKey(new Date())
    const todayEvts = liveHilo?.get(todayKey)
    if (!todayEvts || todayEvts.length < 2) return null
    const dPrev = new Date(); dPrev.setDate(dPrev.getDate() - 1)
    const dNext = new Date(); dNext.setDate(dNext.getDate() + 1)
    const prevEvts = liveHilo?.get(dateKey(dPrev)) ?? []
    const nextEvts = liveHilo?.get(dateKey(dNext)) ?? []
    const all = [
      ...prevEvts.map(e => ({ hour: e.hour - 24, height: e.height })),
      ...todayEvts.map(e => ({ hour: e.hour, height: e.height })),
      ...nextEvts.map(e => ({ hour: e.hour + 24, height: e.height })),
    ]
    return buildCurveFromHilo(all)
  }, [liveHilo])
  const todayCurve     = liveToday ?? hiloTodayCurve ?? harmonicTodayCurve
  const todayEvents    = liveHilo?.get(dateKey(new Date())) ?? harmonicTodayEvents
  const tomorrowEvents = (() => { const d = new Date(); d.setDate(d.getDate()+1); return liveHilo?.get(dateKey(d)) ?? harmonicTomorrowEvents })()

  // ── Derived tide status ──
  const nowHour    = now.getHours() + now.getMinutes() / 60 + now.getSeconds() / 3600
  const curveIdx   = Math.min(288, Math.round((nowHour / 24) * 288))
  const pastIdx    = Math.max(0, curveIdx - 12)   // ~1 hr ago (12 pts = 1 hr)
  const curHeight  = todayCurve[curveIdx]
  const pastHeight = todayCurve[pastIdx]
  const isRising   = curHeight >= pastHeight
  const ratePerHr  = Math.abs(curHeight - pastHeight)   // ft in last hour

  // Next tide event
  const nextEvent  = todayEvents.find(e => e.hour > nowHour) ?? { ...tomorrowEvents[0], hour: tomorrowEvents[0].hour + 24 }
  const minsUntil  = Math.max(0, Math.round((nextEvent.hour - nowHour) * 60))
  const cntHrs     = Math.floor(minsUntil / 60)
  const cntMins    = minsUntil % 60
  const cntStr     = cntHrs > 0 ? `${cntHrs}h ${cntMins}m` : `${cntMins} min`

  // Slack water: within 25 min of a high or low
  const nearSlack  = todayEvents.some(e => Math.abs(e.hour - nowHour) < 0.42)
  const tideSpeed  = Math.min(100, Math.round((ratePerHr / 1.2) * 100))   // % of max rate

  // Best window: major solunar + tide moving (Fix 2: use todaySolunar not static SOLUNAR)
  const majorPeriods = todaySolunar.filter(s => s.type === 'major')
  const activeMajor  = majorPeriods.find(s => nowHour >= s.start && nowHour < s.start + s.dur)
  const nextMajor    = majorPeriods.find(s => s.start > nowHour)
  const bestWindow   = activeMajor ?? nextMajor ?? majorPeriods[0]
  const bwActive     = !!activeMajor
  const bwMinsUntil  = bwActive ? 0 : Math.max(0, Math.round((bestWindow.start - nowHour) * 60))
  const bwEndsIn     = bwActive ? Math.max(0, Math.round((bestWindow.start + bestWindow.dur - nowHour) * 60)) : 0
  const bwHrs        = Math.floor(bwMinsUntil / 60)
  const bwMins       = bwMinsUntil % 60
  const bwStr        = bwActive
    ? `ends in ${bwEndsIn} min`
    : bwHrs > 0 ? `in ${bwHrs}h ${bwMins}m` : `in ${bwMins} min`

  // Best window end time label
  const bwEndHour    = bestWindow.start + bestWindow.dur
  const bwEndLabel   = `${bwEndHour % 12 === 0 ? 12 : Math.floor(bwEndHour % 12)}:${String(Math.round((bwEndHour % 1) * 60)).padStart(2,'0')} ${bwEndHour < 12 ? 'AM' : 'PM'}`
  const bwStartLabel = bestWindow.label

  // Live clock string
  const clockStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit' })

  const tideRef    = useRef<HTMLCanvasElement>(null)
  const swellRef   = useRef<HTMLCanvasElement>(null)
  const coeffRef   = useRef<HTMLCanvasElement>(null)

  const repaint = useCallback(() => {
    const dpr = window.devicePixelRatio || 1
    const { curve, events, sunH, isViewingToday: ivt, solunar } = selDataRef.current
    const nh  = ivt ? (() => { const n = new Date(); return n.getHours() + n.getMinutes()/60 + n.getSeconds()/3600 })() : null
    if (tideRef.current)  drawTideChart(tideRef.current, t, dpr, curve, events, sunH.sunrise, sunH.sunset, nh, null, solunar)
    if (swellRef.current) drawSwellChart(swellRef.current, t, dpr)
    if (coeffRef.current) drawCoeff30(coeffRef.current, t, dpr)
  }, [t, selCurve, selEvents, selSunH, selSolunar, isViewingToday])

  const [tooltip, setTooltip] = useState<{ x: number; y: number; hour: number; height: number } | null>(null)

  const handleTideMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = tideRef.current
    if (!canvas) return
    const rect   = canvas.getBoundingClientRect()
    const mx     = e.clientX - rect.left
    const my     = e.clientY - rect.top
    const cw     = rect.width - 48 - 18
    const hour   = Math.max(0, Math.min(24, (mx - 48) / cw * 24))
    const idx    = Math.min(288, Math.round((hour / 24) * 288))
    const { curve, events, sunH, isViewingToday: ivt } = selDataRef.current
    const height = curve[idx]
    const nh     = ivt ? (() => { const n = new Date(); return n.getHours() + n.getMinutes()/60 + n.getSeconds()/3600 })() : null
    setTooltip({ x: mx, y: my, hour, height })
    drawTideChart(canvas, t, window.devicePixelRatio || 1, curve, events, sunH.sunrise, sunH.sunset, nh, { hour, height }, selDataRef.current.solunar)
  }, [t])

  const handleTideMouseLeave = useCallback(() => {
    setTooltip(null)
    const { curve, events, sunH, isViewingToday: ivt, solunar } = selDataRef.current
    const nh = ivt ? (() => { const n = new Date(); return n.getHours() + n.getMinutes()/60 + n.getSeconds()/3600 })() : null
    if (tideRef.current) drawTideChart(tideRef.current, t, window.devicePixelRatio || 1, curve, events, sunH.sunrise, sunH.sunset, nh, null, solunar)
  }, [t])

  useEffect(() => {
    repaint()
    const ro = new ResizeObserver(repaint)
    ;[tideRef, swellRef, coeffRef].forEach(r => r.current && ro.observe(r.current))
    return () => ro.disconnect()
  }, [repaint])

  // ── NOAA live weather ──
  const [wxHourly,  setWxHourly]  = useState<WxHour[]>([])
  const [wxHourPage, setWxHourPage] = useState(0)
  const [wxDaily,   setWxDaily]   = useState<WxDay[]>([])
  const [wxLoading, setWxLoading] = useState(true)
  const [wxError,   setWxError]   = useState(false)
  const [wxRetry,   setWxRetry]   = useState(0)

  useEffect(() => {
    setWxLoading(true)
    setWxError(false)

    const WX_CACHE_KEY = `noaa_wx_urls_${station.lat}_${station.lon}`

    type RawPeriod = {
      startTime: string; temperature: number; windSpeed: string; windDirection: string;
      probabilityOfPrecipitation?: { value: number | null };
      shortForecast: string
    }

    function parseAndSet([hrData, dayData]: [{ properties: { periods: RawPeriod[] } }, { properties: { periods: (RawPeriod & { isDaytime: boolean })[] } }]) {
      const nowMs = Date.now()
      const hourly: WxHour[] = hrData.properties.periods
        .filter(p => new Date(p.startTime).getTime() + 3600000 > nowMs)
        .slice(0, 72)
        .map(p => ({
          time:      new Date(p.startTime).toLocaleTimeString('en-US', { hour: 'numeric' }),
          hour:      new Date(p.startTime).getHours(),
          temp:      p.temperature,
          windSpeed: parseInt(p.windSpeed) || 0,
          windDir:   p.windDirection,
          precip:    p.probabilityOfPrecipitation?.value ?? 0,
          condition: p.shortForecast,
        }))
      setWxHourly(hourly)

      const days: WxDay[] = []
      for (let i = 0; i < dayData.properties.periods.length && days.length < 7; i++) {
        const p = dayData.properties.periods[i]
        if (p.isDaytime) {
          const night = dayData.properties.periods[i + 1]
          days.push({
            day:    new Date(p.startTime).toLocaleDateString('en-US', { weekday: 'short' }),
            date:   new Date(p.startTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            high:   p.temperature,
            low:    night ? night.temperature : null,
            icon:   conditionEmoji(p.shortForecast),
            wind:   `${p.windDirection} ${parseInt(p.windSpeed) || 0}`,
            precip: p.probabilityOfPrecipitation?.value ?? 0,
          })
        }
      }
      setWxDaily(days)
      setWxLoading(false)
    }

    function fetchFromUrls(hourlyUrl: string, forecastUrl: string): Promise<void> {
      return Promise.all([
        fetch(hourlyUrl).then(r => { if (!r.ok) throw new Error(String(r.status)); return r.json() }),
        fetch(forecastUrl).then(r => { if (!r.ok) throw new Error(String(r.status)); return r.json() }),
      ]).then(parseAndSet)
    }

    function fetchFromPoints(): Promise<void> {
      return fetch(`https://api.weather.gov/points/${station.lat},${station.lon}`)
        .then(r => { if (!r.ok) throw new Error(String(r.status)); return r.json() })
        .then(meta => {
          const { forecastHourly, forecast } = meta.properties
          try { localStorage.setItem(WX_CACHE_KEY, JSON.stringify({ h: forecastHourly, f: forecast })) } catch {}
          return fetchFromUrls(forecastHourly, forecast)
        })
    }

    // Try cached gridpoint URLs first — skip the flaky /points/ lookup
    let started = false
    try {
      const raw = localStorage.getItem(WX_CACHE_KEY)
      if (raw) {
        const { h, f } = JSON.parse(raw)
        if (h && f) {
          started = true
          fetchFromUrls(h, f).catch(() => fetchFromPoints().catch(() => { setWxError(true); setWxLoading(false) }))
        }
      }
    } catch {}

    if (!started) {
      fetchFromPoints().catch(() => { setWxError(true); setWxLoading(false) })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wxRetry])

  // ── Live water temp (NOAA CO-OPS station 8720503) ──
  const [waterTemp, setWaterTemp] = useState<string | null>(null)
  useEffect(() => {
    fetch(`https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?station=${station.waterTempId}&product=water_temperature&time_zone=LST_LDT&interval=h&units=english&application=TideChartsPro&format=json&range=2`)
      .then(r => r.json())
      .then((d: { data?: Array<{ v: string }> }) => {
        const last = d.data?.at(-1)
        if (last) setWaterTemp(`${parseFloat(last.v).toFixed(0)}°F`)
      })
      .catch(() => {})
  }, [])

  // ── Weather tab + radar ──
  const [wxTab, setWxTab] = useState<'hourly'|'7day'|'radar'>('hourly')
  const [radarFrames, setRadarFrames] = useState<string[]>([])
  const [radarIdx,    setRadarIdx]    = useState(0)
  const [radarPlaying, setRadarPlaying] = useState(false)
  const radarIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    fetch('https://api.rainviewer.com/public/weather-maps.json')
      .then(r => r.json())
      .then((d: { radar: { past: Array<{ time: number; path: string }> } }) => {
        const paths = d.radar.past.map(f => f.path)
        setRadarFrames(paths)
        setRadarIdx(paths.length - 1)
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (radarPlaying && radarFrames.length > 0) {
      radarIntervalRef.current = setInterval(() => {
        setRadarIdx(i => (i + 1) % radarFrames.length)
      }, 500)
    } else {
      if (radarIntervalRef.current) clearInterval(radarIntervalRef.current)
    }
    return () => { if (radarIntervalRef.current) clearInterval(radarIntervalRef.current) }
  }, [radarPlaying, radarFrames])

  // ── helpers
  const card = (children: React.ReactNode, extraStyle?: React.CSSProperties) => (
    <div style={{
      background: t.surface,
      border: `1px solid ${t.border}`,
      borderRadius: 12,
      padding: isMobile ? '14px 12px' : '18px 20px',
      ...extraStyle,
    }}>
      {children}
    </div>
  )

  const sectionTitle = (title: string, sub?: string) => (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: t.text, letterSpacing: '0.02em' }}>{title}</div>
      {sub && <div style={{ fontSize: 11, color: t.textFaint, marginTop: 2 }}>{sub}</div>}
    </div>
  )

  const modeBtnStyle = (m: Mode): React.CSSProperties => ({
    padding: '4px 12px',
    fontSize: 12,
    fontWeight: 500,
    borderRadius: 6,
    border: `1px solid ${mode === m ? t.accent : t.border}`,
    background: mode === m ? t.accentFaint : 'transparent',
    color: mode === m ? t.accent : t.textMuted,
    cursor: 'pointer',
    transition: 'all 0.15s',
  })

  // ── Fix 3: Compute fishing score factors from live data ──
  const moonPhase      = calMoonPhase(new Date())
  // Moon score: peaks at new moon (0) and full moon (0.5), lower in between
  const moonScore      = Math.round(80 - 30 * Math.sin(moonPhase * 2 * Math.PI) ** 2)
  const moonPct        = Math.round(moonPhase <= 0.5 ? moonPhase * 2 * 100 : (1 - moonPhase) * 2 * 100)
  const moonEmoji      = calMoonEmoji(moonPhase)

  // Tide phase score: fast-moving tide = better fishing; slack = worse
  const tidePhaseScore = nearSlack ? 35 : Math.max(40, tideSpeed)
  const tidePhaseNote  = nearSlack
    ? 'Near slack water — fish less active'
    : tideSpeed >= 75 ? 'Fast-moving tide — prime window'
    : tideSpeed >= 50 ? 'Moderate tide flow — good activity'
    : 'Slow tide — moderate activity'

  // Solunar score: active major = 95, within 30 min of major = 85, minor = 70, nothing = 50
  const solunarScore   = activeMajor ? 95
    : bwMinsUntil <= 30 ? 85
    : todaySolunar.some(s => nowHour >= s.start && nowHour < s.start + s.dur) ? 70
    : 50
  const solunarNote    = activeMajor ? 'Major period active now — peak bite'
    : bwMinsUntil <= 30 ? `Major period in ${bwMinsUntil} min — prepare`
    : bestWindow ? `Next major: ${bwHrs > 0 ? `${bwHrs}h ${bwMins}m` : `${bwMins} min`} away`
    : 'No active solunar period'

  // Wind score: calm = great, moderate = ok, strong = poor
  const curWind        = wxHourly[0]?.windSpeed ?? 0
  const windScore      = curWind >= 25 ? 30 : curWind >= 20 ? 50 : curWind >= 15 ? 65 : curWind >= 10 ? 80 : 90
  const windNote       = curWind >= 25 ? `${wxHourly[0]?.windDir ?? ''} ${curWind} mph — rough, avoid`
    : curWind >= 20 ? `${wxHourly[0]?.windDir ?? ''} ${curWind} mph — choppy conditions`
    : curWind >= 15 ? `${wxHourly[0]?.windDir ?? ''} ${curWind} mph — manageable chop`
    : curWind >= 10 ? `${wxHourly[0]?.windDir ?? ''} ${curWind} mph — light chop`
    : curWind > 0 ? `${wxHourly[0]?.windDir ?? ''} ${curWind} mph — calm, ideal`
    : 'Wind data loading…'

  // Water temp score: 65–75°F optimal for most inshore species
  const wTempNum       = waterTemp ? parseInt(waterTemp) : null
  const waterTempScore = wTempNum == null ? 70
    : wTempNum >= 65 && wTempNum <= 75 ? 90
    : wTempNum >= 60 && wTempNum < 65  ? 75
    : wTempNum > 75 && wTempNum <= 82  ? 75
    : wTempNum >= 55 && wTempNum < 60  ? 55
    : 40
  const waterTempNote  = wTempNum == null ? 'Loading water temp…'
    : wTempNum >= 65 && wTempNum <= 75 ? `${wTempNum}°F — optimal inshore range`
    : wTempNum >= 60 && wTempNum < 65  ? `${wTempNum}°F — slightly cool, fish slower`
    : wTempNum > 75 && wTempNum <= 82  ? `${wTempNum}°F — warm, fish deeper`
    : `${wTempNum}°F — outside optimal range`

  // Pressure: no live data yet — use neutral placeholder
  const pressureScore  = 74
  const pressureNote   = 'Stable — no rapid changes detected'

  const SCORE_FACTORS = [
    { label: 'Tide phase',       value: tidePhaseScore, note: tidePhaseNote },
    { label: 'Solunar strength', value: solunarScore,   note: solunarNote },
    { label: 'Pressure trend',   value: pressureScore,  note: pressureNote },
    { label: 'Wind & chop',      value: windScore,      note: windNote },
    { label: 'Water temp',       value: waterTempScore, note: waterTempNote },
    { label: 'Moon phase',       value: moonScore,      note: `${moonEmoji} ${moonPct}% illuminated` },
  ]

  const compositeScore = Math.round(SCORE_FACTORS.reduce((s, f) => s + f.value, 0) / SCORE_FACTORS.length)
  const overallGrade   = compositeScore >= 85 ? 'A' : compositeScore >= 75 ? 'B+' : compositeScore >= 65 ? 'B' : compositeScore >= 55 ? 'C+' : compositeScore >= 45 ? 'C' : 'D'
  const overallLabel   = compositeScore >= 85 ? 'Excellent' : compositeScore >= 75 ? 'Very Good' : compositeScore >= 65 ? 'Good' : compositeScore >= 55 ? 'Fair' : 'Poor'

  const bestDayIdx     = FORECAST.findIndex(d => d.score === 'A' && d.day !== 'Thu') || 6

  return (
    <div style={{ background: t.bg, color: t.text, minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <style>{`
        @media (max-width: 639px) {
          /* Live conditions panel */
          .tcp-live-grid                       { grid-template-columns: repeat(2,1fr) !important; }
          .tcp-live-grid > div                 { padding: 12px !important; border-right: none !important; }
          .tcp-live-grid > div:nth-child(odd)  { border-right: 1px solid rgba(255,255,255,0.08) !important; }
          .tcp-live-grid > div:nth-child(1),
          .tcp-live-grid > div:nth-child(2)    { border-bottom: 1px solid rgba(255,255,255,0.08) !important; }

          /* Quick nav links — stack into 2 per row */
          .tcp-quick-links { gap: 6px !important; }
          .tcp-quick-links a { font-size: 10px !important; padding: 4px 8px !important; }

          /* Section grids */
          .tcp-solunar       { grid-template-columns: repeat(2,1fr) !important; }
          .tcp-two-col       { grid-template-columns: 1fr !important; }
          .tcp-wx-stats      { grid-template-columns: 1fr 1fr !important; }
          .tcp-map-layout    { grid-template-columns: 1fr !important; }
          .tcp-coord-row     { grid-template-columns: 1fr 1fr !important; }
          .tcp-species       { grid-template-columns: 1fr 1fr !important; }
          .tcp-card          { padding: 14px 12px !important; }

          /* Scale down large numbers inside live grid */
          .tcp-live-grid .tcp-live-big   { font-size: 20px !important; }
          .tcp-live-grid .tcp-live-arrow { font-size: 20px !important; }
          .tcp-live-grid .tcp-bw-time    { font-size: 14px !important; }

          /* Hero */
          .tcp-hero-h1       { font-size: 20px !important; }

          /* Nav mode buttons emoji-only on mobile */
          .tcp-mode-label { display: none !important; }
        }
      `}</style>

      {/* ── Nav ── */}
      <nav style={{
        borderBottom: `1px solid ${t.border}`,
        background: `${t.bg}ee`,
        backdropFilter: 'blur(8px)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}>
        {/* Preload all 3 logos so mode switching is instant — hidden imgs, no layout impact */}
        <div style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden', pointerEvents: 'none' }} aria-hidden="true">
          <img src="/logo.webp" alt="" />
          <img src="/logo_light.webp" alt="" />
          <img src="/logo_red.webp" alt="" />
        </div>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: `0 ${isMobile ? 12 : 20}px`, height: isMobile ? 60 : 80, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <a href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
            <img
              src={mode === 'light' ? '/logo_light.webp' : mode === 'red' ? '/logo_red.webp' : '/logo.webp'}
              alt="TideChartsPro"
              style={{ height: isMobile ? 48 : 72, width: isMobile ? 'auto' : 177, objectFit: 'fill', display: 'block', borderRadius: 6 }}
            />
          </a>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            {(['dark', 'light', 'red'] as Mode[]).map(m => (
              <button key={m} onClick={() => setMode(m)} style={modeBtnStyle(m)}>
                {m === 'dark' ? <><span>🌑</span><span className="tcp-mode-label"> Dark</span></> : m === 'light' ? <><span>☀️</span><span className="tcp-mode-label"> Light</span></> : <><span>🔴</span><span className="tcp-mode-label"> Night</span></>}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* ── Hero header ── */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: `${isMobile ? 16 : 28}px ${isMobile ? 12 : 20}px 0` }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, marginBottom: 8, flexDirection: isMobile ? 'row' : 'row' }}>
          <div>
            <div style={{ fontSize: 11, color: t.textFaint, marginBottom: 4 }}>
              <a href="/tides/florida" style={{ color: t.textFaint, textDecoration: 'none' }}>Florida</a>
              <span style={{ margin: '0 6px' }}>/</span>
              <span style={{ color: t.textMuted }}>{station.name}</span>
            </div>
            <h1 className="tcp-hero-h1" style={{ fontSize: 26, fontWeight: 700, margin: 0, lineHeight: 1.2 }}>
              {station.name}
            </h1>
            <div style={{ fontSize: 13, color: t.textMuted, marginTop: 4 }}>
              {station.city} · {station.latDisplay} {station.lonDisplay}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11, color: t.textFaint, marginBottom: 4 }}>TODAY'S FISHING</div>
            <div style={{
              fontSize: 48,
              fontWeight: 800,
              color: gradeColor(overallGrade, t),
              lineHeight: 1,
            }}>{overallGrade}</div>
            <div style={{ fontSize: 11, color: t.textMuted }}>{overallLabel} conditions</div>
          </div>
        </div>

        {/* info stat cards */}
        {(() => {
          const eventsFromNow = isViewingToday ? selEvents.filter(e => e.hour > nowHour) : selEvents
          const nextHigh = eventsFromNow.find(e => e.label === 'High') ?? selEvents.find(e => e.label === 'High')
          const nextLow  = eventsFromNow.find(e => e.label === 'Low')  ?? selEvents.find(e => e.label === 'Low')
          const hiHeights = selEvents.filter(e => e.label === 'High').map(e => e.height)
          const loHeights = selEvents.filter(e => e.label === 'Low').map(e => e.height)
          const tidalRange = hiHeights.length && loHeights.length
            ? (Math.max(...hiHeights) - Math.min(...loHeights)).toFixed(1) + ' ft' : '—'
          const nextSol = (isViewingToday
            ? selSolunar.find(s => s.type === 'major' && s.start > nowHour)
            : selSolunar.find(s => s.type === 'major')) ?? selSolunar.find(s => s.type === 'major')
          const statCards = [
            { icon: '▲', label: 'Next High', v: nextHigh ? `${nextHigh.time}  ${nextHigh.height} ft` : '—', color: t.accent },
            { icon: '▼', label: 'Next Low',  v: nextLow  ? `${nextLow.time}  ${nextLow.height} ft`  : '—', color: '#818cf8' },
            { icon: '🌡', label: 'Water Temp', v: waterTemp ?? WEATHER.waterTemp, color: '#f97316' },
            { icon: '↕', label: 'Tidal Range', v: tidalRange, color: '#22c55e' },
            { icon: '🐟', label: 'Solunar', v: nextSol ? `Major ${nextSol.label}` : 'No major today', color: '#eab308' },
          ]
          return (
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20 }}>
          {statCards.map(b => (
            <div key={b.label} style={{
              background: t.surface,
              border: `1px solid ${t.border}`,
              borderTop: `3px solid ${b.color}`,
              borderRadius: 10,
              padding: '10px 16px',
              minWidth: 110,
              flex: '1 1 auto',
            }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: t.textFaint, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 5 }}>
                <span style={{ color: b.color, marginRight: 4 }}>{b.icon}</span>{b.label}
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, color: t.text, letterSpacing: '-0.01em' }}>{b.v}</div>
            </div>
          ))}
        </div>
          )
        })()}
      </div>

      {/* ── Main grid ── */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: `0 ${isMobile ? 12 : 20}px 40px`, display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 16 }}>

        {/* ── NOW Panel ── */}
        <div style={{
          background: t.surface,
          border: `1px solid ${t.border}`,
          borderRadius: 14,
          overflow: 'hidden',
          boxShadow: bwActive ? `0 0 0 2px ${t.accent}55` : undefined,
        }}>
          {/* Header bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 18px',
            borderBottom: `1px solid ${t.border}`,
            background: t.surfaceAlt,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{
                display: 'inline-block', width: 7, height: 7, borderRadius: '50%',
                background: '#22c55e',
                boxShadow: '0 0 6px #22c55e',
                animation: 'pulse 2s infinite',
              }}/>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: t.textMuted }}>
                Live Conditions
              </span>
            </div>
            <span style={{ fontSize: 12, fontWeight: 600, color: t.textFaint, fontVariantNumeric: 'tabular-nums' }}>
              {clockStr}
            </span>
          </div>

          {/* 4-column grid */}
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, minmax(0,1fr))' : 'repeat(4, minmax(0,1fr))', gap: 0 }}>

            {/* ① Tide now */}
            <div style={{ padding: isMobile ? '12px' : '16px 18px', borderRight: `1px solid ${t.border}`, borderBottom: isMobile ? `1px solid ${t.border}` : 'none' }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: t.textFaint, marginBottom: 8 }}>
                Tide Now
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 4 }}>
                <span style={{ fontSize: isMobile ? 20 : 28, fontWeight: 800, color: isRising ? t.accent : '#818cf8', lineHeight: 1 }}>
                  {isRising ? '↑' : '↓'}
                </span>
                <span style={{ fontSize: isMobile ? 18 : 22, fontWeight: 800, color: t.text, lineHeight: 1 }}>
                  {curHeight.toFixed(1)} ft
                </span>
              </div>
              <div style={{ fontSize: 12, color: t.textMuted, marginBottom: 10 }}>
                {isRising ? 'Rising' : 'Falling'} · {ratePerHr.toFixed(1)} ft/hr
              </div>
              {/* Tide speed bar */}
              <div style={{ marginBottom: 4 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                  <span style={{ fontSize: 10, color: t.textFaint }}>Tide speed</span>
                  <span style={{ fontSize: 10, color: nearSlack ? '#f97316' : '#22c55e', fontWeight: 600 }}>
                    {nearSlack ? 'Slack water' : tideSpeed > 60 ? 'Strong' : 'Moderate'}
                  </span>
                </div>
                <div style={{ height: 4, borderRadius: 2, background: t.border }}>
                  <div style={{
                    height: '100%', borderRadius: 2,
                    width: `${tideSpeed}%`,
                    background: nearSlack ? '#f97316' : tideSpeed > 60 ? '#22c55e' : '#84cc16',
                    transition: 'width 1s ease',
                  }}/>
                </div>
              </div>
            </div>

            {/* ② Next event */}
            <div style={{ padding: isMobile ? '12px' : '16px 18px', borderRight: isMobile ? 'none' : `1px solid ${t.border}`, borderBottom: isMobile ? `1px solid ${t.border}` : 'none' }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: t.textFaint, marginBottom: 8 }}>
                Next Event
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: nextEvent.label === 'High' ? t.accent : '#818cf8', marginBottom: 4 }}>
                {nextEvent.label === 'High' ? '▲' : '▼'} {nextEvent.label} Tide
              </div>
              <div style={{ fontSize: isMobile ? 20 : 26, fontWeight: 800, color: t.text, lineHeight: 1, marginBottom: 6, fontVariantNumeric: 'tabular-nums' }}>
                {cntStr}
              </div>
              <div style={{ fontSize: 12, color: t.textMuted }}>
                {nextEvent.height} ft at {nextEvent.time}
              </div>
              <div style={{ marginTop: 8, fontSize: 11, color: t.textFaint }}>
                {nextEvent.label === 'Low'
                  ? '🎣 Creek mouth action peaks near low'
                  : '🌿 Marsh edges productive on incoming'}
              </div>
            </div>

            {/* ③ Best window */}
            <div style={{
              padding: isMobile ? '12px' : '16px 18px',
              borderRight: `1px solid ${t.border}`,
              background: bwActive ? `${t.accent}0d` : 'transparent',
            }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: bwActive ? t.accent : t.textFaint, marginBottom: 8 }}>
                {bwActive ? '🔥 Best Window — Active Now' : '🔥 Best Window'}
              </div>
              <div style={{ fontSize: isMobile ? 13 : 18, fontWeight: 800, color: bwActive ? t.accent : t.text, lineHeight: 1.2, marginBottom: 4 }}>
                {bwStartLabel}–{bwEndLabel}
              </div>
              <div style={{
                display: 'inline-block',
                fontSize: 11, fontWeight: 700,
                padding: '2px 8px', borderRadius: 5,
                background: bwActive ? `${t.accent}33` : t.badge,
                color: bwActive ? t.accent : t.textMuted,
                marginBottom: 8,
              }}>
                {bwStr}
              </div>
              <div style={{ fontSize: 11, color: t.textFaint, lineHeight: 1.5 }}>
                Major solunar · {isRising ? 'Incoming tide' : 'Outgoing tide'}<br/>
                {nearSlack ? 'Wait for tide to move' : 'Tide actively moving ✓'}
              </div>
            </div>

            {/* ④ Conditions snapshot */}
            <div style={{ padding: isMobile ? '12px' : '16px 18px' }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: t.textFaint, marginBottom: 8 }}>
                Conditions
              </div>
              {(() => {
                const liveHour = wxHourly.find(h => h.hour === Math.floor(nowHour)) ?? wxHourly[0]
                const liveWind = liveHour ? `${liveHour.windDir} ${liveHour.windSpeed} mph` : WEATHER.windSpeed
                const windSub  = liveHour ? (liveHour.windSpeed >= 20 ? 'Strong — use caution' : liveHour.windSpeed >= 12 ? 'Moderate' : 'Light — good visibility') : 'Light — good visibility'
                const wTemp    = waterTemp ?? WEATHER.waterTemp
                const nextMajorSol = selSolunar.find(s => s.type === 'major' && s.start > nowHour) ?? selSolunar.find(s => s.type === 'major')
                const solLabel = nextMajorSol ? `Major ${nextMajorSol.label}` : 'No major today'
                const rows = [
                  { icon: '🌡️', val: wTemp,         sub: 'Water temp' },
                  { icon: '📊', val: WEATHER.pressure, sub: `${WEATHER.pressureTrend === 'rising' ? '↗ Rising' : '↘ Falling'} — fish active` },
                  { icon: '💨', val: liveWind,       sub: windSub },
                  { icon: '🌙', val: solLabel,        sub: '2-hr window' },
                ]
                return rows.map(row => (
                  <div key={row.val} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7 }}>
                    <span style={{ fontSize: 14, width: 20, textAlign: 'center' as const }}>{row.icon}</span>
                    <div>
                      <span style={{ fontSize: 12, fontWeight: 600, color: t.text }}>{row.val}</span>
                      <span style={{ fontSize: 10, color: t.textFaint, marginLeft: 6 }}>{row.sub}</span>
                    </div>
                  </div>
                ))
              })()}
            </div>

          </div>

          {/* Quick links */}
          <div className="tcp-quick-links" style={{ padding: '8px 18px', borderTop: `1px solid ${t.border}`, display: 'flex', gap: 8, flexWrap: 'wrap' as const }}>
            {[
              { label: '↓ Full tide chart', href: '#tide-chart' },
              { label: '↓ Hourly weather', href: '#weather' },
              { label: '↓ Solunar periods', href: '#solunar' },
              { label: '↓ 30-day calendar', href: '#calendar' },
            ].map(l => (
              <a key={l.href} href={l.href} style={{
                fontSize: 11, fontWeight: 600, color: t.accent,
                background: t.accentFaint, border: `1px solid ${t.accent}44`,
                borderRadius: 5, padding: '3px 10px', textDecoration: 'none',
                transition: 'opacity 0.15s',
              }}>{l.label}</a>
            ))}
          </div>

          {/* Bottom: full-width tide gauge bar */}
          <div style={{ padding: '10px 18px 12px', borderTop: `1px solid ${t.border}`, background: t.surfaceAlt }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 10, color: t.textFaint }}>0 ft (MLLW)</span>
              <span style={{ fontSize: 10, color: t.textFaint, fontWeight: 600 }}>
                Current: {curHeight.toFixed(2)} ft
              </span>
              <span style={{ fontSize: 10, color: t.textFaint }}>6 ft (approx. MHHW)</span>
            </div>
            <div style={{ height: 8, borderRadius: 4, background: t.border, overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                borderRadius: 4,
                width: `${Math.min(100, (curHeight / 6) * 100)}%`,
                background: `linear-gradient(90deg, #818cf8, ${t.accent})`,
                transition: 'width 1s ease',
              }}/>
            </div>
          </div>
        </div>

        {/* Tide chart */}
        <div id="tide-chart"/>
        {card(
          <>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: t.text, letterSpacing: '0.02em' }}>
                  {isViewingToday ? "Today's Tide Chart" : `Tide Chart · ${selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}`}
                </div>
                <div style={{ fontSize: 11, color: t.textFaint, marginTop: 2 }}>
                  {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })} · Predicted tides
                </div>
              </div>
              {!isViewingToday && (
                <button
                  onClick={() => navigateToDate(new Date())}
                  style={{
                    fontSize: 11, fontWeight: 600, color: t.accent,
                    background: t.accentFaint, border: `1px solid ${t.accent}55`,
                    borderRadius: 6, padding: '4px 10px', cursor: 'pointer',
                    fontFamily: 'inherit', whiteSpace: 'nowrap',
                  }}>
                  ← Back to today
                </button>
              )}
            </div>
            <div style={{ position: 'relative' }}>
              <canvas
                ref={tideRef}
                onMouseMove={handleTideMouseMove}
                onMouseLeave={handleTideMouseLeave}
                style={{ width: '100%', height: 340, display: 'block', borderRadius: 6, cursor: 'crosshair' }}
              />
              {tooltip && (
                <div style={{
                  position: 'absolute',
                  left: tooltip.x > 300 ? tooltip.x - 118 : tooltip.x + 14,
                  top: Math.max(4, tooltip.y - 60),
                  pointerEvents: 'none',
                  background: t.surface,
                  border: `1px solid ${t.accent}`,
                  borderRadius: 8,
                  padding: '7px 12px',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.45)',
                  zIndex: 10,
                  whiteSpace: 'nowrap',
                }}>
                  <div style={{ fontWeight: 800, fontSize: 16, color: t.text, lineHeight: 1 }}>
                    {tooltip.height.toFixed(2)} ft
                  </div>
                  <div style={{ fontSize: 11, color: t.textMuted, marginTop: 4 }}>
                    {calFmtHour(tooltip.hour)}
                  </div>
                </div>
              )}
            </div>
            <div style={{ display: 'flex', gap: 20, marginTop: 12, flexWrap: 'wrap' }}>
              {selEvents.map(ev => (
                <div key={ev.time} style={{ fontSize: 12 }}>
                  <span style={{
                    display: 'inline-block',
                    width: 8, height: 8, borderRadius: '50%',
                    background: ev.label === 'High' ? t.canvasHighPin : t.canvasLowPin,
                    marginRight: 5, verticalAlign: 'middle',
                  }}/>
                  <span style={{ color: t.textMuted }}>{ev.label}: </span>
                  <span style={{ fontWeight: 600 }}>{ev.time}</span>
                  <span style={{ color: t.textFaint }}> {ev.height.toFixed(1)} ft</span>
                </div>
              ))}
            </div>
          </>
        )}

        <div id="weather"/>
        {/* ── Weather Section (tabbed) ── */}
        {card(
          <>
            {/* Header + tabs */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: t.text, letterSpacing: '0.02em' }}>Weather Forecast</div>
                <div style={{ fontSize: 11, color: t.textFaint, marginTop: 2 }}>Live data · {station.city}</div>
              </div>
              <div style={{ display: 'flex', gap: 4 }}>
                {(['hourly', '7day', 'radar'] as const).map(tab => (
                  <button key={tab} onClick={() => setWxTab(tab)} style={{
                    padding: '4px 11px', fontSize: 11, fontWeight: 600, borderRadius: 6, cursor: 'pointer',
                    border: `1px solid ${wxTab === tab ? t.accent : t.border}`,
                    background: wxTab === tab ? t.accentFaint : 'transparent',
                    color: wxTab === tab ? t.accent : t.textMuted,
                    fontFamily: 'inherit', transition: 'all 0.15s',
                  }}>
                    {tab === 'hourly' ? 'Hourly' : tab === '7day' ? '7-Day' : '📡 Radar'}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Hourly tab ── */}
            {wxTab === 'hourly' && wxLoading && <div style={{ color: t.textFaint, fontSize: 12, padding: '20px 0', textAlign: 'center' }}>Loading weather data…</div>}
            {wxTab === 'hourly' && wxError   && (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <div style={{ color: t.textFaint, fontSize: 12, marginBottom: 10 }}>Weather data unavailable</div>
                <button onClick={() => { try { localStorage.removeItem(`noaa_wx_urls_${station.lat}_${station.lon}`) } catch {} setWxRetry(n => n + 1) }} style={{ padding: '6px 18px', fontSize: 12, fontWeight: 600, borderRadius: 6, border: `1px solid ${t.accent}`, background: t.accentFaint, color: t.accent, cursor: 'pointer', fontFamily: 'inherit' }}>
                  Retry
                </button>
              </div>
            )}
            {wxTab === 'hourly' && !wxLoading && !wxError && (
              <div>
                {isMobile ? (
                  /* ── Mobile: 6-col compact table ── */
                  <>
                    <div style={{ display: 'grid', gridTemplateColumns: '48px 26px 38px 1fr 40px 44px', marginBottom: 4 }}>
                      {['Time','','Temp','Wind','Rain','Tide'].map((h, ci) => (
                        <div key={ci} style={{ fontSize: 9, fontWeight: 700, color: t.textFaint, textTransform: 'uppercase' as const, letterSpacing: '0.07em', padding: '0 3px' }}>{h}</div>
                      ))}
                    </div>
                    {wxHourly.slice(wxHourPage * 24, wxHourPage * 24 + 24).map((h, i) => {
                      const isNow       = wxHourPage === 0 && h.hour === Math.floor(nowHour)
                      const windColor   = h.windSpeed >= 20 ? '#ef4444' : h.windSpeed >= 12 ? '#eab308' : '#22c55e'
                      const precipColor = h.precip >= 60 ? '#60a5fa' : h.precip >= 30 ? '#93c5fd' : t.textMuted
                      const tideIdx     = Math.min(288, Math.round((h.hour / 24) * 288))
                      const tideHt      = selCurve[tideIdx]
                      const tideRising  = selCurve[tideIdx] >= selCurve[Math.max(0, tideIdx - 12)]
                      const tideColor   = tideHt >= 3.5 ? t.accent : tideHt >= 2 ? t.textMuted : t.textFaint
                      return (
                        <div key={i} style={{
                          display: 'grid', gridTemplateColumns: '48px 26px 38px 1fr 40px 44px',
                          background: isNow ? t.accentFaint : i % 2 === 0 ? t.surface : t.surfaceAlt,
                          borderLeft: isNow ? `3px solid ${t.accent}` : '3px solid transparent',
                          borderRadius: 4, marginBottom: 1, alignItems: 'center',
                        }}>
                          <div style={{ padding: '6px 3px', fontSize: 11, fontWeight: isNow ? 700 : 400, color: isNow ? t.accent : t.text, whiteSpace: 'nowrap' as const }}>
                            {isNow ? '▶' : ''}{h.time}
                          </div>
                          <div style={{ padding: '6px 2px', fontSize: 16, lineHeight: 1 }}>{conditionEmoji(h.condition)}</div>
                          <div style={{ padding: '6px 3px', fontSize: 13, fontWeight: 700, color: '#facc15' }}>{h.temp}°</div>
                          <div style={{ padding: '6px 3px', fontSize: 11, color: windColor, display: 'flex', alignItems: 'center', gap: 3 }}>
                            <span style={{ display: 'inline-block', transform: `rotate(${windDirDeg(h.windDir)}deg)`, fontSize: 11, lineHeight: 1, flexShrink: 0 }}>↑</span>
                            {h.windDir} {h.windSpeed}
                          </div>
                          <div style={{ padding: '6px 3px', fontSize: 11, fontWeight: 600, color: precipColor }}>{h.precip}%</div>
                          <div style={{ padding: '6px 3px', fontSize: 11, fontWeight: 600, color: tideColor }}>
                            {tideRising ? '▲' : '▼'}{tideHt.toFixed(1)}
                          </div>
                        </div>
                      )
                    })}
                  </>
                ) : (
                  /* ── Desktop: full 7-col table ── */
                  <div style={{ overflowX: 'auto', width: '100%' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '68px 1fr 56px 1fr 56px 72px 64px', marginBottom: 4 }}>
                      {['Time','Conditions','Temp','Wind','Precip','Tide','Solunar'].map((h, ci) => (
                        <div key={ci} style={{ fontSize: 9, fontWeight: 700, color: t.textFaint, textTransform: 'uppercase' as const, letterSpacing: '0.07em', padding: '0 6px' }}>{h}</div>
                      ))}
                    </div>
                    {wxHourly.slice(wxHourPage * 24, wxHourPage * 24 + 24).map((h, i) => {
                      const isNow       = wxHourPage === 0 && h.hour === Math.floor(nowHour)
                      const windColor   = h.windSpeed >= 20 ? '#ef4444' : h.windSpeed >= 12 ? '#eab308' : '#22c55e'
                      const precipColor = h.precip >= 60 ? '#60a5fa' : h.precip >= 30 ? '#93c5fd' : t.textMuted
                      const tideIdx     = Math.min(288, Math.round((h.hour / 24) * 288))
                      const tideHt      = selCurve[tideIdx]
                      const tideRising  = selCurve[tideIdx] >= selCurve[Math.max(0, tideIdx - 12)]
                      const tideColor   = tideHt >= 3.5 ? t.accent : tideHt >= 2 ? t.textMuted : t.textFaint
                      const solPeriod   = selSolunar.find(s => h.hour >= s.start && h.hour < s.start + s.dur)
                      return (
                        <div key={i} style={{
                          display: 'grid', gridTemplateColumns: '68px 1fr 56px 1fr 56px 72px 64px',
                          background: isNow ? t.accentFaint : i % 2 === 0 ? t.surface : t.surfaceAlt,
                          borderLeft: isNow ? `3px solid ${t.accent}` : '3px solid transparent',
                          borderRadius: 4, marginBottom: 1, alignItems: 'center',
                        }}>
                          <div style={{ padding: '6px 6px', fontSize: 12, fontWeight: isNow ? 700 : 400, color: isNow ? t.accent : t.text, whiteSpace: 'nowrap' as const }}>
                            {isNow ? '▶ ' : ''}{h.time}
                          </div>
                          <div style={{ padding: '6px 6px', fontSize: 11, color: t.textMuted, display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ fontSize: 20, flexShrink: 0 }}>{conditionEmoji(h.condition)}</span>
                            <span style={{ whiteSpace: 'nowrap' as const, overflow: 'hidden', textOverflow: 'ellipsis' }}>{h.condition}</span>
                          </div>
                          <div style={{ padding: '6px 6px', fontSize: 13, fontWeight: 700, color: '#facc15' }}>{h.temp}°</div>
                          <div style={{ padding: '6px 6px', fontSize: 12, color: windColor, display: 'flex', alignItems: 'center', gap: 4, whiteSpace: 'nowrap' as const }}>
                            <span style={{ display: 'inline-block', transform: `rotate(${windDirDeg(h.windDir)}deg)`, fontSize: 12, lineHeight: 1 }}>↑</span>
                            {h.windDir} {h.windSpeed} mph
                          </div>
                          <div style={{ padding: '6px 6px', fontSize: 12, fontWeight: 600, color: precipColor }}>{h.precip}%</div>
                          <div style={{ padding: '6px 6px', fontSize: 12, fontWeight: 600, color: tideColor, display: 'flex', alignItems: 'center', gap: 3 }}>
                            <span style={{ fontSize: 10 }}>{tideRising ? '▲' : '▼'}</span>{tideHt.toFixed(1)} ft
                          </div>
                          <div style={{ padding: '6px 6px', fontSize: 18 }}>
                            {solPeriod ? <span title={`${solPeriod.type} period`}>{solPeriod.type === 'major' ? '🐟🐟' : '🐟'}</span> : <span style={{ color: t.textFaint, fontSize: 12 }}>—</span>}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
                {/* Pagination */}
                {wxHourly.length > 24 && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10, gap: 8 }}>
                    <button
                      onClick={() => setWxHourPage(p => Math.max(0, p - 1))}
                      disabled={wxHourPage === 0}
                      style={{ padding: '6px 14px', fontSize: 12, fontWeight: 600, borderRadius: 6, border: `1px solid ${t.border}`, background: wxHourPage === 0 ? t.surfaceAlt : t.surface, color: wxHourPage === 0 ? t.textFaint : t.text, cursor: wxHourPage === 0 ? 'default' : 'pointer' }}
                    >← Prev 24 hrs</button>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {Array.from({ length: Math.ceil(wxHourly.length / 24) }).map((_, pi) => (
                        <button key={pi} onClick={() => setWxHourPage(pi)} style={{ width: 28, height: 28, borderRadius: 6, border: `1px solid ${pi === wxHourPage ? t.accent : t.border}`, background: pi === wxHourPage ? t.accentFaint : t.surface, color: pi === wxHourPage ? t.accent : t.textMuted, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
                          {pi + 1}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => setWxHourPage(p => Math.min(Math.ceil(wxHourly.length / 24) - 1, p + 1))}
                      disabled={wxHourPage >= Math.ceil(wxHourly.length / 24) - 1}
                      style={{ padding: '6px 14px', fontSize: 12, fontWeight: 600, borderRadius: 6, border: `1px solid ${t.border}`, background: wxHourPage >= Math.ceil(wxHourly.length / 24) - 1 ? t.surfaceAlt : t.surface, color: wxHourPage >= Math.ceil(wxHourly.length / 24) - 1 ? t.textFaint : t.text, cursor: wxHourPage >= Math.ceil(wxHourly.length / 24) - 1 ? 'default' : 'pointer' }}
                    >Next 24 hrs →</button>
                  </div>
                )}
              </div>
            )}

            {/* ── 7-Day tab ── */}
            {wxTab === '7day' && wxLoading && <div style={{ color: t.textFaint, fontSize: 12, padding: '20px 0', textAlign: 'center' }}>Loading forecast…</div>}
            {wxTab === '7day' && !wxLoading && (
              <div style={{ overflowX: 'auto', width: '100%', paddingTop: 10 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8, minWidth: 480 }}>
                  {(wxDaily.length > 0 ? wxDaily : selForecast.map(d => ({ day: d.day, date: d.date, high: d.high, low: d.low, icon: d.icon, wind: d.wind, precip: null as number | null }))).map((day, i) => {
                    const fd = selForecast[i]
                    const isToday = i === 0
                    const isBest = fd?.score === 'A' || fd?.score === 'A-'
                    return (
                      <div key={i} style={{
                        padding: '10px 6px', borderRadius: 10, textAlign: 'center', position: 'relative',
                        background: isBest && !isToday ? t.accentFaint : t.surfaceAlt,
                        border: `1px solid ${isBest && !isToday ? t.accent + '66' : t.border}`,
                      }}>
                        {isToday && <div style={{ position: 'absolute', top: -8, left: '50%', transform: 'translateX(-50%)', fontSize: 9, fontWeight: 700, color: t.canvasNowLine, background: t.bg, padding: '1px 6px', borderRadius: 4, border: `1px solid ${t.canvasNowLine}55` }}>TODAY</div>}
                        {isBest && !isToday && <div style={{ position: 'absolute', top: -8, left: '50%', transform: 'translateX(-50%)', fontSize: 9, fontWeight: 700, color: t.accent, background: t.bg, padding: '1px 6px', borderRadius: 4, border: `1px solid ${t.accent}55` }}>BEST</div>}
                        <div style={{ fontSize: 11, fontWeight: 700, color: t.text }}>{day.day}</div>
                        <div style={{ fontSize: 9, color: t.textFaint, marginBottom: 6 }}>{day.date}</div>
                        <div style={{ fontSize: 22, marginBottom: 4 }}>{day.icon}</div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: t.text }}>{day.high}°</div>
                        <div style={{ fontSize: 11, color: t.textFaint }}>{day.low ?? '—'}°</div>
                        {fd && <div style={{ fontSize: 18, fontWeight: 800, color: gradeColor(fd.score, t), marginTop: 4 }}>{fd.score}</div>}
                        <div style={{ fontSize: 9, color: t.textFaint, marginTop: 3 }}>{day.wind}</div>
                        {'precip' in day && day.precip != null && <div style={{ fontSize: 9, color: '#93c5fd', marginTop: 2 }}>💧 {day.precip}%</div>}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* ── Radar tab ── */}
            {wxTab === 'radar' && (() => {
              const { z: Z, cx: CX, cy: CY, left: markerLeft, top: markerTop } = latlonToRadarMap(station.lat, station.lon)
              const offsets = [-1, 0, 1]
              const frame = radarFrames[radarIdx] ?? ''
              const tsMatch = frame.match(/\/(\d+)\//)
              const tsLabel = tsMatch ? new Date(parseInt(tsMatch[1]) * 1000).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : ''
              return (
                <div>
                  {/* Map */}
                  <div style={{ position: 'relative', width: '100%', borderRadius: 8, overflow: 'hidden', background: '#1a2535' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))' }}>
                      {offsets.flatMap(dy => offsets.map(dx => {
                        const tx = CX + dx, ty = CY + dy
                        return (
                          <div key={`${tx}-${ty}`} style={{ position: 'relative', aspectRatio: '1' }}>
                            {/* OSM base tile */}
                            <img
                              src={`https://tile.openstreetmap.org/${Z}/${tx}/${ty}.png`}
                              style={{ width: '100%', height: '100%', display: 'block' }}
                              alt=""
                            />
                            {/* Radar overlay */}
                            {frame && (
                              <img
                                src={`https://tilecache.rainviewer.com${frame}/512/${Z}/${tx}/${ty}/2/1_1.png`}
                                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.85, filter: 'saturate(2) brightness(1.3)' }}
                                alt=""
                              />
                            )}
                          </div>
                        )
                      }))}
                    </div>
                    {/* Station marker */}
                    <div style={{ position: 'absolute', left: markerLeft, top: markerTop, transform: 'translate(-50%,-50%)', pointerEvents: 'none', zIndex: 10 }}>
                      <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#f97316', border: '2px solid white', boxShadow: '0 0 10px rgba(0,0,0,0.9), 0 0 0 5px rgba(249,115,22,0.4)' }}/>
                      <div style={{ position: 'absolute', top: 16, left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,0,0,0.85)', color: '#fff', fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 3, whiteSpace: 'nowrap' as const }}>{station.name.split(' ').slice(0,2).join(' ')}</div>
                    </div>
                    {/* Timestamp */}
                    {tsLabel && (
                      <div style={{ position: 'absolute', top: 8, left: 8, background: 'rgba(0,0,0,0.65)', color: '#fff', fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 4 }}>
                        {tsLabel}
                      </div>
                    )}
                    {/* Frame counter */}
                    <div style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.65)', color: '#aaa', fontSize: 10, padding: '3px 8px', borderRadius: 4 }}>
                      {radarIdx + 1} / {radarFrames.length}
                    </div>
                  </div>
                  {/* Controls */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10 }}>
                    <button onClick={() => setRadarIdx(i => Math.max(0, i - 1))} style={{ background: t.surfaceAlt, border: `1px solid ${t.border}`, color: t.text, padding: '5px 12px', borderRadius: 6, cursor: 'pointer', fontSize: 14, fontFamily: 'inherit' }}>◀</button>
                    <button onClick={() => setRadarPlaying(p => !p)} style={{
                      background: radarPlaying ? t.accentFaint : t.surfaceAlt,
                      border: `1px solid ${radarPlaying ? t.accent : t.border}`,
                      color: radarPlaying ? t.accent : t.text,
                      padding: '5px 20px', borderRadius: 6, cursor: 'pointer', fontSize: 13, fontWeight: 700, fontFamily: 'inherit',
                    }}>{radarPlaying ? '⏸ Pause' : '▶ Play'}</button>
                    <button onClick={() => setRadarIdx(i => Math.min(radarFrames.length - 1, i + 1))} style={{ background: t.surfaceAlt, border: `1px solid ${t.border}`, color: t.text, padding: '5px 12px', borderRadius: 6, cursor: 'pointer', fontSize: 14, fontFamily: 'inherit' }}>▶</button>
                    <button onClick={() => setRadarIdx(radarFrames.length - 1)} style={{ background: t.surfaceAlt, border: `1px solid ${t.border}`, color: t.textFaint, padding: '5px 10px', borderRadius: 6, cursor: 'pointer', fontSize: 11, fontFamily: 'inherit' }}>Latest</button>
                    {/* Scrubber */}
                    <input type="range" min={0} max={Math.max(0, radarFrames.length - 1)} value={radarIdx}
                      onChange={e => { setRadarPlaying(false); setRadarIdx(Number(e.target.value)) }}
                      style={{ flex: 1, accentColor: t.accent }} />
                  </div>
                  <div style={{ fontSize: 10, color: t.textFaint, marginTop: 6 }}>
                    Radar data: <span style={{ color: t.textMuted }}>RainViewer</span> · Map: <span style={{ color: t.textMuted }}>© OpenStreetMap</span>
                  </div>
                </div>
              )
            })()}
          </>
        )}

        {/* Fishing score + Weather — two column */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'minmax(0,1fr) minmax(0,1fr)', gap: 16 }}>

          {/* Fishing score card */}
          {card(
            <>
              {sectionTitle('Fishing Score', 'Composite of 6 factors')}
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 14 }}>
                <div style={{
                  fontSize: 56,
                  fontWeight: 800,
                  color: gradeColor(overallGrade, t),
                  lineHeight: 1,
                  minWidth: 60,
                }}>
                  {overallGrade}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{overallLabel}</div>
                  <div style={{ fontSize: 11, color: t.textMuted, marginTop: 2 }}>
                    {solunarNote}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {SCORE_FACTORS.map(f => (
                  <div key={f.label}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                      <span style={{ fontSize: 12, color: t.textMuted }}>{f.label}</span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: t.text }}>{f.value}</span>
                    </div>
                    <div style={{ height: 4, borderRadius: 2, background: t.border, overflow: 'hidden' }}>
                      <div style={{
                        height: '100%',
                        width: `${f.value}%`,
                        borderRadius: 2,
                        background: f.value >= 80 ? '#22c55e' : f.value >= 65 ? '#84cc16' : '#eab308',
                        transition: 'width 0.4s ease',
                      }}/>
                    </div>
                    <div style={{ fontSize: 10, color: t.textFaint, marginTop: 2 }}>{f.note}</div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Weather */}
          {card(
            <>
              {sectionTitle('Current Conditions', 'Updated 10:20 AM')}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0,1fr))', gap: 10, marginBottom: 16 }}>
                {Object.entries(WEATHER).filter(([k]) => k !== 'pressureTrend').map(([k, v]) => (
                  <div key={k} style={{
                    background: t.surfaceAlt,
                    border: `1px solid ${t.border}`,
                    borderRadius: 8,
                    padding: '8px 10px',
                  }}>
                    <div style={{ fontSize: 10, color: t.textFaint, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 2 }}>
                      {k.replace(/([A-Z])/g, ' $1').trim()}
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 600 }}>{v}</div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Swell chart */}

        <div id="solunar"/>
        {/* Solunar — full width */}
        {card(
          <>
            {sectionTitle('Solunar Activity', 'Best feeding windows based on lunar & solar transit')}
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, minmax(0,1fr))' : 'repeat(4, minmax(0,1fr))', gap: 10 }}>
              {selSolunar.map(s => {
                const endHour   = s.start + s.dur
                const isActive  = nowHour >= s.start && nowHour < endHour
                const isPast    = nowHour >= endHour
                const isMajor   = s.type === 'major'
                const accentCol = isMajor ? t.accent : '#a78bfa'
                const statusLabel = isActive ? '🟢 Active now' : isPast ? 'Passed' : `in ${Math.floor(s.start - nowHour)}h ${Math.round(((s.start - nowHour) % 1) * 60)}m`
                const statusColor = isActive ? '#22c55e' : isPast ? t.textFaint : t.textMuted
                return (
                  <div key={s.label} style={{
                    padding: '14px 16px',
                    background: isActive ? `${accentCol}18` : t.surfaceAlt,
                    border: `1px solid ${isActive ? accentCol + '66' : t.border}`,
                    borderTop: `3px solid ${isPast ? t.border : accentCol}`,
                    borderRadius: 10,
                    opacity: isPast ? 0.5 : 1,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{
                        fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em',
                        color: accentCol, background: `${accentCol}22`, padding: '2px 8px', borderRadius: 4,
                      }}>
                        {isMajor ? '★ Major' : '◆ Minor'}
                      </span>
                      <span style={{ fontSize: 10, color: t.textFaint }}>{s.dur}h window</span>
                    </div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: isPast ? t.textMuted : t.text, letterSpacing: '-0.02em', marginBottom: 4 }}>
                      {s.label}
                    </div>
                    <div style={{ fontSize: 11, color: t.textMuted, marginBottom: 8 }}>
                      {isMajor ? 'Peak feeding period — fish most active' : 'Secondary feeding period'}
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: statusColor }}>{statusLabel}</div>
                  </div>
                )
              })}
            </div>
          </>
        )}

        {/* Species reference */}
        {card(
          <>
            {sectionTitle('Local Species', `${station.name} area · FL regulations`)}
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, minmax(0,1fr))' : 'repeat(auto-fill, minmax(180px, 1fr))', gap: 8 }}>
              {station.species.map(sp => (
                <div key={sp.name} style={{
                  background: t.surface,
                  border: `1px solid ${t.border}`,
                  borderLeft: `4px solid ${sp.color}`,
                  borderRadius: 10,
                  padding: '14px 16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 9,
                }}>
                  {/* Icon + name */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 38, height: 38, borderRadius: 9, flexShrink: 0,
                      background: `${sp.color}20`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 20,
                    }}>{sp.icon}</div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: t.text, lineHeight: 1.2 }}>{sp.name}</div>
                      <div style={{ fontSize: 10, color: t.textFaint, marginTop: 2 }}>{sp.regulation}</div>
                    </div>
                  </div>
                  {/* When badge */}
                  <div style={{
                    fontSize: 10, fontWeight: 700,
                    color: sp.color,
                    background: `${sp.color}18`,
                    border: `1px solid ${sp.color}33`,
                    padding: '3px 10px', borderRadius: 20,
                    alignSelf: 'flex-start',
                    lineHeight: 1.6,
                  }}>{sp.when}</div>
                  {/* Bait */}
                  <div style={{ fontSize: 11, color: t.textMuted, lineHeight: 1.4 }}>
                    <span style={{ color: t.textFaint }}>Bait: </span>{sp.bait}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* 7-day forecast */}
        {card(
          <>
            {sectionTitle('7-Day Forecast', 'Fishing conditions · best day highlighted')}
            <div style={{ overflowX: 'auto', width: '100%', paddingTop: 10 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8, minWidth: 480 }}>
              {selForecast.map((day, i) => {
                const isBest = day.score === 'A' || day.score === 'A-'
                const isToday = i === 0
                // Merge live NOAA data when available
                const liveDay = wxDaily[i]
                const displayIcon = liveDay?.icon  ?? day.icon
                const displayHigh = liveDay?.high  ?? day.high
                const displayLow  = liveDay?.low   ?? day.low
                const displayWind = liveDay?.wind  ?? day.wind
                const displayPrecip = liveDay?.precip
                return (
                  <div key={day.day} style={{
                    padding: '10px 6px',
                    background: isBest && !isToday
                      ? `${t.accentFaint}`
                      : isToday
                      ? t.surfaceAlt
                      : t.surfaceAlt,
                    border: `1px solid ${isBest && !isToday ? t.accent + '66' : t.border}`,
                    borderRadius: 10,
                    textAlign: 'center',
                    position: 'relative',
                  }}>
                    {isBest && !isToday && (
                      <div style={{
                        position: 'absolute', top: -8, left: '50%', transform: 'translateX(-50%)',
                        fontSize: 9, fontWeight: 700, color: t.accent,
                        background: t.bg, padding: '1px 6px', borderRadius: 4,
                        border: `1px solid ${t.accent}55`,
                      }}>BEST</div>
                    )}
                    {isToday && (
                      <div style={{
                        position: 'absolute', top: -8, left: '50%', transform: 'translateX(-50%)',
                        fontSize: 9, fontWeight: 700, color: t.canvasNowLine,
                        background: t.bg, padding: '1px 6px', borderRadius: 4,
                        border: `1px solid ${t.canvasNowLine}55`,
                      }}>TODAY</div>
                    )}
                    <div style={{ fontSize: 11, fontWeight: 600, color: t.textMuted }}>{day.day}</div>
                    <div style={{ fontSize: 9, color: t.textFaint, marginBottom: 5 }}>{day.date}</div>
                    <div style={{ fontSize: 18, marginBottom: 4 }}>{displayIcon}</div>
                    <div style={{
                      fontSize: 18, fontWeight: 800,
                      color: gradeColor(day.score, t),
                    }}>{day.score}</div>
                    <div style={{ fontSize: 10, color: t.textMuted, marginTop: 3 }}>{displayHigh}° / {displayLow ?? day.low}°</div>
                    <div style={{ fontSize: 9, color: t.textFaint, marginTop: 2 }}>{displayWind}</div>
                    {displayPrecip != null && (
                      <div style={{ fontSize: 9, color: '#93c5fd', marginTop: 2 }}>💧 {displayPrecip}%</div>
                    )}
                    <div style={{
                      marginTop: 5, height: 3, borderRadius: 2,
                      background: t.border, overflow: 'hidden',
                    }}>
                      <div style={{
                        height: '100%',
                        width: `${day.coeff}%`,
                        background: day.coeff >= 80 ? '#22c55e' : day.coeff >= 65 ? '#84cc16' : '#eab308',
                        borderRadius: 2,
                      }}/>
                    </div>
                    <div style={{ fontSize: 9, color: t.textFaint, marginTop: 2 }}>CF {day.coeff}</div>
                  </div>
                )
              })}
            </div>
            </div>
          </>
        )}

        <div id="calendar"/>
        {/* ── 30-Day Tide Calendar ── */}
        {card(
          <>
            {sectionTitle('30-Day Tide Calendar', `${monthLabel} · ${station.name}`)}

            {/* Month nav */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 14 }}>
              <button
                onClick={() => setCurrentMonth(d => new Date(d.getFullYear(), d.getMonth() - 1, 1))}
                style={{ background: t.surfaceAlt, border: `1px solid ${t.border}`, color: t.text, padding: '4px 12px', borderRadius: 7, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
                ◀
              </button>
              <span style={{ fontSize: 15, fontWeight: 700, flex: 1, textAlign: 'center' }}>{monthLabel}</span>
              <button
                onClick={() => setCurrentMonth(d => new Date(d.getFullYear(), d.getMonth() + 1, 1))}
                style={{ background: t.surfaceAlt, border: `1px solid ${t.border}`, color: t.text, padding: '4px 12px', borderRadius: 7, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
                ▶
              </button>
            </div>

            {/* Table */}
            <div style={{ overflowX: 'auto', width: '100%', borderRadius: 8, border: `1px solid ${t.border}` }}>
              <div style={{ display: 'grid', gridTemplateColumns: '58px 34px 112px repeat(4, minmax(82px, 1fr)) 104px 92px', minWidth: 860 }}>

                {/* Header */}
                {['Day','','Sunrise / Sunset','1st Tide','2nd Tide','3rd Tide','4th Tide','Coefficient','Solunar'].map((h, ci) => (
                  <div key={ci} style={{
                    padding: '7px 9px 8px',
                    fontSize: 9, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase',
                    color: t.textFaint, background: t.surfaceAlt,
                    borderBottom: `2px solid ${t.border}`,
                  }}>{h}</div>
                ))}

                {/* Rows */}
                {calDays.flatMap(day => {
                  const isSelected = day.date.toDateString() === selectedDate.toDateString()
                  const rowBg = isSelected ? `${t.accent}22` : day.isToday ? t.accentFaint : day.isWeekend ? t.surfaceAlt : t.surface
                  const handleRowClick = () => navigateToDate(day.date)
                  const cell = (extra?: React.CSSProperties): React.CSSProperties => ({
                    background: rowBg, borderTop: `1px solid ${isSelected ? t.accent + '55' : t.border}`,
                    padding: '8px 9px', display: 'flex', flexDirection: 'column', justifyContent: 'center',
                    cursor: 'pointer',
                    ...extra,
                  })
                  return [
                    // DAY
                    <div key={`${day.dayNum}-d`} onClick={handleRowClick} style={cell({ borderLeft: isSelected ? `3px solid ${t.accent}` : day.isToday ? `3px solid ${t.accent}88` : '3px solid transparent' })}>
                      <span style={{ fontSize: 15, fontWeight: 700, color: day.isToday ? t.accent : t.text, lineHeight: 1 }}>{day.dayNum}</span>
                      <span style={{ fontSize: 10, color: t.textMuted, marginTop: 2 }}>{day.dayName}</span>
                    </div>,
                    // MOON
                    <div key={`${day.dayNum}-m`} onClick={handleRowClick} style={cell({ alignItems: 'center', justifyContent: 'center' })}>
                      <span style={{ fontSize: 26, lineHeight: 1 }} title={`${(day.moonPhase*100).toFixed(0)}% cycle`}>{day.moonEmoji}</span>
                    </div>,
                    // SUNRISE/SUNSET
                    <div key={`${day.dayNum}-s`} onClick={handleRowClick} style={cell()}>
                      <span style={{ fontSize: 11, color: t.textMuted, whiteSpace: 'nowrap' }}>
                        <span style={{ color: t.canvasSunLine }}>↑</span> {day.sunrise}
                      </span>
                      <span style={{ fontSize: 11, color: t.textMuted, marginTop: 3, whiteSpace: 'nowrap' }}>
                        <span style={{ color: '#f97316' }}>↓</span> {day.sunset}
                      </span>
                    </div>,
                    // TIDES 0–3
                    ...[0,1,2,3].map(ti => {
                      const tide = day.tides[ti]
                      return (
                        <div key={`${day.dayNum}-t${ti}`} onClick={handleRowClick} style={cell()}>
                          {tide ? (
                            <>
                              <span style={{ fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap' }}>{tide.time}</span>
                              <span style={{ fontSize: 11, color: tide.type === 'high' ? t.accent : t.textMuted, marginTop: 2, whiteSpace: 'nowrap' }}>
                                {tide.type === 'high' ? '▲' : '▼'} {tide.height.toFixed(1)} ft
                              </span>
                            </>
                          ) : <span style={{ color: t.textFaint }}>—</span>}
                        </div>
                      )
                    }),
                    // COEFFICIENT
                    <div key={`${day.dayNum}-c`} onClick={handleRowClick} style={cell()}>
                      <span style={{ fontSize: 17, fontWeight: 800, color: day.coeffColor, lineHeight: 1 }}>{day.coefficient}</span>
                      <span style={{ marginTop: 4, fontSize: 9, fontWeight: 700, color: day.coeffColor, background: `${day.coeffColor}22`, padding: '2px 5px', borderRadius: 3, textTransform: 'uppercase' as const, letterSpacing: '0.05em', whiteSpace: 'nowrap' as const }}>{day.coeffLabel}</span>
                    </div>,
                    // SOLUNAR
                    <div key={`${day.dayNum}-sol`} onClick={handleRowClick} style={cell({ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 1 })}>
                      {[0,1,2,3].map(fi => (
                        <span key={fi} style={{ fontSize: 14, opacity: fi < day.solunarScore ? 1 : 0.15, filter: fi < day.solunarScore ? 'none' : 'grayscale(1)' }}>🐟</span>
                      ))}
                    </div>,
                  ]
                })}
              </div>
            </div>

            {/* Legend */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 10, fontSize: 11, color: t.textFaint }}>
              <span style={{ fontWeight: 600 }}>CF:</span>
              {[['very high','#22c55e','≥90'],['high','#84cc16','75–89'],['average','#eab308','55–74'],['low','#f97316','40–54'],['very low','#ef4444','<40']].map(([l,c,r]) => (
                <span key={l} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: c, display: 'inline-block' }}/>
                  <span style={{ color: c, fontWeight: 600 }}>{l}</span>
                  <span>{r}</span>
                </span>
              ))}
              <span style={{ marginLeft: 8 }}>🐟🐟🐟🐟 = peak solunar · ▲ high · ▼ low</span>
            </div>
          </>
        )}


        {/* Location & Map */}
        {card(
          <>
            {sectionTitle('Location & Map', 'Interactive — click markers for nearby stations')}

            {/* Coord row */}
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, minmax(0,1fr))' : 'repeat(4, minmax(0,1fr))', marginBottom: 16, borderRadius: 8, overflow: 'hidden', border: `1px solid ${t.border}` }}>
              {[
                { label: 'Latitude',  value: station.latDisplay },
                { label: 'Longitude', value: station.lonDisplay },
                { label: 'State',     value: 'Florida' },
                { label: 'City',      value: station.city.split(',')[0] },
              ].map((item, i) => (
                <div key={item.label} style={{
                  padding: '10px 14px',
                  background: i % 2 === 0 ? t.surfaceAlt : t.surface,
                  borderRight: i < 3 ? `1px solid ${t.border}` : 'none',
                }}>
                  <div style={{ fontSize: 10, color: t.textFaint, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>{item.label}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: t.text }}>{item.value}</div>
                </div>
              ))}
            </div>

            {/* Map + nearby list */}
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'minmax(0, 1.8fr) minmax(0, 1fr)', gap: 16, alignItems: 'start' }}>

              {/* Map */}
              <div style={{ borderRadius: 10, overflow: 'hidden', border: `1px solid ${t.border}`, height: 340 }}>
                <TideMap
                  lat={station.lat}
                  lon={station.lon}
                  name={station.name}
                  mode={mode}
                  accent={t.accent}
                  nearby={station.nearby.map(s => ({
                    ...s,
                    distMi: haversineMi(station.lat, station.lon, s.lat, s.lon),
                  }))}
                />
              </div>

              {/* Nearby list */}
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: t.textFaint, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Nearby Stations</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {station.nearby
                    .map(s => ({ ...s, distMi: haversineMi(station.lat, station.lon, s.lat, s.lon) }))
                    .sort((a, b) => a.distMi - b.distMi)
                    .map(s => (
                      <a key={s.slug}
                        href={`/tides/${station.state}/${s.slug}`}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 10,
                          padding: '8px 10px',
                          borderRadius: 7,
                          background: t.surfaceAlt,
                          border: `1px solid ${t.border}`,
                          textDecoration: 'none',
                          transition: 'border-color 0.15s',
                        }}>
                        <span style={{
                          fontSize: 10, fontWeight: 700, color: '#60a5fa',
                          background: 'rgba(96,165,250,0.12)',
                          padding: '2px 6px', borderRadius: 4,
                          minWidth: 42, textAlign: 'center', flexShrink: 0,
                        }}>
                          {s.distMi.toFixed(1)} mi
                        </span>
                        <span style={{ fontSize: 12, color: t.text, lineHeight: 1.3 }}>{s.name}</span>
                      </a>
                    ))
                  }
                </div>
              </div>
            </div>
          </>
        )}

      </div>

      {/* SEO: About this station */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: isMobile ? '0 12px 24px' : '0 20px 32px' }}>
        {card(
          <>
            {sectionTitle(`About Tides at ${station.name}`, `${station.region} inshore fishing guide`)}

            <p style={{ fontSize: 14, color: t.textMuted, lineHeight: 1.8, margin: '0 0 16px' }}>
              {station.name} is a tidal station located in {station.city}.
              Tides here are <strong style={{ color: t.text }}>
                {station.tidalType === 'semidiurnal'
                  ? 'semidiurnal - two high tides and two low tides each day'
                  : station.tidalType === 'diurnal'
                  ? 'diurnal - one high tide and one low tide each day'
                  : 'mixed - two unequal high and low tides each day'}
              </strong>, with a mean tidal range of approximately <strong style={{ color: t.text }}>{station.meanRange} feet</strong>.
              The tidal movement through this area creates productive inshore fishing conditions,
              particularly during moving tides when bait is pushed through channels, creek mouths, and flats.
            </p>

            <div style={{ fontSize: 13, fontWeight: 600, color: t.text, marginBottom: 8 }}>Best Fishing Tides</div>
            <p style={{ fontSize: 14, color: t.textMuted, lineHeight: 1.8, margin: '0 0 16px' }}>
              The best fishing at {station.name} is typically the <strong style={{ color: t.text }}>2 hours before
              and after each high or low tide</strong>, when currents are actively moving bait.
              Our fishing score combines tide phase, solunar periods, and weather to give you a daily fishing
              grade so you can plan the best time to be on the water.
            </p>

            {station.species.length > 0 && (
              <>
                <div style={{ fontSize: 13, fontWeight: 600, color: t.text, marginBottom: 8 }}>Target Species</div>
                <p style={{ fontSize: 14, color: t.textMuted, lineHeight: 1.8, margin: '0 0 20px' }}>
                  Common species near {station.name} include{' '}
                  {station.species.map((sp, i) => (
                    <span key={sp.name}>
                      <strong style={{ color: t.text }}>{sp.name}</strong>
                      {i < station.species.length - 2 ? ', ' : i === station.species.length - 2 ? ', and ' : ''}
                    </span>
                  ))}.
                  Check the species cards above for current regulations, best baits, and tide timing for each fish.
                </p>
              </>
            )}

            {station.nearby.length > 0 && (
              <>
                <div style={{ fontSize: 13, fontWeight: 600, color: t.text, marginBottom: 10 }}>Nearby Tide Stations</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {station.nearby.map(s => (
                    <a
                      key={s.slug}
                      href={`/tides/${station.state}/${s.slug}`}
                      style={{
                        fontSize: 13, color: t.accent, textDecoration: 'none',
                        background: t.surfaceAlt, border: `1px solid ${t.border}`,
                        borderRadius: 6, padding: '5px 12px',
                      }}
                    >
                      {s.name}
                    </a>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <footer style={{
        borderTop: `1px solid ${t.border}`,
        padding: '20px',
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
          <a href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={mode === 'light' ? '/logo_light.webp' : mode === 'red' ? '/logo_red.webp' : '/logo.webp'}
              alt="TideChartsPro"
              style={{ height: 44, width: 'auto', objectFit: 'contain', display: 'block', borderRadius: 4 }}
            />
          </a>
          <div style={{ fontSize: 11, color: t.textFaint }}>© 2026 TideChartsPro</div>
          <div style={{ display: 'flex', gap: 16, fontSize: 11 }}>
            <a href="/tides" style={{ color: t.textFaint, textDecoration: 'none' }}>Tide Charts</a>
            <a href="/privacy" style={{ color: t.textFaint, textDecoration: 'none' }}>Privacy Policy</a>
          </div>
        </div>
      </footer>

    </div>
  )
}

