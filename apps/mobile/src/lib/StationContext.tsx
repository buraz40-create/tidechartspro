import React, { createContext, useContext, useState } from 'react'
import { type StationType } from '../screens/TidesScreen'

const DEFAULT_STATION: StationType = {
  name: 'Pablo Creek Entrance',
  city: 'Jacksonville, FL',
  noaaId:      '8720232',
  waterTempId: '8720503',
  lat: 30.3953,
  lon: -81.4316,
  meanRange: 4.6,
  species: ['Redfish', 'Flounder', 'Speckled Trout', 'Sheepshead', 'Black Drum'],
}

interface StationContextValue {
  station: StationType
  setStation: (s: StationType) => void
}

const StationContext = createContext<StationContextValue>({
  station: DEFAULT_STATION,
  setStation: () => {},
})

export function StationProvider({ children }: { children: React.ReactNode }) {
  const [station, setStation] = useState<StationType>(DEFAULT_STATION)
  return (
    <StationContext.Provider value={{ station, setStation }}>
      {children}
    </StationContext.Provider>
  )
}

export function useStation() {
  return useContext(StationContext)
}
