import React, { useState, useEffect, useMemo } from 'react'
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import {
  generateCurve, findExtremes, tidePhase, solunarForDate,
  fmtTime, type TidePoint,
} from '../lib/tides'
import { grade, type Colors } from '../lib/theme'
import { useTheme } from '../lib/ThemeContext'

const LAT = 30.3953
const LON = -81.4316

interface WxHour {
  time: string; hour: number; temp: number
  windSpeed: number; windDir: string; precip: number; condition: string
}

interface DayForecast {
  day: string; date: string
  high: number; low: number | null
  icon: string; wind: string; precip: number
  tideHigh: string; tideLow: string
  score: number
}

function condEmoji(s: string): string {
  const l = s.toLowerCase()
  if (l.includes('thunder'))                        return '⛈️'
  if (l.includes('rain') || l.includes('shower'))   return '🌧️'
  if (l.includes('drizzle'))                        return '🌦️'
  if (l.includes('snow'))                           return '❄️'
  if (l.includes('fog'))                            return '🌫️'
  if (l.includes('cloud') && l.includes('part'))    return '⛅'
  if (l.includes('cloud') || l.includes('overcast')) return '☁️'
  return '☀️'
}

function windDirDeg(dir: string): number {
  const map: Record<string, number> = {
    N:0, NNE:22, NE:45, ENE:67, E:90, ESE:112, SE:135, SSE:157,
    S:180, SSW:202, SW:225, WSW:247, W:270, WNW:292, NW:315, NNW:337,
  }
  return map[dir] ?? 0
}

function fishingScoreForDay(midnightMs: number): number {
  const noonMs = midnightMs + 12 * 3600_000
  const phase = tidePhase(noonMs)
  const tideScore = (phase > 0.1 && phase < 0.45) || (phase > 0.55 && phase < 0.9) ? 82 : 58
  const moonCycle = 29.53 * 24 * 3600_000
  const newMoonRef = new Date('2024-01-11').getTime()
  const moonAge = ((noonMs - newMoonRef) % moonCycle + moonCycle) % moonCycle
  const moonPct = moonAge / moonCycle
  const moonBoost = (moonPct < 0.08 || moonPct > 0.92 || Math.abs(moonPct - 0.5) < 0.08) ? 15 : 0
  return Math.min(100, tideScore + moonBoost)
}

