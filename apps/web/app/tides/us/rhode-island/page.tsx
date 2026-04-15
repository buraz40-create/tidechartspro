import type { Metadata } from 'next'
import { RHODE_ISLAND_STATIONS } from '@/lib/rhode-island-stations'
import StateIndexPage from '@/app/tides/StateIndexPage'

export const metadata: Metadata = {
  title: 'Rhode Island Tide Charts | Tides for Fishing | TideChartsPro',
  description: 'Rhode Island tide charts with live tide levels, tides for fishing, solunar periods and fishing forecasts. Narragansett Bay, Newport, Block Island and Rhode Island Sound.',
  keywords: ['rhode island tide chart', 'rhode island tides for fishing', 'rhode island fishing tides', 'atlantic coast tide chart'],
  alternates: { canonical: 'https://tidechartspro.com/tides/rhode-island' },
  openGraph: {
    title: 'Rhode Island Tide Charts | Tides for Fishing | TideChartsPro',
    description: 'Live tide charts and fishing tides for every Rhode Island coastal location.',
    url: 'https://tidechartspro.com/tides/rhode-island',
    siteName: 'TideChartsPro',
  },
}

const REGIONS = ["Rhode Island Sound", "Narragansett Bay"]

export default function RhodeIslandTidesIndex() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Rhode Island Tide Charts',
          description: 'Tide charts and fishing tides for all Rhode Island coastal locations.',
          url: 'https://tidechartspro.com/tides/rhode-island',
          breadcrumb: {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home',             item: 'https://tidechartspro.com' },
              { '@type': 'ListItem', position: 2, name: 'Tides',            item: 'https://tidechartspro.com/tides' },
              { '@type': 'ListItem', position: 3, name: 'Rhode Island', item: 'https://tidechartspro.com/tides/rhode-island' },
            ],
          },
        })}}
      />
      <StateIndexPage
        stateName="Rhode Island"
        stateSlug="rhode-island"
        stateAbbr="RI"
        stations={RHODE_ISLAND_STATIONS}
        regions={REGIONS}
        mapCenter={[41.6, -71.5]}
        mapZoom={9}
        description="Narragansett Bay, Newport, Block Island and Rhode Island Sound."
      />
    </>
  )
}
