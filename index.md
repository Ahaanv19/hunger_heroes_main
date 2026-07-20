---
layout: base
title: Home
search_exclude: true
nav: true
hide: true
---

<!-- Hero -->
<section class="relative overflow-hidden -mt-12 lg:-mt-20 pt-20 lg:pt-32 pb-20">
  <div class="absolute -top-32 -left-32 w-[500px] h-[500px] bg-primary-500 opacity-10 rounded-full blur-3xl pointer-events-none"></div>
  <div class="absolute -bottom-32 -right-32 w-[400px] h-[400px] bg-accent-500 opacity-10 rounded-full blur-3xl pointer-events-none"></div>

  <div class="relative max-w-4xl">
    <p class="text-sm font-semibold uppercase tracking-widest text-primary-600 dark:text-primary-400 mb-4">
      Pokémon TCG
    </p>
    <h1 class="text-5xl lg:text-6xl font-bold text-slate-900 dark:text-slate-50 leading-tight">
      Know what your cards are worth.<br />
      <span class="text-primary-600 dark:text-primary-400">Before you're at the booth.</span>
    </h1>
    <p class="mt-6 text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
      TCG Collect tracks your collection, compares prices across every marketplace instead
      of just one, and is the only place that maps your want list onto the real card-show
      circuit. Walk into Collect-A-Con knowing exactly what a fair price looks like.
    </p>
    <div class="mt-9 flex flex-wrap gap-4">
      <a href="{{site.baseurl}}/cards"
         class="px-7 py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-lg font-semibold shadow-lg shadow-primary-600/25 transition">
        Browse cards
      </a>
      <a href="{{site.baseurl}}/shows"
         class="px-7 py-3 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg font-semibold transition">
        Find card shows
      </a>
    </div>
  </div>
</section>

<!-- The wedge -->
<section class="py-16 border-t border-slate-200 dark:border-slate-800">
  <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-3">Why not just use TCGplayer?</h2>
  <p class="text-slate-600 dark:text-slate-400 mb-10 max-w-2xl">
    Because a marketplace is built to sell you cards, and a collection tracker is built to
    list them. Neither one helps you at a table with a vendor in front of you.
  </p>

  <div class="overflow-x-auto">
    <table class="w-full min-w-[560px] text-sm">
      <thead>
        <tr class="border-b border-slate-200 dark:border-slate-800">
          <th class="text-left py-3 pr-4 text-slate-500 dark:text-slate-400"></th>
          <th class="text-center py-3 px-4 font-semibold text-slate-500 dark:text-slate-400">TCGplayer</th>
          <th class="text-center py-3 px-4 font-semibold text-slate-500 dark:text-slate-400">Collectr</th>
          <th class="text-center py-3 px-4 font-bold text-primary-600 dark:text-primary-400">TCG Collect</th>
        </tr>
      </thead>
      <tbody class="text-slate-700 dark:text-slate-300">
        <tr class="border-b border-slate-100 dark:border-slate-800/60">
          <td class="py-3 pr-4 font-medium">Cross-vendor price comparison</td>
          <td class="text-center px-4 text-slate-400">Own prices only</td>
          <td class="text-center px-4 text-slate-400">Read-only</td>
          <td class="text-center px-4 font-semibold text-primary-600 dark:text-primary-400">TCGplayer + Cardmarket + eBay</td>
        </tr>
        <tr class="border-b border-slate-100 dark:border-slate-800/60">
          <td class="py-3 pr-4 font-medium">Collection with cost basis</td>
          <td class="text-center px-4 text-slate-400">—</td>
          <td class="text-center px-4">Yes</td>
          <td class="text-center px-4 font-semibold text-primary-600 dark:text-primary-400">Yes, with gain/loss</td>
        </tr>
        <tr class="border-b border-slate-100 dark:border-slate-800/60">
          <td class="py-3 pr-4 font-medium">Card show directory</td>
          <td class="text-center px-4 text-slate-400">—</td>
          <td class="text-center px-4 text-slate-400">—</td>
          <td class="text-center px-4 font-semibold text-primary-600 dark:text-primary-400">Searchable by date &amp; distance</td>
        </tr>
        <tr>
          <td class="py-3 pr-4 font-medium">Want list at the booth</td>
          <td class="text-center px-4 text-slate-400">—</td>
          <td class="text-center px-4 text-slate-400">—</td>
          <td class="text-center px-4 font-semibold text-accent-500">Show Mode</td>
        </tr>
      </tbody>
    </table>
  </div>
</section>

<!-- Features -->
<section class="py-16 border-t border-slate-200 dark:border-slate-800">
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
    <a href="{{site.baseurl}}/cards" class="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-primary-500 transition">
      <h3 class="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">Every card, every set</h3>
      <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        Full catalog from the Pokémon TCG API with high-res art, rarity, and live market
        prices — plus direct links to wherever it's cheapest right now.
      </p>
    </a>
    <a href="{{site.baseurl}}/collection" class="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-primary-500 transition">
      <h3 class="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">A portfolio, not a list</h3>
      <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        Record what you paid and TCG Collect tracks unrealized gain/loss, best and worst
        performers, and how close you are to completing each set.
      </p>
    </a>
    <a href="{{site.baseurl}}/show-mode" class="p-6 rounded-2xl border border-accent-500/40 bg-white dark:bg-slate-900 hover:border-accent-500 transition">
      <h3 class="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
        Show Mode
        <span class="ml-1.5 align-middle text-[10px] uppercase tracking-wider bg-accent-500/15 text-accent-600 dark:text-accent-400 px-2 py-0.5 rounded-full">Live</span>
      </h3>
      <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        Your want list on your phone at a show, each card showing market price against your
        own max bid — so an $80 ask on a $30 card is obvious immediately.
      </p>
    </a>
  </div>
</section>

<!-- Upcoming shows -->
<section class="py-16 border-t border-slate-200 dark:border-slate-800">
  <div class="flex items-end justify-between mb-6">
    <div>
      <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-50">Upcoming shows</h2>
      <p class="text-slate-600 dark:text-slate-400 mt-1">The circuit, in one place.</p>
    </div>
    <a href="{{site.baseurl}}/shows" class="text-sm font-semibold text-primary-600 dark:text-primary-400 hover:underline flex-shrink-0">
      See all →
    </a>
  </div>
  <div id="home-shows" class="grid grid-cols-1 md:grid-cols-3 gap-4"></div>
</section>

<script type="module">
  import { searchShows, formatDateRange, esc } from '{{site.baseurl}}/assets/js/api/tcgApi.js';

  (async () => {
    const container = document.getElementById('home-shows');
    try {
      const data = await searchShows({ limit: 3 });
      if (!data.shows.length) {
        container.innerHTML = '<p class="text-sm text-slate-500 col-span-full">No upcoming shows listed yet.</p>';
        return;
      }
      container.innerHTML = data.shows.slice(0, 3).map(show => `
        <a href="{{site.baseurl}}/shows" class="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-primary-500 transition">
          <p class="font-bold text-slate-900 dark:text-slate-100">${esc(show.name)}</p>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">${esc(show.city || '')}${show.state ? `, ${esc(show.state)}` : ''}</p>
          <p class="text-sm font-medium text-primary-600 dark:text-primary-400 mt-2">${esc(formatDateRange(show.startDate, show.endDate))}</p>
        </a>`).join('');
    } catch (_) {
      container.innerHTML = '<p class="text-sm text-slate-500 col-span-full">Card shows will appear once the backend is running.</p>';
    }
  })();
</script>
