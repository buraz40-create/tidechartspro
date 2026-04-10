'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

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
    canvasDayBg: 'rgba(56,189,248,0.04)',
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

// ─── Static Data ─────────────────────────────────────────────────────────────

// Today's tide curve — hours 0–24, heights in feet (semi-diurnal)
function tideCurve(): number[] {
  const pts: number[] = []
  for (let i = 0; i <= 288; i++) {
    const t = (i / 288) * 24
    const h =
      2.75 +
      2.1 * Math.cos(((t - 6.7) * 2 * Math.PI) / 12.42) +
      0.35 * Math.cos(((t - 6.7) * 4 * Math.PI) / 12.42) +
      0.12 * Math.sin(((t - 3) * 2 * Math.PI) / 24)
    pts.push(Math.max(0, h))
  }
  return pts
}

const TIDE_CURVE = tideCurve()

const TIDE_EVENTS = [
  { label: 'Low',  time: '12:14 AM', height: 0.3, hour: 0.23 },
  { label: 'High', time: '6:42 AM',  height: 4.8, hour: 6.70 },
  { label: 'Low',  time: '1:18 PM',  height: 0.5, hour: 13.30 },
  { label: 'High', time: '7:33 PM',  height: 5.1, hour: 19.55 },
]

const SUNRISE_HOUR = 7.08   // 7:05 AM
const SUNSET_HOUR  = 19.92  // 7:55 PM
const NOW_HOUR     = 10.33  // 10:20 AM current time (demo)

