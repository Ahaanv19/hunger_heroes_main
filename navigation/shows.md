---
layout: base
title: Card Shows
permalink: /shows
---

<div class="flex items-start justify-between gap-4 mb-8">
  <div>
    <h1 class="text-4xl font-bold text-slate-900 dark:text-slate-50 mb-2">Card Shows &amp; Expos</h1>
    <p class="text-slate-600 dark:text-slate-400">
      Collect-A-Con, regionals, and local shows — searchable by date and distance.
      Nobody else indexes these.
    </p>
  </div>
  <!-- Admin-only: revealed by the script once we confirm the role -->
  <button id="add-show-toggle"
    class="hidden flex-shrink-0 px-4 py-2 bg-accent-500 hover:bg-accent-400 text-slate-900 rounded-lg font-semibold text-sm shadow-lg shadow-accent-500/20 transition">
    + Add expo
  </button>
</div>

<!-- Admin: add-expo form -->
<form id="add-show-form" class="hidden mb-8 p-6 rounded-2xl border border-accent-500/40 bg-white dark:bg-slate-900">
  <h2 class="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">Add a card show</h2>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div class="md:col-span-2">
      <label class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Name *</label>
      <input name="name" required placeholder="Collect-A-Con San Diego"
        class="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-accent-500" />
    </div>
    <div>
      <label class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Start date *</label>
      <input name="startDate" type="date" required
        class="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-accent-500" />
    </div>
    <div>
      <label class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">End date</label>
      <input name="endDate" type="date"
        class="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-accent-500" />
    </div>
    <div>
      <label class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Venue</label>
      <input name="venue" placeholder="San Diego Convention Center"
        class="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-accent-500" />
    </div>
    <div>
      <label class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">City</label>
      <input name="city" placeholder="San Diego"
        class="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-accent-500" />
    </div>
    <div>
      <label class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">State</label>
      <input name="state" maxlength="2" placeholder="CA"
        class="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-accent-500 uppercase" />
    </div>
    <div>
      <label class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Zip</label>
      <input name="zipCode" placeholder="92101"
        class="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-accent-500" />
    </div>
    <div>
      <label class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Latitude</label>
      <input name="latitude" type="number" step="any" placeholder="32.7057"
        class="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-accent-500" />
    </div>
    <div>
      <label class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Longitude</label>
      <input name="longitude" type="number" step="any" placeholder="-117.1611"
        class="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-accent-500" />
      <p class="text-[11px] text-slate-400 mt-1">Needed for "shows near me" distance search.</p>
    </div>
    <div>
      <label class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Admission ($)</label>
      <input name="admission" type="number" step="0.01" min="0" placeholder="35"
        class="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-accent-500" />
    </div>
    <div>
      <label class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Approx. vendors</label>
      <input name="vendorCount" type="number" min="0" placeholder="400"
        class="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-accent-500" />
    </div>
    <div class="md:col-span-2">
      <label class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Official URL</label>
      <input name="url" type="url" placeholder="https://collectacon.com"
        class="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-accent-500" />
    </div>
    <div class="md:col-span-2">
      <label class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Description</label>
      <textarea name="description" rows="2" placeholder="Hundreds of vendors, on-site grading…"
        class="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-accent-500"></textarea>
    </div>
    <div class="md:col-span-2">
      <label class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Tags (comma-separated)</label>
      <input name="tags" placeholder="pokemon, grading-onsite, artist-alley"
        class="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-accent-500" />
    </div>
  </div>
  <div class="mt-5 flex items-center gap-3">
    <button type="submit" id="add-show-submit"
      class="px-5 py-2.5 bg-accent-500 hover:bg-accent-400 disabled:bg-slate-400 text-slate-900 rounded-lg font-semibold text-sm shadow-lg shadow-accent-500/20 transition">
      Save expo
    </button>
    <button type="button" id="add-show-cancel"
      class="px-5 py-2.5 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg font-semibold text-sm transition">
      Cancel
    </button>
    <p id="add-show-message" class="text-sm font-medium"></p>
  </div>
</form>

<!-- Filters -->
<div class="mb-8 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    <div class="lg:col-span-2">
      <label for="s-search" class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Search</label>
      <input type="search" id="s-search" placeholder="Collect-A-Con…"
        class="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500" />
    </div>
    <div>
      <label for="s-state" class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">State</label>
      <select id="s-state" class="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500">
        <option value="">Anywhere</option>
      </select>
    </div>
    <div class="flex items-end">
      <button id="near-me"
        class="w-full px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-lg font-semibold text-sm shadow-lg shadow-primary-600/20 transition">
        Shows near me
      </button>
    </div>
    <div>
      <label for="s-after" class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">On or after</label>
      <input type="date" id="s-after"
        class="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500" />
    </div>
    <div>
      <label for="s-before" class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">On or before</label>
      <input type="date" id="s-before"
        class="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500" />
    </div>
    <div class="flex items-end">
      <button id="clear-dates"
        class="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg font-medium text-sm transition">
        Clear dates
      </button>
    </div>
  </div>
  <p id="geo-status" class="mt-3 text-xs text-slate-500 dark:text-slate-400"></p>
