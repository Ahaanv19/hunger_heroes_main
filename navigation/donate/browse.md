---
layout: base
title: Browse Donations
permalink: /donate/browse
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
        <h1 class="text-3xl font-bold text-slate-900 dark:text-white">Browse Donations</h1>
        <p class="text-slate-500 dark:text-slate-400 mt-1">Sort and filter all food donations</p>
      </div>
    </div>

    <!-- Controls -->
    <div class="flex flex-col sm:flex-row gap-3 mb-6">
      <div class="flex-1">
        <label for="sort-select" class="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Sort By</label>
        <select id="sort-select"
          class="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm">
          <option value="created">Newest First</option>
          <option value="expiry">Expiring Soonest</option>
          <option value="quantity">Most Quantity</option>
        </select>
      </div>
      <div class="flex-1">
        <label for="status-filter" class="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Filter by Status</label>
        <select id="status-filter"
          class="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm">
          <option value="">All Statuses</option>
          <option value="active">📋 Active</option>
          <option value="accepted">🤝 Accepted</option>
          <option value="in-transit">🚚 In Transit</option>
          <option value="delivered">📦 Delivered</option>
          <option value="cancelled">❌ Cancelled</option>
          <option value="expired">⏰ Expired</option>
        </select>
      </div>
    </div>

    <!-- Results count -->
    <p id="results-count" class="text-sm text-slate-400 mb-4"></p>

    <!-- Donation grid -->
    <div id="browse-list">
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

