import { createContext, useContext, useState } from 'react';

const ProductModalContext = createContext(null);

export const ProductModalProvider = ({ children }) => {
    const [product, setProduct] = useState(null);
    const [isOpen, setIsOpen] = useState(false);

    const openProduct = (selectedProduct) => {
        setProduct(selectedProduct);
        setIsOpen(true);
    };

    const closeProduct = () => setIsOpen(false);

    const value = { product, isOpen, openProduct, closeProduct };

    return (
        <ProductModalContext.Provider value={value}>
            {children}
        </ProductModalContext.Provider>
    );
};

export const useProductModal = () => useContext(ProductModalContext);
