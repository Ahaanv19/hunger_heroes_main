---
layout: base
title: Show Mode
permalink: /show-mode
---

<div class="mb-6">
  <div class="flex items-center gap-3 mb-2">
    <h1 class="text-4xl font-bold text-slate-900 dark:text-slate-50">Show Mode</h1>
    <span class="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-accent-500/15 text-accent-600 dark:text-accent-400">Live prices</span>
  </div>
  <p class="text-slate-600 dark:text-slate-400 max-w-2xl">
    Your want list, built for standing at a booth. Every card shows the real market
    price next to your own max bid — so when a vendor quotes you a number, you know
    immediately whether it's a deal or a markup.
  </p>
</div>

<!-- Budget planner -->
<div class="mb-8 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
  <label for="budget" class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
    Today's budget
  </label>
  <div class="flex flex-col sm:flex-row gap-3">
    <div class="relative flex-1">
      <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
      <input type="number" id="budget" min="1" step="10" placeholder="200"
        class="w-full pl-7 pr-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500" />
    </div>
    <button id="plan-btn"
      class="px-5 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-lg font-semibold text-sm shadow-lg shadow-primary-600/20 transition">
      Plan my spend
    </button>
  </div>
  <div id="plan-result" class="hidden mt-4 p-4 rounded-xl bg-primary-50 dark:bg-primary-900/15 border border-primary-200 dark:border-primary-800"></div>
</div>

<!-- Summary bar -->
<div id="summary" class="hidden grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8"></div>

<div id="want-list" class="space-y-3"></div>

<div id="signed-out" class="hidden text-center py-20">
  <p class="text-lg font-medium text-slate-700 dark:text-slate-300">Sign in to use Show Mode</p>
  <p class="text-sm text-slate-500 dark:text-slate-400 mt-1 mb-5">Your want list travels with you.</p>
  <a href="{{site.baseurl}}/login" class="inline-block px-6 py-2.5 bg-primary-600 hover:bg-primary-500 text-white rounded-lg font-semibold text-sm transition">Sign In</a>
</div>

<div id="empty" class="hidden text-center py-20">
  <p class="text-lg font-medium text-slate-700 dark:text-slate-300">Your want list is empty</p>
  <p class="text-sm text-slate-500 dark:text-slate-400 mt-1 mb-5">Add cards you're hunting for and they'll show up here.</p>
  <a href="{{site.baseurl}}/cards" class="inline-block px-6 py-2.5 bg-primary-600 hover:bg-primary-500 text-white rounded-lg font-semibold text-sm transition">Browse cards</a>
</div>

