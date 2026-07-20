---
layout: base
title: Browse Cards
permalink: /cards
---

<div class="mb-8">
  <h1 class="text-4xl font-bold text-slate-900 dark:text-slate-50 mb-2">Browse Cards</h1>
  <p class="text-slate-600 dark:text-slate-400">
    Every card from every set, with prices compared across TCGplayer and Cardmarket.
  </p>
</div>

<!-- Filters -->
<div class="mb-8 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
    <div class="lg:col-span-2">
      <label for="f-search" class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Search</label>
      <input type="search" id="f-search" placeholder="Charizard…"
        class="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500" />
    </div>
    <div>
      <label for="f-set" class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Set</label>
      <select id="f-set" class="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500">
        <option value="">All sets</option>
      </select>
    </div>
    <div>
      <label for="f-rarity" class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Rarity</label>
      <select id="f-rarity" class="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500">
        <option value="">Any rarity</option>
      </select>
    </div>
    <div>
      <label for="f-sort" class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Sort</label>
      <select id="f-sort" class="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500">
        <option value="name">Name A–Z</option>
        <option value="price_desc">Price: high to low</option>
        <option value="price_asc">Price: low to high</option>
        <option value="number">Set number</option>
      </select>
    </div>
  </div>
</div>

<p id="result-count" class="text-sm text-slate-500 dark:text-slate-400 mb-4"></p>

<div id="card-grid" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-5"></div>

<div id="empty-state" class="hidden text-center py-20">
  <p class="text-lg font-medium text-slate-700 dark:text-slate-300">No cards match those filters.</p>
  <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">Try clearing the search or picking a different set.</p>
</div>

<div class="mt-10 flex items-center justify-center gap-3">
  <button id="prev-page" class="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition">Previous</button>
  <span id="page-info" class="text-sm text-slate-500 dark:text-slate-400"></span>
  <button id="next-page" class="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition">Next</button>
</div>

<script type="module">
  import { searchCards, getCatalogFilters, money, esc } from '{{site.baseurl}}/assets/js/api/tcgApi.js';

  const grid = document.getElementById('card-grid');
  const emptyState = document.getElementById('empty-state');
  const resultCount = document.getElementById('result-count');
  const pageInfo = document.getElementById('page-info');
  const prevBtn = document.getElementById('prev-page');
  const nextBtn = document.getElementById('next-page');

  const inputs = {
    q: document.getElementById('f-search'),
    setId: document.getElementById('f-set'),
    rarity: document.getElementById('f-rarity'),
    sort: document.getElementById('f-sort'),
  };

  let page = 1;
  let totalPages = 1;

  // Gold border marks a chase card. Rarity is the only thing gold is used for.
  const isChase = (rarity) =>
    !!rarity && /secret|illustration|hyper|rainbow|gold|ultra/i.test(rarity);

  function cardTemplate(card) {
    const chase = isChase(card.rarity);
    const image = card.imageSmall
      ? `<img src="${esc(card.imageSmall)}" alt="${esc(card.name)}" loading="lazy"
             class="w-full aspect-[63/88] object-cover rounded-lg bg-slate-100 dark:bg-slate-800" />`
      : `<div class="w-full aspect-[63/88] rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs text-slate-400">No image</div>`;

    return `
      <a href="{{site.baseurl}}/card?id=${encodeURIComponent(card.id)}"
         class="group block p-2 rounded-xl border ${chase ? 'border-accent-500/50' : 'border-slate-200 dark:border-slate-800'} bg-white dark:bg-slate-900 hover:border-primary-500 hover:shadow-lg hover:shadow-primary-600/10 transition">
        ${image}
        <div class="mt-2.5 px-1 pb-1">
          <p class="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate" title="${esc(card.name)}">${esc(card.name)}</p>
          <p class="text-xs text-slate-500 dark:text-slate-400 truncate">${esc(card.setName || '')} · ${esc(card.number || '—')}</p>
          <p class="mt-1.5 text-sm font-bold ${chase ? 'text-accent-500' : 'text-primary-600 dark:text-primary-400'}">${money(card.marketPrice)}</p>
        </div>
      </a>`;
  }

  function skeleton() {
    grid.innerHTML = Array.from({ length: 12 }, () => `
      <div class="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div class="w-full aspect-[63/88] rounded-lg bg-slate-200 dark:bg-slate-800 animate-pulse"></div>
        <div class="mt-2.5 h-4 rounded bg-slate-200 dark:bg-slate-800 animate-pulse"></div>
        <div class="mt-1.5 h-3 w-2/3 rounded bg-slate-200 dark:bg-slate-800 animate-pulse"></div>
      </div>`).join('');
  }

  async function load() {
    skeleton();
    emptyState.classList.add('hidden');

    try {
      const data = await searchCards({
        q: inputs.q.value.trim(),
        setId: inputs.setId.value,
        rarity: inputs.rarity.value,
        sort: inputs.sort.value,
        page,
        perPage: 48,
      });

      totalPages = data.pages || 1;

      if (!data.cards.length) {
        grid.innerHTML = '';
        emptyState.classList.remove('hidden');
        resultCount.textContent = '';
      } else {
        grid.innerHTML = data.cards.map(cardTemplate).join('');
        resultCount.textContent = `${data.total.toLocaleString()} card${data.total === 1 ? '' : 's'}`;
      }

      pageInfo.textContent = `Page ${data.page} of ${totalPages}`;
      prevBtn.disabled = data.page <= 1;
      nextBtn.disabled = data.page >= totalPages;
    } catch (err) {
      grid.innerHTML = `
        <div class="col-span-full text-center py-16">
          <p class="text-lg font-medium text-red-500">Couldn't load cards</p>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">${esc(err.message)}</p>
        </div>`;
      resultCount.textContent = '';
      pageInfo.textContent = '';
    }
  }

  // Debounce the text input so we don't fire a request per keystroke.
  let debounce;
  inputs.q.addEventListener('input', () => {
    clearTimeout(debounce);
    debounce = setTimeout(() => { page = 1; load(); }, 350);
  });

  [inputs.setId, inputs.rarity, inputs.sort].forEach(el =>
    el.addEventListener('change', () => { page = 1; load(); })
  );

  prevBtn.addEventListener('click', () => { if (page > 1) { page--; load(); window.scrollTo(0, 0); } });
  nextBtn.addEventListener('click', () => { if (page < totalPages) { page++; load(); window.scrollTo(0, 0); } });

  // Populate filter dropdowns, then load the first page.
  (async () => {
    try {
      const filters = await getCatalogFilters();
      inputs.setId.innerHTML = '<option value="">All sets</option>' +
        filters.sets.map(s => `<option value="${esc(s.id)}">${esc(s.name)}</option>`).join('');
      inputs.rarity.innerHTML = '<option value="">Any rarity</option>' +
        filters.rarities.map(r => `<option value="${esc(r)}">${esc(r)}</option>`).join('');
    } catch (_) {
      // Filters are a convenience; the grid still works without them.
    }

    // Deep link support: /cards?setId=base1
    const params = new URLSearchParams(location.search);
    if (params.get('setId')) inputs.setId.value = params.get('setId');
    if (params.get('q')) inputs.q.value = params.get('q');

    load();
  })();
</script>
