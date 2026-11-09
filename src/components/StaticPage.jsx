import Seo from './Seo';

// Moldura comum das páginas de conteúdo institucional e legal.
const StaticPage = ({ title, description, subtitle, updatedAt, children }) => (
    <section className="py-20 bg-gray-50 min-h-screen">
        <Seo title={title} description={description} />
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
            <div className="max-w-3xl mx-auto" data-aos="fade-up">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">{title}</h1>
                {subtitle && <p className="text-lg text-gray-600 mb-4">{subtitle}</p>}
                {updatedAt && (
                    <p className="text-sm text-gray-400 mb-8">Última atualização: {updatedAt}</p>
                )}
                <div className="bg-white rounded-xl shadow p-6 md:p-8 flex flex-col gap-6 text-gray-600 leading-relaxed">
                    {children}
                </div>
            </div>
        </div>
    </section>
);

export const StaticSection = ({ title, children }) => (
    <section className="flex flex-col gap-2">
        <h2 className="text-lg font-bold text-gray-900">{title}</h2>
        {children}
    </section>
);

export default StaticPage;
