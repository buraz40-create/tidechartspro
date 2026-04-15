import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getStationBySlug, getAllSlugs, FLORIDA_STATIONS } from '@/lib/florida-stations'
import { computeNearby } from '@/lib/nearby-utils'
import TideLocationPage from '../TideLocationPage'

interface Props {
  params: Promise<{ station: string }>
}

// Pre-render all Florida station pages at build time
export async function generateStaticParams() {
  return getAllSlugs().map(slug => ({ station: slug }))
}

// ─── SEO Metadata ─────────────────────────────────────────────────────────────
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { station: slug } = await params
  const s = getStationBySlug(slug)
  if (!s) return {}

  // City without state suffix for cleaner title
  const city = s.city.replace(/, FL$/, '')
  const cityFL = s.city // "Jacksonville, FL"

  const title = `${city} Tide Chart | Tides for Fishing | TideChartsPro`
  const description =
    `${cityFL} tide chart with live tide levels, tides for fishing, solunar periods ` +
    `and hourly fishing forecast. ${city} tide level chart updated every 6 minutes. ` +
    `Best fishing tides for ${city} today.`

  const url = `https://tidechartspro.com/tides/us/florida/${slug}`
  const ogImage = `https://tidechartspro.com/og/tides/florida/${slug}.png`

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
      `${city.toLowerCase()} FL tide chart`,
      `tide chart`,
      `tide level chart`,
      `tides for fishing`,
      `florida tide chart`,
      `florida tides for fishing`,
    ],
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      url,
      title,
      description,
      siteName: 'TideChartsPro',
      images: [{ url: ogImage, width: 1200, height: 630, alt: `${city} Tide Chart` }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
    },
  }
}

// ─── JSON-LD Schema ───────────────────────────────────────────────────────────
function buildJsonLd(slug: string) {
  const s = getStationBySlug(slug)
  if (!s) return null

  const city = s.city.replace(/, FL$/, '')
  const url = `https://tidechartspro.com/tides/us/florida/${slug}`

  // FAQPage is a subtype of WebPage — merge into one object to avoid "Duplicate field" error
  const faqPage = {
    '@type': 'FAQPage',
    '@id': url,
    url,
    name: `${city} Tide Chart | Tides for Fishing`,
    description: `Live tide chart, tides for fishing, solunar periods and fishing forecast for ${s.city}.`,
    inLanguage: 'en-US',
    isPartOf: { '@type': 'WebSite', url: 'https://tidechartspro.com', name: 'TideChartsPro' },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home',    item: 'https://tidechartspro.com' },
        { '@type': 'ListItem', position: 2, name: 'Tides',   item: 'https://tidechartspro.com/tides' },
        { '@type': 'ListItem', position: 3, name: 'Florida', item: 'https://tidechartspro.com/tides/us/florida' },
        { '@type': 'ListItem', position: 4, name: s.name,    item: url },
      ],
    },
    mainEntity: [
      {
        '@type': 'Question',
        name: `What time is high tide in ${city} today?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `The high and low tide times for ${city} are updated daily on TideChartsPro using verified tide prediction data. Check the tide chart above for today's exact high tide times.`,
        },
      },
      {
        '@type': 'Question',
        name: `What are the best tides for fishing in ${city}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `The best fishing tides in ${city} are typically the 2 hours before and after a high or low tide — known as the "moving tide." Our fishing score combines tide phase, solunar periods, and weather to give you a daily A–F fishing grade.`,
        },
      },
      {
        '@type': 'Question',
        name: `What is the tidal range in ${city}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `The mean tidal range in ${city} is approximately ${s.meanRange} feet. ${s.tidalType === 'semidiurnal' ? 'Tides are semidiurnal — two high and two low tides per day.' : s.tidalType === 'diurnal' ? 'Tides are diurnal — predominantly one high and one low tide per day.' : 'Tides are mixed — two unequal high and low tides per day.'}`,
        },
      },
    ],
  }

  const dataset = {
    '@type': 'Dataset',
    name: `${city} Tide Predictions`,
    description: `Hourly tide predictions, high/low tide times, and fishing solunar data for ${s.city}.`,
    url,
    creator: { '@type': 'Organization', name: 'TideChartsPro', url: 'https://tidechartspro.com' },
    spatialCoverage: {
      '@type': 'Place',
      name: s.city,
      geo: { '@type': 'GeoCoordinates', latitude: s.lat, longitude: s.lon },
    },
    variableMeasured: [
      { '@type': 'PropertyValue', name: 'Tide Height', unitText: 'feet' },
      { '@type': 'PropertyValue', name: 'High Tide Time', unitText: 'hours' },
      { '@type': 'PropertyValue', name: 'Low Tide Time', unitText: 'hours' },
    ],
  }

  return {
    '@context': 'https://schema.org',
    '@graph': [faqPage, dataset],
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function StationPage({ params }: Props) {
  const { station: slug } = await params
  const station = getStationBySlug(slug)
  if (!station) notFound()

  const jsonLd = buildJsonLd(slug)

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <TideLocationPage station={{ ...station!, nearby: computeNearby(station!, FLORIDA_STATIONS) }} />
    </>
  )
}