<script type="module">
  import { getShowMode, getBudgetPlan, money, esc } from '{{site.baseurl}}/assets/js/api/tcgApi.js';

  const listEl = document.getElementById('want-list');
  const summaryEl = document.getElementById('summary');

  function stat(label, value, tone = '') {
    return `
      <div class="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">${esc(label)}</p>
        <p class="text-2xl font-bold mt-1 ${tone || 'text-slate-900 dark:text-slate-100'}">${value}</p>
      </div>`;
  }

  function row(item) {
    const card = item.card || {};
    const market = item.marketPrice;
    const max = item.maxPrice;

    // Three states, deliberately distinct: a real deal, over budget, or unknown.
    let verdict, verdictClass, borderClass;
    if (item.isGoodDeal === true) {
      verdict = `At or below your ${money(max)} max`;
      verdictClass = 'text-emerald-600 dark:text-emerald-400';
      borderClass = 'border-emerald-500/60';
    } else if (item.isGoodDeal === false) {
      const over = market - max;
      verdict = `${money(over)} over your ${money(max)} max`;
      verdictClass = 'text-red-500';
      borderClass = 'border-slate-200 dark:border-slate-800';
    } else {
      verdict = max ? 'No market price yet' : 'No max price set';
      verdictClass = 'text-slate-400';
      borderClass = 'border-slate-200 dark:border-slate-800';
    }

    const cheapest = item.cheapestVendor;

    return `
      <article class="flex items-center gap-4 p-4 rounded-2xl border ${borderClass} bg-white dark:bg-slate-900">
        ${card.imageSmall
          ? `<img src="${esc(card.imageSmall)}" alt="${esc(card.name || '')}" loading="lazy"
                  class="w-14 flex-shrink-0 rounded-md bg-slate-100 dark:bg-slate-800" />`
          : '<div class="w-14 h-20 flex-shrink-0 rounded-md bg-slate-100 dark:bg-slate-800"></div>'}

        <div class="min-w-0 flex-1">
          <p class="font-bold text-slate-900 dark:text-slate-100 truncate">${esc(card.name || 'Unknown card')}</p>
          <p class="text-xs text-slate-500 dark:text-slate-400 truncate">${esc(card.setName || '')} · ${esc(card.number || '')}</p>
          <p class="text-sm font-medium mt-1 ${verdictClass}">${verdict}</p>
          ${cheapest ? `<p class="text-xs text-slate-500 mt-0.5">Cheapest online: ${esc(cheapest.vendor)} ${money(cheapest.price, cheapest.currency)}</p>` : ''}
        </div>

        <div class="flex-shrink-0 text-right">
          <p class="text-xs text-slate-400 uppercase tracking-wider font-semibold">Market</p>
          <p class="text-xl font-bold text-slate-900 dark:text-slate-100">${money(market)}</p>
          ${max ? `<p class="text-xs text-slate-500 mt-0.5">max ${money(max)}</p>` : ''}
        </div>
      </article>`;
  }

  document.getElementById('plan-btn').addEventListener('click', async () => {
    const budget = parseFloat(document.getElementById('budget').value);
    const resultEl = document.getElementById('plan-result');

    if (!budget || budget <= 0) {
      resultEl.className = 'mt-4 p-4 rounded-xl bg-red-50 dark:bg-red-900/15 border border-red-200 dark:border-red-800';
      resultEl.innerHTML = '<p class="text-sm font-medium text-red-600 dark:text-red-400">Enter a budget above $0.</p>';
      resultEl.classList.remove('hidden');
      return;
    }

    try {
      const plan = await getBudgetPlan(budget);
      resultEl.className = 'mt-4 p-4 rounded-xl bg-primary-50 dark:bg-primary-900/15 border border-primary-200 dark:border-primary-800';
      resultEl.innerHTML = `
        <p class="font-bold text-slate-900 dark:text-slate-100">
          ${plan.cardsCovered} of ${plan.wantListSize} want-list cards fit in ${money(plan.budget)}
        </p>
        <p class="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Planned spend ${money(plan.plannedSpend)} · ${money(plan.remaining)} left over
        </p>
        ${plan.picks.length ? `
          <ul class="mt-3 space-y-1">
            ${plan.picks.map(p => `
              <li class="text-sm text-slate-700 dark:text-slate-300 flex justify-between gap-4">
                <span class="truncate">${esc(p.card?.name || '')}</span>
                <span class="font-medium flex-shrink-0">${money(p.marketPrice)}</span>
              </li>`).join('')}
          </ul>` : ''}`;
      resultEl.classList.remove('hidden');
    } catch (err) {
      resultEl.className = 'mt-4 p-4 rounded-xl bg-red-50 dark:bg-red-900/15 border border-red-200 dark:border-red-800';
      resultEl.innerHTML = `<p class="text-sm font-medium text-red-600 dark:text-red-400">${esc(err.message)}</p>`;
      resultEl.classList.remove('hidden');
    }
  });

  (async () => {
    try {
      const data = await getShowMode();

      if (!data.count) {
        document.getElementById('empty').classList.remove('hidden');
        return;
      }

      summaryEl.innerHTML = [
        stat('Cards hunting', data.count),
        stat('At or below max', data.atOrBelowMaxPrice, 'text-emerald-600 dark:text-emerald-400'),
        stat('Prices as of', new Date(data.generatedAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })),
      ].join('');
      summaryEl.classList.remove('hidden');

      // Deals first, then by priority — the top of the screen is what you read at a booth.
      const sorted = [...data.wantList].sort((a, b) => {
        if (a.isGoodDeal !== b.isGoodDeal) return a.isGoodDeal ? -1 : 1;
        return (a.priority || 3) - (b.priority || 3);
      });

      listEl.innerHTML = sorted.map(row).join('');
    } catch (err) {
      if (err.status === 401) {
        document.getElementById('signed-out').classList.remove('hidden');
      } else {
        listEl.innerHTML = `<p class="text-center py-12 text-red-500">${esc(err.message)}</p>`;
      }
    }
  })();
</script>
