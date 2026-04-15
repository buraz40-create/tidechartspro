import type { Metadata } from 'next'
import { MARYLAND_STATIONS } from '@/lib/maryland-stations'
import StateIndexPage from '@/app/tides/StateIndexPage'

export const metadata: Metadata = {
  title: 'Maryland Tide Charts | Tides for Fishing | TideChartsPro',
  description: 'Maryland tide charts with live tide levels, tides for fishing, solunar periods and fishing forecasts. Chesapeake Bay, Annapolis, Baltimore, Potomac River and Ocean City.',
  keywords: ['maryland tide chart', 'maryland tides for fishing', 'maryland fishing tides', 'atlantic coast tide chart'],
  alternates: { canonical: 'https://tidechartspro.com/tides/maryland' },
  openGraph: {
    title: 'Maryland Tide Charts | Tides for Fishing | TideChartsPro',
    description: 'Live tide charts and fishing tides for every Maryland coastal location.',
    url: 'https://tidechartspro.com/tides/maryland',
    siteName: 'TideChartsPro',
  },
}

const REGIONS = ["Maryland Ocean Shore", "Lower Chesapeake Bay / Potomac", "Middle Chesapeake Bay", "Upper Chesapeake Bay"]

export default function MarylandTidesIndex() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Maryland Tide Charts',
          description: 'Tide charts and fishing tides for all Maryland coastal locations.',
          url: 'https://tidechartspro.com/tides/maryland',
          breadcrumb: {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home',             item: 'https://tidechartspro.com' },
              { '@type': 'ListItem', position: 2, name: 'Tides',            item: 'https://tidechartspro.com/tides' },
              { '@type': 'ListItem', position: 3, name: 'Maryland', item: 'https://tidechartspro.com/tides/maryland' },
            ],
          },
        })}}
      />
      <StateIndexPage
        stateName="Maryland"
        stateSlug="maryland"
        stateAbbr="MD"
        stations={MARYLAND_STATIONS}
        regions={REGIONS}
        mapCenter={[38.8, -76.4]}
        mapZoom={7}
        description="Chesapeake Bay, Annapolis, Baltimore, Potomac River and Ocean City."
      />
    </>
  )
}
