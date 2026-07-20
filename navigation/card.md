---
layout: base
title: Card
permalink: /card
search_exclude: true
---

<div id="loading" class="py-24 text-center text-slate-500 dark:text-slate-400">Loading card…</div>

<div id="card-detail" class="hidden">
  <a href="{{site.baseurl}}/cards" class="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 mb-6 transition">
    <span aria-hidden="true">←</span> Back to browse
  </a>

  <div class="grid grid-cols-1 lg:grid-cols-[380px,1fr] gap-10">
    <!-- Card art -->
    <div>
      <img id="c-image" src="" alt="" class="w-full rounded-2xl shadow-2xl bg-slate-100 dark:bg-slate-800" />
    </div>

    <!-- Details -->
    <div>
      <p id="c-set" class="text-sm font-medium text-slate-500 dark:text-slate-400"></p>
      <h1 id="c-name" class="text-4xl font-bold text-slate-900 dark:text-slate-50 mt-1"></h1>
      <div id="c-badges" class="flex flex-wrap gap-2 mt-3"></div>

      <div class="mt-6 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">Market price</p>
        <p id="c-price" class="text-4xl font-bold text-primary-600 dark:text-primary-400 mt-1"></p>
        <p id="c-updated" class="text-xs text-slate-400 mt-1"></p>
      </div>

      <!-- Where to buy: the cross-vendor comparison -->
      <div class="mt-6">
        <h2 class="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">Where to buy</h2>
        <p class="text-sm text-slate-500 dark:text-slate-400 mb-3">Cheapest first, across every marketplace we track.</p>
        <div id="c-buy" class="space-y-2"></div>
      </div>

      <!-- Actions -->
      <div class="mt-8 flex flex-wrap gap-3">
        <button id="add-collection"
          class="px-5 py-2.5 bg-primary-600 hover:bg-primary-500 text-white rounded-lg font-semibold text-sm shadow-lg shadow-primary-600/20 transition">
          Add to collection
        </button>
        <button id="add-wantlist"
          class="px-5 py-2.5 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg font-semibold text-sm transition">
          Add to want list
        </button>
      </div>
      <p id="action-message" class="mt-3 text-sm font-medium min-h-[1.25rem]"></p>

      <!-- Price history -->
      <div class="mt-10">
        <h2 class="text-lg font-bold text-slate-900 dark:text-slate-100 mb-3">Price history</h2>
        <div id="c-history" class="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <canvas id="price-chart" height="90"></canvas>
          <p id="history-empty" class="hidden text-sm text-slate-500 dark:text-slate-400 text-center py-8">
            No price history yet. History builds up as daily price syncs run.
          </p>
        </div>
      </div>
    </div>
  </div>
</div>

<div id="error-state" class="hidden py-24 text-center">
  <p class="text-lg font-medium text-red-500">Couldn't load that card</p>
  <p id="error-message" class="text-sm text-slate-500 dark:text-slate-400 mt-1"></p>
</div>

