import type { Metadata } from 'next'
import { MAINE_STATIONS } from '@/lib/maine-stations'
import StateIndexPage from '@/app/tides/StateIndexPage'

export const metadata: Metadata = {
  title: 'Maine Tide Charts | Tides for Fishing | TideChartsPro',
  description: 'Maine tide charts with live tide levels, tides for fishing, solunar periods and fishing forecasts. Portland, Casco Bay, Midcoast Maine, Acadia and Downeast Maine.',
  keywords: ['maine tide chart', 'maine tides for fishing', 'maine fishing tides', 'atlantic coast tide chart'],
  alternates: { canonical: 'https://tidechartspro.com/tides/maine' },
  openGraph: {
    title: 'Maine Tide Charts | Tides for Fishing | TideChartsPro',
    description: 'Live tide charts and fishing tides for every Maine coastal location.',
    url: 'https://tidechartspro.com/tides/maine',
    siteName: 'TideChartsPro',
  },
}

const REGIONS = ["Downeast Maine / Acadia", "Midcoast Maine", "Casco Bay / Portland", "York County / Southern Maine"]

export default function MaineTidesIndex() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Maine Tide Charts',
          description: 'Tide charts and fishing tides for all Maine coastal locations.',
          url: 'https://tidechartspro.com/tides/maine',
          breadcrumb: {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home',             item: 'https://tidechartspro.com' },
              { '@type': 'ListItem', position: 2, name: 'Tides',            item: 'https://tidechartspro.com/tides' },
              { '@type': 'ListItem', position: 3, name: 'Maine', item: 'https://tidechartspro.com/tides/maine' },
            ],
          },
        })}}
      />
      <StateIndexPage
        stateName="Maine"
        stateSlug="maine"
        stateAbbr="ME"
        stations={MAINE_STATIONS}
        regions={REGIONS}
        mapCenter={[44.5, -68.5]}
        mapZoom={7}
        description="Portland, Casco Bay, Midcoast Maine, Acadia and Downeast Maine."
      />
    </>
  )
}
