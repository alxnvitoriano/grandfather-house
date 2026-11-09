import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import Seo from '../components/Seo';

const NotFound = () => (
    <section className="py-20 bg-gray-50 min-h-screen">
        <Seo
            title="Página não encontrada"
            description="A página que você procura não existe ou foi movida."
            noIndex
        />
        <div className="container mx-auto px-4 md:px-8 lg:px-16 flex flex-col items-center justify-center gap-4 text-center">
            <Compass className="w-12 h-12 text-gray-300" />
            <p className="text-5xl font-bold text-gray-900">404</p>
            <h1 className="text-2xl font-bold text-gray-900">Página não encontrada</h1>
            <p className="text-gray-600 max-w-md">
                O endereço acessado não existe ou foi movido. Confira o link ou volte para a loja.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
                <Link
                    to="/"
                    className="bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-all">
                    Voltar para a Home
                </Link>
                <Link
                    to="/shop"
                    className="border border-gray-300 px-6 py-3 rounded-lg font-semibold text-gray-900 hover:bg-white transition-all">
                    Ir para o Shop
                </Link>
            </div>
        </div>
    </section>
);

export default NotFound;
