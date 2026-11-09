import { useEffect, useState } from 'react'
import { products } from '../data/products'
import { Heart, RefreshCcw, ShoppingCart, Star } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { useProductModal } from '../context/ProductModalContext'



const Deals = () => {
    const { addItem } = useCart();
    const { toggleItem, isLiked } = useWishlist();
    const { openProduct } = useProductModal();
    const featuredProducts = products.filter((product) => product.category === 'arvore');

    const promoEndDate = new Date('2026-12-17T00:00:00').getTime();

    const getTimeLeft = () => {
        const diff = promoEndDate - Date.now();
        if (diff <= 0) {
            return { days: 0, hours: 0, minutes: 0, seconds: 0 };
        }
        return {
            days: Math.floor(diff / (1000 * 60 * 60 * 24)),
            hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((diff / (1000 * 60)) % 60),
            seconds: Math.floor((diff / 1000) % 60),
        };
    };

    const [timeLeft, setTimeLeft] = useState(getTimeLeft);

    useEffect(() => {
        const interval = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
        return () => clearInterval(interval);
    }, []);

    const timerNumbers = [
        String(timeLeft.days),
        String(timeLeft.hours).padStart(2, '0'),
        String(timeLeft.minutes).padStart(2, '0'),
        String(timeLeft.seconds).padStart(2, '0'),
    ];
    const timerLabels = ['Dias', 'Horas', 'Mins', 'Segs'];

  return (
    <div className='grid md:grid-cols-2 gap-4 md:gap-6 p-4 md:p-6 bg-gray-50'
    data-aos='fade-up'>
        <div className="bg-white rounded-xl shadow p-4 md:p-6"
        data-aos='fade-right'
        data-aos-delay='200'>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                Ofertas do dia
            </h2>
                <div className="flex flex-col sm:flex-row items-start gap-4 md:gap-6">
                    <div className="relative w-full sm:w-48 flex justify-center"
                    data-aos='zoom-in'
                    data-aos-delay='300'>
                        <img src={featuredProducts[0].image} alt='produtos' 
                        className='rounded-lg w-40 h-40 sm:w-48 sm:h-48 object-contain' />
                        <span className='absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full'>
                            {featuredProducts[0].discount}

                        </span>
                    </div>
                    <div className="flex-1 text-center sm:text-left"
                    data-aos='fade-up'
                    data-aos-delay='400'>
                        <h3 className="text-lg md:text-xl font-semibold text-gray-800">
                            {featuredProducts[0].name}
                        </h3>
                        <div className="flex text-yellow-400 text-sm my-1 justify-center sm:justify-start">
                            {[...Array(Math.round(featuredProducts[0].rating))].map((_, i) => (
                                <Star key={i}
                                className='w-4 h-4 fill-yellow-400 stroke-yellow-400' />
                            ))}
                            {[...Array(5 - Math.round(featuredProducts[0].rating))].map((_, i) => (
                                        <Star key={i}
                                        className='w-4 h-4 fill-none stroke-yellow-400' />
                                    ))}
                        </div>
                        
                        <p className="text-xs text-gray-500 md:text-sm mb-3 leading-relaxed">
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. 
                            Autem nisi quaerat ad architecto commodi dolorum quibusdam.
                        </p>
                        <div className="flex items-center gap-3 mb-3 justify-center sm:justify-start">
                            <span className='text-red-500 font-bold text-xl md:text-2xl'>
                                {featuredProducts[0].price}
                            </span>
                            <span className="text-gray-400 line-through text-sm">
                                {featuredProducts[0].oldPrice}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 justify-center sm:justify-start flex-wrap">
                            <button onClick={() => addItem(featuredProducts[0])}
                                className="bg-gray-900 text-white px-4 md:px-5 py-2 rounded-lg flex items-center gap-2 text-xs md:text-sm hover:bg-gray-800 transition-all">
                                <ShoppingCart size={12}/>
                                Adicionar ao carrinho
                            </button>
                            <button onClick={() => toggleItem(featuredProducts[0])}
                                className="p-2 border rounded-lg hover:bg-gray-100 transition-all">
                                <Heart size={16}
                                className={isLiked(featuredProducts[0].id)
                                ? 'fill-red-500 stroke-red-500'
                                : 'fill-none stroke-gray-700'}/>
                            </button>
                            <button className="p-2 border rounded-lg hover:bg-gray-100 transition-all">
                                <RefreshCcw size={16}/>
                            </button>
                            <button onClick={() => openProduct(featuredProducts[0])}
                                className="p-2 border rounded-lg hover:bg-gray-100 transition-all text-xs md:text-sm">
                                Ver mais
                            </button>
                        </div>
                    </div>
                </div>
                <div className="flex flex-wrap justify-center gap-3 md:gap-4 mt-6 pt-4 border-t border-gray-100"
                data-aos='fade-up'
                data-aos-delay='500'>
                    {timerNumbers.map((num, index) => (
                        <div key={index} 
                        className="text-center">
                            <div className="bg-gray-900 text-white px-3 py-2 rounded-lg min-w-12 md:min-w-15">
                                <span className="text-lg md:text-2xl font-bold">
                                    {num}
                                </span>
                            </div>
                            <span className="text-sm text-gray-500 mt-1 block">
                                {timerLabels[index]}
                                </span>
                            </div>
                    ))}
                </div>
            </div>
            {/* right */}
            <div className="bg-white rounded-xl shadow p-4 md:p-6"
            data-aos='fade-down'
            data-aos-delay='200'>
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4"
                    data-aos='fade-down'>
                        Produtos em Destaque
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {featuredProducts.map((product, index) => (
                            <div key={index} className="text-center"
                            data-aos='zoom-in'
                            data-aos-delay={300 + index * 100}>
                                <div className="relative h-32 flex justify-center">
                                    <img src={product.image} alt={product.name} className='rounded-lg h-32 object-contain' />
                                    {product.discount && (
                                        <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                            {product.discount} OFF
                                        </span>
                                    )}
                                </div>
                                <h3 className='text-sm md:text-xl font-medium mt-3 text-gray-800'>
                                                                   {product.name}
                                </h3>
                                <div className="flex justify-center text-yellow-400 text-xs my-1">
                                    {[...Array(Math.round(product.rating))].map((_, i) => (
                                        <Star key={i}
                                        className='w-3 h-3 fill-yellow-400 stroke-yellow-400' />
                                    ))}
                                    {[...Array(5 - Math.round(product.rating))].map((_, i) => (
                                        <Star key={i}
                                        className='w-3 h-3 fill-none stroke-yellow-400' />
                                    ))}
                                </div>
                                <div className="flex justify-center gap-2 text-sm mb-2">
                                    <span className="text-red-500 font-black">
                                        {product.price}
                                    </span>
                                    <span className="text-gray-400 line-through text-xs">
                                        {product.oldPrice}
                                    </span>
                                </div>
                                <div className="flex justify-center gap-1">
                                    <button onClick={() => addItem(product)}
                                        className="text-xs border px-2 py-1
                                    rounded hover:bg-gray-100 flex items-center gap-1 transition-all">
                                        <ShoppingCart size={12}/>
                                    Add ao Carrinho
                                    </button>
                                    <button onClick={() => openProduct(product)}
                                        className="text-xs border px-2 py-1
                                    rounded hover:bg-gray-100 transition-all">
                                    Ver mais
                                    </button>
                                    <button className="p-1 border rounded hover:bg-gray-100 transition-all">
                                        <RefreshCcw size={16}/>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
        </div>
  )
}

export default Deals