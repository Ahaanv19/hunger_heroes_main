---
layout: base
title: Want List
permalink: /wantlist
---

<div class="mb-8">
  <h1 class="text-4xl font-bold text-slate-900 dark:text-slate-50 mb-2">Want List</h1>
  <p class="text-slate-600 dark:text-slate-400 max-w-2xl">
    The cards you're hunting, with the most you're willing to pay for each. Set a max
    price and <a href="{{site.baseurl}}/show-mode" class="text-primary-600 dark:text-primary-400 font-medium hover:underline">Show Mode</a>
    will flag it the moment the market drops below your number.
  </p>
</div>

<div id="items" class="space-y-3"></div>

<div id="signed-out" class="hidden text-center py-20">
  <p class="text-lg font-medium text-slate-700 dark:text-slate-300">Sign in to build a want list</p>
  <a href="{{site.baseurl}}/login" class="inline-block mt-5 px-6 py-2.5 bg-primary-600 hover:bg-primary-500 text-white rounded-lg font-semibold text-sm transition">Sign In</a>
</div>

<div id="empty" class="hidden text-center py-20">
  <p class="text-lg font-medium text-slate-700 dark:text-slate-300">Your want list is empty</p>
  <p class="text-sm text-slate-500 dark:text-slate-400 mt-1 mb-5">Find a card you're chasing and add it.</p>
  <a href="{{site.baseurl}}/cards" class="inline-block px-6 py-2.5 bg-primary-600 hover:bg-primary-500 text-white rounded-lg font-semibold text-sm transition">Browse cards</a>
</div>

<script type="module">
  import {
    getWantList, updateWantListItem, removeWantListItem, money, esc,
  } from '{{site.baseurl}}/assets/js/api/tcgApi.js';

  const itemsEl = document.getElementById('items');

  const PRIORITIES = [
    [1, 'Grail'], [2, 'High'], [3, 'Normal'], [4, 'Low'], [5, 'Someday'],
  ];

  function row(item) {
    const card = item.card || {};
    const deal = item.isGoodDeal;

    return `
      <article class="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-2xl border ${deal ? 'border-emerald-500/60' : 'border-slate-200 dark:border-slate-800'} bg-white dark:bg-slate-900">
        <div class="flex items-center gap-4 min-w-0 flex-1">
          ${card.imageSmall
            ? `<img src="${esc(card.imageSmall)}" alt="${esc(card.name || '')}" loading="lazy" class="w-14 flex-shrink-0 rounded-md bg-slate-100 dark:bg-slate-800" />`
            : '<div class="w-14 h-20 flex-shrink-0 rounded-md bg-slate-100 dark:bg-slate-800"></div>'}
          <div class="min-w-0">
            <p class="font-bold text-slate-900 dark:text-slate-100 truncate">${esc(card.name || 'Unknown card')}</p>
            <p class="text-xs text-slate-500 dark:text-slate-400 truncate">${esc(card.setName || '')} · ${esc(card.number || '')}</p>
            <p class="text-sm mt-1">
              <span class="font-semibold text-slate-900 dark:text-slate-100">${money(item.marketPrice)}</span>
              <span class="text-slate-400"> market</span>
              ${deal === true ? '<span class="ml-2 text-emerald-600 dark:text-emerald-400 font-semibold">Below your max</span>' : ''}
            </p>
          </div>
        </div>

        <div class="flex items-center gap-3 flex-shrink-0">
          <div>
            <label class="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">Max price</label>
            <div class="relative w-28">
              <span class="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
              <input type="number" min="0" step="0.01" value="${item.maxPrice ?? ''}" data-max="${item.id}"
                class="w-full pl-6 pr-2 py-1.5 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
          </div>

          <div>
            <label class="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">Priority</label>
            <select data-priority="${item.id}"
              class="px-2 py-1.5 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500">
              ${PRIORITIES.map(([value, label]) =>
                `<option value="${value}" ${item.priority === value ? 'selected' : ''}>${label}</option>`).join('')}
            </select>
          </div>

          <button data-remove="${item.id}" title="Remove from want list"
            class="self-end p-2 text-slate-400 hover:text-red-500 transition" aria-label="Remove">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </article>`;
  }

  async function load() {
    try {
      const items = await getWantList();

      if (!items.length) {
        document.getElementById('empty').classList.remove('hidden');
        itemsEl.innerHTML = '';
        return;
      }

      itemsEl.innerHTML = items.map(row).join('');

      // Save max price on blur rather than per keystroke.
      itemsEl.querySelectorAll('[data-max]').forEach(input => {
        input.addEventListener('change', async () => {
          const value = input.value === '' ? null : parseFloat(input.value);
          try {
            await updateWantListItem(input.dataset.max, { maxPrice: value });
            load();   // re-render so the "below your max" flag updates
          } catch (err) {
            alert(err.message);
          }
        });
      });

      itemsEl.querySelectorAll('[data-priority]').forEach(select => {
        select.addEventListener('change', async () => {
          try {
            await updateWantListItem(select.dataset.priority, { priority: parseInt(select.value, 10) });
            load();
          } catch (err) {
            alert(err.message);
          }
        });
      });

      itemsEl.querySelectorAll('[data-remove]').forEach(button => {
        button.addEventListener('click', async () => {
          button.disabled = true;
          try {
            await removeWantListItem(button.dataset.remove);
            load();
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