// Pressure sparkline — 24 hourly readings (mb)
const PRESSURE_DATA = [
  1016, 1016, 1015, 1015, 1014, 1014, 1013, 1013,
  1013, 1012, 1012, 1011, 1011, 1012, 1012, 1013,
  1013, 1014, 1014, 1015, 1015, 1016, 1016, 1017,
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

// Species bite windows
const SPECIES = [
  {
    name: 'Redfish',
    icon: '🎣',
    grade: 'A',
    windows: [
      { start: 6.5,  end: 9.0,  label: '6:30–9:00 AM', hot: true },
      { start: 18.5, end: 20.5, label: '6:30–8:30 PM', hot: false },
    ],
    bait: 'Mullet chunk, DOA shrimp',
    regulation: 'Slot 18–27″ · 1/day',
  },
  {
    name: 'Spotted Seatrout',
    icon: '🐟',
    grade: 'B',
    windows: [
      { start: 7.0,  end: 9.5,  label: '7:00–9:30 AM', hot: true },
      { start: 16.0, end: 18.0, label: '4:00–6:00 PM', hot: false },
    ],
    bait: 'Mirrolure, live shrimp',
    regulation: 'Slot 15–19″ · 3/day',
  },
  {
    name: 'Snook',
    icon: '🐠',
    grade: 'B+',
    windows: [
      { start: 19.5, end: 22.0, label: '7:30–10:00 PM', hot: true },
    ],
    bait: 'Live pilchard, Zara Spook',
    regulation: 'Slot 28–33″ · Closed Jul–Aug',
  },
  {
    name: 'Flounder',
    icon: '🦈',
    grade: 'C',
    windows: [
      { start: 12.5, end: 14.5, label: '12:30–2:30 PM', hot: false },
    ],
    bait: 'Gulp! shrimp, mud minnow',
    regulation: '12″ min · 10/day',
  },
  {
    name: 'Sheepshead',
    icon: '🐡',
    grade: 'A-',
    windows: [
      { start: 6.0,  end: 8.5,  label: '6:00–8:30 AM', hot: true },
      { start: 17.0, end: 19.0, label: '5:00–7:00 PM', hot: false },
    ],
    bait: 'Fiddler crab, barnacle',
    regulation: '12″ min · 8/day',
  },
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

// 30-day tidal coefficient sparkline
const COEFF_30 = [
  72, 68, 63, 58, 54, 51, 55, 61, 68, 74,
  79, 84, 88, 90, 89, 85, 80, 74, 68, 63,
  59, 55, 53, 57, 63, 70, 77, 83, 87, 89,
]

// Nearby stations
const NEARBY = [
  'St. Johns River Entrance',
  'Mayport (Naval Station)',
  'Fort George Inlet',
  'Ponte Vedra Beach',
  'Nassau Sound',
  'Sisters Creek',
]

// Weather
const WEATHER = {
  temp: '74°F',
  feelsLike: '76°F',
  humidity: '72%',
  windSpeed: '8 kt',
  windDir: 'SE',
  visibility: '10 mi',
  cloudCover: '15%',
  uvIndex: '6',
  waterTemp: '68°F',
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

// ─── Canvas Painters ──────────────────────────────────────────────────────────

function drawTideChart(
  canvas: HTMLCanvasElement,
  t: Theme,
  dpr: number,
  hover?: { hour: number; height: number } | null,
) {
  const W = canvas.clientWidth
  const H = canvas.clientHeight
  canvas.width  = W * dpr
  canvas.height = H * dpr
  const ctx = canvas.getContext('2d')!
  ctx.scale(dpr, dpr)

  const PAD = { top: 18, right: 18, bottom: 36, left: 48 }
  const cw = W - PAD.left - PAD.right
  const ch = H - PAD.top  - PAD.bottom

  const maxH   = 6.0
  const toX    = (hour: number) => PAD.left + (hour / 24) * cw
  const toY    = (ht: number)   => PAD.top  + ch - (ht / maxH) * ch

  // ── background
  ctx.fillStyle = t.canvasBg
  ctx.fillRect(0, 0, W, H)

  // ── night shading (left block 0→sunrise, right block sunset→24)
  ctx.fillStyle = t.canvasNightBg
  ctx.fillRect(PAD.left, PAD.top, (SUNRISE_HOUR / 24) * cw, ch)
  ctx.fillRect(
    toX(SUNSET_HOUR), PAD.top,
    ((24 - SUNSET_HOUR) / 24) * cw, ch,
  )

  // ── day shading
  ctx.fillStyle = t.canvasDayBg
  ctx.fillRect(
    toX(SUNRISE_HOUR), PAD.top,
    ((SUNSET_HOUR - SUNRISE_HOUR) / 24) * cw, ch,
  )

  // ── grid lines (height)
  ctx.strokeStyle = t.canvasGrid
  ctx.lineWidth   = 0.5
  for (let h = 0; h <= 6; h++) {
    const y = toY(h)
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
  TIDE_CURVE.forEach((ht, i) => {
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
  TIDE_CURVE.forEach((ht, i) => {
    const hour = (i / 288) * 24
    if (i === 0) ctx.moveTo(toX(hour), toY(ht))
    else ctx.lineTo(toX(hour), toY(ht))
  })
  ctx.stroke()

  // ── sunrise / sunset lines
  ;[
    { hour: SUNRISE_HOUR, label: '↑ Sunrise 7:05', align: 'left' as const },
    { hour: SUNSET_HOUR,  label: 'Sunset 7:55 ↓',  align: 'right' as const },
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

  // ── NOW line
  const nowX = toX(NOW_HOUR)
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

  // ── teardrop pins for high/low events
  TIDE_EVENTS.forEach(ev => {
    const x  = toX(ev.hour)
    const y  = toY(ev.height)
    const isHigh = ev.label === 'High'
    const pinColor = isHigh ? t.canvasHighPin : t.canvasLowPin

    // stem
    ctx.strokeStyle = pinColor
    ctx.lineWidth   = 1.5
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(x, isHigh ? y - 28 : y + 28)
    ctx.stroke()

    // teardrop circle
    const cy = isHigh ? y - 36 : y + 36
    ctx.beginPath()
    ctx.arc(x, cy, 12, 0, Math.PI * 2)
    ctx.fillStyle   = pinColor
    ctx.fill()
    ctx.strokeStyle = t.canvasBg
    ctx.lineWidth   = 1
    ctx.stroke()

    // label inside pin
    ctx.fillStyle  = t.canvasBg
    ctx.font       = 'bold 7px system-ui'
    ctx.textAlign  = 'center'
    ctx.fillText(ev.height.toFixed(1), x, cy + 2.5)

    // time above/below pin
    ctx.fillStyle  = t.canvasPinText
    ctx.font       = '9px system-ui'
    ctx.fillText(ev.time, x, isHigh ? cy - 16 : cy + 24)

    // fish icon near low tides
    if (!isHigh) {
      ctx.font      = '13px system-ui'
      ctx.textAlign = 'center'
      ctx.fillText('🐟', x + 18, cy + 4)
    }
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

function drawPressureSparkline(canvas: HTMLCanvasElement, t: Theme, dpr: number) {
  const W = canvas.clientWidth
  const H = canvas.clientHeight
  canvas.width  = W * dpr
  canvas.height = H * dpr
  const ctx = canvas.getContext('2d')!
  ctx.scale(dpr, dpr)

  ctx.fillStyle = t.canvasBg
  ctx.fillRect(0, 0, W, H)

  const min = Math.min(...PRESSURE_DATA) - 1
  const max = Math.max(...PRESSURE_DATA) + 1
  const toX = (i: number) => (i / (PRESSURE_DATA.length - 1)) * W
  const toY = (v: number) => H - ((v - min) / (max - min)) * H * 0.8 - H * 0.1

  // fill
  ctx.beginPath()
  PRESSURE_DATA.forEach((v, i) => {
    if (i === 0) ctx.moveTo(toX(i), toY(v))
    else ctx.lineTo(toX(i), toY(v))
  })
  ctx.lineTo(W, H)
  ctx.lineTo(0, H)
  ctx.closePath()
  ctx.fillStyle = t.accentFaint
  ctx.fill()

  // line
  ctx.beginPath()
  ctx.strokeStyle = t.accent
  ctx.lineWidth   = 1.5
  PRESSURE_DATA.forEach((v, i) => {
    if (i === 0) ctx.moveTo(toX(i), toY(v))
    else ctx.lineTo(toX(i), toY(v))
  })
  ctx.stroke()
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

function calSunTimes(doy: number): { sunrise: string; sunset: string } {
  const LAT = (30.4 * Math.PI) / 180
  const decl = -23.45 * Math.cos((360/365*(doy+10)*Math.PI)/180)
  const HA = (Math.acos(Math.max(-1, Math.min(1, -Math.tan(LAT)*Math.tan(decl*Math.PI/180)))) * 180) / Math.PI
  const corr = (75-81.7)/15 + 1  // EDT + longitude offset
  return { sunrise: calFmtHour(12 - HA/15 + corr), sunset: calFmtHour(12 + HA/15 + corr) }
}

function calDayOfYear(date: Date): number {
  return Math.floor((date.getTime() - new Date(date.getFullYear(),0,0).getTime()) / 86400000)
}

const CAL_REF = new Date(2026, 3, 10)

function calGenerateTides(date: Date): CalTide[] {
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

function generateCalMonth(year: number, month: number): CalDay[] {
  const dim   = new Date(year, month+1, 0).getDate()
  const today = new Date()
  return Array.from({ length: dim }, (_, i) => {
    const date  = new Date(year, month, i+1)
    const doy   = calDayOfYear(date)
    const phase = calMoonPhase(date)
    const c     = calCoeff(phase, doy)
    const { sunrise, sunset } = calSunTimes(doy)
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

// ─── Score breakdown data ─────────────────────────────────────────────────────

const SCORE_FACTORS = [
  { label: 'Tide phase',       value: 88, note: 'Moving outgoing, near low — excellent' },
  { label: 'Solunar strength', value: 82, note: 'Major period in 25 min' },
  { label: 'Pressure trend',   value: 74, note: 'Rising slowly, stable' },
  { label: 'Wind & chop',      value: 90, note: 'SE 8 kt, minimal wave action' },
  { label: 'Water temp',       value: 72, note: '68°F — within optimal range' },
  { label: 'Moon phase',       value: 65, note: 'Waxing gibbous 71%' },
]

// ─── Component ────────────────────────────────────────────────────────────────

export default function PabloCreekEntrancePage() {
  const [mode, setMode] = useState<Mode>('dark')
  const t = THEMES[mode]

  const [currentMonth, setCurrentMonth] = useState<Date>(() => {
    const n = new Date(); return new Date(n.getFullYear(), n.getMonth(), 1)
  })
  const calDays    = generateCalMonth(currentMonth.getFullYear(), currentMonth.getMonth())
  const monthLabel = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  // ── Live clock ──
  const [now, setNow] = useState<Date>(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  // ── Derived tide status ──
  const nowHour    = now.getHours() + now.getMinutes() / 60 + now.getSeconds() / 3600
  const curveIdx   = Math.min(288, Math.round((nowHour / 24) * 288))
  const pastIdx    = Math.max(0, curveIdx - 12)   // ~1 hr ago (12 pts = 1 hr)
  const curHeight  = TIDE_CURVE[curveIdx]
  const pastHeight = TIDE_CURVE[pastIdx]
  const isRising   = curHeight >= pastHeight
  const ratePerHr  = Math.abs(curHeight - pastHeight)   // ft in last hour

  // Next tide event
  const nextEvent  = TIDE_EVENTS.find(e => e.hour > nowHour) ?? TIDE_EVENTS[0]
  const minsUntil  = Math.max(0, Math.round((nextEvent.hour - nowHour) * 60))
  const cntHrs     = Math.floor(minsUntil / 60)
  const cntMins    = minsUntil % 60
  const cntStr     = cntHrs > 0 ? `${cntHrs}h ${cntMins}m` : `${cntMins} min`

  // Slack water: within 25 min of a high or low
  const nearSlack  = TIDE_EVENTS.some(e => Math.abs(e.hour - nowHour) < 0.42)
  const tideSpeed  = Math.min(100, Math.round((ratePerHr / 1.2) * 100))   // % of max rate

  // Best window: major solunar + tide moving
  const majorPeriods = SOLUNAR.filter(s => s.type === 'major')
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
  const pressRef   = useRef<HTMLCanvasElement>(null)
  const swellRef   = useRef<HTMLCanvasElement>(null)
  const coeffRef   = useRef<HTMLCanvasElement>(null)

  const repaint = useCallback(() => {
    const dpr = window.devicePixelRatio || 1
    if (tideRef.current)  drawTideChart(tideRef.current,  t, dpr)
    if (pressRef.current) drawPressureSparkline(pressRef.current, t, dpr)
    if (swellRef.current) drawSwellChart(swellRef.current, t, dpr)
    if (coeffRef.current) drawCoeff30(coeffRef.current, t, dpr)
  }, [t])

  const [tooltip, setTooltip] = useState<{ x: number; y: number; hour: number; height: number } | null>(null)

  const handleTideMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = tideRef.current
    if (!canvas) return
    const rect  = canvas.getBoundingClientRect()
    const mx    = e.clientX - rect.left
    const my    = e.clientY - rect.top
    const cw    = rect.width - 48 - 18   // PAD.left=48, PAD.right=18
    const hour  = Math.max(0, Math.min(24, (mx - 48) / cw * 24))
    const idx   = Math.min(288, Math.round((hour / 24) * 288))
    const height = TIDE_CURVE[idx]
    setTooltip({ x: mx, y: my, hour, height })
    drawTideChart(canvas, t, window.devicePixelRatio || 1, { hour, height })
  }, [t])

  const handleTideMouseLeave = useCallback(() => {
    setTooltip(null)
    if (tideRef.current) drawTideChart(tideRef.current, t, window.devicePixelRatio || 1, null)
  }, [t])

  useEffect(() => {
    repaint()
    const ro = new ResizeObserver(repaint)
    ;[tideRef, pressRef, swellRef, coeffRef].forEach(r => r.current && ro.observe(r.current))
    return () => ro.disconnect()
  }, [repaint])

  // ── helpers
  const card = (children: React.ReactNode, extraStyle?: React.CSSProperties) => (
    <div style={{
      background: t.surface,
      border: `1px solid ${t.border}`,
      borderRadius: 12,
      padding: '18px 20px',
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

  const overallGrade = 'A'
  const bestDayIdx   = FORECAST.findIndex(d => d.score === 'A' && d.day !== 'Thu') || 6

  return (
    <div style={{ background: t.bg, color: t.text, minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif' }}>

      {/* ── Nav ── */}
      <nav style={{
        borderBottom: `1px solid ${t.border}`,
        background: `${t.bg}ee`,
        backdropFilter: 'blur(8px)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px', height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <a href="/" style={{ fontSize: 16, fontWeight: 600, color: t.text, textDecoration: 'none' }}>
            Tide<span style={{ color: t.accent }}>Charts</span>Pro
          </a>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            {(['dark', 'light', 'red'] as Mode[]).map(m => (
              <button key={m} onClick={() => setMode(m)} style={modeBtnStyle(m)}>
                {m === 'dark' ? '🌑 Dark' : m === 'light' ? '☀️ Light' : '🔴 Night'}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* ── Hero header ── */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 20px 0' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 8 }}>
          <div>
            <div style={{ fontSize: 11, color: t.textFaint, marginBottom: 4 }}>
              <a href="/tides/florida" style={{ color: t.textFaint, textDecoration: 'none' }}>Florida</a>
              <span style={{ margin: '0 6px' }}>/</span>
              <span style={{ color: t.textMuted }}>Pablo Creek Entrance</span>
            </div>
            <h1 style={{ fontSize: 26, fontWeight: 700, margin: 0, lineHeight: 1.2 }}>
              Pablo Creek Entrance
            </h1>
            <div style={{ fontSize: 13, color: t.textMuted, marginTop: 4 }}>
              NOAA Station 8720218 · Jacksonville, FL · 30.37°N 81.45°W
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
            <div style={{ fontSize: 11, color: t.textMuted }}>Excellent conditions</div>
          </div>
        </div>

        {/* info badges */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
          {[
            { k: 'Next High', v: '7:33 PM  5.1 ft' },
            { k: 'Next Low',  v: '1:18 PM  0.5 ft' },
            { k: 'Water Temp', v: '68°F' },
            { k: 'Tidal Range', v: '4.8 ft' },
            { k: 'Solunar', v: 'Major 8:45 AM' },
          ].map(b => (
            <div key={b.k} style={{
              background: t.surface,
              border: `1px solid ${t.border}`,
              borderRadius: 8,
              padding: '5px 12px',
              fontSize: 12,
            }}>
              <span style={{ color: t.textFaint }}>{b.k}: </span>
              <span style={{ color: t.text, fontWeight: 500 }}>{b.v}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Main grid ── */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px 40px', display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>

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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0 }}>

            {/* ① Tide now */}
            <div style={{ padding: '16px 18px', borderRight: `1px solid ${t.border}` }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: t.textFaint, marginBottom: 8 }}>
                Tide Now
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 4 }}>
                <span style={{ fontSize: 28, fontWeight: 800, color: isRising ? t.accent : '#818cf8', lineHeight: 1 }}>
                  {isRising ? '↑' : '↓'}
                </span>
                <span style={{ fontSize: 22, fontWeight: 800, color: t.text, lineHeight: 1 }}>
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
            <div style={{ padding: '16px 18px', borderRight: `1px solid ${t.border}` }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: t.textFaint, marginBottom: 8 }}>
                Next Event
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: nextEvent.label === 'High' ? t.accent : '#818cf8', marginBottom: 4 }}>
                {nextEvent.label === 'High' ? '▲' : '▼'} {nextEvent.label} Tide
              </div>
              <div style={{ fontSize: 26, fontWeight: 800, color: t.text, lineHeight: 1, marginBottom: 6, fontVariantNumeric: 'tabular-nums' }}>
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
              padding: '16px 18px',
              borderRight: `1px solid ${t.border}`,
              background: bwActive ? `${t.accent}0d` : 'transparent',
            }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: bwActive ? t.accent : t.textFaint, marginBottom: 8 }}>
                {bwActive ? '🔥 Best Window — Active Now' : '🔥 Best Window'}
              </div>
              <div style={{ fontSize: 18, fontWeight: 800, color: bwActive ? t.accent : t.text, lineHeight: 1.2, marginBottom: 4 }}>
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
            <div style={{ padding: '16px 18px' }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: t.textFaint, marginBottom: 8 }}>
                Conditions
              </div>
              {[
                { icon: '🌡️', label: 'Water', val: '68°F', sub: 'Optimal for redfish' },
                { icon: '📊', label: 'Pressure', val: '1016 mb', sub: '↗ Rising — fish active' },
                { icon: '💨', label: 'Wind',     val: 'SE 8 kt', sub: 'Light — good visibility' },
                { icon: '🌙', label: 'Solunar',  val: 'Major 8:45', sub: '2-hour window' },
              ].map(row => (
                <div key={row.label} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7 }}>
                  <span style={{ fontSize: 14, width: 20, textAlign: 'center' }}>{row.icon}</span>
                  <div>
                    <span style={{ fontSize: 12, fontWeight: 600, color: t.text }}>{row.val}</span>
                    <span style={{ fontSize: 10, color: t.textFaint, marginLeft: 6 }}>{row.sub}</span>
                  </div>
                </div>
              ))}
            </div>

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
        {card(
          <>
            {sectionTitle("Today's Tide Chart", "Thursday, April 10, 2026 · NOAA predicted + observed")}
            <div style={{ position: 'relative' }}>
              <canvas
                ref={tideRef}
                onMouseMove={handleTideMouseMove}
                onMouseLeave={handleTideMouseLeave}
                style={{ width: '100%', height: 220, display: 'block', borderRadius: 6, cursor: 'crosshair' }}
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
              {TIDE_EVENTS.map(ev => (
                <div key={ev.time} style={{ fontSize: 12 }}>
                  <span style={{
                    display: 'inline-block',
                    width: 8, height: 8, borderRadius: '50%',
                    background: ev.label === 'High' ? t.canvasHighPin : t.canvasLowPin,
                    marginRight: 5, verticalAlign: 'middle',
                  }}/>
                  <span style={{ color: t.textMuted }}>{ev.label}: </span>
                  <span style={{ fontWeight: 600 }}>{ev.time}</span>
                  <span style={{ color: t.textFaint }}> {ev.height} ft</span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Fishing score + Weather — two column */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 16 }}>

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
                  <div style={{ fontSize: 14, fontWeight: 600 }}>Excellent</div>
                  <div style={{ fontSize: 11, color: t.textMuted, marginTop: 2 }}>
                    Rising tide + major solunar period aligns 8:45 AM
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
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
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
              <div style={{ marginTop: 4 }}>
                <div style={{ fontSize: 11, color: t.textMuted, marginBottom: 6, display: 'flex', justifyContent: 'space-between' }}>
                  <span>Pressure (24h)</span>
                  <span style={{ color: '#22c55e' }}>↗ Rising · {WEATHER.pressureTrend}</span>
                </div>
                <canvas
                  ref={pressRef}
                  style={{ width: '100%', height: 50, display: 'block', borderRadius: 4 }}
                />
              </div>
            </>
          )}
        </div>

        {/* Swell chart */}
        {card(
          <>
            {sectionTitle('Swell & Wave Conditions', 'Hourly offshore data · direction arrows show wave propagation')}
            <canvas
              ref={swellRef}
              style={{ width: '100%', height: 110, display: 'block', borderRadius: 4, marginBottom: 10 }}
            />
            <div style={{ display: 'flex', gap: 20, fontSize: 12, flexWrap: 'wrap' }}>
              {[
                { k: 'Avg Height', v: '1.8 ft' },
                { k: 'Peak Period', v: '7 sec' },
                { k: 'Primary Dir', v: 'ESE 115°' },
                { k: 'Surf Quality', v: 'Flat / Calm' },
              ].map(s => (
                <div key={s.k}>
                  <span style={{ color: t.textFaint }}>{s.k}: </span>
                  <span style={{ fontWeight: 500 }}>{s.v}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Solunar + Species — two column */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1.4fr)', gap: 16 }}>

          {/* Solunar */}
          {card(
            <>
              {sectionTitle('Solunar Activity', 'Lunar transit periods · align with tide for best results')}
              <div style={{ position: 'relative', height: 44, background: t.surfaceAlt, borderRadius: 8, marginBottom: 16, overflow: 'hidden', border: `1px solid ${t.border}` }}>
                {SOLUNAR.map(s => {
                  const left  = (s.start / 24) * 100
                  const width = (s.dur   / 24) * 100
                  return (
                    <div key={s.label} style={{
                      position: 'absolute',
                      left:   `${left}%`,
                      width:  `${width}%`,
                      top:    s.type === 'major' ? 6 : 14,
                      height: s.type === 'major' ? 32 : 16,
                      borderRadius: 4,
                      background: s.type === 'major'
                        ? `${t.accent}55`
                        : `${t.accent}28`,
                      border: `1px solid ${t.accent}88`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden',
                    }}>
                      <span style={{ fontSize: 9, color: t.accent, fontWeight: 600, whiteSpace: 'nowrap', padding: '0 3px' }}>
                        {s.type === 'major' ? '●' : '○'}
                      </span>
                    </div>
                  )
                })}
                {/* now indicator */}
                <div style={{
                  position: 'absolute',
                  left: `${(NOW_HOUR / 24) * 100}%`,
                  top: 0, bottom: 0,
                  width: 1.5,
                  background: t.canvasNowLine,
                }}/>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {SOLUNAR.map(s => (
                  <div key={s.label} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    background: t.surfaceAlt,
                    border: `1px solid ${t.border}`,
                    borderRadius: 8,
                    borderLeft: `3px solid ${s.type === 'major' ? t.accent : t.textFaint}`,
                  }}>
                    <div>
                      <span style={{ fontSize: 12, fontWeight: 600, textTransform: 'capitalize' }}>{s.type}</span>
                      <span style={{ fontSize: 11, color: t.textMuted, marginLeft: 8 }}>{s.label}</span>
                    </div>
                    <span style={{
                      fontSize: 10,
                      padding: '2px 8px',
                      borderRadius: 4,
                      background: s.type === 'major' ? t.accentFaint : t.badge,
                      color: s.type === 'major' ? t.accent : t.textFaint,
                      fontWeight: 600,
                    }}>
                      {s.type === 'major' ? `${s.dur}h window` : `${s.dur}h window`}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Species bite times */}
          {card(
            <>
              {sectionTitle('Species Bite Windows', 'Location-specific for Pablo Creek Entrance area')}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {SPECIES.map(sp => (
                  <div key={sp.name} style={{
                    padding: '10px 12px',
                    background: t.surfaceAlt,
                    border: `1px solid ${t.border}`,
                    borderRadius: 9,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                        <span style={{ fontSize: 16 }}>{sp.icon}</span>
                        <span style={{ fontSize: 13, fontWeight: 600 }}>{sp.name}</span>
                      </div>
                      <span style={{
                        fontSize: 13, fontWeight: 700,
                        color: gradeColor(sp.grade, t),
                        background: `${gradeColor(sp.grade, t)}22`,
                        padding: '1px 7px', borderRadius: 4,
                      }}>{sp.grade}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 5 }}>
                      {sp.windows.map(w => (
                        <span key={w.label} style={{
                          fontSize: 11,
                          padding: '2px 8px',
                          borderRadius: 4,
                          background: w.hot ? t.accentFaint : t.badge,
                          color: w.hot ? t.accent : t.textMuted,
                          border: `1px solid ${w.hot ? t.accent + '55' : t.border}`,
                          fontWeight: 500,
                        }}>
                          {w.hot ? '🔥 ' : ''}{w.label}
                        </span>
                      ))}
                    </div>
                    <div style={{ fontSize: 10, color: t.textFaint }}>
                      <span style={{ color: t.textMuted }}>Bait: </span>{sp.bait}
                      <span style={{ marginLeft: 8, color: t.textFaint }}>· {sp.regulation}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* 7-day forecast */}
        {card(
          <>
            {sectionTitle('7-Day Forecast', 'Fishing conditions · best day highlighted')}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8 }}>
              {FORECAST.map((day, i) => {
                const isBest = day.score === 'A' || day.score === 'A-'
                const isToday = i === 0
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
                    <div style={{ fontSize: 18, marginBottom: 4 }}>{day.icon}</div>
                    <div style={{
                      fontSize: 18, fontWeight: 800,
                      color: gradeColor(day.score, t),
                    }}>{day.score}</div>
                    <div style={{ fontSize: 10, color: t.textMuted, marginTop: 3 }}>{day.high}° / {day.low}°</div>
                    <div style={{ fontSize: 9, color: t.textFaint, marginTop: 2 }}>{day.wind}</div>
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
          </>
        )}

        {/* ── 30-Day Tide Calendar ── */}
        {card(
          <>
            {sectionTitle('30-Day Tide Calendar', `${monthLabel} · Pablo Creek Entrance`)}

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
            <div style={{ overflowX: 'auto', borderRadius: 8, border: `1px solid ${t.border}` }}>
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
                  const rowBg = day.isToday ? t.accentFaint : day.isWeekend ? t.surfaceAlt : t.surface
                  const cell = (extra?: React.CSSProperties): React.CSSProperties => ({
                    background: rowBg, borderTop: `1px solid ${t.border}`,
                    padding: '8px 9px', display: 'flex', flexDirection: 'column', justifyContent: 'center',
                    ...extra,
                  })
                  return [
                    // DAY
                    <div key={`${day.dayNum}-d`} style={cell({ borderLeft: day.isToday ? `3px solid ${t.accent}` : '3px solid transparent' })}>
                      <span style={{ fontSize: 15, fontWeight: 700, color: day.isToday ? t.accent : t.text, lineHeight: 1 }}>{day.dayNum}</span>
                      <span style={{ fontSize: 10, color: t.textMuted, marginTop: 2 }}>{day.dayName}</span>
                    </div>,
                    // MOON
                    <div key={`${day.dayNum}-m`} style={cell({ alignItems: 'center', justifyContent: 'center' })}>
                      <span style={{ fontSize: 26, lineHeight: 1 }} title={`${(day.moonPhase*100).toFixed(0)}% cycle`}>{day.moonEmoji}</span>
                    </div>,
                    // SUNRISE/SUNSET
                    <div key={`${day.dayNum}-s`} style={cell()}>
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
                        <div key={`${day.dayNum}-t${ti}`} style={cell()}>
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
                    <div key={`${day.dayNum}-c`} style={cell()}>
                      <span style={{ fontSize: 17, fontWeight: 800, color: day.coeffColor, lineHeight: 1 }}>{day.coefficient}</span>
                      <span style={{ marginTop: 4, fontSize: 9, fontWeight: 700, color: day.coeffColor, background: `${day.coeffColor}22`, padding: '2px 5px', borderRadius: 3, textTransform: 'uppercase' as const, letterSpacing: '0.05em', whiteSpace: 'nowrap' as const }}>{day.coeffLabel}</span>
                    </div>,
                    // SOLUNAR
                    <div key={`${day.dayNum}-sol`} style={cell({ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 1 })}>
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

        {/* Tidal coefficient sparkline */}
        {card(
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
              {sectionTitle('30-Day Tidal Coefficient', 'Higher = stronger tides, better water movement')}
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: t.accent }}>82</div>
                <div style={{ fontSize: 10, color: t.textFaint }}>today</div>
              </div>
            </div>
            <canvas
              ref={coeffRef}
              style={{ width: '100%', height: 60, display: 'block', borderRadius: 4 }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 10, color: t.textFaint }}>
              <span>Apr 10</span>
              <span style={{ color: '#22c55e' }}>High coeff = better fishing</span>
              <span>May 9</span>
            </div>
          </>
        )}

        {/* Nearby stations */}
        {card(
          <>
            {sectionTitle('Nearby Stations', 'Northeast Florida · St. Johns River area')}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {NEARBY.map(s => (
                <a key={s}
                  href={`/tides/florida/${s.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`}
                  style={{
                    padding: '6px 14px',
                    background: t.chip,
                    border: `1px solid ${t.border}`,
                    borderRadius: 20,
                    fontSize: 12,
                    color: t.chipText,
                    textDecoration: 'none',
                    transition: 'all 0.15s',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                  }}>
                  <span style={{ fontSize: 10 }}>📍</span> {s}
                </a>
              ))}
            </div>
          </>
        )}

      </div>

      {/* Footer */}
      <footer style={{
        borderTop: `1px solid ${t.border}`,
        padding: '20px',
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
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
