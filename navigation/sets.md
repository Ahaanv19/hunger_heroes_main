---
layout: base
title: All Sets
permalink: /sets
---

<div class="mb-8">
  <h1 class="text-4xl font-bold text-slate-900 dark:text-slate-50 mb-2">All Sets</h1>
  <p class="text-slate-600 dark:text-slate-400">Every Pokémon TCG set, newest first.</p>
</div>

<div class="mb-8">
  <label for="series" class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Series</label>
  <select id="series" class="w-full max-w-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500">
    <option value="">All series</option>
  </select>
</div>

<div id="set-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"></div>

<script type="module">
  import { getSets, getCatalogFilters, esc } from '{{site.baseurl}}/assets/js/api/tcgApi.js';

  const grid = document.getElementById('set-grid');
  const seriesSelect = document.getElementById('series');

  function setTemplate(set) {
    return `
      <a href="{{site.baseurl}}/cards?setId=${encodeURIComponent(set.id)}"
         class="group p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-primary-500 hover:shadow-lg hover:shadow-primary-600/10 transition flex items-center gap-4">
        ${set.logoUrl
          ? `<img src="${esc(set.logoUrl)}" alt="" loading="lazy" class="h-12 w-24 object-contain flex-shrink-0" />`
          : '<div class="h-12 w-24 flex-shrink-0 rounded bg-slate-100 dark:bg-slate-800"></div>'}
        <div class="min-w-0">
          <p class="font-bold text-slate-900 dark:text-slate-100 truncate">${esc(set.name)}</p>
          <p class="text-xs text-slate-500 dark:text-slate-400 truncate">${esc(set.series || '')}</p>
          <p class="text-xs text-slate-500 mt-1">
            ${set.cardCount ?? (set.total || set.printedTotal || 0)} cards
            ${set.releaseDate ? ` · ${new Date(set.releaseDate + 'T00:00:00').getFullYear()}` : ''}
          </p>
        </div>
      </a>`;
  }

  async function load() {
    grid.innerHTML = '<p class="col-span-full text-center py-12 text-slate-500">Loading sets…</p>';
    try {
      const sets = await getSets(seriesSelect.value);
      grid.innerHTML = sets.length
        ? sets.map(setTemplate).join('')
        : '<p class="col-span-full text-center py-12 text-slate-500">No sets found. Run <code>flask tcg sync-sets</code> on the backend.</p>';
    } catch (err) {
      grid.innerHTML = `<p class="col-span-full text-center py-12 text-red-500">${esc(err.message)}</p>`;
    }
  }

  seriesSelect.addEventListener('change', load);

  (async () => {
    try {
      const filters = await getCatalogFilters();
      seriesSelect.innerHTML = '<option value="">All series</option>' +
        filters.series.map(s => `<option value="${esc(s)}">${esc(s)}</option>`).join('');
    } catch (_) { /* optional */ }
    load();
  })();
</script>
