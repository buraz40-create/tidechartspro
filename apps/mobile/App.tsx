import React from 'react'
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native'
import { NavigationContainer, DefaultTheme } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'

import HomeScreen from './src/screens/HomeScreen'
import TidesScreen from './src/screens/TidesScreen'
import ForecastScreen from './src/screens/ForecastScreen'
import SolunarScreen from './src/screens/SolunarScreen'
import CalendarScreen from './src/screens/CalendarScreen'
import { ThemeProvider, useTheme } from './src/lib/ThemeContext'
import { StationProvider } from './src/lib/StationContext'

// ── Error boundary ────────────────────────────────────────────────────────────
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { error: null }
  }
  static getDerivedStateFromError(error: Error) { return { error } }
  render() {
    if (this.state.error) {
      return (
        <View style={eb.wrap}>
          <Text style={eb.title}>App crashed — error details:</Text>
          <Text style={eb.msg}>{this.state.error.message}</Text>
          <ScrollView style={{ marginTop: 12 }}>
            <Text style={eb.stack}>{this.state.error.stack}</Text>
          </ScrollView>
        </View>
      )
    }
    return this.props.children
  }
}
const eb = StyleSheet.create({
  wrap:  { flex: 1, backgroundColor: '#0a0e1a', padding: 24, paddingTop: 60 },
  title: { color: '#ef4444', fontSize: 18, fontWeight: '700', marginBottom: 8 },
  msg:   { color: '#e2e8f0', fontSize: 14, marginBottom: 4 },
  stack: { color: '#64748b', fontSize: 10, lineHeight: 16 },
})

const LOGOS = {
  dark:  require('./assets/logo.webp'),
  light: require('./assets/logo_light.webp'),
  red:   require('./assets/logo_red.webp'),
}

const Tab = createBottomTabNavigator()

function AppShell() {
  const { mode, colors, setMode } = useTheme()

  const navTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background:   colors.bg,
      card:         colors.surface,
      border:       colors.border,
      text:         colors.text,
      primary:      colors.accent,
      notification: colors.accent,
    },
  }

  const modeConfig: { key: typeof mode; dot: string; label: string }[] = [
    { key: 'dark',  dot: '#818cf8', label: 'Dark'  },
    { key: 'light', dot: '#fbbf24', label: 'Light' },
    { key: 'red',   dot: '#f87171', label: 'Night' },
  ]

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <StatusBar style={mode === 'light' ? 'dark' : 'light'} />

      {/* ── App header ─────────────────────────────────────── */}
      <SafeAreaView edges={['top']} style={{ backgroundColor: colors.bg, borderBottomWidth: 1, borderBottomColor: colors.border }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 8 }}>
          <Image
            source={LOGOS[mode]}
            style={{ height: 44, width: 182, resizeMode: 'contain' }}
          />
          <View style={{ flexDirection: 'row', gap: 6 }}>
            {modeConfig.map(m => (
              <TouchableOpacity
                key={m.key}
                onPress={() => setMode(m.key)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 5,
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  borderRadius: 20,
                  borderWidth: 1,
                  borderColor: mode === m.key ? m.dot : colors.border,
                  backgroundColor: mode === m.key ? m.dot + '22' : 'transparent',
                }}
              >
                <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: m.dot }} />
                <Text style={{ fontSize: 11, fontWeight: mode === m.key ? '700' : '500', color: mode === m.key ? m.dot : colors.textMuted }}>
                  {m.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </SafeAreaView>

      {/* ── Tab navigator ──────────────────────────────────── */}
      <NavigationContainer theme={navTheme}>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarActiveTintColor:   colors.accent,
            tabBarInactiveTintColor: colors.textMuted,
            tabBarStyle: {
              backgroundColor:  colors.surface,
              borderTopColor:   colors.border,
              borderTopWidth:   1,
              paddingBottom:    8,
              paddingTop:       6,
              height:           64,
            },
            tabBarLabelStyle: { fontSize: 11, fontWeight: '600', marginTop: 2 },
            tabBarIcon: ({ color, size, focused }) => {
              let name: keyof typeof Ionicons.glyphMap = 'home'
              if (route.name === 'Home')     name = focused ? 'home'         : 'home-outline'
              if (route.name === 'Tides')    name = focused ? 'water'        : 'water-outline'
              if (route.name === 'Weather')  name = focused ? 'partly-sunny' : 'partly-sunny-outline'
              if (route.name === 'Calendar') name = focused ? 'calendar'     : 'calendar-outline'
              if (route.name === 'Solunar')  name = focused ? 'moon'         : 'moon-outline'
              return <Ionicons name={name} size={size} color={color} />
            },
          })}
        >
          <Tab.Screen name="Home"     component={HomeScreen} />
          <Tab.Screen name="Tides"    component={TidesScreen} />
          <Tab.Screen name="Weather"  component={ForecastScreen} />
          <Tab.Screen name="Calendar" component={CalendarScreen} />
          <Tab.Screen name="Solunar"  component={SolunarScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </View>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <ThemeProvider>
          <StationProvider>
            <AppShell />
          </StationProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  )
}
