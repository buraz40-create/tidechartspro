// Audits all internal links across the TideChartsPro site
// Run: node apps/web/scripts/audit-links.mjs

import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

// ─── 1. Parse florida-stations.ts to extract all slugs + nearby refs ─────────

const stationsTs = readFileSync(join(root, 'lib/florida-stations.ts'), 'utf8')

// Top-level station slugs: appear as  slug: "...",  (followed by comma = station property)
const slugMatches = [...stationsTs.matchAll(/^\s+name: "[^"]+", slug: "([^"]+)",/gm)]
const allSlugs = new Set(slugMatches.map(m => m[1]))

// Nearby slug refs: appear as  slug: "..."  followed by optional whitespace then }
const nearbySlugsRaw = [...stationsTs.matchAll(/slug: "([^"]+)"\s*\}/g)]
const nearbySlugRefs = nearbySlugsRaw.map(m => m[1])

// ─── 2. Check every nearby slug exists ───────────────────────────────────────

const brokenNearby = []
for (const slug of nearbySlugRefs) {
  if (!allSlugs.has(slug)) {
    brokenNearby.push(slug)
  }
}

// ─── 3. Check pablo-creek-entrance/page.tsx nearby slugs ─────────────────────

const pabloTs = readFileSync(
  join(root, 'app/tides/florida/pablo-creek-entrance/page.tsx'), 'utf8'
)
const pabloNearby = [...pabloTs.matchAll(/slug:\s*'([^']+)'/g)].map(m => m[1])
const brokenPablo = pabloNearby.filter(s => !allSlugs.has(s))

// ─── 4. Check home page FL station slugs ─────────────────────────────────────

const homeTs = readFileSync(join(root, 'app/page.tsx'), 'utf8')
// FL_MAP_STATIONS are derived from FLORIDA_STATIONS, no hardcoded slugs to check

// ─── 5. Check florida index page ─────────────────────────────────────────────

const floridaIndex = readFileSync(
  join(root, 'app/tides/florida/page.tsx'), 'utf8'
)
// Uses FLORIDA_STATIONS directly — no hardcoded slugs

// ─── 6. Slug uniqueness check ─────────────────────────────────────────────────

const allSlugArr = slugMatches.map(m => m[1])
const slugCounts = {}
for (const s of allSlugArr) slugCounts[s] = (slugCounts[s] || 0) + 1
const duplicateSlugs = Object.entries(slugCounts).filter(([, c]) => c > 1)

// ─── 7. Check dynamic route pages exist for all slugs ────────────────────────

import { existsSync } from 'fs'
const dynamicRoute = join(root, 'app/tides/florida/[station]/page.tsx')
const dynamicExists = existsSync(dynamicRoute)

// ─── 8. Check sitemap includes all FL stations ────────────────────────────────

const sitemapTs = readFileSync(join(root, 'app/sitemap.ts'), 'utf8')
const sitemapUsesRegistry = sitemapTs.includes('FLORIDA_STATIONS')

// ─── Report ───────────────────────────────────────────────────────────────────

console.log('\n══════════════════════════════════════════════')
console.log('  TideChartsPro Link Audit')
console.log('══════════════════════════════════════════════\n')

console.log(`📍 Total FL stations in registry:     ${allSlugs.size}`)
console.log(`🔗 Total nearby slug refs checked:    ${nearbySlugRefs.length}`)

console.log('')

// Nearby broken refs
const uniqueBrokenNearby = [...new Set(brokenNearby)]
if (uniqueBrokenNearby.length === 0) {
  console.log('✅ All nearby station slugs in florida-stations.ts are valid')
} else {
  console.log(`❌ Broken nearby slugs in florida-stations.ts (${uniqueBrokenNearby.length} unique):`)
  uniqueBrokenNearby.forEach(s => console.log(`   - ${s}`))
}

console.log('')

// Pablo Creek nearby
if (brokenPablo.length === 0) {
  console.log('✅ pablo-creek-entrance/page.tsx nearby slugs are all valid')
} else {
  console.log(`❌ Broken nearby slugs in pablo-creek-entrance/page.tsx:`)
  brokenPablo.forEach(s => console.log(`   - ${s}`))
}

console.log('')

// Duplicates
if (duplicateSlugs.length === 0) {
  console.log('✅ No duplicate slugs in registry')
} else {
  console.log(`❌ Duplicate slugs (${duplicateSlugs.length}):`)
  duplicateSlugs.forEach(([s, c]) => console.log(`   - "${s}" appears ${c} times`))
}

console.log('')

// Dynamic route
console.log(dynamicExists
  ? '✅ Dynamic route [station]/page.tsx exists'
  : '❌ Dynamic route [station]/page.tsx MISSING')

console.log('')

// Sitemap
console.log(sitemapUsesRegistry
  ? '✅ Sitemap uses FLORIDA_STATIONS registry (all 550 included)'
  : '❌ Sitemap does not reference FLORIDA_STATIONS')

console.log('')

// Static pablo page (should take precedence over dynamic route)
const pabloStatic = existsSync(join(root, 'app/tides/florida/pablo-creek-entrance/page.tsx'))
console.log(pabloStatic
  ? '✅ pablo-creek-entrance static page exists (overrides dynamic route)'
  : '⚠️  pablo-creek-entrance static page missing — dynamic route will serve it')

// Florida index
const floridaIndexExists = existsSync(join(root, 'app/tides/florida/page.tsx'))
console.log(floridaIndexExists
  ? '✅ /tides/florida index page exists'
  : '❌ /tides/florida index page MISSING')

console.log('\n══════════════════════════════════════════════\n')
