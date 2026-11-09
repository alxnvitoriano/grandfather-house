import { images } from '../assets/images'

export const categories = [
    { id: 'arvore', name: 'Árvores' },
    { id: 'decoracao', name: 'Decoração' },
    { id: 'piscaPisca', name: 'Pisca Pisca' },
]

export const products = [
    {
        id: 1,
        name: 'Arvore de Natal 150cm',
        price: 'R$ 349,90',
        oldPrice: 'R$ 399,90',
        image: images.ARVORE,
        category: 'arvore',
        rating: 3.9,
        discount: '-12,5%',
        change: '+12,5%',
    },
    {
        id: 2,
        name: 'Arvore de Natal 90cm',
        price: 'R$ 289,90',
        oldPrice: 'R$ 299,90',
        image: images.ARVORE5,
        category: 'arvore',
        rating: 4,
        discount: '-7,7%',
        change: '+7,7%',
    },
    {
        id: 3,
        name: 'Arvore de Natal 60cm',
        price: 'R$ 149,90',
        oldPrice: 'R$ 199,90',
        image: images.ARVORE4,
        category: 'arvore',
        rating: 4.5,
        discount: '-15%',
        change: '+15%',
    },
    {
        id: 4,
        name: 'Bolinhas natalinas vermelho e dourado 50pcs',
        price: 'R$ 99,90',
        image: images.BOLINHAS,
        category: 'decoracao',
    },
    {
        id: 5,
        name: 'Decoração casa com boneco de neve decorativo',
        price: 'R$ 89,00',
        image: images.CASA,
        category: 'decoracao',
    },
    {
        id: 6,
        name: 'Luminária de Natal em Forma de Cabine Telefônica',
        price: 'R$ 99,00',
        image: images.TELEFONE,
        category: 'decoracao',
    },
    {
        id: 7,
        name: 'LED de Natal em Corda 10M',
        price: 'R$ 114,90',
        image: images.CORTINA,
        category: 'piscaPisca',
    },
    {
        id: 8,
        name: 'Pisca Pisca Estrela',
        price: 'R$ 109,90',
        image: images.ESTRELA,
        category: 'piscaPisca',
    },
]
