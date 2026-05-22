---
layout: base
title: Find Food Near You
permalink: /donate/match
search_exclude: true
menu: nav/home.html
---

<div class="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
  <div class="max-w-3xl mx-auto">

    <!-- Back -->
    <a href="{{site.baseurl}}/donate/" class="inline-flex items-center text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 mb-6 transition-colors group">
      <svg class="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
      </svg>
      Back to Donate
    </a>

    <!-- Header -->
    <div class="text-center mb-10">
      <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-blue-500 shadow-lg mb-4">
        <svg class="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
        </svg>
      </div>
      <h1 class="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">Find Food Near You</h1>
      <p class="text-slate-500 dark:text-slate-400 text-lg">Enter your zip code and preferences to find available donations</p>
    </div>

    <!-- Search Form -->
    <div class="glass rounded-3xl shadow-large p-6 sm:p-8 border border-slate-200/50 dark:border-slate-700/50 mb-8">
      <form id="match-form" class="space-y-6">

        <!-- Zip Code -->
        <div>
          <label for="zip" class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Zip Code</label>
          <input id="zip" type="text" maxlength="5" pattern="[0-9]{5}" required
            class="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            placeholder="e.g. 92127">
        </div>

        <!-- Dietary Preferences -->
        <fieldset>
          <legend class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Dietary Preferences</legend>
          <div class="flex flex-wrap gap-3">
            <label class="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors has-[:checked]:bg-green-50 has-[:checked]:border-green-400 dark:has-[:checked]:bg-green-900/20 dark:has-[:checked]:border-green-500">
              <input type="checkbox" name="dietary" value="vegetarian" class="accent-green-600 w-4 h-4">
              <span class="text-sm text-slate-700 dark:text-slate-300">🥬 Vegetarian</span>
            </label>
            <label class="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors has-[:checked]:bg-green-50 has-[:checked]:border-green-400 dark:has-[:checked]:bg-green-900/20 dark:has-[:checked]:border-green-500">
              <input type="checkbox" name="dietary" value="vegan" class="accent-green-600 w-4 h-4">
              <span class="text-sm text-slate-700 dark:text-slate-300">🌱 Vegan</span>
            </label>
            <label class="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors has-[:checked]:bg-green-50 has-[:checked]:border-green-400 dark:has-[:checked]:bg-green-900/20 dark:has-[:checked]:border-green-500">
              <input type="checkbox" name="dietary" value="halal" class="accent-green-600 w-4 h-4">
              <span class="text-sm text-slate-700 dark:text-slate-300">🍖 Halal</span>
            </label>
            <label class="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors has-[:checked]:bg-green-50 has-[:checked]:border-green-400 dark:has-[:checked]:bg-green-900/20 dark:has-[:checked]:border-green-500">
              <input type="checkbox" name="dietary" value="kosher" class="accent-green-600 w-4 h-4">
              <span class="text-sm text-slate-700 dark:text-slate-300">✡️ Kosher</span>
            </label>
            <label class="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors has-[:checked]:bg-green-50 has-[:checked]:border-green-400 dark:has-[:checked]:bg-green-900/20 dark:has-[:checked]:border-green-500">
              <input type="checkbox" name="dietary" value="gluten-free" class="accent-green-600 w-4 h-4">
              <span class="text-sm text-slate-700 dark:text-slate-300">🌾 Gluten-Free</span>
            </label>
            <label class="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors has-[:checked]:bg-green-50 has-[:checked]:border-green-400 dark:has-[:checked]:bg-green-900/20 dark:has-[:checked]:border-green-500">
              <input type="checkbox" name="dietary" value="dairy-free" class="accent-green-600 w-4 h-4">
              <span class="text-sm text-slate-700 dark:text-slate-300">🥛 Dairy-Free</span>
            </label>
            <label class="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors has-[:checked]:bg-green-50 has-[:checked]:border-green-400 dark:has-[:checked]:bg-green-900/20 dark:has-[:checked]:border-green-500">
              <input type="checkbox" name="dietary" value="nut-free" class="accent-green-600 w-4 h-4">
              <span class="text-sm text-slate-700 dark:text-slate-300">🥜 Nut-Free</span>
            </label>
            <label class="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors has-[:checked]:bg-green-50 has-[:checked]:border-green-400 dark:has-[:checked]:bg-green-900/20 dark:has-[:checked]:border-green-500">
              <input type="checkbox" name="dietary" value="organic" class="accent-green-600 w-4 h-4">
              <span class="text-sm text-slate-700 dark:text-slate-300">🌿 Organic</span>
            </label>
          </div>
        </fieldset>

        <!-- Allergen Exclusions -->
        <fieldset>
          <legend class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Exclude Allergens</legend>
          <div class="flex flex-wrap gap-3">
            <label class="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors has-[:checked]:bg-red-50 has-[:checked]:border-red-400 dark:has-[:checked]:bg-red-900/20 dark:has-[:checked]:border-red-500">
              <input type="checkbox" name="allergen_exclude" value="peanuts" class="accent-red-600 w-4 h-4">
              <span class="text-sm text-slate-700 dark:text-slate-300">🥜 Peanuts</span>
            </label>
            <label class="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors has-[:checked]:bg-red-50 has-[:checked]:border-red-400 dark:has-[:checked]:bg-red-900/20 dark:has-[:checked]:border-red-500">
              <input type="checkbox" name="allergen_exclude" value="tree-nuts" class="accent-red-600 w-4 h-4">
              <span class="text-sm text-slate-700 dark:text-slate-300">🌰 Tree Nuts</span>
            </label>
            <label class="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors has-[:checked]:bg-red-50 has-[:checked]:border-red-400 dark:has-[:checked]:bg-red-900/20 dark:has-[:checked]:border-red-500">
              <input type="checkbox" name="allergen_exclude" value="dairy" class="accent-red-600 w-4 h-4">
              <span class="text-sm text-slate-700 dark:text-slate-300">🥛 Dairy</span>
            </label>
            <label class="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors has-[:checked]:bg-red-50 has-[:checked]:border-red-400 dark:has-[:checked]:bg-red-900/20 dark:has-[:checked]:border-red-500">
              <input type="checkbox" name="allergen_exclude" value="eggs" class="accent-red-600 w-4 h-4">
              <span class="text-sm text-slate-700 dark:text-slate-300">🥚 Eggs</span>
            </label>
            <label class="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors has-[:checked]:bg-red-50 has-[:checked]:border-red-400 dark:has-[:checked]:bg-red-900/20 dark:has-[:checked]:border-red-500">
              <input type="checkbox" name="allergen_exclude" value="soy" class="accent-red-600 w-4 h-4">
              <span class="text-sm text-slate-700 dark:text-slate-300">🫘 Soy</span>
            </label>
            <label class="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors has-[:checked]:bg-red-50 has-[:checked]:border-red-400 dark:has-[:checked]:bg-red-900/20 dark:has-[:checked]:border-red-500">
              <input type="checkbox" name="allergen_exclude" value="shellfish" class="accent-red-600 w-4 h-4">
              <span class="text-sm text-slate-700 dark:text-slate-300">🦐 Shellfish</span>
            </label>
            <label class="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors has-[:checked]:bg-red-50 has-[:checked]:border-red-400 dark:has-[:checked]:bg-red-900/20 dark:has-[:checked]:border-red-500">
              <input type="checkbox" name="allergen_exclude" value="wheat" class="accent-red-600 w-4 h-4">
              <span class="text-sm text-slate-700 dark:text-slate-300">🌾 Wheat</span>
            </label>
            <label class="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors has-[:checked]:bg-red-50 has-[:checked]:border-red-400 dark:has-[:checked]:bg-red-900/20 dark:has-[:checked]:border-red-500">
              <input type="checkbox" name="allergen_exclude" value="fish" class="accent-red-600 w-4 h-4">
              <span class="text-sm text-slate-700 dark:text-slate-300">🐟 Fish</span>
            </label>
          </div>
        </fieldset>

        <!-- Submit -->
        <button type="submit" id="match-btn"
          class="w-full py-3.5 px-6 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white rounded-xl font-semibold shadow-medium hover:shadow-large transition-all flex items-center justify-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          Find Matching Donations
        </button>
      </form>
    </div>

  </div>
