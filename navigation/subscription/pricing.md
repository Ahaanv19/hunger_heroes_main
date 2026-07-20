---
layout: base
title: Choose Your Plan
permalink: /pricing
search_exclude: true
menu: nav/home.html
---

<div id="pricing-container" class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-16 px-4 sm:px-6 lg:px-8">
  <!-- Premium Badge -->
  <div class="flex justify-center mb-8">
    <div class="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border border-yellow-500/30">
      <svg class="w-5 h-5 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
      </svg>
      <span class="text-yellow-400 font-semibold">TCG Collect Premium</span>
    </div>
  </div>

  <!-- Header -->
  <div class="text-center mb-12">
    <h1 class="text-4xl md:text-5xl font-bold text-white mb-4">
      <span class="bg-gradient-to-r from-violet-400 to-blue-500 bg-clip-text text-transparent">Choose</span> Your Plan
    </h1>
    <p class="text-gray-400 text-lg max-w-2xl mx-auto">
      Track a bigger collection, get price-drop alerts, and unlock full portfolio analytics
    </p>
  </div>

  <!-- Billing Toggle -->
  <div class="flex items-center justify-center gap-4 mb-12">
    <span id="monthly-label" class="text-gray-300 font-medium">Monthly</span>
    <label class="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" id="billing-toggle" class="sr-only peer">
      <div class="w-14 h-7 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-violet-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-violet-600"></div>
    </label>
    <span id="yearly-label" class="text-gray-500 font-medium">Yearly</span>
    <span class="ml-2 px-2 py-1 bg-violet-500/20 text-violet-400 text-xs font-semibold rounded-full">Save 20%</span>
  </div>

  <!-- Loading State -->
  <div id="loading-state" class="flex justify-center items-center py-20">
    <div class="animate-spin rounded-full h-12 w-12 border-4 border-violet-500 border-t-transparent"></div>
  </div>

  <!-- Pricing Cards -->
  <div id="pricing-cards" class="hidden max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
    
    <!-- Free Tier -->
    <div class="relative bg-gray-800/50 backdrop-blur-sm rounded-3xl p-8 border border-gray-700 hover:border-gray-600 transition-all duration-300 hover:transform hover:scale-105">
      <div class="flex justify-center mb-6">
        <div class="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center">
          <svg class="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
          </svg>
        </div>
      </div>
      
      <h3 class="text-2xl font-bold text-white text-center mb-2">Free</h3>
      <p class="text-gray-400 text-center text-sm mb-6">Start your binder</p>
      
      <div class="text-center mb-8">
        <span class="text-5xl font-bold text-white">$0</span>
        <span class="text-gray-400">/forever</span>
      </div>
      
      <ul class="space-y-4 mb-8">
        <li class="flex items-center text-gray-300">
          <svg class="w-5 h-5 text-violet-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
          Browse full catalog &amp; live prices
        </li>
        <li class="flex items-center text-gray-300">
          <svg class="w-5 h-5 text-violet-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
          Track up to <span class="text-yellow-400 font-medium">100 cards</span>
        </li>
        <li class="flex items-center text-gray-300">
          <svg class="w-5 h-5 text-violet-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
          Want list up to <span class="text-yellow-400 font-medium">25 cards</span>
        </li>
        <li class="flex items-center text-gray-300">
          <svg class="w-5 h-5 text-violet-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
          Card show directory &amp; Show Mode
        </li>
        <li class="flex items-center text-gray-500">
          <svg class="w-5 h-5 text-gray-600 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
          <span class="line-through">Portfolio analytics</span>
        </li>
        <li class="flex items-center text-gray-500">
          <svg class="w-5 h-5 text-gray-600 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
          <span class="line-through">Price-drop alerts</span>
        </li>
        <li class="flex items-center text-gray-500">
          <svg class="w-5 h-5 text-gray-600 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
          <span class="line-through">CSV import / export</span>
        </li>
      </ul>
      
      <button id="free-btn" class="w-full py-3 px-6 rounded-xl bg-gray-700 text-gray-300 font-semibold transition-all duration-300 hover:bg-gray-600">
        Current Plan
      </button>
    </div>

    <!-- Plus Tier (Most Popular) -->
    <div class="relative bg-gradient-to-b from-violet-900/30 to-gray-800/50 backdrop-blur-sm rounded-3xl p-8 border-2 border-violet-500/50 hover:border-violet-400 transition-all duration-300 transform scale-105 shadow-2xl shadow-violet-500/20">
      <!-- Most Popular Badge -->
      <div class="absolute -top-4 left-1/2 transform -translate-x-1/2">
        <span class="px-4 py-1 bg-violet-500 text-white text-sm font-bold rounded-full">MOST POPULAR</span>
      </div>
      
      <div class="flex justify-center mb-6 mt-2">
        <div class="w-16 h-16 bg-yellow-500/20 rounded-2xl flex items-center justify-center">
          <svg class="w-8 h-8 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
          </svg>
        </div>
      </div>
      
      <h3 class="text-2xl font-bold text-white text-center mb-2">Plus</h3>
      <p class="text-gray-400 text-center text-sm mb-6">For active collectors</p>
      
      <div class="text-center mb-8">
        <span id="plus-price" class="text-5xl font-bold text-white">$4.99</span>
        <span id="plus-period" class="text-gray-400">/month</span>
      </div>
      
      <ul class="space-y-4 mb-8">
        <li class="flex items-center text-gray-300">
          <svg class="w-5 h-5 text-violet-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
          Everything in Free
        </li>
        <li class="flex items-center text-gray-300">
          <svg class="w-5 h-5 text-violet-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
          Track up to <span class="text-violet-400 font-medium">2,000 cards</span>
        </li>
        <li class="flex items-center text-gray-300">
          <svg class="w-5 h-5 text-violet-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
          <span class="text-violet-400 font-medium">Unlimited</span> want list
        </li>
        <li class="flex items-center text-gray-300">
          <svg class="w-5 h-5 text-violet-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
          Full portfolio analytics (gain/loss)
        </li>
        <li class="flex items-center text-gray-300">
          <svg class="w-5 h-5 text-violet-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
          Price-drop alerts on your want list
        </li>
        <li class="flex items-center text-gray-300">
          <svg class="w-5 h-5 text-violet-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
          Set-completion tracking
        </li>
        <li class="flex items-center text-gray-500">
          <svg class="w-5 h-5 text-gray-600 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
          <span class="line-through">Bulk CSV import / export</span>
        </li>
      </ul>
      
      <button id="plus-btn" class="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-violet-500 to-violet-600 text-white font-semibold transition-all duration-300 hover:from-violet-600 hover:to-violet-700 shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50">
        Upgrade to Plus
      </button>
    </div>

    <!-- Pro Tier -->
    <div class="relative bg-gray-800/50 backdrop-blur-sm rounded-3xl p-8 border border-gray-700 hover:border-purple-500/50 transition-all duration-300 hover:transform hover:scale-105">
      <div class="flex justify-center mb-6">
        <div class="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center">
          <svg class="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
          </svg>
        </div>
      </div>
      
      <h3 class="text-2xl font-bold text-white text-center mb-2">Pro</h3>
      <p class="text-gray-400 text-center text-sm mb-6">For serious collectors &amp; sellers</p>
      
      <div class="text-center mb-8">
        <span id="pro-price" class="text-5xl font-bold text-white">$9.99</span>
        <span id="pro-period" class="text-gray-400">/month</span>
      </div>
      
      <ul class="space-y-4 mb-8">
        <li class="flex items-center text-purple-300">
          <svg class="w-5 h-5 text-purple-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
          <span class="text-purple-400 font-medium">Everything in Plus</span>
        </li>
        <li class="flex items-center text-gray-300">
          <svg class="w-5 h-5 text-violet-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
          <span class="text-violet-400 font-medium">Unlimited</span> collection
        </li>
        <li class="flex items-center text-gray-300">
          <svg class="w-5 h-5 text-violet-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
          Bulk CSV import / export
        </li>
        <li class="flex items-center text-gray-300">
          <svg class="w-5 h-5 text-violet-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
          Full cross-vendor price history export
        </li>
        <li class="flex items-center text-gray-300">
          <svg class="w-5 h-5 text-violet-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
          Early access to new set data
        </li>
        <li class="flex items-center text-gray-300">
          <svg class="w-5 h-5 text-violet-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
          Priority support
        </li>
      </ul>
      
      <button id="pro-btn" class="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold transition-all duration-300 hover:from-purple-600 hover:to-purple-700 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50">
        Upgrade to Pro
      </button>
    </div>
  </div>

  <!-- Current Subscription Info (shown when user has active subscription) -->
  <div id="subscription-info" class="hidden max-w-2xl mx-auto mt-12 bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
    <h3 class="text-xl font-semibold text-white mb-4">Your Current Subscription</h3>
    <div class="flex items-center justify-between">
      <div>
        <p class="text-gray-300">Plan: <span id="current-plan-name" class="text-violet-400 font-semibold">Free</span></p>
        <p class="text-gray-400 text-sm" id="billing-info"></p>
      </div>
      <button id="manage-subscription-btn" class="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
        Manage Subscription
      </button>
    </div>
  </div>

  <!-- FAQ Section -->
  <div class="max-w-3xl mx-auto mt-16">
    <h2 class="text-2xl font-bold text-white text-center mb-8">Frequently Asked Questions</h2>
    <div class="space-y-4">
      <details class="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-4 cursor-pointer">
        <summary class="text-white font-semibold">Can I cancel my subscription anytime?</summary>
        <p class="text-gray-400 mt-3">Yes! You can cancel your subscription at any time. You'll continue to have access to your plan until the end of your billing period.</p>
      </details>
      <details class="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-4 cursor-pointer">
        <summary class="text-white font-semibold">How does billing work?</summary>
        <p class="text-gray-400 mt-3">You'll be charged at the start of each billing period (monthly or yearly). If you choose yearly billing, you'll save 20% compared to monthly billing.</p>
      </details>
      <details class="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-4 cursor-pointer">
        <summary class="text-white font-semibold">What payment methods do you accept?</summary>
        <p class="text-gray-400 mt-3">We accept <strong class="text-blue-400">PayPal</strong> (credit/debit card or PayPal balance) for instant activation, or <strong class="text-purple-400">Zelle</strong> bank transfers for those who prefer no processing fees. PayPal payments activate your subscription immediately, while Zelle payments are verified within 24 hours.</p>
      </details>
      <details class="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-4 cursor-pointer">
        <summary class="text-white font-semibold">Can I upgrade or downgrade my plan?</summary>
        <p class="text-gray-400 mt-3">Absolutely! You can change your plan at any time. If you upgrade, you'll be charged the prorated difference. If you downgrade, your new plan will start at the next billing cycle.</p>
      </details>
    </div>
  </div>
