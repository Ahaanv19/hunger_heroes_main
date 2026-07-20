---
layout: base
title: Price Movers
permalink: /movers
---

<div class="mb-8">
  <h1 class="text-4xl font-bold text-slate-900 dark:text-slate-50 mb-2">Price Movers</h1>
  <p class="text-slate-600 dark:text-slate-400 max-w-2xl">
    Biggest price swings across the catalog. A marketplace has no reason to tell you a
    card is spiking and you should wait — we do.
  </p>
</div>

<div class="mb-8 flex flex-wrap gap-4">
  <div>
    <label for="days" class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Window</label>
    <select id="days" class="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500">
      <option value="7">Last 7 days</option>
      <option value="14">Last 14 days</option>
      <option value="30">Last 30 days</option>
      <option value="90">Last 90 days</option>
    </select>
  </div>
  <div>
    <label for="direction" class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Direction</label>
    <select id="direction" class="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500">
      <option value="both">Both</option>
      <option value="up">Rising</option>
      <option value="down">Falling</option>
    </select>
  </div>
</div>

<div id="movers"></div>

<script type="module">
  import { getMovers, money, percent, trendClass, esc } from '{{site.baseurl}}/assets/js/api/tcgApi.js';

  const container = document.getElementById('movers');
  const daysSelect = document.getElementById('days');
  const directionSelect = document.getElementById('direction');

  function row(mover) {
    const card = mover.card || {};
    return `
      <a href="{{site.baseurl}}/card?id=${encodeURIComponent(card.id)}"
         class="flex items-center gap-4 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-primary-500 transition">
        ${card.imageSmall
          ? `<img src="${esc(card.imageSmall)}" alt="" loading="lazy" class="w-12 flex-shrink-0 rounded-md bg-slate-100 dark:bg-slate-800" />`
          : '<div class="w-12 h-16 flex-shrink-0 rounded-md bg-slate-100 dark:bg-slate-800"></div>'}
        <div class="min-w-0 flex-1">
          <p class="font-bold text-slate-900 dark:text-slate-100 truncate">${esc(card.name || '')}</p>
          <p class="text-xs text-slate-500 dark:text-slate-400 truncate">${esc(card.setName || '')} · ${esc(card.number || '')}</p>
        </div>
        <div class="flex-shrink-0 text-right">
          <p class="font-bold text-slate-900 dark:text-slate-100">${money(mover.endPrice)}</p>
          <p class="text-sm font-semibold ${trendClass(mover.change)}">
            ${percent(mover.changePercent)}
            <span class="text-slate-400 font-normal">from ${money(mover.startPrice)}</span>
          </p>
        </div>
      </a>`;
  }

  async function load() {
    container.innerHTML = '<p class="py-12 text-center text-slate-500">Loading…</p>';
    try {
      const data = await getMovers({
        days: daysSelect.value,
        direction: directionSelect.value,
        limit: 40,
      });

      container.innerHTML = data.movers.length
        ? `<div class="space-y-3">${data.movers.map(row).join('')}</div>`
        : `<div class="text-center py-20">
             <p class="text-lg font-medium text-slate-700 dark:text-slate-300">Not enough price history yet</p>
             <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
               Movers need at least two daily snapshots. Run <code class="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800">flask tcg refresh-prices</code> daily to build history.
             </p>
           </div>`;
    } catch (err) {
      container.innerHTML = `<p class="py-12 text-center text-red-500">${esc(err.message)}</p>`;
    }
  }

  daysSelect.addEventListener('change', load);
  directionSelect.addEventListener('change', load);
  load();
</script>
