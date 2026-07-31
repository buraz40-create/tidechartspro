import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tide Charts by Country | TideChartsPro',
  description: 'Live tide charts, tides for fishing, solunar periods and fishing forecasts for coastal locations across the US and beyond.',
  alternates: { canonical: 'https://tidechartspro.com/tides' },
  openGraph: {
    title: 'Tide Charts by Country | TideChartsPro',
    description: 'Live tide charts and fishing forecasts for 3,300+ US coastal locations.',
    url: 'https://tidechartspro.com/tides',
    siteName: 'TideChartsPro',
  },
}

export default function TidesCountryHub() {
  return (
    <main style={{ background: '#0a0e1a', color: '#f1f5f9', minHeight: '100vh', fontFamily: "'Inter','system-ui',sans-serif" }}>

      {/* Nav */}
      <nav style={{ borderBottom: '1px solid #1e2d45', background: 'rgba(10,14,26,0.95)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 200 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px', height: 64, display: 'flex', alignItems: 'center', gap: 8 }}>
          <a href="/" style={{ textDecoration: 'none' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.webp" alt="TideChartsPro" style={{ height: 52, width: 'auto', display: 'block' }} />
          </a>
          <span style={{ color: '#475569', margin: '0 6px' }}>/</span>
          <span style={{ fontSize: 13, color: '#f1f5f9' }}>Tides</span>
        </div>
      </nav>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 20px 80px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ display: 'inline-block', fontSize: 11, fontWeight: 700, background: '#0c4a6e', color: '#38bdf8', border: '1px solid #38bdf844', padding: '3px 12px', borderRadius: 20, marginBottom: 14, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            3,300+ tide stations
          </div>
          <h1 style={{ fontSize: 'clamp(24px,4vw,38px)', fontWeight: 700, marginBottom: 10, letterSpacing: '-0.02em' }}>
            Tide Charts by Country
          </h1>
          <p style={{ color: '#94a3b8', fontSize: 15, maxWidth: 500, margin: '0 auto', lineHeight: 1.6 }}>
            Live tides, solunar periods, and fishing forecasts for coastal locations worldwide.
          </p>
        </div>

        {/* Country grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14, maxWidth: 900, margin: '0 auto' }}>

          {/* United States - live */}
          <a
            href="/tides/us"
            style={{
              display: 'block', background: '#111827', border: '1px solid #1e3a5f',
              borderRadius: 12, padding: '24px', textDecoration: 'none',
              position: 'relative', overflow: 'hidden',
            }}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, #38bdf8, #3b82f6)' }} />
            <div style={{ fontSize: 40, marginBottom: 12 }}>🇺🇸</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9', marginBottom: 4 }}>United States</div>
            <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 14, lineHeight: 1.5 }}>
              All 23 coastal states - Atlantic, Gulf Coast, and Pacific.
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: 20, fontWeight: 800, color: '#38bdf8' }}>3,360</span>
                <span style={{ fontSize: 11, color: '#475569', marginLeft: 5 }}>stations</span>
              </div>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#38bdf8' }}>Browse states →</span>
            </div>
          </a>

          {/* Coming soon countries */}
          {[
            { flag: '🇨🇦', name: 'Canada', desc: 'Atlantic, Pacific, and Arctic coasts.' },
            { flag: '🇬🇧', name: 'United Kingdom', desc: 'England, Scotland, Wales, and Northern Ireland.' },
            { flag: '🇦🇺', name: 'Australia', desc: 'Queensland, NSW, Victoria, and WA.' },
            { flag: '🇳🇿', name: 'New Zealand', desc: 'North Island, South Island, and Stewart Island.' },
            { flag: '🇫🇷', name: 'France', desc: 'Atlantic coast, Mediterranean, and overseas.' },
            { flag: '🇳🇴', name: 'Norway', desc: 'Norwegian coast and fjords.' },
          ].map(c => (
            <div
              key={c.name}
              style={{
                display: 'block', background: '#0d1117', border: '1px solid #1e2d45',
                borderRadius: 12, padding: '24px', opacity: 0.5,
              }}
            >
              <div style={{ fontSize: 40, marginBottom: 12 }}>{c.flag}</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#94a3b8', marginBottom: 4 }}>{c.name}</div>
              <div style={{ fontSize: 12, color: '#475569', marginBottom: 14, lineHeight: 1.5 }}>{c.desc}</div>
              <div style={{ fontSize: 11, color: '#475569', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Coming soon</div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 48, textAlign: 'center' }}>
          <a href="/" style={{ fontSize: 13, color: '#475569', textDecoration: 'none' }}>← Back to home</a>
        </div>
      </div>
    </main>
  )
}
