export type ThemeMode = 'dark' | 'light' | 'red'

export const THEMES = {
  dark: {
    bg:          '#0a0e1a',
    surface:     '#111827',
    surfaceAlt:  '#161d2e',
    border:      '#1e2a3a',
    accent:      '#3b82f6',
    accentFaint: 'rgba(59,130,246,0.10)',
    text:        '#e2e8f0',
    textMuted:   '#64748b',
    textFaint:   '#334155',
    green:       '#22c55e',
    yellow:      '#eab308',
    red:         '#ef4444',
    tide:        '#38bdf8',
    tideFill:    'rgba(56,189,248,0.15)',
    gold:        '#facc15',
  },
  light: {
    bg:          '#f0f4f8',
    surface:     '#ffffff',
    surfaceAlt:  '#e8eef5',
    border:      '#cbd5e1',
    accent:      '#2563eb',
    accentFaint: 'rgba(37,99,235,0.10)',
    text:        '#0f172a',
    textMuted:   '#475569',
    textFaint:   '#94a3b8',
    green:       '#16a34a',
    yellow:      '#ca8a04',
    red:         '#dc2626',
    tide:        '#0284c7',
    tideFill:    'rgba(2,132,199,0.15)',
    gold:        '#d97706',
  },
  red: {
    bg:          '#0d0505',
    surface:     '#1a0a0a',
    surfaceAlt:  '#200e0e',
    border:      '#3d1515',
    accent:      '#f87171',
    accentFaint: 'rgba(248,113,113,0.10)',
    text:        '#fee2e2',
    textMuted:   '#fca5a5',
    textFaint:   '#7f1d1d',
    green:       '#4ade80',
    yellow:      '#fbbf24',
    red:         '#f87171',
    tide:        '#fca5a5',
    tideFill:    'rgba(252,165,165,0.12)',
    gold:        '#fbbf24',
  },
}

export type Colors = typeof THEMES.dark

// Backward-compat default export (dark theme)
export const colors: Colors = THEMES.dark

// Grade thresholds match website exactly
export const grade = (score: number) => {
  if (score >= 85) return { letter: 'A',  color: THEMES.dark.green }
  if (score >= 75) return { letter: 'B+', color: '#86efac' }
  if (score >= 65) return { letter: 'B',  color: '#86efac' }
  if (score >= 55) return { letter: 'C+', color: THEMES.dark.yellow }
  if (score >= 45) return { letter: 'C',  color: '#fb923c' }
  return              { letter: 'D',  color: THEMES.dark.red }
}
