import { categories, products } from '../data/products';
import ProductCard from '../components/ProductCard';
import Seo from '../components/Seo';

const Promotions = () => {
    // Produtos com desconto são os que possuem "oldPrice" definido.
    const discounted = products.filter((product) => product.oldPrice);

    const categoryName = (id) => categories.find((cat) => cat.id === id)?.name;

    return (
        <section className="py-20 bg-gray-50 min-h-screen">
            <Seo
                title="Promoções"
                description="Aproveite os melhores descontos em decoração natalina: árvores, guirlandas, pisca-piscas e enfeites com preços especiais."
            />
            <div className="container mx-auto px-4 md:px-8 lg:px-16">
                <div className="text-center mb-12" data-aos='fade-down'>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                        Promoções
                    </h1>
                    <p className="text-lg text-gray-600">
                        Aproveite os melhores descontos em decoração natalina.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {discounted.map((product) => (
                        <div key={product.id} className="flex flex-col gap-2">
                            <ProductCard product={product} />
                            <span className="text-xs font-semibold uppercase tracking-wide text-red-500">
                                {product.discount} em {categoryName(product.category)}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Promotions;
