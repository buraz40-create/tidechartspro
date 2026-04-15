'use client'
import React, { useState, useMemo, useCallback, useEffect } from 'react'
import {
  View, Text, TextInput, TouchableOpacity,
  FlatList, ActivityIndicator, StyleSheet, Dimensions, ListRenderItem, ScrollView,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { WebView } from 'react-native-webview'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '../lib/ThemeContext'
import { useStation } from '../lib/StationContext'
import { type Colors } from '../lib/theme'
import { type StationType } from './TidesScreen'
import { STATIONS, REGIONS, type BStation } from '../data/stations'

const W = Dimensions.get('window').width

// ── Coastal US states ──────────────────────────────────────────────────────────
const COASTAL_STATES = [
  { code: 'ME', name: 'Maine',          emoji: '🎣', lat: 44.5, lon: -69.2 },
  { code: 'NH', name: 'New Hampshire',  emoji: '🎣', lat: 43.7, lon: -71.5 },
  { code: 'MA', name: 'Massachusetts',  emoji: '🎣', lat: 42.4, lon: -71.4 },
  { code: 'RI', name: 'Rhode Island',   emoji: '🎣', lat: 41.7, lon: -71.5 },
  { code: 'CT', name: 'Connecticut',    emoji: '🎣', lat: 41.6, lon: -72.7 },
  { code: 'NY', name: 'New York',       emoji: '🎣', lat: 40.7, lon: -74.0 },
  { code: 'NJ', name: 'New Jersey',     emoji: '🎣', lat: 39.8, lon: -74.5 },
  { code: 'DE', name: 'Delaware',       emoji: '🎣', lat: 38.9, lon: -75.5 },
  { code: 'MD', name: 'Maryland',       emoji: '🎣', lat: 38.7, lon: -76.5 },
  { code: 'VA', name: 'Virginia',       emoji: '🎣', lat: 37.0, lon: -76.3 },
  { code: 'NC', name: 'North Carolina', emoji: '🎣', lat: 34.7, lon: -77.4 },
  { code: 'SC', name: 'South Carolina', emoji: '🎣', lat: 32.8, lon: -79.9 },
  { code: 'GA', name: 'Georgia',        emoji: '🎣', lat: 31.1, lon: -81.5 },
  { code: 'FL', name: 'Florida',        emoji: '🎣', lat: 27.6, lon: -82.5 },
  { code: 'AL', name: 'Alabama',        emoji: '🎣', lat: 30.2, lon: -88.1 },
  { code: 'MS', name: 'Mississippi',    emoji: '🎣', lat: 30.4, lon: -89.1 },
  { code: 'LA', name: 'Louisiana',      emoji: '🎣', lat: 29.5, lon: -90.1 },
  { code: 'TX', name: 'Texas',          emoji: '🎣', lat: 28.7, lon: -96.5 },
  { code: 'CA', name: 'California',     emoji: '🎣', lat: 36.8, lon: -121.9 },
  { code: 'OR', name: 'Oregon',         emoji: '🎣', lat: 44.0, lon: -123.3 },
  { code: 'WA', name: 'Washington',     emoji: '🎣', lat: 47.6, lon: -122.3 },
  { code: 'AK', name: 'Alaska',         emoji: '🎣', lat: 61.2, lon: -149.9 },
  { code: 'HI', name: 'Hawaii',         emoji: '🎣', lat: 21.3, lon: -157.8 },
]

// Alphabetical order for display
const SORTED_STATES = [...COASTAL_STATES].sort((a, b) => a.name.localeCompare(b.name))

function buildUSMapHtml(markers: { lat: number; lon: number; name: string; code: string }[]): string {
  const markersJson = JSON.stringify(markers)
  return `<!DOCTYPE html>
<html><head>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"><\/script>
<style>
  html,body,#map{margin:0;padding:0;width:100%;height:100%;}
  .dot-marker{width:18px;height:18px;border-radius:50%;background:#2563eb;border:3px solid #fff;box-shadow:0 0 0 2px #2563eb;cursor:pointer;}
  .leaflet-popup-content-wrapper{background:#fff;border-radius:10px;box-shadow:0 4px 16px rgba(0,0,0,0.18);}
  .leaflet-popup-tip{background:#fff;}
  .leaflet-popup-content{margin:12px 16px 14px;min-width:170px;}
  .pu-title{font-weight:700;font-size:14px;color:#0f172a;margin-bottom:3px;}
  .pu-sub{font-size:11px;color:#64748b;margin-bottom:10px;}
  .pu-btn{display:block;width:100%;padding:9px 0;background:#2563eb;color:#fff;border:none;border-radius:8px;font-size:13px;font-weight:700;text-align:center;box-shadow:0 2px 6px rgba(37,99,235,0.4);}
  .leaflet-control-zoom{border:none!important;box-shadow:0 2px 8px rgba(0,0,0,0.2)!important;}
  .leaflet-control-zoom a{width:32px!important;height:32px!important;line-height:32px!important;font-size:18px!important;font-weight:700!important;background:#fff!important;color:#1e293b!important;border:none!important;}
  .leaflet-control-zoom a:first-child{border-radius:8px 8px 0 0!important;}
  .leaflet-control-zoom a:last-child{border-radius:0 0 8px 8px!important;}
</style>
</head><body>
<div id="map"></div>
<script>
var map = L.map('map',{center:[37,-96],zoom:3,zoomControl:true,attributionControl:false,scrollWheelZoom:false,doubleClickZoom:false});
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:18,subdomains:'abc'}).addTo(map);
var data = ${markersJson};
data.forEach(function(m){
  var dot = L.divIcon({html:'<div class="dot-marker"></div>',className:'',iconSize:[18,18],iconAnchor:[9,9]});
  var mk = L.marker([m.lat,m.lon],{icon:dot}).addTo(map);
  mk.bindPopup('<div class="pu-title">'+m.name+'</div><div class="pu-sub">Tap to browse stations</div><div class="pu-btn">View Stations \u2192</div>',{minWidth:190,closeButton:false});
  mk.on('click',function(){
    mk.openPopup();
    if(window.ReactNativeWebView) window.ReactNativeWebView.postMessage(JSON.stringify({code:m.code,name:m.name}));
  });
});
<\/script>
</body></html>`
}

function asStation(s: BStation, stateCode: string): StationType {
  return {
    name: s.name,
    city: stateCode,
    noaaId: s.id,
    waterTempId: s.id,
    lat: s.lat,
    lon: s.lon,
    meanRange: 0,
    species: [],
  }
}

const MAP_HTML = buildUSMapHtml(
  COASTAL_STATES.map(s => ({ lat: s.lat, lon: s.lon, name: s.name, code: s.code }))
)

// ── Main component ─────────────────────────────────────────────────────────────
export default function HomeScreen({ navigation }: { navigation: any }) {
  const { colors } = useTheme()
  const { setStation } = useStation()
  const s = useMemo(() => makeStyles(colors), [colors])

  const [query, setQuery]                 = useState('')
  const [selectedState, setSelectedState] = useState<typeof COASTAL_STATES[0] | null>(null)
  const [activeRegion, setActiveRegion]   = useState<string | null>(null)
  const [mapReady, setMapReady]           = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setMapReady(true), 800)
    return () => clearTimeout(t)
  }, [])

  // Regions for the selected state
  const stateRegions = useMemo(() => {
    if (!selectedState) return []
    return REGIONS[selectedState.code] ?? []
  }, [selectedState])

  // Station list — filtered by region (or all if no region selected)
  const displayStations: BStation[] = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (q) {
      // Global search across all states
      const all: BStation[] = []
      for (const list of Object.values(STATIONS)) all.push(...list)
      return all
        .filter(st => st.name.toLowerCase().includes(q))
        .sort((a, b) => a.name.localeCompare(b.name))
        .slice(0, 80)
    }
    if (!selectedState) return []
    const list = STATIONS[selectedState.code] ?? []
    const filtered = activeRegion
      ? list.filter(st => st.region === activeRegion)
      : list
    return [...filtered].sort((a, b) => a.name.localeCompare(b.name))
  }, [query, selectedState, activeRegion])

  const onStatePress = useCallback((st: typeof COASTAL_STATES[0]) => {
    setQuery('')
    setSelectedState(st)
    setActiveRegion(null)
  }, [])

  const onRegionPress = useCallback((region: string | null) => {
    setActiveRegion(region)
  }, [])

  const onStationPress = useCallback((station: BStation, code: string) => {
    setStation(asStation(station, code))
    navigation.navigate('Tides')
  }, [setStation, navigation])

  const renderStation: ListRenderItem<BStation> = useCallback(({ item }) => (
    <TouchableOpacity
      style={s.stationRow}
      onPress={() => onStationPress(item, selectedState?.code ?? '')}
      activeOpacity={0.7}
    >
      <View style={s.stationDot} />
      <View style={{ flex: 1 }}>
        <Text style={s.stationName}>{item.name}</Text>
        <Text style={s.stationSub}>{item.region} · ID {item.id}</Text>
      </View>
      <Ionicons name="chevron-forward" size={14} color={colors.textFaint} />
    </TouchableOpacity>
  ), [s, colors, onStationPress, selectedState])

  // FlatList header: map + state grid + region pills + list title
  // TextInput lives OUTSIDE this so the keyboard never dismisses on query change
  const ListHeader = useMemo(() => (
    <View style={{ paddingHorizontal: 16, paddingBottom: 0 }}>
      {/* Map + state grid — hidden while searching */}
      {!query && (
        <>
          <View style={s.mapCard}>
            <Text style={s.cardTitle}>Coastal Stations</Text>
            <Text style={s.cardSub}>Tap a state below to browse tide stations</Text>
            <View style={s.mapWrap}>
              {mapReady ? (
                <WebView
                  source={{ html: MAP_HTML }}
                  style={s.map}
                  scrollEnabled={false}
                  javaScriptEnabled
                  domStorageEnabled
                  cacheEnabled
                  originWhitelist={['*']}
                  onError={() => {}}
                  onMessage={e => {
                    try {
                      const data = JSON.parse(e.nativeEvent.data)
                      if (data.code) {
                        const st = COASTAL_STATES.find(cs => cs.code === data.code)
                        if (st) onStatePress(st)
                      }
                    } catch {}
                  }}
                />
              ) : (
                <View style={[s.map, { alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface }]}>
                  <ActivityIndicator color={colors.accent} />
                </View>
              )}
            </View>
          </View>

          {/* State grid — alphabetical */}
          <Text style={s.sectionLabel}>SELECT A STATE</Text>
          <View style={s.stateGrid}>
            {SORTED_STATES.map(st => (
              <TouchableOpacity
                key={st.code}
                style={[s.stateCard, selectedState?.code === st.code && { borderColor: colors.accent, backgroundColor: colors.accentFaint }]}
                onPress={() => onStatePress(st)}
              >
                <Text style={s.stateEmoji}>{st.emoji}</Text>
                <Text style={s.stateCode}>{st.code}</Text>
                <Text style={s.stateName} numberOfLines={1}>{st.name}</Text>
                <Text style={s.stateCount}>{(STATIONS[st.code]?.length ?? 0)}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Region filter pills — shown when a state is selected and has multiple regions */}
          {selectedState && stateRegions.length > 1 && (
            <>
              <Text style={s.sectionLabel}>{selectedState.name} — Browse by Region</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ marginBottom: 12 }}
                contentContainerStyle={{ gap: 8, paddingRight: 8 }}
              >
                <TouchableOpacity
                  style={[s.regionPill, !activeRegion && s.regionPillActive]}
                  onPress={() => onRegionPress(null)}
                >
                  <Text style={[s.regionPillText, !activeRegion && s.regionPillTextActive]}>
                    All ({STATIONS[selectedState.code]?.length ?? 0})
                  </Text>
                </TouchableOpacity>
                {stateRegions.map(r => (
                  <TouchableOpacity
                    key={r}
                    style={[s.regionPill, activeRegion === r && s.regionPillActive]}
                    onPress={() => onRegionPress(r)}
                  >
                    <Text style={[s.regionPillText, activeRegion === r && s.regionPillTextActive]}>
                      {r} ({(STATIONS[selectedState.code] ?? []).filter(st => st.region === r).length})
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </>
          )}
        </>
      )}

      {/* Results header */}
      {displayStations.length > 0 && (
        <View style={[s.card, { marginTop: 8 }]}>
          <Text style={s.cardTitle}>
            {query
              ? `Results for "${query}"`
              : activeRegion
                ? `${activeRegion}`
                : `${selectedState?.name} Stations`}
          </Text>
          <Text style={s.cardSub}>{displayStations.length} stations · tap to view tides</Text>
        </View>
      )}
    </View>
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ), [query, mapReady, selectedState, activeRegion, stateRegions, displayStations.length, colors, s, onStatePress, onRegionPress])

  return (
    <SafeAreaView style={s.safe} edges={[]}>
      {/* Search bar lives OUTSIDE FlatList — never remounts, keyboard stays open */}
      <View style={s.searchContainer}>
        <View style={s.searchWrap}>
          <Ionicons name="search" size={16} color={colors.textMuted} style={s.searchIcon} />
          <TextInput
            style={s.searchInput}
            placeholder="Search stations by name…"
            placeholderTextColor={colors.textMuted}
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
            autoCorrect={false}
            autoCapitalize="none"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')} style={s.searchClear}>
              <Ionicons name="close-circle" size={16} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <FlatList
        data={displayStations}
        keyExtractor={item => item.id}
        renderItem={renderStation}
        ListHeaderComponent={ListHeader}
        ListFooterComponent={<View style={{ height: 32 }} />}
        ListEmptyComponent={
          selectedState && !query ? (
            <View style={s.emptyWrap}>
              <Text style={s.emptyText}>No stations found.</Text>
            </View>
          ) : null
        }
        initialNumToRender={15}
        maxToRenderPerBatch={20}
        windowSize={5}
        removeClippedSubviews
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 16 }}
      />
    </SafeAreaView>
  )
}

