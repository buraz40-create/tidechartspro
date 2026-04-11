import type { Metadata } from 'next'
import { MISSISSIPPI_STATIONS } from '@/lib/mississippi-stations'

export const metadata: Metadata = {
  title: 'Mississippi Tide Charts | Tides for Fishing | TideChartsPro',
  description: 'Mississippi tide charts with live tide levels, tides for fishing, solunar periods and fishing forecasts for every Mississippi coastal location — Biloxi, Gulfport, Bay St. Louis and Pascagoula.',
  keywords: ['mississippi tide chart', 'mississippi tides for fishing', 'biloxi tide chart', 'gulfport tide chart', 'bay st louis tide chart', 'pascagoula tide chart', 'mississippi sound tide chart', 'mississippi fishing tides'],
  alternates: { canonical: 'https://tidechartspro.com/tides/mississippi' },
  openGraph: {
    title: 'Mississippi Tide Charts | Tides for Fishing | TideChartsPro',
    description: 'Live tide charts and fishing tides for every Mississippi coastal location.',
    url: 'https://tidechartspro.com/tides/mississippi',
    siteName: 'TideChartsPro',
  },
}

const REGIONS = ['Mississippi Sound', 'Pascagoula Area']

export default function MississippiTidesIndex() {
  const byRegion = REGIONS.map(region => ({
    region,
    stations: MISSISSIPPI_STATIONS.filter(s => s.region === region),
  })).filter(g => g.stations.length > 0)

  return (
    <main style={{ background: '#0a0e1a', color: '#f1f5f9', minHeight: '100vh', fontFamily: "'Inter','system-ui',sans-serif" }}>

      <nav style={{ borderBottom: '1px solid #1e2d45', background: 'rgba(10,14,26,0.95)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px', height: 64, display: 'flex', alignItems: 'center', gap: 8 }}>
          <a href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.webp" alt="TideChartsPro" style={{ height: 52, width: 'auto', display: 'block' }} />
          </a>
          <span style={{ color: '#475569', margin: '0 6px' }}>/</span>
          <a href="/tides" style={{ fontSize: 13, color: '#94a3b8', textDecoration: 'none' }}>Tides</a>
          <span style={{ color: '#475569', margin: '0 6px' }}>/</span>
          <span style={{ fontSize: 13, color: '#f1f5f9' }}>Mississippi</span>
        </div>
      </nav>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 20px 60px' }}>

        <div style={{ marginBottom: 40 }}>
          <div style={{ display: 'inline-block', fontSize: 11, fontWeight: 700, background: '#0c4a6e', color: '#38bdf8', border: '1px solid #38bdf844', padding: '3px 12px', borderRadius: 20, marginBottom: 14, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            {MISSISSIPPI_STATIONS.length} Mississippi Locations
          </div>
          <h1 style={{ fontSize: 'clamp(24px,4vw,40px)', fontWeight: 700, marginBottom: 12, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
            Mississippi Tide Charts
          </h1>
          <p style={{ color: '#94a3b8', fontSize: 15, maxWidth: 580, lineHeight: 1.6 }}>
            Live tide charts, tides for fishing, solunar periods and hourly fishing forecasts for every Mississippi coastal location — Mississippi Sound, Biloxi, Gulfport, Bay St. Louis and Pascagoula.
          </p>
        </div>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'Mississippi Tide Charts',
            description: 'Tide charts and fishing tides for all Mississippi coastal locations.',
            url: 'https://tidechartspro.com/tides/mississippi',
            breadcrumb: {
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home',        item: 'https://tidechartspro.com' },
                { '@type': 'ListItem', position: 2, name: 'Tides',       item: 'https://tidechartspro.com/tides' },
                { '@type': 'ListItem', position: 3, name: 'Mississippi', item: 'https://tidechartspro.com/tides/mississippi' },
              ],
            },
          })}}
        />

        {byRegion.map(({ region, stations }) => (
          <div key={region} style={{ marginBottom: 36 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14, borderBottom: '1px solid #1e2d45', paddingBottom: 8 }}>
              {region}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 10 }}>
              {stations.map(s => (
                <a
                  key={s.slug}
                  href={`/tides/mississippi/${s.slug}`}
                  style={{ display: 'block', background: '#111827', border: '1px solid #1e2d45', borderRadius: 10, padding: '14px 16px', textDecoration: 'none' }}
                >
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#f1f5f9', marginBottom: 4 }}>{s.name}</div>
                  <div style={{ fontSize: 11, color: '#475569' }}>{s.city} · {s.tidalType} tides · {s.meanRange}ft range</div>
                  <div style={{ marginTop: 8, fontSize: 11, color: '#38bdf8', fontWeight: 600 }}>View tide chart →</div>
                </a>
              ))}
            </div>
          </div>
        ))}

        <div style={{ marginTop: 24, paddingTop: 24, borderTop: '1px solid #1e2d45' }}>
          <a href="/" style={{ fontSize: 13, color: '#475569', textDecoration: 'none' }}>← Back to all states</a>
        </div>
      </div>
    </main>
  )
}
