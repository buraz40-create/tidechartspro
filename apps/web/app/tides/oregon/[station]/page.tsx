import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getStationBySlug, getAllSlugs } from '@/lib/oregon-stations'
import TideLocationPage from '@/app/tides/florida/TideLocationPage'

interface Props { params: Promise<{ station: string }> }

export async function generateStaticParams() {
  return getAllSlugs().map(slug => ({ station: slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { station: slug } = await params
  const s = getStationBySlug(slug)
  if (!s) return {}
  const city = s.city.replace(/, OR$/, '')
  const title = `${city} Tide Chart | Tides for Fishing | TideChartsPro`
  const description = `${s.city} tide chart with live tide levels, tides for fishing, solunar periods and hourly fishing forecast. ${city} tide level chart updated every 6 minutes. Best fishing tides for ${city} today.`
  const url = `https://tidechartspro.com/tides/oregon/${slug}`
  return {
    title, description,
    keywords: [`${city.toLowerCase()} tide chart`, `${city.toLowerCase()} tides for fishing`, `${city.toLowerCase()} fishing tides`, 'oregon tide chart', 'tides for fishing'],
    alternates: { canonical: url },
    openGraph: { type: 'website', url, title, description, siteName: 'TideChartsPro', images: [{ url: `https://tidechartspro.com/og/tides/oregon/${slug}.png`, width: 1200, height: 630 }] },
    twitter: { card: 'summary_large_image', title, description },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 } },
  }
}

function buildJsonLd(slug: string) {
  const s = getStationBySlug(slug)
  if (!s) return null
  const city = s.city.replace(/, OR$/, '')
  const url = `https://tidechartspro.com/tides/oregon/${slug}`
  return {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebPage', '@id': url, url, name: `${city} Tide Chart | Tides for Fishing`,
        description: `Live tide chart, tides for fishing, solunar periods and fishing forecast for ${s.city}.`,
        inLanguage: 'en-US',
        isPartOf: { '@type': 'WebSite', url: 'https://tidechartspro.com', name: 'TideChartsPro' },
        breadcrumb: { '@type': 'BreadcrumbList', itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home',             item: 'https://tidechartspro.com' },
          { '@type': 'ListItem', position: 2, name: 'Tides',            item: 'https://tidechartspro.com/tides' },
          { '@type': 'ListItem', position: 3, name: 'Oregon', item: 'https://tidechartspro.com/tides/oregon' },
          { '@type': 'ListItem', position: 4, name: s.name,             item: url },
        ]},
      },
      { '@type': 'Dataset', name: `${city} Tide Predictions`,
        description: `Hourly tide predictions, high/low tide times, and fishing solunar data for ${s.city}.`,
        url, creator: { '@type': 'Organization', name: 'TideChartsPro', url: 'https://tidechartspro.com' },
        spatialCoverage: { '@type': 'Place', name: s.city, geo: { '@type': 'GeoCoordinates', latitude: s.lat, longitude: s.lon } },
        variableMeasured: [{ '@type': 'PropertyValue', name: 'Tide Height', unitText: 'feet' }],
      },
      { '@type': 'FAQPage', mainEntity: [
        { '@type': 'Question', name: `What time is high tide in ${city} today?`,
          acceptedAnswer: { '@type': 'Answer', text: `High and low tide times for ${city} are updated daily. Check the tide chart above for today's exact times.` } },
        { '@type': 'Question', name: `What are the best tides for fishing in ${city}?`,
          acceptedAnswer: { '@type': 'Answer', text: `The best fishing tides in ${city} are the 2 hours before and after high or low tide. Our fishing score combines tide phase, solunar periods, and weather for a daily A–F grade.` } },
        { '@type': 'Question', name: `What is the tidal range in ${city}?`,
          acceptedAnswer: { '@type': 'Answer', text: `The mean tidal range in ${city} is approximately ${s.meanRange} feet. ${s.tidalType === 'semidiurnal' ? 'Tides are semidiurnal — two high and two low tides per day.' : 'Tides are mixed — two unequal high and low tides per day.'}` } },
      ]},
    ],
  }
}

export default async function StationPage({ params }: Props) {
  const { station: slug } = await params
  const station = getStationBySlug(slug)
  if (!station) notFound()
  const jsonLd = buildJsonLd(slug)
  return (
    <>
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />}
      <TideLocationPage station={station} />
    </>
  )
}