</div>

<!-- Login Required Modal -->
<div id="login-modal" class="hidden fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
  <div class="bg-gray-800 rounded-2xl p-8 max-w-md mx-4 border border-gray-700">
    <div class="text-center">
      <div class="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
        </svg>
      </div>
      <h3 class="text-xl font-bold text-white mb-2">Login Required</h3>
      <p class="text-gray-400 mb-6">Please log in to upgrade your plan.</p>
      <div class="flex gap-4">
        <button id="modal-close-btn" class="flex-1 py-2 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
          Cancel
        </button>
        <a href="{{site.baseurl}}/login" class="flex-1 py-2 px-4 bg-violet-500 hover:bg-violet-600 text-white rounded-lg transition-colors text-center">
          Login
        </a>
      </div>
    </div>
  </div>
</div>

<script type="module">
import { pythonURI, fetchOptions } from '{{site.baseurl}}/assets/js/api/config.js';

// Pricing configuration
const PRICES = {
  monthly: {
    plus: 4.99,
    pro: 9.99
  },
  yearly: {
    plus: 47.88,  // $3.99/month
    pro: 95.88    // $7.99/month
  }
};

// DOM Elements
const billingToggle = document.getElementById('billing-toggle');
const monthlyLabel = document.getElementById('monthly-label');
const yearlyLabel = document.getElementById('yearly-label');
const plusPrice = document.getElementById('plus-price');
const plusPeriod = document.getElementById('plus-period');
const proPrice = document.getElementById('pro-price');
const proPeriod = document.getElementById('pro-period');
const loadingState = document.getElementById('loading-state');
const pricingCards = document.getElementById('pricing-cards');
const subscriptionInfo = document.getElementById('subscription-info');
const loginModal = document.getElementById('login-modal');

