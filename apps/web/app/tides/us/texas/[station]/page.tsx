import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getStationBySlug, getAllSlugs } from '@/lib/texas-stations'
import TideLocationPage from '@/app/tides/florida/TideLocationPage'

interface Props {
  params: Promise<{ station: string }>
}

export async function generateStaticParams() {
  return getAllSlugs().map(slug => ({ station: slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { station: slug } = await params
  const s = getStationBySlug(slug)
  if (!s) return {}

  const city = s.city.replace(/, TX$/, '')
  const cityTX = s.city

  const title = `${city} Tide Chart | Tides for Fishing | TideChartsPro`
  const description =
    `${cityTX} tide chart with live tide levels, tides for fishing, solunar periods ` +
    `and hourly fishing forecast. ${city} tide level chart updated every 6 minutes. ` +
    `Best fishing tides for ${city} today.`

  const url = `https://tidechartspro.com/tides/texas/${slug}`
  const ogImage = `https://tidechartspro.com/og/tides/texas/${slug}.png`

  return {
    title,
    description,
    keywords: [
      `${city.toLowerCase()} tide chart`,
      `${city.toLowerCase()} tide level chart`,
      `tides for fishing ${city.toLowerCase()}`,
      `tide for fishing ${city.toLowerCase()}`,
      `${city.toLowerCase()} tide chart for fishing`,
      `${city.toLowerCase()} tides today`,
      `${city.toLowerCase()} fishing tides`,
      `${city.toLowerCase()} high tide low tide`,
      `${city.toLowerCase()} TX tide chart`,
      `texas tide chart`,
      `texas tides for fishing`,
      `gulf coast tide chart`,
      `tide chart`,
      `tides for fishing`,
    ],
    alternates: { canonical: url },
    openGraph: {
      type: 'website', url, title, description, siteName: 'TideChartsPro',
      images: [{ url: ogImage, width: 1200, height: 630, alt: `${city} Tide Chart` }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [ogImage] },
    robots: {
      index: true, follow: true,
      googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
    },
  }
}

function buildJsonLd(slug: string) {
  const s = getStationBySlug(slug)
  if (!s) return null
  const city = s.city.replace(/, TX$/, '')
  const url = `https://tidechartspro.com/tides/texas/${slug}`
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage', '@id': url, url,
        name: `${city} Tide Chart | Tides for Fishing`,
        description: `Live tide chart, tides for fishing, solunar periods and fishing forecast for ${s.city}.`,
        inLanguage: 'en-US',
        isPartOf: { '@type': 'WebSite', url: 'https://tidechartspro.com', name: 'TideChartsPro' },
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home',  item: 'https://tidechartspro.com' },
            { '@type': 'ListItem', position: 2, name: 'Tides', item: 'https://tidechartspro.com/tides' },
            { '@type': 'ListItem', position: 3, name: 'Texas', item: 'https://tidechartspro.com/tides/texas' },
            { '@type': 'ListItem', position: 4, name: s.name,  item: url },
          ],
        },
      },
      {
        '@type': 'Dataset',
        name: `${city} Tide Predictions`,
        description: `Hourly tide predictions, high/low tide times, and fishing solunar data for ${s.city}.`,
        url,
        creator: { '@type': 'Organization', name: 'TideChartsPro', url: 'https://tidechartspro.com' },
        spatialCoverage: {
          '@type': 'Place', name: s.city,
          geo: { '@type': 'GeoCoordinates', latitude: s.lat, longitude: s.lon },
        },
        variableMeasured: [
          { '@type': 'PropertyValue', name: 'Tide Height', unitText: 'feet' },
          { '@type': 'PropertyValue', name: 'High Tide Time', unitText: 'hours' },
          { '@type': 'PropertyValue', name: 'Low Tide Time', unitText: 'hours' },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: `What time is high tide in ${city} today?`,
            acceptedAnswer: { '@type': 'Answer', text: `The high and low tide times for ${city} are updated daily on TideChartsPro. Check the tide chart above for today's exact high tide times.` },
          },
          {
            '@type': 'Question',
            name: `What are the best tides for fishing in ${city}?`,
            acceptedAnswer: { '@type': 'Answer', text: `The best fishing tides in ${city} are typically the 2 hours before and after a high or low tide. Our fishing score combines tide phase, solunar periods, and weather to give you a daily A–F fishing grade.` },
          },
          {
            '@type': 'Question',
            name: `What is the tidal range in ${city}?`,
            acceptedAnswer: { '@type': 'Answer', text: `The mean tidal range in ${city} is approximately ${s.meanRange} feet. Texas Gulf Coast tides are diurnal — typically one high and one low tide per day, strongly influenced by wind.` },
          },
        ],
      },
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
