import type { Metadata } from 'next'
import { FLORIDA_STATIONS } from '@/lib/florida-stations'
import StateIndexPage from '@/app/tides/StateIndexPage'

export const metadata: Metadata = {
  title: 'Florida Tide Charts | Tides for Fishing | TideChartsPro',
  description: 'Florida tide charts with live tide levels, tides for fishing, solunar periods and fishing forecasts for every Florida coastal location. Updated every 6 minutes.',
  keywords: ['florida tide chart', 'florida tides for fishing', 'florida tide level chart', 'florida fishing tides', 'tide chart florida'],
  alternates: { canonical: 'https://tidechartspro.com/tides/florida' },
  openGraph: {
    title: 'Florida Tide Charts | Tides for Fishing | TideChartsPro',
    description: 'Live tide charts and fishing tides for every Florida coastal location.',
    url: 'https://tidechartspro.com/tides/florida',
    siteName: 'TideChartsPro',
  },
}

const REGIONS = [
  'Northeast Florida',
  'East Central Florida',
  'Southeast Florida',
  'Florida Keys',
  'Southwest Florida',
  'Tampa Bay',
  'Big Bend Florida',
  'Florida Panhandle',
]

export default function FloridaTidesIndex() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Florida Tide Charts',
          description: 'Tide charts and fishing tides for all Florida coastal locations.',
          url: 'https://tidechartspro.com/tides/florida',
          breadcrumb: {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home',    item: 'https://tidechartspro.com' },
              { '@type': 'ListItem', position: 2, name: 'Tides',   item: 'https://tidechartspro.com/tides' },
              { '@type': 'ListItem', position: 3, name: 'Florida', item: 'https://tidechartspro.com/tides/florida' },
            ],
          },
        })}}
      />
      <StateIndexPage
        stateName="Florida"
        stateSlug="florida"
        stateAbbr="FL"
        stations={FLORIDA_STATIONS}
        regions={REGIONS}
        mapCenter={[27.8, -83.0]}
        mapZoom={6}
        description="Live tide charts, tides for fishing, solunar periods and hourly fishing forecasts for every Florida coastal location — Atlantic coast, Gulf Coast, Keys and Panhandle."
      />
    </>
  )
}
