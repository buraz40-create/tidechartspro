// AUTO-GENERATED — do not edit by hand.
// Source: NOAA CO-OPS tide prediction stations, New Hampshire
// Regenerate: node apps/web/scripts/generate-all-states.mjs

import type { StationConfig, NearbyStation, Species } from './florida-stations'
export type { StationConfig, NearbyStation, Species }

export const NEW_HAMPSHIRE_STATIONS: StationConfig[] = [
  {
    id: "8420411", waterTempId: "8420411",
    name: "Dover, Cocheco River", slug: "dover-cocheco-river",
    state: "new-hampshire", city: "Dover, Cocheco River, NH", region: "New Hampshire Seacoast",
    lat: 43.1983, lon: -70.8683, latDisplay: "43.20°N", lonDisplay: "70.87°W",
    sunLat: 43.2, sunMeridian: 75, sunLon: 70.87, utcOffset: 1,
    sunriseRef: 6.41, sunsetRef: 20.33,
    tidalType: 'semidiurnal', meanRange: 8.5, waterTempDefault: '50°F',
    nearby: [
    { name: "Dover Point", lat: 43.1217, lon: -70.8333, slug: "dover-point" },
    { name: "ATLANTIC TERMINALS  T14A", lat: 43.1167, lon: -70.8117, slug: "atlantic-terminals-t14a" },
    { name: "ADAMS POINT, DURHAM", lat: 43.0933, lon: -70.8633, slug: "adams-point-durham" },
    { name: "Atlantic Heights", lat: 43.09, lon: -70.7633, slug: "atlantic-heights" }
    ],
    species: [
    { name: 'Striped Bass',       icon: '🎣', color: '#38bdf8', bait: 'Live bunker, swim shad, live eel, lure', regulation: '28″ min · check season', when: 'Moving tide — rips, rocky points, surfcasting' },
    { name: 'Bluefish',           icon: '🐟', color: '#60a5fa', bait: 'Metal jig, popper, topwater',             regulation: '10″ min · 10/day',       when: 'Outgoing tide — inlets & open water schools' },
    { name: 'Tautog (Blackfish)', icon: '🐡', color: '#a78bfa', bait: 'Green crab, fiddler crab, sand flea',    regulation: '16″ min · varies',       when: 'Slack tide — wrecks, rocks, ledges, jetties' },
    { name: 'Atlantic Cod',       icon: '🐡', color: '#34d399', bait: 'Clam, squid, jig, cut fish',              regulation: '21″ min · check season', when: 'Cold water deep structure — moving tide' },
    { name: 'Pollock',            icon: '🐡', color: '#facc15', bait: 'Jig, metal spoon, soft plastic',          regulation: 'No minimum · no limit',  when: 'Moving tide — midwater column near structure' },
  ],
  },
  {
    id: "8421897", waterTempId: "8421897",
    name: "Dover Point", slug: "dover-point",
    state: "new-hampshire", city: "Dover Point, NH", region: "New Hampshire Seacoast",
    lat: 43.1217, lon: -70.8333, latDisplay: "43.12°N", lonDisplay: "70.83°W",
    sunLat: 43.12, sunMeridian: 75, sunLon: 70.83, utcOffset: 1,
    sunriseRef: 6.41, sunsetRef: 20.32,
    tidalType: 'semidiurnal', meanRange: 8.5, waterTempDefault: '50°F',
    nearby: [
    { name: "ATLANTIC TERMINALS  T14A", lat: 43.1167, lon: -70.8117, slug: "atlantic-terminals-t14a" },
    { name: "ADAMS POINT, DURHAM", lat: 43.0933, lon: -70.8633, slug: "adams-point-durham" },
    { name: "Atlantic Heights", lat: 43.09, lon: -70.7633, slug: "atlantic-heights" },
    { name: "BRACKETTS POINT", lat: 43.06, lon: -70.8683, slug: "bracketts-point" }
    ],
    species: [
    { name: 'Striped Bass',       icon: '🎣', color: '#38bdf8', bait: 'Live bunker, swim shad, live eel, lure', regulation: '28″ min · check season', when: 'Moving tide — rips, rocky points, surfcasting' },
    { name: 'Bluefish',           icon: '🐟', color: '#60a5fa', bait: 'Metal jig, popper, topwater',             regulation: '10″ min · 10/day',       when: 'Outgoing tide — inlets & open water schools' },
    { name: 'Tautog (Blackfish)', icon: '🐡', color: '#a78bfa', bait: 'Green crab, fiddler crab, sand flea',    regulation: '16″ min · varies',       when: 'Slack tide — wrecks, rocks, ledges, jetties' },
    { name: 'Atlantic Cod',       icon: '🐡', color: '#34d399', bait: 'Clam, squid, jig, cut fish',              regulation: '21″ min · check season', when: 'Cold water deep structure — moving tide' },
    { name: 'Pollock',            icon: '🐡', color: '#facc15', bait: 'Jig, metal spoon, soft plastic',          regulation: 'No minimum · no limit',  when: 'Moving tide — midwater column near structure' },
  ],
  },
  {
    id: "8422687", waterTempId: "8422687",
    name: "Squamscott River RR. Bridge", slug: "squamscott-river-rr-bridge",
    state: "new-hampshire", city: "Squamscott River RR. Bridge, NH", region: "New Hampshire Seacoast",
    lat: 43.0533, lon: -70.9133, latDisplay: "43.05°N", lonDisplay: "70.91°W",
    sunLat: 43.05, sunMeridian: 75, sunLon: 70.91, utcOffset: 1,
    sunriseRef: 6.42, sunsetRef: 20.32,
    tidalType: 'semidiurnal', meanRange: 8.5, waterTempDefault: '50°F',
    nearby: [
    { name: "BRACKETTS POINT", lat: 43.06, lon: -70.8683, slug: "bracketts-point" },
    { name: "ADAMS POINT, DURHAM", lat: 43.0933, lon: -70.8633, slug: "adams-point-durham" },
    { name: "Dover Point", lat: 43.1217, lon: -70.8333, slug: "dover-point" },
    { name: "ATLANTIC TERMINALS  T14A", lat: 43.1167, lon: -70.8117, slug: "atlantic-terminals-t14a" }
    ],
    species: [
    { name: 'Striped Bass',       icon: '🎣', color: '#38bdf8', bait: 'Live bunker, swim shad, live eel, lure', regulation: '28″ min · check season', when: 'Moving tide — rips, rocky points, surfcasting' },
    { name: 'Bluefish',           icon: '🐟', color: '#60a5fa', bait: 'Metal jig, popper, topwater',             regulation: '10″ min · 10/day',       when: 'Outgoing tide — inlets & open water schools' },
    { name: 'Tautog (Blackfish)', icon: '🐡', color: '#a78bfa', bait: 'Green crab, fiddler crab, sand flea',    regulation: '16″ min · varies',       when: 'Slack tide — wrecks, rocks, ledges, jetties' },
    { name: 'Atlantic Cod',       icon: '🐡', color: '#34d399', bait: 'Clam, squid, jig, cut fish',              regulation: '21″ min · check season', when: 'Cold water deep structure — moving tide' },
    { name: 'Pollock',            icon: '🐡', color: '#facc15', bait: 'Jig, metal spoon, soft plastic',          regulation: 'No minimum · no limit',  when: 'Moving tide — midwater column near structure' },
  ],
  },
  {
    id: "8423635", waterTempId: "8423635",
    name: "Atlantic Heights", slug: "atlantic-heights",
    state: "new-hampshire", city: "Atlantic Heights, NH", region: "New Hampshire Seacoast",
    lat: 43.09, lon: -70.7633, latDisplay: "43.09°N", lonDisplay: "70.76°W",
    sunLat: 43.09, sunMeridian: 75, sunLon: 70.76, utcOffset: 1,
    sunriseRef: 6.41, sunsetRef: 20.32,
    tidalType: 'semidiurnal', meanRange: 8.5, waterTempDefault: '50°F',
    nearby: [
    { name: "Portsmouth", lat: 43.0783, lon: -70.7517, slug: "portsmouth" },
    { name: "Fort Point", lat: 43.07170104980469, lon: -70.71170043945312, slug: "fort-point" },
    { name: "ATLANTIC TERMINALS  T14A", lat: 43.1167, lon: -70.8117, slug: "atlantic-terminals-t14a" },
    { name: "Jaffrey Point", lat: 43.0567, lon: -70.7133, slug: "jaffrey-point" }
    ],
    species: [
    { name: 'Striped Bass',       icon: '🎣', color: '#38bdf8', bait: 'Live bunker, swim shad, live eel, lure', regulation: '28″ min · check season', when: 'Moving tide — rips, rocky points, surfcasting' },
    { name: 'Bluefish',           icon: '🐟', color: '#60a5fa', bait: 'Metal jig, popper, topwater',             regulation: '10″ min · 10/day',       when: 'Outgoing tide — inlets & open water schools' },
    { name: 'Tautog (Blackfish)', icon: '🐡', color: '#a78bfa', bait: 'Green crab, fiddler crab, sand flea',    regulation: '16″ min · varies',       when: 'Slack tide — wrecks, rocks, ledges, jetties' },
    { name: 'Atlantic Cod',       icon: '🐡', color: '#34d399', bait: 'Clam, squid, jig, cut fish',              regulation: '21″ min · check season', when: 'Cold water deep structure — moving tide' },
    { name: 'Pollock',            icon: '🐡', color: '#facc15', bait: 'Jig, metal spoon, soft plastic',          regulation: 'No minimum · no limit',  when: 'Moving tide — midwater column near structure' },
  ],
  },
  {
    id: "8423745", waterTempId: "8423745",
    name: "Portsmouth", slug: "portsmouth",
    state: "new-hampshire", city: "Portsmouth, NH", region: "New Hampshire Seacoast",
    lat: 43.0783, lon: -70.7517, latDisplay: "43.08°N", lonDisplay: "70.75°W",
    sunLat: 43.08, sunMeridian: 75, sunLon: 70.75, utcOffset: 1,
    sunriseRef: 6.42, sunsetRef: 20.32,
    tidalType: 'semidiurnal', meanRange: 8.5, waterTempDefault: '50°F',
    nearby: [
    { name: "Atlantic Heights", lat: 43.09, lon: -70.7633, slug: "atlantic-heights" },
    { name: "Fort Point", lat: 43.07170104980469, lon: -70.71170043945312, slug: "fort-point" },
    { name: "Jaffrey Point", lat: 43.0567, lon: -70.7133, slug: "jaffrey-point" },
    { name: "ATLANTIC TERMINALS  T14A", lat: 43.1167, lon: -70.8117, slug: "atlantic-terminals-t14a" }
    ],
    species: [
    { name: 'Striped Bass',       icon: '🎣', color: '#38bdf8', bait: 'Live bunker, swim shad, live eel, lure', regulation: '28″ min · check season', when: 'Moving tide — rips, rocky points, surfcasting' },
    { name: 'Bluefish',           icon: '🐟', color: '#60a5fa', bait: 'Metal jig, popper, topwater',             regulation: '10″ min · 10/day',       when: 'Outgoing tide — inlets & open water schools' },
    { name: 'Tautog (Blackfish)', icon: '🐡', color: '#a78bfa', bait: 'Green crab, fiddler crab, sand flea',    regulation: '16″ min · varies',       when: 'Slack tide — wrecks, rocks, ledges, jetties' },
    { name: 'Atlantic Cod',       icon: '🐡', color: '#34d399', bait: 'Clam, squid, jig, cut fish',              regulation: '21″ min · check season', when: 'Cold water deep structure — moving tide' },
    { name: 'Pollock',            icon: '🐡', color: '#facc15', bait: 'Jig, metal spoon, soft plastic',          regulation: 'No minimum · no limit',  when: 'Moving tide — midwater column near structure' },
  ],
  },
  {
    id: "8423898", waterTempId: "8423898",
    name: "Fort Point", slug: "fort-point",
    state: "new-hampshire", city: "Fort Point, NH", region: "New Hampshire Seacoast",
    lat: 43.07170104980469, lon: -70.71170043945312, latDisplay: "43.07°N", lonDisplay: "70.71°W",
    sunLat: 43.07, sunMeridian: 75, sunLon: 70.71, utcOffset: 1,
    sunriseRef: 6.42, sunsetRef: 20.32,
    tidalType: 'semidiurnal', meanRange: 8.5, waterTempDefault: '50°F',
    nearby: [
    { name: "Jaffrey Point", lat: 43.0567, lon: -70.7133, slug: "jaffrey-point" },
    { name: "Portsmouth", lat: 43.0783, lon: -70.7517, slug: "portsmouth" },
    { name: "Atlantic Heights", lat: 43.09, lon: -70.7633, slug: "atlantic-heights" },
    { name: "ATLANTIC TERMINALS  T14A", lat: 43.1167, lon: -70.8117, slug: "atlantic-terminals-t14a" }
    ],
    species: [
    { name: 'Striped Bass',       icon: '🎣', color: '#38bdf8', bait: 'Live bunker, swim shad, live eel, lure', regulation: '28″ min · check season', when: 'Moving tide — rips, rocky points, surfcasting' },
    { name: 'Bluefish',           icon: '🐟', color: '#60a5fa', bait: 'Metal jig, popper, topwater',             regulation: '10″ min · 10/day',       when: 'Outgoing tide — inlets & open water schools' },
    { name: 'Tautog (Blackfish)', icon: '🐡', color: '#a78bfa', bait: 'Green crab, fiddler crab, sand flea',    regulation: '16″ min · varies',       when: 'Slack tide — wrecks, rocks, ledges, jetties' },
    { name: 'Atlantic Cod',       icon: '🐡', color: '#34d399', bait: 'Clam, squid, jig, cut fish',              regulation: '21″ min · check season', when: 'Cold water deep structure — moving tide' },
    { name: 'Pollock',            icon: '🐡', color: '#facc15', bait: 'Jig, metal spoon, soft plastic',          regulation: 'No minimum · no limit',  when: 'Moving tide — midwater column near structure' },
  ],
  },
  {
    id: "8424601", waterTempId: "8424601",
    name: "Jaffrey Point", slug: "jaffrey-point",
    state: "new-hampshire", city: "Jaffrey Point, NH", region: "New Hampshire Seacoast",
    lat: 43.0567, lon: -70.7133, latDisplay: "43.06°N", lonDisplay: "70.71°W",
    sunLat: 43.06, sunMeridian: 75, sunLon: 70.71, utcOffset: 1,
    sunriseRef: 6.42, sunsetRef: 20.32,
    tidalType: 'semidiurnal', meanRange: 8.5, waterTempDefault: '50°F',
    nearby: [
    { name: "Fort Point", lat: 43.07170104980469, lon: -70.71170043945312, slug: "fort-point" },
    { name: "Portsmouth", lat: 43.0783, lon: -70.7517, slug: "portsmouth" },
    { name: "Atlantic Heights", lat: 43.09, lon: -70.7633, slug: "atlantic-heights" },
    { name: "ATLANTIC TERMINALS  T14A", lat: 43.1167, lon: -70.8117, slug: "atlantic-terminals-t14a" }
    ],
    species: [
    { name: 'Striped Bass',       icon: '🎣', color: '#38bdf8', bait: 'Live bunker, swim shad, live eel, lure', regulation: '28″ min · check season', when: 'Moving tide — rips, rocky points, surfcasting' },
    { name: 'Bluefish',           icon: '🐟', color: '#60a5fa', bait: 'Metal jig, popper, topwater',             regulation: '10″ min · 10/day',       when: 'Outgoing tide — inlets & open water schools' },
    { name: 'Tautog (Blackfish)', icon: '🐡', color: '#a78bfa', bait: 'Green crab, fiddler crab, sand flea',    regulation: '16″ min · varies',       when: 'Slack tide — wrecks, rocks, ledges, jetties' },
    { name: 'Atlantic Cod',       icon: '🐡', color: '#34d399', bait: 'Clam, squid, jig, cut fish',              regulation: '21″ min · check season', when: 'Cold water deep structure — moving tide' },
    { name: 'Pollock',            icon: '🐡', color: '#facc15', bait: 'Jig, metal spoon, soft plastic',          regulation: 'No minimum · no limit',  when: 'Moving tide — midwater column near structure' },
  ],
  },
  {
    id: "8427031", waterTempId: "8427031",
    name: "Gosport Harbor, Isles of Shoals", slug: "gosport-harbor-isles-of-shoals",
    state: "new-hampshire", city: "Gosport Harbor, Isles of Shoals, NH", region: "New Hampshire Seacoast",
    lat: 42.9783, lon: -70.615, latDisplay: "42.98°N", lonDisplay: "70.61°W",
    sunLat: 42.98, sunMeridian: 75, sunLon: 70.61, utcOffset: 1,
    sunriseRef: 6.42, sunsetRef: 20.32,
    tidalType: 'semidiurnal', meanRange: 8.5, waterTempDefault: '50°F',
    nearby: [
    { name: "Jaffrey Point", lat: 43.0567, lon: -70.7133, slug: "jaffrey-point" },
    { name: "Fort Point", lat: 43.07170104980469, lon: -70.71170043945312, slug: "fort-point" },
    { name: "Portsmouth", lat: 43.0783, lon: -70.7517, slug: "portsmouth" },
    { name: "Atlantic Heights", lat: 43.09, lon: -70.7633, slug: "atlantic-heights" }
    ],
    species: [
    { name: 'Striped Bass',       icon: '🎣', color: '#38bdf8', bait: 'Live bunker, swim shad, live eel, lure', regulation: '28″ min · check season', when: 'Moving tide — rips, rocky points, surfcasting' },
    { name: 'Bluefish',           icon: '🐟', color: '#60a5fa', bait: 'Metal jig, popper, topwater',             regulation: '10″ min · 10/day',       when: 'Outgoing tide — inlets & open water schools' },
    { name: 'Tautog (Blackfish)', icon: '🐡', color: '#a78bfa', bait: 'Green crab, fiddler crab, sand flea',    regulation: '16″ min · varies',       when: 'Slack tide — wrecks, rocks, ledges, jetties' },
    { name: 'Atlantic Cod',       icon: '🐡', color: '#34d399', bait: 'Clam, squid, jig, cut fish',              regulation: '21″ min · check season', when: 'Cold water deep structure — moving tide' },
    { name: 'Pollock',            icon: '🐡', color: '#facc15', bait: 'Jig, metal spoon, soft plastic',          regulation: 'No minimum · no limit',  when: 'Moving tide — midwater column near structure' },
  ],
  },
  {
    id: "8429489", waterTempId: "8429489",
    name: "Hampton Harbor", slug: "hampton-harbor",
    state: "new-hampshire", city: "Hampton Harbor, NH", region: "New Hampshire Seacoast",
    lat: 42.895, lon: -70.8167, latDisplay: "42.90°N", lonDisplay: "70.82°W",
    sunLat: 42.9, sunMeridian: 75, sunLon: 70.82, utcOffset: 1,
    sunriseRef: 6.43, sunsetRef: 20.32,
    tidalType: 'semidiurnal', meanRange: 8.5, waterTempDefault: '50°F',
    nearby: [
    { name: "BRACKETTS POINT", lat: 43.06, lon: -70.8683, slug: "bracketts-point" },
    { name: "Gosport Harbor, Isles of Shoals", lat: 42.9783, lon: -70.615, slug: "gosport-harbor-isles-of-shoals" },
    { name: "Squamscott River RR. Bridge", lat: 43.0533, lon: -70.9133, slug: "squamscott-river-rr-bridge" },
    { name: "Jaffrey Point", lat: 43.0567, lon: -70.7133, slug: "jaffrey-point" }
    ],
    species: [
    { name: 'Striped Bass',       icon: '🎣', color: '#38bdf8', bait: 'Live bunker, swim shad, live eel, lure', regulation: '28″ min · check season', when: 'Moving tide — rips, rocky points, surfcasting' },
    { name: 'Bluefish',           icon: '🐟', color: '#60a5fa', bait: 'Metal jig, popper, topwater',             regulation: '10″ min · 10/day',       when: 'Outgoing tide — inlets & open water schools' },
    { name: 'Tautog (Blackfish)', icon: '🐡', color: '#a78bfa', bait: 'Green crab, fiddler crab, sand flea',    regulation: '16″ min · varies',       when: 'Slack tide — wrecks, rocks, ledges, jetties' },
    { name: 'Atlantic Cod',       icon: '🐡', color: '#34d399', bait: 'Clam, squid, jig, cut fish',              regulation: '21″ min · check season', when: 'Cold water deep structure — moving tide' },
    { name: 'Pollock',            icon: '🐡', color: '#facc15', bait: 'Jig, metal spoon, soft plastic',          regulation: 'No minimum · no limit',  when: 'Moving tide — midwater column near structure' },
  ],
  },
  {
    id: "8422272", waterTempId: "8422272",
    name: "ADAMS POINT, DURHAM", slug: "adams-point-durham",
    state: "new-hampshire", city: "ADAMS POINT, DURHAM, NH", region: "New Hampshire Seacoast",
    lat: 43.0933, lon: -70.8633, latDisplay: "43.09°N", lonDisplay: "70.86°W",
    sunLat: 43.09, sunMeridian: 75, sunLon: 70.86, utcOffset: 1,
    sunriseRef: 6.41, sunsetRef: 20.32,
    tidalType: 'semidiurnal', meanRange: 8.5, waterTempDefault: '50°F',
    nearby: [
    { name: "BRACKETTS POINT", lat: 43.06, lon: -70.8683, slug: "bracketts-point" },
    { name: "Dover Point", lat: 43.1217, lon: -70.8333, slug: "dover-point" },
    { name: "ATLANTIC TERMINALS  T14A", lat: 43.1167, lon: -70.8117, slug: "atlantic-terminals-t14a" },
    { name: "Squamscott River RR. Bridge", lat: 43.0533, lon: -70.9133, slug: "squamscott-river-rr-bridge" }
    ],
    species: [
    { name: 'Striped Bass',       icon: '🎣', color: '#38bdf8', bait: 'Live bunker, swim shad, live eel, lure', regulation: '28″ min · check season', when: 'Moving tide — rips, rocky points, surfcasting' },
    { name: 'Bluefish',           icon: '🐟', color: '#60a5fa', bait: 'Metal jig, popper, topwater',             regulation: '10″ min · 10/day',       when: 'Outgoing tide — inlets & open water schools' },
    { name: 'Tautog (Blackfish)', icon: '🐡', color: '#a78bfa', bait: 'Green crab, fiddler crab, sand flea',    regulation: '16″ min · varies',       when: 'Slack tide — wrecks, rocks, ledges, jetties' },
    { name: 'Atlantic Cod',       icon: '🐡', color: '#34d399', bait: 'Clam, squid, jig, cut fish',              regulation: '21″ min · check season', when: 'Cold water deep structure — moving tide' },
    { name: 'Pollock',            icon: '🐡', color: '#facc15', bait: 'Jig, metal spoon, soft plastic',          regulation: 'No minimum · no limit',  when: 'Moving tide — midwater column near structure' },
  ],
  },
  {
    id: "8422301", waterTempId: "8422301",
    name: "BRACKETTS POINT", slug: "bracketts-point",
    state: "new-hampshire", city: "BRACKETTS POINT, NH", region: "New Hampshire Seacoast",
    lat: 43.06, lon: -70.8683, latDisplay: "43.06°N", lonDisplay: "70.87°W",
    sunLat: 43.06, sunMeridian: 75, sunLon: 70.87, utcOffset: 1,
    sunriseRef: 6.42, sunsetRef: 20.32,
    tidalType: 'semidiurnal', meanRange: 8.5, waterTempDefault: '50°F',
    nearby: [
    { name: "ADAMS POINT, DURHAM", lat: 43.0933, lon: -70.8633, slug: "adams-point-durham" },
    { name: "Squamscott River RR. Bridge", lat: 43.0533, lon: -70.9133, slug: "squamscott-river-rr-bridge" },
    { name: "Dover Point", lat: 43.1217, lon: -70.8333, slug: "dover-point" },
    { name: "ATLANTIC TERMINALS  T14A", lat: 43.1167, lon: -70.8117, slug: "atlantic-terminals-t14a" }
    ],
    species: [
    { name: 'Striped Bass',       icon: '🎣', color: '#38bdf8', bait: 'Live bunker, swim shad, live eel, lure', regulation: '28″ min · check season', when: 'Moving tide — rips, rocky points, surfcasting' },
    { name: 'Bluefish',           icon: '🐟', color: '#60a5fa', bait: 'Metal jig, popper, topwater',             regulation: '10″ min · 10/day',       when: 'Outgoing tide — inlets & open water schools' },
    { name: 'Tautog (Blackfish)', icon: '🐡', color: '#a78bfa', bait: 'Green crab, fiddler crab, sand flea',    regulation: '16″ min · varies',       when: 'Slack tide — wrecks, rocks, ledges, jetties' },
    { name: 'Atlantic Cod',       icon: '🐡', color: '#34d399', bait: 'Clam, squid, jig, cut fish',              regulation: '21″ min · check season', when: 'Cold water deep structure — moving tide' },
    { name: 'Pollock',            icon: '🐡', color: '#facc15', bait: 'Jig, metal spoon, soft plastic',          regulation: 'No minimum · no limit',  when: 'Moving tide — midwater column near structure' },
  ],
  },
  {
    id: "8423005", waterTempId: "8423005",
    name: "ATLANTIC TERMINALS  T14A", slug: "atlantic-terminals-t14a",
    state: "new-hampshire", city: "ATLANTIC TERMINALS  T14A, NH", region: "New Hampshire Seacoast",
    lat: 43.1167, lon: -70.8117, latDisplay: "43.12°N", lonDisplay: "70.81°W",
    sunLat: 43.12, sunMeridian: 75, sunLon: 70.81, utcOffset: 1,
    sunriseRef: 6.41, sunsetRef: 20.32,
    tidalType: 'semidiurnal', meanRange: 8.5, waterTempDefault: '50°F',
    nearby: [
    { name: "Dover Point", lat: 43.1217, lon: -70.8333, slug: "dover-point" },
    { name: "Atlantic Heights", lat: 43.09, lon: -70.7633, slug: "atlantic-heights" },
    { name: "ADAMS POINT, DURHAM", lat: 43.0933, lon: -70.8633, slug: "adams-point-durham" },
    { name: "Portsmouth", lat: 43.0783, lon: -70.7517, slug: "portsmouth" }
    ],
    species: [
    { name: 'Striped Bass',       icon: '🎣', color: '#38bdf8', bait: 'Live bunker, swim shad, live eel, lure', regulation: '28″ min · check season', when: 'Moving tide — rips, rocky points, surfcasting' },
    { name: 'Bluefish',           icon: '🐟', color: '#60a5fa', bait: 'Metal jig, popper, topwater',             regulation: '10″ min · 10/day',       when: 'Outgoing tide — inlets & open water schools' },
    { name: 'Tautog (Blackfish)', icon: '🐡', color: '#a78bfa', bait: 'Green crab, fiddler crab, sand flea',    regulation: '16″ min · varies',       when: 'Slack tide — wrecks, rocks, ledges, jetties' },
    { name: 'Atlantic Cod',       icon: '🐡', color: '#34d399', bait: 'Clam, squid, jig, cut fish',              regulation: '21″ min · check season', when: 'Cold water deep structure — moving tide' },
    { name: 'Pollock',            icon: '🐡', color: '#facc15', bait: 'Jig, metal spoon, soft plastic',          regulation: 'No minimum · no limit',  when: 'Moving tide — midwater column near structure' },
  ],
  },
]

export function getStationBySlug(slug: string): StationConfig | undefined {
  return NEW_HAMPSHIRE_STATIONS.find(s => s.slug === slug)
}
export function getAllSlugs(): string[] {
  return NEW_HAMPSHIRE_STATIONS.map(s => s.slug)
}
