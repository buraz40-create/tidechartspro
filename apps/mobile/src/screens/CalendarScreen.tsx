import React, { useState, useMemo, useEffect } from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { type Colors } from '../lib/theme'
import { useTheme } from '../lib/ThemeContext'
import { solunarForDate } from '../lib/tides'

const W = Dimensions.get('window').width

// ── Calendar math ─────────────────────────────────────────────────────────────
const CAL_REF   = new Date(2026, 3, 10).getTime()
const MOON_CYCLE = 29.530588853
const LAT = 30.3953, LON = -81.4316

function moonPhase(date: Date): number {
  const known = new Date('2000-01-06').getTime()
  const diff  = (date.getTime() - known) / (MOON_CYCLE * 86400_000)
  return diff - Math.floor(diff)
}
function moonEmoji(phase: number): string {
  if (phase < 0.033 || phase > 0.967) return '🌑'
  if (phase < 0.133) return '🌒'
  if (phase < 0.200) return '🌓'
  if (phase < 0.367) return '🌔'
  if (phase < 0.433) return '🌕'
  if (phase < 0.567) return '🌖'
  if (phase < 0.633) return '🌗'
  if (phase < 0.800) return '🌘'
  return '🌑'
}
function tideCoeff(phase: number, doy: number): number {
  return Math.round(Math.max(20, Math.min(120,
    70 + 30 * Math.cos(4 * Math.PI * phase) + 3 * Math.sin(doy * 0.7)
  )))
}
function dayOfYear(date: Date): number {
  return Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400_000)
}
function coeffColor(c: number): string {
  if (c >= 90) return '#22c55e'
  if (c >= 75) return '#84cc16'
  if (c >= 55) return '#eab308'
  if (c >= 40) return '#f97316'
  return '#ef4444'
}
function coeffLabel(c: number): string {
  if (c >= 90) return 'VERY HIGH'
  if (c >= 75) return 'HIGH'
  if (c >= 55) return 'AVERAGE'
  if (c >= 40) return 'LOW'
  return 'VERY LOW'
}
function coeffGrade(c: number): string {
  if (c >= 90) return 'A'
  if (c >= 80) return 'A-'
  if (c >= 70) return 'B+'
  if (c >= 60) return 'B'
  if (c >= 50) return 'C'
  if (c >= 40) return 'D'
  return 'F'
}
function calFmtHour(h: number): string {
  const hr   = Math.floor(h) % 24
  const min  = Math.round((h % 1) * 60)
  const ampm = hr >= 12 ? 'pm' : 'am'
  const h12  = hr % 12 || 12
  return `${h12}:${min.toString().padStart(2, '0')} ${ampm}`
}
function getSunTimes(date: Date): { rise: string; set: string } {
  const doy    = dayOfYear(date)
  const latRad = LAT * Math.PI / 180
  const decl   = -23.45 * Math.cos((360 / 365 * (doy + 10) * Math.PI) / 180) * Math.PI / 180
  const cosHA  = -Math.tan(latRad) * Math.tan(decl)
  const HA     = Math.acos(Math.max(-1, Math.min(1, cosHA))) * 180 / Math.PI
  const tz     = -4
  const lonCorr = (75 - Math.abs(LON)) / 15
  return {
    rise: calFmtHour(12 - HA / 15 + tz + lonCorr),
    set:  calFmtHour(12 + HA / 15 + tz + lonCorr),
  }
}
function generateTides(date: Date): { type: 'H'|'L'; time: string; height: number }[] {
  const dayOff = (date.getTime() - CAL_REF) / 86400_000
  const M2     = 12.4206
  const lag    = ((dayOff * 0.7176) % M2 + M2) % M2
  const phase  = moonPhase(date)
  const amp    = 2.1 + 0.6 * Math.cos(2 * Math.PI * phase)
  const high1  = (6.70 + lag) % 24
  const low1   = (0.23 + lag + M2) % 24
  const high2  = (high1 + M2) % 24
  const low2   = (low1  + M2) % 24
  const hH     = Math.round((2.75 + amp) * 10) / 10
  const lH     = Math.round(Math.max(0.1, 2.75 - amp * 0.85) * 10) / 10
  return [
    { type: 'H' as const, time: calFmtHour(high1), height: hH },
    { type: 'L' as const, time: calFmtHour(low1),  height: lH },
    { type: 'H' as const, time: calFmtHour(high2), height: Math.round(Math.max(0.5, hH - 0.15) * 10) / 10 },
    { type: 'L' as const, time: calFmtHour(low2),  height: Math.round(Math.max(0.1, lH + 0.1) * 10) / 10 },
  ].sort((a, b) => {
    const toH = (t: string) => {
      const m = t.match(/(\d+):(\d+)\s*(am|pm)/i)!
      let h = parseInt(m[1]); const mn = parseInt(m[2])
      if (m[3].toLowerCase() === 'pm' && h !== 12) h += 12
      if (m[3].toLowerCase() === 'am' && h === 12) h = 0
      return h + mn / 60
    }
    return toH(a.time) - toH(b.time)
  })
}

