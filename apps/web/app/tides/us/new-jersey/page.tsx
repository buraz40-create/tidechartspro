import type { Metadata } from 'next'
import { NEW_JERSEY_STATIONS } from '@/lib/new-jersey-stations'
import StateIndexPage from '@/app/tides/StateIndexPage'

export const metadata: Metadata = {
  title: 'New Jersey Tide Charts | Tides for Fishing | TideChartsPro',
  description: 'New Jersey tide charts with live tide levels, tides for fishing, solunar periods and fishing forecasts. Delaware Bay, Jersey Shore, Sandy Hook, Raritan Bay and New York Harbor.',
  keywords: ['new jersey tide chart', 'new jersey tides for fishing', 'new jersey fishing tides', 'atlantic coast tide chart'],
  alternates: { canonical: 'https://tidechartspro.com/tides/new-jersey' },
  openGraph: {
    title: 'New Jersey Tide Charts | Tides for Fishing | TideChartsPro',
    description: 'Live tide charts and fishing tides for every New Jersey coastal location.',
    url: 'https://tidechartspro.com/tides/new-jersey',
    siteName: 'TideChartsPro',
  },
}

const REGIONS = ["New York Harbor / Raritan Bay", "Jersey Shore North", "Jersey Shore South", "Delaware Bay NJ"]

export default function NewJerseyTidesIndex() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'New Jersey Tide Charts',
          description: 'Tide charts and fishing tides for all New Jersey coastal locations.',
          url: 'https://tidechartspro.com/tides/new-jersey',
          breadcrumb: {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home',             item: 'https://tidechartspro.com' },
              { '@type': 'ListItem', position: 2, name: 'Tides',            item: 'https://tidechartspro.com/tides' },
              { '@type': 'ListItem', position: 3, name: 'New Jersey', item: 'https://tidechartspro.com/tides/new-jersey' },
            ],
          },
        })}}
      />
      <StateIndexPage
        stateName="New Jersey"
        stateSlug="new-jersey"
        stateAbbr="NJ"
        stations={NEW_JERSEY_STATIONS}
        regions={REGIONS}
        mapCenter={[39.8, -74.4]}
        mapZoom={7}
        description="Delaware Bay, Jersey Shore, Sandy Hook, Raritan Bay and New York Harbor."
      />
    </>
  )
}
