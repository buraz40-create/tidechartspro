import React from 'react'
import { View, Text } from 'react-native'
import Svg, { Path, Ellipse, Circle } from 'react-native-svg'
import { useTheme } from '../lib/ThemeContext'

/**
 * TideChartsPro logo — a flat fish riding a tide wave.
 * Theme-aware: the mark takes the active accent (teal on light/dark,
 * red on night) and the eye knocks out to the page background, so it
 * stays in sync with all three modes automatically.
 */
export default function Logo({
  height = 34,
  showWordmark = true,
}: { height?: number; showWordmark?: boolean }) {
  const { colors } = useTheme()
  const markH = height
  const markW = markH * (120 / 106)

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 9 }}>
      <Svg width={markW} height={markH} viewBox="0 0 120 106">
        {/* dorsal fin */}
        <Path d="M50 42 Q58 27 76 33 Q67 40 61 45 Z" fill={colors.accent} />
        {/* body */}
        <Ellipse cx={58} cy={62} rx={31} ry={20} fill={colors.accent} />
        {/* tail */}
        <Path d="M30 62 L9 44 L16 62 L9 80 Z" fill={colors.accent} />
        {/* eye — knocks out to background */}
        <Circle cx={77} cy={56} r={3.4} fill={colors.bg} />
        {/* tide wave */}
        <Path
          d="M14 94 Q31 85 48 94 T82 94 T114 94"
          fill="none"
          stroke={colors.accent}
          strokeOpacity={0.5}
          strokeWidth={5}
          strokeLinecap="round"
        />
      </Svg>

      {showWordmark && (
        <Text style={{ fontSize: height * 0.6, fontWeight: '800', letterSpacing: -0.5, color: colors.text }}>
          TideCharts
          <Text style={{ fontWeight: '500', color: colors.textMuted }}>Pro</Text>
        </Text>
      )}
    </View>
  )
}
