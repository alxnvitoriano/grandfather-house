import { products } from '../data/products'
import ProductCard from './ProductCard'

const Cards = () => {
    return (
        <section className="py-20 bg-white"
        data-aos='fade-up'>
            <div className="container mx-auto px-4 md:px-8 lg:px-16">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3"
                    data-aos='fade-down'>
                    Todos os Produtos
                </h2>
                <p className="text-lg text-gray-600">
                    Descubra a decoração que irá decorar o seu natal 
                </p>
                    </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Cards
