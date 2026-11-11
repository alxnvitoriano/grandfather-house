const SESSION_STORAGE_KEY = 'casa-do-velhinho.sessionId';

// Em desenvolvimento o Vite faz proxy de /api para o backend local.
// Em produção, VITE_API_URL permite apontar para o backend publicado.
const API_BASE_URL = import.meta.env.VITE_API_URL ?? '/api';

const REQUEST_TIMEOUT_MS = 8000;

// Erro padronizado do cliente: `status` é o código HTTP e fica 0 quando a
// falha é de rede ou de tempo de resposta.
export class ApiError extends Error {
    constructor(message, { status = 0, cause } = {}) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        if (cause) this.cause = cause;
    }
}

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

// O backend responde erros como { error: 'mensagem' }; usa essa mensagem
// quando disponível para não esconder a causa real do problema.
const readErrorMessage = async (response) => {
    try {
        const data = await response.json();
        if (data?.error) return data.error;
    } catch {
        // Corpo sem JSON: usa a mensagem genérica abaixo.
    }
    return `Falha na requisição (${response.status}).`;
};

const request = async (path, { timeout = REQUEST_TIMEOUT_MS, ...options } = {}) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(`${API_BASE_URL}${path}`, {
            ...options,
            signal: controller.signal,
            headers: {
                'Content-Type': 'application/json',
                'x-session-id': getSessionId(),
                ...options.headers,
            },
        });

        if (!response.ok) {
            throw new ApiError(await readErrorMessage(response), {
                status: response.status,
            });
        }

        return response.status === 204 ? null : response.json();
    } catch (error) {
        if (error instanceof ApiError) throw error;
        if (error.name === 'AbortError') {
            throw new ApiError('O servidor demorou demais para responder.', { cause: error });
        }
        if (error instanceof SyntaxError) {
            throw new ApiError('Resposta inválida do servidor.', { cause: error });
        }
        throw new ApiError('Não foi possível conectar ao servidor.', { cause: error });
    } finally {
        clearTimeout(timeoutId);
    }
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

export const checkoutApi = {
    // Cria o pedido no servidor e devolve a URL de checkout do gateway.
    create: (customer, couponCode) =>
        request('/checkout', {
            method: 'POST',
            body: JSON.stringify({ customer, couponCode }),
            timeout: 15000,
        }),
    getOrder: (orderId) => request(`/orders/${encodeURIComponent(orderId)}`),
};

export const aliexpressApi = {
    authUrl: () => request('/aliexpress/auth-url'),
    products: ({ page = 1, pageSize = 20 } = {}) =>
        request(`/aliexpress/products?page=${page}&pageSize=${pageSize}`),
    product: (productId) => request(`/aliexpress/products/${encodeURIComponent(productId)}`),
};