let currentUser = null;
let currentSubscription = null;
let isYearly = false;

// Initialize page
document.addEventListener('DOMContentLoaded', async () => {
  await loadUserAndSubscription();
  setupEventListeners();
});

// Load user and subscription data
async function loadUserAndSubscription() {
  try {
    // Check if user is logged in
    const userResponse = await fetch(`${pythonURI}/api/user`, fetchOptions);
    
    if (userResponse.ok) {
      currentUser = await userResponse.json();
      
      // Fetch subscription status
      try {
        const subResponse = await fetch(`${pythonURI}/api/subscription`, fetchOptions);
        if (subResponse.ok) {
          currentSubscription = await subResponse.json();
        }
      } catch (e) {
        console.log('No subscription data available');
      }
    }
  } catch (error) {
    console.log('User not logged in');
  }
  
  // Show pricing cards
  loadingState.classList.add('hidden');
  pricingCards.classList.remove('hidden');
  
  // Update UI based on subscription
  updateUIForSubscription();
}

// Update UI based on current subscription
function updateUIForSubscription() {
  const freeBtn = document.getElementById('free-btn');
  const plusBtn = document.getElementById('plus-btn');
  const proBtn = document.getElementById('pro-btn');
  
  // Reset buttons
  freeBtn.textContent = 'Current Plan';
  freeBtn.classList.remove('bg-violet-500', 'hover:bg-violet-600');
  freeBtn.classList.add('bg-gray-700', 'hover:bg-gray-600');
  
  plusBtn.textContent = 'Upgrade to Plus';
  proBtn.textContent = 'Upgrade to Pro';
  
  if (currentUser && currentUser.role === 'Admin') {
    // Admins have full access
    subscriptionInfo.classList.remove('hidden');
    document.getElementById('current-plan-name').textContent = 'Admin (Full Access)';
    document.getElementById('billing-info').textContent = 'You have full access to all features as an admin.';
    document.getElementById('manage-subscription-btn').classList.add('hidden');
    
    freeBtn.textContent = 'Admin Access';
    plusBtn.textContent = 'Admin Access';
    proBtn.textContent = 'Admin Access';
    return;
  }
  
  if (!currentSubscription || currentSubscription.tier === 'free') {
    // Free tier - already set by default
    return;
  }
  
  // Show subscription info
  subscriptionInfo.classList.remove('hidden');
  
  if (currentSubscription.tier === 'plus') {
    document.getElementById('current-plan-name').textContent = 'Plus';
    plusBtn.textContent = 'Current Plan';
    plusBtn.classList.remove('from-violet-500', 'to-violet-600');
    plusBtn.classList.add('bg-gray-600');
    freeBtn.textContent = 'Downgrade';
    proBtn.textContent = 'Upgrade to Pro';
  } else if (currentSubscription.tier === 'pro') {
    document.getElementById('current-plan-name').textContent = 'Pro';
    proBtn.textContent = 'Current Plan';
    proBtn.classList.remove('from-purple-500', 'to-purple-600');
    proBtn.classList.add('bg-gray-600');
    freeBtn.textContent = 'Downgrade';
    plusBtn.textContent = 'Downgrade to Plus';
  }
  
  // Show billing info
  if (currentSubscription.next_billing_date) {
    const billingDate = new Date(currentSubscription.next_billing_date).toLocaleDateString();
    document.getElementById('billing-info').textContent = `Next billing: ${billingDate} • ${currentSubscription.billing_interval}`;
  }
}

