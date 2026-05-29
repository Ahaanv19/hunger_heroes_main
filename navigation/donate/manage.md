---
layout: base
title: Manage Donations
permalink: /donate/manage
search_exclude: true
menu: nav/home.html
---

<div class="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
  <div class="max-w-5xl mx-auto">

    <!-- Back -->
    <a href="{{site.baseurl}}/donate/" class="inline-flex items-center text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 mb-6 transition-colors group">
      <svg class="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
      </svg>
      Back to Donate
    </a>

    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
      <div>
        <h1 class="text-3xl font-bold text-slate-900 dark:text-white">Manage Donations</h1>
        <p class="text-slate-500 dark:text-slate-400 mt-1">Accept, deliver, or cancel donations</p>
      </div>
      <a href="{{site.baseurl}}/donate/create"
        class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-semibold text-sm shadow-medium hover:shadow-large transition-all whitespace-nowrap">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
        </svg>
        New Donation
      </a>
    </div>

    <!-- Filter Tabs -->
    <div class="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
      <button class="filter-btn active px-4 py-2 rounded-xl text-sm font-semibold transition-all" data-filter="all" onclick="filterManage('all')">All</button>
      <button class="filter-btn px-4 py-2 rounded-xl text-sm font-semibold transition-all" data-filter="active" onclick="filterManage('active')">📋 Active</button>
      <button class="filter-btn px-4 py-2 rounded-xl text-sm font-semibold transition-all" data-filter="accepted" onclick="filterManage('accepted')">🤝 Accepted</button>
      <button class="filter-btn px-4 py-2 rounded-xl text-sm font-semibold transition-all" data-filter="in-transit" onclick="filterManage('in-transit')">🚚 In Transit</button>
      <button class="filter-btn px-4 py-2 rounded-xl text-sm font-semibold transition-all" data-filter="delivered" onclick="filterManage('delivered')">📦 Delivered</button>
      <button class="filter-btn px-4 py-2 rounded-xl text-sm font-semibold transition-all" data-filter="cancelled" onclick="filterManage('cancelled')">❌ Cancelled</button>
    </div>

    <!-- Donations List -->
    <div id="manage-list">
      <div class="text-center py-16 text-slate-400">
        <svg class="w-8 h-8 animate-spin mx-auto mb-3 text-primary-500" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
        Loading donations…
      </div>
    </div>

  </div>
</div>

<!-- Toast -->
<div id="toast" class="fixed bottom-6 right-6 z-50 hidden">
  <div id="toast-inner" class="px-5 py-3 rounded-xl text-white text-sm font-semibold shadow-large flex items-center gap-2"></div>
</div>

