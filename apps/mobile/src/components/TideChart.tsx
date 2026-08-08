import React, { useMemo, useRef, useState } from 'react'
import { View, Text, PanResponder } from 'react-native'
import Svg, {
  Path, Line, Circle, Defs, LinearGradient, Stop,
  Text as SvgText, Rect,
} from 'react-native-svg'
import { TidePoint, TideExtreme, fmtTime } from '../lib/tides'
import { useTheme } from '../lib/ThemeContext'

interface Props {
  points:    TidePoint[]
  extremes:  TideExtreme[]
  nowMs:     number
  height?:   number
  sunriseH?: number
  sunsetH?:  number
}

const PAD = { top: 60, bottom: 40, left: 38, right: 12 }
const BUBBLE_R = 15

export default function TideChart({
  points, extremes, nowMs, height = 300,
}: Props) {
  const { colors } = useTheme()
  const HIGH_COLOR = colors.tide            // teal — high tide
  const LOW_COLOR  = '#7C97A6'              // muted slate — low tide
  const NOW_COLOR  = '#E5533C'              // coral — the one "now" pop

  // Chart sizes itself to whatever container it lands in — no hardcoded width,
  // so it never overflows the card it sits in (padding differs per screen).
  const [w, setW] = useState(0)
  const [scrub, setScrub] = useState<{ x: number; h: number; time: string } | null>(null)
  const viewRef = useRef<View>(null)
  const geoRef = useRef({ screenX: 0 })
  const wRef = useRef(0); wRef.current = w
  const pointsRef = useRef(points); pointsRef.current = points

  const derived = useMemo(() => {
    if (points.length < 2 || w <= 0) return null

    const hs      = points.map(p => p.height)
    const maxTide = Math.max(...hs)
    const maxH    = Math.max(6, Math.ceil(maxTide / 0.65))
    const startMs = points[0].time.getTime()
    const endMs   = points[points.length - 1].time.getTime()
    const totalMs = endMs - startMs
    const plotW   = w - PAD.left - PAD.right
    const plotH   = height - PAD.top - PAD.bottom

    const toX = (ms: number) => PAD.left + ((ms - startMs) / totalMs) * plotW
    const toY = (h: number)  => PAD.top  + plotH - (h / maxH) * plotH

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

    const nowPct = Math.max(0, Math.min(1, (nowMs - startMs) / totalMs))
    const nowIdx = Math.max(0, Math.min(points.length - 1, Math.round(nowPct * (points.length - 1))))
    const nowX   = toX(nowMs)
    const nowY   = toY(points[nowIdx].height)

    const gridStep = maxH <= 8 ? 2 : maxH <= 14 ? 3 : 4
    const yLabels: { y: number; label: string }[] = []
    for (let ft = 0; ft <= maxH; ft += gridStep) {
      yLabels.push({ y: toY(ft), label: `${ft}` })
    }

    const xLabels: { x: number; label: string }[] = []
    for (let t = startMs; t <= endMs; t += 4 * 3600_000) {
      const x = toX(t)
      if (x < PAD.left + 8 || x > w - PAD.right - 5) continue
      const hr    = new Date(t).getHours()
      const label = hr === 0 ? '12a' : hr === 12 ? '12p' : hr < 12 ? `${hr}a` : `${hr - 12}p`
      xLabels.push({ x, label })
    }

    const pins = extremes
      .map(ev => {
        const ms = ev.time.getTime()
        const x  = toX(ms)
        const y  = toY(ev.height)
        const isH = ev.type === 'H'
        const cyIdeal = y - 2 - BUBBLE_R
        const cy = Math.max(PAD.top + BUBBLE_R + 2, cyIdeal)
        return { ev, x, y, cy, isH, color: isH ? HIGH_COLOR : LOW_COLOR }
      })
      .filter(p => p.x >= PAD.left + 4 && p.x <= w - PAD.right - 4)

    return { path, fill, toX, toY, nowX, nowY, yLabels, xLabels, pins, startMs, endMs, plotW }
  }, [points, extremes, nowMs, height, w, HIGH_COLOR])

  const panResponder = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder:  () => true,
    onPanResponderGrant:   (e) => handleTouch(e.nativeEvent.pageX),
    onPanResponderMove:    (e) => handleTouch(e.nativeEvent.pageX),
    onPanResponderRelease: ()  => setTimeout(() => setScrub(null), 1800),
  })).current

  // Map the absolute touch X into chart space using the view's measured screen
  // X (measured on layout; stable under vertical scroll). Snap both x and
  // height to the nearest sampled point so the dot lands exactly on the curve.
  function handleTouch(pageX: number) {
    const cw  = wRef.current
    const pts = pointsRef.current
    const n   = pts.length
    if (cw <= 0 || n < 2) return
    const plotW = cw - PAD.left - PAD.right
    const pct   = Math.max(0, Math.min(1, (pageX - geoRef.current.screenX - PAD.left) / plotW))
    const idx   = Math.round(pct * (n - 1))
    const h     = pts[idx].height
    const svgX  = PAD.left + (idx / (n - 1)) * plotW
    const time  = pts[idx].time.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    setScrub({ x: svgX, h, time })
  }

  return (
    <View
      ref={viewRef}
      style={{ width: '100%' }}
      onLayout={e => {
        const width = e.nativeEvent.layout.width
        setW(width)
        viewRef.current?.measureInWindow((x) => { geoRef.current = { screenX: x } })
      }}
      {...panResponder.panHandlers}
    >
      {!derived ? (
        <View style={{ height }} />
      ) : (
        <>
          {/* Scrub tooltip */}
          {scrub && (
            <View style={{
              position: 'absolute', top: 0,
              left: Math.max(4, Math.min(w - 96, scrub.x - 46)),
              backgroundColor: colors.surface,
              borderWidth: 1, borderColor: colors.border,
              borderRadius: 10, paddingHorizontal: 11, paddingVertical: 6, zIndex: 10,
              shadowColor: '#145a50', shadowOpacity: 0.16, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 3,
            }}>
              <Text style={{ fontSize: 15, fontWeight: '800', color: colors.tide }}>
                {scrub.h.toFixed(2)} ft
              </Text>
              <Text style={{ fontSize: 10, color: colors.textMuted }}>{scrub.time}</Text>
            </View>
          )}

          <Svg width={w} height={height}>
            <Defs>
              <LinearGradient id="tideFill" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor={colors.gradFrom} stopOpacity="0.30" />
                <Stop offset="1" stopColor={colors.gradFrom} stopOpacity="0.02" />
              </LinearGradient>
            </Defs>

            {/* Y-axis grid + labels */}
            {derived.yLabels.map((l, i) => (
              <React.Fragment key={i}>
                <Line x1={PAD.left} y1={l.y} x2={w - PAD.right} y2={l.y}
                  stroke={colors.border} strokeWidth={1} />
                <SvgText x={PAD.left - 6} y={l.y + 3.5} textAnchor="end"
                  fontSize={9} fontWeight="600" fill={colors.textFaint}>{l.label}</SvgText>
              </React.Fragment>
            ))}

            {/* Fill + curve */}
            <Path d={derived.fill} fill="url(#tideFill)" />
            <Path d={derived.path} stroke={colors.tide} strokeWidth={2.4} fill="none" strokeLinejoin="round" strokeLinecap="round" />

            {/* NOW marker */}
            <Line x1={derived.nowX} y1={PAD.top} x2={derived.nowX} y2={height - PAD.bottom}
              stroke={NOW_COLOR} strokeWidth={1.5} strokeDasharray="3,4" opacity={0.55} />
            <SvgText x={derived.nowX} y={PAD.top - 4} textAnchor="middle"
              fontSize={8} fontWeight="800" fill={NOW_COLOR}>NOW</SvgText>
            <Circle cx={derived.nowX} cy={derived.nowY} r={7} fill={NOW_COLOR} opacity={0.18} />
            <Circle cx={derived.nowX} cy={derived.nowY} r={3.4} fill={NOW_COLOR} />

            {/* HIGH / LOW pins */}
            {derived.pins.map(({ ev, x, y, cy, color }, i) => {
              const r    = BUBBLE_R
              const ptW  = 6
              const tri  = `M ${x} ${y} L ${x - ptW} ${cy + r - 4} L ${x + ptW} ${cy + r - 4} Z`
              const timeStr = fmtTime(ev.time)
              const pillW = timeStr.length * 5.6 + 12
              const pillH = 15
              const pillX = x - pillW / 2
              const pillY = cy - r - 3 - pillH   // above the bubble, clear of the curve line

              return (
                <React.Fragment key={i}>
                  <Path d={tri} fill={color} />
                  <Circle cx={x} cy={cy} r={r} fill={color} />
                  <SvgText x={x} y={cy + 4.5} textAnchor="middle"
                    fontSize={12} fill="#fff" fontWeight="800">
                    {ev.height.toFixed(1)}
                  </SvgText>
                  <Rect x={pillX} y={pillY} width={pillW} height={pillH} rx={7} fill={color} opacity={0.14} />
                  <SvgText x={x} y={pillY + 10.5} textAnchor="middle"
                    fontSize={9} fill={color} fontWeight="700">
                    {timeStr}
                  </SvgText>
                  <Circle cx={x} cy={y} r={4.5} fill={color} />
                  <Circle cx={x} cy={y} r={2} fill="#fff" />
                </React.Fragment>
              )
            })}

            {/* Scrub crosshair */}
            {scrub && (
              <>
                <Line x1={scrub.x} y1={PAD.top} x2={scrub.x} y2={height - PAD.bottom}
                  stroke={colors.accent} strokeWidth={1.5} strokeDasharray="3,3" />
                <Circle cx={scrub.x} cy={derived.toY(scrub.h)} r={5} fill={colors.accent} />
              </>
            )}

            {/* X-axis labels — skip any that fall under a pin, whose own time pill
                is already there (prevents the time-under-the-curve overlap). */}
            {derived.xLabels.map((l, i) => {
              const underPin = derived.pins.some(p => Math.abs(p.x - l.x) < 24)
              if (underPin) return null
              return (
                <SvgText key={i} x={l.x} y={height - 6} textAnchor="middle"
                  fontSize={8.5} fontWeight="600" fill={colors.textMuted}>{l.label}</SvgText>
              )
            })}
          </Svg>
        </>
      )}
    </View>
  )
}