<script type="module">
  // ============================================
  // SRP IMPORTS: Shared single-responsibility functions
  // ============================================
  import {
    javaURI, pythonURI,
    springFetch, flaskFetch,
    statusBadge, urgencyBadge, sourceBadge,
    sortByUrgency, normalizeDonationList,
    errorPlaceholder, emptyPlaceholder, CATEGORY_EMOJIS,
    getLocalDonations
  } from '{{site.baseurl}}/assets/js/api/donationApi.js';

  // ============================================
  // RESPONSIBILITY: Render a single donation card
  // Parameters: d (object) — donation
  // Returns: string — HTML card
  // ============================================
  function renderBrowseCard(d) {
    const dte = d.days_until_expiry ?? null;
    const expiryColor = dte === null ? 'text-slate-500' : dte > 5 ? 'text-green-600 dark:text-green-400' : dte >= 2 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400';
    const catEmoji = CATEGORY_EMOJIS[d.category] || '📦';
    return `
    <div class="donation-card glass rounded-2xl shadow-soft border border-slate-200/50 dark:border-slate-700/50 p-5 hover:shadow-large transition-all">
      <div class="flex items-start justify-between mb-3">
        <h3 class="font-bold text-slate-900 dark:text-white text-base truncate flex-1">${d.food_name || 'Food Donation'}</h3>
        ${statusBadge(d.status)}
        ${urgencyBadge(d)}
      </div>
      <div class="space-y-1.5 text-sm text-slate-500 dark:text-slate-400">
        <div class="flex items-center gap-2">
          <span>${catEmoji} ${d.category || '—'}</span>
          <span class="text-slate-300 dark:text-slate-600">·</span>
          <span>📦 ${d.quantity || '—'} ${d.unit || ''}</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="${expiryColor} font-medium">📅 ${d.expiry_date || d.expiration_date || '—'}${dte !== null ? ` (${dte}d)` : ''}</span>
        </div>
        <div class="flex items-center gap-2">
          <span>👤 ${d.donor_name || 'Anonymous'}</span>
          <span class="text-slate-300 dark:text-slate-600">·</span>
          <span>📍 ${d.donor_zip || d.zip_code || '—'}</span>
        </div>
        ${d.allergens && d.allergens.length ? `<div class="flex flex-wrap gap-1 pt-1">${d.allergens.map(a => `<span class="px-2 py-0.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded text-xs font-medium">${a}</span>`).join('')}</div>` : ''}
        ${d.dietary_tags && d.dietary_tags.length ? `<div class="flex flex-wrap gap-1 pt-1">${d.dietary_tags.map(t => `<span class="px-2 py-0.5 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded text-xs font-medium">${t}</span>`).join('')}</div>` : ''}
      </div>
    </div>`;
  }

  // ============================================
  // RESPONSIBILITY: Parse URL query parameters
  // Returns: { zip, dietary, allergen, sortBy }
  // ============================================
  function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    return {
      zip: params.get('zip') || '',
      dietary: params.get('dietary') ? params.get('dietary').split(',').map(d => d.trim()) : [],
      allergen: params.get('allergen') ? params.get('allergen').split(',').map(a => a.trim()) : [],
      sortBy: params.get('sortBy') || 'created',
    };
  }

  // ============================================
  // RESPONSIBILITY: Apply client-side filtering by zip and allergens (for search results)
  // Parameters: raw (array), zip (string), allergenExclude (array)
  // Returns: array — filtered donations
  // ============================================
  function filterBySearchCriteria(donations, zip, allergenExclude) {
    let result = donations;

    // Zip filter (match first 3 digits)
    if (zip) {
      result = result.filter(d => {
        const donorZip = d.donor_zip || d.zip_code || '';
        return donorZip.startsWith(zip.substring(0, 3));
      });
    }

    // Allergen exclusion
    if (allergenExclude.length) {
      result = result.filter(d => {
        const dAllergens = (d.allergens || []).map(a => a.toLowerCase());
        return !allergenExclude.some(ex => dAllergens.includes(ex.toLowerCase()));
      });
    }

    // Only active/posted donations
    result = result.filter(d => {
      const s = (d.status || '').toLowerCase();
      return s === 'posted' || s === 'active';
    });

    return result;
  }

  // ============================================
  // RESPONSIBILITY: Apply client-side filtering to Flask data
  // Parameters: raw (array), status (string)
  // Returns: array — filtered donations
  // ============================================
  function filterByStatus(raw, status) {
    if (!status) return raw;
    const statusMap = { active: 'posted', accepted: 'claimed', 'in-transit': 'in_transit' };
    const flaskStatus = statusMap[status] || status;
    return raw.filter(d => (d.status || '').toLowerCase() === flaskStatus);
  }

  // ============================================
  // RESPONSIBILITY: Apply client-side sorting to Flask data
  // Parameters: raw (array), sortBy (string)
  // Returns: array — sorted (mutates in place for perf)
  // ============================================
  function sortDonations(raw, sortBy) {
    if (sortBy === 'expiry') raw.sort((a, b) => new Date(a.expiry_date || 0) - new Date(b.expiry_date || 0));
    else if (sortBy === 'quantity') raw.sort((a, b) => (b.quantity || 0) - (a.quantity || 0));
    else raw.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    return raw;
  }

  // ============================================
  // WORKER: Fetch user's own donations (fallback when backend unavailable)
  // Returns: array — user's donations
  // ============================================
  async function fetchUserDonations() {
    try {
      return normalizeDonationList(await flaskFetch(`${pythonURI}/api/donations?mine=true`));
    } catch (err) {
      console.log('Could not fetch user donations from Flask', err.message);
      return [];
    }
  }

  // ============================================
  // ORCHESTRATOR: Load and render donations
  // Coordinates: fetch → filter → sort → render
  // ============================================
  async function loadDonations() {
    const queryParams = getQueryParams();
    const sortBySelect = document.getElementById('sort-select');
    const statusFilter = document.getElementById('status-filter');
    
    // If search params exist, override sort selection to match search
    if (queryParams.zip) {
      sortBySelect.value = queryParams.sortBy || 'created';
    }
    
    const sortBy = sortBySelect.value;
    const status = statusFilter.value;
    const container = document.getElementById('browse-list');
    const countEl = document.getElementById('results-count');

    let items = [];
    let source = '';
    let backendUnavailable = false;
    let showingUserDonations = false;
    let hasLocalDonations = false;

    // Step 1: Try Spring sorted endpoint first (required route)
    try {
      let url = `${javaURI}/api/donations/sorted?sortBy=${sortBy}`;
      if (status) url += `&status=${status}`;
      let raw = await springFetch(url);
      // Normalize camelCase keys from Spring → snake_case for consistent frontend access
      items = Array.isArray(raw) ? raw.map(d => ({
        ...d,
        food_name: d.food_name || d.foodName,
        donor_name: d.donor_name || d.donorName,
        donor_zip: d.donor_zip || d.donorZip || d.zip_code || d.zipCode,
        expiry_date: d.expiry_date || d.expiryDate || d.expiration_date || d.expirationDate,
        dietary_tags: d.dietary_tags || d.dietaryTags,
        allergens: d.allergens,
        days_until_expiry: d.days_until_expiry ?? d.daysUntilExpiry ?? null,
      })) : [];
      source = 'spring';
    } catch (springErr) {
      console.log('Spring sorted unavailable, trying Flask…', springErr.message);
      // Step 2: Fall back to Flask with client-side sort/filter
      try {
        let raw = normalizeDonationList(await flaskFetch(`${pythonURI}/api/donations`));
        raw = filterByStatus(raw, status);
        items = sortDonations(raw, sortBy);
        source = 'flask';
      } catch (flaskErr) {
        console.log('Flask also unavailable, trying user donations…', flaskErr.message);
        backendUnavailable = true;
        // Step 3: Fall back to user's own donations when backend is completely unavailable
        items = await fetchUserDonations();
        showingUserDonations = true;
        source = '';
      }
    }

    // Step 4: MERGE localStorage donations with backend donations
    // This ensures donations created locally (but not yet synced to backend) are visible
    const localDonations = getLocalDonations();
    if (localDonations && localDonations.length > 0) {
      // Get list of backend donation IDs to avoid duplicates
      const backendIds = items.map(d => d.id);
      
      // Filter local donations to only add ones not already in backend
      const newLocalDonations = localDonations.filter(ld => !backendIds.includes(ld.id));
      
      if (newLocalDonations.length > 0) {
        hasLocalDonations = true;
        // Normalize local donations format to match backend
        const normalizedLocal = newLocalDonations.map(d => ({
          ...d,
          food_name: d.food_name || d.foodName || 'Food Donation',
          donor_name: d.donor_name || d.donorName || 'You',
          donor_zip: d.donor_zip || d.donorZip || d.zip_code || d.zipCode || '',
          expiry_date: d.expiry_date || d.expiryDate || d.expiration_date || d.expirationDate || '',
          dietary_tags: d.dietary_tags || d.dietaryTags || [],
          allergens: d.allergens || [],
          days_until_expiry: d.days_until_expiry ?? d.daysUntilExpiry ?? null,
          _source: 'localStorage' // Mark as from localStorage
        }));
        
        items = [...items, ...normalizedLocal];
      }
    }

    // Apply search filters if zip parameter is present
    if (queryParams.zip && !showingUserDonations) {
      items = filterBySearchCriteria(items, queryParams.zip, queryParams.allergen);
    }

    // Step 5: Sort urgent items first
    items = sortByUrgency(items);

    // Build results count message
    let countHtml = '';
    if (showingUserDonations) {
      countHtml = `<span class="inline-block px-3 py-1 rounded-lg text-xs font-semibold bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">⚠️ Backend unavailable</span> <span class="ml-2">Showing your published donations (${items.length})</span>`;
    } else if (backendUnavailable) {
      countHtml = `<span class="inline-block px-3 py-1 rounded-lg text-xs font-semibold bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">⚠️ Backend unavailable</span> <span class="ml-2">No donations found</span>`;
    } else {
      let sourceBadgeHtml = sourceBadge(source);
      if (hasLocalDonations) {
        sourceBadgeHtml += ` <span class="inline-block px-3 py-1 rounded-lg text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 ml-2">💾 Includes your local donations</span>`;
      }
      countHtml = `${sourceBadgeHtml} <span class="ml-2">${items.length} donation${items.length !== 1 ? 's' : ''} found</span>`;
    }
    countEl.innerHTML = countHtml;

    if (items.length === 0) {
      if (showingUserDonations || backendUnavailable) {
        container.innerHTML = emptyPlaceholder(
          backendUnavailable ? 'No Donations Available' : 'You haven\'t published any donations yet',
          backendUnavailable ? 'The backend is currently unavailable. Please try again later.' : 'Start by publishing a donation to help others in need!',
          '🤔'
        );
      } else {
        container.innerHTML = emptyPlaceholder('No Donations Found', 'Try changing the filters or check back later for new donations.');
      }
      return;
    }

    // Step 6: Render cards
    container.innerHTML = `<div class="grid grid-cols-1 md:grid-cols-2 gap-4">${items.map(renderBrowseCard).join('')}</div>`;
  }

  document.addEventListener('DOMContentLoaded', loadDonations);
  document.getElementById('sort-select').addEventListener('change', loadDonations);
  document.getElementById('status-filter').addEventListener('change', loadDonations);
</script>
