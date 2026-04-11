import type { Metadata } from 'next'
import { NORTH_CAROLINA_STATIONS } from '@/lib/north-carolina-stations'
import StateIndexPage from '@/app/tides/StateIndexPage'

export const metadata: Metadata = {
  title: 'North Carolina Tide Charts | Tides for Fishing | TideChartsPro',
  description: 'North Carolina tide charts with live tide levels, tides for fishing, solunar periods and fishing forecasts. Outer Banks, Pamlico Sound, Crystal Coast, Cape Fear and Wilmington.',
  keywords: ['north carolina tide chart', 'north carolina tides for fishing', 'north carolina fishing tides', 'atlantic coast tide chart'],
  alternates: { canonical: 'https://tidechartspro.com/tides/north-carolina' },
  openGraph: {
    title: 'North Carolina Tide Charts | Tides for Fishing | TideChartsPro',
    description: 'Live tide charts and fishing tides for every North Carolina coastal location.',
    url: 'https://tidechartspro.com/tides/north-carolina',
    siteName: 'TideChartsPro',
  },
}

const REGIONS = ["Outer Banks / Pamlico Sound", "Albemarle Sound", "New Bern / Crystal Coast", "Cape Fear / Wilmington"]

export default function NorthCarolinaTidesIndex() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'North Carolina Tide Charts',
          description: 'Tide charts and fishing tides for all North Carolina coastal locations.',
          url: 'https://tidechartspro.com/tides/north-carolina',
          breadcrumb: {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home',             item: 'https://tidechartspro.com' },
              { '@type': 'ListItem', position: 2, name: 'Tides',            item: 'https://tidechartspro.com/tides' },
              { '@type': 'ListItem', position: 3, name: 'North Carolina', item: 'https://tidechartspro.com/tides/north-carolina' },
            ],
          },
        })}}
      />
      <StateIndexPage
        stateName="North Carolina"
        stateSlug="north-carolina"
        stateAbbr="NC"
        stations={NORTH_CAROLINA_STATIONS}
        regions={REGIONS}
        mapCenter={[35.2, -76.8]}
        mapZoom={7}
        description="Outer Banks, Pamlico Sound, Crystal Coast, Cape Fear and Wilmington."
      />
    </>
  )
}
