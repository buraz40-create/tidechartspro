import type { Metadata } from 'next'
import { ALASKA_STATIONS } from '@/lib/alaska-stations'
import StateIndexPage from '@/app/tides/StateIndexPage'

export const metadata: Metadata = {
  title: 'Alaska Tide Charts | Tides for Fishing | TideChartsPro',
  description: 'Alaska tide charts with live tide levels, tides for fishing, solunar periods and fishing forecasts. Southeast Alaska, Cook Inlet, Prince William Sound, Kodiak and the Aleutians.',
  keywords: ['alaska tide chart', 'alaska tides for fishing', 'alaska fishing tides', 'pacific coast tide chart'],
  alternates: { canonical: 'https://tidechartspro.com/tides/alaska' },
  openGraph: {
    title: 'Alaska Tide Charts | Tides for Fishing | TideChartsPro',
    description: 'Live tide charts and fishing tides for every Alaska coastal location.',
    url: 'https://tidechartspro.com/tides/alaska',
    siteName: 'TideChartsPro',
  },
}

const REGIONS = ["Southeast Alaska", "Gulf of Alaska", "Cook Inlet / Prince William Sound", "Kodiak Island", "Western Alaska / Aleutians"]

export default function AlaskaTidesIndex() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Alaska Tide Charts',
          description: 'Tide charts and fishing tides for all Alaska coastal locations.',
          url: 'https://tidechartspro.com/tides/alaska',
          breadcrumb: {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home',             item: 'https://tidechartspro.com' },
              { '@type': 'ListItem', position: 2, name: 'Tides',            item: 'https://tidechartspro.com/tides' },
              { '@type': 'ListItem', position: 3, name: 'Alaska', item: 'https://tidechartspro.com/tides/alaska' },
            ],
          },
        })}}
      />
      <StateIndexPage
        stateName="Alaska"
        stateSlug="alaska"
        stateAbbr="AK"
        stations={ALASKA_STATIONS}
        regions={REGIONS}
        mapCenter={[60, -150]}
        mapZoom={4}
        description="Southeast Alaska, Cook Inlet, Prince William Sound, Kodiak and the Aleutians."
      />
    </>
  )
}
