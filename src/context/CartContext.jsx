import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { cartApi } from '../lib/api';

const CartContext = createContext(null);

export const parsePrice = (price) =>
    Number(String(price).replace(/[^\d,]/g, '').replace(',', '.'));

export const formatPrice = (value) =>
    value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export const CartProvider = ({ children }) => {
    const [items, setItems] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    // Evita que a carga inicial sobrescreva uma alteração feita pelo usuário
    // antes de a requisição ao banco terminar.
    const touched = useRef(false);

    useEffect(() => {
        cartApi
            .list()
            .then((data) => {
                if (!touched.current && Array.isArray(data)) setItems(data);
            })
            .catch(() => {});
    }, []);

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
        cartApi.add(product, quantity).catch(() => {});
    };

    const removeItem = (id) => {
        touched.current = true;
        setItems((prev) => prev.filter((item) => item.id !== id));
        cartApi.remove(id).catch(() => {});
    };

    const updateQuantity = (id, quantity) => {
        touched.current = true;
        if (quantity < 1) {
            setItems((prev) => prev.filter((item) => item.id !== id));
            cartApi.remove(id).catch(() => {});
            return;
        }
        setItems((prev) =>
            prev.map((item) => (item.id === id ? { ...item, quantity } : item))
        );
        cartApi.setQuantity(id, quantity).catch(() => {});
    };

    const clearCart = () => {
        touched.current = true;
        setItems([]);
        cartApi.clear().catch(() => {});
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
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);
