import React, { createContext, useContext, useState } from 'react'
import { THEMES, ThemeMode, Colors } from './theme'

interface ThemeContextValue {
  mode: ThemeMode
  colors: Colors
  setMode: (m: ThemeMode) => void
}

const ThemeContext = createContext<ThemeContextValue>({
  mode: 'dark',
  colors: THEMES.dark,
  setMode: () => {},
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>('dark')
  return (
    <ThemeContext.Provider value={{ mode, colors: THEMES[mode], setMode }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
