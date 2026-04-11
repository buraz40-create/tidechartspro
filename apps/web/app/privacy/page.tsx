import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | TideChartsPro',
  description: 'Privacy policy for TideChartsPro — how we collect and use data.',
  alternates: { canonical: 'https://tidechartspro.com/privacy' },
}

export default function PrivacyPage() {
  return (
    <main style={{ background: '#0a0e1a', color: '#f1f5f9', minHeight: '100vh', fontFamily: "'Inter','system-ui',sans-serif" }}>

      {/* Nav */}
      <nav style={{ borderBottom: '1px solid #1e2d45', background: 'rgba(10,14,26,0.95)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 200 }}>
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 20px', height: 64, display: 'flex', alignItems: 'center', gap: 8 }}>
          <a href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.webp" alt="TideChartsPro" style={{ height: 52, width: 'auto', display: 'block' }} />
          </a>
          <span style={{ color: '#475569', margin: '0 6px' }}>/</span>
          <span style={{ fontSize: 13, color: '#94a3b8' }}>Privacy Policy</span>
        </div>
      </nav>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '48px 20px 80px' }}>

        <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 8, letterSpacing: '-0.02em' }}>Privacy Policy</h1>
        <p style={{ color: '#475569', fontSize: 13, marginBottom: 48 }}>Last updated: April 11, 2026</p>

        {[
          {
            title: 'Overview',
            body: 'TideChartsPro ("we", "us", or "our") operates tidechartspro.com. This page explains what information we collect, how we use it, and your rights. We are committed to protecting your privacy. We do not sell your data to third parties.',
          },
          {
            title: 'Information We Collect',
            body: 'We do not require you to create an account or provide any personal information to use TideChartsPro. We collect anonymous usage data through Google Analytics (GA4), which may include pages visited, time on site, browser type, device type, and general geographic location (city/country level). This data is aggregated and cannot be used to identify you personally. We do not collect names, email addresses, or payment information.',
          },
          {
            title: 'Cookies',
            body: 'We use cookies solely through Google Analytics to understand how visitors interact with our site. These are analytics cookies and do not track you across other websites for advertising purposes. You can disable cookies in your browser settings at any time without affecting your ability to use TideChartsPro.',
          },
          {
            title: 'Google Analytics',
            body: 'We use Google Analytics 4 (GA4) to measure site usage. Google may use this data in accordance with their own privacy policy. You can opt out of Google Analytics tracking by installing the Google Analytics Opt-out Browser Add-on available at tools.google.com/dlpage/gaoptout.',
          },
          {
            title: 'Third-Party Data Sources',
            body: 'Tide predictions and water level data are sourced from NOAA (National Oceanic and Atmospheric Administration) CO-OPS. Weather forecasts are sourced from the NOAA National Weather Service API. Map tiles are provided by OpenStreetMap contributors. These services have their own privacy policies and we encourage you to review them.',
          },
          {
            title: 'Data Retention',
            body: 'We do not store any personally identifiable information on our servers. Analytics data retained through Google Analytics follows Google\'s standard retention policies, which you can review at support.google.com.',
          },
          {
            title: 'Children\'s Privacy',
            body: 'TideChartsPro is not directed at children under the age of 13 and we do not knowingly collect personal information from children.',
          },
          {
            title: 'Changes to This Policy',
            body: 'We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated date. Continued use of TideChartsPro after any changes constitutes your acceptance of the updated policy.',
          },
          {
            title: 'Contact',
            body: 'If you have any questions about this Privacy Policy, please contact us at privacy@tidechartspro.com.',
          },
        ].map(section => (
          <section key={section.title} style={{ marginBottom: 40, paddingBottom: 40, borderBottom: '1px solid #1e2d45' }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12, color: '#f1f5f9' }}>{section.title}</h2>
            <p style={{ fontSize: 15, color: '#94a3b8', lineHeight: 1.75, margin: 0 }}>{section.body}</p>
          </section>
        ))}

        <a href="/" style={{ fontSize: 13, color: '#475569', textDecoration: 'none' }}>← Back to home</a>
      </div>
    </main>
  )
}
