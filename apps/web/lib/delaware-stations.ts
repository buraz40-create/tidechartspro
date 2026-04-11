// AUTO-GENERATED — do not edit by hand.
// Source: NOAA CO-OPS tide prediction stations, Delaware
// Regenerate: node apps/web/scripts/generate-all-states.mjs

import type { StationConfig, NearbyStation, Species } from './florida-stations'
export type { StationConfig, NearbyStation, Species }

export const DELAWARE_STATIONS: StationConfig[] = [
  {
    id: "8550438", waterTempId: "8550438",
    name: "Edgemoor, Del.", slug: "edgemoor-del",
    state: "delaware", city: "Edgemoor, Del., DE", region: "Delaware Bay",
    lat: 39.75, lon: -75.4933, latDisplay: "39.75°N", lonDisplay: "75.49°W",
    sunLat: 39.75, sunMeridian: 75, sunLon: 75.49, utcOffset: 1,
    sunriseRef: 6.62, sunsetRef: 20.19,
    tidalType: 'semidiurnal', meanRange: 4.2, waterTempDefault: '57°F',
    nearby: [
    { name: "Wilmington Marine Terminal", lat: 39.7183, lon: -75.52, slug: "wilmington-marine-terminal" },
    { name: "Millside, RR. bridge", lat: 39.725, lon: -75.56, slug: "millside-rr-bridge" },
    { name: "New Castle, Delaware", lat: 39.6567, lon: -75.5617, slug: "new-castle-delaware" },
    { name: "Pea Patch Island, Bulkhead Shoal Channel, Del.", lat: 39.5833, lon: -75.5733, slug: "pea-patch-island-bulkhead-shoal-channel-del" }
    ],
    species: [
    { name: 'Striped Bass',       icon: '🎣', color: '#38bdf8', bait: 'Bunker (menhaden), live eel, swim shad', regulation: '28″ min · check season', when: 'Moving tide — rips, inlets, structure' },
    { name: 'Summer Flounder',    icon: '🐡', color: '#34d399', bait: 'Gulp! shrimp, squid strip, bucktail jig', regulation: '14″ min · 10/day',      when: 'Incoming tide near channels & drop-offs' },
    { name: 'Bluefish',           icon: '🐟', color: '#60a5fa', bait: 'Metal jig, popper, bunker chunk',        regulation: '10″ min · 10/day',      when: 'Moving tide — surface feeding, inlets' },
    { name: 'Weakfish (Seatrout)',icon: '🐟', color: '#a78bfa', bait: 'Bucktail jig, live shrimp, soft plastic', regulation: '13″ min · 10/day',      when: 'Dawn & dusk — incoming tide on grass beds' },
    { name: 'Tautog (Blackfish)', icon: '🐡', color: '#facc15', bait: 'Green crab, fiddler crab, sand flea',    regulation: '16″ min · varies',       when: 'Slack tide — wrecks, rocks, jetties' },
  ],
  },
  {
    id: "8550658", waterTempId: "8550658",
    name: "Millside, RR. bridge", slug: "millside-rr-bridge",
    state: "delaware", city: "Millside, RR. bridge, DE", region: "Delaware Bay",
    lat: 39.725, lon: -75.56, latDisplay: "39.73°N", lonDisplay: "75.56°W",
    sunLat: 39.73, sunMeridian: 75, sunLon: 75.56, utcOffset: 1,
    sunriseRef: 6.62, sunsetRef: 20.19,
    tidalType: 'semidiurnal', meanRange: 4.2, waterTempDefault: '57°F',
    nearby: [
    { name: "Wilmington Marine Terminal", lat: 39.7183, lon: -75.52, slug: "wilmington-marine-terminal" },
    { name: "Edgemoor, Del.", lat: 39.75, lon: -75.4933, slug: "edgemoor-del" },
    { name: "New Castle, Delaware", lat: 39.6567, lon: -75.5617, slug: "new-castle-delaware" },
    { name: "Pea Patch Island, Bulkhead Shoal Channel, Del.", lat: 39.5833, lon: -75.5733, slug: "pea-patch-island-bulkhead-shoal-channel-del" }
    ],
    species: [
    { name: 'Striped Bass',       icon: '🎣', color: '#38bdf8', bait: 'Bunker (menhaden), live eel, swim shad', regulation: '28″ min · check season', when: 'Moving tide — rips, inlets, structure' },
    { name: 'Summer Flounder',    icon: '🐡', color: '#34d399', bait: 'Gulp! shrimp, squid strip, bucktail jig', regulation: '14″ min · 10/day',      when: 'Incoming tide near channels & drop-offs' },
    { name: 'Bluefish',           icon: '🐟', color: '#60a5fa', bait: 'Metal jig, popper, bunker chunk',        regulation: '10″ min · 10/day',      when: 'Moving tide — surface feeding, inlets' },
    { name: 'Weakfish (Seatrout)',icon: '🐟', color: '#a78bfa', bait: 'Bucktail jig, live shrimp, soft plastic', regulation: '13″ min · 10/day',      when: 'Dawn & dusk — incoming tide on grass beds' },
    { name: 'Tautog (Blackfish)', icon: '🐡', color: '#facc15', bait: 'Green crab, fiddler crab, sand flea',    regulation: '16″ min · varies',       when: 'Slack tide — wrecks, rocks, jetties' },
  ],
  },
  {
    id: "8550714", waterTempId: "8550714",
    name: "Wilmington Marine Terminal", slug: "wilmington-marine-terminal",
    state: "delaware", city: "Wilmington Marine Terminal, DE", region: "Delaware Bay",
    lat: 39.7183, lon: -75.52, latDisplay: "39.72°N", lonDisplay: "75.52°W",
    sunLat: 39.72, sunMeridian: 75, sunLon: 75.52, utcOffset: 1,
    sunriseRef: 6.62, sunsetRef: 20.19,
    tidalType: 'semidiurnal', meanRange: 4.2, waterTempDefault: '57°F',
    nearby: [
    { name: "Millside, RR. bridge", lat: 39.725, lon: -75.56, slug: "millside-rr-bridge" },
    { name: "Edgemoor, Del.", lat: 39.75, lon: -75.4933, slug: "edgemoor-del" },
    { name: "New Castle, Delaware", lat: 39.6567, lon: -75.5617, slug: "new-castle-delaware" },
    { name: "Pea Patch Island, Bulkhead Shoal Channel, Del.", lat: 39.5833, lon: -75.5733, slug: "pea-patch-island-bulkhead-shoal-channel-del" }
    ],
    species: [
    { name: 'Striped Bass',       icon: '🎣', color: '#38bdf8', bait: 'Bunker (menhaden), live eel, swim shad', regulation: '28″ min · check season', when: 'Moving tide — rips, inlets, structure' },
    { name: 'Summer Flounder',    icon: '🐡', color: '#34d399', bait: 'Gulp! shrimp, squid strip, bucktail jig', regulation: '14″ min · 10/day',      when: 'Incoming tide near channels & drop-offs' },
    { name: 'Bluefish',           icon: '🐟', color: '#60a5fa', bait: 'Metal jig, popper, bunker chunk',        regulation: '10″ min · 10/day',      when: 'Moving tide — surface feeding, inlets' },
    { name: 'Weakfish (Seatrout)',icon: '🐟', color: '#a78bfa', bait: 'Bucktail jig, live shrimp, soft plastic', regulation: '13″ min · 10/day',      when: 'Dawn & dusk — incoming tide on grass beds' },
    { name: 'Tautog (Blackfish)', icon: '🐡', color: '#facc15', bait: 'Green crab, fiddler crab, sand flea',    regulation: '16″ min · varies',       when: 'Slack tide — wrecks, rocks, jetties' },
  ],
  },
  {
    id: "8551201", waterTempId: "8551201",
    name: "New Castle, Delaware", slug: "new-castle-delaware",
    state: "delaware", city: "New Castle, Delaware, DE", region: "Delaware Bay",
    lat: 39.6567, lon: -75.5617, latDisplay: "39.66°N", lonDisplay: "75.56°W",
    sunLat: 39.66, sunMeridian: 75, sunLon: 75.56, utcOffset: 1,
    sunriseRef: 6.62, sunsetRef: 20.19,
    tidalType: 'semidiurnal', meanRange: 4.2, waterTempDefault: '57°F',
    nearby: [
    { name: "Millside, RR. bridge", lat: 39.725, lon: -75.56, slug: "millside-rr-bridge" },
    { name: "Wilmington Marine Terminal", lat: 39.7183, lon: -75.52, slug: "wilmington-marine-terminal" },
    { name: "Pea Patch Island, Bulkhead Shoal Channel, Del.", lat: 39.5833, lon: -75.5733, slug: "pea-patch-island-bulkhead-shoal-channel-del" },
    { name: "Delaware City", lat: 39.58219444444445, lon: -75.58897222222222, slug: "delaware-city" }
    ],
    species: [
    { name: 'Striped Bass',       icon: '🎣', color: '#38bdf8', bait: 'Bunker (menhaden), live eel, swim shad', regulation: '28″ min · check season', when: 'Moving tide — rips, inlets, structure' },
    { name: 'Summer Flounder',    icon: '🐡', color: '#34d399', bait: 'Gulp! shrimp, squid strip, bucktail jig', regulation: '14″ min · 10/day',      when: 'Incoming tide near channels & drop-offs' },
    { name: 'Bluefish',           icon: '🐟', color: '#60a5fa', bait: 'Metal jig, popper, bunker chunk',        regulation: '10″ min · 10/day',      when: 'Moving tide — surface feeding, inlets' },
    { name: 'Weakfish (Seatrout)',icon: '🐟', color: '#a78bfa', bait: 'Bucktail jig, live shrimp, soft plastic', regulation: '13″ min · 10/day',      when: 'Dawn & dusk — incoming tide on grass beds' },
    { name: 'Tautog (Blackfish)', icon: '🐡', color: '#facc15', bait: 'Green crab, fiddler crab, sand flea',    regulation: '16″ min · varies',       when: 'Slack tide — wrecks, rocks, jetties' },
  ],
  },
  {
    id: "8551702", waterTempId: "8551702",
    name: "Pea Patch Island, Bulkhead Shoal Channel, Del.", slug: "pea-patch-island-bulkhead-shoal-channel-del",
    state: "delaware", city: "Pea Patch Island, Bulkhead Shoal Channel, Del., DE", region: "Delaware Bay",
    lat: 39.5833, lon: -75.5733, latDisplay: "39.58°N", lonDisplay: "75.57°W",
    sunLat: 39.58, sunMeridian: 75, sunLon: 75.57, utcOffset: 1,
    sunriseRef: 6.63, sunsetRef: 20.18,
    tidalType: 'semidiurnal', meanRange: 4.2, waterTempDefault: '57°F',
    nearby: [
    { name: "Delaware City", lat: 39.58219444444445, lon: -75.58897222222222, slug: "delaware-city" },
    { name: "Delaware City Branch Channel bridge", lat: 39.57, lon: -75.59, slug: "delaware-city-branch-channel-bridge" },
    { name: "REEDY POINT", lat: 39.5583333, lon: -75.5719444, slug: "reedy-point" },
    { name: "St. Georges, Delaware", lat: 39.555, lon: -75.6483, slug: "st-georges-delaware" }
    ],
    species: [
    { name: 'Striped Bass',       icon: '🎣', color: '#38bdf8', bait: 'Bunker (menhaden), live eel, swim shad', regulation: '28″ min · check season', when: 'Moving tide — rips, inlets, structure' },
    { name: 'Summer Flounder',    icon: '🐡', color: '#34d399', bait: 'Gulp! shrimp, squid strip, bucktail jig', regulation: '14″ min · 10/day',      when: 'Incoming tide near channels & drop-offs' },
    { name: 'Bluefish',           icon: '🐟', color: '#60a5fa', bait: 'Metal jig, popper, bunker chunk',        regulation: '10″ min · 10/day',      when: 'Moving tide — surface feeding, inlets' },
    { name: 'Weakfish (Seatrout)',icon: '🐟', color: '#a78bfa', bait: 'Bucktail jig, live shrimp, soft plastic', regulation: '13″ min · 10/day',      when: 'Dawn & dusk — incoming tide on grass beds' },
    { name: 'Tautog (Blackfish)', icon: '🐡', color: '#facc15', bait: 'Green crab, fiddler crab, sand flea',    regulation: '16″ min · varies',       when: 'Slack tide — wrecks, rocks, jetties' },
  ],
  },
  {
    id: "8551762", waterTempId: "8551762",
    name: "Delaware City", slug: "delaware-city",
    state: "delaware", city: "Delaware City, DE", region: "Delaware Bay",
    lat: 39.58219444444445, lon: -75.58897222222222, latDisplay: "39.58°N", lonDisplay: "75.59°W",
    sunLat: 39.58, sunMeridian: 75, sunLon: 75.59, utcOffset: 1,
    sunriseRef: 6.63, sunsetRef: 20.18,
    tidalType: 'semidiurnal', meanRange: 4.2, waterTempDefault: '57°F',
    nearby: [
    { name: "Pea Patch Island, Bulkhead Shoal Channel, Del.", lat: 39.5833, lon: -75.5733, slug: "pea-patch-island-bulkhead-shoal-channel-del" },
    { name: "Delaware City Branch Channel bridge", lat: 39.57, lon: -75.59, slug: "delaware-city-branch-channel-bridge" },
    { name: "REEDY POINT", lat: 39.5583333, lon: -75.5719444, slug: "reedy-point" },
    { name: "St. Georges, Delaware", lat: 39.555, lon: -75.6483, slug: "st-georges-delaware" }
    ],
    species: [
    { name: 'Striped Bass',       icon: '🎣', color: '#38bdf8', bait: 'Bunker (menhaden), live eel, swim shad', regulation: '28″ min · check season', when: 'Moving tide — rips, inlets, structure' },
    { name: 'Summer Flounder',    icon: '🐡', color: '#34d399', bait: 'Gulp! shrimp, squid strip, bucktail jig', regulation: '14″ min · 10/day',      when: 'Incoming tide near channels & drop-offs' },
    { name: 'Bluefish',           icon: '🐟', color: '#60a5fa', bait: 'Metal jig, popper, bunker chunk',        regulation: '10″ min · 10/day',      when: 'Moving tide — surface feeding, inlets' },
    { name: 'Weakfish (Seatrout)',icon: '🐟', color: '#a78bfa', bait: 'Bucktail jig, live shrimp, soft plastic', regulation: '13″ min · 10/day',      when: 'Dawn & dusk — incoming tide on grass beds' },
    { name: 'Tautog (Blackfish)', icon: '🐡', color: '#facc15', bait: 'Green crab, fiddler crab, sand flea',    regulation: '16″ min · varies',       when: 'Slack tide — wrecks, rocks, jetties' },
  ],
  },
  {
    id: "8551851", waterTempId: "8551851",
    name: "Delaware City Branch Channel bridge", slug: "delaware-city-branch-channel-bridge",
    state: "delaware", city: "Delaware City Branch Channel bridge, DE", region: "Delaware Bay",
    lat: 39.57, lon: -75.59, latDisplay: "39.57°N", lonDisplay: "75.59°W",
    sunLat: 39.57, sunMeridian: 75, sunLon: 75.59, utcOffset: 1,
    sunriseRef: 6.63, sunsetRef: 20.18,
    tidalType: 'semidiurnal', meanRange: 4.2, waterTempDefault: '57°F',
    nearby: [
    { name: "Delaware City", lat: 39.58219444444445, lon: -75.58897222222222, slug: "delaware-city" },
    { name: "REEDY POINT", lat: 39.5583333, lon: -75.5719444, slug: "reedy-point" },
    { name: "Pea Patch Island, Bulkhead Shoal Channel, Del.", lat: 39.5833, lon: -75.5733, slug: "pea-patch-island-bulkhead-shoal-channel-del" },
    { name: "St. Georges, Delaware", lat: 39.555, lon: -75.6483, slug: "st-georges-delaware" }
    ],
    species: [
    { name: 'Striped Bass',       icon: '🎣', color: '#38bdf8', bait: 'Bunker (menhaden), live eel, swim shad', regulation: '28″ min · check season', when: 'Moving tide — rips, inlets, structure' },
    { name: 'Summer Flounder',    icon: '🐡', color: '#34d399', bait: 'Gulp! shrimp, squid strip, bucktail jig', regulation: '14″ min · 10/day',      when: 'Incoming tide near channels & drop-offs' },
    { name: 'Bluefish',           icon: '🐟', color: '#60a5fa', bait: 'Metal jig, popper, bunker chunk',        regulation: '10″ min · 10/day',      when: 'Moving tide — surface feeding, inlets' },
    { name: 'Weakfish (Seatrout)',icon: '🐟', color: '#a78bfa', bait: 'Bucktail jig, live shrimp, soft plastic', regulation: '13″ min · 10/day',      when: 'Dawn & dusk — incoming tide on grass beds' },
    { name: 'Tautog (Blackfish)', icon: '🐡', color: '#facc15', bait: 'Green crab, fiddler crab, sand flea',    regulation: '16″ min · varies',       when: 'Slack tide — wrecks, rocks, jetties' },
  ],
  },
  {
    id: "8551910", waterTempId: "8551910",
    name: "REEDY POINT", slug: "reedy-point",
    state: "delaware", city: "REEDY POINT, DE", region: "Delaware Bay",
    lat: 39.5583333, lon: -75.5719444, latDisplay: "39.56°N", lonDisplay: "75.57°W",
    sunLat: 39.56, sunMeridian: 75, sunLon: 75.57, utcOffset: 1,
    sunriseRef: 6.63, sunsetRef: 20.18,
    tidalType: 'semidiurnal', meanRange: 4.2, waterTempDefault: '57°F',
    nearby: [
    { name: "Delaware City Branch Channel bridge", lat: 39.57, lon: -75.59, slug: "delaware-city-branch-channel-bridge" },
    { name: "Pea Patch Island, Bulkhead Shoal Channel, Del.", lat: 39.5833, lon: -75.5733, slug: "pea-patch-island-bulkhead-shoal-channel-del" },
    { name: "Delaware City", lat: 39.58219444444445, lon: -75.58897222222222, slug: "delaware-city" },
    { name: "St. Georges, Delaware", lat: 39.555, lon: -75.6483, slug: "st-georges-delaware" }
    ],
    species: [
    { name: 'Striped Bass',       icon: '🎣', color: '#38bdf8', bait: 'Bunker (menhaden), live eel, swim shad', regulation: '28″ min · check season', when: 'Moving tide — rips, inlets, structure' },
    { name: 'Summer Flounder',    icon: '🐡', color: '#34d399', bait: 'Gulp! shrimp, squid strip, bucktail jig', regulation: '14″ min · 10/day',      when: 'Incoming tide near channels & drop-offs' },
    { name: 'Bluefish',           icon: '🐟', color: '#60a5fa', bait: 'Metal jig, popper, bunker chunk',        regulation: '10″ min · 10/day',      when: 'Moving tide — surface feeding, inlets' },
    { name: 'Weakfish (Seatrout)',icon: '🐟', color: '#a78bfa', bait: 'Bucktail jig, live shrimp, soft plastic', regulation: '13″ min · 10/day',      when: 'Dawn & dusk — incoming tide on grass beds' },
    { name: 'Tautog (Blackfish)', icon: '🐡', color: '#facc15', bait: 'Green crab, fiddler crab, sand flea',    regulation: '16″ min · varies',       when: 'Slack tide — wrecks, rocks, jetties' },
  ],
  },
  {
    id: "8551973", waterTempId: "8551973",
    name: "St. Georges, Delaware", slug: "st-georges-delaware",
    state: "delaware", city: "St. Georges, Delaware, DE", region: "Delaware Bay",
    lat: 39.555, lon: -75.6483, latDisplay: "39.55°N", lonDisplay: "75.65°W",
    sunLat: 39.56, sunMeridian: 75, sunLon: 75.65, utcOffset: 1,
    sunriseRef: 6.63, sunsetRef: 20.18,
    tidalType: 'semidiurnal', meanRange: 4.2, waterTempDefault: '57°F',
    nearby: [
    { name: "Delaware City Branch Channel bridge", lat: 39.57, lon: -75.59, slug: "delaware-city-branch-channel-bridge" },
    { name: "Delaware City", lat: 39.58219444444445, lon: -75.58897222222222, slug: "delaware-city" },
    { name: "REEDY POINT", lat: 39.5583333, lon: -75.5719444, slug: "reedy-point" },
    { name: "Pea Patch Island, Bulkhead Shoal Channel, Del.", lat: 39.5833, lon: -75.5733, slug: "pea-patch-island-bulkhead-shoal-channel-del" }
    ],
    species: [
    { name: 'Striped Bass',       icon: '🎣', color: '#38bdf8', bait: 'Bunker (menhaden), live eel, swim shad', regulation: '28″ min · check season', when: 'Moving tide — rips, inlets, structure' },
    { name: 'Summer Flounder',    icon: '🐡', color: '#34d399', bait: 'Gulp! shrimp, squid strip, bucktail jig', regulation: '14″ min · 10/day',      when: 'Incoming tide near channels & drop-offs' },
    { name: 'Bluefish',           icon: '🐟', color: '#60a5fa', bait: 'Metal jig, popper, bunker chunk',        regulation: '10″ min · 10/day',      when: 'Moving tide — surface feeding, inlets' },
    { name: 'Weakfish (Seatrout)',icon: '🐟', color: '#a78bfa', bait: 'Bucktail jig, live shrimp, soft plastic', regulation: '13″ min · 10/day',      when: 'Dawn & dusk — incoming tide on grass beds' },
    { name: 'Tautog (Blackfish)', icon: '🐡', color: '#facc15', bait: 'Green crab, fiddler crab, sand flea',    regulation: '16″ min · varies',       when: 'Slack tide — wrecks, rocks, jetties' },
  ],
  },
  {
    id: "8552125", waterTempId: "8552125",
    name: "Summit Bridge, Delaware", slug: "summit-bridge-delaware",
    state: "delaware", city: "Summit Bridge, Delaware, DE", region: "Delaware Bay",
    lat: 39.5333, lon: -75.7333, latDisplay: "39.53°N", lonDisplay: "75.73°W",
    sunLat: 39.53, sunMeridian: 75, sunLon: 75.73, utcOffset: 1,
    sunriseRef: 6.63, sunsetRef: 20.18,
    tidalType: 'semidiurnal', meanRange: 4.2, waterTempDefault: '57°F',
    nearby: [
    { name: "St. Georges, Delaware", lat: 39.555, lon: -75.6483, slug: "st-georges-delaware" },
    { name: "Delaware City Branch Channel bridge", lat: 39.57, lon: -75.59, slug: "delaware-city-branch-channel-bridge" },
    { name: "Delaware City", lat: 39.58219444444445, lon: -75.58897222222222, slug: "delaware-city" },
    { name: "REEDY POINT", lat: 39.5583333, lon: -75.5719444, slug: "reedy-point" }
    ],
    species: [
    { name: 'Striped Bass',       icon: '🎣', color: '#38bdf8', bait: 'Bunker (menhaden), live eel, swim shad', regulation: '28″ min · check season', when: 'Moving tide — rips, inlets, structure' },
    { name: 'Summer Flounder',    icon: '🐡', color: '#34d399', bait: 'Gulp! shrimp, squid strip, bucktail jig', regulation: '14″ min · 10/day',      when: 'Incoming tide near channels & drop-offs' },
    { name: 'Bluefish',           icon: '🐟', color: '#60a5fa', bait: 'Metal jig, popper, bunker chunk',        regulation: '10″ min · 10/day',      when: 'Moving tide — surface feeding, inlets' },
    { name: 'Weakfish (Seatrout)',icon: '🐟', color: '#a78bfa', bait: 'Bucktail jig, live shrimp, soft plastic', regulation: '13″ min · 10/day',      when: 'Dawn & dusk — incoming tide on grass beds' },
    { name: 'Tautog (Blackfish)', icon: '🐡', color: '#facc15', bait: 'Green crab, fiddler crab, sand flea',    regulation: '16″ min · varies',       when: 'Slack tide — wrecks, rocks, jetties' },
  ],
  },
  {
    id: "8553069", waterTempId: "8553069",
    name: "Taylors Bridge, Blackbird Creek, Del.", slug: "taylors-bridge-blackbird-creek-del",
    state: "delaware", city: "Taylors Bridge, Blackbird Creek, Del., DE", region: "Delaware Bay",
    lat: 39.405, lon: -75.5983, latDisplay: "39.41°N", lonDisplay: "75.60°W",
    sunLat: 39.41, sunMeridian: 75, sunLon: 75.6, utcOffset: 1,
    sunriseRef: 6.64, sunsetRef: 20.18,
    tidalType: 'semidiurnal', meanRange: 4.2, waterTempDefault: '57°F',
    nearby: [
    { name: "Woodland Beach, Del.", lat: 39.3333, lon: -75.4667, slug: "woodland-beach-del" },
    { name: "REEDY POINT", lat: 39.5583333, lon: -75.5719444, slug: "reedy-point" },
    { name: "St. Georges, Delaware", lat: 39.555, lon: -75.6483, slug: "st-georges-delaware" },
    { name: "Delaware City Branch Channel bridge", lat: 39.57, lon: -75.59, slug: "delaware-city-branch-channel-bridge" }
    ],
    species: [
    { name: 'Striped Bass',       icon: '🎣', color: '#38bdf8', bait: 'Bunker (menhaden), live eel, swim shad', regulation: '28″ min · check season', when: 'Moving tide — rips, inlets, structure' },
    { name: 'Summer Flounder',    icon: '🐡', color: '#34d399', bait: 'Gulp! shrimp, squid strip, bucktail jig', regulation: '14″ min · 10/day',      when: 'Incoming tide near channels & drop-offs' },
    { name: 'Bluefish',           icon: '🐟', color: '#60a5fa', bait: 'Metal jig, popper, bunker chunk',        regulation: '10″ min · 10/day',      when: 'Moving tide — surface feeding, inlets' },
    { name: 'Weakfish (Seatrout)',icon: '🐟', color: '#a78bfa', bait: 'Bucktail jig, live shrimp, soft plastic', regulation: '13″ min · 10/day',      when: 'Dawn & dusk — incoming tide on grass beds' },
    { name: 'Tautog (Blackfish)', icon: '🐡', color: '#facc15', bait: 'Green crab, fiddler crab, sand flea',    regulation: '16″ min · varies',       when: 'Slack tide — wrecks, rocks, jetties' },
  ],
  },
  {
    id: "8553501", waterTempId: "8553501",
    name: "Woodland Beach, Del.", slug: "woodland-beach-del",
    state: "delaware", city: "Woodland Beach, Del., DE", region: "Delaware Bay",
    lat: 39.3333, lon: -75.4667, latDisplay: "39.33°N", lonDisplay: "75.47°W",
    sunLat: 39.33, sunMeridian: 75, sunLon: 75.47, utcOffset: 1,
    sunriseRef: 6.64, sunsetRef: 20.17,
    tidalType: 'semidiurnal', meanRange: 4.2, waterTempDefault: '57°F',
    nearby: [
    { name: "Leipsic, Leipsic River", lat: 39.245, lon: -75.5183, slug: "leipsic-leipsic-river" },
    { name: "Taylors Bridge, Blackbird Creek, Del.", lat: 39.405, lon: -75.5983, slug: "taylors-bridge-blackbird-creek-del" },
    { name: "Mahon River entrance", lat: 39.185, lon: -75.4, slug: "mahon-river-entrance" },
    { name: "Elbow of Cross Ledge Light", lat: 39.1667, lon: -75.2667, slug: "elbow-of-cross-ledge-light" }
    ],
    species: [
    { name: 'Striped Bass',       icon: '🎣', color: '#38bdf8', bait: 'Bunker (menhaden), live eel, swim shad', regulation: '28″ min · check season', when: 'Moving tide — rips, inlets, structure' },
    { name: 'Summer Flounder',    icon: '🐡', color: '#34d399', bait: 'Gulp! shrimp, squid strip, bucktail jig', regulation: '14″ min · 10/day',      when: 'Incoming tide near channels & drop-offs' },
    { name: 'Bluefish',           icon: '🐟', color: '#60a5fa', bait: 'Metal jig, popper, bunker chunk',        regulation: '10″ min · 10/day',      when: 'Moving tide — surface feeding, inlets' },
    { name: 'Weakfish (Seatrout)',icon: '🐟', color: '#a78bfa', bait: 'Bucktail jig, live shrimp, soft plastic', regulation: '13″ min · 10/day',      when: 'Dawn & dusk — incoming tide on grass beds' },
    { name: 'Tautog (Blackfish)', icon: '🐡', color: '#facc15', bait: 'Green crab, fiddler crab, sand flea',    regulation: '16″ min · varies',       when: 'Slack tide — wrecks, rocks, jetties' },
  ],
  },
  {
    id: "8554038", waterTempId: "8554038",
    name: "Leipsic, Leipsic River", slug: "leipsic-leipsic-river",
    state: "delaware", city: "Leipsic, Leipsic River, DE", region: "Delaware Bay",
    lat: 39.245, lon: -75.5183, latDisplay: "39.24°N", lonDisplay: "75.52°W",
    sunLat: 39.24, sunMeridian: 75, sunLon: 75.52, utcOffset: 1,
    sunriseRef: 6.65, sunsetRef: 20.17,
    tidalType: 'semidiurnal', meanRange: 4.2, waterTempDefault: '57°F',
    nearby: [
    { name: "Woodland Beach, Del.", lat: 39.3333, lon: -75.4667, slug: "woodland-beach-del" },
    { name: "Mahon River entrance", lat: 39.185, lon: -75.4, slug: "mahon-river-entrance" },
    { name: "Taylors Bridge, Blackbird Creek, Del.", lat: 39.405, lon: -75.5983, slug: "taylors-bridge-blackbird-creek-del" },
    { name: "Murderkill River entrance", lat: 39.0583, lon: -75.3967, slug: "murderkill-river-entrance" }
    ],
    species: [
    { name: 'Striped Bass',       icon: '🎣', color: '#38bdf8', bait: 'Bunker (menhaden), live eel, swim shad', regulation: '28″ min · check season', when: 'Moving tide — rips, inlets, structure' },
    { name: 'Summer Flounder',    icon: '🐡', color: '#34d399', bait: 'Gulp! shrimp, squid strip, bucktail jig', regulation: '14″ min · 10/day',      when: 'Incoming tide near channels & drop-offs' },
    { name: 'Bluefish',           icon: '🐟', color: '#60a5fa', bait: 'Metal jig, popper, bunker chunk',        regulation: '10″ min · 10/day',      when: 'Moving tide — surface feeding, inlets' },
    { name: 'Weakfish (Seatrout)',icon: '🐟', color: '#a78bfa', bait: 'Bucktail jig, live shrimp, soft plastic', regulation: '13″ min · 10/day',      when: 'Dawn & dusk — incoming tide on grass beds' },
    { name: 'Tautog (Blackfish)', icon: '🐡', color: '#facc15', bait: 'Green crab, fiddler crab, sand flea',    regulation: '16″ min · varies',       when: 'Slack tide — wrecks, rocks, jetties' },
  ],
  },
  {
    id: "8554399", waterTempId: "8554399",
    name: "Mahon River entrance", slug: "mahon-river-entrance",
    state: "delaware", city: "Mahon River entrance, DE", region: "Delaware Bay",
    lat: 39.185, lon: -75.4, latDisplay: "39.19°N", lonDisplay: "75.40°W",
    sunLat: 39.19, sunMeridian: 75, sunLon: 75.4, utcOffset: 1,
    sunriseRef: 6.65, sunsetRef: 20.17,
    tidalType: 'semidiurnal', meanRange: 4.2, waterTempDefault: '57°F',
    nearby: [
    { name: "Elbow of Cross Ledge Light", lat: 39.1667, lon: -75.2667, slug: "elbow-of-cross-ledge-light" },
    { name: "Leipsic, Leipsic River", lat: 39.245, lon: -75.5183, slug: "leipsic-leipsic-river" },
    { name: "Murderkill River entrance", lat: 39.0583, lon: -75.3967, slug: "murderkill-river-entrance" },
    { name: "Woodland Beach, Del.", lat: 39.3333, lon: -75.4667, slug: "woodland-beach-del" }
    ],
    species: [
    { name: 'Striped Bass',       icon: '🎣', color: '#38bdf8', bait: 'Bunker (menhaden), live eel, swim shad', regulation: '28″ min · check season', when: 'Moving tide — rips, inlets, structure' },
    { name: 'Summer Flounder',    icon: '🐡', color: '#34d399', bait: 'Gulp! shrimp, squid strip, bucktail jig', regulation: '14″ min · 10/day',      when: 'Incoming tide near channels & drop-offs' },
    { name: 'Bluefish',           icon: '🐟', color: '#60a5fa', bait: 'Metal jig, popper, bunker chunk',        regulation: '10″ min · 10/day',      when: 'Moving tide — surface feeding, inlets' },
    { name: 'Weakfish (Seatrout)',icon: '🐟', color: '#a78bfa', bait: 'Bucktail jig, live shrimp, soft plastic', regulation: '13″ min · 10/day',      when: 'Dawn & dusk — incoming tide on grass beds' },
    { name: 'Tautog (Blackfish)', icon: '🐡', color: '#facc15', bait: 'Green crab, fiddler crab, sand flea',    regulation: '16″ min · varies',       when: 'Slack tide — wrecks, rocks, jetties' },
  ],
  },
  {
    id: "8555388", waterTempId: "8555388",
    name: "Murderkill River entrance", slug: "murderkill-river-entrance",
    state: "delaware", city: "Murderkill River entrance, DE", region: "Delaware Bay",
    lat: 39.0583, lon: -75.3967, latDisplay: "39.06°N", lonDisplay: "75.40°W",
    sunLat: 39.06, sunMeridian: 75, sunLon: 75.4, utcOffset: 1,
    sunriseRef: 6.66, sunsetRef: 20.16,
    tidalType: 'semidiurnal', meanRange: 4.2, waterTempDefault: '57°F',
    nearby: [
    { name: "Mahon River entrance", lat: 39.185, lon: -75.4, slug: "mahon-river-entrance" },
    { name: "Mispillion River entrance", lat: 38.945, lon: -75.3133, slug: "mispillion-river-entrance" },
    { name: "Elbow of Cross Ledge Light", lat: 39.1667, lon: -75.2667, slug: "elbow-of-cross-ledge-light" },
    { name: "FOURTEEN FOOT BANK LIGHT", lat: 39.0483, lon: -75.1833, slug: "fourteen-foot-bank-light" }
    ],
    species: [
    { name: 'Striped Bass',       icon: '🎣', color: '#38bdf8', bait: 'Bunker (menhaden), live eel, swim shad', regulation: '28″ min · check season', when: 'Moving tide — rips, inlets, structure' },
    { name: 'Summer Flounder',    icon: '🐡', color: '#34d399', bait: 'Gulp! shrimp, squid strip, bucktail jig', regulation: '14″ min · 10/day',      when: 'Incoming tide near channels & drop-offs' },
    { name: 'Bluefish',           icon: '🐟', color: '#60a5fa', bait: 'Metal jig, popper, bunker chunk',        regulation: '10″ min · 10/day',      when: 'Moving tide — surface feeding, inlets' },
    { name: 'Weakfish (Seatrout)',icon: '🐟', color: '#a78bfa', bait: 'Bucktail jig, live shrimp, soft plastic', regulation: '13″ min · 10/day',      when: 'Dawn & dusk — incoming tide on grass beds' },
    { name: 'Tautog (Blackfish)', icon: '🐡', color: '#facc15', bait: 'Green crab, fiddler crab, sand flea',    regulation: '16″ min · varies',       when: 'Slack tide — wrecks, rocks, jetties' },
  ],
  },
  {
    id: "8555889", waterTempId: "8555889",
    name: "Brandywine Shoal Light", slug: "brandywine-shoal-light",
    state: "delaware", city: "Brandywine Shoal Light, DE", region: "Delaware Ocean Shore",
    lat: 38.98666666666667, lon: -75.11333333333333, latDisplay: "38.99°N", lonDisplay: "75.11°W",
    sunLat: 38.99, sunMeridian: 75, sunLon: 75.11, utcOffset: 1,
    sunriseRef: 6.66, sunsetRef: 20.16,
    tidalType: 'semidiurnal', meanRange: 4.2, waterTempDefault: '57°F',
    nearby: [
    { name: "FOURTEEN FOOT BANK LIGHT", lat: 39.0483, lon: -75.1833, slug: "fourteen-foot-bank-light" },
    { name: "Mispillion River entrance", lat: 38.945, lon: -75.3133, slug: "mispillion-river-entrance" },
    { name: "HARBOR OF REFUGE LIGHT", lat: 38.8, lon: -75.0833, slug: "harbor-of-refuge-light" },
    { name: "LEWES (BREAKWATER HARBOR)", lat: 38.78283333333334, lon: -75.11927777777778, slug: "lewes-breakwater-harbor" }
    ],
    species: [
    { name: 'Striped Bass',       icon: '🎣', color: '#38bdf8', bait: 'Bunker (menhaden), live eel, swim shad', regulation: '28″ min · check season', when: 'Moving tide — rips, inlets, structure' },
    { name: 'Summer Flounder',    icon: '🐡', color: '#34d399', bait: 'Gulp! shrimp, squid strip, bucktail jig', regulation: '14″ min · 10/day',      when: 'Incoming tide near channels & drop-offs' },
    { name: 'Bluefish',           icon: '🐟', color: '#60a5fa', bait: 'Metal jig, popper, bunker chunk',        regulation: '10″ min · 10/day',      when: 'Moving tide — surface feeding, inlets' },
    { name: 'Weakfish (Seatrout)',icon: '🐟', color: '#a78bfa', bait: 'Bucktail jig, live shrimp, soft plastic', regulation: '13″ min · 10/day',      when: 'Dawn & dusk — incoming tide on grass beds' },
    { name: 'Tautog (Blackfish)', icon: '🐡', color: '#facc15', bait: 'Green crab, fiddler crab, sand flea',    regulation: '16″ min · varies',       when: 'Slack tide — wrecks, rocks, jetties' },
  ],
  },
  {
    id: "8556198", waterTempId: "8556198",
    name: "Mispillion River entrance", slug: "mispillion-river-entrance",
    state: "delaware", city: "Mispillion River entrance, DE", region: "Delaware Bay",
    lat: 38.945, lon: -75.3133, latDisplay: "38.95°N", lonDisplay: "75.31°W",
    sunLat: 38.95, sunMeridian: 75, sunLon: 75.31, utcOffset: 1,
    sunriseRef: 6.66, sunsetRef: 20.16,
    tidalType: 'semidiurnal', meanRange: 4.2, waterTempDefault: '57°F',
    nearby: [
    { name: "Murderkill River entrance", lat: 39.0583, lon: -75.3967, slug: "murderkill-river-entrance" },
    { name: "FOURTEEN FOOT BANK LIGHT", lat: 39.0483, lon: -75.1833, slug: "fourteen-foot-bank-light" },
    { name: "Brandywine Shoal Light", lat: 38.98666666666667, lon: -75.11333333333333, slug: "brandywine-shoal-light" },
    { name: "LEWES (BREAKWATER HARBOR)", lat: 38.78283333333334, lon: -75.11927777777778, slug: "lewes-breakwater-harbor" }
    ],
    species: [
    { name: 'Striped Bass',       icon: '🎣', color: '#38bdf8', bait: 'Bunker (menhaden), live eel, swim shad', regulation: '28″ min · check season', when: 'Moving tide — rips, inlets, structure' },
    { name: 'Summer Flounder',    icon: '🐡', color: '#34d399', bait: 'Gulp! shrimp, squid strip, bucktail jig', regulation: '14″ min · 10/day',      when: 'Incoming tide near channels & drop-offs' },
    { name: 'Bluefish',           icon: '🐟', color: '#60a5fa', bait: 'Metal jig, popper, bunker chunk',        regulation: '10″ min · 10/day',      when: 'Moving tide — surface feeding, inlets' },
    { name: 'Weakfish (Seatrout)',icon: '🐟', color: '#a78bfa', bait: 'Bucktail jig, live shrimp, soft plastic', regulation: '13″ min · 10/day',      when: 'Dawn & dusk — incoming tide on grass beds' },
    { name: 'Tautog (Blackfish)', icon: '🐡', color: '#facc15', bait: 'Green crab, fiddler crab, sand flea',    regulation: '16″ min · varies',       when: 'Slack tide — wrecks, rocks, jetties' },
  ],
  },
  {
    id: "8557380", waterTempId: "8557380",
    name: "LEWES (BREAKWATER HARBOR)", slug: "lewes-breakwater-harbor",
    state: "delaware", city: "LEWES (BREAKWATER HARBOR), DE", region: "Delaware Ocean Shore",
    lat: 38.78283333333334, lon: -75.11927777777778, latDisplay: "38.78°N", lonDisplay: "75.12°W",
    sunLat: 38.78, sunMeridian: 75, sunLon: 75.12, utcOffset: 1,
    sunriseRef: 6.67, sunsetRef: 20.15,
    tidalType: 'semidiurnal', meanRange: 4.2, waterTempDefault: '57°F',
    nearby: [
    { name: "HARBOR OF REFUGE LIGHT", lat: 38.8, lon: -75.0833, slug: "harbor-of-refuge-light" },
    { name: "Rehoboth Beach", lat: 38.72, lon: -75.0833, slug: "rehoboth-beach" },
    { name: "WHITE OAK POINT, REHOBOTH BAY", lat: 38.69, lon: -75.0783, slug: "white-oak-point-rehoboth-bay" },
    { name: "Indian River Inlet (Coast Guard Station)", lat: 38.61, lon: -75.07, slug: "indian-river-inlet-coast-guard-station" }
    ],
    species: [
    { name: 'Striped Bass',       icon: '🎣', color: '#38bdf8', bait: 'Bunker (menhaden), live eel, swim shad', regulation: '28″ min · check season', when: 'Moving tide — rips, inlets, structure' },
    { name: 'Summer Flounder',    icon: '🐡', color: '#34d399', bait: 'Gulp! shrimp, squid strip, bucktail jig', regulation: '14″ min · 10/day',      when: 'Incoming tide near channels & drop-offs' },
    { name: 'Bluefish',           icon: '🐟', color: '#60a5fa', bait: 'Metal jig, popper, bunker chunk',        regulation: '10″ min · 10/day',      when: 'Moving tide — surface feeding, inlets' },
    { name: 'Weakfish (Seatrout)',icon: '🐟', color: '#a78bfa', bait: 'Bucktail jig, live shrimp, soft plastic', regulation: '13″ min · 10/day',      when: 'Dawn & dusk — incoming tide on grass beds' },
    { name: 'Tautog (Blackfish)', icon: '🐡', color: '#facc15', bait: 'Green crab, fiddler crab, sand flea',    regulation: '16″ min · varies',       when: 'Slack tide — wrecks, rocks, jetties' },
  ],
  },
  {
    id: "8557863", waterTempId: "8557863",
    name: "Rehoboth Beach", slug: "rehoboth-beach",
    state: "delaware", city: "Rehoboth Beach, DE", region: "Delaware Ocean Shore",
    lat: 38.72, lon: -75.0833, latDisplay: "38.72°N", lonDisplay: "75.08°W",
    sunLat: 38.72, sunMeridian: 75, sunLon: 75.08, utcOffset: 1,
    sunriseRef: 6.68, sunsetRef: 20.15,
    tidalType: 'semidiurnal', meanRange: 4.2, waterTempDefault: '57°F',
    nearby: [
    { name: "WHITE OAK POINT, REHOBOTH BAY", lat: 38.69, lon: -75.0783, slug: "white-oak-point-rehoboth-bay" },
    { name: "LEWES (BREAKWATER HARBOR)", lat: 38.78283333333334, lon: -75.11927777777778, slug: "lewes-breakwater-harbor" },
    { name: "HARBOR OF REFUGE LIGHT", lat: 38.8, lon: -75.0833, slug: "harbor-of-refuge-light" },
    { name: "Indian River Inlet (Coast Guard Station)", lat: 38.61, lon: -75.07, slug: "indian-river-inlet-coast-guard-station" }
    ],
    species: [
    { name: 'Striped Bass',       icon: '🎣', color: '#38bdf8', bait: 'Bunker (menhaden), live eel, swim shad', regulation: '28″ min · check season', when: 'Moving tide — rips, inlets, structure' },
    { name: 'Summer Flounder',    icon: '🐡', color: '#34d399', bait: 'Gulp! shrimp, squid strip, bucktail jig', regulation: '14″ min · 10/day',      when: 'Incoming tide near channels & drop-offs' },
    { name: 'Bluefish',           icon: '🐟', color: '#60a5fa', bait: 'Metal jig, popper, bunker chunk',        regulation: '10″ min · 10/day',      when: 'Moving tide — surface feeding, inlets' },
    { name: 'Weakfish (Seatrout)',icon: '🐟', color: '#a78bfa', bait: 'Bucktail jig, live shrimp, soft plastic', regulation: '13″ min · 10/day',      when: 'Dawn & dusk — incoming tide on grass beds' },
    { name: 'Tautog (Blackfish)', icon: '🐡', color: '#facc15', bait: 'Green crab, fiddler crab, sand flea',    regulation: '16″ min · varies',       when: 'Slack tide — wrecks, rocks, jetties' },
  ],
  },
  {
    id: "8558690", waterTempId: "8558690",
    name: "Indian River Inlet (Coast Guard Station)", slug: "indian-river-inlet-coast-guard-station",
    state: "delaware", city: "Indian River Inlet (Coast Guard Station), DE", region: "Delaware Ocean Shore",
    lat: 38.61, lon: -75.07, latDisplay: "38.61°N", lonDisplay: "75.07°W",
    sunLat: 38.61, sunMeridian: 75, sunLon: 75.07, utcOffset: 1,
    sunriseRef: 6.68, sunsetRef: 20.14,
    tidalType: 'semidiurnal', meanRange: 4.2, waterTempDefault: '57°F',
    nearby: [
    { name: "INDIAN RIVER INLET, TEST GAGE 5", lat: 38.61, lon: -75.07, slug: "indian-river-inlet-test-gage-5" },
    { name: "WHITE OAK POINT, REHOBOTH BAY", lat: 38.69, lon: -75.0783, slug: "white-oak-point-rehoboth-bay" },
    { name: "OAK ORCHARD, INDIAN RIVER", lat: 38.595, lon: -75.1733, slug: "oak-orchard-indian-river" },
    { name: "Rehoboth Beach", lat: 38.72, lon: -75.0833, slug: "rehoboth-beach" }
    ],
    species: [
    { name: 'Striped Bass',       icon: '🎣', color: '#38bdf8', bait: 'Bunker (menhaden), live eel, swim shad', regulation: '28″ min · check season', when: 'Moving tide — rips, inlets, structure' },
    { name: 'Summer Flounder',    icon: '🐡', color: '#34d399', bait: 'Gulp! shrimp, squid strip, bucktail jig', regulation: '14″ min · 10/day',      when: 'Incoming tide near channels & drop-offs' },
    { name: 'Bluefish',           icon: '🐟', color: '#60a5fa', bait: 'Metal jig, popper, bunker chunk',        regulation: '10″ min · 10/day',      when: 'Moving tide — surface feeding, inlets' },
    { name: 'Weakfish (Seatrout)',icon: '🐟', color: '#a78bfa', bait: 'Bucktail jig, live shrimp, soft plastic', regulation: '13″ min · 10/day',      when: 'Dawn & dusk — incoming tide on grass beds' },
    { name: 'Tautog (Blackfish)', icon: '🐡', color: '#facc15', bait: 'Green crab, fiddler crab, sand flea',    regulation: '16″ min · varies',       when: 'Slack tide — wrecks, rocks, jetties' },
  ],
  },
  {
    id: "8558814", waterTempId: "8558814",
    name: "Rosedale Beach, Indian River", slug: "rosedale-beach-indian-river",
    state: "delaware", city: "Rosedale Beach, Indian River, DE", region: "Delaware Bay",
    lat: 38.59149932861328, lon: -75.21160125732422, latDisplay: "38.59°N", lonDisplay: "75.21°W",
    sunLat: 38.59, sunMeridian: 75, sunLon: 75.21, utcOffset: 1,
    sunriseRef: 6.68, sunsetRef: 20.14,
    tidalType: 'semidiurnal', meanRange: 4.2, waterTempDefault: '57°F',
    nearby: [
    { name: "OAK ORCHARD, INDIAN RIVER", lat: 38.595, lon: -75.1733, slug: "oak-orchard-indian-river" },
    { name: "MILLSBORO BRIDGE, INDIAN RIVER", lat: 38.595, lon: -75.2917, slug: "millsboro-bridge-indian-river" },
    { name: "Indian River Inlet (Coast Guard Station)", lat: 38.61, lon: -75.07, slug: "indian-river-inlet-coast-guard-station" },
    { name: "INDIAN RIVER INLET, TEST GAGE 5", lat: 38.61, lon: -75.07, slug: "indian-river-inlet-test-gage-5" }
    ],
    species: [
    { name: 'Striped Bass',       icon: '🎣', color: '#38bdf8', bait: 'Bunker (menhaden), live eel, swim shad', regulation: '28″ min · check season', when: 'Moving tide — rips, inlets, structure' },
    { name: 'Summer Flounder',    icon: '🐡', color: '#34d399', bait: 'Gulp! shrimp, squid strip, bucktail jig', regulation: '14″ min · 10/day',      when: 'Incoming tide near channels & drop-offs' },
    { name: 'Bluefish',           icon: '🐟', color: '#60a5fa', bait: 'Metal jig, popper, bunker chunk',        regulation: '10″ min · 10/day',      when: 'Moving tide — surface feeding, inlets' },
    { name: 'Weakfish (Seatrout)',icon: '🐟', color: '#a78bfa', bait: 'Bucktail jig, live shrimp, soft plastic', regulation: '13″ min · 10/day',      when: 'Dawn & dusk — incoming tide on grass beds' },
    { name: 'Tautog (Blackfish)', icon: '🐡', color: '#facc15', bait: 'Green crab, fiddler crab, sand flea',    regulation: '16″ min · varies',       when: 'Slack tide — wrecks, rocks, jetties' },
  ],
  },
  {
    id: "8559957", waterTempId: "8559957",
    name: "Little Assawoman Bay", slug: "little-assawoman-bay",
    state: "delaware", city: "Little Assawoman Bay, DE", region: "Delaware Ocean Shore",
    lat: 38.45500183105469, lon: -75.05829620361328, latDisplay: "38.46°N", lonDisplay: "75.06°W",
    sunLat: 38.46, sunMeridian: 75, sunLon: 75.06, utcOffset: 1,
    sunriseRef: 6.69, sunsetRef: 20.14,
    tidalType: 'semidiurnal', meanRange: 4.2, waterTempDefault: '57°F',
    nearby: [
    { name: "LITTLE ASSAWOMAN, FENWICK ISL.", lat: 38.4633, lon: -75.055, slug: "little-assawoman-fenwick-isl" },
    { name: "Indian River Inlet (Coast Guard Station)", lat: 38.61, lon: -75.07, slug: "indian-river-inlet-coast-guard-station" },
    { name: "INDIAN RIVER INLET, TEST GAGE 5", lat: 38.61, lon: -75.07, slug: "indian-river-inlet-test-gage-5" },
    { name: "OAK ORCHARD, INDIAN RIVER", lat: 38.595, lon: -75.1733, slug: "oak-orchard-indian-river" }
    ],
    species: [
    { name: 'Striped Bass',       icon: '🎣', color: '#38bdf8', bait: 'Bunker (menhaden), live eel, swim shad', regulation: '28″ min · check season', when: 'Moving tide — rips, inlets, structure' },
    { name: 'Summer Flounder',    icon: '🐡', color: '#34d399', bait: 'Gulp! shrimp, squid strip, bucktail jig', regulation: '14″ min · 10/day',      when: 'Incoming tide near channels & drop-offs' },
    { name: 'Bluefish',           icon: '🐟', color: '#60a5fa', bait: 'Metal jig, popper, bunker chunk',        regulation: '10″ min · 10/day',      when: 'Moving tide — surface feeding, inlets' },
    { name: 'Weakfish (Seatrout)',icon: '🐟', color: '#a78bfa', bait: 'Bucktail jig, live shrimp, soft plastic', regulation: '13″ min · 10/day',      when: 'Dawn & dusk — incoming tide on grass beds' },
    { name: 'Tautog (Blackfish)', icon: '🐡', color: '#facc15', bait: 'Green crab, fiddler crab, sand flea',    regulation: '16″ min · varies',       when: 'Slack tide — wrecks, rocks, jetties' },
  ],
  },
  {
    id: "8554501", waterTempId: "8554501",
    name: "Elbow of Cross Ledge Light", slug: "elbow-of-cross-ledge-light",
    state: "delaware", city: "Elbow of Cross Ledge Light, DE", region: "Delaware Bay",
    lat: 39.1667, lon: -75.2667, latDisplay: "39.17°N", lonDisplay: "75.27°W",
    sunLat: 39.17, sunMeridian: 75, sunLon: 75.27, utcOffset: 1,
    sunriseRef: 6.65, sunsetRef: 20.17,
    tidalType: 'semidiurnal', meanRange: 4.2, waterTempDefault: '57°F',
    nearby: [
    { name: "Mahon River entrance", lat: 39.185, lon: -75.4, slug: "mahon-river-entrance" },
    { name: "FOURTEEN FOOT BANK LIGHT", lat: 39.0483, lon: -75.1833, slug: "fourteen-foot-bank-light" },
    { name: "Murderkill River entrance", lat: 39.0583, lon: -75.3967, slug: "murderkill-river-entrance" },
    { name: "Leipsic, Leipsic River", lat: 39.245, lon: -75.5183, slug: "leipsic-leipsic-river" }
    ],
    species: [
    { name: 'Striped Bass',       icon: '🎣', color: '#38bdf8', bait: 'Bunker (menhaden), live eel, swim shad', regulation: '28″ min · check season', when: 'Moving tide — rips, inlets, structure' },
    { name: 'Summer Flounder',    icon: '🐡', color: '#34d399', bait: 'Gulp! shrimp, squid strip, bucktail jig', regulation: '14″ min · 10/day',      when: 'Incoming tide near channels & drop-offs' },
    { name: 'Bluefish',           icon: '🐟', color: '#60a5fa', bait: 'Metal jig, popper, bunker chunk',        regulation: '10″ min · 10/day',      when: 'Moving tide — surface feeding, inlets' },
    { name: 'Weakfish (Seatrout)',icon: '🐟', color: '#a78bfa', bait: 'Bucktail jig, live shrimp, soft plastic', regulation: '13″ min · 10/day',      when: 'Dawn & dusk — incoming tide on grass beds' },
    { name: 'Tautog (Blackfish)', icon: '🐡', color: '#facc15', bait: 'Green crab, fiddler crab, sand flea',    regulation: '16″ min · varies',       when: 'Slack tide — wrecks, rocks, jetties' },
  ],
  },
  {
    id: "8555461", waterTempId: "8555461",
    name: "FOURTEEN FOOT BANK LIGHT", slug: "fourteen-foot-bank-light",
    state: "delaware", city: "FOURTEEN FOOT BANK LIGHT, DE", region: "Delaware Ocean Shore",
    lat: 39.0483, lon: -75.1833, latDisplay: "39.05°N", lonDisplay: "75.18°W",
    sunLat: 39.05, sunMeridian: 75, sunLon: 75.18, utcOffset: 1,
    sunriseRef: 6.66, sunsetRef: 20.16,
    tidalType: 'semidiurnal', meanRange: 4.2, waterTempDefault: '57°F',
    nearby: [
    { name: "Brandywine Shoal Light", lat: 38.98666666666667, lon: -75.11333333333333, slug: "brandywine-shoal-light" },
    { name: "Elbow of Cross Ledge Light", lat: 39.1667, lon: -75.2667, slug: "elbow-of-cross-ledge-light" },
    { name: "Mispillion River entrance", lat: 38.945, lon: -75.3133, slug: "mispillion-river-entrance" },
    { name: "Murderkill River entrance", lat: 39.0583, lon: -75.3967, slug: "murderkill-river-entrance" }
    ],
    species: [
    { name: 'Striped Bass',       icon: '🎣', color: '#38bdf8', bait: 'Bunker (menhaden), live eel, swim shad', regulation: '28″ min · check season', when: 'Moving tide — rips, inlets, structure' },
    { name: 'Summer Flounder',    icon: '🐡', color: '#34d399', bait: 'Gulp! shrimp, squid strip, bucktail jig', regulation: '14″ min · 10/day',      when: 'Incoming tide near channels & drop-offs' },
    { name: 'Bluefish',           icon: '🐟', color: '#60a5fa', bait: 'Metal jig, popper, bunker chunk',        regulation: '10″ min · 10/day',      when: 'Moving tide — surface feeding, inlets' },
    { name: 'Weakfish (Seatrout)',icon: '🐟', color: '#a78bfa', bait: 'Bucktail jig, live shrimp, soft plastic', regulation: '13″ min · 10/day',      when: 'Dawn & dusk — incoming tide on grass beds' },
    { name: 'Tautog (Blackfish)', icon: '🐡', color: '#facc15', bait: 'Green crab, fiddler crab, sand flea',    regulation: '16″ min · varies',       when: 'Slack tide — wrecks, rocks, jetties' },
  ],
  },
  {
    id: "8557125", waterTempId: "8557125",
    name: "HARBOR OF REFUGE LIGHT", slug: "harbor-of-refuge-light",
    state: "delaware", city: "HARBOR OF REFUGE LIGHT, DE", region: "Delaware Ocean Shore",
    lat: 38.8, lon: -75.0833, latDisplay: "38.80°N", lonDisplay: "75.08°W",
    sunLat: 38.8, sunMeridian: 75, sunLon: 75.08, utcOffset: 1,
    sunriseRef: 6.67, sunsetRef: 20.15,
    tidalType: 'semidiurnal', meanRange: 4.2, waterTempDefault: '57°F',
    nearby: [
    { name: "LEWES (BREAKWATER HARBOR)", lat: 38.78283333333334, lon: -75.11927777777778, slug: "lewes-breakwater-harbor" },
    { name: "Rehoboth Beach", lat: 38.72, lon: -75.0833, slug: "rehoboth-beach" },
    { name: "WHITE OAK POINT, REHOBOTH BAY", lat: 38.69, lon: -75.0783, slug: "white-oak-point-rehoboth-bay" },
    { name: "Brandywine Shoal Light", lat: 38.98666666666667, lon: -75.11333333333333, slug: "brandywine-shoal-light" }
    ],
    species: [
    { name: 'Striped Bass',       icon: '🎣', color: '#38bdf8', bait: 'Bunker (menhaden), live eel, swim shad', regulation: '28″ min · check season', when: 'Moving tide — rips, inlets, structure' },
    { name: 'Summer Flounder',    icon: '🐡', color: '#34d399', bait: 'Gulp! shrimp, squid strip, bucktail jig', regulation: '14″ min · 10/day',      when: 'Incoming tide near channels & drop-offs' },
    { name: 'Bluefish',           icon: '🐟', color: '#60a5fa', bait: 'Metal jig, popper, bunker chunk',        regulation: '10″ min · 10/day',      when: 'Moving tide — surface feeding, inlets' },
    { name: 'Weakfish (Seatrout)',icon: '🐟', color: '#a78bfa', bait: 'Bucktail jig, live shrimp, soft plastic', regulation: '13″ min · 10/day',      when: 'Dawn & dusk — incoming tide on grass beds' },
    { name: 'Tautog (Blackfish)', icon: '🐡', color: '#facc15', bait: 'Green crab, fiddler crab, sand flea',    regulation: '16″ min · varies',       when: 'Slack tide — wrecks, rocks, jetties' },
  ],
  },
  {
    id: "8558101", waterTempId: "8558101",
    name: "WHITE OAK POINT, REHOBOTH BAY", slug: "white-oak-point-rehoboth-bay",
    state: "delaware", city: "WHITE OAK POINT, REHOBOTH BAY, DE", region: "Delaware Ocean Shore",
    lat: 38.69, lon: -75.0783, latDisplay: "38.69°N", lonDisplay: "75.08°W",
    sunLat: 38.69, sunMeridian: 75, sunLon: 75.08, utcOffset: 1,
    sunriseRef: 6.68, sunsetRef: 20.15,
    tidalType: 'semidiurnal', meanRange: 4.2, waterTempDefault: '57°F',
    nearby: [
    { name: "Rehoboth Beach", lat: 38.72, lon: -75.0833, slug: "rehoboth-beach" },
    { name: "Indian River Inlet (Coast Guard Station)", lat: 38.61, lon: -75.07, slug: "indian-river-inlet-coast-guard-station" },
    { name: "INDIAN RIVER INLET, TEST GAGE 5", lat: 38.61, lon: -75.07, slug: "indian-river-inlet-test-gage-5" },
    { name: "LEWES (BREAKWATER HARBOR)", lat: 38.78283333333334, lon: -75.11927777777778, slug: "lewes-breakwater-harbor" }
    ],
    species: [
    { name: 'Striped Bass',       icon: '🎣', color: '#38bdf8', bait: 'Bunker (menhaden), live eel, swim shad', regulation: '28″ min · check season', when: 'Moving tide — rips, inlets, structure' },
    { name: 'Summer Flounder',    icon: '🐡', color: '#34d399', bait: 'Gulp! shrimp, squid strip, bucktail jig', regulation: '14″ min · 10/day',      when: 'Incoming tide near channels & drop-offs' },
    { name: 'Bluefish',           icon: '🐟', color: '#60a5fa', bait: 'Metal jig, popper, bunker chunk',        regulation: '10″ min · 10/day',      when: 'Moving tide — surface feeding, inlets' },
    { name: 'Weakfish (Seatrout)',icon: '🐟', color: '#a78bfa', bait: 'Bucktail jig, live shrimp, soft plastic', regulation: '13″ min · 10/day',      when: 'Dawn & dusk — incoming tide on grass beds' },
    { name: 'Tautog (Blackfish)', icon: '🐡', color: '#facc15', bait: 'Green crab, fiddler crab, sand flea',    regulation: '16″ min · varies',       when: 'Slack tide — wrecks, rocks, jetties' },
  ],
  },
  {
    id: "8558695", waterTempId: "8558695",
    name: "INDIAN RIVER INLET, TEST GAGE 5", slug: "indian-river-inlet-test-gage-5",
    state: "delaware", city: "INDIAN RIVER INLET, TEST GAGE 5, DE", region: "Delaware Ocean Shore",
    lat: 38.61, lon: -75.07, latDisplay: "38.61°N", lonDisplay: "75.07°W",
    sunLat: 38.61, sunMeridian: 75, sunLon: 75.07, utcOffset: 1,
    sunriseRef: 6.68, sunsetRef: 20.14,
    tidalType: 'semidiurnal', meanRange: 4.2, waterTempDefault: '57°F',
    nearby: [
    { name: "Indian River Inlet (Coast Guard Station)", lat: 38.61, lon: -75.07, slug: "indian-river-inlet-coast-guard-station" },
    { name: "WHITE OAK POINT, REHOBOTH BAY", lat: 38.69, lon: -75.0783, slug: "white-oak-point-rehoboth-bay" },
    { name: "OAK ORCHARD, INDIAN RIVER", lat: 38.595, lon: -75.1733, slug: "oak-orchard-indian-river" },
    { name: "Rehoboth Beach", lat: 38.72, lon: -75.0833, slug: "rehoboth-beach" }
    ],
    species: [
    { name: 'Striped Bass',       icon: '🎣', color: '#38bdf8', bait: 'Bunker (menhaden), live eel, swim shad', regulation: '28″ min · check season', when: 'Moving tide — rips, inlets, structure' },
    { name: 'Summer Flounder',    icon: '🐡', color: '#34d399', bait: 'Gulp! shrimp, squid strip, bucktail jig', regulation: '14″ min · 10/day',      when: 'Incoming tide near channels & drop-offs' },
    { name: 'Bluefish',           icon: '🐟', color: '#60a5fa', bait: 'Metal jig, popper, bunker chunk',        regulation: '10″ min · 10/day',      when: 'Moving tide — surface feeding, inlets' },
    { name: 'Weakfish (Seatrout)',icon: '🐟', color: '#a78bfa', bait: 'Bucktail jig, live shrimp, soft plastic', regulation: '13″ min · 10/day',      when: 'Dawn & dusk — incoming tide on grass beds' },
    { name: 'Tautog (Blackfish)', icon: '🐡', color: '#facc15', bait: 'Green crab, fiddler crab, sand flea',    regulation: '16″ min · varies',       when: 'Slack tide — wrecks, rocks, jetties' },
  ],
  },
  {
    id: "8558788", waterTempId: "8558788",
    name: "MILLSBORO BRIDGE, INDIAN RIVER", slug: "millsboro-bridge-indian-river",
    state: "delaware", city: "MILLSBORO BRIDGE, INDIAN RIVER, DE", region: "Delaware Bay",
    lat: 38.595, lon: -75.2917, latDisplay: "38.59°N", lonDisplay: "75.29°W",
    sunLat: 38.6, sunMeridian: 75, sunLon: 75.29, utcOffset: 1,
    sunriseRef: 6.68, sunsetRef: 20.14,
    tidalType: 'semidiurnal', meanRange: 4.2, waterTempDefault: '57°F',
    nearby: [
    { name: "Rosedale Beach, Indian River", lat: 38.59149932861328, lon: -75.21160125732422, slug: "rosedale-beach-indian-river" },
    { name: "OAK ORCHARD, INDIAN RIVER", lat: 38.595, lon: -75.1733, slug: "oak-orchard-indian-river" },
    { name: "Indian River Inlet (Coast Guard Station)", lat: 38.61, lon: -75.07, slug: "indian-river-inlet-coast-guard-station" },
    { name: "INDIAN RIVER INLET, TEST GAGE 5", lat: 38.61, lon: -75.07, slug: "indian-river-inlet-test-gage-5" }
    ],
    species: [
    { name: 'Striped Bass',       icon: '🎣', color: '#38bdf8', bait: 'Bunker (menhaden), live eel, swim shad', regulation: '28″ min · check season', when: 'Moving tide — rips, inlets, structure' },
    { name: 'Summer Flounder',    icon: '🐡', color: '#34d399', bait: 'Gulp! shrimp, squid strip, bucktail jig', regulation: '14″ min · 10/day',      when: 'Incoming tide near channels & drop-offs' },
    { name: 'Bluefish',           icon: '🐟', color: '#60a5fa', bait: 'Metal jig, popper, bunker chunk',        regulation: '10″ min · 10/day',      when: 'Moving tide — surface feeding, inlets' },
    { name: 'Weakfish (Seatrout)',icon: '🐟', color: '#a78bfa', bait: 'Bucktail jig, live shrimp, soft plastic', regulation: '13″ min · 10/day',      when: 'Dawn & dusk — incoming tide on grass beds' },
    { name: 'Tautog (Blackfish)', icon: '🐡', color: '#facc15', bait: 'Green crab, fiddler crab, sand flea',    regulation: '16″ min · varies',       when: 'Slack tide — wrecks, rocks, jetties' },
  ],
  },
  {
    id: "8558789", waterTempId: "8558789",
    name: "OAK ORCHARD, INDIAN RIVER", slug: "oak-orchard-indian-river",
    state: "delaware", city: "OAK ORCHARD, INDIAN RIVER, DE", region: "Delaware Ocean Shore",
    lat: 38.595, lon: -75.1733, latDisplay: "38.59°N", lonDisplay: "75.17°W",
    sunLat: 38.6, sunMeridian: 75, sunLon: 75.17, utcOffset: 1,
    sunriseRef: 6.68, sunsetRef: 20.14,
    tidalType: 'semidiurnal', meanRange: 4.2, waterTempDefault: '57°F',
    nearby: [
    { name: "Rosedale Beach, Indian River", lat: 38.59149932861328, lon: -75.21160125732422, slug: "rosedale-beach-indian-river" },
    { name: "Indian River Inlet (Coast Guard Station)", lat: 38.61, lon: -75.07, slug: "indian-river-inlet-coast-guard-station" },
    { name: "INDIAN RIVER INLET, TEST GAGE 5", lat: 38.61, lon: -75.07, slug: "indian-river-inlet-test-gage-5" },
    { name: "MILLSBORO BRIDGE, INDIAN RIVER", lat: 38.595, lon: -75.2917, slug: "millsboro-bridge-indian-river" }
    ],
    species: [
    { name: 'Striped Bass',       icon: '🎣', color: '#38bdf8', bait: 'Bunker (menhaden), live eel, swim shad', regulation: '28″ min · check season', when: 'Moving tide — rips, inlets, structure' },
    { name: 'Summer Flounder',    icon: '🐡', color: '#34d399', bait: 'Gulp! shrimp, squid strip, bucktail jig', regulation: '14″ min · 10/day',      when: 'Incoming tide near channels & drop-offs' },
    { name: 'Bluefish',           icon: '🐟', color: '#60a5fa', bait: 'Metal jig, popper, bunker chunk',        regulation: '10″ min · 10/day',      when: 'Moving tide — surface feeding, inlets' },
    { name: 'Weakfish (Seatrout)',icon: '🐟', color: '#a78bfa', bait: 'Bucktail jig, live shrimp, soft plastic', regulation: '13″ min · 10/day',      when: 'Dawn & dusk — incoming tide on grass beds' },
    { name: 'Tautog (Blackfish)', icon: '🐡', color: '#facc15', bait: 'Green crab, fiddler crab, sand flea',    regulation: '16″ min · varies',       when: 'Slack tide — wrecks, rocks, jetties' },
  ],
  },
  {
    id: "8559885", waterTempId: "8559885",
    name: "LITTLE ASSAWOMAN, FENWICK ISL.", slug: "little-assawoman-fenwick-isl",
    state: "delaware", city: "LITTLE ASSAWOMAN, FENWICK ISL., DE", region: "Delaware Ocean Shore",
    lat: 38.4633, lon: -75.055, latDisplay: "38.46°N", lonDisplay: "75.06°W",
    sunLat: 38.46, sunMeridian: 75, sunLon: 75.06, utcOffset: 1,
    sunriseRef: 6.69, sunsetRef: 20.14,
    tidalType: 'semidiurnal', meanRange: 4.2, waterTempDefault: '57°F',
    nearby: [
    { name: "Little Assawoman Bay", lat: 38.45500183105469, lon: -75.05829620361328, slug: "little-assawoman-bay" },
    { name: "Indian River Inlet (Coast Guard Station)", lat: 38.61, lon: -75.07, slug: "indian-river-inlet-coast-guard-station" },
    { name: "INDIAN RIVER INLET, TEST GAGE 5", lat: 38.61, lon: -75.07, slug: "indian-river-inlet-test-gage-5" },
    { name: "OAK ORCHARD, INDIAN RIVER", lat: 38.595, lon: -75.1733, slug: "oak-orchard-indian-river" }
    ],
    species: [
    { name: 'Striped Bass',       icon: '🎣', color: '#38bdf8', bait: 'Bunker (menhaden), live eel, swim shad', regulation: '28″ min · check season', when: 'Moving tide — rips, inlets, structure' },
    { name: 'Summer Flounder',    icon: '🐡', color: '#34d399', bait: 'Gulp! shrimp, squid strip, bucktail jig', regulation: '14″ min · 10/day',      when: 'Incoming tide near channels & drop-offs' },
    { name: 'Bluefish',           icon: '🐟', color: '#60a5fa', bait: 'Metal jig, popper, bunker chunk',        regulation: '10″ min · 10/day',      when: 'Moving tide — surface feeding, inlets' },
    { name: 'Weakfish (Seatrout)',icon: '🐟', color: '#a78bfa', bait: 'Bucktail jig, live shrimp, soft plastic', regulation: '13″ min · 10/day',      when: 'Dawn & dusk — incoming tide on grass beds' },
    { name: 'Tautog (Blackfish)', icon: '🐡', color: '#facc15', bait: 'Green crab, fiddler crab, sand flea',    regulation: '16″ min · varies',       when: 'Slack tide — wrecks, rocks, jetties' },
  ],
  },
]

export function getStationBySlug(slug: string): StationConfig | undefined {
  return DELAWARE_STATIONS.find(s => s.slug === slug)
}
export function getAllSlugs(): string[] {
  return DELAWARE_STATIONS.map(s => s.slug)
}
