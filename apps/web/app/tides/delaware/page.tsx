import type { Metadata } from 'next'
import { DELAWARE_STATIONS } from '@/lib/delaware-stations'
import StateIndexPage from '@/app/tides/StateIndexPage'

export const metadata: Metadata = {
  title: 'Delaware Tide Charts | Tides for Fishing | TideChartsPro',
  description: 'Delaware tide charts with live tide levels, tides for fishing, solunar periods and fishing forecasts. Delaware Bay, Lewes, Rehoboth Beach and the Delaware Seashore.',
  keywords: ['delaware tide chart', 'delaware tides for fishing', 'delaware fishing tides', 'atlantic coast tide chart'],
  alternates: { canonical: 'https://tidechartspro.com/tides/delaware' },
  openGraph: {
    title: 'Delaware Tide Charts | Tides for Fishing | TideChartsPro',
    description: 'Live tide charts and fishing tides for every Delaware coastal location.',
    url: 'https://tidechartspro.com/tides/delaware',
    siteName: 'TideChartsPro',
  },
}

const REGIONS = ["Delaware Bay", "Delaware Ocean Shore"]

export default function DelawareTidesIndex() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Delaware Tide Charts',
          description: 'Tide charts and fishing tides for all Delaware coastal locations.',
          url: 'https://tidechartspro.com/tides/delaware',
          breadcrumb: {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home',             item: 'https://tidechartspro.com' },
              { '@type': 'ListItem', position: 2, name: 'Tides',            item: 'https://tidechartspro.com/tides' },
              { '@type': 'ListItem', position: 3, name: 'Delaware', item: 'https://tidechartspro.com/tides/delaware' },
            ],
          },
        })}}
      />
      <StateIndexPage
        stateName="Delaware"
        stateSlug="delaware"
        stateAbbr="DE"
        stations={DELAWARE_STATIONS}
        regions={REGIONS}
        mapCenter={[39, -75.4]}
        mapZoom={8}
        description="Delaware Bay, Lewes, Rehoboth Beach and the Delaware Seashore."
      />
    </>
  )
}
