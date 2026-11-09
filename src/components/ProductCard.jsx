import { Heart, ShoppingCart } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { useProductModal } from '../context/ProductModalContext'

const ProductCard = ({ product }) => {
    const { addItem } = useCart();
    const { toggleItem, isLiked } = useWishlist();
    const { openProduct } = useProductModal();
    const liked = isLiked(product.id);

    return (
        <div className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 border border-gray-100">
            <div className="relative h-56 overflow-hidden bg-gray-100">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"
                />
                <button onClick={() => toggleItem(product)}
                    className='absolute top-2 right-2 bg-white/80 backdrop-blur-sm p-1.5 rounded-full hover:scale-110'>
                    <Heart className={`w-4 h-4 ${liked
                        ? 'fill-red-500 stroke-red-500'
                        : 'fill-none stroke-gray-700'}`} />

                </button>
            </div>
            <div className="p-3">
                <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    {product.category}
                </span>
                <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-1">
                    {product.name}
                </h3>
                <div className="flex items-center gap-2 font-bold text-gray-900">
                    {product.price}
                    {product.oldPrice && (
                        <del className="text-gray-400 text-sm">{product.oldPrice}</del>
                    )}
                </div>
                <div className="mt-3 flex items-center gap-2">
                    <button onClick={() => addItem(product)}
                        className="text-xs border px-2 py-1
                    rounded hover:bg-gray-100 flex items-center gap-1 transition-all">
                        <ShoppingCart size={12} />
                        Add ao Carrinho
                    </button>
                    <button onClick={() => openProduct(product)}
                        className="text-xs border px-2 py-1
                    rounded hover:bg-gray-100 transition-all">
                        Ver mais
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ProductCard
