export default function Home() {
  return (
    <main className="min-h-screen bg-gray-950 text-white">

      {/* Nav */}
      <nav className="border-b border-gray-800 bg-gray-950/90 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="text-lg font-medium">
            Tide<span className="text-blue-400">Charts</span>Pro
          </div>
          <div className="hidden md:flex gap-6 text-sm text-gray-400">
            <a href="/tides" className="hover:text-white transition-colors">Tides</a>
            <a href="/fishing" className="hover:text-white transition-colors">Fishing</a>
            <a href="/map" className="hover:text-white transition-colors">Map</a>
            <a href="/forecast" className="hover:text-white transition-colors">Forecast</a>
          </div>
          <button className="text-sm bg-blue-600 hover:bg-blue-500 px-4 py-1.5 rounded-lg transition-colors">
            Get the app
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 pt-20 pb-16 text-center">
        <div className="inline-block text-xs font-medium bg-blue-950 text-blue-300 border border-blue-800 px-3 py-1 rounded-full mb-6">
          Powered by NOAA — updated every 6 minutes
        </div>
        <h1 className="text-4xl md:text-5xl font-medium mb-4 leading-tight">
          Tide charts built for<br />
          <span className="text-blue-400">serious anglers</span>
        </h1>
        <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto">
          Real-time tides, solunar periods, species bite times, and fishing forecasts
          for 3,000+ locations across the US coast.
        </p>
        <div className="flex max-w-lg mx-auto mb-4">
          <input
            type="text"
            placeholder="Search city, inlet, beach..."
            className="flex-1 bg-gray-900 border border-gray-700 rounded-l-xl px-4 py-3 text-sm outline-none focus:border-blue-500 transition-colors placeholder-gray-500"
          />
          <button className="bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-r-xl text-sm font-medium transition-colors">
            Search
          </button>
        </div>
        <div className="flex flex-wrap gap-2 justify-center text-xs text-gray-400">
          {['Jacksonville FL', 'Miami Beach', 'Tampa Bay', 'Chesapeake VA', 'Cape Cod MA', 'Galveston TX'].map(loc => (
            <button key={loc} className="bg-gray-900 hover:bg-gray-800 border border-gray-800 px-3 py-1.5 rounded-full transition-colors">
              {loc}
            </button>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-gray-800 bg-gray-900/50">
        <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { n: '3,200+', l: 'NOAA tide stations' },
            { n: '6 min', l: 'Update frequency' },
            { n: '25+', l: 'Species tracked' },
            { n: '50', l: 'US states covered' },
          ].map(s => (
            <div key={s.l}>
              <div className="text-2xl font-medium text-white mb-1">{s.n}</div>
              <div className="text-xs text-gray-400">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-medium text-center mb-10">Everything you need on the water</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: '🌊', title: 'Live tide charts', desc: 'Real-time water level plotted on the predicted curve. See exactly where the tide is right now.' },
            { icon: '🎣', title: 'Fishing score', desc: 'Daily A-F grade combining tide phase, pressure trend, solunar periods, and water temp.' },
            { icon: '🐟', title: 'Species bite times', desc: 'Location-aware guide showing what is biting today, best windows, hot baits, and regulations.' },
            { icon: '🌙', title: 'Solunar periods', desc: 'Major and minor feeding periods based on lunar transit. Aligned with your local tide.' },
            { icon: '🔴', title: 'Red night vision mode', desc: 'Preserves your natural night vision while checking tides. Built for serious night anglers.' },
            { icon: '📍', title: 'Fishing map', desc: 'All NOAA stations, boat ramps, piers, and marinas on one interactive map.' },
          ].map(f => (
            <div key={f.title} className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-colors">
              <div className="text-2xl mb-3">{f.icon}</div>
              <div className="font-medium mb-2">{f.title}</div>
              <div className="text-sm text-gray-400 leading-relaxed">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* States */}
      <section className="bg-gray-900/50 border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-14">
          <h2 className="text-2xl font-medium text-center mb-2">Browse tide charts by state</h2>
          <p className="text-gray-400 text-center text-sm mb-8">Real-time tides and fishing forecasts for every US coastal location</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { name: 'Florida', count: '312 stations' },
              { name: 'Texas', count: '168 stations' },
              { name: 'California', count: '198 stations' },
              { name: 'New York', count: '186 stations' },
              { name: 'Virginia', count: '124 stations' },
              { name: 'Louisiana', count: '142 stations' },
              { name: 'Massachusetts', count: '158 stations' },
              { name: 'Washington', count: '112 stations' },
            ].map(s => (
              <a key={s.name} href={`/tides/${s.name.toLowerCase()}`}
                className="bg-gray-900 hover:bg-gray-800 border border-gray-800 hover:border-gray-700 rounded-xl p-4 text-center transition-colors group">
                <div className="font-medium group-hover:text-blue-400 transition-colors">{s.name}</div>
                <div className="text-xs text-gray-500 mt-1">{s.count}</div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-gray-950">
        <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm font-medium">Tide<span className="text-blue-400">Charts</span>Pro</div>
          <div className="flex gap-6 text-xs text-gray-500">
            <a href="/tides" className="hover:text-gray-300">Tides</a>
            <a href="/fishing" className="hover:text-gray-300">Fishing</a>
            <a href="/map" className="hover:text-gray-300">Map</a>
            <a href="#" className="hover:text-gray-300">Privacy</a>
          </div>
          <div className="text-xs text-gray-600">Data: NOAA CO-OPS · 2026 TideChartsPro</div>
        </div>
      </footer>

    </main>
  )
}
