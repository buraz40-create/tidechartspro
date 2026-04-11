import type { MetadataRoute } from 'next'
import { FLORIDA_STATIONS }        from '@/lib/florida-stations'
import { ALABAMA_STATIONS }        from '@/lib/alabama-stations'
import { MISSISSIPPI_STATIONS }    from '@/lib/mississippi-stations'
import { LOUISIANA_STATIONS }      from '@/lib/louisiana-stations'
import { TEXAS_STATIONS }          from '@/lib/texas-stations'
import { GEORGIA_STATIONS }        from '@/lib/georgia-stations'
import { SOUTH_CAROLINA_STATIONS } from '@/lib/south-carolina-stations'
import { NORTH_CAROLINA_STATIONS } from '@/lib/north-carolina-stations'
import { VIRGINIA_STATIONS }       from '@/lib/virginia-stations'
import { MARYLAND_STATIONS }       from '@/lib/maryland-stations'
import { DELAWARE_STATIONS }       from '@/lib/delaware-stations'
import { NEW_JERSEY_STATIONS }     from '@/lib/new-jersey-stations'
import { NEW_YORK_STATIONS }       from '@/lib/new-york-stations'
import { CONNECTICUT_STATIONS }    from '@/lib/connecticut-stations'
import { RHODE_ISLAND_STATIONS }   from '@/lib/rhode-island-stations'
import { MASSACHUSETTS_STATIONS }  from '@/lib/massachusetts-stations'
import { NEW_HAMPSHIRE_STATIONS }  from '@/lib/new-hampshire-stations'
import { MAINE_STATIONS }          from '@/lib/maine-stations'
import { CALIFORNIA_STATIONS }     from '@/lib/california-stations'
import { OREGON_STATIONS }         from '@/lib/oregon-stations'
import { WASHINGTON_STATIONS }     from '@/lib/washington-stations'
import { ALASKA_STATIONS }         from '@/lib/alaska-stations'
import { HAWAII_STATIONS }         from '@/lib/hawaii-stations'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const statePages = (
    [
      ['florida',        FLORIDA_STATIONS],
      ['alabama',        ALABAMA_STATIONS],
      ['mississippi',    MISSISSIPPI_STATIONS],
      ['louisiana',      LOUISIANA_STATIONS],
      ['texas',          TEXAS_STATIONS],
      ['georgia',        GEORGIA_STATIONS],
      ['south-carolina', SOUTH_CAROLINA_STATIONS],
      ['north-carolina', NORTH_CAROLINA_STATIONS],
      ['virginia',       VIRGINIA_STATIONS],
      ['maryland',       MARYLAND_STATIONS],
      ['delaware',       DELAWARE_STATIONS],
      ['new-jersey',     NEW_JERSEY_STATIONS],
      ['new-york',       NEW_YORK_STATIONS],
      ['connecticut',    CONNECTICUT_STATIONS],
      ['rhode-island',   RHODE_ISLAND_STATIONS],
      ['massachusetts',  MASSACHUSETTS_STATIONS],
      ['new-hampshire',  NEW_HAMPSHIRE_STATIONS],
      ['maine',          MAINE_STATIONS],
      ['california',     CALIFORNIA_STATIONS],
      ['oregon',         OREGON_STATIONS],
      ['washington',     WASHINGTON_STATIONS],
      ['alaska',         ALASKA_STATIONS],
      ['hawaii',         HAWAII_STATIONS],
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
    {
      url: 'https://tidechartspro.com/tides',
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
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
