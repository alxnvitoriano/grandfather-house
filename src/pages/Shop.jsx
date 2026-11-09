import { useState } from 'react';
import { categories, products } from '../data/products';
import ProductCard from '../components/ProductCard';
import Seo from '../components/Seo';

const Shop = () => {
    const [activeCategory, setActiveCategory] = useState('todas');

    const visibleProducts =
        activeCategory === 'todas'
            ? products
            : products.filter((product) => product.category === activeCategory);

    const tabs = [{ id: 'todas', name: 'Todos' }, ...categories];

    return (
        <section className="py-20 bg-gray-50 min-h-screen">
            <Seo
                title="Shop"
                description="Explore toda a coleção de decoração natalina da Casa do Velinho: árvores, guirlandas, pisca-piscas e enfeites."
            />
            <div className="container mx-auto px-4 md:px-8 lg:px-16">
                <div className="text-center mb-12" data-aos='fade-down'>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                        Shop
                    </h1>
                    <p className="text-lg text-gray-600">
                        Explore toda a nossa coleção de decoração natalina.
                    </p>
                </div>

                <div className="flex flex-wrap justify-center gap-4 mb-12" data-aos='fade-up'>
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveCategory(tab.id)}
                            className={`px-4 py-2 rounded-full transition-all duration-300 ${
                                activeCategory === tab.id
                                    ? 'bg-gray-900 text-white shadow-lg scale-105'
                                    : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md'
                            }`}>
                            {tab.name}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {visibleProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Shop;
