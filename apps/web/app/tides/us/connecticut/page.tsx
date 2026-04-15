import type { Metadata } from 'next'
import { CONNECTICUT_STATIONS } from '@/lib/connecticut-stations'
import StateIndexPage from '@/app/tides/StateIndexPage'

export const metadata: Metadata = {
  title: 'Connecticut Tide Charts | Tides for Fishing | TideChartsPro',
  description: 'Connecticut tide charts with live tide levels, tides for fishing, solunar periods and fishing forecasts. Long Island Sound from Greenwich to the Thames River.',
  keywords: ['connecticut tide chart', 'connecticut tides for fishing', 'connecticut fishing tides', 'atlantic coast tide chart'],
  alternates: { canonical: 'https://tidechartspro.com/tides/connecticut' },
  openGraph: {
    title: 'Connecticut Tide Charts | Tides for Fishing | TideChartsPro',
    description: 'Live tide charts and fishing tides for every Connecticut coastal location.',
    url: 'https://tidechartspro.com/tides/connecticut',
    siteName: 'TideChartsPro',
  },
}

const REGIONS = ["Eastern Long Island Sound", "Central Long Island Sound", "Western Long Island Sound"]

export default function ConnecticutTidesIndex() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Connecticut Tide Charts',
          description: 'Tide charts and fishing tides for all Connecticut coastal locations.',
          url: 'https://tidechartspro.com/tides/connecticut',
          breadcrumb: {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home',             item: 'https://tidechartspro.com' },
              { '@type': 'ListItem', position: 2, name: 'Tides',            item: 'https://tidechartspro.com/tides' },
              { '@type': 'ListItem', position: 3, name: 'Connecticut', item: 'https://tidechartspro.com/tides/connecticut' },
            ],
          },
        })}}
      />
      <StateIndexPage
        stateName="Connecticut"
        stateSlug="connecticut"
        stateAbbr="CT"
        stations={CONNECTICUT_STATIONS}
        regions={REGIONS}
        mapCenter={[41.3, -72.6]}
        mapZoom={8}
        description="Long Island Sound from Greenwich to the Thames River."
      />
    </>
  )
}
