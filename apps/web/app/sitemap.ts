import type { MetadataRoute } from 'next'
import { FLORIDA_STATIONS } from '@/lib/florida-stations'
import { ALABAMA_STATIONS } from '@/lib/alabama-stations'
import { MISSISSIPPI_STATIONS } from '@/lib/mississippi-stations'
import { LOUISIANA_STATIONS } from '@/lib/louisiana-stations'
import { TEXAS_STATIONS } from '@/lib/texas-stations'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const statePages = (
    [
      ['florida',     FLORIDA_STATIONS],
      ['alabama',     ALABAMA_STATIONS],
      ['mississippi', MISSISSIPPI_STATIONS],
      ['louisiana',   LOUISIANA_STATIONS],
      ['texas',       TEXAS_STATIONS],
    ] as const
  ).flatMap(([state, stations]) => [
    {
      url: `https://tidechartspro.com/tides/${state}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    ...stations.map(s => ({
      url: `https://tidechartspro.com/tides/${state}/${s.slug}`,
      lastModified: now,
      changeFrequency: 'daily' as const,
      priority: 0.9,
    })),
  ])

  return [
    {
      url: 'https://tidechartspro.com',
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    ...statePages,
    {
      url: 'https://tidechartspro.com/tides/florida/pablo-creek-entrance/calendar',
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.7,
    },
  ]
}
