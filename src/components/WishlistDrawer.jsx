import { Heart, ShoppingCart, Trash2, X } from 'lucide-react';
import { formatPrice, parsePrice, useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { ErrorBanner, ErrorState, LoadingSkeleton } from './RequestStates';

const WishlistDrawer = () => {
    const {
        items,
        isOpen,
        setIsOpen,
        removeItem,
        clearWishlist,
        status,
        error,
        reload,
        dismissError,
    } = useWishlist();
    const { items: cartItems, addItem } = useCart();

    const wishlist = items.filter(
        (item) => !cartItems.some((cartItem) => cartItem.id === item.id)
    );

    return (
        <>
            <div
                onClick={() => setIsOpen(false)}
                className={`fixed inset-0 bg-black/50 z-[60] transition-opacity duration-300 ${
                    isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
            />
            <aside
                className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-[70] shadow-2xl flex flex-col transition-transform duration-300 ${
                    isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                <div className="flex items-center justify-between p-5 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                        <Heart className="w-5 h-5 text-gray-900" />
                        <h2 className="text-lg font-bold text-gray-900">
                            Lista de Desejos
                        </h2>
                        <span className="bg-gray-900 text-white text-xs rounded-full px-2 py-0.5 font-bold">
                            {wishlist.length}
                        </span>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-2 rounded-full hover:bg-gray-100 transition-all"
                    >
                        <X className="w-5 h-5 text-gray-700" />
                    </button>
                </div>

                {error && items.length > 0 && (
                    <ErrorBanner message={error} onDismiss={dismissError} />
                )}

                {status === 'loading' ? (
                    <LoadingSkeleton />
                ) : status === 'error' && items.length === 0 ? (
                    <ErrorState message={error} onRetry={reload} />
                ) : wishlist.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center gap-3 px-6 text-center">
                        <Heart className="w-12 h-12 text-gray-300" />
                        <p className="text-gray-500">
                            Nenhum produto na lista de desejos.
                        </p>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-sm font-semibold text-gray-900 underline"
                        >
                            Continuar comprando
                        </button>
                    </div>
                ) : (
                    <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
                        {wishlist.map((item) => (
                            <div
                                key={item.id}
                                className="flex gap-3 border border-gray-100 rounded-xl p-3"
                            >
                                <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                                <div className="flex-1 flex flex-col">
                                    <div className="flex justify-between gap-2">
                                        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">
                                            {item.name}
                                        </h3>
                                        <button
                                            onClick={() => removeItem(item.id)}
                                            className="text-gray-400 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <span className="text-sm font-bold text-gray-900 mt-1">
                                        {formatPrice(parsePrice(item.price))}
                                    </span>
                                    <button
                                        onClick={() => {
                                            addItem(item);
                                            setIsOpen(false);
                                        }}
                                        className="mt-auto self-start flex items-center gap-1 text-xs border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-all"
                                    >
                                        <ShoppingCart className="w-3 h-3" />
                                        Adicionar ao carrinho
                                    </button>
                                </div>
                            </div>
                        ))}
                        <button
                            onClick={clearWishlist}
                            className="self-start text-xs text-gray-500 hover:text-red-500 transition-colors"
                        >
                            Limpar lista
                        </button>
                    </div>
                )}
            </aside>
        </>
    );
};

export default WishlistDrawer;
