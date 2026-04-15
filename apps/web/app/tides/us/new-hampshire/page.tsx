import type { Metadata } from 'next'
import { NEW_HAMPSHIRE_STATIONS } from '@/lib/new-hampshire-stations'
import StateIndexPage from '@/app/tides/StateIndexPage'

export const metadata: Metadata = {
  title: 'New Hampshire Tide Charts | Tides for Fishing | TideChartsPro',
  description: 'New Hampshire tide charts with live tide levels, tides for fishing, solunar periods and fishing forecasts. Portsmouth, Rye Harbor, Hampton Beach and the New Hampshire Seacoast.',
  keywords: ['new hampshire tide chart', 'new hampshire tides for fishing', 'new hampshire fishing tides', 'atlantic coast tide chart'],
  alternates: { canonical: 'https://tidechartspro.com/tides/new-hampshire' },
  openGraph: {
    title: 'New Hampshire Tide Charts | Tides for Fishing | TideChartsPro',
    description: 'Live tide charts and fishing tides for every New Hampshire coastal location.',
    url: 'https://tidechartspro.com/tides/new-hampshire',
    siteName: 'TideChartsPro',
  },
}

const REGIONS = ["New Hampshire Seacoast"]

export default function NewHampshireTidesIndex() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'New Hampshire Tide Charts',
          description: 'Tide charts and fishing tides for all New Hampshire coastal locations.',
          url: 'https://tidechartspro.com/tides/new-hampshire',
          breadcrumb: {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home',             item: 'https://tidechartspro.com' },
              { '@type': 'ListItem', position: 2, name: 'Tides',            item: 'https://tidechartspro.com/tides' },
              { '@type': 'ListItem', position: 3, name: 'New Hampshire', item: 'https://tidechartspro.com/tides/new-hampshire' },
            ],
          },
        })}}
      />
      <StateIndexPage
        stateName="New Hampshire"
        stateSlug="new-hampshire"
        stateAbbr="NH"
        stations={NEW_HAMPSHIRE_STATIONS}
        regions={REGIONS}
        mapCenter={[43, -70.8]}
        mapZoom={9}
        description="Portsmouth, Rye Harbor, Hampton Beach and the New Hampshire Seacoast."
      />
    </>
  )
}
