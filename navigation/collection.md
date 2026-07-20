---
layout: base
title: My Collection
permalink: /collection
---

<div class="mb-8">
  <h1 class="text-4xl font-bold text-slate-900 dark:text-slate-50 mb-2">My Collection</h1>
  <p class="text-slate-600 dark:text-slate-400">
    What you own, what you paid, and what it's worth now.
  </p>
</div>

<div id="summary" class="hidden grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"></div>
<div id="performers" class="hidden grid grid-cols-1 md:grid-cols-2 gap-4 mb-10"></div>

<h2 class="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">Cards</h2>
<div id="items" class="space-y-3"></div>

<div id="signed-out" class="hidden text-center py-20">
  <p class="text-lg font-medium text-slate-700 dark:text-slate-300">Sign in to see your collection</p>
  <a href="{{site.baseurl}}/login" class="inline-block mt-5 px-6 py-2.5 bg-primary-600 hover:bg-primary-500 text-white rounded-lg font-semibold text-sm transition">Sign In</a>
</div>

<div id="empty" class="hidden text-center py-20">
  <p class="text-lg font-medium text-slate-700 dark:text-slate-300">No cards yet</p>
  <p class="text-sm text-slate-500 dark:text-slate-400 mt-1 mb-5">Browse the catalog and add the cards you own.</p>
  <a href="{{site.baseurl}}/cards" class="inline-block px-6 py-2.5 bg-primary-600 hover:bg-primary-500 text-white rounded-lg font-semibold text-sm transition">Browse cards</a>
</div>

<script type="module">
  import {
    getCollection, getPortfolioSummary, removeCollectionItem,
    money, signedMoney, percent, trendClass, esc,
  } from '{{site.baseurl}}/assets/js/api/tcgApi.js';

  const itemsEl = document.getElementById('items');
  const summaryEl = document.getElementById('summary');

  function stat(label, value, tone = '', sub = '') {
    return `
      <div class="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">${esc(label)}</p>
        <p class="text-2xl font-bold mt-1 ${tone || 'text-slate-900 dark:text-slate-100'}">${value}</p>
        ${sub ? `<p class="text-xs text-slate-500 mt-0.5">${sub}</p>` : ''}
      </div>`;
  }

  function performerCard(title, item, tone) {
    if (!item) return '';
    return `
      <div class="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-4">
        ${item.card?.imageSmall ? `<img src="${esc(item.card.imageSmall)}" alt="" class="w-12 rounded-md" />` : ''}
        <div class="min-w-0">
          <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">${esc(title)}</p>
          <p class="font-bold text-slate-900 dark:text-slate-100 truncate">${esc(item.card?.name || '')}</p>
          <p class="text-sm font-semibold ${tone}">${signedMoney(item.gainLoss)} (${percent(item.gainLossPercent)})</p>
        </div>
      </div>`;
  }

  function itemRow(item) {
    const card = item.card || {};
    return `
      <article class="flex items-center gap-4 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        ${card.imageSmall
          ? `<img src="${esc(card.imageSmall)}" alt="${esc(card.name || '')}" loading="lazy" class="w-14 flex-shrink-0 rounded-md bg-slate-100 dark:bg-slate-800" />`
          : '<div class="w-14 h-20 flex-shrink-0 rounded-md bg-slate-100 dark:bg-slate-800"></div>'}

        <div class="min-w-0 flex-1">
          <p class="font-bold text-slate-900 dark:text-slate-100 truncate">${esc(card.name || 'Unknown card')}</p>
          <p class="text-xs text-slate-500 dark:text-slate-400 truncate">
            ${esc(card.setName || '')} · ${esc(card.number || '')} · ${esc(item.condition)}${item.isFoil ? ' · Foil' : ''}
            ${item.grader ? ` · ${esc(item.grader)} ${item.grade}` : ''}
          </p>
          <p class="text-xs text-slate-500 mt-1">
            ${item.quantity}× · paid ${item.purchasePrice !== null ? money(item.purchasePrice) : 'unknown'}
          </p>
        </div>

        <div class="flex-shrink-0 text-right">
          <p class="text-lg font-bold text-slate-900 dark:text-slate-100">${money(item.marketValue)}</p>
          <p class="text-sm font-semibold ${trendClass(item.gainLoss)}">
            ${signedMoney(item.gainLoss)}${item.gainLossPercent !== null ? ` (${percent(item.gainLossPercent)})` : ''}
          </p>
        </div>

        <button data-remove="${item.id}" title="Remove from collection"
          class="flex-shrink-0 p-2 text-slate-400 hover:text-red-500 transition" aria-label="Remove">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </article>`;
  }

  async function load() {
    try {
      const [summary, items] = await Promise.all([getPortfolioSummary(), getCollection()]);

      if (!items.length) {
        document.getElementById('empty').classList.remove('hidden');
        return;
      }

      summaryEl.innerHTML = [
        stat('Market value', money(summary.marketValue), '', `${summary.totalCards} cards`),
        stat('Cost basis', money(summary.costBasis), '',
             summary.untrackedBasisCount ? `${summary.untrackedBasisCount} without a purchase price` : ''),
        stat('Unrealized gain/loss', signedMoney(summary.gainLoss), trendClass(summary.gainLoss)),
        stat('Return', percent(summary.gainLossPercent), trendClass(summary.gainLoss)),
      ].join('');
      summaryEl.classList.remove('hidden');

      // Only meaningful once at least one card has a known cost basis.
      const performersHtml = [
        performerCard('Best performer', summary.bestPerformer, 'text-emerald-600 dark:text-emerald-400'),
        performerCard('Worst performer', summary.worstPerformer, 'text-red-500'),
      ].join('');
      if (performersHtml.trim()) {
        document.getElementById('performers').innerHTML = performersHtml;
        document.getElementById('performers').classList.remove('hidden');
      }

      itemsEl.innerHTML = items.map(itemRow).join('');

      itemsEl.querySelectorAll('[data-remove]').forEach(button => {
        button.addEventListener('click', async () => {
          button.disabled = true;
          try {
            await removeCollectionItem(button.dataset.remove);
            load();   // refresh totals as well as the list
          } catch (err) {
            button.disabled = false;
            alert(err.message);
          }
        });
      });
    } catch (err) {
      if (err.status === 401) {
        document.getElementById('signed-out').classList.remove('hidden');
      } else {
        itemsEl.innerHTML = `<p class="text-center py-12 text-red-500">${esc(err.message)}</p>`;
      }
    }
  }

  load();
</script>