// Setup event listeners
function setupEventListeners() {
  // Billing toggle
  billingToggle.addEventListener('change', (e) => {
    isYearly = e.target.checked;
    updatePrices();
  });
  
  // Plan buttons
  document.getElementById('free-btn').addEventListener('click', () => handlePlanClick('free'));
  document.getElementById('plus-btn').addEventListener('click', () => handlePlanClick('plus'));
  document.getElementById('pro-btn').addEventListener('click', () => handlePlanClick('pro'));
  
  // Modal close
  document.getElementById('modal-close-btn').addEventListener('click', () => {
    loginModal.classList.add('hidden');
  });
  
  // Manage subscription
  document.getElementById('manage-subscription-btn').addEventListener('click', () => {
    window.location.href = '{{site.baseurl}}/subscription/manage';
  });
}

// Update prices based on billing period
function updatePrices() {
  if (isYearly) {
    monthlyLabel.classList.remove('text-gray-300');
    monthlyLabel.classList.add('text-gray-500');
    yearlyLabel.classList.remove('text-gray-500');
    yearlyLabel.classList.add('text-gray-300');
    
    plusPrice.textContent = `$${PRICES.yearly.plus.toFixed(2)}`;
    plusPeriod.textContent = '/year';
    proPrice.textContent = `$${PRICES.yearly.pro.toFixed(2)}`;
    proPeriod.textContent = '/year';
  } else {
    monthlyLabel.classList.remove('text-gray-500');
    monthlyLabel.classList.add('text-gray-300');
    yearlyLabel.classList.remove('text-gray-300');
    yearlyLabel.classList.add('text-gray-500');
    
    plusPrice.textContent = `$${PRICES.monthly.plus.toFixed(2)}`;
    plusPeriod.textContent = '/month';
    proPrice.textContent = `$${PRICES.monthly.pro.toFixed(2)}`;
    proPeriod.textContent = '/month';
  }
}