</div>

<p id="show-count" class="text-sm text-slate-500 dark:text-slate-400 mb-4"></p>
<div id="show-list" class="space-y-4"></div>

<div id="show-empty" class="hidden text-center py-20">
  <p class="text-lg font-medium text-slate-700 dark:text-slate-300">No shows match that search.</p>
  <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">Try a wider area, a different date range, or clear the filters.</p>
</div>

<script type="module">
  import {
    searchShows, getShowFilters, createShow, deleteShow, getCurrentUser,
    money, formatDateRange, esc,
  } from '{{site.baseurl}}/assets/js/api/tcgApi.js';

  const list = document.getElementById('show-list');
  const empty = document.getElementById('show-empty');
  const count = document.getElementById('show-count');
  const geoStatus = document.getElementById('geo-status');
  const searchInput = document.getElementById('s-search');
  const stateSelect = document.getElementById('s-state');
  const afterInput = document.getElementById('s-after');
  const beforeInput = document.getElementById('s-before');

  let coords = null;   // set by "shows near me"
  let isAdmin = false;

  function tag(text) {
    return `<span class="px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">${esc(text)}</span>`;
  }

  function countdown(days) {
    if (days < 0) return '<span class="text-slate-400">Past</span>';
    if (days === 0) return '<span class="text-accent-500 font-semibold">Today</span>';
    if (days === 1) return '<span class="text-accent-500 font-semibold">Tomorrow</span>';
    if (days <= 30) return `<span class="text-accent-600 dark:text-accent-400 font-semibold">In ${days} days</span>`;
    return `<span class="text-slate-500 dark:text-slate-400">In ${days} days</span>`;
  }

  function showTemplate(show) {
    const admission = show.admission === 0 ? 'Free entry'
      : show.admission ? `${money(show.admission)} entry` : null;

    return `
      <article class="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-primary-500 transition">
        <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div class="min-w-0">
            <h2 class="text-lg font-bold text-slate-900 dark:text-slate-100">${esc(show.name)}</h2>
            <p class="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
              ${esc(show.venue || '')}${show.venue && show.city ? ' · ' : ''}${esc(show.city || '')}${show.state ? `, ${esc(show.state)}` : ''}
            </p>
            <p class="text-sm font-medium text-slate-700 dark:text-slate-300 mt-2">
              ${esc(formatDateRange(show.startDate, show.endDate))}
              <span class="mx-1.5 text-slate-300 dark:text-slate-600">·</span>
              ${countdown(show.daysUntil)}
            </p>
          </div>
          <div class="flex-shrink-0 text-right">
            ${show.distanceMiles !== undefined
              ? `<p class="text-sm font-bold text-primary-600 dark:text-primary-400">${show.distanceMiles} mi away</p>` : ''}
            ${show.vendorCount ? `<p class="text-xs text-slate-500 mt-0.5">~${show.vendorCount} vendors</p>` : ''}
          </div>
        </div>

        ${show.description ? `<p class="mt-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">${esc(show.description)}</p>` : ''}

        <div class="mt-4 flex flex-wrap items-center gap-2">
          ${admission ? tag(admission) : ''}
          ${(show.tags || []).map(tag).join('')}
          ${show.url ? `
            <a href="${esc(show.url)}" target="_blank" rel="noopener noreferrer"
               class="text-sm font-semibold text-primary-600 dark:text-primary-400 hover:underline">
              Details &amp; tickets →
            </a>` : ''}
          ${isAdmin ? `
            <button data-delete="${show.id}"
              class="ml-auto text-xs font-medium text-red-500 hover:text-red-400 transition">
              Delete
            </button>` : ''}
        </div>
      </article>`;
  }

  async function load() {
    list.innerHTML = '<p class="text-sm text-slate-500 py-8 text-center">Loading shows…</p>';
    empty.classList.add('hidden');

    const params = {
      q: searchInput.value.trim(),
      state: stateSelect.value,
      startAfter: afterInput.value,
      startBefore: beforeInput.value,
    };
    // An explicit "on or before" in the past means the user wants to include
    // past shows, so don't force the upcoming-only default.
    if (beforeInput.value) params.upcoming = 'false';
    if (coords) {
      params.lat = coords.lat;
      params.lng = coords.lng;
      params.radius = 150;
      params.upcoming = 'false';
    }

    try {
      const data = await searchShows(params);

      if (!data.shows.length) {
        list.innerHTML = '';
        count.textContent = '';
        empty.classList.remove('hidden');
        return;
      }

      list.innerHTML = data.shows.map(showTemplate).join('');
      count.textContent = coords
        ? `${data.count} show${data.count === 1 ? '' : 's'} within 150 miles`
        : `${data.count} show${data.count === 1 ? '' : 's'}`;

      if (isAdmin) {
        list.querySelectorAll('[data-delete]').forEach(button => {
          button.addEventListener('click', async () => {
            if (!confirm('Delete this show?')) return;
            button.disabled = true;
            try {
              await deleteShow(button.dataset.delete);
              load();
            } catch (err) {
              button.disabled = false;
              alert(err.message);
            }
          });
        });
      }
    } catch (err) {
      list.innerHTML = `<p class="text-center py-12 text-red-500">Couldn't load shows: ${esc(err.message)}</p>`;
      count.textContent = '';
    }
  }

  // --- Filter wiring ---
  document.getElementById('near-me').addEventListener('click', () => {
    if (!navigator.geolocation) {
      geoStatus.textContent = 'Your browser does not support location lookup.';
      return;
    }
    geoStatus.textContent = 'Finding your location…';
    navigator.geolocation.getCurrentPosition(
      (position) => {
        coords = { lat: position.coords.latitude, lng: position.coords.longitude };
        stateSelect.value = '';
        geoStatus.textContent = 'Showing shows within 150 miles of you.';
        load();
      },
      () => { geoStatus.textContent = 'Location permission denied — use the state filter instead.'; }
    );
  });

  let debounce;
  searchInput.addEventListener('input', () => {
    clearTimeout(debounce);
    debounce = setTimeout(load, 350);
  });

  stateSelect.addEventListener('change', () => {
    coords = null;
    geoStatus.textContent = '';
    load();
  });

  [afterInput, beforeInput].forEach(el => el.addEventListener('change', load));

  document.getElementById('clear-dates').addEventListener('click', () => {
    afterInput.value = '';
    beforeInput.value = '';
    load();
  });

  // --- Admin add-expo form ---
  const form = document.getElementById('add-show-form');
  const toggle = document.getElementById('add-show-toggle');

  function setupAdminForm() {
    toggle.classList.remove('hidden');
    toggle.addEventListener('click', () => form.classList.toggle('hidden'));
    document.getElementById('add-show-cancel').addEventListener('click', () => form.classList.add('hidden'));

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submit = document.getElementById('add-show-submit');
      const messageEl = document.getElementById('add-show-message');
      submit.disabled = true;
      messageEl.style.color = '';
      messageEl.textContent = 'Saving…';

      const fd = new FormData(form);
      const numeric = (v) => (v === '' || v === null ? undefined : Number(v));
      const payload = {
        name: fd.get('name'),
        startDate: fd.get('startDate'),
        endDate: fd.get('endDate') || undefined,
        venue: fd.get('venue') || undefined,
        city: fd.get('city') || undefined,
        state: (fd.get('state') || '').toUpperCase() || undefined,
        zipCode: fd.get('zipCode') || undefined,
        latitude: numeric(fd.get('latitude')),
        longitude: numeric(fd.get('longitude')),
        admission: numeric(fd.get('admission')),
        vendorCount: numeric(fd.get('vendorCount')),
        url: fd.get('url') || undefined,
        description: fd.get('description') || undefined,
        tags: (fd.get('tags') || '').split(',').map(t => t.trim()).filter(Boolean),
      };

      try {
        await createShow(payload);
        messageEl.style.color = '#22c55e';
        messageEl.textContent = 'Expo added.';
        form.reset();
        form.classList.add('hidden');
        // Refresh filters (a new state may now exist) and the list.
        await refreshStates();
        load();
      } catch (err) {
        messageEl.style.color = '#ef4444';
        messageEl.textContent = err.status === 403
          ? 'Admin access required to add shows.'
          : err.message;
      } finally {
        submit.disabled = false;
      }
    });
  }

  async function refreshStates() {
    try {
      const filters = await getShowFilters();
      const current = stateSelect.value;
      stateSelect.innerHTML = '<option value="">Anywhere</option>' +
        filters.states.map(s => `<option value="${esc(s)}">${esc(s)}</option>`).join('');
      stateSelect.value = current;
    } catch (_) { /* filters optional */ }
  }

  // --- Boot ---
  (async () => {
    await refreshStates();

    const user = await getCurrentUser();
    if (user && user.role === 'Admin') {
      isAdmin = true;
      setupAdminForm();
    }

    load();
  })();
</script>
