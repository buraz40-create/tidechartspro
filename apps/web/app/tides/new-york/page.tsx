import type { Metadata } from 'next'
import { NEW_YORK_STATIONS } from '@/lib/new-york-stations'
import StateIndexPage from '@/app/tides/StateIndexPage'

export const metadata: Metadata = {
  title: 'New York Tide Charts | Tides for Fishing | TideChartsPro',
  description: 'New York tide charts with live tide levels, tides for fishing, solunar periods and fishing forecasts. New York Harbor, Long Island Sound, Long Island South Shore and Hudson River.',
  keywords: ['new york tide chart', 'new york tides for fishing', 'new york fishing tides', 'atlantic coast tide chart'],
  alternates: { canonical: 'https://tidechartspro.com/tides/new-york' },
  openGraph: {
    title: 'New York Tide Charts | Tides for Fishing | TideChartsPro',
    description: 'Live tide charts and fishing tides for every New York coastal location.',
    url: 'https://tidechartspro.com/tides/new-york',
    siteName: 'TideChartsPro',
  },
}

const REGIONS = ["New York Harbor / East River", "Eastern Long Island", "Long Island Sound"]

export default function NewYorkTidesIndex() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'New York Tide Charts',
          description: 'Tide charts and fishing tides for all New York coastal locations.',
          url: 'https://tidechartspro.com/tides/new-york',
          breadcrumb: {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home',             item: 'https://tidechartspro.com' },
              { '@type': 'ListItem', position: 2, name: 'Tides',            item: 'https://tidechartspro.com/tides' },
              { '@type': 'ListItem', position: 3, name: 'New York', item: 'https://tidechartspro.com/tides/new-york' },
            ],
          },
        })}}
      />
      <StateIndexPage
        stateName="New York"
        stateSlug="new-york"
        stateAbbr="NY"
        stations={NEW_YORK_STATIONS}
        regions={REGIONS}
        mapCenter={[40.9, -73.4]}
        mapZoom={7}
        description="New York Harbor, Long Island Sound, Long Island South Shore and Hudson River."
      />
    </>
  )
}
