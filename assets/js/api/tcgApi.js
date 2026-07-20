// TCG Collect — shared API helpers
//
// Thin wrapper over the Flask backend. Every function returns parsed JSON and
// throws on failure, so pages can `try/await` and render one error state
// instead of each page inventing its own fetch handling.

import { pythonURI, fetchOptions } from './config.js';

/**
 * Core request helper.
 * @throws {Error} with the server's message when available.
 */
async function request(path, options = {}) {
    const response = await fetch(`${pythonURI}${path}`, {
        ...fetchOptions,
        ...options,
        headers: { ...fetchOptions.headers, ...(options.headers || {}) },
    });

    if (!response.ok) {
        let message = `Request failed (${response.status})`;
        try {
            const body = await response.json();
            if (body && body.message) message = body.message;
        } catch (_) { /* non-JSON error body; keep the status message */ }
        const error = new Error(message);
        error.status = response.status;
        throw error;
    }

    return response.status === 204 ? null : response.json();
}

const get = (path) => request(path);
const post = (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) });
const put = (path, body) => request(path, { method: 'PUT', body: JSON.stringify(body) });
const del = (path) => request(path, { method: 'DELETE' });

/** Build a query string, dropping empty/null values. */
export function qs(params) {
    const search = new URLSearchParams();
    Object.entries(params || {}).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') search.append(key, value);
    });
    const string = search.toString();
    return string ? `?${string}` : '';
}

// --- Catalog (public) ---

// nonEmpty defaults on: the /sets page should never list a set with no cards.
export const getSets = (series, nonEmpty = true) => get(`/api/sets${qs({ series, nonEmpty })}`);
export const getSet = (setId) => get(`/api/sets/${setId}`);
export const getSetCards = (setId, params) => get(`/api/sets/${setId}/cards${qs(params)}`);
export const searchCards = (params) => get(`/api/cards${qs(params)}`);
export const getCard = (cardId) => get(`/api/cards/${cardId}`);
export const getCardPrices = (cardId, days) => get(`/api/cards/${cardId}/prices${qs({ days })}`);
export const getMovers = (params) => get(`/api/movers${qs(params)}`);
export const getCatalogFilters = () => get('/api/catalog/filters');

// --- Collection (auth) ---

export const getCollection = (setId) => get(`/api/collection${qs({ setId })}`);
export const addToCollection = (payload) => post('/api/collection', payload);
export const updateCollectionItem = (id, payload) => put(`/api/collection/${id}`, payload);
export const removeCollectionItem = (id) => del(`/api/collection/${id}`);
export const getPortfolioSummary = () => get('/api/collection/summary');
export const getSetCompletion = (setId) => get(`/api/collection/completion/${setId}`);

// --- Want list (auth) ---

export const getWantList = () => get('/api/wantlist');
export const addToWantList = (payload) => post('/api/wantlist', payload);
export const updateWantListItem = (id, payload) => put(`/api/wantlist/${id}`, payload);
export const removeWantListItem = (id) => del(`/api/wantlist/${id}`);
export const getBudgetPlan = (budget) => get(`/api/wantlist/budget${qs({ budget })}`);
export const getShowMode = () => get('/api/show-mode');

// --- Card shows (public) ---

export const searchShows = (params) => get(`/api/shows${qs(params)}`);
export const getShow = (id) => get(`/api/shows/${id}`);
export const getShowFilters = () => get('/api/shows/filters');
export const createShow = (payload) => post('/api/shows', payload);
export const updateShow = (id, payload) => put(`/api/shows/${id}`, payload);
export const deleteShow = (id) => del(`/api/shows/${id}`);

// --- Session ---

/** Current user, or null when signed out. Never throws. */
export async function getCurrentUser() {
    try {
        return await get('/api/user');
    } catch (_) {
        return null;
    }
}

// --- Formatting ---

export const money = (value, currency = 'USD') =>
    value === null || value === undefined
        ? '—'
        : new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(value);

/** Signed value with a +/- prefix, for gain/loss display. */
export const signedMoney = (value) => {
    if (value === null || value === undefined) return '—';
    const sign = value >= 0 ? '+' : '−';
    return `${sign}${money(Math.abs(value))}`;
};

export const percent = (value) =>
    value === null || value === undefined ? '—' : `${value >= 0 ? '+' : '−'}${Math.abs(value).toFixed(1)}%`;

/** Tailwind text colour for a gain/loss number. */
export const trendClass = (value) => {
    if (value === null || value === undefined) return 'text-slate-400';
    if (value > 0) return 'text-emerald-500';
    if (value < 0) return 'text-red-500';
    return 'text-slate-400';
};

export const formatDateRange = (startISO, endISO) => {
    if (!startISO) return '';
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    const start = new Date(`${startISO}T00:00:00`);
    if (!endISO || endISO === startISO) return start.toLocaleDateString('en-US', options);

    const end = new Date(`${endISO}T00:00:00`);
    // Same month: "Sep 12–13, 2026"
    if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
        return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}–` +
               `${end.getDate()}, ${end.getFullYear()}`;
    }
    return `${start.toLocaleDateString('en-US', options)} – ${end.toLocaleDateString('en-US', options)}`;
};

/** Escape user/API text before inserting into innerHTML. */
export const esc = (value) =>
    String(value ?? '').replace(/[&<>"']/g, (c) => (
        { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
    ));
