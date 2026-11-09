import { useState } from 'react';
import { ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import { products } from '../data/products';

const Products = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [liked, setLiked] = useState({});

    const featured = products.filter((product) => product.category === 'arvore');

    const extendedProducts = [...featured, ...featured, ...featured];
    const itemsPerPage = 3;
    const totalSlides = Math.ceil(extendedProducts.length / itemsPerPage) - 2;
    const startIndex = currentIndex * itemsPerPage;
    const currentProducts = extendedProducts.slice(startIndex, startIndex + itemsPerPage);
    const nextSlide = () => {
        setCurrentIndex((prevIndex) => {
            if (prevIndex + 1 >= totalSlides) {
                return 0;
            }
            return prevIndex + 1;
        });
    };
    const prevSlide = () => {
        setCurrentIndex((prevIndex) => {
            if (prevIndex - 1 < 0) {
                return totalSlides - 1;
            }
            return prevIndex - 1;
        });
    };

    const toggleLike = (id, idx) => {
        const uniqueId = `${id}-${idx}`;
        setLiked((prev) => ({...prev, [uniqueId]: !prev[uniqueId]}));
    };

  return (
    <div className="py-20 bg-white"
    data-aos='fade-up'>
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
            <div className="flex justify-between items-center mb-12"
            data-aos='fade-down'>
                <h2 className='text-3xl md:text-4xl font-bold text-gray-900'>
                    Produtos em alta
                </h2>
                <div className="flex items-center gap-4">
                    <button onClick={prevSlide}
                    className='p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-all duration-300'>
                        <ChevronLeft className="w-5 h-5 text-gray-700"/>
                    </button>
                    <button onClick={nextSlide}
                    className='p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-all duration-300'>
                        <ChevronRight className="w-5 h-5 text-gray-700"/>
                    </button>
                </div>
            </div>
            <div className="overflow-hidden">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {currentProducts.map((product, idx) => (
                        <div
                        key={`${product.id}-${startIndex + idx}`}
                        className='group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer border border-gray-100 '
                        data-aos='zoom-in'
                        data-aos-delay={idx * 100}>
                            <div className="relative h-56 overflow-hidden bg-gray-100">
                                <img src={product.image} alt={product.name}
                                className='w-full h-full object-contain transition-transform duration-700 group-hover:scale-110' />
                                <button onClick={() => toggleLike(product.id, startIndex + idx)}
                                    className='absolute top-2 right-2 bg-white/80 backdrop-blur-sm p-1.5 rounded-full hover:scale-110'>
                                        <Heart className={`w-4 h-4 ${liked[`${product.id}-${startIndex + idx}`] 
                                        ? 'fill-red-500 stroke-red-500' 
                                        : 'fill-none stroke-gray-700'}`}/>

                                </button>
                            </div>
                            <div className="p-3">
                                <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-1">
                                    {product.name}
                                </h3>
                                <div className="flex items-center gap-2 font-bold text-gray-900">
                                    {product.price}
                                    <del className="text-gray-400 text-sm">
                                        {product.oldPrice}
                                    </del>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

    </div>
  )
};

export default Products