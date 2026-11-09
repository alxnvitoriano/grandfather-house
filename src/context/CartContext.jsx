import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { cartApi } from '../lib/api';

const CartContext = createContext(null);

export const parsePrice = (price) =>
    Number(String(price).replace(/[^\d,]/g, '').replace(',', '.'));

export const formatPrice = (value) =>
    value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export const CartProvider = ({ children }) => {
    const [items, setItems] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    // 'loading' | 'ready' | 'error' — situação da sincronização com o backend.
    const [status, setStatus] = useState('loading');
    const [error, setError] = useState(null);
    // Evita que a carga inicial sobrescreva uma alteração feita pelo usuário
    // antes de a requisição ao banco terminar.
    const touched = useRef(false);

    // Atualizar o estado só depois do await evita renders em cascata na montagem.
    const applyResult = useCallback((data) => {
        if (!touched.current && Array.isArray(data)) setItems(data);
        setStatus('ready');
    }, []);

    const applyError = useCallback((requestError) => {
        setStatus('error');
        setError(requestError.message);
    }, []);

    useEffect(() => {
        cartApi.list().then(applyResult).catch(applyError);
    }, [applyResult, applyError]);

    // Usada pelo botão "Tentar novamente" dos drawers.
    const reload = () => {
        setStatus('loading');
        setError(null);
        cartApi.list().then(applyResult).catch(applyError);
    };

    // A alteração local vale como verdade e a chamada ao backend acontece em
    // paralelo. Se falhar, o app continua utilizável e o erro fica visível
    // para o usuário tentar de novo.
    const sync = (request) => {
        setError(null);
        request.catch((requestError) => setError(requestError.message));
    };

    const dismissError = () => setError(null);

    const addItem = (product, quantity = 1) => {
        touched.current = true;
        const existing = items.find((item) => item.id === product.id);
        setItems((prev) =>
            existing
                ? prev.map((item) =>
                      item.id === product.id
                          ? { ...item, quantity: item.quantity + quantity }
                          : item
                  )
                : [...prev, { ...product, quantity }]
        );
        setIsOpen(true);
        sync(cartApi.add(product, quantity));
    };

    const removeItem = (id) => {
        touched.current = true;
        setItems((prev) => prev.filter((item) => item.id !== id));
        sync(cartApi.remove(id));
    };

    const updateQuantity = (id, quantity) => {
        touched.current = true;
        if (quantity < 1) {
            setItems((prev) => prev.filter((item) => item.id !== id));
            sync(cartApi.remove(id));
            return;
        }
        setItems((prev) =>
            prev.map((item) => (item.id === id ? { ...item, quantity } : item))
        );
        sync(cartApi.setQuantity(id, quantity));
    };

    const clearCart = () => {
        touched.current = true;
        setItems([]);
        sync(cartApi.clear());
    };

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce(
        (sum, item) => sum + parsePrice(item.price) * item.quantity,
        0
    );

    const value = {
        items,
        isOpen,
        setIsOpen,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        status,
        error,
        reload,
        dismissError,
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);
