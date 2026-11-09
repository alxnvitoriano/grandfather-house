import { Link, useParams } from 'react-router-dom';
import { categories, products } from '../data/products';
import ProductCard from '../components/ProductCard';
import Seo from '../components/Seo';

const CategoryPage = () => {
    const { id } = useParams();
    const category = categories.find((cat) => cat.id === id);

    if (!category) {
        return (
            <section className="py-20 bg-gray-50 min-h-screen">
                <Seo
                    title="Categoria não encontrada"
                    description="A categoria que você procura não existe."
                    noIndex
                />
                <div className="container mx-auto px-4 md:px-8 lg:px-16 text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">
                        Categoria não encontrada
                    </h1>
                    <Link to="/shop" className="text-gray-900 underline">
                        Voltar para o Shop
                    </Link>
                </div>
            </section>
        );
    }

    const categoryProducts = products.filter((product) => product.category === id);

    return (
        <section className="py-20 bg-gray-50 min-h-screen">
            <Seo
                title={category.name}
                description={`Confira a nossa seleção de ${category.name.toLowerCase()} para a decoração de Natal da sua casa.`}
            />
            <div className="container mx-auto px-4 md:px-8 lg:px-16">
                <div className="mb-12" data-aos='fade-down'>
                    <Link to="/shop" className="text-sm text-gray-500 hover:text-gray-900">
                        &larr; Voltar para o Shop
                    </Link>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-4">
                        {category.name}
                    </h1>
                    <p className="text-gray-600 mt-2">
                        {categoryProducts.length} produto(s) encontrado(s)
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {categoryProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CategoryPage;
