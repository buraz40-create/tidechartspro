import React, { useMemo, useRef, useState } from 'react'
import { View, Text, PanResponder, Dimensions } from 'react-native'
import Svg, {
  Path, Line, Circle, Defs, LinearGradient, Stop,
  Text as SvgText, Rect,
} from 'react-native-svg'
import { TidePoint, TideExtreme, fmtTime } from '../lib/tides'
import { colors } from '../lib/theme'

interface Props {
  points:    TidePoint[]
  extremes:  TideExtreme[]
  nowMs:     number
  height?:   number
  sunriseH?: number
  sunsetH?:  number
}

const W   = Dimensions.get('window').width - 32
const PAD = { top: 80, bottom: 52, left: 48, right: 10 }

const HIGH_COLOR = '#38bdf8'  // cyan  — high tide
const LOW_COLOR  = '#818cf8'  // indigo — low tide
const BUBBLE_R   = 16

export default function TideChart({
  points, extremes, nowMs, height = 320, sunriseH, sunsetH,
}: Props) {
  const [scrub, setScrub] = useState<{ x: number; h: number; time: string } | null>(null)
  const layoutX = useRef(0)

  const derived = useMemo(() => {
    if (points.length < 2) return null

    const hs      = points.map(p => p.height)
    const maxTide = Math.max(...hs)
    // Dynamic Y scale — same headroom formula as web
    const maxH    = Math.max(6, Math.ceil(maxTide / 0.65))
    const startMs = points[0].time.getTime()
    const endMs   = points[points.length - 1].time.getTime()
    const totalMs = endMs - startMs
    const plotW   = W - PAD.left - PAD.right
    const plotH   = height - PAD.top - PAD.bottom

    const toX = (ms: number) => PAD.left + ((ms - startMs) / totalMs) * plotW
    const toY = (h: number)  => PAD.top  + plotH - (h / maxH) * plotH

    // Curve path + fill path
    let path = '', fill = ''
    points.forEach((p, i) => {
      const x = toX(p.time.getTime()), y = toY(p.height)
      if (i === 0) {
        path = `M ${x} ${y}`
        fill = `M ${x} ${height - PAD.bottom} L ${x} ${y}`
      } else {
        path += ` L ${x} ${y}`
        fill += ` L ${x} ${y}`
      }
    })
    fill += ` L ${toX(endMs)} ${height - PAD.bottom} Z`

    // NOW position
    const nowPct = Math.max(0, Math.min(1, (nowMs - startMs) / totalMs))
    const nowIdx = Math.max(0, Math.min(points.length - 1, Math.round(nowPct * (points.length - 1))))
    const nowX   = toX(nowMs)
    const nowY   = toY(points[nowIdx].height)

    // Y-axis grid
    const gridStep = maxH <= 8 ? 1 : maxH <= 14 ? 2 : 3
    const yLabels: { y: number; label: string }[] = []
    for (let ft = 0; ft <= maxH; ft += gridStep) {
      yLabels.push({ y: toY(ft), label: `${ft}ft` })
    }

    // X-axis labels every 3 hrs
    const xLabels: { x: number; label: string }[] = []
    for (let t = startMs; t <= endMs; t += 3 * 3600_000) {
      const x = toX(t)
      if (x < PAD.left + 10 || x > W - PAD.right - 5) continue
      const hr    = new Date(t).getHours()
      const label = hr === 0 ? '12a' : hr === 12 ? '12p' : hr < 12 ? `${hr}a` : `${hr - 12}p`
      xLabels.push({ x, label })
    }

    // Sunrise / sunset x positions
    let sunriseX: number | null = null, sunsetX: number | null = null
    if (sunriseH !== undefined) {
      const today0 = new Date(nowMs); today0.setHours(0, 0, 0, 0)
      sunriseX = toX(today0.getTime() + sunriseH * 3600_000)
      sunsetX  = toX(today0.getTime() + ((sunsetH ?? 19.75) * 3600_000))
    }

    // Pin data for each extreme
    const pins = extremes
      .map(ev => {
        const ms = ev.time.getTime()
        const x  = toX(ms)
        const y  = toY(ev.height)
        const isH = ev.type === 'H'
        // Bubble center: above the curve dot, clamped so it doesn't clip top
        const cyIdeal = y - 2 - BUBBLE_R
        const cy = Math.max(PAD.top + BUBBLE_R + 2, cyIdeal)
        return { ev, x, y, cy, isH, color: isH ? HIGH_COLOR : LOW_COLOR }
      })
      .filter(p => p.x >= PAD.left + 4 && p.x <= W - PAD.right - 4)

    return { path, fill, toX, toY, nowX, nowY, yLabels, xLabels,
             sunriseX, sunsetX, pins, startMs, endMs }
  }, [points, extremes, nowMs, height, sunriseH, sunsetH])

  const panResponder = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder:  () => true,
    onPanResponderGrant:   (e) => handleTouch(e.nativeEvent.pageX),
    onPanResponderMove:    (e) => handleTouch(e.nativeEvent.pageX),
    onPanResponderRelease: ()  => setTimeout(() => setScrub(null), 1800),
  })).current

  function handleTouch(pageX: number) {
    if (!derived) return
    const { startMs, endMs, toY } = derived
    const plotW = W - PAD.left - PAD.right
    const relX  = pageX - layoutX.current - PAD.left
    const pct   = Math.max(0, Math.min(1, relX / plotW))
    const ms    = startMs + pct * (endMs - startMs)
    const idx   = Math.max(0, Math.min(points.length - 1, Math.round(pct * (points.length - 1))))
    const h     = points[idx].height
    const svgX  = PAD.left + pct * plotW
    const time  = new Date(ms).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    setScrub({ x: svgX, h, time })
  }

  if (!derived) return null
  const { path, fill, toY, nowX, nowY, yLabels, xLabels, sunriseX, sunsetX, pins } = derived
  const plotTop    = PAD.top
  const plotBottom = height - PAD.bottom

  return (
    <View
      onLayout={e => { layoutX.current = e.nativeEvent.layout.x }}
      {...panResponder.panHandlers}
    >
      {/* Scrub tooltip */}
      {scrub && (
        <View style={{
          position: 'absolute', top: 2,
          left: Math.max(4, Math.min(W - 110, scrub.x - 50)),
          backgroundColor: '#0c1e35',
          borderWidth: 1, borderColor: colors.accent,
          borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5, zIndex: 10,
        }}>
          <Text style={{ fontSize: 15, fontWeight: '700', color: colors.tide }}>
            {scrub.h.toFixed(2)} ft
          </Text>
          <Text style={{ fontSize: 10, color: colors.textMuted }}>{scrub.time}</Text>
        </View>
      )}

      <Svg width={W} height={height}>
        <Defs>
          <LinearGradient id="tideFill" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={colors.tide} stopOpacity="0.38" />
            <Stop offset="1" stopColor={colors.tide} stopOpacity="0.04" />
          </LinearGradient>
        </Defs>

        {/* ── Night shading before sunrise ── */}
        {sunriseX !== null && sunriseX > PAD.left && (
          <Rect x={PAD.left} y={plotTop}
            width={Math.min(sunriseX - PAD.left, W - PAD.left - PAD.right)}
            height={plotBottom - plotTop} fill="rgba(5,10,25,0.72)" />
        )}
        {/* ── Night shading after sunset ── */}
        {sunsetX !== null && sunsetX < W - PAD.right && (
          <Rect x={sunsetX} y={plotTop}
            width={W - PAD.right - sunsetX}
            height={plotBottom - plotTop} fill="rgba(5,10,25,0.72)" />
        )}
        {/* ── Daytime golden tint ── */}
        {sunriseX !== null && sunsetX !== null && (
          <Rect
            x={Math.max(PAD.left, sunriseX)} y={plotTop}
            width={Math.min(W - PAD.right, sunsetX) - Math.max(PAD.left, sunriseX)}
            height={plotBottom - plotTop}
            fill="rgba(250,204,21,0.05)"
          />
        )}

        {/* ── Y-axis grid lines + labels ── */}
        {yLabels.map((l, i) => (
          <React.Fragment key={i}>
            <Line x1={PAD.left} y1={l.y} x2={W - PAD.right} y2={l.y}
              stroke={colors.border} strokeWidth={0.5} strokeDasharray="3,5" />
            <SvgText x={PAD.left - 5} y={l.y + 4} textAnchor="end"
              fontSize={9} fill={colors.textFaint}>{l.label}</SvgText>
          </React.Fragment>
        ))}

        {/* ── Tide fill + curve ── */}
        <Path d={fill} fill="url(#tideFill)" />
        <Path d={path} stroke={colors.tide} strokeWidth={2} fill="none" />

        {/* ── Sunrise dashed line ── */}
        {sunriseX !== null && sunriseX > PAD.left && sunriseX < W - PAD.right && (
          <>
            <Line x1={sunriseX} y1={plotTop} x2={sunriseX} y2={plotBottom}
              stroke="#fbbf24" strokeWidth={1} strokeDasharray="3,4" opacity={0.7} />
            <SvgText x={sunriseX + 3} y={plotTop + 10} fontSize={8} fill="#fbbf24">☀ rise</SvgText>
          </>
        )}
        {/* ── Sunset dashed line ── */}
        {sunsetX !== null && sunsetX > PAD.left && sunsetX < W - PAD.right && (
          <>
            <Line x1={sunsetX} y1={plotTop} x2={sunsetX} y2={plotBottom}
              stroke="#f97316" strokeWidth={1} strokeDasharray="3,4" opacity={0.7} />
            <SvgText x={sunsetX - 35} y={plotTop + 10} fontSize={8} fill="#f97316">set ☀</SvgText>
          </>
        )}

        {/* ── NOW line + pill ── */}
        <Line x1={nowX} y1={plotTop} x2={nowX} y2={plotBottom}
          stroke="#f43f5e" strokeWidth={2} strokeDasharray="4,3" />
        <Rect x={nowX - 14} y={plotTop - 1} width={28} height={13} rx={4} fill="#f43f5e" />
        <SvgText x={nowX} y={plotTop + 9} textAnchor="middle"
          fontSize={8} fill="#fff" fontWeight="700">NOW</SvgText>
        <Circle cx={nowX} cy={nowY} r={5} fill="#f43f5e" />
        <Circle cx={nowX} cy={nowY} r={2.5} fill={colors.bg} />

        {/* ── HIGH / LOW pins ── */}
        {pins.map(({ ev, x, y, cy, color }, i) => {
          const r    = BUBBLE_R
          const ptW  = 7
          // Teardrop: triangle tip at curve dot, base at bubble bottom
          const tri  = `M ${x} ${y} L ${x - ptW} ${cy + r - 4} L ${x + ptW} ${cy + r - 4} Z`
          const timeStr = fmtTime(ev.time)
          // Pill: below the bubble
          const pillW = timeStr.length * 5.8 + 12
          const pillH = 16
          const pillX = x - pillW / 2
          const pillY = cy + r + 5

          return (
            <React.Fragment key={i}>
              {/* Triangle teardrop (drawn first so bubble covers the base) */}
              <Path d={tri} fill={color} />
              {/* Bubble */}
              <Circle cx={x} cy={cy} r={r} fill={color} />
              {/* Height ft inside bubble */}
              <SvgText x={x} y={cy + 5} textAnchor="middle"
                fontSize={12} fill="#fff" fontWeight="700">
                {ev.height.toFixed(1)}
              </SvgText>
              {/* Time pill */}
              <Rect x={pillX} y={pillY} width={pillW} height={pillH} rx={4} fill={color} />
              <SvgText x={x} y={pillY + 11} textAnchor="middle"
                fontSize={9} fill="#fff" fontWeight="700">
                {timeStr}
              </SvgText>
              {/* Dot on curve */}
              <Circle cx={x} cy={y} r={5} fill={color} />
              <Circle cx={x} cy={y} r={2.5} fill="#fff" opacity={0.9} />
            </React.Fragment>
          )
        })}

        {/* ── Scrub crosshair ── */}
        {scrub && (
          <>
            <Line x1={scrub.x} y1={plotTop} x2={scrub.x} y2={plotBottom}
              stroke={colors.accent} strokeWidth={1.5} strokeDasharray="3,3" />
            <Circle cx={scrub.x} cy={toY(scrub.h)} r={5} fill={colors.accent} />
          </>
        )}

        {/* ── X-axis time labels ── */}
        {xLabels.map((l, i) => (
          <SvgText key={i} x={l.x} y={height - 7} textAnchor="middle"
            fontSize={8} fill={colors.textMuted}>{l.label}</SvgText>
        ))}
      </Svg>
    </View>
  )
}
