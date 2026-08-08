export type ThemeMode = 'light' | 'dark' | 'red'

export const THEMES = {
  // ── Primary brand look: light + teal (2026 redesign) ──────────────
  light: {
    bg:          '#E9F4F1',
    surface:     '#FFFFFF',
    surfaceAlt:  '#F4FAF8',
    border:      '#E4EFEC',
    accent:      '#1EA593',
    accentFaint: 'rgba(30,165,147,0.10)',
    text:        '#0E2B28',
    textMuted:   '#6E8B87',
    textFaint:   '#9DB6B1',
    green:       '#2BB673',
    yellow:      '#E9A21C',
    red:         '#E5533C',
    tide:        '#1EA593',
    tideFill:    'rgba(55,208,188,0.18)',
    gold:        '#E9A21C',
    // redesign tokens
    gradFrom:    '#37D0BC',
    gradTo:      '#1EA593',
    onAccent:    '#EAFCF8',
    chip:        '#DDF3EF',
    chipText:    '#1EA593',
  },
  dark: {
    bg:          '#0a0e1a',
    surface:     '#111827',
    surfaceAlt:  '#161d2e',
    border:      '#1e2a3a',
    accent:      '#2DD4BF',
    accentFaint: 'rgba(45,212,191,0.10)',
    text:        '#e2e8f0',
    textMuted:   '#64748b',
    textFaint:   '#334155',
    green:       '#22c55e',
    yellow:      '#eab308',
    red:         '#ef4444',
    tide:        '#2DD4BF',
    tideFill:    'rgba(45,212,191,0.15)',
    gold:        '#facc15',
    gradFrom:    '#2DD4BF',
    gradTo:      '#14b8a6',
    onAccent:    '#04231f',
    chip:        'rgba(45,212,191,0.14)',
    chipText:    '#2DD4BF',
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
    gradFrom:    '#f87171',
    gradTo:      '#dc2626',
    onAccent:    '#2a0808',
    chip:        'rgba(248,113,113,0.14)',
    chipText:    '#f87171',
  },
}

export type Colors = typeof THEMES.light

// Backward-compat default export (light theme is now primary)
export const colors: Colors = THEMES.light

// Grade thresholds match website exactly
export const grade = (score: number) => {
  if (score >= 85) return { letter: 'A',  color: THEMES.light.green }
  if (score >= 75) return { letter: 'B+', color: '#34c98a' }
  if (score >= 65) return { letter: 'B',  color: '#34c98a' }
  if (score >= 55) return { letter: 'C+', color: THEMES.light.yellow }
  if (score >= 45) return { letter: 'C',  color: '#f0913a' }
  return              { letter: 'D',  color: THEMES.light.red }
}
