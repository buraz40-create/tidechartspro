import type { Metadata } from 'next'
import { MISSISSIPPI_STATIONS } from '@/lib/mississippi-stations'
import StateIndexPage from '@/app/tides/StateIndexPage'

export const metadata: Metadata = {
  title: 'Mississippi Tide Charts | Tides for Fishing | TideChartsPro',
  description: 'Mississippi tide charts with live tide levels, tides for fishing, solunar periods and fishing forecasts — Biloxi, Gulfport, Bay St. Louis and Pascagoula.',
  keywords: ['mississippi tide chart', 'mississippi tides for fishing', 'biloxi tide chart', 'gulfport tide chart', 'pascagoula tide chart'],
  alternates: { canonical: 'https://tidechartspro.com/tides/mississippi' },
  openGraph: {
    title: 'Mississippi Tide Charts | Tides for Fishing | TideChartsPro',
    description: 'Live tide charts and fishing tides for every Mississippi coastal location.',
    url: 'https://tidechartspro.com/tides/mississippi',
    siteName: 'TideChartsPro',
  },
}

const REGIONS = ['Mississippi Sound', 'Pascagoula Area']

export default function MississippiTidesIndex() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Mississippi Tide Charts',
          description: 'Tide charts and fishing tides for all Mississippi coastal locations.',
          url: 'https://tidechartspro.com/tides/mississippi',
          breadcrumb: {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home',        item: 'https://tidechartspro.com' },
              { '@type': 'ListItem', position: 2, name: 'Tides',       item: 'https://tidechartspro.com/tides' },
              { '@type': 'ListItem', position: 3, name: 'Mississippi', item: 'https://tidechartspro.com/tides/mississippi' },
            ],
          },
        })}}
      />
      <StateIndexPage
        stateName="Mississippi"
        stateSlug="mississippi"
        stateAbbr="MS"
        stations={MISSISSIPPI_STATIONS}
        regions={REGIONS}
        mapCenter={[30.35, -89.0]}
        mapZoom={8}
        description="Live tide charts, tides for fishing, solunar periods and hourly fishing forecasts for every Mississippi coastal location — Mississippi Sound, Biloxi, Gulfport, Bay St. Louis and Pascagoula."
      />
    </>
  )
}
