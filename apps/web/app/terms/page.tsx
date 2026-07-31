import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service | TideChartsPro',
  description: 'Terms of service for TideChartsPro — conditions of use, disclaimers, and liability limitations.',
  alternates: { canonical: 'https://tidechartspro.com/terms' },
}

export default function TermsPage() {
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
          <span style={{ fontSize: 13, color: '#94a3b8' }}>Terms of Service</span>
        </div>
      </nav>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '48px 20px 80px' }}>

        <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 8, letterSpacing: '-0.02em' }}>Terms of Service</h1>
        <p style={{ color: '#475569', fontSize: 13, marginBottom: 48 }}>Last updated: April 13, 2026</p>

        {[
          {
            title: 'Acceptance of Terms',
            body: 'By accessing or using TideChartsPro ("the Service"), including the website at tidechartspro.com and the TideChartsPro mobile application ("App"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you must not use the Service. These Terms apply to all visitors, users, and others who access or use the Service.',
          },
          {
            title: 'CRITICAL SAFETY DISCLAIMER — Not for Navigation',
            body: 'TIDECHARTSPRO IS NOT INTENDED FOR USE IN NAVIGATION, MARITIME OPERATIONS, COMMERCIAL FISHING, OR ANY ACTIVITY WHERE INACCURATE TIDE OR WEATHER DATA COULD RESULT IN PERSONAL INJURY, DEATH, PROPERTY DAMAGE, OR LOSS OF VESSEL. Tide predictions, current data, and weather forecasts provided by TideChartsPro are sourced from NOAA and other public APIs and are provided for INFORMATIONAL AND RECREATIONAL PURPOSES ONLY. You are solely responsible for verifying all data through official NOAA sources before making any boating, navigation, or safety-critical decisions. Always check official NOAA tide tables and consult local maritime authorities before going on the water.',
          },
          {
            title: 'No Warranty — Accuracy of Data',
            body: 'THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, ACCURACY, COMPLETENESS, OR NON-INFRINGEMENT. TideChartsPro does not warrant that: (a) tide predictions, water levels, weather forecasts, or any other data will be accurate, complete, current, or error-free; (b) the Service will be uninterrupted, timely, secure, or free from errors; (c) the results obtained from using the Service will meet your requirements. Tide and weather data are inherently subject to natural variability, sensor errors, and API outages. Actual conditions on the water may differ significantly from predictions.',
          },
          {
            title: 'Limitation of Liability',
            body: 'TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, TIDECHARTSPRO AND ITS OWNERS, OFFICERS, EMPLOYEES, AGENTS, AFFILIATES, AND LICENSORS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, PUNITIVE, OR EXEMPLARY DAMAGES, INCLUDING BUT NOT LIMITED TO DAMAGES FOR LOSS OF LIFE, PERSONAL INJURY, PROPERTY DAMAGE, VESSEL DAMAGE OR LOSS, LOSS OF PROFITS, LOSS OF DATA, OR BUSINESS INTERRUPTION, ARISING OUT OF OR IN CONNECTION WITH YOUR USE OF THE SERVICE OR RELIANCE ON ANY DATA PROVIDED, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. IN NO EVENT SHALL TIDECHARTSPRO\'S TOTAL LIABILITY TO YOU FOR ALL CLAIMS ARISING FROM OR RELATED TO THE SERVICE EXCEED THE AMOUNT YOU PAID TO TIDECHARTSPRO IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM, OR $0 IF YOU HAVE NOT MADE ANY PAYMENTS.',
          },
          {
            title: 'Indemnification',
            body: 'You agree to defend, indemnify, and hold harmless TideChartsPro and its owners, officers, employees, agents, and affiliates from and against any and all claims, damages, losses, costs, and expenses (including reasonable attorneys\' fees) arising out of or relating to: (a) your use of the Service; (b) your reliance on any tide, weather, or other data provided by the Service; (c) your violation of these Terms; (d) your violation of any applicable law or regulation; or (e) any activity you conduct on the water based on information obtained from the Service.',
          },
          {
            title: 'Data Sources and Third Parties',
            body: 'TideChartsPro sources tide and water level data from the NOAA Center for Operational Oceanographic Products and Services (CO-OPS), weather data from the NOAA National Weather Service, and map data from OpenStreetMap contributors. TideChartsPro has no affiliation with NOAA, the National Weather Service, or OpenStreetMap. TideChartsPro is not responsible for errors, inaccuracies, or outages in data provided by third-party sources. References to these sources do not constitute endorsement by or affiliation with TideChartsPro.',
          },
          {
            title: 'Intellectual Property',
            body: 'The TideChartsPro name, logo, website design, mobile application, and all original content, features, and functionality are owned by TideChartsPro and are protected by copyright, trademark, and other intellectual property laws. You may not copy, modify, distribute, sell, or lease any part of the Service or its content, nor may you reverse engineer or attempt to extract the source code of the App, without express written permission from TideChartsPro. Tide prediction data and weather data are sourced from NOAA and remain in the public domain.',
          },
          {
            title: 'Prohibited Uses',
            body: 'You agree not to use the Service to: (a) violate any applicable law or regulation; (b) scrape, crawl, or systematically download data from the Service in a manner that burdens our infrastructure or circumvents rate limits; (c) attempt to gain unauthorized access to any part of the Service or its underlying systems; (d) use the Service to provide data or services to third parties without our written consent; (e) interfere with or disrupt the integrity or performance of the Service; or (f) use the Service for any commercial purpose without our prior written consent.',
          },
          {
            title: 'Disclaimer for Boating and Fishing Activities',
            body: 'Boating, fishing, and other water activities involve inherent risks including but not limited to drowning, hypothermia, vessel capsizing, collision, and adverse weather. TideChartsPro does not assume any responsibility for accidents, injuries, deaths, vessel damage, or property loss that occur in connection with water activities, regardless of whether the user consulted TideChartsPro before or during such activities. Users assume all risk associated with their activities on the water. Always wear a properly fitted life jacket, file a float plan, monitor official weather forecasts, and follow all applicable boating safety regulations.',
          },
          {
            title: 'Changes to the Service and Terms',
            body: 'TideChartsPro reserves the right to modify or discontinue the Service (or any part thereof) at any time, with or without notice. We also reserve the right to update these Terms at any time. Changes will be posted on this page with an updated date. Your continued use of the Service after any changes constitutes your acceptance of the revised Terms. It is your responsibility to review these Terms periodically.',
          },
          {
            title: 'Governing Law and Dispute Resolution',
            body: 'These Terms shall be governed by and construed in accordance with the laws of the State of Florida, United States of America, without regard to its conflict of law provisions. Any dispute arising from or relating to these Terms or the Service shall be subject to the exclusive jurisdiction of the state and federal courts located in Florida. You consent to personal jurisdiction in such courts and waive any objection to venue.',
          },
          {
            title: 'Severability',
            body: 'If any provision of these Terms is found to be unenforceable or invalid by a court of competent jurisdiction, that provision shall be modified to the minimum extent necessary to make it enforceable, and the remaining provisions shall continue in full force and effect. The failure of TideChartsPro to enforce any right or provision of these Terms shall not be deemed a waiver of that right or provision.',
          },
          {
            title: 'Entire Agreement',
            body: 'These Terms, together with the Privacy Policy at tidechartspro.com/privacy, constitute the entire agreement between you and TideChartsPro regarding the Service and supersede all prior and contemporaneous understandings, agreements, representations, and warranties, both written and oral, regarding the Service.',
          },
          {
            title: 'Contact',
            body: 'If you have any questions about these Terms of Service, please contact us at legal@tidechartspro.com.',
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