<script type="module">
  // ============================================
  // SRP IMPORTS: Each function from donationApi.js has ONE responsibility
  // ============================================
  import {
    javaURI, pythonURI, fetchOptions,
    springFetch, flaskFetch, dualFetch,
    normalizeStatus, statusBadge, urgencyBadge, sourceBadge,
    computeUrgency, sortByUrgency,
    normalizeDonationList, showToast, emptyPlaceholder, errorPlaceholder,
    ERROR_TYPES, getErrorMessage, getLocalDonations
  } from '{{site.baseurl}}/assets/js/api/donationApi.js';

  let allDonations = [];
  let currentFilter = 'all';
  let dataSource = '';

  // ============================================
  // RESPONSIBILITY: Build action buttons for a donation
  // Parameters: donation (object)
  // Returns: string — HTML buttons
  // ============================================
  function actionButtons(d) {
    const s = normalizeStatus(d.status);
    const id = d.id;
    const btns = [];
    if (s === 'active') {
      btns.push(`<button data-action="accept" data-id="${id}" class="action-btn px-3 py-1.5 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg text-xs font-semibold transition-colors">🤝 Accept</button>`);
      btns.push(`<button data-action="cancel" data-id="${id}" class="action-btn px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-semibold transition-colors">❌ Cancel</button>`);
    } else if (s === 'accepted' || s === 'in-transit') {
      btns.push(`<button data-action="deliver" data-id="${id}" class="action-btn px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg text-xs font-semibold transition-colors">📦 Deliver</button>`);
      if (s === 'accepted') {
        btns.push(`<button data-action="cancel" data-id="${id}" class="action-btn px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-semibold transition-colors">❌ Cancel</button>`);
      }
    }
    if (s === 'accepted' || s === 'delivered' || s === 'cancelled') {
      btns.push(`<button data-action="undo" data-id="${id}" class="action-btn px-3 py-1.5 bg-slate-500 hover:bg-slate-600 text-white rounded-lg text-xs font-semibold transition-colors">↩️ Undo</button>`);
    }
    return btns.length ? btns.join(' ') : '<span class="text-xs text-slate-400">No actions</span>';
  }

  // ============================================
  // RESPONSIBILITY: Render a single donation card
  // Parameters: d (object) — donation
  // Returns: string — HTML card
  // ============================================
  function renderDonationCard(d) {
    return `
      <div class="donation-card glass rounded-2xl shadow-soft border border-slate-200/50 dark:border-slate-700/50 p-5 hover:shadow-large transition-all" data-donation-id="${d.id}">
        <div class="flex flex-col sm:flex-row sm:items-center gap-4">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-3 mb-2">
              <h3 class="font-bold text-slate-900 dark:text-white text-lg truncate">${d.food_name || d.foodName || 'Food Donation'}</h3>
              ${statusBadge(d.status)}
              ${urgencyBadge(d)}
            </div>
            <div class="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500 dark:text-slate-400">
              <span>👤 ${d.donor_name || d.donorName || 'Anonymous'}</span>
              <span>📂 ${d.category || '—'}</span>
              <span>📅 Exp: ${d.expiry_date || d.expiration_date || d.expirationDate || '—'}</span>
              <span>📍 ${d.zip_code || d.zipCode || '—'}</span>
            </div>
          </div>
          <div class="flex items-center gap-2 flex-shrink-0">
            ${actionButtons(d)}
          </div>
        </div>
      </div>`;
  }

  // ============================================
  // RESPONSIBILITY: Render the full donation list to DOM
  // Parameters: none (reads module-level state)
  // ============================================
  function render() {
    const container = document.getElementById('manage-list');
    const filtered = currentFilter === 'all'
      ? allDonations
      : allDonations.filter(d => normalizeStatus(d.status) === currentFilter);

    if (filtered.length === 0) {
      container.innerHTML = emptyPlaceholder(
        'No Donations Found',
        currentFilter === 'all' ? 'No donations yet.' : 'No donations with this status.'
      );
      return;
    }

    // Sort urgent donations first, then render
    const sorted = sortByUrgency(filtered);
    
    // Check if there are any localStorage donations in the results
    const hasLocalDonations = sorted.some(d => d._source === 'localStorage');
    let badgeHtml = '';
    if (dataSource) {
      badgeHtml = `<div class="mb-4 flex items-center gap-2">${sourceBadge(dataSource)}<span class="text-xs text-slate-400">${sorted.length} donation${sorted.length !== 1 ? 's' : ''}</span>`;
      if (hasLocalDonations && dataSource !== 'localStorage') {
        badgeHtml += `<span class="inline-block px-3 py-1 rounded-lg text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">💾 Includes your local donations</span>`;
      }
      badgeHtml += '</div>';
    }

    container.innerHTML = badgeHtml + `<div class="space-y-4">${sorted.map(renderDonationCard).join('')}</div>`;
  }

  // ============================================
  // RESPONSIBILITY: Handle filter tab clicks
  // Parameters: status (string) — filter value
  // ============================================
  window.filterManage = function(status) {
    currentFilter = status;
    document.querySelectorAll('.filter-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.filter === status);
    });
    render();
  };

  // ============================================
  // RESPONSIBILITY: Execute a donation action via Spring, Flask fallback
  // Parameters: id (string), action (string), btn (Element)
  // This is a WORKER function — does the actual API call
  // ============================================
  async function executeDonationAction(id, action) {
    // Step 1: Try Spring first (plural /api/donations/{id}/{action})
    let springErr = null;
    try {
      await springFetch(`${javaURI}/api/donations/${id}/${action}`, { method: 'POST' });
      return { success: true, source: 'spring' };
    } catch (e) {
      springErr = e;
      console.log('Spring action failed, trying Flask…', e.message);
    }

    // Step 2: Flask fallback — singular /api/donation/{id}/{action}
    // Flask supports: accept, deliver (per BACKEND_BARCODE_API_PROMPT.md)
    // cancel/undo: try both singular & plural endpoints
    const flaskEndpoints = {
      accept:  [`${pythonURI}/api/donation/${id}/accept`,  `${pythonURI}/api/donations/${id}/accept`],
      deliver: [`${pythonURI}/api/donation/${id}/deliver`, `${pythonURI}/api/donations/${id}/deliver`],
      cancel:  [`${pythonURI}/api/donation/${id}/cancel`,  `${pythonURI}/api/donations/${id}/cancel`],
      undo:    [`${pythonURI}/api/donation/${id}/undo`,    `${pythonURI}/api/donations/${id}/undo`]
    };
    const urls = flaskEndpoints[action] || [];
    for (const url of urls) {
      try {
        await flaskFetch(url, { method: 'POST', body: JSON.stringify({}) });
        return { success: true, source: 'flask' };
      } catch (e) { /* try next */ }
    }

    // Step 3: Last-resort generic status PATCH (only for cancel/undo where no action endpoint exists)
    const statusMap = { accept: 'accepted', deliver: 'delivered', cancel: 'cancelled', undo: 'active' };
    const newStatus = statusMap[action];
    if (newStatus) {
      const patchUrls = [
        `${pythonURI}/api/donation/${id}/status`,
        `${pythonURI}/api/donations/${id}/status`
      ];
      for (const url of patchUrls) {
        try {
          await flaskFetch(url, { method: 'PATCH', body: JSON.stringify({ status: newStatus }) });
          return { success: true, source: 'flask' };
        } catch (e) { /* try next */ }
      }
    }

    // Everything failed — surface original Spring error (usually auth)
    throw springErr || new Error(ERROR_TYPES.BACKEND_UNAVAILABLE);
  }

  // ============================================
  // RESPONSIBILITY: Orchestrate action button clicks (UI + delegation)
  // This is an ORCHESTRATOR — manages UI state, delegates work
  // ============================================
  document.getElementById('manage-list').addEventListener('click', async (e) => {
    const btn = e.target.closest('.action-btn');
    if (!btn) return;
    const action = btn.dataset.action;
    const id = btn.dataset.id;

    // UI state: disable button
    btn.disabled = true;
    const origText = btn.textContent;
    btn.textContent = '…';

    executeDonationAction(id, action)
      .then(({ source }) => {
        showToast(`Donation ${action}ed successfully! (${source})`);
        return loadDonations();
      })
      .catch(err => {
        btn.disabled = false;
        btn.textContent = origText;
        let msg;
        if (err.message === ERROR_TYPES.AUTHENTICATION_REQUIRED) {
          msg = '🔒 Session expired — please log in again';
        } else if (err.message && err.message.startsWith('HTTP_ERROR_4')) {
          msg = `Action not allowed (${err.message.replace('HTTP_ERROR_', '')})`;
        } else {
          msg = getErrorMessage(err);
        }
        showToast(msg, 'error');
      });
  });

  // ============================================
  // ORCHESTRATOR: Load donations — coordinates fetch → render
  // ============================================
  async function loadDonations() {
    const container = document.getElementById('manage-list');
    try {
      const { data, source } = await dualFetch(
        `${javaURI}/api/donations`,
        `${pythonURI}/api/donations`,
        {},
        normalizeDonationList
      );
      allDonations = Array.isArray(data) ? data : normalizeDonationList(data);
      dataSource = source;
      
      // MERGE localStorage donations with backend donations
      const localDonations = getLocalDonations();
      if (localDonations && localDonations.length > 0) {
        // Get list of backend donation IDs to avoid duplicates
        const backendIds = allDonations.map(d => d.id || d.donationId);
        
        // Filter local donations to only add ones not already in backend
        const newLocalDonations = localDonations.filter(ld => !backendIds.includes(ld.id));
        
        if (newLocalDonations.length > 0) {
          // Normalize local donations format to match backend
          const normalizedLocal = newLocalDonations.map(d => ({
            ...d,
            food_name: d.food_name || d.foodName || 'Food Donation',
            donor_name: d.donor_name || d.donorName || 'You',
            category: d.category || '—',
            expiry_date: d.expiry_date || d.expiryDate || d.expiration_date || d.expirationDate || '',
            zip_code: d.donor_zip || d.donorZip || d.zip_code || d.zipCode || '',
            _source: 'localStorage' // Mark as from localStorage
          }));
          
          allDonations = [...allDonations, ...normalizedLocal];
        }
      }
      
      render();
    } catch (err) {
      // If both backends fail, try to show localStorage donations only
      const localDonations = getLocalDonations();
      if (localDonations && localDonations.length > 0) {
        allDonations = localDonations.map(d => ({
          ...d,
          food_name: d.food_name || d.foodName || 'Food Donation',
          donor_name: d.donor_name || d.donorName || 'You',
          category: d.category || '—',
          expiry_date: d.expiry_date || d.expiryDate || d.expiration_date || d.expirationDate || '',
          zip_code: d.donor_zip || d.donorZip || d.zip_code || d.zipCode || '',
          _source: 'localStorage'
        }));
        dataSource = 'localStorage';
        render();
      } else {
        container.innerHTML = errorPlaceholder(getErrorMessage(err));
      }
    }
  }

  document.addEventListener('DOMContentLoaded', loadDonations);
</script>
