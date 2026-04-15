import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pablo Creek Entrance Tide Chart & Fishing Times | TideChartsPro',
  description: 'Tide times, solunar fishing periods, and hourly weather for Pablo Creek Entrance, Jacksonville FL. Live tide predictions, major/minor solunar windows, and 7-day forecast.',
  keywords: 'Pablo Creek tides, Pablo Creek fishing times, Jacksonville tide chart, solunar periods Jacksonville FL, tides Florida east coast',
  alternates: {
    canonical: 'https://tidechartspro.com/tides/florida/pablo-creek-entrance',
  },
  openGraph: {
    title: 'Pablo Creek Entrance — Tides & Fishing Times',
    description: 'Live tide predictions, solunar fishing windows, and hourly weather for Pablo Creek Entrance, Jacksonville FL.',
    url: 'https://tidechartspro.com/tides/florida/pablo-creek-entrance',
    siteName: 'TideChartsPro',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary',
    title: 'Pablo Creek Entrance Tides & Fishing Times',
    description: 'Live tide predictions, solunar fishing windows, and hourly weather for Pablo Creek Entrance, Jacksonville FL.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* JSON-LD structured data — helps Google understand this is a location page */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'Pablo Creek Entrance Tide Chart & Fishing Times',
            description: 'Tide times, solunar fishing periods, and weather for Pablo Creek Entrance, Jacksonville FL',
            url: 'https://tidechartspro.com/tides/florida/pablo-creek-entrance',
            about: {
              '@type': 'Place',
              name: 'Pablo Creek Entrance',
              geo: {
                '@type': 'GeoCoordinates',
                latitude: 30.365,
                longitude: -81.408,
              },
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'Jacksonville',
                addressRegion: 'FL',
                addressCountry: 'US',
              },
            },
            provider: {
              '@type': 'Organization',
              name: 'TideChartsPro',
              url: 'https://tidechartspro.com',
            },
          }),
        }}
      />
      {children}
    </>
  )
}
