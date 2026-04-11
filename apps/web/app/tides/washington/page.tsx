import type { Metadata } from 'next'
import { WASHINGTON_STATIONS } from '@/lib/washington-stations'
import StateIndexPage from '@/app/tides/StateIndexPage'

export const metadata: Metadata = {
  title: 'Washington Tide Charts | Tides for Fishing | TideChartsPro',
  description: 'Washington tide charts with live tide levels, tides for fishing, solunar periods and fishing forecasts. Puget Sound, Seattle, Tacoma, San Juan Islands and the Strait of Juan de Fuca.',
  keywords: ['washington tide chart', 'washington tides for fishing', 'washington fishing tides', 'pacific coast tide chart'],
  alternates: { canonical: 'https://tidechartspro.com/tides/washington' },
  openGraph: {
    title: 'Washington Tide Charts | Tides for Fishing | TideChartsPro',
    description: 'Live tide charts and fishing tides for every Washington coastal location.',
    url: 'https://tidechartspro.com/tides/washington',
    siteName: 'TideChartsPro',
  },
}

const REGIONS = ["Columbia River WA", "Washington Ocean Coast", "South Puget Sound", "North Puget Sound", "Central Puget Sound / Seattle", "San Juan Islands / Strait of Juan de Fuca"]

export default function WashingtonTidesIndex() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Washington Tide Charts',
          description: 'Tide charts and fishing tides for all Washington coastal locations.',
          url: 'https://tidechartspro.com/tides/washington',
          breadcrumb: {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home',             item: 'https://tidechartspro.com' },
              { '@type': 'ListItem', position: 2, name: 'Tides',            item: 'https://tidechartspro.com/tides' },
              { '@type': 'ListItem', position: 3, name: 'Washington', item: 'https://tidechartspro.com/tides/washington' },
            ],
          },
        })}}
      />
      <StateIndexPage
        stateName="Washington"
        stateSlug="washington"
        stateAbbr="WA"
        stations={WASHINGTON_STATIONS}
        regions={REGIONS}
        mapCenter={[47.5, -122.5]}
        mapZoom={7}
        description="Puget Sound, Seattle, Tacoma, San Juan Islands and the Strait of Juan de Fuca."
      />
    </>
  )
}