</div>

<!-- Toast -->
<div id="toast" class="fixed bottom-6 right-6 z-50 hidden">
  <div id="toast-inner" class="px-5 py-3 rounded-xl text-white text-sm font-semibold shadow-large flex items-center gap-2"></div>
</div>

<script type="module">
  // ============================================
  // SRP IMPORTS: Shared single-responsibility functions
  // ============================================
  import {
    javaURI, pythonURI,
    springFetch, flaskFetch,
    statusBadge, urgencyBadge, sourceBadge,
    normalizeDonationList, showToast,
    emptyPlaceholder, ERROR_TYPES, getErrorMessage
  } from '{{site.baseurl}}/assets/js/api/donationApi.js';

  // ============================================
  // RESPONSIBILITY: Extract form values from the match form
  // Returns: { zip, dietary, allergenExclude }
  // ============================================
  function getFormValues() {
    return {
      zip: document.getElementById('zip').value.trim(),
      dietary: [...document.querySelectorAll('input[name="dietary"]:checked')].map(c => c.value),
      allergenExclude: [...document.querySelectorAll('input[name="allergen_exclude"]:checked')].map(c => c.value),
    };
  }

  // ============================================
  // RESPONSIBILITY: Validate zip code format
  // Parameters: zip (string)
  // Returns: boolean
  // ============================================
  function isValidZip(zip) {
    return /^\d{5}$/.test(zip);
  }

  // ============================================
  // ORCHESTRATOR: Handle form submit — validates and navigates to browse
  // ============================================
  document.getElementById('match-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const { zip, dietary, allergenExclude } = getFormValues();
    if (!isValidZip(zip)) { showToast('Please enter a valid 5-digit zip code', 'error'); return; }

    const btn = document.getElementById('match-btn');

    // UI: disable button
    btn.disabled = true;
    btn.innerHTML = '<svg class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg> Searching…';

    try {
      // Build query parameters for the browse page
      const params = new URLSearchParams();
      params.set('zip', zip);
      if (dietary.length) params.set('dietary', dietary.join(','));
      if (allergenExclude.length) params.set('allergen', allergenExclude.join(','));
      params.set('sortBy', 'created'); // Default sort by newest first

      // Navigate to browse page with search criteria
      window.location.href = `{{site.baseurl}}/donate/browse?${params.toString()}`;
    } catch (err) {
      const msg = err.message === ERROR_TYPES.AUTHENTICATION_REQUIRED
        ? 'Login required — please log in first.'
        : getErrorMessage(err);
      showToast(msg, 'error');
      btn.disabled = false;
      btn.innerHTML = '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg> Find Matching Donations';
    }
  });
</script>