interface CalDay {
  date: Date; dayNum: number; dayName: string
  moonEmoji: string; coeff: number; grade: string; gradeColor: string
  tides: { type: 'H'|'L'; time: string; height: number }[]
  sun: { rise: string; set: string }
  solMajor: number; solMinor: number
  isToday: boolean; isWeekend: boolean
}

function buildMonth(year: number, month: number): CalDay[] {
  const days  = new Date(year, month + 1, 0).getDate()
  const today = new Date()
  return Array.from({ length: days }, (_, i) => {
    const date   = new Date(year, month, i + 1)
    const phase  = moonPhase(date)
    const doy    = dayOfYear(date)
    const coeff  = tideCoeff(phase, doy)
    const periods = solunarForDate(date)
    return {
      date, dayNum: i + 1,
      dayName:   date.toLocaleDateString('en-US', { weekday: 'short' }),
      moonEmoji: moonEmoji(phase),
      coeff, grade: coeffGrade(coeff), gradeColor: coeffColor(coeff),
      tides:     generateTides(date),
      sun:       getSunTimes(date),
      solMajor:  periods.filter(p => p.type === 'major').length,
      solMinor:  periods.filter(p => p.type === 'minor').length,
      isToday:   date.toDateString() === today.toDateString(),
      isWeekend: date.getDay() === 0 || date.getDay() === 6,
    }
  })
}

const NOAA_STATION = '8720218'  // Mayport — closest NOAA station to Pablo Creek

type LiveTideMap = Map<string, { type: 'H'|'L'; time: string; height: number }[]>

function parseNoaaHilo(predictions: any[]): LiveTideMap {
  const map: LiveTideMap = new Map()
  for (const p of predictions) {
    const dk = p.t.slice(0, 10)                           // "YYYY-MM-DD"
    const [hStr, mStr] = p.t.slice(11, 16).split(':')
    const hr = parseInt(hStr), mn = parseInt(mStr)
    const ampm = hr >= 12 ? 'pm' : 'am'
    const h12  = hr % 12 || 12
    const time = `${h12}:${String(mn).padStart(2,'0')} ${ampm}`
    if (!map.has(dk)) map.set(dk, [])
    map.get(dk)!.push({ type: p.type === 'H' ? 'H' : 'L', time, height: parseFloat(p.v) })
  }
  return map
}