<script type="module">
  import { getCard, addToCollection, addToWantList, money, esc } from '{{site.baseurl}}/assets/js/api/tcgApi.js';

  const cardId = new URLSearchParams(location.search).get('id');
  const messageEl = document.getElementById('action-message');

  function showError(message) {
    document.getElementById('loading').classList.add('hidden');
    document.getElementById('error-state').classList.remove('hidden');
    document.getElementById('error-message').textContent = message;
  }

  function badge(text, tone = 'slate') {
    const tones = {
      slate: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300',
      gold: 'bg-accent-500/15 text-accent-600 dark:text-accent-400',
      violet: 'bg-primary-500/15 text-primary-600 dark:text-primary-400',
    };
    return `<span class="px-2.5 py-1 rounded-full text-xs font-semibold ${tones[tone]}">${esc(text)}</span>`;
  }

  function renderBuyOptions(options) {
    const container = document.getElementById('c-buy');
    if (!options || !options.length) {
      container.innerHTML = '<p class="text-sm text-slate-500">No listings found.</p>';
      return;
    }

    container.innerHTML = options.map((option, index) => {
      // Only the first *priced* option is the genuine cheapest.
      const isCheapest = index === 0 && option.price !== null;
      return `
        <a href="${esc(option.url)}" target="_blank" rel="noopener noreferrer"
           class="flex items-center justify-between p-4 rounded-xl border ${isCheapest ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-900/10' : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'} hover:border-primary-500 transition group">
          <div class="flex items-center gap-3">
            <span class="font-semibold text-slate-900 dark:text-slate-100">${esc(option.vendor)}</span>
            ${isCheapest ? badge('Cheapest', 'violet') : ''}
          </div>
          <div class="text-right">
            <p class="font-bold text-slate-900 dark:text-slate-100">${option.price !== null ? money(option.price, option.currency) : 'See listings'}</p>
            ${option.lowPrice !== null && option.lowPrice !== undefined
              ? `<p class="text-xs text-slate-500">from ${money(option.lowPrice, option.currency)}</p>` : ''}
          </div>
        </a>`;
    }).join('');
  }

  function renderChart(history) {
    const points = (history || []).filter(h => h.tcgplayerMarket !== null);
    if (points.length < 2) {
      document.getElementById('price-chart').classList.add('hidden');
      document.getElementById('history-empty').classList.remove('hidden');
      return;
    }

    // Chart.js is already loaded by the base layout.
    new Chart(document.getElementById('price-chart'), {
      type: 'line',
      data: {
        labels: points.map(p => p.date),
        datasets: [{
          label: 'TCGplayer market',
          data: points.map(p => p.tcgplayerMarket),
          borderColor: '#8b5cf6',
          backgroundColor: 'rgba(139, 92, 246, 0.12)',
          fill: true,
          tension: 0.3,
          pointRadius: 0,
          borderWidth: 2,
        }],
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false }, ticks: { maxTicksLimit: 6, color: '#94a3b8' } },
          y: { ticks: { callback: (v) => `$${v}`, color: '#94a3b8' }, grid: { color: 'rgba(148,163,184,0.15)' } },
        },
      },
    });
  }

  async function flash(text, ok = true) {
    messageEl.textContent = text;
    messageEl.style.color = ok ? '#22c55e' : '#ef4444';
  }

  (async () => {
    if (!cardId) return showError('No card id in the URL.');

    try {
      const card = await getCard(cardId);

      document.getElementById('c-image').src = card.imageLarge || card.imageSmall || '';
      document.getElementById('c-image').alt = card.name;
      document.getElementById('c-set').textContent = `${card.setName || ''} · ${card.number || ''}`;
      document.getElementById('c-name').textContent = card.name;
      document.getElementById('c-price').textContent = money(card.marketPrice);
      document.getElementById('c-updated').textContent = card.priceUpdatedAt
        ? `Updated ${new Date(card.priceUpdatedAt).toLocaleDateString()}`
        : 'Never priced';

      const badges = [];
      if (card.rarity) badges.push(badge(card.rarity, /secret|illustration|hyper|rainbow|gold|ultra/i.test(card.rarity) ? 'gold' : 'slate'));
      (card.types || []).forEach(t => badges.push(badge(t)));
      if (card.artist) badges.push(badge(`Art: ${card.artist}`));
      document.getElementById('c-badges').innerHTML = badges.join('');

      renderBuyOptions(card.buyOptions);
      renderChart(card.priceHistory);

      document.getElementById('loading').classList.add('hidden');
      document.getElementById('card-detail').classList.remove('hidden');

      document.getElementById('add-collection').addEventListener('click', async (e) => {
        e.target.disabled = true;
        try {
          await addToCollection({ cardId: card.id, quantity: 1, condition: 'Near Mint' });
          flash('Added to your collection.');
        } catch (err) {
          flash(err.status === 401 ? 'Sign in to track your collection.' : err.message, false);
        } finally {
          e.target.disabled = false;
        }
      });

      document.getElementById('add-wantlist').addEventListener('click', async (e) => {
        e.target.disabled = true;
        try {
          await addToWantList({ cardId: card.id, maxPrice: card.marketPrice });
          flash('Added to your want list.');
        } catch (err) {
          flash(err.status === 401 ? 'Sign in to build a want list.' : err.message, false);
        } finally {
          e.target.disabled = false;
        }
      });
    } catch (err) {
      showError(err.message);
    }
  })();
</script>
