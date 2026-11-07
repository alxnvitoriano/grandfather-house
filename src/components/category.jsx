import {useState} from 'react'
import {images} from '../assets/images'

const Category = () => {    
    const [activeTab, setActiveTab] = useState('natal');

    const tabs = [
        {id: 'arvore', name: 'Árvores'},
        {id: 'decoracao', name: 'Decoração'},
    ];
    const products = {
        arvore: [
            {id: '1', name: 'Arvore de Natal 150cm', price:'R$ 349,90', image:images.ARVORE},
            {id: '2', name: 'Arvore de Natal 90cm', price:'R$ 289,90', image:images.ARVORE5},
            {id: '3', name: 'Arvore de Natal 60cm', price:'R$ 149,90', image:images.ARVORE4},
        ],
        decoracao: [
            {id: '4', name: 'Bolinhas natalinas vermelho e dourado 50pcs', price:'R$ 99,90', image:images.BOLINHAS},
            {id: '5', name: 'Decoração casa com boneco de neve decorativo', price:'R$ 89,00', image:images.CASA},
            {id: '6', name: 'Luminária de Natal em Forma de Cabine Telefônica', price:'R$ 99,00', image:images.TELEFONE},
            {id: '7', name: 'LED de Natal em Corda 10M', price:'R$ 114,90', image:images.CORTINA},

        ],
    }
  return (
    <section className='py-20 bg-gray-50'
    data-aos='fade-up'>
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
            <div className="text-center mb-12"
            data-aos='fade-down'>
                <h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-3'>
                    Compre por Categoria
                </h2>
                <p className="text-gray-600 mx-w-2xl mx-auto">
                    lorem ipsum dolor sit amet ...
                </p>
            </div>
            <div className="flex flex-wrap justify-center gap-4 mb-12"
            data-aos='fade-up'
            data-aos-delay='200'>
                {tabs.map((tab) => (
                    <button
                    key={tab.id}
                    className={`group flex flex-col items-center gap-2 px-4 py-3 rounded-full transition-all duration-300 ${
                        activeTab === tab.id 
                        ? 'bg-gray-900 text-white shadow-lg scale-105' 
                        : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md'
                    } `}
                    onClick={() => setActiveTab(tab.id)}>
                        {tab.name}
                    </button>
                ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products[activeTab]?.map((product, idx) => (
                    <div 
                    key = {product.id}
                    className='group bg-white rounded-2xl overflow-hidden
                    shadow-md hover:shadow-2xl transition-all  duration-500 cursor-pointer'
                    data-aos='zoom-in'
                    data-aos-delay={idx * 100}>
                    <div className="group relative h-64 overflow-hidden">
                        <img src={product.image} alt={product.name} 
                        className="w-full h-full object-contain hover:scale-105 
                        transition-transform duration-300 cursor-pointer" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="opacity-0 group-hover:opacity-100
                        transition-opacity duration-300">
                            <button className='absolute bottom-4 left-1/2 transform 
                                               -translate-x-1/2 bg-white text-gray-900
                                               px-4 py-2  rounded-full text-sm font-semibold
                                               transition-all
                                               duration-300 hover:scale-105 hover:cursor-pointer'>
                                                Quick View
                            </button>
                            </div>
                            
                        </div>
                        <div className="p-4">
                                <h3 className="font-semibold text-gray-900 mb-1">
                                    {product.name}
                                </h3>
                                <p className="text-gray-600 font-medium">
                                    {product.price}
                                </p>
                            </div>
                    </div>
                    ))}
            </div>
        </div>

    </section>
  )
}

export default Category;