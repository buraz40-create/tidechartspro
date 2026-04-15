import type { Metadata } from 'next'
import { MASSACHUSETTS_STATIONS } from '@/lib/massachusetts-stations'
import StateIndexPage from '@/app/tides/StateIndexPage'

export const metadata: Metadata = {
  title: 'Massachusetts Tide Charts | Tides for Fishing | TideChartsPro',
  description: "Massachusetts tide charts with live tide levels, tides for fishing, solunar periods and fishing forecasts. Cape Cod, Boston Harbor, Martha's Vineyard, Nantucket and the South Coast.",
  keywords: ['massachusetts tide chart', 'massachusetts tides for fishing', 'massachusetts fishing tides', 'atlantic coast tide chart'],
  alternates: { canonical: 'https://tidechartspro.com/tides/massachusetts' },
  openGraph: {
    title: 'Massachusetts Tide Charts | Tides for Fishing | TideChartsPro',
    description: 'Live tide charts and fishing tides for every Massachusetts coastal location.',
    url: 'https://tidechartspro.com/tides/massachusetts',
    siteName: 'TideChartsPro',
  },
}

const REGIONS = ["Boston Harbor / South Shore", "Buzzards Bay / South Coast", "Cape Cod Bay", "Cape Cod & Islands"]

export default function MassachusettsTidesIndex() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Massachusetts Tide Charts',
          description: 'Tide charts and fishing tides for all Massachusetts coastal locations.',
          url: 'https://tidechartspro.com/tides/massachusetts',
          breadcrumb: {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home',             item: 'https://tidechartspro.com' },
              { '@type': 'ListItem', position: 2, name: 'Tides',            item: 'https://tidechartspro.com/tides' },
              { '@type': 'ListItem', position: 3, name: 'Massachusetts', item: 'https://tidechartspro.com/tides/massachusetts' },
            ],
          },
        })}}
      />
      <StateIndexPage
        stateName="Massachusetts"
        stateSlug="massachusetts"
        stateAbbr="MA"
        stations={MASSACHUSETTS_STATIONS}
        regions={REGIONS}
        mapCenter={[42, -70.5]}
        mapZoom={7}
        description="Cape Cod, Boston Harbor, Martha's Vineyard, Nantucket and the South Coast."
      />
    </>
  )
}
