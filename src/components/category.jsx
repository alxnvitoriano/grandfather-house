import React,{useState} from 'react'
import {images} from '../assets/images'

const Category = () => {    
    const [activeTab, setActiveTab] = useState('natal');

    const tabs = [
        {id: 'arvore', name: 'Arvore', image: images.ARVORE},
        {id: 'bolinha', name: 'Bolinhas', image: images.BOLINHAS},
        {id: 'casa', name: 'Casa', image: images.CASA},
        {id: 'telefone', name: 'Telefone', image: images.TELEFONE},
        {id: 'cortina', name: 'Cortina', image: images.CORTINA},
    ];
    const products = {
        arvore: [
            {id: '1', name: 'Arvore de Natal 150cm', price:'R$ 399,00', image:images.ARVORE},
        ],
        bolinha: [
            {id: '2', name: 'Bolinhas natalinas: 50pcs vermelho e dourado', price:'R$ 109,99', image:images.BOLINHAS},
        ],
        casa: [
            {id: '3', name: 'Pingente casa com bonceo de neve decorativo', price:'R$ 89,00', image:images.CASA},
        ],
        telefone: [
            {id: '4', name: 'Luminária de Natal em Forma de Cabine Telefônica com Papai Noel', price:'R$ 99,00', image:images.TELEFONE},
        ],
        cortina: [
            {id: '5', name: 'LED de Natal em Corda 10M', price:'R$ 99,00', image:images.CORTINA},
        ],
    }
  return (
    <section className='py-20 bg-gray-50'
    data-aos='fade-up'>
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
            <div className="text-center mb-12"
            data-aos='fade-down'>
                <h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-3'>
                    Shop by Category
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
                
            </div>
        </div>

    </section>
  )
}

export default Category;