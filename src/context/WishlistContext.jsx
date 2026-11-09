import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { wishlistApi } from '../lib/api';

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
    const [items, setItems] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    // Evita que a carga inicial sobrescreva uma alteração feita pelo usuário
    // antes de a requisição ao banco terminar.
    const touched = useRef(false);

    useEffect(() => {
        wishlistApi
            .list()
            .then((data) => {
                if (!touched.current && Array.isArray(data)) setItems(data);
            })
            .catch(() => {});
    }, []);

    const toggleItem = (product) => {
        touched.current = true;
        const exists = items.some((item) => item.id === product.id);
        if (exists) {
            setItems((prev) => prev.filter((item) => item.id !== product.id));
            wishlistApi.remove(product.id).catch(() => {});
        } else {
            setItems((prev) => [...prev, product]);
            wishlistApi.add(product).catch(() => {});
        }
    };

    const removeItem = (id) => {
        touched.current = true;
        setItems((prev) => prev.filter((item) => item.id !== id));
        wishlistApi.remove(id).catch(() => {});
    };

    const clearWishlist = () => {
        touched.current = true;
        setItems([]);
        wishlistApi.clear().catch(() => {});
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
    };

    return (
        <WishlistContext.Provider value={value}>
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => useContext(WishlistContext);
