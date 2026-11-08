import arvoreNatal from '../assets/pics/ARVORE.jpg'
import arvoreNatal2 from '../assets/pics/ARVORE4.png'
import arvoreNatal3 from '../assets/pics/ARVORE5.png'
import { Heart, RefreshCcw, ShoppingCart, Star } from 'lucide-react'



const Deals = () => {
    const featuredProducts = [
        {
            name: 'Arvore de Natal 150cm', price: 'R$ 349,90', oldPrice: 'R$ 399,90',
            change: '+12,5%', image: arvoreNatal, discount: '-12,5%'
        },
                {
            name: 'Arvore de Natal 90cm', price: 'R$ 279,90', oldPrice: 'R$ 299,90',
            change: '+7,7%', image: arvoreNatal2, discount: '-7,7%'
        },
                {
            name: 'Arvore de Natal 60cm', price: 'R$ 149,90', oldPrice: 'R$ 199,90',
            change: '+15%', image: arvoreNatal3, discount: '-15%'
        }
    ];
    
    const timerNumbers = ['216', '7', '41', '43'];
    const timerLabels = ['Dias', 'Horas', 'Mins', 'Segs'];

  return (
    <div className='grid: md:grid-cols-2 gap-4 md:gap-6 p-4 md:p-6
    bg-gray-50'
    data-aos='fade-up'>
        <div className="bg-white rounded-xl shadow p-4 md:p-6"
        data-aos='fade-right'
        data-aos-delay='200'>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                Promoções do dia
            </h2>
                <div className="flex flex-col sm:flex-row items-start gap-4 md:gap-6">
                    <div className="relative w-full sm:w-48 flex justify-center"
                    data-aos='zoom-in'
                    data-aos-delay='300'>
                        <img src={arvoreNatal} alt='produtos' 
                        className='rounded-lg w-40 h-40 sm:w-48 sm:h-48 object-contain' />
                        <span className='absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full'>
                            {featuredProducts[0].discount}

                        </span>
                    </div>
                    <div className="flex-1 text-center sm:text-left"
                    data-aos='fade-up'
                    data-aos-delay='400'>
                        <h3 className="text-lg md:text-xl font semibold text-gray-800">
                            {featuredProducts[0].name}
                        </h3>
                        <div className="flex text-yellow-400 text-sm my-1 justify-center sm:justify-start">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i}
                                className='w-4 h-4 fill-yellow-400 stroke-yellow-400' />
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
                            <button className="bg-gray-900 text-white px-4 md:px-5 py-2 rounded-lg flex items-center gap-2 text-xs md:text-sm hover:bg-gray-800 transition-all">
                                <ShoppingCart size={12}/>
                                Adicionar ao carrinho
                            </button>
                            <button className="p-2 border rounded-lg hover:bg-gray-100 transition-all">
                                <Heart size={16}/>
                            </button>
                            <button className="p-2 border rounded-lg hover:bg-gray-100 transition-all">
                                <RefreshCcw size={16}/>
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
                {/* right */}
                <div className="bg-white rounded-xl shadow p-4 md:p-6"
                data-aos='fade-down'
                data-aos-delay='200'>
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4"
                    data-aos='fade-down'>
                        Promoções do dia
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {featuredProducts.map((product, index) => (
                            <div key={index} className="text-center"
                            data-aos='zoom-in'
                            data-aos-delay={300 + index * 100}>
                                <div className="relative h-32 flex justify-center">
                                    <img src={product.image} alt={product.name} className='rounded-lg h-32 object-contain' />
                                    {product.discount && (
                                        <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded full">
                                            {product.discount} OFF
                                        </span>
                                    )}
                                </div>
                                <h3 className='text-lg md:text-xl font semibold text-gray-800'>
                                                                   {product.name}
                                </h3>
                            </div>
                        ))}
                    </div>
                </div>
        </div>
    </div>
  )
}

export default Deals