---
layout: base
title: Login
permalink: /login
search_exclude: true
---

<main class="relative min-h-screen flex items-center justify-center px-6 py-24 bg-slate-50 dark:bg-slate-950">

  <!-- Holo glow, brand accent -->
  <div class="absolute -top-40 -left-40 w-[600px] h-[600px] bg-violet-500 opacity-10 rounded-full blur-3xl pointer-events-none"></div>
  <div class="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-amber-400 opacity-10 rounded-full blur-3xl pointer-events-none"></div>

  <div class="relative z-10 w-full max-w-5xl flex flex-col md:flex-row gap-8 justify-center items-stretch">

    <!-- Login -->
    <div class="flex-1 p-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-2xl border border-slate-200 dark:border-slate-800 rounded-2xl">
      <h2 class="text-3xl font-bold text-violet-600 dark:text-violet-400 mb-2 text-center">Welcome back</h2>
      <p class="text-sm text-slate-500 dark:text-slate-400 mb-6 text-center">Sign in to your collection</p>
      <form id="loginForm" onsubmit="tcgLogin(); return false;" class="space-y-6">
        <div>
          <label for="uid" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Username</label>
          <input type="text" id="uid" name="uid" required autocomplete="username"
            class="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500 transition" />
        </div>
        <div>
          <label for="password" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Password</label>
          <input type="password" id="password" name="password" required autocomplete="current-password"
            class="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500 transition" />
        </div>
        <p id="message" class="text-sm text-red-500 font-medium min-h-[1.25rem]"></p>
        <button type="submit" id="loginButton"
          class="w-full py-2.5 px-4 bg-violet-600 hover:bg-violet-500 disabled:bg-slate-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg shadow-lg shadow-violet-600/20 transition">
          Sign In
        </button>
      </form>
    </div>

    <!-- Signup -->
    <div class="flex-1 p-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-2xl border border-slate-200 dark:border-slate-800 rounded-2xl">
      <h2 class="text-3xl font-bold text-amber-500 mb-2 text-center">Create an account</h2>
      <p class="text-sm text-slate-500 dark:text-slate-400 mb-6 text-center">Free — start tracking your cards</p>
      <form id="signupForm" onsubmit="signup(); return false;" class="space-y-6">
        <div>
          <label for="name" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Name</label>
          <input type="text" id="name" name="name" required autocomplete="name"
            class="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500 transition" />
        </div>
        <div>
          <label for="signupUid" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Username</label>
          <input type="text" id="signupUid" name="signupUid" required autocomplete="username"
            class="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500 transition" />
        </div>
        <div>
          <label for="signupPassword" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Password</label>
          <input type="password" id="signupPassword" name="signupPassword" required autocomplete="new-password"
            class="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500 transition" />
        </div>
        <p id="signupMessage" class="text-sm font-medium min-h-[1.25rem]"></p>
        <button type="submit" id="signupButton"
          class="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-400 disabled:bg-slate-400 disabled:cursor-not-allowed text-slate-900 font-semibold rounded-lg shadow-lg shadow-amber-500/20 transition">
          Sign Up
        </button>
      </form>
    </div>
  </div>
</main>

<script type="module">
  import { login, pythonURI, fetchOptions } from '{{site.baseurl}}/assets/js/api/config.js';

  // Single backend (Flask). Login succeeds or it fails — no dual-write, no
  // silent auto-signup fallback, no timeout guessing.
  window.tcgLogin = async function () {
    const button = document.getElementById("loginButton");
    const uid = document.getElementById("uid").value;
    const password = document.getElementById("password").value;

    button.disabled = true;
    document.getElementById("message").textContent = "Signing in…";

    try {
      await login({
        URL: `${pythonURI}/api/authenticate`,
        body: { uid, password },
        message: "message",
        method: "POST",
        cache: "no-cache",
      });
      window.location.href = '{{site.baseurl}}/collection';
    } catch (err) {
      // login() has already written the reason into #message.
      console.warn('Login failed:', err.message);
      button.disabled = false;
    }
  };

  window.signup = async function () {
    const button = document.getElementById("signupButton");
    const messageEl = document.getElementById("signupMessage");
    const name = document.getElementById("name").value;
    const uid = document.getElementById("signupUid").value;
    const password = document.getElementById("signupPassword").value;

    button.disabled = true;
    messageEl.style.color = '';
    messageEl.textContent = "Creating account…";

    try {
      const response = await fetch(`${pythonURI}/api/user`, {
        ...fetchOptions,
        method: "POST",
        cache: "no-cache",
        body: JSON.stringify({ name, uid, password }),
      });

      if (!response.ok) {
        // 409-ish duplicates are the common case; surface it plainly.
        const detail = await response.json().catch(() => ({}));
        throw new Error(detail.message || `Signup failed (${response.status})`);
      }

      messageEl.style.color = '#22c55e';
      messageEl.textContent = "Account created. You can sign in now.";
      document.getElementById("signupForm").reset();
    } catch (err) {
      messageEl.style.color = '#ef4444';
      messageEl.textContent = err.message;
    } finally {
      button.disabled = false;
    }
  };

  // Already signed in? Skip the form.
  window.addEventListener('load', () => {
    fetch(`${pythonURI}/api/user`, fetchOptions)
      .then(response => {
        if (response.ok) window.location.href = '{{site.baseurl}}/collection';
      })
      .catch(() => { /* not signed in, stay on the login page */ });
  });
</script>
