import iconeArvore from '../assets/icone-arvore-natal.svg'
import iconeBolinha from '../assets/icone-bolinha-natal.svg'
import CategoryCard from './categoryCard'

const Collection = () => {
    const categories = () => [
        {
            id: 1, name: 'Árvores Natalinas', count: 3, color: 'bg-blue-500', textColor: 'text-blue-950', image: iconeArvore
        },
        {
            id: 2, name: 'Decorações', count: 4, color: 'bg-red-500', textColor: 'text-red-950', image: iconeBolinha
        }
    ];

    const categoryCard = ({cat, index, aosDelay}) => (
        <div
        data-aos='fade-right'
        data-aos-delay={aosDelay}
        className={`${cat.color} ${cat.textColor} rounded-2xl p-6 shadow-md hover:shadow-xl transition relative flex flex-col justify-between group hover:scale-105 transform duration-300 cursor-pointer`}>
            <div className="z-10 relative">
                <h3 className='text-xl font-bold mt-1'>
                    {cat.name}
                </h3>
                <p className="text-3xl font-bold mt-2">
                    {cat.count}
                </p>
                <p className='text-sm opacity-80 font-bold'>
                    Produtos
                </p>
            </div>
            <img src={cat.image} alt={cat.name} 
            className='absolute -right-0.5 -bottom-6.25 w-50 h-50
            object-contain opacity-90 transition-transform duration-300 
            group-hover:scale-110'/>
        </div>
    )
  return (
    <section className='py-20 bg-white overflow-hidden' 
    id='collection'>
        <div className="container mx-auto px-6 md:px-10">
            <h2 className='text-3xl md:text-4xl font-bold text-gray-900
            mb-10'
            data-aos='fade-down'>
                Compre por <span className='text-gray-600'>Coleção</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 auto-rows-auto">
                <div className="flex flex-col gap-6">
                    {categories.slice(0, 2).map((cat, idx) => (
                        <CategoryCard key={cat.id} cat={cat} 
                        index={idx} 
                        aosDelay={idx * 200} />
                    ))}
                </div>
            </div>
        </div>
    </section>
  )
}

export default Collection