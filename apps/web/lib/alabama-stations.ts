// AUTO-GENERATED — do not edit by hand.
// Source: NOAA CO-OPS tide prediction stations, Alabama
// Regenerate: node apps/web/scripts/generate-gulf-stations.mjs

import type { StationConfig, NearbyStation, Species } from './florida-stations'
export type { StationConfig, NearbyStation, Species }

export const ALABAMA_STATIONS: StationConfig[] = [
  {
    id: "8730561", waterTempId: "8730561",
    name: "Arnica Bay, Mill Point", slug: "arnica-bay-mill-point",
    state: "alabama", city: "Arnica Bay, Mill Point, AL", region: "Alabama Gulf Coast",
    lat: 30.310199737548828, lon: -87.51930236816406, latDisplay: "30.31°N", lonDisplay: "87.52°W",
    sunLat: 30.31, sunMeridian: 90, sunLon: 87.52, utcOffset: 0,
    sunriseRef: 6.88, sunsetRef: 19.71,
    tidalType: 'diurnal', meanRange: 1.5, waterTempDefault: '68°F',
    nearby: [
    { name: "Alabama Point", lat: 30.27861111111111, lon: -87.55500030517578, slug: "alabama-point" },
    { name: "Wolf Bay", lat: 30.354999542236328, lon: -87.5999984741211, slug: "wolf-bay" },
    { name: "Gulf State Park Pier", lat: 30.248300552368164, lon: -87.66829681396484, slug: "gulf-state-park-pier" },
    { name: "Gulf Shores, ICWW", lat: 30.27988888888889, lon: -87.68427777777778, slug: "gulf-shores-icww" }
    ],
    species: [
    { name: 'Red Snapper',      icon: '🎣', color: '#ef4444', bait: 'Squid, cigar minnow, live shrimp',  regulation: '16″ min · 2/day · season',  when: 'Offshore reefs & rigs — major solunar' },
    { name: 'Redfish',          icon: '🎣', color: '#f97316', bait: 'Mullet chunk, shrimp, DOA crab',    regulation: 'Slot 18–27″ · 5/day',       when: 'Outgoing tide on flats & marsh edges' },
    { name: 'Speckled Trout',   icon: '🐟', color: '#60a5fa', bait: 'Mirrolure, live shrimp, gulp',      regulation: 'Slot 12–15″ · 15/day',      when: 'Early morning grass flats — incoming' },
    { name: 'Flounder',         icon: '🐡', color: '#34d399', bait: 'Gulp! shrimp, finger mullet',       regulation: '12″ min · 10/day',          when: 'Incoming tide near passes & drop-offs' },
    { name: 'Spanish Mackerel', icon: '🐡', color: '#facc15', bait: 'Gotcha plug, Clarkspoon, pilchard', regulation: '12″ min · 7/day',           when: 'Open water — outgoing tide & passes' },
  ],
  },
  {
    id: "8730667", waterTempId: "8730667",
    name: "Alabama Point", slug: "alabama-point",
    state: "alabama", city: "Alabama Point, AL", region: "Alabama Gulf Coast",
    lat: 30.27861111111111, lon: -87.55500030517578, latDisplay: "30.28°N", lonDisplay: "87.56°W",
    sunLat: 30.28, sunMeridian: 90, sunLon: 87.56, utcOffset: 0,
    sunriseRef: 6.88, sunsetRef: 19.71,
    tidalType: 'diurnal', meanRange: 1.5, waterTempDefault: '68°F',
    nearby: [
    { name: "Arnica Bay, Mill Point", lat: 30.310199737548828, lon: -87.51930236816406, slug: "arnica-bay-mill-point" },
    { name: "Wolf Bay", lat: 30.354999542236328, lon: -87.5999984741211, slug: "wolf-bay" },
    { name: "Gulf State Park Pier", lat: 30.248300552368164, lon: -87.66829681396484, slug: "gulf-state-park-pier" },
    { name: "Gulf Shores, ICWW", lat: 30.27988888888889, lon: -87.68427777777778, slug: "gulf-shores-icww" }
    ],
    species: [
    { name: 'Red Snapper',      icon: '🎣', color: '#ef4444', bait: 'Squid, cigar minnow, live shrimp',  regulation: '16″ min · 2/day · season',  when: 'Offshore reefs & rigs — major solunar' },
    { name: 'Redfish',          icon: '🎣', color: '#f97316', bait: 'Mullet chunk, shrimp, DOA crab',    regulation: 'Slot 18–27″ · 5/day',       when: 'Outgoing tide on flats & marsh edges' },
    { name: 'Speckled Trout',   icon: '🐟', color: '#60a5fa', bait: 'Mirrolure, live shrimp, gulp',      regulation: 'Slot 12–15″ · 15/day',      when: 'Early morning grass flats — incoming' },
    { name: 'Flounder',         icon: '🐡', color: '#34d399', bait: 'Gulp! shrimp, finger mullet',       regulation: '12″ min · 10/day',          when: 'Incoming tide near passes & drop-offs' },
    { name: 'Spanish Mackerel', icon: '🐡', color: '#facc15', bait: 'Gotcha plug, Clarkspoon, pilchard', regulation: '12″ min · 7/day',           when: 'Open water — outgoing tide & passes' },
  ],
  },
  {
    id: "8730849", waterTempId: "8730849",
    name: "Wolf Bay", slug: "wolf-bay",
    state: "alabama", city: "Wolf Bay, AL", region: "Mobile Bay",
    lat: 30.354999542236328, lon: -87.5999984741211, latDisplay: "30.35°N", lonDisplay: "87.60°W",
    sunLat: 30.35, sunMeridian: 90, sunLon: 87.6, utcOffset: 0,
    sunriseRef: 6.88, sunsetRef: 19.71,
    tidalType: 'diurnal', meanRange: 1.5, waterTempDefault: '68°F',
    nearby: [
    { name: "Arnica Bay, Mill Point", lat: 30.310199737548828, lon: -87.51930236816406, slug: "arnica-bay-mill-point" },
    { name: "Alabama Point", lat: 30.27861111111111, lon: -87.55500030517578, slug: "alabama-point" },
    { name: "Gulf Shores, ICWW", lat: 30.27988888888889, lon: -87.68427777777778, slug: "gulf-shores-icww" },
    { name: "Gulf State Park Pier", lat: 30.248300552368164, lon: -87.66829681396484, slug: "gulf-state-park-pier" }
    ],
    species: [
    { name: 'Redfish',          icon: '🎣', color: '#f97316', bait: 'Mullet chunk, shrimp, soft plastic', regulation: 'Slot 18–27″ · 5/day',      when: 'Outgoing tide on flats & grass beds' },
    { name: 'Speckled Trout',   icon: '🐟', color: '#60a5fa', bait: 'Mirrolure, live shrimp, croaker',   regulation: 'Slot 12–15″ · 15/day',     when: 'Early morning grass flats' },
    { name: 'Flounder',         icon: '🐡', color: '#34d399', bait: 'Gulp! shrimp, live mud minnow',     regulation: '12″ min · 10/day',         when: 'Incoming tide near drop-offs & channels' },
    { name: 'Sheepshead',       icon: '🐡', color: '#a78bfa', bait: 'Fiddler crab, barnacle, shrimp',    regulation: '10″ min · 8/day',          when: 'Structure — bridges, piers, pilings' },
    { name: 'Black Drum',       icon: '🐟', color: '#94a3b8', bait: 'Crab, shrimp, cut mullet',          regulation: '12″ min · 5/day',          when: 'Incoming tide — channels & shell beds' },
  ],
  },
  {
    id: "8731269", waterTempId: "8731269",
    name: "Gulf State Park Pier", slug: "gulf-state-park-pier",
    state: "alabama", city: "Gulf State Park Pier, AL", region: "Alabama Gulf Coast",
    lat: 30.248300552368164, lon: -87.66829681396484, latDisplay: "30.25°N", lonDisplay: "87.67°W",
    sunLat: 30.25, sunMeridian: 90, sunLon: 87.67, utcOffset: 0,
    sunriseRef: 6.89, sunsetRef: 19.71,
    tidalType: 'diurnal', meanRange: 1.5, waterTempDefault: '68°F',
    nearby: [
    { name: "Gulf Shores, ICWW", lat: 30.27988888888889, lon: -87.68427777777778, slug: "gulf-shores-icww" },
    { name: "Bon Secour, Bon Secour River", lat: 30.3033, lon: -87.735, slug: "bon-secour-bon-secour-river" },
    { name: "Alabama Point", lat: 30.27861111111111, lon: -87.55500030517578, slug: "alabama-point" },
    { name: "Wolf Bay", lat: 30.354999542236328, lon: -87.5999984741211, slug: "wolf-bay" }
    ],
    species: [
    { name: 'Red Snapper',      icon: '🎣', color: '#ef4444', bait: 'Squid, cigar minnow, live shrimp',  regulation: '16″ min · 2/day · season',  when: 'Offshore reefs & rigs — major solunar' },
    { name: 'Redfish',          icon: '🎣', color: '#f97316', bait: 'Mullet chunk, shrimp, DOA crab',    regulation: 'Slot 18–27″ · 5/day',       when: 'Outgoing tide on flats & marsh edges' },
    { name: 'Speckled Trout',   icon: '🐟', color: '#60a5fa', bait: 'Mirrolure, live shrimp, gulp',      regulation: 'Slot 12–15″ · 15/day',      when: 'Early morning grass flats — incoming' },
    { name: 'Flounder',         icon: '🐡', color: '#34d399', bait: 'Gulp! shrimp, finger mullet',       regulation: '12″ min · 10/day',          when: 'Incoming tide near passes & drop-offs' },
    { name: 'Spanish Mackerel', icon: '🐡', color: '#facc15', bait: 'Gotcha plug, Clarkspoon, pilchard', regulation: '12″ min · 7/day',           when: 'Open water — outgoing tide & passes' },
  ],
  },
  {
    id: "8731439", waterTempId: "8731439",
    name: "Gulf Shores, ICWW", slug: "gulf-shores-icww",
    state: "alabama", city: "Gulf Shores, ICWW, AL", region: "Alabama Gulf Coast",
    lat: 30.27988888888889, lon: -87.68427777777778, latDisplay: "30.28°N", lonDisplay: "87.68°W",
    sunLat: 30.28, sunMeridian: 90, sunLon: 87.68, utcOffset: 0,
    sunriseRef: 6.88, sunsetRef: 19.71,
    tidalType: 'diurnal', meanRange: 1.5, waterTempDefault: '68°F',
    nearby: [
    { name: "Gulf State Park Pier", lat: 30.248300552368164, lon: -87.66829681396484, slug: "gulf-state-park-pier" },
    { name: "Bon Secour, Bon Secour River", lat: 30.3033, lon: -87.735, slug: "bon-secour-bon-secour-river" },
    { name: "Wolf Bay", lat: 30.354999542236328, lon: -87.5999984741211, slug: "wolf-bay" },
    { name: "Alabama Point", lat: 30.27861111111111, lon: -87.55500030517578, slug: "alabama-point" }
    ],
    species: [
    { name: 'Red Snapper',      icon: '🎣', color: '#ef4444', bait: 'Squid, cigar minnow, live shrimp',  regulation: '16″ min · 2/day · season',  when: 'Offshore reefs & rigs — major solunar' },
    { name: 'Redfish',          icon: '🎣', color: '#f97316', bait: 'Mullet chunk, shrimp, DOA crab',    regulation: 'Slot 18–27″ · 5/day',       when: 'Outgoing tide on flats & marsh edges' },
    { name: 'Speckled Trout',   icon: '🐟', color: '#60a5fa', bait: 'Mirrolure, live shrimp, gulp',      regulation: 'Slot 12–15″ · 15/day',      when: 'Early morning grass flats — incoming' },
    { name: 'Flounder',         icon: '🐡', color: '#34d399', bait: 'Gulp! shrimp, finger mullet',       regulation: '12″ min · 10/day',          when: 'Incoming tide near passes & drop-offs' },
    { name: 'Spanish Mackerel', icon: '🐡', color: '#facc15', bait: 'Gotcha plug, Clarkspoon, pilchard', regulation: '12″ min · 7/day',           when: 'Open water — outgoing tide & passes' },
  ],
  },
  {
    id: "8731952", waterTempId: "8731952",
    name: "Bon Secour, Bon Secour River", slug: "bon-secour-bon-secour-river",
    state: "alabama", city: "Bon Secour, Bon Secour River, AL", region: "Alabama Gulf Coast",
    lat: 30.3033, lon: -87.735, latDisplay: "30.30°N", lonDisplay: "87.73°W",
    sunLat: 30.3, sunMeridian: 90, sunLon: 87.74, utcOffset: 0,
    sunriseRef: 6.88, sunsetRef: 19.71,
    tidalType: 'diurnal', meanRange: 1.5, waterTempDefault: '68°F',
    nearby: [
    { name: "Gulf Shores, ICWW", lat: 30.27988888888889, lon: -87.68427777777778, slug: "gulf-shores-icww" },
    { name: "Gulf State Park Pier", lat: 30.248300552368164, lon: -87.66829681396484, slug: "gulf-state-park-pier" },
    { name: "Wolf Bay", lat: 30.354999542236328, lon: -87.5999984741211, slug: "wolf-bay" },
    { name: "Weeks Bay", lat: 30.416900634765625, lon: -87.82540130615234, slug: "weeks-bay" }
    ],
    species: [
    { name: 'Red Snapper',      icon: '🎣', color: '#ef4444', bait: 'Squid, cigar minnow, live shrimp',  regulation: '16″ min · 2/day · season',  when: 'Offshore reefs & rigs — major solunar' },
    { name: 'Redfish',          icon: '🎣', color: '#f97316', bait: 'Mullet chunk, shrimp, DOA crab',    regulation: 'Slot 18–27″ · 5/day',       when: 'Outgoing tide on flats & marsh edges' },
    { name: 'Speckled Trout',   icon: '🐟', color: '#60a5fa', bait: 'Mirrolure, live shrimp, gulp',      regulation: 'Slot 12–15″ · 15/day',      when: 'Early morning grass flats — incoming' },
    { name: 'Flounder',         icon: '🐡', color: '#34d399', bait: 'Gulp! shrimp, finger mullet',       regulation: '12″ min · 10/day',          when: 'Incoming tide near passes & drop-offs' },
    { name: 'Spanish Mackerel', icon: '🐡', color: '#facc15', bait: 'Gotcha plug, Clarkspoon, pilchard', regulation: '12″ min · 7/day',           when: 'Open water — outgoing tide & passes' },
  ],
  },
  {
    id: "8732828", waterTempId: "8732828",
    name: "Weeks Bay", slug: "weeks-bay",
    state: "alabama", city: "Weeks Bay, AL", region: "Mobile Bay",
    lat: 30.416900634765625, lon: -87.82540130615234, latDisplay: "30.42°N", lonDisplay: "87.83°W",
    sunLat: 30.42, sunMeridian: 90, sunLon: 87.83, utcOffset: 0,
    sunriseRef: 6.87, sunsetRef: 19.72,
    tidalType: 'diurnal', meanRange: 1.5, waterTempDefault: '68°F',
    nearby: [
    { name: "Point Clear, Mobile Bay", lat: 30.48663888888889, lon: -87.93452777777777, slug: "point-clear-mobile-bay" },
    { name: "Bon Secour, Bon Secour River", lat: 30.3033, lon: -87.735, slug: "bon-secour-bon-secour-river" },
    { name: "Fly Creek, Mobile Bay", lat: 30.542800903320312, lon: -87.9010009765625, slug: "fly-creek-mobile-bay" },
    { name: "Gulf Shores, ICWW", lat: 30.27988888888889, lon: -87.68427777777778, slug: "gulf-shores-icww" }
    ],
    species: [
    { name: 'Redfish',          icon: '🎣', color: '#f97316', bait: 'Mullet chunk, shrimp, soft plastic', regulation: 'Slot 18–27″ · 5/day',      when: 'Outgoing tide on flats & grass beds' },
    { name: 'Speckled Trout',   icon: '🐟', color: '#60a5fa', bait: 'Mirrolure, live shrimp, croaker',   regulation: 'Slot 12–15″ · 15/day',     when: 'Early morning grass flats' },
    { name: 'Flounder',         icon: '🐡', color: '#34d399', bait: 'Gulp! shrimp, live mud minnow',     regulation: '12″ min · 10/day',         when: 'Incoming tide near drop-offs & channels' },
    { name: 'Sheepshead',       icon: '🐡', color: '#a78bfa', bait: 'Fiddler crab, barnacle, shrimp',    regulation: '10″ min · 8/day',          when: 'Structure — bridges, piers, pilings' },
    { name: 'Black Drum',       icon: '🐟', color: '#94a3b8', bait: 'Crab, shrimp, cut mullet',          regulation: '12″ min · 5/day',          when: 'Incoming tide — channels & shell beds' },
  ],
  },
  {
    id: "8733502", waterTempId: "8733502",
    name: "Fly Creek, Mobile Bay", slug: "fly-creek-mobile-bay",
    state: "alabama", city: "Fly Creek, Mobile Bay, AL", region: "Mobile Bay",
    lat: 30.542800903320312, lon: -87.9010009765625, latDisplay: "30.54°N", lonDisplay: "87.90°W",
    sunLat: 30.54, sunMeridian: 90, sunLon: 87.9, utcOffset: 0,
    sunriseRef: 6.87, sunsetRef: 19.72,
    tidalType: 'diurnal', meanRange: 1.8, waterTempDefault: '68°F',
    nearby: [
    { name: "Point Clear, Mobile Bay", lat: 30.48663888888889, lon: -87.93452777777777, slug: "point-clear-mobile-bay" },
    { name: "Meaher State Park, Mobile Bay", lat: 30.66716666666667, lon: -87.93644444444445, slug: "meaher-state-park-mobile-bay" },
    { name: "Weeks Bay", lat: 30.416900634765625, lon: -87.82540130615234, slug: "weeks-bay" },
    { name: "Dog River Bridge", lat: 30.565200805664062, lon: -88.08799743652344, slug: "dog-river-bridge" }
    ],
    species: [
    { name: 'Redfish',          icon: '🎣', color: '#f97316', bait: 'Mullet chunk, shrimp, soft plastic', regulation: 'Slot 18–27″ · 5/day',      when: 'Outgoing tide on flats & grass beds' },
    { name: 'Speckled Trout',   icon: '🐟', color: '#60a5fa', bait: 'Mirrolure, live shrimp, croaker',   regulation: 'Slot 12–15″ · 15/day',     when: 'Early morning grass flats' },
    { name: 'Flounder',         icon: '🐡', color: '#34d399', bait: 'Gulp! shrimp, live mud minnow',     regulation: '12″ min · 10/day',         when: 'Incoming tide near drop-offs & channels' },
    { name: 'Sheepshead',       icon: '🐡', color: '#a78bfa', bait: 'Fiddler crab, barnacle, shrimp',    regulation: '10″ min · 8/day',          when: 'Structure — bridges, piers, pilings' },
    { name: 'Black Drum',       icon: '🐟', color: '#94a3b8', bait: 'Crab, shrimp, cut mullet',          regulation: '12″ min · 5/day',          when: 'Incoming tide — channels & shell beds' },
  ],
  },
  {
    id: "8733821", waterTempId: "8733821",
    name: "Point Clear, Mobile Bay", slug: "point-clear-mobile-bay",
    state: "alabama", city: "Point Clear, Mobile Bay, AL", region: "Mobile Bay",
    lat: 30.48663888888889, lon: -87.93452777777777, latDisplay: "30.49°N", lonDisplay: "87.93°W",
    sunLat: 30.49, sunMeridian: 90, sunLon: 87.93, utcOffset: 0,
    sunriseRef: 6.87, sunsetRef: 19.72,
    tidalType: 'diurnal', meanRange: 1.5, waterTempDefault: '68°F',
    nearby: [
    { name: "Fly Creek, Mobile Bay", lat: 30.542800903320312, lon: -87.9010009765625, slug: "fly-creek-mobile-bay" },
    { name: "Weeks Bay", lat: 30.416900634765625, lon: -87.82540130615234, slug: "weeks-bay" },
    { name: "Dog River Bridge", lat: 30.565200805664062, lon: -88.08799743652344, slug: "dog-river-bridge" },
    { name: "East Fowl River, Hwy 193 Bridge", lat: 30.443700790405273, lon: -88.11389923095703, slug: "east-fowl-river-hwy-193-bridge" }
    ],
    species: [
    { name: 'Redfish',          icon: '🎣', color: '#f97316', bait: 'Mullet chunk, shrimp, soft plastic', regulation: 'Slot 18–27″ · 5/day',      when: 'Outgoing tide on flats & grass beds' },
    { name: 'Speckled Trout',   icon: '🐟', color: '#60a5fa', bait: 'Mirrolure, live shrimp, croaker',   regulation: 'Slot 12–15″ · 15/day',     when: 'Early morning grass flats' },
    { name: 'Flounder',         icon: '🐡', color: '#34d399', bait: 'Gulp! shrimp, live mud minnow',     regulation: '12″ min · 10/day',         when: 'Incoming tide near drop-offs & channels' },
    { name: 'Sheepshead',       icon: '🐡', color: '#a78bfa', bait: 'Fiddler crab, barnacle, shrimp',    regulation: '10″ min · 8/day',          when: 'Structure — bridges, piers, pilings' },
    { name: 'Black Drum',       icon: '🐟', color: '#94a3b8', bait: 'Crab, shrimp, cut mullet',          regulation: '12″ min · 5/day',          when: 'Incoming tide — channels & shell beds' },
  ],
  },
  {
    id: "8733839", waterTempId: "8733839",
    name: "Meaher State Park, Mobile Bay", slug: "meaher-state-park-mobile-bay",
    state: "alabama", city: "Meaher State Park, Mobile Bay, AL", region: "Mobile Bay",
    lat: 30.66716666666667, lon: -87.93644444444445, latDisplay: "30.67°N", lonDisplay: "87.94°W",
    sunLat: 30.67, sunMeridian: 90, sunLon: 87.94, utcOffset: 0,
    sunriseRef: 6.86, sunsetRef: 19.73,
    tidalType: 'diurnal', meanRange: 1.8, waterTempDefault: '68°F',
    nearby: [
    { name: "MOBILE, Mobile River (State Dock)", lat: 30.70461111111111, lon: -88.03961111111111, slug: "mobile-mobile-river-state-dock" },
    { name: "Coast Guard Sector Mobile", lat: 30.6495, lon: -88.05811111111112, slug: "coast-guard-sector-mobile" },
    { name: "Fly Creek, Mobile Bay", lat: 30.542800903320312, lon: -87.9010009765625, slug: "fly-creek-mobile-bay" },
    { name: "Lower Hall Landing, Tensaw River", lat: 30.8183, lon: -87.915, slug: "lower-hall-landing-tensaw-river" }
    ],
    species: [
    { name: 'Redfish',          icon: '🎣', color: '#f97316', bait: 'Mullet chunk, shrimp, soft plastic', regulation: 'Slot 18–27″ · 5/day',      when: 'Outgoing tide on flats & grass beds' },
    { name: 'Speckled Trout',   icon: '🐟', color: '#60a5fa', bait: 'Mirrolure, live shrimp, croaker',   regulation: 'Slot 12–15″ · 15/day',     when: 'Early morning grass flats' },
    { name: 'Flounder',         icon: '🐡', color: '#34d399', bait: 'Gulp! shrimp, live mud minnow',     regulation: '12″ min · 10/day',         when: 'Incoming tide near drop-offs & channels' },
    { name: 'Sheepshead',       icon: '🐡', color: '#a78bfa', bait: 'Fiddler crab, barnacle, shrimp',    regulation: '10″ min · 8/day',          when: 'Structure — bridges, piers, pilings' },
    { name: 'Black Drum',       icon: '🐟', color: '#94a3b8', bait: 'Crab, shrimp, cut mullet',          regulation: '12″ min · 5/day',          when: 'Incoming tide — channels & shell beds' },
  ],
  },
  {
    id: "8734635", waterTempId: "8734635",
    name: "Mobile Point (Fort Morgan)", slug: "mobile-point-fort-morgan",
    state: "alabama", city: "Mobile Point (Fort Morgan), AL", region: "Alabama Gulf Coast",
    lat: 30.2333, lon: -88.02, latDisplay: "30.23°N", lonDisplay: "88.02°W",
    sunLat: 30.23, sunMeridian: 90, sunLon: 88.02, utcOffset: 0,
    sunriseRef: 6.89, sunsetRef: 19.71,
    tidalType: 'diurnal', meanRange: 1.5, waterTempDefault: '68°F',
    nearby: [
    { name: "DAUPHIN ISLAND", lat: 30.25, lon: -88.07499694824219, slug: "dauphin-island" },
    { name: "Dauphin Island Hydro", lat: 30.25131944444444, lon: -88.07948611111111, slug: "dauphin-island-hydro" },
    { name: "DAUPHIN ISLAND (TEMP)", lat: 30.2517, lon: -88.08, slug: "dauphin-island-temp" },
    { name: "NORTH POINT, DAUPHIN ISLAND", lat: 30.2583, lon: -88.1133, slug: "north-point-dauphin-island" }
    ],
    species: [
    { name: 'Red Snapper',      icon: '🎣', color: '#ef4444', bait: 'Squid, cigar minnow, live shrimp',  regulation: '16″ min · 2/day · season',  when: 'Offshore reefs & rigs — major solunar' },
    { name: 'Redfish',          icon: '🎣', color: '#f97316', bait: 'Mullet chunk, shrimp, DOA crab',    regulation: 'Slot 18–27″ · 5/day',       when: 'Outgoing tide on flats & marsh edges' },
    { name: 'Speckled Trout',   icon: '🐟', color: '#60a5fa', bait: 'Mirrolure, live shrimp, gulp',      regulation: 'Slot 12–15″ · 15/day',      when: 'Early morning grass flats — incoming' },
    { name: 'Flounder',         icon: '🐡', color: '#34d399', bait: 'Gulp! shrimp, finger mullet',       regulation: '12″ min · 10/day',          when: 'Incoming tide near passes & drop-offs' },
    { name: 'Spanish Mackerel', icon: '🐡', color: '#facc15', bait: 'Gotcha plug, Clarkspoon, pilchard', regulation: '12″ min · 7/day',           when: 'Open water — outgoing tide & passes' },
  ],
  },
  {
    id: "8735180", waterTempId: "8735180",
    name: "DAUPHIN ISLAND", slug: "dauphin-island",
    state: "alabama", city: "DAUPHIN ISLAND, AL", region: "Alabama Gulf Coast",
    lat: 30.25, lon: -88.07499694824219, latDisplay: "30.25°N", lonDisplay: "88.07°W",
    sunLat: 30.25, sunMeridian: 90, sunLon: 88.07, utcOffset: 0,
    sunriseRef: 6.89, sunsetRef: 19.71,
    tidalType: 'diurnal', meanRange: 1.5, waterTempDefault: '68°F',
    nearby: [
    { name: "Dauphin Island Hydro", lat: 30.25131944444444, lon: -88.07948611111111, slug: "dauphin-island-hydro" },
    { name: "DAUPHIN ISLAND (TEMP)", lat: 30.2517, lon: -88.08, slug: "dauphin-island-temp" },
    { name: "NORTH POINT, DAUPHIN ISLAND", lat: 30.2583, lon: -88.1133, slug: "north-point-dauphin-island" },
    { name: "Mobile Point (Fort Morgan)", lat: 30.2333, lon: -88.02, slug: "mobile-point-fort-morgan" }
    ],
    species: [
    { name: 'Red Snapper',      icon: '🎣', color: '#ef4444', bait: 'Squid, cigar minnow, live shrimp',  regulation: '16″ min · 2/day · season',  when: 'Offshore reefs & rigs — major solunar' },
    { name: 'Redfish',          icon: '🎣', color: '#f97316', bait: 'Mullet chunk, shrimp, DOA crab',    regulation: 'Slot 18–27″ · 5/day',       when: 'Outgoing tide on flats & marsh edges' },
    { name: 'Speckled Trout',   icon: '🐟', color: '#60a5fa', bait: 'Mirrolure, live shrimp, gulp',      regulation: 'Slot 12–15″ · 15/day',      when: 'Early morning grass flats — incoming' },
    { name: 'Flounder',         icon: '🐡', color: '#34d399', bait: 'Gulp! shrimp, finger mullet',       regulation: '12″ min · 10/day',          when: 'Incoming tide near passes & drop-offs' },
    { name: 'Spanish Mackerel', icon: '🐡', color: '#facc15', bait: 'Gotcha plug, Clarkspoon, pilchard', regulation: '12″ min · 7/day',           when: 'Open water — outgoing tide & passes' },
  ],
  },
  {
    id: "8735181", waterTempId: "8735181",
    name: "Dauphin Island Hydro", slug: "dauphin-island-hydro",
    state: "alabama", city: "Dauphin Island Hydro, AL", region: "Alabama Gulf Coast",
    lat: 30.25131944444444, lon: -88.07948611111111, latDisplay: "30.25°N", lonDisplay: "88.08°W",
    sunLat: 30.25, sunMeridian: 90, sunLon: 88.08, utcOffset: 0,
    sunriseRef: 6.88, sunsetRef: 19.71,
    tidalType: 'diurnal', meanRange: 1.5, waterTempDefault: '68°F',
    nearby: [
    { name: "DAUPHIN ISLAND (TEMP)", lat: 30.2517, lon: -88.08, slug: "dauphin-island-temp" },
    { name: "DAUPHIN ISLAND", lat: 30.25, lon: -88.07499694824219, slug: "dauphin-island" },
    { name: "NORTH POINT, DAUPHIN ISLAND", lat: 30.2583, lon: -88.1133, slug: "north-point-dauphin-island" },
    { name: "Mobile Point (Fort Morgan)", lat: 30.2333, lon: -88.02, slug: "mobile-point-fort-morgan" }
    ],
    species: [
    { name: 'Red Snapper',      icon: '🎣', color: '#ef4444', bait: 'Squid, cigar minnow, live shrimp',  regulation: '16″ min · 2/day · season',  when: 'Offshore reefs & rigs — major solunar' },
    { name: 'Redfish',          icon: '🎣', color: '#f97316', bait: 'Mullet chunk, shrimp, DOA crab',    regulation: 'Slot 18–27″ · 5/day',       when: 'Outgoing tide on flats & marsh edges' },
    { name: 'Speckled Trout',   icon: '🐟', color: '#60a5fa', bait: 'Mirrolure, live shrimp, gulp',      regulation: 'Slot 12–15″ · 15/day',      when: 'Early morning grass flats — incoming' },
    { name: 'Flounder',         icon: '🐡', color: '#34d399', bait: 'Gulp! shrimp, finger mullet',       regulation: '12″ min · 10/day',          when: 'Incoming tide near passes & drop-offs' },
    { name: 'Spanish Mackerel', icon: '🐡', color: '#facc15', bait: 'Gotcha plug, Clarkspoon, pilchard', regulation: '12″ min · 7/day',           when: 'Open water — outgoing tide & passes' },
  ],
  },
  {
    id: "8735391", waterTempId: "8735391",
    name: "Dog River Bridge", slug: "dog-river-bridge",
    state: "alabama", city: "Dog River Bridge, AL", region: "Mobile Bay",
    lat: 30.565200805664062, lon: -88.08799743652344, latDisplay: "30.57°N", lonDisplay: "88.09°W",
    sunLat: 30.57, sunMeridian: 90, sunLon: 88.09, utcOffset: 0,
    sunriseRef: 6.87, sunsetRef: 19.72,
    tidalType: 'diurnal', meanRange: 1.8, waterTempDefault: '68°F',
    nearby: [
    { name: "Coast Guard Sector Mobile", lat: 30.6495, lon: -88.05811111111112, slug: "coast-guard-sector-mobile" },
    { name: "East Fowl River, Hwy 193 Bridge", lat: 30.443700790405273, lon: -88.11389923095703, slug: "east-fowl-river-hwy-193-bridge" },
    { name: "MOBILE, Mobile River (State Dock)", lat: 30.70461111111111, lon: -88.03961111111111, slug: "mobile-mobile-river-state-dock" },
    { name: "Point Clear, Mobile Bay", lat: 30.48663888888889, lon: -87.93452777777777, slug: "point-clear-mobile-bay" }
    ],
    species: [
    { name: 'Redfish',          icon: '🎣', color: '#f97316', bait: 'Mullet chunk, shrimp, soft plastic', regulation: 'Slot 18–27″ · 5/day',      when: 'Outgoing tide on flats & grass beds' },
    { name: 'Speckled Trout',   icon: '🐟', color: '#60a5fa', bait: 'Mirrolure, live shrimp, croaker',   regulation: 'Slot 12–15″ · 15/day',     when: 'Early morning grass flats' },
    { name: 'Flounder',         icon: '🐡', color: '#34d399', bait: 'Gulp! shrimp, live mud minnow',     regulation: '12″ min · 10/day',         when: 'Incoming tide near drop-offs & channels' },
    { name: 'Sheepshead',       icon: '🐡', color: '#a78bfa', bait: 'Fiddler crab, barnacle, shrimp',    regulation: '10″ min · 8/day',          when: 'Structure — bridges, piers, pilings' },
    { name: 'Black Drum',       icon: '🐟', color: '#94a3b8', bait: 'Crab, shrimp, cut mullet',          regulation: '12″ min · 5/day',          when: 'Incoming tide — channels & shell beds' },
  ],
  },
  {
    id: "8735523", waterTempId: "8735523",
    name: "East Fowl River, Hwy 193 Bridge", slug: "east-fowl-river-hwy-193-bridge",
    state: "alabama", city: "East Fowl River, Hwy 193 Bridge, AL", region: "Mobile Bay",
    lat: 30.443700790405273, lon: -88.11389923095703, latDisplay: "30.44°N", lonDisplay: "88.11°W",
    sunLat: 30.44, sunMeridian: 90, sunLon: 88.11, utcOffset: 0,
    sunriseRef: 6.87, sunsetRef: 19.72,
    tidalType: 'diurnal', meanRange: 1.5, waterTempDefault: '68°F',
    nearby: [
    { name: "West Fowl River, Hwy 188 bridge", lat: 30.37660026550293, lon: -88.15859985351562, slug: "west-fowl-river-hwy-188-bridge" },
    { name: "Bayou LaBatre Bridge", lat: 30.40570068359375, lon: -88.2477035522461, slug: "bayou-labatre-bridge" },
    { name: "Dog River Bridge", lat: 30.565200805664062, lon: -88.08799743652344, slug: "dog-river-bridge" },
    { name: "Bayou La Batre, Mississippi Sound", lat: 30.3717, lon: -88.275, slug: "bayou-la-batre-mississippi-sound" }
    ],
    species: [
    { name: 'Redfish',          icon: '🎣', color: '#f97316', bait: 'Mullet chunk, shrimp, soft plastic', regulation: 'Slot 18–27″ · 5/day',      when: 'Outgoing tide on flats & grass beds' },
    { name: 'Speckled Trout',   icon: '🐟', color: '#60a5fa', bait: 'Mirrolure, live shrimp, croaker',   regulation: 'Slot 12–15″ · 15/day',     when: 'Early morning grass flats' },
    { name: 'Flounder',         icon: '🐡', color: '#34d399', bait: 'Gulp! shrimp, live mud minnow',     regulation: '12″ min · 10/day',         when: 'Incoming tide near drop-offs & channels' },
    { name: 'Sheepshead',       icon: '🐡', color: '#a78bfa', bait: 'Fiddler crab, barnacle, shrimp',    regulation: '10″ min · 8/day',          when: 'Structure — bridges, piers, pilings' },
    { name: 'Black Drum',       icon: '🐟', color: '#94a3b8', bait: 'Crab, shrimp, cut mullet',          regulation: '12″ min · 5/day',          when: 'Incoming tide — channels & shell beds' },
  ],
  },
  {
    id: "8736897", waterTempId: "8736897",
    name: "Coast Guard Sector Mobile", slug: "coast-guard-sector-mobile",
    state: "alabama", city: "Coast Guard Sector Mobile, AL", region: "Mobile Bay",
    lat: 30.6495, lon: -88.05811111111112, latDisplay: "30.65°N", lonDisplay: "88.06°W",
    sunLat: 30.65, sunMeridian: 90, sunLon: 88.06, utcOffset: 0,
    sunriseRef: 6.86, sunsetRef: 19.73,
    tidalType: 'diurnal', meanRange: 1.8, waterTempDefault: '68°F',
    nearby: [
    { name: "MOBILE, Mobile River (State Dock)", lat: 30.70461111111111, lon: -88.03961111111111, slug: "mobile-mobile-river-state-dock" },
    { name: "Dog River Bridge", lat: 30.565200805664062, lon: -88.08799743652344, slug: "dog-river-bridge" },
    { name: "Meaher State Park, Mobile Bay", lat: 30.66716666666667, lon: -87.93644444444445, slug: "meaher-state-park-mobile-bay" },
    { name: "William Brooks Park, Chichasaw Creek", lat: 30.78190040588379, lon: -88.07360076904297, slug: "william-brooks-park-chichasaw-creek" }
    ],
    species: [
    { name: 'Redfish',          icon: '🎣', color: '#f97316', bait: 'Mullet chunk, shrimp, soft plastic', regulation: 'Slot 18–27″ · 5/day',      when: 'Outgoing tide on flats & grass beds' },
    { name: 'Speckled Trout',   icon: '🐟', color: '#60a5fa', bait: 'Mirrolure, live shrimp, croaker',   regulation: 'Slot 12–15″ · 15/day',     when: 'Early morning grass flats' },
    { name: 'Flounder',         icon: '🐡', color: '#34d399', bait: 'Gulp! shrimp, live mud minnow',     regulation: '12″ min · 10/day',         when: 'Incoming tide near drop-offs & channels' },
    { name: 'Sheepshead',       icon: '🐡', color: '#a78bfa', bait: 'Fiddler crab, barnacle, shrimp',    regulation: '10″ min · 8/day',          when: 'Structure — bridges, piers, pilings' },
    { name: 'Black Drum',       icon: '🐟', color: '#94a3b8', bait: 'Crab, shrimp, cut mullet',          regulation: '12″ min · 5/day',          when: 'Incoming tide — channels & shell beds' },
  ],
  },
  {
    id: "8737048", waterTempId: "8737048",
    name: "MOBILE, Mobile River (State Dock)", slug: "mobile-mobile-river-state-dock",
    state: "alabama", city: "MOBILE, Mobile River (State Dock), AL", region: "Mobile Bay",
    lat: 30.70461111111111, lon: -88.03961111111111, latDisplay: "30.70°N", lonDisplay: "88.04°W",
    sunLat: 30.7, sunMeridian: 90, sunLon: 88.04, utcOffset: 0,
    sunriseRef: 6.86, sunsetRef: 19.73,
    tidalType: 'diurnal', meanRange: 1.8, waterTempDefault: '68°F',
    nearby: [
    { name: "Coast Guard Sector Mobile", lat: 30.6495, lon: -88.05811111111112, slug: "coast-guard-sector-mobile" },
    { name: "William Brooks Park, Chichasaw Creek", lat: 30.78190040588379, lon: -88.07360076904297, slug: "william-brooks-park-chichasaw-creek" },
    { name: "Meaher State Park, Mobile Bay", lat: 30.66716666666667, lon: -87.93644444444445, slug: "meaher-state-park-mobile-bay" },
    { name: "Dog River Bridge", lat: 30.565200805664062, lon: -88.08799743652344, slug: "dog-river-bridge" }
    ],
    species: [
    { name: 'Redfish',          icon: '🎣', color: '#f97316', bait: 'Mullet chunk, shrimp, soft plastic', regulation: 'Slot 18–27″ · 5/day',      when: 'Outgoing tide on flats & grass beds' },
    { name: 'Speckled Trout',   icon: '🐟', color: '#60a5fa', bait: 'Mirrolure, live shrimp, croaker',   regulation: 'Slot 12–15″ · 15/day',     when: 'Early morning grass flats' },
    { name: 'Flounder',         icon: '🐡', color: '#34d399', bait: 'Gulp! shrimp, live mud minnow',     regulation: '12″ min · 10/day',         when: 'Incoming tide near drop-offs & channels' },
    { name: 'Sheepshead',       icon: '🐡', color: '#a78bfa', bait: 'Fiddler crab, barnacle, shrimp',    regulation: '10″ min · 8/day',          when: 'Structure — bridges, piers, pilings' },
    { name: 'Black Drum',       icon: '🐟', color: '#94a3b8', bait: 'Crab, shrimp, cut mullet',          regulation: '12″ min · 5/day',          when: 'Incoming tide — channels & shell beds' },
  ],
  },
  {
    id: "8737138", waterTempId: "8737138",
    name: "William Brooks Park, Chichasaw Creek", slug: "william-brooks-park-chichasaw-creek",
    state: "alabama", city: "William Brooks Park, Chichasaw Creek, AL", region: "Mobile Bay",
    lat: 30.78190040588379, lon: -88.07360076904297, latDisplay: "30.78°N", lonDisplay: "88.07°W",
    sunLat: 30.78, sunMeridian: 90, sunLon: 88.07, utcOffset: 0,
    sunriseRef: 6.85, sunsetRef: 19.73,
    tidalType: 'diurnal', meanRange: 1.8, waterTempDefault: '68°F',
    nearby: [
    { name: "MOBILE, Mobile River (State Dock)", lat: 30.70461111111111, lon: -88.03961111111111, slug: "mobile-mobile-river-state-dock" },
    { name: "Coast Guard Sector Mobile", lat: 30.6495, lon: -88.05811111111112, slug: "coast-guard-sector-mobile" },
    { name: "Lower Hall Landing, Tensaw River", lat: 30.8183, lon: -87.915, slug: "lower-hall-landing-tensaw-river" },
    { name: "Meaher State Park, Mobile Bay", lat: 30.66716666666667, lon: -87.93644444444445, slug: "meaher-state-park-mobile-bay" }
    ],
    species: [
    { name: 'Redfish',          icon: '🎣', color: '#f97316', bait: 'Mullet chunk, shrimp, soft plastic', regulation: 'Slot 18–27″ · 5/day',      when: 'Outgoing tide on flats & grass beds' },
    { name: 'Speckled Trout',   icon: '🐟', color: '#60a5fa', bait: 'Mirrolure, live shrimp, croaker',   regulation: 'Slot 12–15″ · 15/day',     when: 'Early morning grass flats' },
    { name: 'Flounder',         icon: '🐡', color: '#34d399', bait: 'Gulp! shrimp, live mud minnow',     regulation: '12″ min · 10/day',         when: 'Incoming tide near drop-offs & channels' },
    { name: 'Sheepshead',       icon: '🐡', color: '#a78bfa', bait: 'Fiddler crab, barnacle, shrimp',    regulation: '10″ min · 8/day',          when: 'Structure — bridges, piers, pilings' },
    { name: 'Black Drum',       icon: '🐟', color: '#94a3b8', bait: 'Crab, shrimp, cut mullet',          regulation: '12″ min · 5/day',          when: 'Incoming tide — channels & shell beds' },
  ],
  },
  {
    id: "8737182", waterTempId: "8737182",
    name: "Lower Hall Landing, Tensaw River", slug: "lower-hall-landing-tensaw-river",
    state: "alabama", city: "Lower Hall Landing, Tensaw River, AL", region: "Mobile Bay",
    lat: 30.8183, lon: -87.915, latDisplay: "30.82°N", lonDisplay: "87.92°W",
    sunLat: 30.82, sunMeridian: 90, sunLon: 87.92, utcOffset: 0,
    sunriseRef: 6.85, sunsetRef: 19.73,
    tidalType: 'diurnal', meanRange: 1.8, waterTempDefault: '68°F',
    nearby: [
    { name: "William Brooks Park, Chichasaw Creek", lat: 30.78190040588379, lon: -88.07360076904297, slug: "william-brooks-park-chichasaw-creek" },
    { name: "Meaher State Park, Mobile Bay", lat: 30.66716666666667, lon: -87.93644444444445, slug: "meaher-state-park-mobile-bay" },
    { name: "MOBILE, Mobile River (State Dock)", lat: 30.70461111111111, lon: -88.03961111111111, slug: "mobile-mobile-river-state-dock" },
    { name: "Lower Bryant Landing", lat: 30.9783, lon: -87.8733, slug: "lower-bryant-landing" }
    ],
    species: [
    { name: 'Redfish',          icon: '🎣', color: '#f97316', bait: 'Mullet chunk, shrimp, soft plastic', regulation: 'Slot 18–27″ · 5/day',      when: 'Outgoing tide on flats & grass beds' },
    { name: 'Speckled Trout',   icon: '🐟', color: '#60a5fa', bait: 'Mirrolure, live shrimp, croaker',   regulation: 'Slot 12–15″ · 15/day',     when: 'Early morning grass flats' },
    { name: 'Flounder',         icon: '🐡', color: '#34d399', bait: 'Gulp! shrimp, live mud minnow',     regulation: '12″ min · 10/day',         when: 'Incoming tide near drop-offs & channels' },
    { name: 'Sheepshead',       icon: '🐡', color: '#a78bfa', bait: 'Fiddler crab, barnacle, shrimp',    regulation: '10″ min · 8/day',          when: 'Structure — bridges, piers, pilings' },
    { name: 'Black Drum',       icon: '🐟', color: '#94a3b8', bait: 'Crab, shrimp, cut mullet',          regulation: '12″ min · 5/day',          when: 'Incoming tide — channels & shell beds' },
  ],
  },
  {
    id: "8737373", waterTempId: "8737373",
    name: "Lower Bryant Landing", slug: "lower-bryant-landing",
    state: "alabama", city: "Lower Bryant Landing, AL", region: "Mobile Bay",
    lat: 30.9783, lon: -87.8733, latDisplay: "30.98°N", lonDisplay: "87.87°W",
    sunLat: 30.98, sunMeridian: 90, sunLon: 87.87, utcOffset: 0,
    sunriseRef: 6.84, sunsetRef: 19.74,
    tidalType: 'diurnal', meanRange: 1.8, waterTempDefault: '68°F',
    nearby: [
    { name: "Lower Hall Landing, Tensaw River", lat: 30.8183, lon: -87.915, slug: "lower-hall-landing-tensaw-river" },
    { name: "William Brooks Park, Chichasaw Creek", lat: 30.78190040588379, lon: -88.07360076904297, slug: "william-brooks-park-chichasaw-creek" },
    { name: "MOBILE, Mobile River (State Dock)", lat: 30.70461111111111, lon: -88.03961111111111, slug: "mobile-mobile-river-state-dock" },
    { name: "Meaher State Park, Mobile Bay", lat: 30.66716666666667, lon: -87.93644444444445, slug: "meaher-state-park-mobile-bay" }
    ],
    species: [
    { name: 'Redfish',          icon: '🎣', color: '#f97316', bait: 'Mullet chunk, shrimp, soft plastic', regulation: 'Slot 18–27″ · 5/day',      when: 'Outgoing tide on flats & grass beds' },
    { name: 'Speckled Trout',   icon: '🐟', color: '#60a5fa', bait: 'Mirrolure, live shrimp, croaker',   regulation: 'Slot 12–15″ · 15/day',     when: 'Early morning grass flats' },
    { name: 'Flounder',         icon: '🐡', color: '#34d399', bait: 'Gulp! shrimp, live mud minnow',     regulation: '12″ min · 10/day',         when: 'Incoming tide near drop-offs & channels' },
    { name: 'Sheepshead',       icon: '🐡', color: '#a78bfa', bait: 'Fiddler crab, barnacle, shrimp',    regulation: '10″ min · 8/day',          when: 'Structure — bridges, piers, pilings' },
    { name: 'Black Drum',       icon: '🐟', color: '#94a3b8', bait: 'Crab, shrimp, cut mullet',          regulation: '12″ min · 5/day',          when: 'Incoming tide — channels & shell beds' },
  ],
  },
  {
    id: "8738043", waterTempId: "8738043",
    name: "West Fowl River, Hwy 188 bridge", slug: "west-fowl-river-hwy-188-bridge",
    state: "alabama", city: "West Fowl River, Hwy 188 bridge, AL", region: "Mobile Bay",
    lat: 30.37660026550293, lon: -88.15859985351562, latDisplay: "30.38°N", lonDisplay: "88.16°W",
    sunLat: 30.38, sunMeridian: 90, sunLon: 88.16, utcOffset: 0,
    sunriseRef: 6.88, sunsetRef: 19.72,
    tidalType: 'diurnal', meanRange: 1.5, waterTempDefault: '68°F',
    nearby: [
    { name: "East Fowl River, Hwy 193 Bridge", lat: 30.443700790405273, lon: -88.11389923095703, slug: "east-fowl-river-hwy-193-bridge" },
    { name: "Bayou LaBatre Bridge", lat: 30.40570068359375, lon: -88.2477035522461, slug: "bayou-labatre-bridge" },
    { name: "Bayou La Batre, Mississippi Sound", lat: 30.3717, lon: -88.275, slug: "bayou-la-batre-mississippi-sound" },
    { name: "NORTH POINT, DAUPHIN ISLAND", lat: 30.2583, lon: -88.1133, slug: "north-point-dauphin-island" }
    ],
    species: [
    { name: 'Redfish',          icon: '🎣', color: '#f97316', bait: 'Mullet chunk, shrimp, soft plastic', regulation: 'Slot 18–27″ · 5/day',      when: 'Outgoing tide on flats & grass beds' },
    { name: 'Speckled Trout',   icon: '🐟', color: '#60a5fa', bait: 'Mirrolure, live shrimp, croaker',   regulation: 'Slot 12–15″ · 15/day',     when: 'Early morning grass flats' },
    { name: 'Flounder',         icon: '🐡', color: '#34d399', bait: 'Gulp! shrimp, live mud minnow',     regulation: '12″ min · 10/day',         when: 'Incoming tide near drop-offs & channels' },
    { name: 'Sheepshead',       icon: '🐡', color: '#a78bfa', bait: 'Fiddler crab, barnacle, shrimp',    regulation: '10″ min · 8/day',          when: 'Structure — bridges, piers, pilings' },
    { name: 'Black Drum',       icon: '🐟', color: '#94a3b8', bait: 'Crab, shrimp, cut mullet',          regulation: '12″ min · 5/day',          when: 'Incoming tide — channels & shell beds' },
  ],
  },
  {
    id: "8739051", waterTempId: "8739051",
    name: "Bayou La Batre, Mississippi Sound", slug: "bayou-la-batre-mississippi-sound",
    state: "alabama", city: "Bayou La Batre, Mississippi Sound, AL", region: "Mobile Bay",
    lat: 30.3717, lon: -88.275, latDisplay: "30.37°N", lonDisplay: "88.28°W",
    sunLat: 30.37, sunMeridian: 90, sunLon: 88.28, utcOffset: 0,
    sunriseRef: 6.88, sunsetRef: 19.71,
    tidalType: 'diurnal', meanRange: 1.5, waterTempDefault: '68°F',
    nearby: [
    { name: "Bayou LaBatre Bridge", lat: 30.40570068359375, lon: -88.2477035522461, slug: "bayou-labatre-bridge" },
    { name: "West Fowl River, Hwy 188 bridge", lat: 30.37660026550293, lon: -88.15859985351562, slug: "west-fowl-river-hwy-188-bridge" },
    { name: "East Fowl River, Hwy 193 Bridge", lat: 30.443700790405273, lon: -88.11389923095703, slug: "east-fowl-river-hwy-193-bridge" },
    { name: "NORTH POINT, DAUPHIN ISLAND", lat: 30.2583, lon: -88.1133, slug: "north-point-dauphin-island" }
    ],
    species: [
    { name: 'Redfish',          icon: '🎣', color: '#f97316', bait: 'Mullet chunk, shrimp, soft plastic', regulation: 'Slot 18–27″ · 5/day',      when: 'Outgoing tide on flats & grass beds' },
    { name: 'Speckled Trout',   icon: '🐟', color: '#60a5fa', bait: 'Mirrolure, live shrimp, croaker',   regulation: 'Slot 12–15″ · 15/day',     when: 'Early morning grass flats' },
    { name: 'Flounder',         icon: '🐡', color: '#34d399', bait: 'Gulp! shrimp, live mud minnow',     regulation: '12″ min · 10/day',         when: 'Incoming tide near drop-offs & channels' },
    { name: 'Sheepshead',       icon: '🐡', color: '#a78bfa', bait: 'Fiddler crab, barnacle, shrimp',    regulation: '10″ min · 8/day',          when: 'Structure — bridges, piers, pilings' },
    { name: 'Black Drum',       icon: '🐟', color: '#94a3b8', bait: 'Crab, shrimp, cut mullet',          regulation: '12″ min · 5/day',          when: 'Incoming tide — channels & shell beds' },
  ],
  },
  {
    id: "8739803", waterTempId: "8739803",
    name: "Bayou LaBatre Bridge", slug: "bayou-labatre-bridge",
    state: "alabama", city: "Bayou LaBatre Bridge, AL", region: "Mobile Bay",
    lat: 30.40570068359375, lon: -88.2477035522461, latDisplay: "30.41°N", lonDisplay: "88.25°W",
    sunLat: 30.41, sunMeridian: 90, sunLon: 88.25, utcOffset: 0,
    sunriseRef: 6.88, sunsetRef: 19.72,
    tidalType: 'diurnal', meanRange: 1.5, waterTempDefault: '68°F',
    nearby: [
    { name: "Bayou La Batre, Mississippi Sound", lat: 30.3717, lon: -88.275, slug: "bayou-la-batre-mississippi-sound" },
    { name: "West Fowl River, Hwy 188 bridge", lat: 30.37660026550293, lon: -88.15859985351562, slug: "west-fowl-river-hwy-188-bridge" },
    { name: "East Fowl River, Hwy 193 Bridge", lat: 30.443700790405273, lon: -88.11389923095703, slug: "east-fowl-river-hwy-193-bridge" },
    { name: "NORTH POINT, DAUPHIN ISLAND", lat: 30.2583, lon: -88.1133, slug: "north-point-dauphin-island" }
    ],
    species: [
    { name: 'Redfish',          icon: '🎣', color: '#f97316', bait: 'Mullet chunk, shrimp, soft plastic', regulation: 'Slot 18–27″ · 5/day',      when: 'Outgoing tide on flats & grass beds' },
    { name: 'Speckled Trout',   icon: '🐟', color: '#60a5fa', bait: 'Mirrolure, live shrimp, croaker',   regulation: 'Slot 12–15″ · 15/day',     when: 'Early morning grass flats' },
    { name: 'Flounder',         icon: '🐡', color: '#34d399', bait: 'Gulp! shrimp, live mud minnow',     regulation: '12″ min · 10/day',         when: 'Incoming tide near drop-offs & channels' },
    { name: 'Sheepshead',       icon: '🐡', color: '#a78bfa', bait: 'Fiddler crab, barnacle, shrimp',    regulation: '10″ min · 8/day',          when: 'Structure — bridges, piers, pilings' },
    { name: 'Black Drum',       icon: '🐟', color: '#94a3b8', bait: 'Crab, shrimp, cut mullet',          regulation: '12″ min · 5/day',          when: 'Incoming tide — channels & shell beds' },
  ],
  },
  {
    id: "8735184", waterTempId: "8735184",
    name: "DAUPHIN ISLAND (TEMP)", slug: "dauphin-island-temp",
    state: "alabama", city: "DAUPHIN ISLAND (TEMP), AL", region: "Alabama Gulf Coast",
    lat: 30.2517, lon: -88.08, latDisplay: "30.25°N", lonDisplay: "88.08°W",
    sunLat: 30.25, sunMeridian: 90, sunLon: 88.08, utcOffset: 0,
    sunriseRef: 6.88, sunsetRef: 19.71,
    tidalType: 'diurnal', meanRange: 1.5, waterTempDefault: '68°F',
    nearby: [
    { name: "Dauphin Island Hydro", lat: 30.25131944444444, lon: -88.07948611111111, slug: "dauphin-island-hydro" },
    { name: "DAUPHIN ISLAND", lat: 30.25, lon: -88.07499694824219, slug: "dauphin-island" },
    { name: "NORTH POINT, DAUPHIN ISLAND", lat: 30.2583, lon: -88.1133, slug: "north-point-dauphin-island" },
    { name: "Mobile Point (Fort Morgan)", lat: 30.2333, lon: -88.02, slug: "mobile-point-fort-morgan" }
    ],
    species: [
    { name: 'Red Snapper',      icon: '🎣', color: '#ef4444', bait: 'Squid, cigar minnow, live shrimp',  regulation: '16″ min · 2/day · season',  when: 'Offshore reefs & rigs — major solunar' },
    { name: 'Redfish',          icon: '🎣', color: '#f97316', bait: 'Mullet chunk, shrimp, DOA crab',    regulation: 'Slot 18–27″ · 5/day',       when: 'Outgoing tide on flats & marsh edges' },
    { name: 'Speckled Trout',   icon: '🐟', color: '#60a5fa', bait: 'Mirrolure, live shrimp, gulp',      regulation: 'Slot 12–15″ · 15/day',      when: 'Early morning grass flats — incoming' },
    { name: 'Flounder',         icon: '🐡', color: '#34d399', bait: 'Gulp! shrimp, finger mullet',       regulation: '12″ min · 10/day',          when: 'Incoming tide near passes & drop-offs' },
    { name: 'Spanish Mackerel', icon: '🐡', color: '#facc15', bait: 'Gotcha plug, Clarkspoon, pilchard', regulation: '12″ min · 7/day',           when: 'Open water — outgoing tide & passes' },
  ],
  },
  {
    id: "8735587", waterTempId: "8735587",
    name: "NORTH POINT, DAUPHIN ISLAND", slug: "north-point-dauphin-island",
    state: "alabama", city: "NORTH POINT, DAUPHIN ISLAND, AL", region: "Alabama Gulf Coast",
    lat: 30.2583, lon: -88.1133, latDisplay: "30.26°N", lonDisplay: "88.11°W",
    sunLat: 30.26, sunMeridian: 90, sunLon: 88.11, utcOffset: 0,
    sunriseRef: 6.88, sunsetRef: 19.71,
    tidalType: 'diurnal', meanRange: 1.5, waterTempDefault: '68°F',
    nearby: [
    { name: "DAUPHIN ISLAND (TEMP)", lat: 30.2517, lon: -88.08, slug: "dauphin-island-temp" },
    { name: "Dauphin Island Hydro", lat: 30.25131944444444, lon: -88.07948611111111, slug: "dauphin-island-hydro" },
    { name: "DAUPHIN ISLAND", lat: 30.25, lon: -88.07499694824219, slug: "dauphin-island" },
    { name: "Mobile Point (Fort Morgan)", lat: 30.2333, lon: -88.02, slug: "mobile-point-fort-morgan" }
    ],
    species: [
    { name: 'Red Snapper',      icon: '🎣', color: '#ef4444', bait: 'Squid, cigar minnow, live shrimp',  regulation: '16″ min · 2/day · season',  when: 'Offshore reefs & rigs — major solunar' },
    { name: 'Redfish',          icon: '🎣', color: '#f97316', bait: 'Mullet chunk, shrimp, DOA crab',    regulation: 'Slot 18–27″ · 5/day',       when: 'Outgoing tide on flats & marsh edges' },
    { name: 'Speckled Trout',   icon: '🐟', color: '#60a5fa', bait: 'Mirrolure, live shrimp, gulp',      regulation: 'Slot 12–15″ · 15/day',      when: 'Early morning grass flats — incoming' },
    { name: 'Flounder',         icon: '🐡', color: '#34d399', bait: 'Gulp! shrimp, finger mullet',       regulation: '12″ min · 10/day',          when: 'Incoming tide near passes & drop-offs' },
    { name: 'Spanish Mackerel', icon: '🐡', color: '#facc15', bait: 'Gotcha plug, Clarkspoon, pilchard', regulation: '12″ min · 7/day',           when: 'Open water — outgoing tide & passes' },
  ],
  },
]

export function getStationBySlug(slug: string): StationConfig | undefined {
  return ALABAMA_STATIONS.find(s => s.slug === slug)
}

export function getAllSlugs(): string[] {
  return ALABAMA_STATIONS.map(s => s.slug)
}