// Handle plan button clicks
async function handlePlanClick(tier) {
  // Check if user is logged in
  if (!currentUser) {
    loginModal.classList.remove('hidden');
    return;
  }
  
  // If admin, do nothing
  if (currentUser.role === 'Admin') {
    alert('As an admin, you already have full access to all features!');
    return;
  }
  
  const currentTier = currentSubscription?.tier || 'free';
  
  if (tier === currentTier) {
    alert('You are already on this plan!');
    return;
  }
  
  // Handle downgrade
  if (tier === 'free' || (tier === 'plus' && currentTier === 'pro')) {
    if (confirm(`Are you sure you want to downgrade to ${tier === 'free' ? 'Free' : 'Plus'}? Your current benefits will remain until the end of your billing period.`)) {
      await handleDowngrade(tier);
    }
    return;
  }
  
  // Handle upgrade - redirect to checkout
  const billingInterval = isYearly ? 'yearly' : 'monthly';
  window.location.href = `{{site.baseurl}}/subscription/checkout?plan=${tier}&billing=${billingInterval}`;
}

// Handle downgrade
async function handleDowngrade(tier) {
  try {
    const response = await fetch(`${pythonURI}/api/subscription/downgrade`, {
      ...fetchOptions,
      method: 'POST',
      body: JSON.stringify({ target_tier: tier })
    });
    
    if (response.ok) {
      alert('Your plan has been updated. Changes will take effect at the end of your current billing period.');
      window.location.reload();
    } else {
      const error = await response.json();
      alert('Error: ' + (error.message || 'Failed to update plan'));
    }
  } catch (error) {
    console.error('Downgrade error:', error);
    alert('An error occurred. Please try again.');
  }
}
</script>
