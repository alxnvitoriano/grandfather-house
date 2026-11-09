import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { wishlistApi } from '../lib/api';

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
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
        wishlistApi.list().then(applyResult).catch(applyError);
    }, [applyResult, applyError]);

    // Usada pelo botão "Tentar novamente" dos drawers.
    const reload = () => {
        setStatus('loading');
        setError(null);
        wishlistApi.list().then(applyResult).catch(applyError);
    };

    // A alteração local vale como verdade e a chamada ao backend acontece em
    // paralelo. Se falhar, o app continua utilizável e o erro fica visível
    // para o usuário tentar de novo.
    const sync = (request) => {
        setError(null);
        request.catch((requestError) => setError(requestError.message));
    };

    const dismissError = () => setError(null);

    const toggleItem = (product) => {
        touched.current = true;
        const exists = items.some((item) => item.id === product.id);
        if (exists) {
            setItems((prev) => prev.filter((item) => item.id !== product.id));
            sync(wishlistApi.remove(product.id));
        } else {
            setItems((prev) => [...prev, product]);
            sync(wishlistApi.add(product));
        }
    };

    const removeItem = (id) => {
        touched.current = true;
        setItems((prev) => prev.filter((item) => item.id !== id));
        sync(wishlistApi.remove(id));
    };

    const clearWishlist = () => {
        touched.current = true;
        setItems([]);
        sync(wishlistApi.clear());
    };

    const isLiked = (id) => items.some((item) => item.id === id);

    const value = {
        items,
        isOpen,
        setIsOpen,
        toggleItem,
        removeItem,
        clearWishlist,
        isLiked,
        status,
        error,
        reload,
        dismissError,
    };

    return (
        <WishlistContext.Provider value={value}>
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => useContext(WishlistContext);
