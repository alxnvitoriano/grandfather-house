import { useEffect, useState } from 'react';
import { Heart, Minus, Plus, ShoppingCart, Star, X } from 'lucide-react';
import { categories } from '../data/products';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useProductModal } from '../context/ProductModalContext';

const ProductModal = () => {
    const { product, isOpen, closeProduct } = useProductModal();
    const { addItem } = useCart();
    const { toggleItem, isLiked } = useWishlist();
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        setQuantity(1);
    }, [product]);

    useEffect(() => {
        const onKeyDown = (event) => {
            if (event.key === 'Escape') closeProduct();
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [closeProduct]);

    if (!product) return null;

    const categoryName = categories.find((cat) => cat.id === product.category)?.name;
    const liked = isLiked(product.id);
    const rating = Math.round(product.rating || 0);

    return (
        <div
            className={`fixed inset-0 z-[80] flex items-center justify-center p-4 transition-opacity duration-300 ${
                isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
        >
            <div onClick={closeProduct} className="absolute inset-0 bg-black/60" />
            <div
                className={`relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto transition-transform duration-300 ${
                    isOpen ? 'scale-100' : 'scale-95'
                }`}
            >
                <button
                    onClick={closeProduct}
                    className="absolute top-4 right-4 z-10 bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-gray-100 transition-all"
                >
                    <X className="w-5 h-5 text-gray-700" />
                </button>
                <div className="grid md:grid-cols-2 gap-6 p-6 md:p-8">
                    <div className="relative bg-gray-100 rounded-xl flex items-center justify-center h-72 md:h-96">
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-contain p-4"
                        />
                        {product.discount && (
                            <span className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                {product.discount}
                            </span>
                        )}
                    </div>
                    <div className="flex flex-col">
                        {categoryName && (
                            <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                                {categoryName}
                            </span>
                        )}
                        <h2 className="text-2xl font-bold text-gray-900 mt-1">
                            {product.name}
                        </h2>

                        {product.rating && (
                            <div className="flex items-center gap-1 my-2">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-4 h-4 ${
                                            i < rating
                                                ? 'fill-yellow-400 stroke-yellow-400'
                                                : 'fill-none stroke-yellow-400'
                                        }`}
                                    />
                                ))}
                                <span className="text-sm text-gray-500 ml-1">
                                    {product.rating}
                                </span>
                            </div>
                        )}

                        <div className="flex items-center gap-3 mt-2">
                            <span className="text-2xl font-bold text-gray-900">
                                {product.price}
                            </span>
                            {product.oldPrice && (
                                <del className="text-gray-400">{product.oldPrice}</del>
                            )}
                        </div>

                        {product.description && (
                            <p className="text-sm text-gray-600 leading-relaxed mt-4">
                                {product.description}
                            </p>
                        )}

                        <div className="mt-6 flex items-center gap-3">
                            <div className="flex items-center border border-gray-200 rounded-lg">
                                <button
                                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                    className="p-2 hover:bg-gray-100 transition-all"
                                >
                                    <Minus className="w-4 h-4" />
                                </button>
                                <span className="w-10 text-center font-semibold">
                                    {quantity}
                                </span>
                                <button
                                    onClick={() => setQuantity((q) => q + 1)}
                                    className="p-2 hover:bg-gray-100 transition-all"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                            <button
                                onClick={() => {
                                    addItem(product, quantity);
                                    closeProduct();
                                }}
                                className="flex-1 bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
                            >
                                <ShoppingCart className="w-4 h-4" />
                                Adicionar ao carrinho
                            </button>
                        </div>

                        <button
                            onClick={() => toggleItem(product)}
                            className="mt-3 flex items-center justify-center gap-2 border border-gray-200 py-2.5 rounded-lg text-sm hover:bg-gray-100 transition-all"
                        >
                            <Heart
                                className={`w-4 h-4 ${
                                    liked
                                        ? 'fill-red-500 stroke-red-500'
                                        : 'fill-none stroke-gray-700'
                                }`}
                            />
                            {liked
                                ? 'Remover da lista de desejos'
                                : 'Adicionar à lista de desejos'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductModal;
