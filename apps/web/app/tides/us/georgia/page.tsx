import type { Metadata } from 'next'
import { GEORGIA_STATIONS } from '@/lib/georgia-stations'
import StateIndexPage from '@/app/tides/StateIndexPage'

export const metadata: Metadata = {
  title: 'Georgia Tide Charts | Tides for Fishing | TideChartsPro',
  description: 'Georgia tide charts with live tide levels, tides for fishing, solunar periods and fishing forecasts. Savannah, Tybee Island, Golden Isles, Brunswick and Cumberland Island.',
  keywords: ['georgia tide chart', 'georgia tides for fishing', 'georgia fishing tides', 'atlantic coast tide chart'],
  alternates: { canonical: 'https://tidechartspro.com/tides/georgia' },
  openGraph: {
    title: 'Georgia Tide Charts | Tides for Fishing | TideChartsPro',
    description: 'Live tide charts and fishing tides for every Georgia coastal location.',
    url: 'https://tidechartspro.com/tides/georgia',
    siteName: 'TideChartsPro',
  },
}

const REGIONS = ["Savannah / Tybee Island", "Golden Isles / Brunswick", "St. Marys / Cumberland Island"]

export default function GeorgiaTidesIndex() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Georgia Tide Charts',
          description: 'Tide charts and fishing tides for all Georgia coastal locations.',
          url: 'https://tidechartspro.com/tides/georgia',
          breadcrumb: {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home',             item: 'https://tidechartspro.com' },
              { '@type': 'ListItem', position: 2, name: 'Tides',            item: 'https://tidechartspro.com/tides' },
              { '@type': 'ListItem', position: 3, name: 'Georgia', item: 'https://tidechartspro.com/tides/georgia' },
            ],
          },
        })}}
      />
      <StateIndexPage
        stateName="Georgia"
        stateSlug="georgia"
        stateAbbr="GA"
        stations={GEORGIA_STATIONS}
        regions={REGIONS}
        mapCenter={[31.5, -81.3]}
        mapZoom={7}
        description="Savannah, Tybee Island, Golden Isles, Brunswick and Cumberland Island."
      />
    </>
  )
}