const makeStyles = (colors: Colors) => StyleSheet.create({
  safe:       { flex: 1, backgroundColor: colors.bg },

  searchContainer: {
    paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8,
    backgroundColor: colors.bg,
  },
  searchWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.surface, borderRadius: 14, borderWidth: 2,
    borderColor: colors.accent, paddingHorizontal: 14,
    shadowColor: colors.accent, shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25, shadowRadius: 8, elevation: 4,
  },
  searchIcon:  { marginRight: 10 },
  searchInput: { flex: 1, height: 50, fontSize: 15, color: colors.text, fontWeight: '500' },
  searchClear: { padding: 4 },

  card:      { backgroundColor: colors.surface, borderRadius: 16, paddingHorizontal: 16, paddingVertical: 12, marginHorizontal: 16, marginBottom: 4, borderWidth: 1, borderColor: colors.border },
  cardTitle: { fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: 2 },
  cardSub:   { fontSize: 11, color: colors.textMuted },

  mapCard:   { backgroundColor: colors.surface, borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: colors.border },
  mapWrap:   { borderRadius: 12, overflow: 'hidden', marginTop: 8, height: 200 },
  map:       { flex: 1, backgroundColor: colors.bg },

  sectionLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 1, color: colors.textMuted, textTransform: 'uppercase', marginBottom: 10 },

  stateGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  stateCard: {
    width: (W - 32 - 24) / 4,
    backgroundColor: colors.surface, borderRadius: 12, borderWidth: 1,
    borderColor: colors.border, padding: 10, alignItems: 'center',
  },
  stateEmoji: { fontSize: 18, marginBottom: 2 },
  stateCode:  { fontSize: 14, fontWeight: '800', color: colors.text },
  stateName:  { fontSize: 9, color: colors.textMuted, marginTop: 1, textAlign: 'center' },
  stateCount: { fontSize: 9, color: colors.accent, marginTop: 2, fontWeight: '600' },

  regionPill: {
    paddingHorizontal: 14, paddingVertical: 7,
    borderRadius: 20, borderWidth: 1,
    borderColor: colors.border, backgroundColor: colors.surface,
  },
  regionPillActive: {
    borderColor: colors.accent, backgroundColor: colors.accentFaint,
  },
  regionPillText: { fontSize: 12, fontWeight: '600', color: colors.textMuted },
  regionPillTextActive: { color: colors.accent },

  emptyWrap:  { paddingHorizontal: 16, paddingTop: 8 },
  emptyText:  { fontSize: 13, color: colors.textMuted },

  stationRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingVertical: 11, paddingHorizontal: 16,
    borderBottomWidth: 1, borderBottomColor: colors.border,
    backgroundColor: colors.bg,
  },
  stationDot:  { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.accent, flexShrink: 0 },
  stationName: { fontSize: 13, fontWeight: '600', color: colors.text },
  stationSub:  { fontSize: 11, color: colors.textMuted, marginTop: 1 },
})
