const SESSION_STORAGE_KEY = 'casa-do-velhinho.sessionId';

// Identidade anônima do visitante. O UUID é criado uma única vez por navegador
// e enviado em todas as requisições para que carrinho e wishlist persistam
// sem exigir login.
export const getSessionId = () => {
    let sessionId = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!sessionId) {
        sessionId = crypto.randomUUID();
        localStorage.setItem(SESSION_STORAGE_KEY, sessionId);
    }
    return sessionId;
};

const request = async (path, options = {}) => {
    const response = await fetch(`/api${path}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            'x-session-id': getSessionId(),
            ...options.headers,
        },
    });

    if (!response.ok) {
        throw new Error(`Falha na requisição ${options.method ?? 'GET'} ${path} (${response.status})`);
    }

    return response.status === 204 ? null : response.json();
};

export const cartApi = {
    list: () => request('/cart'),
    add: (product, quantity = 1) =>
        request('/cart', {
            method: 'POST',
            body: JSON.stringify({ product, quantity }),
        }),
    setQuantity: (productId, quantity) =>
        request(`/cart/${encodeURIComponent(productId)}`, {
            method: 'PUT',
            body: JSON.stringify({ quantity }),
        }),
    remove: (productId) =>
        request(`/cart/${encodeURIComponent(productId)}`, { method: 'DELETE' }),
    clear: () => request('/cart', { method: 'DELETE' }),
};

export const wishlistApi = {
    list: () => request('/wishlist'),
    add: (product) =>
        request('/wishlist', {
            method: 'POST',
            body: JSON.stringify({ product }),
        }),
    remove: (productId) =>
        request(`/wishlist/${encodeURIComponent(productId)}`, { method: 'DELETE' }),
    clear: () => request('/wishlist', { method: 'DELETE' }),
};
