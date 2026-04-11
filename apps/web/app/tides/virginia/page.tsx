import type { Metadata } from 'next'
import { VIRGINIA_STATIONS } from '@/lib/virginia-stations'
import StateIndexPage from '@/app/tides/StateIndexPage'

export const metadata: Metadata = {
  title: 'Virginia Tide Charts | Tides for Fishing | TideChartsPro',
  description: 'Virginia tide charts with live tide levels, tides for fishing, solunar periods and fishing forecasts. Chesapeake Bay, Hampton Roads, Virginia Beach and the Eastern Shore.',
  keywords: ['virginia tide chart', 'virginia tides for fishing', 'virginia fishing tides', 'atlantic coast tide chart'],
  alternates: { canonical: 'https://tidechartspro.com/tides/virginia' },
  openGraph: {
    title: 'Virginia Tide Charts | Tides for Fishing | TideChartsPro',
    description: 'Live tide charts and fishing tides for every Virginia coastal location.',
    url: 'https://tidechartspro.com/tides/virginia',
    siteName: 'TideChartsPro',
  },
}

const REGIONS = ["Virginia Coast / Eastern Shore", "Lower Chesapeake Bay / Hampton Roads", "Virginia Beach / Currituck Sound", "Upper Chesapeake Bay"]

export default function VirginiaTidesIndex() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Virginia Tide Charts',
          description: 'Tide charts and fishing tides for all Virginia coastal locations.',
          url: 'https://tidechartspro.com/tides/virginia',
          breadcrumb: {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home',             item: 'https://tidechartspro.com' },
              { '@type': 'ListItem', position: 2, name: 'Tides',            item: 'https://tidechartspro.com/tides' },
              { '@type': 'ListItem', position: 3, name: 'Virginia', item: 'https://tidechartspro.com/tides/virginia' },
            ],
          },
        })}}
      />
      <StateIndexPage
        stateName="Virginia"
        stateSlug="virginia"
        stateAbbr="VA"
        stations={VIRGINIA_STATIONS}
        regions={REGIONS}
        mapCenter={[37.2, -76.5]}
        mapZoom={7}
        description="Chesapeake Bay, Hampton Roads, Virginia Beach and the Eastern Shore."
      />
    </>
  )
}
