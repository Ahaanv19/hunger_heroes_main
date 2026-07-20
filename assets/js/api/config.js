// TCG Collect — API configuration
//
// Single backend: Flask. The Spring Boot service has been retired; auth,
// catalog, collection, and card-show endpoints are all served from pythonURI.

export var pythonURI;
if (location.hostname === "localhost") {
        pythonURI = "http://localhost:8288";
} else if (location.hostname === "127.0.0.1") {
        pythonURI = "http://127.0.0.1:8288";
} else {
        pythonURI = "https://hungerheros.opencodingsociety.com";
}

export const fetchOptions = {
    method: 'GET', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'default', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'include', // include, same-origin, omit
    headers: {
        'Content-Type': 'application/json',
        'X-Origin': 'client' // New custom header to identify source
    },
};

/**
 * Log in against the Flask backend.
 *
 * Returns a promise that resolves with the parsed body on success and rejects
 * on failure. The previous version swallowed errors and callers leaned on a
 * timeout, which made a failed login indistinguishable from a slow one.
 *
 * @param {Object} options
 * @param {string} options.URL          endpoint to POST to
 * @param {Object} options.body         request payload
 * @param {string} [options.message]    id of an element to write error text into
 * @param {Function} [options.callback] invoked on success
 */
export function login(options) {
        const messageEl = options.message ? document.getElementById(options.message) : null;
        if (messageEl) messageEl.textContent = "";

        const requestOptions = {
                ...fetchOptions,
                method: options.method || 'POST',
                cache: options.cache || 'no-cache',
                body: JSON.stringify(options.body)
        };

        return fetch(options.URL, requestOptions)
                .then(response => {
                        if (!response.ok) {
                                const errorMsg = response.status === 401
                                        ? 'Incorrect username or password.'
                                        : `Login error: ${response.status}`;
                                if (messageEl) messageEl.textContent = errorMsg;
                                throw new Error(errorMsg);
                        }
                        if (options.callback) options.callback();
                        return response.json().catch(() => ({}));
                })
                .catch(error => {
                        // Network-level failure (server down or CORS) leaves the
                        // message element empty; fill it so the user sees something.
                        if (messageEl && !messageEl.textContent) {
                                messageEl.textContent = `Cannot reach server: ${error.message}`;
                        }
                        throw error;
                });
}
