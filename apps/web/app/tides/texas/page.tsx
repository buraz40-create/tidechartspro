import type { Metadata } from 'next'
import { TEXAS_STATIONS } from '@/lib/texas-stations'
import StateIndexPage from '@/app/tides/StateIndexPage'

export const metadata: Metadata = {
  title: 'Texas Tide Charts | Tides for Fishing | TideChartsPro',
  description: 'Texas tide charts with live tide levels, tides for fishing, solunar periods and fishing forecasts — Galveston, Corpus Christi, Port Aransas, Matagorda Bay, Sabine Pass and the Lower Laguna Madre.',
  keywords: ['texas tide chart', 'texas tides for fishing', 'galveston tide chart', 'corpus christi tide chart', 'port aransas tide chart'],
  alternates: { canonical: 'https://tidechartspro.com/tides/texas' },
  openGraph: {
    title: 'Texas Tide Charts | Tides for Fishing | TideChartsPro',
    description: 'Live tide charts and fishing tides for every Texas coastal location.',
    url: 'https://tidechartspro.com/tides/texas',
    siteName: 'TideChartsPro',
  },
}

const REGIONS = [
  'Sabine / Beaumont',
  'Galveston Bay',
  'Matagorda Bay',
  'Aransas / Corpus Christi',
  'Lower Laguna Madre',
]

export default function TexasTidesIndex() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Texas Tide Charts',
          description: 'Tide charts and fishing tides for all Texas coastal locations.',
          url: 'https://tidechartspro.com/tides/texas',
          breadcrumb: {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home',  item: 'https://tidechartspro.com' },
              { '@type': 'ListItem', position: 2, name: 'Tides', item: 'https://tidechartspro.com/tides' },
              { '@type': 'ListItem', position: 3, name: 'Texas', item: 'https://tidechartspro.com/tides/texas' },
            ],
          },
        })}}
      />
      <StateIndexPage
        stateName="Texas"
        stateSlug="texas"
        stateAbbr="TX"
        stations={TEXAS_STATIONS}
        regions={REGIONS}
        mapCenter={[28.5, -97.0]}
        mapZoom={6}
        description="Live tide charts, tides for fishing, solunar periods and hourly fishing forecasts for every Texas coastal location — from Sabine Pass through Galveston Bay, Matagorda Bay, Corpus Christi and the Lower Laguna Madre."
      />
    </>
  )
}
