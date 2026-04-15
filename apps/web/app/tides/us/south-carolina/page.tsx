import type { Metadata } from 'next'
import { SOUTH_CAROLINA_STATIONS } from '@/lib/south-carolina-stations'
import StateIndexPage from '@/app/tides/StateIndexPage'

export const metadata: Metadata = {
  title: 'South Carolina Tide Charts | Tides for Fishing | TideChartsPro',
  description: 'South Carolina tide charts with live tide levels, tides for fishing, solunar periods and fishing forecasts. Grand Strand, Charleston, Hilton Head and the Sea Islands.',
  keywords: ['south carolina tide chart', 'south carolina tides for fishing', 'south carolina fishing tides', 'atlantic coast tide chart'],
  alternates: { canonical: 'https://tidechartspro.com/tides/south-carolina' },
  openGraph: {
    title: 'South Carolina Tide Charts | Tides for Fishing | TideChartsPro',
    description: 'Live tide charts and fishing tides for every South Carolina coastal location.',
    url: 'https://tidechartspro.com/tides/south-carolina',
    siteName: 'TideChartsPro',
  },
}

const REGIONS = ["Grand Strand / Myrtle Beach", "Charleston / Lowcountry", "Beaufort / Sea Islands"]

export default function SouthCarolinaTidesIndex() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'South Carolina Tide Charts',
          description: 'Tide charts and fishing tides for all South Carolina coastal locations.',
          url: 'https://tidechartspro.com/tides/south-carolina',
          breadcrumb: {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home',             item: 'https://tidechartspro.com' },
              { '@type': 'ListItem', position: 2, name: 'Tides',            item: 'https://tidechartspro.com/tides' },
              { '@type': 'ListItem', position: 3, name: 'South Carolina', item: 'https://tidechartspro.com/tides/south-carolina' },
            ],
          },
        })}}
      />
      <StateIndexPage
        stateName="South Carolina"
        stateSlug="south-carolina"
        stateAbbr="SC"
        stations={SOUTH_CAROLINA_STATIONS}
        regions={REGIONS}
        mapCenter={[33, -80.2]}
        mapZoom={7}
        description="Grand Strand, Charleston, Hilton Head and the Sea Islands."
      />
    </>
  )
}
