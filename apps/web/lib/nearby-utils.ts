import type { StationConfig, NearbyStation } from './florida-stations'

export function haversineMi(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3958.8
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = Math.sin(dLat / 2) ** 2
    + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export function computeNearby(
  current: StationConfig,
  all: StationConfig[],
  count = 10,
): NearbyStation[] {
  return all
    .filter(s => s.slug !== current.slug)
    .map(s => ({
      name: s.name,
      lat: s.lat,
      lon: s.lon,
      slug: s.slug,
      distMi: haversineMi(current.lat, current.lon, s.lat, s.lon),
    }))
    .sort((a, b) => a.distMi - b.distMi)
    .slice(0, count)
    .map(({ distMi: _, ...s }) => s)
}
