import type { Metadata } from 'next'
import { HAWAII_STATIONS } from '@/lib/hawaii-stations'
import StateIndexPage from '@/app/tides/StateIndexPage'

export const metadata: Metadata = {
  title: 'Hawaii Tide Charts | Tides for Fishing | TideChartsPro',
  description: 'Hawaii tide charts with live tide levels, tides for fishing, solunar periods and fishing forecasts. Oahu, Maui, the Big Island, Kauai and the Hawaiian island chain.',
  keywords: ['hawaii tide chart', 'hawaii tides for fishing', 'hawaii fishing tides', 'pacific coast tide chart'],
  alternates: { canonical: 'https://tidechartspro.com/tides/hawaii' },
  openGraph: {
    title: 'Hawaii Tide Charts | Tides for Fishing | TideChartsPro',
    description: 'Live tide charts and fishing tides for every Hawaii coastal location.',
    url: 'https://tidechartspro.com/tides/hawaii',
    siteName: 'TideChartsPro',
  },
}

const REGIONS = ["Kauai / Niihau", "Oahu", "Maui / Molokai", "Hawaii (Big Island)"]

export default function HawaiiTidesIndex() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Hawaii Tide Charts',
          description: 'Tide charts and fishing tides for all Hawaii coastal locations.',
          url: 'https://tidechartspro.com/tides/hawaii',
          breadcrumb: {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home',             item: 'https://tidechartspro.com' },
              { '@type': 'ListItem', position: 2, name: 'Tides',            item: 'https://tidechartspro.com/tides' },
              { '@type': 'ListItem', position: 3, name: 'Hawaii', item: 'https://tidechartspro.com/tides/hawaii' },
            ],
          },
        })}}
      />
      <StateIndexPage
        stateName="Hawaii"
        stateSlug="hawaii"
        stateAbbr="HI"
        stations={HAWAII_STATIONS}
        regions={REGIONS}
        mapCenter={[20.5, -157]}
        mapZoom={7}
        description="Oahu, Maui, the Big Island, Kauai and the Hawaiian island chain."
      />
    </>
  )
}
