// AUTO-GENERATED — do not edit by hand.
// Source: NOAA CO-OPS tide prediction stations, Hawaii
// Regenerate: node apps/web/scripts/generate-all-states.mjs

import type { StationConfig, NearbyStation, Species } from './florida-stations'
export type { StationConfig, NearbyStation, Species }

export const HAWAII_STATIONS: StationConfig[] = [
  {
    id: "1610367", waterTempId: "1610367",
    name: "Nonopapa, Niihau Island", slug: "nonopapa-niihau-island",
    state: "hawaii", city: "Nonopapa, Niihau Island, HI", region: "Kauai / Niihau",
    lat: 21.87, lon: -160.235, latDisplay: "21.87°N", lonDisplay: "160.24°W",
    sunLat: 21.87, sunMeridian: 150, sunLon: 160.24, utcOffset: -4,
    sunriseRef: 6.69, sunsetRef: 18.27,
    tidalType: 'mixed', meanRange: 1.5, waterTempDefault: '78°F',
    nearby: [
    { name: "Waimea Bay", lat: 21.9567, lon: -159.673, slug: "waimea-bay" },
    { name: "Port Allen, Hanapepe Bay", lat: 21.9033, lon: -159.592, slug: "port-allen-hanapepe-bay" },
    { name: "Hanalei Bay", lat: 22.215, lon: -159.502, slug: "hanalei-bay" },
    { name: "NAWILIWILI", lat: 21.9544, lon: -159.3561, slug: "nawiliwili" }
    ],
    species: [
    { name: 'Mahi-Mahi (Dorado)', icon: '🐟', color: '#60a5fa', bait: 'Trolling lure, flying fish, squid',    regulation: 'No minimum · no limit',  when: 'Open ocean — major solunar periods' },
    { name: 'Yellowfin Tuna (Ahi)',icon: '🎣', color: '#f97316', bait: 'Popper, jig, trolling lure',           regulation: 'No minimum · no limit',  when: 'Blue water — dawn & major solunar' },
    { name: 'Blue Marlin',        icon: '🎣', color: '#38bdf8', bait: 'Trolling lure, live bait, circle hook', regulation: 'Catch & release encouraged', when: 'Deep water — major solunar midday' },
    { name: "Bonefish (O'io)",   icon: '🐡', color: '#34d399', bait: 'Live shrimp, crab fly, bonefish jig',  regulation: 'Bag limit: 10/day',      when: 'Incoming tide on shallow flats — dawn' },
    { name: 'Ulua (Giant Trevally)',icon: '🐡', color: '#a78bfa', bait: 'Live bait, large popper, jig',        regulation: '10″ min · 1 per species/day', when: 'Moving tide — rocky shores & channel edges' },
  ],
  },
  {
    id: "1611347", waterTempId: "1611347",
    name: "Port Allen, Hanapepe Bay", slug: "port-allen-hanapepe-bay",
    state: "hawaii", city: "Port Allen, Hanapepe Bay, HI", region: "Kauai / Niihau",
    lat: 21.9033, lon: -159.592, latDisplay: "21.90°N", lonDisplay: "159.59°W",
    sunLat: 21.9, sunMeridian: 150, sunLon: 159.59, utcOffset: -4,
    sunriseRef: 6.69, sunsetRef: 18.28,
    tidalType: 'mixed', meanRange: 1.5, waterTempDefault: '78°F',
    nearby: [
    { name: "Waimea Bay", lat: 21.9567, lon: -159.673, slug: "waimea-bay" },
    { name: "NAWILIWILI", lat: 21.9544, lon: -159.3561, slug: "nawiliwili" },
    { name: "Hanamaulu Bay", lat: 21.995, lon: -159.335, slug: "hanamaulu-bay" },
    { name: "Hanalei Bay", lat: 22.215, lon: -159.502, slug: "hanalei-bay" }
    ],
    species: [
    { name: 'Mahi-Mahi (Dorado)', icon: '🐟', color: '#60a5fa', bait: 'Trolling lure, flying fish, squid',    regulation: 'No minimum · no limit',  when: 'Open ocean — major solunar periods' },
    { name: 'Yellowfin Tuna (Ahi)',icon: '🎣', color: '#f97316', bait: 'Popper, jig, trolling lure',           regulation: 'No minimum · no limit',  when: 'Blue water — dawn & major solunar' },
    { name: 'Blue Marlin',        icon: '🎣', color: '#38bdf8', bait: 'Trolling lure, live bait, circle hook', regulation: 'Catch & release encouraged', when: 'Deep water — major solunar midday' },
    { name: "Bonefish (O'io)",   icon: '🐡', color: '#34d399', bait: 'Live shrimp, crab fly, bonefish jig',  regulation: 'Bag limit: 10/day',      when: 'Incoming tide on shallow flats — dawn' },
    { name: 'Ulua (Giant Trevally)',icon: '🐡', color: '#a78bfa', bait: 'Live bait, large popper, jig',        regulation: '10″ min · 1 per species/day', when: 'Moving tide — rocky shores & channel edges' },
  ],
  },
  {
    id: "1611400", waterTempId: "1611400",
    name: "NAWILIWILI", slug: "nawiliwili",
    state: "hawaii", city: "NAWILIWILI, HI", region: "Kauai / Niihau",
    lat: 21.9544, lon: -159.3561, latDisplay: "21.95°N", lonDisplay: "159.36°W",
    sunLat: 21.95, sunMeridian: 150, sunLon: 159.36, utcOffset: -4,
    sunriseRef: 6.68, sunsetRef: 18.28,
    tidalType: 'mixed', meanRange: 1.5, waterTempDefault: '78°F',
    nearby: [
    { name: "Hanamaulu Bay", lat: 21.995, lon: -159.335, slug: "hanamaulu-bay" },
    { name: "Port Allen, Hanapepe Bay", lat: 21.9033, lon: -159.592, slug: "port-allen-hanapepe-bay" },
    { name: "Hanalei Bay", lat: 22.215, lon: -159.502, slug: "hanalei-bay" },
    { name: "Waimea Bay", lat: 21.9567, lon: -159.673, slug: "waimea-bay" }
    ],
    species: [
    { name: 'Mahi-Mahi (Dorado)', icon: '🐟', color: '#60a5fa', bait: 'Trolling lure, flying fish, squid',    regulation: 'No minimum · no limit',  when: 'Open ocean — major solunar periods' },
    { name: 'Yellowfin Tuna (Ahi)',icon: '🎣', color: '#f97316', bait: 'Popper, jig, trolling lure',           regulation: 'No minimum · no limit',  when: 'Blue water — dawn & major solunar' },
    { name: 'Blue Marlin',        icon: '🎣', color: '#38bdf8', bait: 'Trolling lure, live bait, circle hook', regulation: 'Catch & release encouraged', when: 'Deep water — major solunar midday' },
    { name: "Bonefish (O'io)",   icon: '🐡', color: '#34d399', bait: 'Live shrimp, crab fly, bonefish jig',  regulation: 'Bag limit: 10/day',      when: 'Incoming tide on shallow flats — dawn' },
    { name: 'Ulua (Giant Trevally)',icon: '🐡', color: '#a78bfa', bait: 'Live bait, large popper, jig',        regulation: '10″ min · 1 per species/day', when: 'Moving tide — rocky shores & channel edges' },
  ],
  },
  {
    id: "1611401", waterTempId: "1611401",
    name: "Waimea Bay", slug: "waimea-bay",
    state: "hawaii", city: "Waimea Bay, HI", region: "Kauai / Niihau",
    lat: 21.9567, lon: -159.673, latDisplay: "21.96°N", lonDisplay: "159.67°W",
    sunLat: 21.96, sunMeridian: 150, sunLon: 159.67, utcOffset: -4,
    sunriseRef: 6.68, sunsetRef: 18.28,
    tidalType: 'mixed', meanRange: 1.5, waterTempDefault: '78°F',
    nearby: [
    { name: "Port Allen, Hanapepe Bay", lat: 21.9033, lon: -159.592, slug: "port-allen-hanapepe-bay" },
    { name: "NAWILIWILI", lat: 21.9544, lon: -159.3561, slug: "nawiliwili" },
    { name: "Hanalei Bay", lat: 22.215, lon: -159.502, slug: "hanalei-bay" },
    { name: "Hanamaulu Bay", lat: 21.995, lon: -159.335, slug: "hanamaulu-bay" }
    ],
    species: [
    { name: 'Mahi-Mahi (Dorado)', icon: '🐟', color: '#60a5fa', bait: 'Trolling lure, flying fish, squid',    regulation: 'No minimum · no limit',  when: 'Open ocean — major solunar periods' },
    { name: 'Yellowfin Tuna (Ahi)',icon: '🎣', color: '#f97316', bait: 'Popper, jig, trolling lure',           regulation: 'No minimum · no limit',  when: 'Blue water — dawn & major solunar' },
    { name: 'Blue Marlin',        icon: '🎣', color: '#38bdf8', bait: 'Trolling lure, live bait, circle hook', regulation: 'Catch & release encouraged', when: 'Deep water — major solunar midday' },
    { name: "Bonefish (O'io)",   icon: '🐡', color: '#34d399', bait: 'Live shrimp, crab fly, bonefish jig',  regulation: 'Bag limit: 10/day',      when: 'Incoming tide on shallow flats — dawn' },
    { name: 'Ulua (Giant Trevally)',icon: '🐡', color: '#a78bfa', bait: 'Live bait, large popper, jig',        regulation: '10″ min · 1 per species/day', when: 'Moving tide — rocky shores & channel edges' },
  ],
  },
  {
    id: "1611443", waterTempId: "1611443",
    name: "Hanamaulu Bay", slug: "hanamaulu-bay",
    state: "hawaii", city: "Hanamaulu Bay, HI", region: "Kauai / Niihau",
    lat: 21.995, lon: -159.335, latDisplay: "22.00°N", lonDisplay: "159.34°W",
    sunLat: 22, sunMeridian: 150, sunLon: 159.34, utcOffset: -4,
    sunriseRef: 6.68, sunsetRef: 18.28,
    tidalType: 'mixed', meanRange: 1.5, waterTempDefault: '78°F',
    nearby: [
    { name: "NAWILIWILI", lat: 21.9544, lon: -159.3561, slug: "nawiliwili" },
    { name: "Port Allen, Hanapepe Bay", lat: 21.9033, lon: -159.592, slug: "port-allen-hanapepe-bay" },
    { name: "Hanalei Bay", lat: 22.215, lon: -159.502, slug: "hanalei-bay" },
    { name: "Waimea Bay", lat: 21.9567, lon: -159.673, slug: "waimea-bay" }
    ],
    species: [
    { name: 'Mahi-Mahi (Dorado)', icon: '🐟', color: '#60a5fa', bait: 'Trolling lure, flying fish, squid',    regulation: 'No minimum · no limit',  when: 'Open ocean — major solunar periods' },
    { name: 'Yellowfin Tuna (Ahi)',icon: '🎣', color: '#f97316', bait: 'Popper, jig, trolling lure',           regulation: 'No minimum · no limit',  when: 'Blue water — dawn & major solunar' },
    { name: 'Blue Marlin',        icon: '🎣', color: '#38bdf8', bait: 'Trolling lure, live bait, circle hook', regulation: 'Catch & release encouraged', when: 'Deep water — major solunar midday' },
    { name: "Bonefish (O'io)",   icon: '🐡', color: '#34d399', bait: 'Live shrimp, crab fly, bonefish jig',  regulation: 'Bag limit: 10/day',      when: 'Incoming tide on shallow flats — dawn' },
    { name: 'Ulua (Giant Trevally)',icon: '🐡', color: '#a78bfa', bait: 'Live bait, large popper, jig',        regulation: '10″ min · 1 per species/day', when: 'Moving tide — rocky shores & channel edges' },
  ],
  },
  {
    id: "1611683", waterTempId: "1611683",
    name: "Hanalei Bay", slug: "hanalei-bay",
    state: "hawaii", city: "Hanalei Bay, HI", region: "Kauai / Niihau",
    lat: 22.215, lon: -159.502, latDisplay: "22.21°N", lonDisplay: "159.50°W",
    sunLat: 22.22, sunMeridian: 150, sunLon: 159.5, utcOffset: -4,
    sunriseRef: 6.67, sunsetRef: 18.29,
    tidalType: 'mixed', meanRange: 1.5, waterTempDefault: '78°F',
    nearby: [
    { name: "Hanamaulu Bay", lat: 21.995, lon: -159.335, slug: "hanamaulu-bay" },
    { name: "NAWILIWILI", lat: 21.9544, lon: -159.3561, slug: "nawiliwili" },
    { name: "Waimea Bay", lat: 21.9567, lon: -159.673, slug: "waimea-bay" },
    { name: "Port Allen, Hanapepe Bay", lat: 21.9033, lon: -159.592, slug: "port-allen-hanapepe-bay" }
    ],
    species: [
    { name: 'Mahi-Mahi (Dorado)', icon: '🐟', color: '#60a5fa', bait: 'Trolling lure, flying fish, squid',    regulation: 'No minimum · no limit',  when: 'Open ocean — major solunar periods' },
    { name: 'Yellowfin Tuna (Ahi)',icon: '🎣', color: '#f97316', bait: 'Popper, jig, trolling lure',           regulation: 'No minimum · no limit',  when: 'Blue water — dawn & major solunar' },
    { name: 'Blue Marlin',        icon: '🎣', color: '#38bdf8', bait: 'Trolling lure, live bait, circle hook', regulation: 'Catch & release encouraged', when: 'Deep water — major solunar midday' },
    { name: "Bonefish (O'io)",   icon: '🐡', color: '#34d399', bait: 'Live shrimp, crab fly, bonefish jig',  regulation: 'Bag limit: 10/day',      when: 'Incoming tide on shallow flats — dawn' },
    { name: 'Ulua (Giant Trevally)',icon: '🐡', color: '#a78bfa', bait: 'Live bait, large popper, jig',        regulation: '10″ min · 1 per species/day', when: 'Moving tide — rocky shores & channel edges' },
  ],
  },
  {
    id: "1612301", waterTempId: "1612301",
    name: "Hanauma Bay", slug: "hanauma-bay",
    state: "hawaii", city: "Hanauma Bay, HI", region: "Oahu",
    lat: 21.275, lon: -157.697, latDisplay: "21.27°N", lonDisplay: "157.70°W",
    sunLat: 21.28, sunMeridian: 150, sunLon: 157.7, utcOffset: -4,
    sunriseRef: 6.72, sunsetRef: 18.25,
    tidalType: 'mixed', meanRange: 1.5, waterTempDefault: '78°F',
    nearby: [
    { name: "Waimanalo", lat: 21.335, lon: -157.693, slug: "waimanalo" },
    { name: "HONOLULU", lat: 21.30333333333334, lon: -157.8645277777778, slug: "honolulu" },
    { name: "MOKU O LOE", lat: 21.43305555555556, lon: -157.79, slug: "moku-o-loe" },
    { name: "MOKUOLOE, KANEONE BAY, OAHU IS. (BACKUP)", lat: 21.435, lon: -157.792, slug: "mokuoloe-kaneone-bay-oahu-is-backup" }
    ],
    species: [
    { name: 'Mahi-Mahi (Dorado)', icon: '🐟', color: '#60a5fa', bait: 'Trolling lure, flying fish, squid',    regulation: 'No minimum · no limit',  when: 'Open ocean — major solunar periods' },
    { name: 'Yellowfin Tuna (Ahi)',icon: '🎣', color: '#f97316', bait: 'Popper, jig, trolling lure',           regulation: 'No minimum · no limit',  when: 'Blue water — dawn & major solunar' },
    { name: 'Blue Marlin',        icon: '🎣', color: '#38bdf8', bait: 'Trolling lure, live bait, circle hook', regulation: 'Catch & release encouraged', when: 'Deep water — major solunar midday' },
    { name: "Bonefish (O'io)",   icon: '🐡', color: '#34d399', bait: 'Live shrimp, crab fly, bonefish jig',  regulation: 'Bag limit: 10/day',      when: 'Incoming tide on shallow flats — dawn' },
    { name: 'Ulua (Giant Trevally)',icon: '🐡', color: '#a78bfa', bait: 'Live bait, large popper, jig',        regulation: '10″ min · 1 per species/day', when: 'Moving tide — rocky shores & channel edges' },
  ],
  },
  {
    id: "1612340", waterTempId: "1612340",
    name: "HONOLULU", slug: "honolulu",
    state: "hawaii", city: "HONOLULU, HI", region: "Oahu",
    lat: 21.30333333333334, lon: -157.8645277777778, latDisplay: "21.30°N", lonDisplay: "157.86°W",
    sunLat: 21.3, sunMeridian: 150, sunLon: 157.86, utcOffset: -4,
    sunriseRef: 6.72, sunsetRef: 18.25,
    tidalType: 'mixed', meanRange: 1.5, waterTempDefault: '78°F',
    nearby: [
    { name: "Pearl Harbor, Ford Island Ferry", lat: 21.3683, lon: -157.94, slug: "pearl-harbor-ford-island-ferry" },
    { name: "Pearl Harbor Entrance, Bishop Point", lat: 21.33, lon: -157.967, slug: "pearl-harbor-entrance-bishop-point" },
    { name: "Ford Island, Pearl Harbor", lat: 21.36750030517578, lon: -157.96389770507812, slug: "ford-island-pearl-harbor" },
    { name: "MOKU O LOE", lat: 21.43305555555556, lon: -157.79, slug: "moku-o-loe" }
    ],
    species: [
    { name: 'Mahi-Mahi (Dorado)', icon: '🐟', color: '#60a5fa', bait: 'Trolling lure, flying fish, squid',    regulation: 'No minimum · no limit',  when: 'Open ocean — major solunar periods' },
    { name: 'Yellowfin Tuna (Ahi)',icon: '🎣', color: '#f97316', bait: 'Popper, jig, trolling lure',           regulation: 'No minimum · no limit',  when: 'Blue water — dawn & major solunar' },
    { name: 'Blue Marlin',        icon: '🎣', color: '#38bdf8', bait: 'Trolling lure, live bait, circle hook', regulation: 'Catch & release encouraged', when: 'Deep water — major solunar midday' },
    { name: "Bonefish (O'io)",   icon: '🐡', color: '#34d399', bait: 'Live shrimp, crab fly, bonefish jig',  regulation: 'Bag limit: 10/day',      when: 'Incoming tide on shallow flats — dawn' },
    { name: 'Ulua (Giant Trevally)',icon: '🐡', color: '#a78bfa', bait: 'Live bait, large popper, jig',        regulation: '10″ min · 1 per species/day', when: 'Moving tide — rocky shores & channel edges' },
  ],
  },
  {
    id: "1612366", waterTempId: "1612366",
    name: "Pearl Harbor Entrance, Bishop Point", slug: "pearl-harbor-entrance-bishop-point",
    state: "hawaii", city: "Pearl Harbor Entrance, Bishop Point, HI", region: "Oahu",
    lat: 21.33, lon: -157.967, latDisplay: "21.33°N", lonDisplay: "157.97°W",
    sunLat: 21.33, sunMeridian: 150, sunLon: 157.97, utcOffset: -4,
    sunriseRef: 6.72, sunsetRef: 18.25,
    tidalType: 'mixed', meanRange: 1.5, waterTempDefault: '78°F',
    nearby: [
    { name: "Ford Island, Pearl Harbor", lat: 21.36750030517578, lon: -157.96389770507812, slug: "ford-island-pearl-harbor" },
    { name: "Pearl Harbor, Ford Island Ferry", lat: 21.3683, lon: -157.94, slug: "pearl-harbor-ford-island-ferry" },
    { name: "HONOLULU", lat: 21.30333333333334, lon: -157.8645277777778, slug: "honolulu" },
    { name: "MOKUOLOE, KANEONE BAY, OAHU IS. (BACKUP)", lat: 21.435, lon: -157.792, slug: "mokuoloe-kaneone-bay-oahu-is-backup" }
    ],
    species: [
    { name: 'Mahi-Mahi (Dorado)', icon: '🐟', color: '#60a5fa', bait: 'Trolling lure, flying fish, squid',    regulation: 'No minimum · no limit',  when: 'Open ocean — major solunar periods' },
    { name: 'Yellowfin Tuna (Ahi)',icon: '🎣', color: '#f97316', bait: 'Popper, jig, trolling lure',           regulation: 'No minimum · no limit',  when: 'Blue water — dawn & major solunar' },
    { name: 'Blue Marlin',        icon: '🎣', color: '#38bdf8', bait: 'Trolling lure, live bait, circle hook', regulation: 'Catch & release encouraged', when: 'Deep water — major solunar midday' },
    { name: "Bonefish (O'io)",   icon: '🐡', color: '#34d399', bait: 'Live shrimp, crab fly, bonefish jig',  regulation: 'Bag limit: 10/day',      when: 'Incoming tide on shallow flats — dawn' },
    { name: 'Ulua (Giant Trevally)',icon: '🐡', color: '#a78bfa', bait: 'Live bait, large popper, jig',        regulation: '10″ min · 1 per species/day', when: 'Moving tide — rocky shores & channel edges' },
  ],
  },
  {
    id: "1612376", waterTempId: "1612376",
    name: "Waimanalo", slug: "waimanalo",
    state: "hawaii", city: "Waimanalo, HI", region: "Oahu",
    lat: 21.335, lon: -157.693, latDisplay: "21.34°N", lonDisplay: "157.69°W",
    sunLat: 21.34, sunMeridian: 150, sunLon: 157.69, utcOffset: -4,
    sunriseRef: 6.72, sunsetRef: 18.25,
    tidalType: 'mixed', meanRange: 1.5, waterTempDefault: '78°F',
    nearby: [
    { name: "Hanauma Bay", lat: 21.275, lon: -157.697, slug: "hanauma-bay" },
    { name: "MOKU O LOE", lat: 21.43305555555556, lon: -157.79, slug: "moku-o-loe" },
    { name: "MOKUOLOE, KANEONE BAY, OAHU IS. (BACKUP)", lat: 21.435, lon: -157.792, slug: "mokuoloe-kaneone-bay-oahu-is-backup" },
    { name: "HONOLULU", lat: 21.30333333333334, lon: -157.8645277777778, slug: "honolulu" }
    ],
    species: [
    { name: 'Mahi-Mahi (Dorado)', icon: '🐟', color: '#60a5fa', bait: 'Trolling lure, flying fish, squid',    regulation: 'No minimum · no limit',  when: 'Open ocean — major solunar periods' },
    { name: 'Yellowfin Tuna (Ahi)',icon: '🎣', color: '#f97316', bait: 'Popper, jig, trolling lure',           regulation: 'No minimum · no limit',  when: 'Blue water — dawn & major solunar' },
    { name: 'Blue Marlin',        icon: '🎣', color: '#38bdf8', bait: 'Trolling lure, live bait, circle hook', regulation: 'Catch & release encouraged', when: 'Deep water — major solunar midday' },
    { name: "Bonefish (O'io)",   icon: '🐡', color: '#34d399', bait: 'Live shrimp, crab fly, bonefish jig',  regulation: 'Bag limit: 10/day',      when: 'Incoming tide on shallow flats — dawn' },
    { name: 'Ulua (Giant Trevally)',icon: '🐡', color: '#a78bfa', bait: 'Live bait, large popper, jig',        regulation: '10″ min · 1 per species/day', when: 'Moving tide — rocky shores & channel edges' },
  ],
  },
  {
    id: "1612401", waterTempId: "1612401",
    name: "Ford Island, Pearl Harbor", slug: "ford-island-pearl-harbor",
    state: "hawaii", city: "Ford Island, Pearl Harbor, HI", region: "Oahu",
    lat: 21.36750030517578, lon: -157.96389770507812, latDisplay: "21.37°N", lonDisplay: "157.96°W",
    sunLat: 21.37, sunMeridian: 150, sunLon: 157.96, utcOffset: -4,
    sunriseRef: 6.72, sunsetRef: 18.25,
    tidalType: 'mixed', meanRange: 1.5, waterTempDefault: '78°F',
    nearby: [
    { name: "Pearl Harbor, Ford Island Ferry", lat: 21.3683, lon: -157.94, slug: "pearl-harbor-ford-island-ferry" },
    { name: "Pearl Harbor Entrance, Bishop Point", lat: 21.33, lon: -157.967, slug: "pearl-harbor-entrance-bishop-point" },
    { name: "HONOLULU", lat: 21.30333333333334, lon: -157.8645277777778, slug: "honolulu" },
    { name: "MOKUOLOE, KANEONE BAY, OAHU IS. (BACKUP)", lat: 21.435, lon: -157.792, slug: "mokuoloe-kaneone-bay-oahu-is-backup" }
    ],
    species: [
    { name: 'Mahi-Mahi (Dorado)', icon: '🐟', color: '#60a5fa', bait: 'Trolling lure, flying fish, squid',    regulation: 'No minimum · no limit',  when: 'Open ocean — major solunar periods' },
    { name: 'Yellowfin Tuna (Ahi)',icon: '🎣', color: '#f97316', bait: 'Popper, jig, trolling lure',           regulation: 'No minimum · no limit',  when: 'Blue water — dawn & major solunar' },
    { name: 'Blue Marlin',        icon: '🎣', color: '#38bdf8', bait: 'Trolling lure, live bait, circle hook', regulation: 'Catch & release encouraged', when: 'Deep water — major solunar midday' },
    { name: "Bonefish (O'io)",   icon: '🐡', color: '#34d399', bait: 'Live shrimp, crab fly, bonefish jig',  regulation: 'Bag limit: 10/day',      when: 'Incoming tide on shallow flats — dawn' },
    { name: 'Ulua (Giant Trevally)',icon: '🐡', color: '#a78bfa', bait: 'Live bait, large popper, jig',        regulation: '10″ min · 1 per species/day', when: 'Moving tide — rocky shores & channel edges' },
  ],
  },
  {
    id: "1612404", waterTempId: "1612404",
    name: "Pearl Harbor, Ford Island Ferry", slug: "pearl-harbor-ford-island-ferry",
    state: "hawaii", city: "Pearl Harbor, Ford Island Ferry, HI", region: "Oahu",
    lat: 21.3683, lon: -157.94, latDisplay: "21.37°N", lonDisplay: "157.94°W",
    sunLat: 21.37, sunMeridian: 150, sunLon: 157.94, utcOffset: -4,
    sunriseRef: 6.72, sunsetRef: 18.25,
    tidalType: 'mixed', meanRange: 1.5, waterTempDefault: '78°F',
    nearby: [
    { name: "Ford Island, Pearl Harbor", lat: 21.36750030517578, lon: -157.96389770507812, slug: "ford-island-pearl-harbor" },
    { name: "Pearl Harbor Entrance, Bishop Point", lat: 21.33, lon: -157.967, slug: "pearl-harbor-entrance-bishop-point" },
    { name: "HONOLULU", lat: 21.30333333333334, lon: -157.8645277777778, slug: "honolulu" },
    { name: "MOKUOLOE, KANEONE BAY, OAHU IS. (BACKUP)", lat: 21.435, lon: -157.792, slug: "mokuoloe-kaneone-bay-oahu-is-backup" }
    ],
    species: [
    { name: 'Mahi-Mahi (Dorado)', icon: '🐟', color: '#60a5fa', bait: 'Trolling lure, flying fish, squid',    regulation: 'No minimum · no limit',  when: 'Open ocean — major solunar periods' },
    { name: 'Yellowfin Tuna (Ahi)',icon: '🎣', color: '#f97316', bait: 'Popper, jig, trolling lure',           regulation: 'No minimum · no limit',  when: 'Blue water — dawn & major solunar' },
    { name: 'Blue Marlin',        icon: '🎣', color: '#38bdf8', bait: 'Trolling lure, live bait, circle hook', regulation: 'Catch & release encouraged', when: 'Deep water — major solunar midday' },
    { name: "Bonefish (O'io)",   icon: '🐡', color: '#34d399', bait: 'Live shrimp, crab fly, bonefish jig',  regulation: 'Bag limit: 10/day',      when: 'Incoming tide on shallow flats — dawn' },
    { name: 'Ulua (Giant Trevally)',icon: '🐡', color: '#a78bfa', bait: 'Live bait, large popper, jig',        regulation: '10″ min · 1 per species/day', when: 'Moving tide — rocky shores & channel edges' },
  ],
  },
  {
    id: "1612480", waterTempId: "1612480",
    name: "MOKU O LOE", slug: "moku-o-loe",
    state: "hawaii", city: "MOKU O LOE, HI", region: "Oahu",
    lat: 21.43305555555556, lon: -157.79, latDisplay: "21.43°N", lonDisplay: "157.79°W",
    sunLat: 21.43, sunMeridian: 150, sunLon: 157.79, utcOffset: -4,
    sunriseRef: 6.71, sunsetRef: 18.26,
    tidalType: 'mixed', meanRange: 1.5, waterTempDefault: '78°F',
    nearby: [
    { name: "MOKUOLOE, KANEONE BAY, OAHU IS. (BACKUP)", lat: 21.435, lon: -157.792, slug: "mokuoloe-kaneone-bay-oahu-is-backup" },
    { name: "Waimanalo", lat: 21.335, lon: -157.693, slug: "waimanalo" },
    { name: "HONOLULU", lat: 21.30333333333334, lon: -157.8645277777778, slug: "honolulu" },
    { name: "Pearl Harbor, Ford Island Ferry", lat: 21.3683, lon: -157.94, slug: "pearl-harbor-ford-island-ferry" }
    ],
    species: [
    { name: 'Mahi-Mahi (Dorado)', icon: '🐟', color: '#60a5fa', bait: 'Trolling lure, flying fish, squid',    regulation: 'No minimum · no limit',  when: 'Open ocean — major solunar periods' },
    { name: 'Yellowfin Tuna (Ahi)',icon: '🎣', color: '#f97316', bait: 'Popper, jig, trolling lure',           regulation: 'No minimum · no limit',  when: 'Blue water — dawn & major solunar' },
    { name: 'Blue Marlin',        icon: '🎣', color: '#38bdf8', bait: 'Trolling lure, live bait, circle hook', regulation: 'Catch & release encouraged', when: 'Deep water — major solunar midday' },
    { name: "Bonefish (O'io)",   icon: '🐡', color: '#34d399', bait: 'Live shrimp, crab fly, bonefish jig',  regulation: 'Bag limit: 10/day',      when: 'Incoming tide on shallow flats — dawn' },
    { name: 'Ulua (Giant Trevally)',icon: '🐡', color: '#a78bfa', bait: 'Live bait, large popper, jig',        regulation: '10″ min · 1 per species/day', when: 'Moving tide — rocky shores & channel edges' },
  ],
  },
  {
    id: "1612482", waterTempId: "1612482",
    name: "Waianae", slug: "waianae",
    state: "hawaii", city: "Waianae, HI", region: "Oahu",
    lat: 21.445, lon: -158.192, latDisplay: "21.45°N", lonDisplay: "158.19°W",
    sunLat: 21.45, sunMeridian: 150, sunLon: 158.19, utcOffset: -4,
    sunriseRef: 6.71, sunsetRef: 18.26,
    tidalType: 'mixed', meanRange: 1.5, waterTempDefault: '78°F',
    nearby: [
    { name: "Haleiwa, Waialua Bay", lat: 21.5983, lon: -158.108, slug: "haleiwa-waialua-bay" },
    { name: "Ford Island, Pearl Harbor", lat: 21.36750030517578, lon: -157.96389770507812, slug: "ford-island-pearl-harbor" },
    { name: "Pearl Harbor Entrance, Bishop Point", lat: 21.33, lon: -157.967, slug: "pearl-harbor-entrance-bishop-point" },
    { name: "Pearl Harbor, Ford Island Ferry", lat: 21.3683, lon: -157.94, slug: "pearl-harbor-ford-island-ferry" }
    ],
    species: [
    { name: 'Mahi-Mahi (Dorado)', icon: '🐟', color: '#60a5fa', bait: 'Trolling lure, flying fish, squid',    regulation: 'No minimum · no limit',  when: 'Open ocean — major solunar periods' },
    { name: 'Yellowfin Tuna (Ahi)',icon: '🎣', color: '#f97316', bait: 'Popper, jig, trolling lure',           regulation: 'No minimum · no limit',  when: 'Blue water — dawn & major solunar' },
    { name: 'Blue Marlin',        icon: '🎣', color: '#38bdf8', bait: 'Trolling lure, live bait, circle hook', regulation: 'Catch & release encouraged', when: 'Deep water — major solunar midday' },
    { name: "Bonefish (O'io)",   icon: '🐡', color: '#34d399', bait: 'Live shrimp, crab fly, bonefish jig',  regulation: 'Bag limit: 10/day',      when: 'Incoming tide on shallow flats — dawn' },
    { name: 'Ulua (Giant Trevally)',icon: '🐡', color: '#a78bfa', bait: 'Live bait, large popper, jig',        regulation: '10″ min · 1 per species/day', when: 'Moving tide — rocky shores & channel edges' },
  ],
  },
  {
    id: "1612668", waterTempId: "1612668",
    name: "Haleiwa, Waialua Bay", slug: "haleiwa-waialua-bay",
    state: "hawaii", city: "Haleiwa, Waialua Bay, HI", region: "Kauai / Niihau",
    lat: 21.5983, lon: -158.108, latDisplay: "21.60°N", lonDisplay: "158.11°W",
    sunLat: 21.6, sunMeridian: 150, sunLon: 158.11, utcOffset: -4,
    sunriseRef: 6.7, sunsetRef: 18.26,
    tidalType: 'mixed', meanRange: 1.5, waterTempDefault: '78°F',
    nearby: [
    { name: "Waianae", lat: 21.445, lon: -158.192, slug: "waianae" },
    { name: "LAIEMALOO, OAHU ISLAND", lat: 21.6367, lon: -157.922, slug: "laiemaloo-oahu-island" },
    { name: "Ford Island, Pearl Harbor", lat: 21.36750030517578, lon: -157.96389770507812, slug: "ford-island-pearl-harbor" },
    { name: "Pearl Harbor, Ford Island Ferry", lat: 21.3683, lon: -157.94, slug: "pearl-harbor-ford-island-ferry" }
    ],
    species: [
    { name: 'Mahi-Mahi (Dorado)', icon: '🐟', color: '#60a5fa', bait: 'Trolling lure, flying fish, squid',    regulation: 'No minimum · no limit',  when: 'Open ocean — major solunar periods' },
    { name: 'Yellowfin Tuna (Ahi)',icon: '🎣', color: '#f97316', bait: 'Popper, jig, trolling lure',           regulation: 'No minimum · no limit',  when: 'Blue water — dawn & major solunar' },
    { name: 'Blue Marlin',        icon: '🎣', color: '#38bdf8', bait: 'Trolling lure, live bait, circle hook', regulation: 'Catch & release encouraged', when: 'Deep water — major solunar midday' },
    { name: "Bonefish (O'io)",   icon: '🐡', color: '#34d399', bait: 'Live shrimp, crab fly, bonefish jig',  regulation: 'Bag limit: 10/day',      when: 'Incoming tide on shallow flats — dawn' },
    { name: 'Ulua (Giant Trevally)',icon: '🐡', color: '#a78bfa', bait: 'Live bait, large popper, jig',        regulation: '10″ min · 1 per species/day', when: 'Moving tide — rocky shores & channel edges' },
  ],
  },
  {
    id: "1613077", waterTempId: "1613077",
    name: "Kamalo Harbor", slug: "kamalo-harbor",
    state: "hawaii", city: "Kamalo Harbor, HI", region: "Maui / Molokai",
    lat: 21.0483, lon: -156.877, latDisplay: "21.05°N", lonDisplay: "156.88°W",
    sunLat: 21.05, sunMeridian: 150, sunLon: 156.88, utcOffset: -4,
    sunriseRef: 6.74, sunsetRef: 18.24,
    tidalType: 'mixed', meanRange: 1.5, waterTempDefault: '78°F',
    nearby: [
    { name: "Pukoo Harbor", lat: 21.0717, lon: -156.8, slug: "pukoo-harbor" },
    { name: "Kaunakakai", lat: 21.085, lon: -157.032, slug: "kaunakakai" },
    { name: "Kaumalapau, Lanai Island", lat: 20.79, lon: -156.995, slug: "kaumalapau-lanai-island" },
    { name: "Kolo", lat: 21.0933, lon: -157.197, slug: "kolo" }
    ],
    species: [
    { name: 'Mahi-Mahi (Dorado)', icon: '🐟', color: '#60a5fa', bait: 'Trolling lure, flying fish, squid',    regulation: 'No minimum · no limit',  when: 'Open ocean — major solunar periods' },
    { name: 'Yellowfin Tuna (Ahi)',icon: '🎣', color: '#f97316', bait: 'Popper, jig, trolling lure',           regulation: 'No minimum · no limit',  when: 'Blue water — dawn & major solunar' },
    { name: 'Blue Marlin',        icon: '🎣', color: '#38bdf8', bait: 'Trolling lure, live bait, circle hook', regulation: 'Catch & release encouraged', when: 'Deep water — major solunar midday' },
    { name: "Bonefish (O'io)",   icon: '🐡', color: '#34d399', bait: 'Live shrimp, crab fly, bonefish jig',  regulation: 'Bag limit: 10/day',      when: 'Incoming tide on shallow flats — dawn' },
    { name: 'Ulua (Giant Trevally)',icon: '🐡', color: '#a78bfa', bait: 'Live bait, large popper, jig',        regulation: '10″ min · 1 per species/day', when: 'Moving tide — rocky shores & channel edges' },
  ],
  },
  {
    id: "1613155", waterTempId: "1613155",
    name: "Pukoo Harbor", slug: "pukoo-harbor",
    state: "hawaii", city: "Pukoo Harbor, HI", region: "Maui / Molokai",
    lat: 21.0717, lon: -156.8, latDisplay: "21.07°N", lonDisplay: "156.80°W",
    sunLat: 21.07, sunMeridian: 150, sunLon: 156.8, utcOffset: -4,
    sunriseRef: 6.74, sunsetRef: 18.24,
    tidalType: 'mixed', meanRange: 1.5, waterTempDefault: '78°F',
    nearby: [
    { name: "Kamalo Harbor", lat: 21.0483, lon: -156.877, slug: "kamalo-harbor" },
    { name: "Kaunakakai", lat: 21.085, lon: -157.032, slug: "kaunakakai" },
    { name: "Kaumalapau, Lanai Island", lat: 20.79, lon: -156.995, slug: "kaumalapau-lanai-island" },
    { name: "KAHULUI", lat: 20.89494444444445, lon: -156.469, slug: "kahului" }
    ],
    species: [
    { name: 'Mahi-Mahi (Dorado)', icon: '🐟', color: '#60a5fa', bait: 'Trolling lure, flying fish, squid',    regulation: 'No minimum · no limit',  when: 'Open ocean — major solunar periods' },
    { name: 'Yellowfin Tuna (Ahi)',icon: '🎣', color: '#f97316', bait: 'Popper, jig, trolling lure',           regulation: 'No minimum · no limit',  when: 'Blue water — dawn & major solunar' },
    { name: 'Blue Marlin',        icon: '🎣', color: '#38bdf8', bait: 'Trolling lure, live bait, circle hook', regulation: 'Catch & release encouraged', when: 'Deep water — major solunar midday' },
    { name: "Bonefish (O'io)",   icon: '🐡', color: '#34d399', bait: 'Live shrimp, crab fly, bonefish jig',  regulation: 'Bag limit: 10/day',      when: 'Incoming tide on shallow flats — dawn' },
    { name: 'Ulua (Giant Trevally)',icon: '🐡', color: '#a78bfa', bait: 'Live bait, large popper, jig',        regulation: '10″ min · 1 per species/day', when: 'Moving tide — rocky shores & channel edges' },
  ],
  },
  {
    id: "1613198", waterTempId: "1613198",
    name: "Kaunakakai", slug: "kaunakakai",
    state: "hawaii", city: "Kaunakakai, HI", region: "Maui / Molokai",
    lat: 21.085, lon: -157.032, latDisplay: "21.09°N", lonDisplay: "157.03°W",
    sunLat: 21.09, sunMeridian: 150, sunLon: 157.03, utcOffset: -4,
    sunriseRef: 6.73, sunsetRef: 18.24,
    tidalType: 'mixed', meanRange: 1.5, waterTempDefault: '78°F',
    nearby: [
    { name: "Kamalo Harbor", lat: 21.0483, lon: -156.877, slug: "kamalo-harbor" },
    { name: "Kolo", lat: 21.0933, lon: -157.197, slug: "kolo" },
    { name: "Pukoo Harbor", lat: 21.0717, lon: -156.8, slug: "pukoo-harbor" },
    { name: "Kaumalapau, Lanai Island", lat: 20.79, lon: -156.995, slug: "kaumalapau-lanai-island" }
    ],
    species: [
    { name: 'Mahi-Mahi (Dorado)', icon: '🐟', color: '#60a5fa', bait: 'Trolling lure, flying fish, squid',    regulation: 'No minimum · no limit',  when: 'Open ocean — major solunar periods' },
    { name: 'Yellowfin Tuna (Ahi)',icon: '🎣', color: '#f97316', bait: 'Popper, jig, trolling lure',           regulation: 'No minimum · no limit',  when: 'Blue water — dawn & major solunar' },
    { name: 'Blue Marlin',        icon: '🎣', color: '#38bdf8', bait: 'Trolling lure, live bait, circle hook', regulation: 'Catch & release encouraged', when: 'Deep water — major solunar midday' },
    { name: "Bonefish (O'io)",   icon: '🐡', color: '#34d399', bait: 'Live shrimp, crab fly, bonefish jig',  regulation: 'Bag limit: 10/day',      when: 'Incoming tide on shallow flats — dawn' },
    { name: 'Ulua (Giant Trevally)',icon: '🐡', color: '#a78bfa', bait: 'Live bait, large popper, jig',        regulation: '10″ min · 1 per species/day', when: 'Moving tide — rocky shores & channel edges' },
  ],
  },
  {
    id: "1613226", waterTempId: "1613226",
    name: "Kolo", slug: "kolo",
    state: "hawaii", city: "Kolo, HI", region: "Maui / Molokai",
    lat: 21.0933, lon: -157.197, latDisplay: "21.09°N", lonDisplay: "157.20°W",
    sunLat: 21.09, sunMeridian: 150, sunLon: 157.2, utcOffset: -4,
    sunriseRef: 6.73, sunsetRef: 18.24,
    tidalType: 'mixed', meanRange: 1.5, waterTempDefault: '78°F',
    nearby: [
    { name: "Kaunakakai", lat: 21.085, lon: -157.032, slug: "kaunakakai" },
    { name: "Kamalo Harbor", lat: 21.0483, lon: -156.877, slug: "kamalo-harbor" },
    { name: "Kaumalapau, Lanai Island", lat: 20.79, lon: -156.995, slug: "kaumalapau-lanai-island" },
    { name: "Pukoo Harbor", lat: 21.0717, lon: -156.8, slug: "pukoo-harbor" }
    ],
    species: [
    { name: 'Mahi-Mahi (Dorado)', icon: '🐟', color: '#60a5fa', bait: 'Trolling lure, flying fish, squid',    regulation: 'No minimum · no limit',  when: 'Open ocean — major solunar periods' },
    { name: 'Yellowfin Tuna (Ahi)',icon: '🎣', color: '#f97316', bait: 'Popper, jig, trolling lure',           regulation: 'No minimum · no limit',  when: 'Blue water — dawn & major solunar' },
    { name: 'Blue Marlin',        icon: '🎣', color: '#38bdf8', bait: 'Trolling lure, live bait, circle hook', regulation: 'Catch & release encouraged', when: 'Deep water — major solunar midday' },
    { name: "Bonefish (O'io)",   icon: '🐡', color: '#34d399', bait: 'Live shrimp, crab fly, bonefish jig',  regulation: 'Bag limit: 10/day',      when: 'Incoming tide on shallow flats — dawn' },
    { name: 'Ulua (Giant Trevally)',icon: '🐡', color: '#a78bfa', bait: 'Live bait, large popper, jig',        regulation: '10″ min · 1 per species/day', when: 'Moving tide — rocky shores & channel edges' },
  ],
  },
  {
    id: "1614465", waterTempId: "1614465",
    name: "Kaumalapau, Lanai Island", slug: "kaumalapau-lanai-island",
    state: "hawaii", city: "Kaumalapau, Lanai Island, HI", region: "Maui / Molokai",
    lat: 20.79, lon: -156.995, latDisplay: "20.79°N", lonDisplay: "157.00°W",
    sunLat: 20.79, sunMeridian: 150, sunLon: 157, utcOffset: -4,
    sunriseRef: 6.75, sunsetRef: 18.23,
    tidalType: 'mixed', meanRange: 1.5, waterTempDefault: '78°F',
    nearby: [
    { name: "Kamalo Harbor", lat: 21.0483, lon: -156.877, slug: "kamalo-harbor" },
    { name: "Kaunakakai", lat: 21.085, lon: -157.032, slug: "kaunakakai" },
    { name: "Pukoo Harbor", lat: 21.0717, lon: -156.8, slug: "pukoo-harbor" },
    { name: "Kolo", lat: 21.0933, lon: -157.197, slug: "kolo" }
    ],
    species: [
    { name: 'Mahi-Mahi (Dorado)', icon: '🐟', color: '#60a5fa', bait: 'Trolling lure, flying fish, squid',    regulation: 'No minimum · no limit',  when: 'Open ocean — major solunar periods' },
    { name: 'Yellowfin Tuna (Ahi)',icon: '🎣', color: '#f97316', bait: 'Popper, jig, trolling lure',           regulation: 'No minimum · no limit',  when: 'Blue water — dawn & major solunar' },
    { name: 'Blue Marlin',        icon: '🎣', color: '#38bdf8', bait: 'Trolling lure, live bait, circle hook', regulation: 'Catch & release encouraged', when: 'Deep water — major solunar midday' },
    { name: "Bonefish (O'io)",   icon: '🐡', color: '#34d399', bait: 'Live shrimp, crab fly, bonefish jig',  regulation: 'Bag limit: 10/day',      when: 'Incoming tide on shallow flats — dawn' },
    { name: 'Ulua (Giant Trevally)',icon: '🐡', color: '#a78bfa', bait: 'Live bait, large popper, jig',        regulation: '10″ min · 1 per species/day', when: 'Moving tide — rocky shores & channel edges' },
  ],
  },
  {
    id: "1615202", waterTempId: "1615202",
    name: "Makena", slug: "makena",
    state: "hawaii", city: "Makena, HI", region: "Hawaii (Big Island)",
    lat: 20.6567, lon: -156.445, latDisplay: "20.66°N", lonDisplay: "156.44°W",
    sunLat: 20.66, sunMeridian: 150, sunLon: 156.45, utcOffset: -4,
    sunriseRef: 6.76, sunsetRef: 18.23,
    tidalType: 'mixed', meanRange: 1.5, waterTempDefault: '78°F',
    nearby: [
    { name: "Kuheia Bay", lat: 20.595, lon: -156.607, slug: "kuheia-bay" },
    { name: "KAHULUI", lat: 20.89494444444445, lon: -156.469, slug: "kahului" },
    { name: "Hana", lat: 20.7617, lon: -155.987, slug: "hana" },
    { name: "Pukoo Harbor", lat: 21.0717, lon: -156.8, slug: "pukoo-harbor" }
    ],
    species: [
    { name: 'Mahi-Mahi (Dorado)', icon: '🐟', color: '#60a5fa', bait: 'Trolling lure, flying fish, squid',    regulation: 'No minimum · no limit',  when: 'Open ocean — major solunar periods' },
    { name: 'Yellowfin Tuna (Ahi)',icon: '🎣', color: '#f97316', bait: 'Popper, jig, trolling lure',           regulation: 'No minimum · no limit',  when: 'Blue water — dawn & major solunar' },
    { name: 'Blue Marlin',        icon: '🎣', color: '#38bdf8', bait: 'Trolling lure, live bait, circle hook', regulation: 'Catch & release encouraged', when: 'Deep water — major solunar midday' },
    { name: "Bonefish (O'io)",   icon: '🐡', color: '#34d399', bait: 'Live shrimp, crab fly, bonefish jig',  regulation: 'Bag limit: 10/day',      when: 'Incoming tide on shallow flats — dawn' },
    { name: 'Ulua (Giant Trevally)',icon: '🐡', color: '#a78bfa', bait: 'Live bait, large popper, jig',        regulation: '10″ min · 1 per species/day', when: 'Moving tide — rocky shores & channel edges' },
  ],
  },
  {
    id: "1615395", waterTempId: "1615395",
    name: "Hana", slug: "hana",
    state: "hawaii", city: "Hana, HI", region: "Hawaii (Big Island)",
    lat: 20.7617, lon: -155.987, latDisplay: "20.76°N", lonDisplay: "155.99°W",
    sunLat: 20.76, sunMeridian: 150, sunLon: 155.99, utcOffset: -4,
    sunriseRef: 6.75, sunsetRef: 18.23,
    tidalType: 'mixed', meanRange: 1.5, waterTempDefault: '78°F',
    nearby: [
    { name: "Makena", lat: 20.6567, lon: -156.445, slug: "makena" },
    { name: "KAHULUI", lat: 20.89494444444445, lon: -156.469, slug: "kahului" },
    { name: "Mahukona", lat: 20.1867, lon: -155.903, slug: "mahukona" },
    { name: "Kuheia Bay", lat: 20.595, lon: -156.607, slug: "kuheia-bay" }
    ],
    species: [
    { name: 'Mahi-Mahi (Dorado)', icon: '🐟', color: '#60a5fa', bait: 'Trolling lure, flying fish, squid',    regulation: 'No minimum · no limit',  when: 'Open ocean — major solunar periods' },
    { name: 'Yellowfin Tuna (Ahi)',icon: '🎣', color: '#f97316', bait: 'Popper, jig, trolling lure',           regulation: 'No minimum · no limit',  when: 'Blue water — dawn & major solunar' },
    { name: 'Blue Marlin',        icon: '🎣', color: '#38bdf8', bait: 'Trolling lure, live bait, circle hook', regulation: 'Catch & release encouraged', when: 'Deep water — major solunar midday' },
    { name: "Bonefish (O'io)",   icon: '🐡', color: '#34d399', bait: 'Live shrimp, crab fly, bonefish jig',  regulation: 'Bag limit: 10/day',      when: 'Incoming tide on shallow flats — dawn' },
    { name: 'Ulua (Giant Trevally)',icon: '🐡', color: '#a78bfa', bait: 'Live bait, large popper, jig',        regulation: '10″ min · 1 per species/day', when: 'Moving tide — rocky shores & channel edges' },
  ],
  },
  {
    id: "1615680", waterTempId: "1615680",
    name: "KAHULUI", slug: "kahului",
    state: "hawaii", city: "KAHULUI, HI", region: "Hawaii (Big Island)",
    lat: 20.89494444444445, lon: -156.469, latDisplay: "20.89°N", lonDisplay: "156.47°W",
    sunLat: 20.89, sunMeridian: 150, sunLon: 156.47, utcOffset: -4,
    sunriseRef: 6.75, sunsetRef: 18.24,
    tidalType: 'mixed', meanRange: 1.5, waterTempDefault: '78°F',
    nearby: [
    { name: "Makena", lat: 20.6567, lon: -156.445, slug: "makena" },
    { name: "Kuheia Bay", lat: 20.595, lon: -156.607, slug: "kuheia-bay" },
    { name: "Pukoo Harbor", lat: 21.0717, lon: -156.8, slug: "pukoo-harbor" },
    { name: "Kamalo Harbor", lat: 21.0483, lon: -156.877, slug: "kamalo-harbor" }
    ],
    species: [
    { name: 'Mahi-Mahi (Dorado)', icon: '🐟', color: '#60a5fa', bait: 'Trolling lure, flying fish, squid',    regulation: 'No minimum · no limit',  when: 'Open ocean — major solunar periods' },
    { name: 'Yellowfin Tuna (Ahi)',icon: '🎣', color: '#f97316', bait: 'Popper, jig, trolling lure',           regulation: 'No minimum · no limit',  when: 'Blue water — dawn & major solunar' },
    { name: 'Blue Marlin',        icon: '🎣', color: '#38bdf8', bait: 'Trolling lure, live bait, circle hook', regulation: 'Catch & release encouraged', when: 'Deep water — major solunar midday' },
    { name: "Bonefish (O'io)",   icon: '🐡', color: '#34d399', bait: 'Live shrimp, crab fly, bonefish jig',  regulation: 'Bag limit: 10/day',      when: 'Incoming tide on shallow flats — dawn' },
    { name: 'Ulua (Giant Trevally)',icon: '🐡', color: '#a78bfa', bait: 'Live bait, large popper, jig',        regulation: '10″ min · 1 per species/day', when: 'Moving tide — rocky shores & channel edges' },
  ],
  },
  {
    id: "1616696", waterTempId: "1616696",
    name: "Kuheia Bay", slug: "kuheia-bay",
    state: "hawaii", city: "Kuheia Bay, HI", region: "Maui / Molokai",
    lat: 20.595, lon: -156.607, latDisplay: "20.59°N", lonDisplay: "156.61°W",
    sunLat: 20.6, sunMeridian: 150, sunLon: 156.61, utcOffset: -4,
    sunriseRef: 6.76, sunsetRef: 18.22,
    tidalType: 'mixed', meanRange: 1.5, waterTempDefault: '78°F',
    nearby: [
    { name: "Makena", lat: 20.6567, lon: -156.445, slug: "makena" },
    { name: "KAHULUI", lat: 20.89494444444445, lon: -156.469, slug: "kahului" },
    { name: "Kaumalapau, Lanai Island", lat: 20.79, lon: -156.995, slug: "kaumalapau-lanai-island" },
    { name: "Pukoo Harbor", lat: 21.0717, lon: -156.8, slug: "pukoo-harbor" }
    ],
    species: [
    { name: 'Mahi-Mahi (Dorado)', icon: '🐟', color: '#60a5fa', bait: 'Trolling lure, flying fish, squid',    regulation: 'No minimum · no limit',  when: 'Open ocean — major solunar periods' },
    { name: 'Yellowfin Tuna (Ahi)',icon: '🎣', color: '#f97316', bait: 'Popper, jig, trolling lure',           regulation: 'No minimum · no limit',  when: 'Blue water — dawn & major solunar' },
    { name: 'Blue Marlin',        icon: '🎣', color: '#38bdf8', bait: 'Trolling lure, live bait, circle hook', regulation: 'Catch & release encouraged', when: 'Deep water — major solunar midday' },
    { name: "Bonefish (O'io)",   icon: '🐡', color: '#34d399', bait: 'Live shrimp, crab fly, bonefish jig',  regulation: 'Bag limit: 10/day',      when: 'Incoming tide on shallow flats — dawn' },
    { name: 'Ulua (Giant Trevally)',icon: '🐡', color: '#a78bfa', bait: 'Live bait, large popper, jig',        regulation: '10″ min · 1 per species/day', when: 'Moving tide — rocky shores & channel edges' },
  ],
  },
  {
    id: "1617277", waterTempId: "1617277",
    name: "Mahukona", slug: "mahukona",
    state: "hawaii", city: "Mahukona, HI", region: "Hawaii (Big Island)",
    lat: 20.1867, lon: -155.903, latDisplay: "20.19°N", lonDisplay: "155.90°W",
    sunLat: 20.19, sunMeridian: 150, sunLon: 155.9, utcOffset: -4,
    sunriseRef: 6.79, sunsetRef: 18.21,
    tidalType: 'mixed', meanRange: 1.5, waterTempDefault: '78°F',
    nearby: [
    { name: "Kawaihae", lat: 20.0366, lon: -155.8294, slug: "kawaihae" },
    { name: "Kailua Kona", lat: 19.6433, lon: -156, slug: "kailua-kona" },
    { name: "Hana", lat: 20.7617, lon: -155.987, slug: "hana" },
    { name: "Makena", lat: 20.6567, lon: -156.445, slug: "makena" }
    ],
    species: [
    { name: 'Mahi-Mahi (Dorado)', icon: '🐟', color: '#60a5fa', bait: 'Trolling lure, flying fish, squid',    regulation: 'No minimum · no limit',  when: 'Open ocean — major solunar periods' },
    { name: 'Yellowfin Tuna (Ahi)',icon: '🎣', color: '#f97316', bait: 'Popper, jig, trolling lure',           regulation: 'No minimum · no limit',  when: 'Blue water — dawn & major solunar' },
    { name: 'Blue Marlin',        icon: '🎣', color: '#38bdf8', bait: 'Trolling lure, live bait, circle hook', regulation: 'Catch & release encouraged', when: 'Deep water — major solunar midday' },
    { name: "Bonefish (O'io)",   icon: '🐡', color: '#34d399', bait: 'Live shrimp, crab fly, bonefish jig',  regulation: 'Bag limit: 10/day',      when: 'Incoming tide on shallow flats — dawn' },
    { name: 'Ulua (Giant Trevally)',icon: '🐡', color: '#a78bfa', bait: 'Live bait, large popper, jig',        regulation: '10″ min · 1 per species/day', when: 'Moving tide — rocky shores & channel edges' },
  ],
  },
  {
    id: "1617433", waterTempId: "1617433",
    name: "Kawaihae", slug: "kawaihae",
    state: "hawaii", city: "Kawaihae, HI", region: "Hawaii (Big Island)",
    lat: 20.0366, lon: -155.8294, latDisplay: "20.04°N", lonDisplay: "155.83°W",
    sunLat: 20.04, sunMeridian: 150, sunLon: 155.83, utcOffset: -4,
    sunriseRef: 6.8, sunsetRef: 18.2,
    tidalType: 'mixed', meanRange: 1.5, waterTempDefault: '78°F',
    nearby: [
    { name: "Mahukona", lat: 20.1867, lon: -155.903, slug: "mahukona" },
    { name: "Kailua Kona", lat: 19.6433, lon: -156, slug: "kailua-kona" },
    { name: "Napoopoo, Kealakekua Bay", lat: 19.4767, lon: -155.922, slug: "napoopoo-kealakekua-bay" },
    { name: "Hana", lat: 20.7617, lon: -155.987, slug: "hana" }
    ],
    species: [
    { name: 'Mahi-Mahi (Dorado)', icon: '🐟', color: '#60a5fa', bait: 'Trolling lure, flying fish, squid',    regulation: 'No minimum · no limit',  when: 'Open ocean — major solunar periods' },
    { name: 'Yellowfin Tuna (Ahi)',icon: '🎣', color: '#f97316', bait: 'Popper, jig, trolling lure',           regulation: 'No minimum · no limit',  when: 'Blue water — dawn & major solunar' },
    { name: 'Blue Marlin',        icon: '🎣', color: '#38bdf8', bait: 'Trolling lure, live bait, circle hook', regulation: 'Catch & release encouraged', when: 'Deep water — major solunar midday' },
    { name: "Bonefish (O'io)",   icon: '🐡', color: '#34d399', bait: 'Live shrimp, crab fly, bonefish jig',  regulation: 'Bag limit: 10/day',      when: 'Incoming tide on shallow flats — dawn' },
    { name: 'Ulua (Giant Trevally)',icon: '🐡', color: '#a78bfa', bait: 'Live bait, large popper, jig',        regulation: '10″ min · 1 per species/day', when: 'Moving tide — rocky shores & channel edges' },
  ],
  },
  {
    id: "1617760", waterTempId: "1617760",
    name: "HILO", slug: "hilo",
    state: "hawaii", city: "HILO, HI", region: "Hawaii (Big Island)",
    lat: 19.73027777777778, lon: -155.0555555555555, latDisplay: "19.73°N", lonDisplay: "155.06°W",
    sunLat: 19.73, sunMeridian: 150, sunLon: 155.06, utcOffset: -4,
    sunriseRef: 6.82, sunsetRef: 18.19,
    tidalType: 'mixed', meanRange: 1.5, waterTempDefault: '78°F',
    nearby: [
    { name: "Kawaihae", lat: 20.0366, lon: -155.8294, slug: "kawaihae" },
    { name: "Honuapo", lat: 19.0883, lon: -155.553, slug: "honuapo" },
    { name: "Napoopoo, Kealakekua Bay", lat: 19.4767, lon: -155.922, slug: "napoopoo-kealakekua-bay" },
    { name: "Kailua Kona", lat: 19.6433, lon: -156, slug: "kailua-kona" }
    ],
    species: [
    { name: 'Mahi-Mahi (Dorado)', icon: '🐟', color: '#60a5fa', bait: 'Trolling lure, flying fish, squid',    regulation: 'No minimum · no limit',  when: 'Open ocean — major solunar periods' },
    { name: 'Yellowfin Tuna (Ahi)',icon: '🎣', color: '#f97316', bait: 'Popper, jig, trolling lure',           regulation: 'No minimum · no limit',  when: 'Blue water — dawn & major solunar' },
    { name: 'Blue Marlin',        icon: '🎣', color: '#38bdf8', bait: 'Trolling lure, live bait, circle hook', regulation: 'Catch & release encouraged', when: 'Deep water — major solunar midday' },
    { name: "Bonefish (O'io)",   icon: '🐡', color: '#34d399', bait: 'Live shrimp, crab fly, bonefish jig',  regulation: 'Bag limit: 10/day',      when: 'Incoming tide on shallow flats — dawn' },
    { name: 'Ulua (Giant Trevally)',icon: '🐡', color: '#a78bfa', bait: 'Live bait, large popper, jig',        regulation: '10″ min · 1 per species/day', when: 'Moving tide — rocky shores & channel edges' },
  ],
  },
  {
    id: "1617846", waterTempId: "1617846",
    name: "Kailua Kona", slug: "kailua-kona",
    state: "hawaii", city: "Kailua Kona, HI", region: "Hawaii (Big Island)",
    lat: 19.6433, lon: -156, latDisplay: "19.64°N", lonDisplay: "156.00°W",
    sunLat: 19.64, sunMeridian: 150, sunLon: 156, utcOffset: -4,
    sunriseRef: 6.82, sunsetRef: 18.19,
    tidalType: 'mixed', meanRange: 1.5, waterTempDefault: '78°F',
    nearby: [
    { name: "Napoopoo, Kealakekua Bay", lat: 19.4767, lon: -155.922, slug: "napoopoo-kealakekua-bay" },
    { name: "Kawaihae", lat: 20.0366, lon: -155.8294, slug: "kawaihae" },
    { name: "Mahukona", lat: 20.1867, lon: -155.903, slug: "mahukona" },
    { name: "Honuapo", lat: 19.0883, lon: -155.553, slug: "honuapo" }
    ],
    species: [
    { name: 'Mahi-Mahi (Dorado)', icon: '🐟', color: '#60a5fa', bait: 'Trolling lure, flying fish, squid',    regulation: 'No minimum · no limit',  when: 'Open ocean — major solunar periods' },
    { name: 'Yellowfin Tuna (Ahi)',icon: '🎣', color: '#f97316', bait: 'Popper, jig, trolling lure',           regulation: 'No minimum · no limit',  when: 'Blue water — dawn & major solunar' },
    { name: 'Blue Marlin',        icon: '🎣', color: '#38bdf8', bait: 'Trolling lure, live bait, circle hook', regulation: 'Catch & release encouraged', when: 'Deep water — major solunar midday' },
    { name: "Bonefish (O'io)",   icon: '🐡', color: '#34d399', bait: 'Live shrimp, crab fly, bonefish jig',  regulation: 'Bag limit: 10/day',      when: 'Incoming tide on shallow flats — dawn' },
    { name: 'Ulua (Giant Trevally)',icon: '🐡', color: '#a78bfa', bait: 'Live bait, large popper, jig',        regulation: '10″ min · 1 per species/day', when: 'Moving tide — rocky shores & channel edges' },
  ],
  },
  {
    id: "1618021", waterTempId: "1618021",
    name: "Napoopoo, Kealakekua Bay", slug: "napoopoo-kealakekua-bay",
    state: "hawaii", city: "Napoopoo, Kealakekua Bay, HI", region: "Hawaii (Big Island)",
    lat: 19.4767, lon: -155.922, latDisplay: "19.48°N", lonDisplay: "155.92°W",
    sunLat: 19.48, sunMeridian: 150, sunLon: 155.92, utcOffset: -4,
    sunriseRef: 6.83, sunsetRef: 18.18,
    tidalType: 'mixed', meanRange: 1.5, waterTempDefault: '78°F',
    nearby: [
    { name: "Kailua Kona", lat: 19.6433, lon: -156, slug: "kailua-kona" },
    { name: "Honuapo", lat: 19.0883, lon: -155.553, slug: "honuapo" },
    { name: "Kawaihae", lat: 20.0366, lon: -155.8294, slug: "kawaihae" },
    { name: "Mahukona", lat: 20.1867, lon: -155.903, slug: "mahukona" }
    ],
    species: [
    { name: 'Mahi-Mahi (Dorado)', icon: '🐟', color: '#60a5fa', bait: 'Trolling lure, flying fish, squid',    regulation: 'No minimum · no limit',  when: 'Open ocean — major solunar periods' },
    { name: 'Yellowfin Tuna (Ahi)',icon: '🎣', color: '#f97316', bait: 'Popper, jig, trolling lure',           regulation: 'No minimum · no limit',  when: 'Blue water — dawn & major solunar' },
    { name: 'Blue Marlin',        icon: '🎣', color: '#38bdf8', bait: 'Trolling lure, live bait, circle hook', regulation: 'Catch & release encouraged', when: 'Deep water — major solunar midday' },
    { name: "Bonefish (O'io)",   icon: '🐡', color: '#34d399', bait: 'Live shrimp, crab fly, bonefish jig',  regulation: 'Bag limit: 10/day',      when: 'Incoming tide on shallow flats — dawn' },
    { name: 'Ulua (Giant Trevally)',icon: '🐡', color: '#a78bfa', bait: 'Live bait, large popper, jig',        regulation: '10″ min · 1 per species/day', when: 'Moving tide — rocky shores & channel edges' },
  ],
  },
  {
    id: "1618578", waterTempId: "1618578",
    name: "Honuapo", slug: "honuapo",
    state: "hawaii", city: "Honuapo, HI", region: "Hawaii (Big Island)",
    lat: 19.0883, lon: -155.553, latDisplay: "19.09°N", lonDisplay: "155.55°W",
    sunLat: 19.09, sunMeridian: 150, sunLon: 155.55, utcOffset: -4,
    sunriseRef: 6.85, sunsetRef: 18.16,
    tidalType: 'mixed', meanRange: 1.5, waterTempDefault: '78°F',
    nearby: [
    { name: "Napoopoo, Kealakekua Bay", lat: 19.4767, lon: -155.922, slug: "napoopoo-kealakekua-bay" },
    { name: "Kailua Kona", lat: 19.6433, lon: -156, slug: "kailua-kona" },
    { name: "HILO", lat: 19.73027777777778, lon: -155.0555555555555, slug: "hilo" },
    { name: "Kawaihae", lat: 20.0366, lon: -155.8294, slug: "kawaihae" }
    ],
    species: [
    { name: 'Mahi-Mahi (Dorado)', icon: '🐟', color: '#60a5fa', bait: 'Trolling lure, flying fish, squid',    regulation: 'No minimum · no limit',  when: 'Open ocean — major solunar periods' },
    { name: 'Yellowfin Tuna (Ahi)',icon: '🎣', color: '#f97316', bait: 'Popper, jig, trolling lure',           regulation: 'No minimum · no limit',  when: 'Blue water — dawn & major solunar' },
    { name: 'Blue Marlin',        icon: '🎣', color: '#38bdf8', bait: 'Trolling lure, live bait, circle hook', regulation: 'Catch & release encouraged', when: 'Deep water — major solunar midday' },
    { name: "Bonefish (O'io)",   icon: '🐡', color: '#34d399', bait: 'Live shrimp, crab fly, bonefish jig',  regulation: 'Bag limit: 10/day',      when: 'Incoming tide on shallow flats — dawn' },
    { name: 'Ulua (Giant Trevally)',icon: '🐡', color: '#a78bfa', bait: 'Live bait, large popper, jig',        regulation: '10″ min · 1 per species/day', when: 'Moving tide — rocky shores & channel edges' },
  ],
  },
  {
    id: "1619222", waterTempId: "1619222",
    name: "East Island, French Frigate Shoals", slug: "east-island-french-frigate-shoals",
    state: "hawaii", city: "East Island, French Frigate Shoals, HI", region: "Kauai / Niihau",
    lat: 23.783300399780273, lon: -166.20799255371094, latDisplay: "23.78°N", lonDisplay: "166.21°W",
    sunLat: 23.78, sunMeridian: 150, sunLon: 166.21, utcOffset: -4,
    sunriseRef: 6.57, sunsetRef: 18.35,
    tidalType: 'mixed', meanRange: 1.5, waterTempDefault: '78°F',
    nearby: [
    { name: "Laysan Island", lat: 25.766700744628906, lon: -171.75, slug: "laysan-island" },
    { name: "Nonopapa, Niihau Island", lat: 21.87, lon: -160.235, slug: "nonopapa-niihau-island" },
    { name: "Waimea Bay", lat: 21.9567, lon: -159.673, slug: "waimea-bay" },
    { name: "Hanalei Bay", lat: 22.215, lon: -159.502, slug: "hanalei-bay" }
    ],
    species: [
    { name: 'Mahi-Mahi (Dorado)', icon: '🐟', color: '#60a5fa', bait: 'Trolling lure, flying fish, squid',    regulation: 'No minimum · no limit',  when: 'Open ocean — major solunar periods' },
    { name: 'Yellowfin Tuna (Ahi)',icon: '🎣', color: '#f97316', bait: 'Popper, jig, trolling lure',           regulation: 'No minimum · no limit',  when: 'Blue water — dawn & major solunar' },
    { name: 'Blue Marlin',        icon: '🎣', color: '#38bdf8', bait: 'Trolling lure, live bait, circle hook', regulation: 'Catch & release encouraged', when: 'Deep water — major solunar midday' },
    { name: "Bonefish (O'io)",   icon: '🐡', color: '#34d399', bait: 'Live shrimp, crab fly, bonefish jig',  regulation: 'Bag limit: 10/day',      when: 'Incoming tide on shallow flats — dawn' },
    { name: 'Ulua (Giant Trevally)',icon: '🐡', color: '#a78bfa', bait: 'Live bait, large popper, jig',        regulation: '10″ min · 1 per species/day', when: 'Moving tide — rocky shores & channel edges' },
  ],
  },
  {
    id: "1619645", waterTempId: "1619645",
    name: "Laysan Island", slug: "laysan-island",
    state: "hawaii", city: "Laysan Island, HI", region: "Kauai / Niihau",
    lat: 25.766700744628906, lon: -171.75, latDisplay: "25.77°N", lonDisplay: "171.75°W",
    sunLat: 25.77, sunMeridian: 150, sunLon: 171.75, utcOffset: -4,
    sunriseRef: 6.45, sunsetRef: 18.43,
    tidalType: 'mixed', meanRange: 1.5, waterTempDefault: '78°F',
    nearby: [
    { name: "East Island, French Frigate Shoals", lat: 23.783300399780273, lon: -166.20799255371094, slug: "east-island-french-frigate-shoals" },
    { name: "Nonopapa, Niihau Island", lat: 21.87, lon: -160.235, slug: "nonopapa-niihau-island" },
    { name: "Waimea Bay", lat: 21.9567, lon: -159.673, slug: "waimea-bay" },
    { name: "Hanalei Bay", lat: 22.215, lon: -159.502, slug: "hanalei-bay" }
    ],
    species: [
    { name: 'Mahi-Mahi (Dorado)', icon: '🐟', color: '#60a5fa', bait: 'Trolling lure, flying fish, squid',    regulation: 'No minimum · no limit',  when: 'Open ocean — major solunar periods' },
    { name: 'Yellowfin Tuna (Ahi)',icon: '🎣', color: '#f97316', bait: 'Popper, jig, trolling lure',           regulation: 'No minimum · no limit',  when: 'Blue water — dawn & major solunar' },
    { name: 'Blue Marlin',        icon: '🎣', color: '#38bdf8', bait: 'Trolling lure, live bait, circle hook', regulation: 'Catch & release encouraged', when: 'Deep water — major solunar midday' },
    { name: "Bonefish (O'io)",   icon: '🐡', color: '#34d399', bait: 'Live shrimp, crab fly, bonefish jig',  regulation: 'Bag limit: 10/day',      when: 'Incoming tide on shallow flats — dawn' },
    { name: 'Ulua (Giant Trevally)',icon: '🐡', color: '#a78bfa', bait: 'Live bait, large popper, jig',        regulation: '10″ min · 1 per species/day', when: 'Moving tide — rocky shores & channel edges' },
  ],
  },
  {
    id: "1612479", waterTempId: "1612479",
    name: "MOKUOLOE, KANEONE BAY, OAHU IS. (BACKUP)", slug: "mokuoloe-kaneone-bay-oahu-is-backup",
    state: "hawaii", city: "MOKUOLOE, KANEONE BAY, OAHU IS. (BACKUP), HI", region: "Oahu",
    lat: 21.435, lon: -157.792, latDisplay: "21.43°N", lonDisplay: "157.79°W",
    sunLat: 21.44, sunMeridian: 150, sunLon: 157.79, utcOffset: -4,
    sunriseRef: 6.71, sunsetRef: 18.26,
    tidalType: 'mixed', meanRange: 1.5, waterTempDefault: '78°F',
    nearby: [
    { name: "MOKU O LOE", lat: 21.43305555555556, lon: -157.79, slug: "moku-o-loe" },
    { name: "Waimanalo", lat: 21.335, lon: -157.693, slug: "waimanalo" },
    { name: "HONOLULU", lat: 21.30333333333334, lon: -157.8645277777778, slug: "honolulu" },
    { name: "Pearl Harbor, Ford Island Ferry", lat: 21.3683, lon: -157.94, slug: "pearl-harbor-ford-island-ferry" }
    ],
    species: [
    { name: 'Mahi-Mahi (Dorado)', icon: '🐟', color: '#60a5fa', bait: 'Trolling lure, flying fish, squid',    regulation: 'No minimum · no limit',  when: 'Open ocean — major solunar periods' },
    { name: 'Yellowfin Tuna (Ahi)',icon: '🎣', color: '#f97316', bait: 'Popper, jig, trolling lure',           regulation: 'No minimum · no limit',  when: 'Blue water — dawn & major solunar' },
    { name: 'Blue Marlin',        icon: '🎣', color: '#38bdf8', bait: 'Trolling lure, live bait, circle hook', regulation: 'Catch & release encouraged', when: 'Deep water — major solunar midday' },
    { name: "Bonefish (O'io)",   icon: '🐡', color: '#34d399', bait: 'Live shrimp, crab fly, bonefish jig',  regulation: 'Bag limit: 10/day',      when: 'Incoming tide on shallow flats — dawn' },
    { name: 'Ulua (Giant Trevally)',icon: '🐡', color: '#a78bfa', bait: 'Live bait, large popper, jig',        regulation: '10″ min · 1 per species/day', when: 'Moving tide — rocky shores & channel edges' },
  ],
  },
  {
    id: "1612702", waterTempId: "1612702",
    name: "LAIEMALOO, OAHU ISLAND", slug: "laiemaloo-oahu-island",
    state: "hawaii", city: "LAIEMALOO, OAHU ISLAND, HI", region: "Kauai / Niihau",
    lat: 21.6367, lon: -157.922, latDisplay: "21.64°N", lonDisplay: "157.92°W",
    sunLat: 21.64, sunMeridian: 150, sunLon: 157.92, utcOffset: -4,
    sunriseRef: 6.7, sunsetRef: 18.27,
    tidalType: 'mixed', meanRange: 1.5, waterTempDefault: '78°F',
    nearby: [
    { name: "Haleiwa, Waialua Bay", lat: 21.5983, lon: -158.108, slug: "haleiwa-waialua-bay" },
    { name: "MOKUOLOE, KANEONE BAY, OAHU IS. (BACKUP)", lat: 21.435, lon: -157.792, slug: "mokuoloe-kaneone-bay-oahu-is-backup" },
    { name: "MOKU O LOE", lat: 21.43305555555556, lon: -157.79, slug: "moku-o-loe" },
    { name: "Pearl Harbor, Ford Island Ferry", lat: 21.3683, lon: -157.94, slug: "pearl-harbor-ford-island-ferry" }
    ],
    species: [
    { name: 'Mahi-Mahi (Dorado)', icon: '🐟', color: '#60a5fa', bait: 'Trolling lure, flying fish, squid',    regulation: 'No minimum · no limit',  when: 'Open ocean — major solunar periods' },
    { name: 'Yellowfin Tuna (Ahi)',icon: '🎣', color: '#f97316', bait: 'Popper, jig, trolling lure',           regulation: 'No minimum · no limit',  when: 'Blue water — dawn & major solunar' },
    { name: 'Blue Marlin',        icon: '🎣', color: '#38bdf8', bait: 'Trolling lure, live bait, circle hook', regulation: 'Catch & release encouraged', when: 'Deep water — major solunar midday' },
    { name: "Bonefish (O'io)",   icon: '🐡', color: '#34d399', bait: 'Live shrimp, crab fly, bonefish jig',  regulation: 'Bag limit: 10/day',      when: 'Incoming tide on shallow flats — dawn' },
    { name: 'Ulua (Giant Trevally)',icon: '🐡', color: '#a78bfa', bait: 'Live bait, large popper, jig',        regulation: '10″ min · 1 per species/day', when: 'Moving tide — rocky shores & channel edges' },
  ],
  },
]

export function getStationBySlug(slug: string): StationConfig | undefined {
  return HAWAII_STATIONS.find(s => s.slug === slug)
}
export function getAllSlugs(): string[] {
  return HAWAII_STATIONS.map(s => s.slug)
}
