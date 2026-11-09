import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatPrice, parsePrice, useCart } from '../context/CartContext';
import { ErrorBanner, ErrorState, LoadingSkeleton } from './RequestStates';

const CartDrawer = () => {
    const {
        items,
        isOpen,
        setIsOpen,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        status,
        error,
        reload,
        dismissError,
    } = useCart();
    const navigate = useNavigate();

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
                        <ShoppingBag className="w-5 h-5 text-gray-900" />
                        <h2 className="text-lg font-bold text-gray-900">
                            Meu Carrinho
                        </h2>
                        <span className="bg-gray-900 text-white text-xs rounded-full px-2 py-0.5 font-bold">
                            {totalItems}
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
                ) : items.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center gap-3 px-6 text-center">
                        <ShoppingBag className="w-12 h-12 text-gray-300" />
                        <p className="text-gray-500">Seu carrinho está vazio.</p>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-sm font-semibold text-gray-900 underline"
                        >
                            Continuar comprando
                        </button>
                    </div>
                ) : (
                    <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
                        {items.map((item) => (
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
                                    <div className="mt-auto flex items-center gap-3">
                                        <div className="flex items-center border border-gray-200 rounded-lg">
                                            <button
                                                onClick={() =>
                                                    updateQuantity(item.id, item.quantity - 1)
                                                }
                                                className="p-1.5 hover:bg-gray-100 transition-all"
                                            >
                                                <Minus className="w-3 h-3" />
                                            </button>
                                            <span className="w-8 text-center text-sm font-semibold">
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() =>
                                                    updateQuantity(item.id, item.quantity + 1)
                                                }
                                                className="p-1.5 hover:bg-gray-100 transition-all"
                                            >
                                                <Plus className="w-3 h-3" />
                                            </button>
                                        </div>
                                        <span className="ml-auto text-sm font-bold text-gray-900">
                                            {formatPrice(
                                                parsePrice(item.price) * item.quantity
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <button
                            onClick={clearCart}
                            className="self-start text-xs text-gray-500 hover:text-red-500 transition-colors"
                        >
                            Limpar carrinho
                        </button>
                    </div>
                )}

                {items.length > 0 && (
                    <div className="border-t border-gray-100 p-5 flex flex-col gap-3">
                        <div className="flex justify-between text-base font-bold text-gray-900">
                            <span>Total</span>
                            <span>{formatPrice(totalPrice)}</span>
                        </div>
                        <button
                            onClick={() => {
                                setIsOpen(false);
                                navigate('/checkout');
                            }}
                            className="bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-all">
                            Finalizar compra
                        </button>
                    </div>
                )}
            </aside>
        </>
    );
};

export default CartDrawer;
