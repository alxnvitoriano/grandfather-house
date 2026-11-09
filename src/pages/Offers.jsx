import { products } from '../data/products';
import ProductCard from '../components/ProductCard';
import Seo from '../components/Seo';

const Offers = () => {
    // Ofertas são os produtos mais bem avaliados (a partir de 4 estrelas).
    const topRated = [...products]
        .filter((product) => (product.rating ?? 0) >= 4)
        .sort((a, b) => b.rating - a.rating);

    return (
        <section className="py-20 bg-gray-50 min-h-screen">
            <Seo
                title="Ofertas"
                description="Os produtos de decoração natalina mais bem avaliados pelos nossos clientes, com destaque para qualidade e custo-benefício."
            />
            <div className="container mx-auto px-4 md:px-8 lg:px-16">
                <div className="text-center mb-12" data-aos='fade-down'>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                        Ofertas
                    </h1>
                    <p className="text-lg text-gray-600">
                        Os produtos mais bem avaliados pelos nossos clientes.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {topRated.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Offers;
