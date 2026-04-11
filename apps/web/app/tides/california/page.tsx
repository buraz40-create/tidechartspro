import type { Metadata } from 'next'
import { CALIFORNIA_STATIONS } from '@/lib/california-stations'
import StateIndexPage from '@/app/tides/StateIndexPage'

export const metadata: Metadata = {
  title: 'California Tide Charts | Tides for Fishing | TideChartsPro',
  description: 'California tide charts with live tide levels, tides for fishing, solunar periods and fishing forecasts. San Diego, Los Angeles, San Francisco Bay, Monterey and the North Coast.',
  keywords: ['california tide chart', 'california tides for fishing', 'california fishing tides', 'pacific coast tide chart'],
  alternates: { canonical: 'https://tidechartspro.com/tides/california' },
  openGraph: {
    title: 'California Tide Charts | Tides for Fishing | TideChartsPro',
    description: 'Live tide charts and fishing tides for every California coastal location.',
    url: 'https://tidechartspro.com/tides/california',
    siteName: 'TideChartsPro',
  },
}

const REGIONS = ["San Diego", "Los Angeles / Orange County", "Santa Barbara / Ventura", "Central California", "San Francisco Bay Area", "North Coast California"]

export default function CaliforniaTidesIndex() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'California Tide Charts',
          description: 'Tide charts and fishing tides for all California coastal locations.',
          url: 'https://tidechartspro.com/tides/california',
          breadcrumb: {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home',             item: 'https://tidechartspro.com' },
              { '@type': 'ListItem', position: 2, name: 'Tides',            item: 'https://tidechartspro.com/tides' },
              { '@type': 'ListItem', position: 3, name: 'California', item: 'https://tidechartspro.com/tides/california' },
            ],
          },
        })}}
      />
      <StateIndexPage
        stateName="California"
        stateSlug="california"
        stateAbbr="CA"
        stations={CALIFORNIA_STATIONS}
        regions={REGIONS}
        mapCenter={[37, -122]}
        mapZoom={6}
        description="San Diego, Los Angeles, San Francisco Bay, Monterey and the North Coast."
      />
    </>
  )
}
