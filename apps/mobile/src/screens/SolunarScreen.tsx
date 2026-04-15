import React, { useState, useMemo } from 'react'
import { View, Text, ScrollView, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Svg, { Circle, Path, Line, Text as SvgText } from 'react-native-svg'
import { type Colors } from '../lib/theme'
import { useTheme } from '../lib/ThemeContext'
import { solunarForDate } from '../lib/tides'

// ── Moon math ─────────────────────────────────────────────────────────────────
const NEW_MOON_REF = new Date('2024-01-11T11:57:00Z').getTime()
const CYCLE = 29.530588853 * 24 * 3600_000

function moonAge(nowMs: number): number {
  return ((nowMs - NEW_MOON_REF) % CYCLE + CYCLE) % CYCLE
}

function moonPhase(nowMs: number): { name: string; emoji: string; illumination: number; age: number } {
  const age = moonAge(nowMs)
  const pct = age / CYCLE
  const illumination = Math.round((1 - Math.cos(pct * 2 * Math.PI)) / 2 * 100)
  let name: string, emoji: string
  if (pct < 0.033)      { name = 'New Moon';        emoji = '🌑' }
  else if (pct < 0.133) { name = 'Waxing Crescent'; emoji = '🌒' }
  else if (pct < 0.200) { name = 'First Quarter';   emoji = '🌓' }
  else if (pct < 0.367) { name = 'Waxing Gibbous';  emoji = '🌔' }
  else if (pct < 0.433) { name = 'Full Moon';        emoji = '🌕' }
  else if (pct < 0.567) { name = 'Waning Gibbous';  emoji = '🌖' }
  else if (pct < 0.633) { name = 'Last Quarter';    emoji = '🌗' }
  else if (pct < 0.800) { name = 'Waning Crescent'; emoji = '🌘' }
  else                   { name = 'New Moon';        emoji = '🌑' }
  return { name, emoji, illumination, age: age / (24 * 3600_000) }
}



function fmtT(ms: number): string {
  return new Date(ms).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

// ── Moon disc SVG ─────────────────────────────────────────────────────────────
function MoonDisc({ illumination, pct }: { illumination: number; pct: number }) {
  const R = 48
  const cx = 56, cy = 56
  // Crescent/gibbous shape
  const phase = pct < 0.5 ? pct * 2 : (pct - 0.5) * 2
  const waxing = pct < 0.5
  const rx = Math.abs(Math.cos(phase * Math.PI)) * R
  const sweep = waxing ? (pct < 0.25 ? 0 : 1) : (pct < 0.75 ? 1 : 0)

  const d = `M ${cx} ${cy - R}
    A ${R} ${R} 0 1 1 ${cx} ${cy + R}
    A ${rx} ${R} 0 1 ${sweep} ${cx} ${cy - R} Z`

  return (
    <Svg width={112} height={112}>
      <Circle cx={cx} cy={cy} r={R} fill="#1e293b" />
      <Path d={d} fill="#facc15" opacity={0.9} />
    </Svg>
  )
}

// 24-hr timeline bar
function Timeline({ periods, nowMs }: { periods: ReturnType<typeof solunarForDate>; nowMs: number }) {
  const { colors } = useTheme()
  const W = 280, H = 48
  const day = new Date(nowMs); day.setHours(0, 0, 0, 0)
  const dayMs = day.getTime()
  const endMs = dayMs + 24 * 3600_000
  const toX = (ms: number) => ((ms - dayMs) / (24 * 3600_000)) * W
  const nowX = toX(nowMs)

  return (
    <Svg width={W} height={H}>
      {/* Background */}
      <Path d={`M 0 20 L ${W} 20`} stroke={colors.border} strokeWidth={2} />

      {/* Periods */}
      {periods.map((p, i) => {
        const x1 = Math.max(0, toX(p.start))
        const x2 = Math.min(W, toX(p.end))
        if (x2 < 0 || x1 > W) return null
        const color = p.type === 'major' ? colors.green : colors.yellow
        return (
          <Path
            key={i}
            d={`M ${x1} 12 L ${x2} 12 L ${x2} 28 L ${x1} 28 Z`}
            fill={color}
            opacity={0.6}
          />
        )
      })}

      {/* Hour marks */}
      {[6, 12, 18].map(h => {
        const x = toX(dayMs + h * 3600_000)
        return (
          <React.Fragment key={h}>
            <Line x1={x} y1={16} x2={x} y2={24} stroke={colors.border} strokeWidth={1} />
            <SvgText x={x} y={H - 4} textAnchor="middle" fontSize={8} fill={colors.textMuted}>
              {h === 12 ? '12PM' : h === 6 ? '6AM' : '6PM'}
            </SvgText>
          </React.Fragment>
        )
      })}

      {/* Now marker */}
      {nowX >= 0 && nowX <= W && (
        <Line x1={nowX} y1={8} x2={nowX} y2={32} stroke={colors.accent} strokeWidth={2} />
      )}
    </Svg>
  )
}

export default function SolunarScreen() {
  const { colors } = useTheme()
  const s = useMemo(() => makeStyles(colors), [colors])
  const [now] = useState(Date.now())
  const moon = moonPhase(now)
  const periods = solunarForDate(new Date(now))
  const nextPeriod = periods.find(p => p.end > now)

  return (
    <SafeAreaView style={s.safe} edges={[]}>
      <ScrollView style={s.scroll} contentContainerStyle={s.content}>
        <Text style={s.pageTitle}>Solunar Periods</Text>
        <Text style={s.pageSub}>Pablo Creek Entrance · Jacksonville, FL</Text>

        {/* Moon card */}
        <View style={s.card}>
          <View style={s.moonRow}>
            <MoonDisc illumination={moon.illumination} pct={moonAge(now) / CYCLE} />
            <View style={s.moonInfo}>
              <Text style={s.moonPhase}>{moon.name}</Text>
              <Text style={s.moonIllum}>{moon.illumination}% illuminated</Text>
              <Text style={s.moonAge}>Day {Math.floor(moon.age)} of cycle</Text>
              {(moon.illumination > 90 || moon.illumination < 10) && (
                <View style={s.moonBoostBadge}>
                  <Text style={s.moonBoostText}>🎣 Peak Fishing Moon</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Next period */}
        {nextPeriod && (
          <View style={[s.card, s.nextCard]}>
            <Text style={s.nextLabel}>NEXT {nextPeriod.type.toUpperCase()} PERIOD</Text>
            <Text style={s.nextTime}>{fmtT(nextPeriod.start)} – {fmtT(nextPeriod.end)}</Text>
            <Text style={s.nextDesc}>{nextPeriod.label}</Text>
            <View style={[s.typeBadge, { backgroundColor: nextPeriod.type === 'major' ? 'rgba(34,197,94,0.15)' : 'rgba(234,179,8,0.15)' }]}>
              <Text style={[s.typeText, { color: nextPeriod.type === 'major' ? colors.green : colors.yellow }]}>
                {nextPeriod.type === 'major' ? '★ Major — Best window' : '◈ Minor — Good window'}
              </Text>
            </View>
          </View>
        )}

        {/* Today's timeline */}
        <View style={s.card}>
          <Text style={s.cardTitle}>Today's Activity Windows</Text>
          <Text style={s.cardSub}>Green = Major · Yellow = Minor · Blue line = Now</Text>
          <View style={{ marginTop: 12, alignItems: 'center' }}>
            <Timeline periods={periods} nowMs={now} />
          </View>
        </View>

        {/* Period list */}
        <View style={s.card}>
          <Text style={s.cardTitle}>All Periods Today</Text>
          {periods.map((p, i) => {
            const isPast = p.end < now
            const isActive = p.start <= now && p.end >= now
            const color = p.type === 'major' ? colors.green : colors.yellow
            return (
              <View key={i} style={[s.periodRow, isPast && { opacity: 0.4 }]}>
                <View style={[s.periodDot, { backgroundColor: color, opacity: isActive ? 1 : 0.6 }]} />
                <View style={{ flex: 1 }}>
                  <Text style={s.periodLabel}>{p.label}</Text>
                  <Text style={s.periodTime}>{fmtT(p.start)} – {fmtT(p.end)}</Text>
                </View>
                {isActive && (
                  <View style={s.activeBadge}>
                    <Text style={s.activeText}>ACTIVE</Text>
                  </View>
                )}
                <Text style={[s.periodType, { color }]}>
                  {p.type === 'major' ? '★★' : '★'}
                </Text>
              </View>
            )
          })}
        </View>

        {/* What is solunar */}
        <View style={[s.card, { borderColor: colors.textFaint }]}>
          <Text style={s.cardTitle}>What Are Solunar Periods?</Text>
          <Text style={s.infoText}>
            Solunar theory (John Alden Knight, 1926) predicts fish activity based on the Moon's
            position. Major periods occur when the Moon is directly overhead or underfoot — fish
            feed most actively during these 1–2 hour windows. Minor periods coincide with moonrise
            and moonset (30–45 min windows). Combine with tide movement for best results.
          </Text>
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  )
}

const makeStyles = (colors: Colors) => StyleSheet.create({
  safe:      { flex: 1, backgroundColor: colors.bg },
  scroll:    { flex: 1 },
  content:   { padding: 16 },
  pageTitle: { fontSize: 22, fontWeight: '800', color: colors.text, marginBottom: 2 },
  pageSub:   { fontSize: 12, color: colors.textMuted, marginBottom: 20 },

  card:     { backgroundColor: colors.surface, borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: colors.border },
  cardTitle:{ fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: 2 },
  cardSub:  { fontSize: 11, color: colors.textMuted, marginBottom: 4 },

  moonRow:   { flexDirection: 'row', alignItems: 'center', gap: 16 },
  moonInfo:  { flex: 1 },
  moonPhase: { fontSize: 20, fontWeight: '700', color: colors.text },
  moonIllum: { fontSize: 14, color: colors.gold, marginTop: 4 },
  moonAge:   { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  moonBoostBadge: { marginTop: 8, backgroundColor: 'rgba(34,197,94,0.12)', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5, alignSelf: 'flex-start' },
  moonBoostText:  { fontSize: 12, fontWeight: '700', color: colors.green },

  nextCard:   { borderColor: colors.green },
  nextLabel:  { fontSize: 10, fontWeight: '700', letterSpacing: 1, color: colors.textMuted, marginBottom: 4 },
  nextTime:   { fontSize: 24, fontWeight: '800', color: colors.text },
  nextDesc:   { fontSize: 13, color: colors.textMuted, marginTop: 2, marginBottom: 8 },
  typeBadge:  { alignSelf: 'flex-start', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 },
  typeText:   { fontSize: 12, fontWeight: '700' },

  periodRow:  { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.border },
  periodDot:  { width: 8, height: 8, borderRadius: 4 },
  periodLabel:{ fontSize: 13, fontWeight: '600', color: colors.text },
  periodTime: { fontSize: 11, color: colors.textMuted, marginTop: 1 },
  activeBadge:{ backgroundColor: colors.accentFaint, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  activeText: { fontSize: 9, fontWeight: '700', color: colors.accent, letterSpacing: 0.5 },
  periodType: { fontSize: 16, marginLeft: 4 },

  infoText:  { fontSize: 13, color: colors.textMuted, lineHeight: 20 },
})
