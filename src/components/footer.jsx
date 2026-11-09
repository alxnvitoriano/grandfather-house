import { MapPin, Phone, Mail } from 'lucide-react'
import { categories } from '../data/products'

const Instagram = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
)

const Facebook = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
)

const Youtube = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
        <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
    </svg>
)

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-900 text-gray-300 pt-16 pb-6"
        data-aos='fade-up'>
            <div className="container mx-auto px-4 md:px-8 lg:px-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

                    <div data-aos='fade-up'>
                        <h3 className="text-white text-2xl font-bold mb-4">
                            Casa
                            <span className='text-xs md:flex items-center flex-1'>
                                do Velinho
                            </span>
                        </h3>
                        <p className="text-gray-400 mb-6">
                            Decoração de Natal para transformar a sua casa em um verdadeiro conto natalino.
                        </p>
                        <div className="flex items-center gap-4">
                            <a href="#" aria-label="Instagram" className="hover:text-white transition-colors">
                                <Instagram size={20} />
                            </a>
                            <a href="#" aria-label="Facebook" className="hover:text-white transition-colors">
                                <Facebook size={20} />
                            </a>
                            <a href="#" aria-label="Youtube" className="hover:text-white transition-colors">
                                <Youtube size={20} />
                            </a>
                        </div>
                    </div>

                    <div data-aos='fade-up' data-aos-delay='100'>
                        <h4 className="text-white text-lg font-semibold mb-4">Categorias</h4>
                        <ul className="flex flex-col gap-3">
                            {categories.map((category) => (
                                <li key={category.id}>
                                    <a href="#" className="hover:text-white transition-colors">
                                        {category.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div data-aos='fade-up' data-aos-delay='200'>
                        <h4 className="text-white text-lg font-semibold mb-4">Contato</h4>
                        <ul className="flex flex-col gap-3">
                            <li className="flex items-start gap-3">
                                <MapPin size={20} className="shrink-0 mt-1" />
                                <span>Rua do Natal, 123 - Centro, Polo Norte</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone size={20} className="shrink-0" />
                                <a href="tel:+5511999999999" className="hover:text-white transition-colors">
                                    (11) 99999-9999
                                </a>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail size={20} className="shrink-0" />
                                <a href="mailto:contato@casadoVelinho.com" className="hover:text-white transition-colors">
                                    contato@casadoVelinho.com
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div data-aos='fade-up' data-aos-delay='300'>
                        <h4 className="text-white text-lg font-semibold mb-4">Atendimento</h4>
                        <ul className="flex flex-col gap-3">
                            <li>Segunda a Sexta: 9h - 18h</li>
                            <li>Sábado: 9h - 13h</li>
                            <li>Domingo: Fechado</li>
                        </ul>
                    </div>

                </div>

                <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
                    <p>
                        &copy; {currentYear} Casa do Velinho. Todos os direitos reservados.
                    </p>
                    <div className="flex items-center gap-6">
                        <a href="#" className="hover:text-white transition-colors">Termos de Uso</a>
                        <a href="#" className="hover:text-white transition-colors">Privacidade</a>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