export default function ForecastScreen() {
  const { colors } = useTheme()
  const s = useMemo(() => makeStyles(colors), [colors])
  const [now]        = useState(Date.now())
  const [wxHourly,  setWxHourly]  = useState<WxHour[]>([])
  const [wxLoading, setWxLoading] = useState(true)
  const [days,      setDays]      = useState<DayForecast[]>([])
  const [daysLoading, setDaysLoading] = useState(true)

  const midnightMs = useMemo(() => {
    const d = new Date(now); d.setHours(0, 0, 0, 0); return d.getTime()
  }, [now])

  const nowHour = new Date(now).getHours() + new Date(now).getMinutes() / 60

  const points: TidePoint[] = useMemo(() => generateCurve(midnightMs, 24), [midnightMs])
  const periods = useMemo(() => solunarForDate(new Date(now)), [now])

  // Fetch hourly weather
  useEffect(() => {
    const UA = { 'User-Agent': 'TideChartsPro/1.0 (tidechartspro.com)' }
    fetch(`https://api.weather.gov/points/${LAT},${LON}`, { headers: UA })
      .then(r => r.json())
      .then(meta => fetch(meta.properties.forecastHourly, { headers: UA }).then(r => r.json()))
      .then(hrData => {
        const hours: WxHour[] = hrData.properties.periods.slice(0, 24).map((p: any) => ({
          time:      new Date(p.startTime).toLocaleTimeString('en-US', { hour: 'numeric' }),
          hour:      new Date(p.startTime).getHours(),
          temp:      p.temperature,
          windSpeed: parseInt(p.windSpeed) || 0,
          windDir:   p.windDirection,
          precip:    p.probabilityOfPrecipitation?.value ?? 0,
          condition: p.shortForecast,
        }))
        setWxHourly(hours)
      })
      .catch(() => {})
      .finally(() => setWxLoading(false))
  }, [])

  // Fetch 7-day forecast — NOAA weather + NOAA tide predictions in parallel
  useEffect(() => {
    const today = new Date(now)
    today.setHours(0, 0, 0, 0)
    const pad = (n: number) => String(n).padStart(2, '0')
    const fmtDate = (d: Date) => `${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}`
    const plus7 = new Date(today); plus7.setDate(today.getDate() + 7)

    // Base tide info keyed by date string
    const tideDays: Omit<DayForecast, 'high'|'low'|'icon'|'wind'|'precip'>[] = []
    for (let i = 0; i < 7; i++) {
      const d = new Date(today.getTime() + i * 86_400_000)
      tideDays.push({
        day:      d.toLocaleDateString('en-US', { weekday: 'short' }),
        date:     d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        tideHigh: '—', tideLow: '—',
        score:    fishingScoreForDay(d.getTime()),
      })
    }

    // NOAA tide hilo predictions for next 7 days
    const tidePromise = fetch(
      `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter` +
      `?product=predictions&interval=hilo&begin_date=${fmtDate(today)}&end_date=${fmtDate(plus7)}` +
      `&datum=MLLW&station=8720218&time_zone=lst_ldt&units=english&format=json&application=TideChartsPro`
    )
      .then(r => r.json())
      .then((d: any) => {
        if (!d.predictions?.length) return
        const byDay = new Map<string, { highs: number[]; lows: number[] }>()
        for (const p of d.predictions) {
          const dk = p.t.slice(0, 10)
          if (!byDay.has(dk)) byDay.set(dk, { highs: [], lows: [] })
          const v = parseFloat(p.v)
          if (p.type === 'H') byDay.get(dk)!.highs.push(v)
          else                byDay.get(dk)!.lows.push(v)
        }
        for (let i = 0; i < 7; i++) {
          const d = new Date(today.getTime() + i * 86_400_000)
          const dk = `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`
          const entry = byDay.get(dk)
          if (entry) {
            tideDays[i].tideHigh = entry.highs.map(v => `${v.toFixed(1)}ft`).join(' / ') || '—'
            tideDays[i].tideLow  = entry.lows.map(v => `${v.toFixed(1)}ft`).join(' / ') || '—'
          }
        }
      })
      .catch(() => {})

    // NOAA weather forecast
    const UA = { 'User-Agent': 'TideChartsPro/1.0 (tidechartspro.com)' }
    const wxPromise = fetch(`https://api.weather.gov/points/${LAT},${LON}`, { headers: UA })
      .then(r => r.json())
      .then(meta => fetch(meta.properties.forecast, { headers: UA }).then(r => r.json()))

    Promise.all([tidePromise, wxPromise])
      .then(([, dayData]) => {
        const periods = (dayData as any).properties.periods
        const result: DayForecast[] = []
        let di = 0
        for (let i = 0; i < periods.length && di < 7; i++) {
          const p = periods[i]
          if (!p.isDaytime) continue
          const night = periods[i + 1]
          result.push({
            ...tideDays[di],
            high:   p.temperature,
            low:    night ? night.temperature : null,
            icon:   condEmoji(p.shortForecast),
            wind:   `${p.windDirection} ${parseInt(p.windSpeed) || 0}`,
            precip: p.probabilityOfPrecipitation?.value ?? 0,
          })
          di++
        }
        setDays(result)
      })
      .catch(() => setDays(tideDays.map(d => ({ ...d, high: 0, low: null, icon: '—', wind: '—', precip: 0 }))))
      .finally(() => setDaysLoading(false))
  }, [now])

  return (
    <SafeAreaView style={s.safe} edges={[]}>
      <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <Text style={s.pageTitle}>Weather</Text>
        <Text style={s.pageSub}>Pablo Creek Entrance · Jacksonville, FL</Text>

        {/* ── 7-Day Forecast ───────────────────────────────── */}
        <Text style={s.sectionTitle}>7-Day Forecast</Text>
        {daysLoading ? (
          <ActivityIndicator color={colors.accent} style={{ marginTop: 20 }} />
        ) : (
          days.map((d, i) => {
            const { letter, color: gc } = grade(d.score)
            const precipColor = d.precip >= 60 ? '#60a5fa' : d.precip >= 30 ? '#93c5fd' : colors.textMuted
            return (
              <View key={i} style={[s.dayCard, i === 0 && s.dayCardToday]}>
                {i === 0 && <View style={s.todayBadge}><Text style={s.todayBadgeText}>TODAY</Text></View>}
                <View style={s.dayTop}>
                  <View>
                    <Text style={s.dayName}>{d.day}</Text>
                    <Text style={s.dayDate}>{d.date}</Text>
                  </View>
                  <Text style={s.dayIcon}>{d.icon}</Text>
                  <View style={s.tempBlock}>
                    {d.high > 0 && <Text style={s.tempHigh}>{d.high}°</Text>}
                    {d.low != null && d.low > 0 && <Text style={s.tempLow}>{d.low}°</Text>}
                  </View>
                  <View style={[s.scoreBox, { borderColor: gc }]}>
                    <Text style={s.scoreLabel}>FISH</Text>
                    <Text style={[s.scoreLetter, { color: gc }]}>{letter}</Text>
                  </View>
                </View>
                <View style={s.dayDetails}>
                  <Detail label="High Tide" value={d.tideHigh} color={colors.tide} />
                  <Detail label="Low Tide"  value={d.tideLow}  color={colors.textMuted} />
                  <Detail label="Rain"      value={`${d.precip}%`} color={precipColor} />
                  {d.wind !== '—' && <Detail label="Wind" value={d.wind} color={colors.text} />}
                </View>
              </View>
            )
          })
        )}

        {/* ── Hourly Forecast card ─────────────────────────── */}
        <Text style={s.sectionTitle}>Hourly Forecast</Text>
        <View style={s.card}>
          <View style={s.cardHeader}>
            <Text style={s.cardTitle}>Next 24 Hours</Text>
            <Text style={s.cardChip}>Live NOAA</Text>
          </View>
          {wxLoading ? (
            <ActivityIndicator color={colors.accent} style={{ marginTop: 16 }} />
          ) : wxHourly.length === 0 ? (
            <Text style={s.empty}>Weather unavailable</Text>
          ) : (
            <>
              <View style={s.wxHeaderRow}>
                <Text style={[s.wxHdr, { width: 52 }]}>TIME</Text>
                <Text style={[s.wxHdr, { width: 22 }]}></Text>
                <Text style={[s.wxHdr, { width: 38 }]}>TEMP</Text>
                <Text style={[s.wxHdr, { width: 76 }]}>WIND</Text>
                <Text style={[s.wxHdr, { width: 36 }]}>PRECIP</Text>
                <Text style={[s.wxHdr, { width: 44 }]}>TIDE</Text>
                <Text style={[s.wxHdr, { width: 30 }]}>SOL</Text>
              </View>
              {wxHourly.map((h, i) => {
                const isNow       = h.hour === Math.floor(nowHour)
                const windColor   = h.windSpeed >= 20 ? colors.red : h.windSpeed >= 12 ? colors.yellow : colors.green
                const precipColor = h.precip >= 60 ? '#60a5fa' : h.precip >= 30 ? '#93c5fd' : colors.textMuted
                const deg         = windDirDeg(h.windDir)
                const tideIdx     = Math.min(points.length - 1, Math.round((h.hour / 24) * (points.length - 1)))
                const tideHt      = points[tideIdx]?.height ?? 0
                const tideRising  = tideIdx > 0 ? tideHt >= (points[tideIdx - 1]?.height ?? tideHt) : true
                const tideColor   = tideHt >= 3.5 ? colors.tide : tideHt >= 2 ? colors.textMuted : colors.textFaint
                const hourMs      = midnightMs + h.hour * 3600_000
                const solPeriod   = periods.find(p => hourMs >= p.start && hourMs < p.end)
                return (
                  <View key={i} style={[
                    s.wxRow,
                    { backgroundColor: isNow ? colors.accentFaint : i % 2 === 0 ? colors.surfaceAlt : colors.surface },
                  ]}>
                    {isNow && <View style={s.nowAccent} />}
                    <Text style={[s.wxTime, isNow && { color: colors.accent, fontWeight: '700' }]}>
                      {isNow ? '▶' : ''}{h.time}
                    </Text>
                    <Text style={{ width: 22, fontSize: 14, lineHeight: 18 }}>{condEmoji(h.condition)}</Text>
                    <Text style={s.wxTemp}>{h.temp}°</Text>
                    <View style={s.wxWind}>
                      <Text style={{ fontSize: 11, color: windColor, transform: [{ rotate: `${deg}deg` }], lineHeight: 14 }}>↑</Text>
                      <Text style={{ fontSize: 11, color: windColor, marginLeft: 2 }}>{h.windDir} {h.windSpeed}</Text>
                    </View>
                    <Text style={[s.wxPrecip, { color: precipColor }]}>{h.precip}%</Text>
                    <Text style={[s.wxTide, { color: tideColor }]}>
                      {tideRising ? '▲' : '▼'}{tideHt.toFixed(1)}
                    </Text>
                    <Text style={s.wxSol}>
                      {solPeriod ? (solPeriod.type === 'major' ? '🐟🐟' : '🐟') : '—'}
                    </Text>
                  </View>
                )
              })}
            </>
          )}
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  )
}

