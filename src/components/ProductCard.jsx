const ProductCard = ({ product }) => {
    return (
        <div className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 border border-gray-100">
            <div className="relative h-56 overflow-hidden bg-gray-100">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"
                />
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
            </div>
        </div>
    )
}

export default ProductCard
