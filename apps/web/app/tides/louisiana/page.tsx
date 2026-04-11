import type { Metadata } from 'next'
import { LOUISIANA_STATIONS } from '@/lib/louisiana-stations'
import StateIndexPage from '@/app/tides/StateIndexPage'

export const metadata: Metadata = {
  title: 'Louisiana Tide Charts | Tides for Fishing | TideChartsPro',
  description: 'Louisiana tide charts with live tide levels, tides for fishing, solunar periods and fishing forecasts — New Orleans, Grand Isle, Cameron, Vermilion Bay, Atchafalaya and the Mississippi Delta.',
  keywords: ['louisiana tide chart', 'louisiana tides for fishing', 'new orleans tide chart', 'grand isle tide chart', 'cameron tide chart'],
  alternates: { canonical: 'https://tidechartspro.com/tides/louisiana' },
  openGraph: {
    title: 'Louisiana Tide Charts | Tides for Fishing | TideChartsPro',
    description: 'Live tide charts and fishing tides for every Louisiana coastal location.',
    url: 'https://tidechartspro.com/tides/louisiana',
    siteName: 'TideChartsPro',
  },
}

const REGIONS = [
  'Calcasieu / Sabine',
  'Cameron',
  'Vermilion / Atchafalaya',
  'Barataria / New Orleans',
  'Breton Sound / Mississippi Delta',
]

export default function LouisianaTidesIndex() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Louisiana Tide Charts',
          description: 'Tide charts and fishing tides for all Louisiana coastal locations.',
          url: 'https://tidechartspro.com/tides/louisiana',
          breadcrumb: {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home',      item: 'https://tidechartspro.com' },
              { '@type': 'ListItem', position: 2, name: 'Tides',     item: 'https://tidechartspro.com/tides' },
              { '@type': 'ListItem', position: 3, name: 'Louisiana', item: 'https://tidechartspro.com/tides/louisiana' },
            ],
          },
        })}}
      />
      <StateIndexPage
        stateName="Louisiana"
        stateSlug="louisiana"
        stateAbbr="LA"
        stations={LOUISIANA_STATIONS}
        regions={REGIONS}
        mapCenter={[29.4, -91.2]}
        mapZoom={7}
        description="Live tide charts, tides for fishing, solunar periods and hourly fishing forecasts for every Louisiana coastal location — from Sabine Pass through the Mississippi Delta, including New Orleans, Grand Isle and the bayou marshes."
      />
    </>
  )
}
