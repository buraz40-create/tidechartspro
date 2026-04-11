import type { Metadata } from 'next'
import { OREGON_STATIONS } from '@/lib/oregon-stations'
import StateIndexPage from '@/app/tides/StateIndexPage'

export const metadata: Metadata = {
  title: 'Oregon Tide Charts | Tides for Fishing | TideChartsPro',
  description: 'Oregon tide charts with live tide levels, tides for fishing, solunar periods and fishing forecasts. Astoria, Columbia River, Newport, Coos Bay and the Oregon Coast.',
  keywords: ['oregon tide chart', 'oregon tides for fishing', 'oregon fishing tides', 'pacific coast tide chart'],
  alternates: { canonical: 'https://tidechartspro.com/tides/oregon' },
  openGraph: {
    title: 'Oregon Tide Charts | Tides for Fishing | TideChartsPro',
    description: 'Live tide charts and fishing tides for every Oregon coastal location.',
    url: 'https://tidechartspro.com/tides/oregon',
    siteName: 'TideChartsPro',
  },
}

const REGIONS = ["Southern Oregon Coast", "Central Oregon Coast", "Columbia River / Astoria"]

export default function OregonTidesIndex() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Oregon Tide Charts',
          description: 'Tide charts and fishing tides for all Oregon coastal locations.',
          url: 'https://tidechartspro.com/tides/oregon',
          breadcrumb: {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home',             item: 'https://tidechartspro.com' },
              { '@type': 'ListItem', position: 2, name: 'Tides',            item: 'https://tidechartspro.com/tides' },
              { '@type': 'ListItem', position: 3, name: 'Oregon', item: 'https://tidechartspro.com/tides/oregon' },
            ],
          },
        })}}
      />
      <StateIndexPage
        stateName="Oregon"
        stateSlug="oregon"
        stateAbbr="OR"
        stations={OREGON_STATIONS}
        regions={REGIONS}
        mapCenter={[44.5, -124]}
        mapZoom={7}
        description="Astoria, Columbia River, Newport, Coos Bay and the Oregon Coast."
      />
    </>
  )
}