export default function CalendarScreen() {
  const { colors } = useTheme()
  const s = useMemo(() => makeStyles(colors), [colors])
  const today  = new Date()
  const [year,  setYear]  = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [selected, setSelected] = useState<CalDay | null>(null)
  const [liveTides, setLiveTides] = useState<LiveTideMap | null>(null)
  const [tidesLoading, setTidesLoading] = useState(true)

  // Fetch NOAA hilo predictions for the current month
  useEffect(() => {
    setTidesLoading(true)
    const pad = (n: number) => String(n).padStart(2, '0')
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const begin = `${year}${pad(month + 1)}01`
    const end   = `${year}${pad(month + 1)}${daysInMonth}`
    fetch(
      `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter` +
      `?product=predictions&interval=hilo&begin_date=${begin}&end_date=${end}` +
      `&datum=MLLW&station=${NOAA_STATION}&time_zone=lst_ldt&units=english&format=json&application=TideChartsPro`
    )
      .then(r => r.json())
      .then(d => {
        if (d.predictions?.length) setLiveTides(parseNoaaHilo(d.predictions))
      })
      .catch(() => {})
      .finally(() => setTidesLoading(false))
  }, [year, month])

  const days = useMemo(() => buildMonth(year, month), [year, month])

  const spark30 = useMemo(() =>
    Array.from({ length: 30 }, (_, i) => {
      const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i)
      return tideCoeff(moonPhase(d), dayOfYear(d))
    })
  , [])

  const monthName = new Date(year, month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  const firstDow  = new Date(year, month, 1).getDay()
  const cellW     = Math.floor((W - 32) / 7)

  function prevMonth() {
    if (month === 0) { setYear(y => y - 1); setMonth(11) }
    else setMonth(m => m - 1)
  }
  function nextMonth() {
    if (month === 11) { setYear(y => y + 1); setMonth(0) }
    else setMonth(m => m + 1)
  }

  return (
    <SafeAreaView style={s.safe} edges={[]}>
      <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

        <View style={s.pageHeader}>
          <Text style={s.pageTitle}>30-Day Tide Calendar</Text>
          <Text style={s.pageSub}>Pablo Creek Entrance · Jacksonville, FL</Text>
        </View>

        {/* ── 30-Day table (horizontal scroll) ─────────────── */}
        <View style={s.card}>
          <View style={s.monthNav}>
            <TouchableOpacity onPress={prevMonth} style={s.navBtn}>
              <Ionicons name="chevron-back" size={20} color={colors.text} />
            </TouchableOpacity>
            <Text style={s.monthTitle}>{monthName}</Text>
            <TouchableOpacity onPress={nextMonth} style={s.navBtn}>
              <Ionicons name="chevron-forward" size={20} color={colors.text} />
            </TouchableOpacity>
          </View>

          {tidesLoading && (
            <Text style={{ fontSize: 10, color: colors.textFaint, marginBottom: 6 }}>
              Loading live NOAA tide predictions…
            </Text>
          )}
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View>
              {/* Table header */}
              <View style={s.tblHeader}>
                <Text style={[s.tblHdr, { width: 46 }]}>DAY</Text>
                <Text style={[s.tblHdr, { width: 66 }]}>SUNRISE{'\n'}SUNSET</Text>
                <Text style={[s.tblHdr, { width: 56 }]}>1ST TIDE</Text>
                <Text style={[s.tblHdr, { width: 56 }]}>2ND TIDE</Text>
                <Text style={[s.tblHdr, { width: 56 }]}>3RD TIDE</Text>
                <Text style={[s.tblHdr, { width: 56 }]}>4TH TIDE</Text>
                <Text style={[s.tblHdr, { width: 58 }]}>COEFF</Text>
                <Text style={[s.tblHdr, { width: 38 }]}>SOL</Text>
              </View>

              {/* Day rows */}
              {days.map((day, i) => {
                const isSelected = selected?.date.toDateString() === day.date.toDateString()
                const rowBg = day.isToday
                  ? colors.accentFaint
                  : isSelected
                  ? colors.surfaceAlt
                  : i % 2 === 0 ? colors.surface : colors.surfaceAlt
                return (
                  <TouchableOpacity
                    key={day.dayNum}
                    style={[s.tblRow, { backgroundColor: rowBg },
                      (day.isToday || isSelected) && { borderLeftWidth: 3, borderLeftColor: colors.accent },
                    ]}
                    onPress={() => setSelected(isSelected ? null : day)}
                    activeOpacity={0.7}
                  >
                    {/* DAY */}
                    <View style={[s.tblCell, { width: 46 }]}>
                      <Text style={[s.tblDayNum, day.isToday && { color: colors.accent }]}>{day.dayNum}</Text>
                      <Text style={s.tblDayName}>{day.dayName}</Text>
                      <Text style={s.tblMoon}>{day.moonEmoji}</Text>
                    </View>
                    {/* SUNRISE / SUNSET */}
                    <View style={[s.tblCell, { width: 66 }]}>
                      <Text style={s.tblSunRise}>↑ {day.sun.rise}</Text>
                      <Text style={s.tblSunSet}>↓ {day.sun.set}</Text>
                    </View>
                    {/* TIDES 1–4 — live NOAA when available, harmonic fallback */}
                    {(() => {
                      const dk = `${day.date.getFullYear()}-${String(day.date.getMonth()+1).padStart(2,'0')}-${String(day.date.getDate()).padStart(2,'0')}`
                      const tides = liveTides?.get(dk) ?? day.tides
                      return Array.from({ length: 4 }, (_, ti) => {
                        const t = tides[ti]
                        if (!t) return <View key={ti} style={[s.tblCell, { width: 56 }]} />
                        return (
                          <View key={ti} style={[s.tblCell, { width: 56 }]}>
                            <Text style={[s.tblTideTime, { color: t.type === 'H' ? colors.tide : '#818cf8' }]}>
                              {t.time}
                            </Text>
                            <Text style={[s.tblTideHt, { color: t.type === 'H' ? colors.tide : '#818cf8' }]}>
                              {t.type === 'H' ? '▲' : '▼'} {t.height} ft
                            </Text>
                          </View>
                        )
                      })
                    })()}
                    {/* COEFFICIENT */}
                    <View style={[s.tblCell, { width: 58 }]}>
                      <Text style={[s.tblCoeff, { color: day.gradeColor }]}>{day.coeff}</Text>
                      <View style={[s.tblCoeffBadge, { backgroundColor: day.gradeColor + '25' }]}>
                        <Text style={[s.tblCoeffLabel, { color: day.gradeColor }]}>{coeffLabel(day.coeff)}</Text>
                      </View>
                    </View>
                    {/* SOLUNAR */}
                    <View style={[s.tblCell, { width: 38 }]}>
                      <Text style={s.tblSol}>
                        {'🐟'.repeat(day.solMajor)}
                      </Text>
                      {day.solMinor > 0 && (
                        <Text style={[s.tblSol, { opacity: 0.45, fontSize: 9 }]}>
                          {'🐟'.repeat(day.solMinor)}
                        </Text>
                      )}
                    </View>
                  </TouchableOpacity>
                )
              })}
            </View>
          </ScrollView>
        </View>

        {/* ── 30-day strength bar ───────────────────────────── */}
        <View style={s.card}>
          <View style={s.cardHeader}>
            <Text style={s.cardTitle}>30-Day Tidal Strength</Text>
            <Text style={s.cardChip}>Fishing outlook</Text>
          </View>
          <View style={s.sparkRow}>
            {spark30.map((c, i) => (
              <View key={i} style={[s.sparkBar, {
                height: Math.max(8, (c / 120) * 44),
                backgroundColor: coeffColor(c),
                opacity: i === 0 ? 1 : 0.65,
                width: ((W - 64) / 30) - 1,
              }]} />
            ))}
          </View>
          <View style={s.sparkLegend}>
            {[['#22c55e','Very High'],['#84cc16','High'],['#eab308','Average'],['#f97316','Low']].map(([c, l]) => (
              <View key={l} style={s.legendItem}>
                <View style={[s.legendDot, { backgroundColor: c }]} />
                <Text style={s.legendText}>{l}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── Month grid calendar ───────────────────────────── */}
        <View style={s.card}>
          <View style={s.monthNav}>
            <TouchableOpacity onPress={prevMonth} style={s.navBtn}>
              <Ionicons name="chevron-back" size={20} color={colors.text} />
            </TouchableOpacity>
            <Text style={s.monthTitle}>{monthName}</Text>
            <TouchableOpacity onPress={nextMonth} style={s.navBtn}>
              <Ionicons name="chevron-forward" size={20} color={colors.text} />
            </TouchableOpacity>
          </View>
          {/* Day-of-week headers */}
          <View style={s.gridWeekRow}>
            {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => (
              <Text key={d} style={[s.gridWeekHdr, { width: cellW }]}>{d}</Text>
            ))}
          </View>
          {/* Grid cells */}
          <View style={s.gridBody}>
            {/* Leading empty cells */}
            {Array.from({ length: firstDow }).map((_, i) => (
              <View key={'e' + i} style={[s.gridCell, { width: cellW }]} />
            ))}
            {days.map(day => {
              const isSelected = selected?.date.toDateString() === day.date.toDateString()
              return (
                <TouchableOpacity
                  key={day.dayNum}
                  style={[s.gridCell, { width: cellW },
                    day.isToday   && s.gridCellToday,
                    isSelected    && s.gridCellSelected,
                  ]}
                  onPress={() => setSelected(isSelected ? null : day)}
                  activeOpacity={0.7}
                >
                  <Text style={[s.gridDayNum,
                    day.isToday  && { color: colors.accent },
                    day.isWeekend && { color: colors.textMuted },
                  ]}>{day.dayNum}</Text>
                  <Text style={s.gridMoon}>{day.moonEmoji}</Text>
                  <View style={[s.gridDot, { backgroundColor: day.gradeColor }]} />
                </TouchableOpacity>
              )
            })}
          </View>
        </View>

        {/* ── Selected day detail ───────────────────────────── */}
        {selected && (
          <View style={[s.card, { borderColor: selected.gradeColor + '60' }]}>
            <View style={s.cardHeader}>
              <Text style={s.cardTitle}>
                {selected.date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </Text>
              <Text style={[s.cardChip, { color: selected.gradeColor, borderColor: selected.gradeColor + '50' }]}>
                Fishing {selected.grade}
              </Text>
            </View>
            {/* Summary row */}
            <View style={s.detailRow}>
              <View style={s.detailBox}>
                <Text style={s.detailLabel}>MOON</Text>
                <Text style={s.detailMoon}>{selected.moonEmoji}</Text>
              </View>
              <View style={s.detailBox}>
                <Text style={s.detailLabel}>COEFF</Text>
                <Text style={[s.detailVal, { color: selected.gradeColor }]}>{selected.coeff}</Text>
                <Text style={[s.detailSubLabel, { color: selected.gradeColor }]}>{coeffLabel(selected.coeff)}</Text>
              </View>
              <View style={s.detailBox}>
                <Text style={s.detailLabel}>SUNRISE</Text>
                <Text style={s.detailSun}>↑ {selected.sun.rise}</Text>
                <Text style={s.detailSun}>↓ {selected.sun.set}</Text>
              </View>
            </View>
            {/* Tide times — live NOAA when available, harmonic fallback */}
            <Text style={s.tidesSectionTitle}>
              TIDE TIMES{liveTides ? ' · NOAA' : ' · Estimated'}
            </Text>
            <View style={s.tidesGrid}>
              {((() => {
                const dk = `${selected.date.getFullYear()}-${String(selected.date.getMonth()+1).padStart(2,'0')}-${String(selected.date.getDate()).padStart(2,'0')}`
                return liveTides?.get(dk) ?? selected.tides
              })()).map((t, i) => (
                <View key={i} style={[s.tideBox, {
                  borderColor: t.type === 'H' ? colors.accent + '50' : colors.border,
                  backgroundColor: t.type === 'H' ? colors.accentFaint : colors.surfaceAlt,
                }]}>
                  <Text style={[s.tideType, { color: t.type === 'H' ? colors.accent : colors.textMuted }]}>
                    {t.type === 'H' ? '▲ HIGH' : '▼ LOW'}
                  </Text>
                  <Text style={[s.tideTime, { color: t.type === 'H' ? colors.tide : colors.text }]}>
                    {t.time}
                  </Text>
                  <Text style={s.tideHeight}>{t.height} ft</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  )
}

const makeStyles = (colors: Colors) => StyleSheet.create({
  safe:      { flex: 1, backgroundColor: colors.bg },
  scroll:    { flex: 1 },
  content:   { padding: 16, gap: 14 },
  pageHeader:{ marginBottom: 4 },
  pageTitle: { fontSize: 22, fontWeight: '800', color: colors.text },
  pageSub:   { fontSize: 12, color: colors.textMuted, marginTop: 2 },

  card:       { backgroundColor: colors.surface, borderRadius: 18, padding: 16, borderWidth: 1, borderColor: colors.border },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  cardTitle:  { fontSize: 15, fontWeight: '700', color: colors.text },
  cardChip:   { fontSize: 10, color: colors.textMuted, borderWidth: 1, borderColor: colors.border, borderRadius: 6, paddingHorizontal: 7, paddingVertical: 2 },

  monthNav:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  navBtn:     { padding: 6 },
  monthTitle: { fontSize: 16, fontWeight: '700', color: colors.text },

  // Table
  tblHeader:    { flexDirection: 'row', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: colors.border, marginBottom: 2 },
  tblHdr:       { fontSize: 8, fontWeight: '700', color: colors.textFaint, letterSpacing: 0.5, textTransform: 'uppercase' as const },
  tblRow:       { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderRadius: 4, marginBottom: 1 },
  tblCell:      { paddingHorizontal: 4, justifyContent: 'center' as const },
  tblDayNum:    { fontSize: 14, fontWeight: '800', color: colors.text, lineHeight: 17 },
  tblDayName:   { fontSize: 9, color: colors.textFaint },
  tblSunRise:   { fontSize: 10, color: '#fbbf24', lineHeight: 14 },
  tblSunSet:    { fontSize: 10, color: '#818cf8', lineHeight: 14 },
  tblTideTime:  { fontSize: 11, fontWeight: '700', lineHeight: 14 },
  tblTideHt:    { fontSize: 9, lineHeight: 13, opacity: 0.8 },
  tblCoeff:     { fontSize: 18, fontWeight: '800', lineHeight: 22 },
  tblCoeffBadge:{ borderRadius: 4, paddingHorizontal: 4, paddingVertical: 1, alignSelf: 'flex-start' as const, marginTop: 1 },
  tblCoeffLabel:{ fontSize: 7, fontWeight: '700', letterSpacing: 0.3 },
  tblSol:       { fontSize: 11, lineHeight: 14 },
  tblMoon:      { fontSize: 10, lineHeight: 13 },

  // Spark bars
  sparkRow:    { flexDirection: 'row', alignItems: 'flex-end', gap: 1, height: 48, marginBottom: 10 },
  sparkBar:    { borderRadius: 2 },
  sparkLegend: { flexDirection: 'row', gap: 12, flexWrap: 'wrap' },
  legendItem:  { flexDirection: 'row', alignItems: 'center', gap: 4 },
  legendDot:   { width: 8, height: 8, borderRadius: 4 },
  legendText:  { fontSize: 10, color: colors.textMuted },

  // Detail panel
  detailRow:     { flexDirection: 'row', gap: 10, marginBottom: 14 },
  detailBox:     { flex: 1, backgroundColor: colors.surfaceAlt, borderRadius: 10, padding: 10, alignItems: 'center' },
  detailLabel:   { fontSize: 9, fontWeight: '700', color: colors.textFaint, letterSpacing: 1, marginBottom: 4 },
  detailSubLabel:{ fontSize: 8, fontWeight: '700', letterSpacing: 0.3 },
  detailMoon:    { fontSize: 24 },
  detailVal:     { fontSize: 22, fontWeight: '800' },
  detailSun:     { fontSize: 11, color: colors.textMuted, lineHeight: 16 },

  // Grid calendar
  gridWeekRow:      { flexDirection: 'row', marginBottom: 4 },
  gridWeekHdr:      { fontSize: 10, fontWeight: '700', color: colors.textFaint, textAlign: 'center' as const, paddingVertical: 4 },
  gridBody:         { flexDirection: 'row', flexWrap: 'wrap' as const },
  gridCell:         { alignItems: 'center' as const, paddingVertical: 6, borderRadius: 8 },
  gridCellToday:    { backgroundColor: colors.accentFaint, borderWidth: 1, borderColor: colors.accent + '60' },
  gridCellSelected: { backgroundColor: colors.surfaceAlt },
  gridDayNum:       { fontSize: 13, fontWeight: '700', color: colors.text, lineHeight: 16 },
  gridMoon:         { fontSize: 11, lineHeight: 14 },
  gridDot:          { width: 5, height: 5, borderRadius: 3, marginTop: 2 },

  // Tide boxes — time BIG, height small
  tidesSectionTitle: { fontSize: 9, fontWeight: '700', color: colors.textFaint, letterSpacing: 1, marginBottom: 8 },
  tidesGrid:    { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tideBox:      { flex: 1, flexBasis: '45%', borderRadius: 10, padding: 10, borderWidth: 1 },
  tideType:     { fontSize: 10, fontWeight: '700', letterSpacing: 0.5, marginBottom: 4 },
  tideTime:     { fontSize: 20, fontWeight: '800', marginBottom: 3 },
  tideHeight:   { fontSize: 12, color: colors.textMuted },
})