function Detail({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <Text style={{ fontSize: 9, fontWeight: '700', color: '#334155', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 }}>{label}</Text>
      <Text style={{ fontSize: 12, fontWeight: '600', color }}>{value}</Text>
    </View>
  )
}

const makeStyles = (colors: Colors) => StyleSheet.create({
  safe:         { flex: 1, backgroundColor: colors.bg },
  scroll:       { flex: 1 },
  content:      { padding: 16 },
  pageTitle:    { fontSize: 22, fontWeight: '800', color: colors.text, marginBottom: 2 },
  pageSub:      { fontSize: 12, color: colors.textMuted, marginBottom: 16 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: 10 },

  // Card
  card:       { backgroundColor: colors.surface, borderRadius: 18, padding: 16, borderWidth: 1, borderColor: colors.border, marginBottom: 20 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  cardTitle:  { fontSize: 15, fontWeight: '700', color: colors.text },
  cardChip:   { fontSize: 10, color: colors.textMuted, borderWidth: 1, borderColor: colors.border, borderRadius: 6, paddingHorizontal: 7, paddingVertical: 2 },
  empty:      { fontSize: 13, color: colors.textMuted, paddingVertical: 12, textAlign: 'center' },

  // Hourly table
  wxHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4, paddingHorizontal: 4 },
  wxHdr:       { fontSize: 9, fontWeight: '700', color: colors.textFaint, textTransform: 'uppercase' as const, letterSpacing: 0.5 },
  wxRow:       { flexDirection: 'row', alignItems: 'center', borderRadius: 6, marginBottom: 1, paddingVertical: 7, paddingHorizontal: 4 },
  nowAccent:   { position: 'absolute' as const, left: 0, top: 0, bottom: 0, width: 3, backgroundColor: colors.accent, borderRadius: 2 },
  wxTime:      { width: 52, fontSize: 11, color: colors.text },
  wxTemp:      { width: 38, fontSize: 13, fontWeight: '700' as const, color: '#facc15' },
  wxWind:      { width: 76, flexDirection: 'row' as const, alignItems: 'center' as const },
  wxPrecip:    { width: 36, fontSize: 11, fontWeight: '600' as const, textAlign: 'right' as const },
  wxTide:      { width: 44, fontSize: 11, fontWeight: '600' as const, textAlign: 'right' as const },
  wxSol:       { width: 30, fontSize: 13, textAlign: 'center' as const },

  // 7-day cards
  dayCard:        { backgroundColor: colors.surface, borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: colors.border },
  dayCardToday:   { borderColor: colors.accent },
  todayBadge:     { position: 'absolute', top: -1, right: 16, backgroundColor: colors.accent, borderBottomLeftRadius: 6, borderBottomRightRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  todayBadgeText: { fontSize: 9, fontWeight: '700', color: '#fff', letterSpacing: 1 },
  dayTop:         { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  dayName:        { fontSize: 16, fontWeight: '700', color: colors.text },
  dayDate:        { fontSize: 11, color: colors.textMuted },
  dayIcon:        { fontSize: 28 },
  tempBlock:      { flex: 1, alignItems: 'flex-end' },
  tempHigh:       { fontSize: 18, fontWeight: '700', color: colors.text },
  tempLow:        { fontSize: 13, color: colors.textMuted },
  scoreBox:       { width: 52, height: 52, borderRadius: 10, borderWidth: 2, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surfaceAlt },
  scoreLabel:     { fontSize: 7, fontWeight: '700', letterSpacing: 1, color: colors.textMuted },
  scoreLetter:    { fontSize: 22, fontWeight: '800', lineHeight: 26 },
  dayDetails:     { flexDirection: 'row', gap: 0, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 10 },
  detail:         { flex: 1, alignItems: 'center' },
  detailLabel:    { fontSize: 9, fontWeight: '700', color: colors.textFaint, textTransform: 'uppercase' as const, letterSpacing: 0.5, marginBottom: 2 },
  detailValue:    { fontSize: 12, fontWeight: '600' },
})
