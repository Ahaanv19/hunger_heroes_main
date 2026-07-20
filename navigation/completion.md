---
layout: base
title: Set Completion
permalink: /completion
---

<div class="mb-8">
  <h1 class="text-4xl font-bold text-slate-900 dark:text-slate-50 mb-2">Set Completion</h1>
  <p class="text-slate-600 dark:text-slate-400 max-w-2xl">
    How far through a set you are, exactly which cards are missing, and what it would
    cost to finish — cheapest gaps first.
  </p>
</div>

<div class="mb-8">
  <label for="set-picker" class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Set</label>
  <select id="set-picker" class="w-full max-w-md px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500">
    <option value="">Choose a set…</option>
  </select>
</div>

<div id="result" class="hidden"></div>

<div id="signed-out" class="hidden text-center py-20">
  <p class="text-lg font-medium text-slate-700 dark:text-slate-300">Sign in to track set completion</p>
  <a href="{{site.baseurl}}/login" class="inline-block mt-5 px-6 py-2.5 bg-primary-600 hover:bg-primary-500 text-white rounded-lg font-semibold text-sm transition">Sign In</a>
</div>

<script type="module">
  import { getSetCompletion, getCatalogFilters, money, esc } from '{{site.baseurl}}/assets/js/api/tcgApi.js';

  const picker = document.getElementById('set-picker');
  const resultEl = document.getElementById('result');

  function missingCard(card) {
    const cheapest = (card.buyOptions || []).find(o => o.price !== null);
    return `
      <a href="{{site.baseurl}}/card?id=${encodeURIComponent(card.id)}"
         class="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-primary-500 transition block">
        ${card.imageSmall
          ? `<img src="${esc(card.imageSmall)}" alt="${esc(card.name)}" loading="lazy" class="w-full aspect-[63/88] object-cover rounded-lg bg-slate-100 dark:bg-slate-800" />`
          : '<div class="w-full aspect-[63/88] rounded-lg bg-slate-100 dark:bg-slate-800"></div>'}
        <div class="mt-2 px-1 pb-1">
          <p class="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">${esc(card.name)}</p>
          <p class="text-xs text-slate-500">#${esc(card.number || '?')}</p>
          <p class="text-sm font-bold text-primary-600 dark:text-primary-400 mt-1">${money(card.marketPrice)}</p>
          ${cheapest ? `<p class="text-[11px] text-slate-500 truncate">${esc(cheapest.vendor)}</p>` : ''}
        </div>
      </a>`;
  }

  async function load(setId) {
    if (!setId) {
      resultEl.classList.add('hidden');
      return;
    }

    resultEl.innerHTML = '<p class="py-12 text-center text-slate-500">Calculating…</p>';
    resultEl.classList.remove('hidden');

    try {
      const data = await getSetCompletion(setId);
      const complete = data.missingCount === 0;

      resultEl.innerHTML = `
        <div class="p-6 rounded-2xl border ${complete ? 'border-accent-500' : 'border-slate-200 dark:border-slate-800'} bg-white dark:bg-slate-900 mb-8">
          <div class="flex items-center justify-between gap-4 mb-4">
            <div>
              <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-100">${esc(data.set.name)}</h2>
              <p class="text-sm text-slate-500 dark:text-slate-400">${esc(data.set.series || '')}</p>
            </div>
            <div class="text-right flex-shrink-0">
              <p class="text-3xl font-bold ${complete ? 'text-accent-500' : 'text-primary-600 dark:text-primary-400'}">${data.percent}%</p>
              <p class="text-sm text-slate-500">${data.owned} / ${data.total}</p>
            </div>
          </div>

          <div class="h-3 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
            <div class="h-full rounded-full ${complete ? 'bg-accent-500' : 'bg-primary-500'} transition-all"
                 style="width: ${data.percent}%"></div>
          </div>

          ${complete
            ? '<p class="mt-4 font-semibold text-accent-600 dark:text-accent-400">Set complete. Nicely done.</p>'
            : `<p class="mt-4 text-sm text-slate-600 dark:text-slate-400">
                 <span class="font-semibold text-slate-900 dark:text-slate-100">${data.missingCount}</span> cards missing ·
                 about <span class="font-semibold text-slate-900 dark:text-slate-100">${money(data.costToComplete)}</span> to finish at current market
               </p>`}
        </div>

        ${data.missingCount ? `
          <h3 class="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">Missing cards</h3>
          <p class="text-sm text-slate-500 dark:text-slate-400 mb-4">Cheapest first — the practical order to close out a set.</p>
          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            ${data.missing.map(missingCard).join('')}
          </div>` : ''}`;
    } catch (err) {
      if (err.status === 401) {
        resultEl.classList.add('hidden');
        document.getElementById('signed-out').classList.remove('hidden');
      } else {
        resultEl.innerHTML = `<p class="py-12 text-center text-red-500">${esc(err.message)}</p>`;
      }
    }
  }

  picker.addEventListener('change', () => load(picker.value));

  (async () => {
    try {
      const filters = await getCatalogFilters();
      picker.innerHTML = '<option value="">Choose a set…</option>' +
        filters.sets.map(s => `<option value="${esc(s.id)}">${esc(s.name)}</option>`).join('');

      const preset = new URLSearchParams(location.search).get('setId');
      if (preset) { picker.value = preset; load(preset); }
    } catch (err) {
      picker.innerHTML = '<option value="">Could not load sets</option>';
    }
  })();
</script>
