import type { Metadata } from 'next'
import { ALABAMA_STATIONS } from '@/lib/alabama-stations'
import StateIndexPage from '@/app/tides/StateIndexPage'

export const metadata: Metadata = {
  title: 'Alabama Tide Charts | Tides for Fishing | TideChartsPro',
  description: 'Alabama tide charts with live tide levels, tides for fishing, solunar periods and fishing forecasts for every Alabama coastal location — Mobile Bay, Gulf Shores, Orange Beach and Dauphin Island.',
  keywords: ['alabama tide chart', 'alabama tides for fishing', 'mobile bay tide chart', 'gulf shores tide chart', 'orange beach tide chart', 'dauphin island tide chart'],
  alternates: { canonical: 'https://tidechartspro.com/tides/alabama' },
  openGraph: {
    title: 'Alabama Tide Charts | Tides for Fishing | TideChartsPro',
    description: 'Live tide charts and fishing tides for every Alabama coastal location.',
    url: 'https://tidechartspro.com/tides/alabama',
    siteName: 'TideChartsPro',
  },
}

const REGIONS = ['Alabama Gulf Coast', 'Mobile Bay']

export default function AlabamaTidesIndex() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Alabama Tide Charts',
          description: 'Tide charts and fishing tides for all Alabama coastal locations.',
          url: 'https://tidechartspro.com/tides/alabama',
          breadcrumb: {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home',    item: 'https://tidechartspro.com' },
              { '@type': 'ListItem', position: 2, name: 'Tides',   item: 'https://tidechartspro.com/tides' },
              { '@type': 'ListItem', position: 3, name: 'Alabama', item: 'https://tidechartspro.com/tides/alabama' },
            ],
          },
        })}}
      />
      <StateIndexPage
        stateName="Alabama"
        stateSlug="alabama"
        stateAbbr="AL"
        stations={ALABAMA_STATIONS}
        regions={REGIONS}
        mapCenter={[30.4, -87.9]}
        mapZoom={8}
        description="Live tide charts, tides for fishing, solunar periods and hourly fishing forecasts for every Alabama coastal location — Mobile Bay, Gulf Shores, Orange Beach and Dauphin Island."
      />
    </>
  )
}
