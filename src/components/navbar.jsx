import { useState } from 'react'
import { Menu, Search, ShoppingBag, X } from 'lucide-react';

export const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeLink, setActiveLink] = useState('Home');
    const [hoveredLink, setHoveredLink] = useState(null);

    const navLinks = ['Home', 'Shop', 'Collections', 'Sale', 'Deals'];
  return (
    <div className='relative z-50' data-aos='fade-down'>
        <div className="container mx-auto px-4 md:px-8 lg:px-16 py-6">
            <div className="flex items-center justify-between">
                <div className="text-white text-3xl font-bold tracking-tight">
                    Casa
                    <span className='text-xs md:flex items-center justify-center flex-1'>
                    do Velinho
                    </span>
                </div>
                <div className='hidden md:flex items-center justify-center flex-1 '>
                    <div className='flex gap-8 lg:gap-12 text-white'>
                        {navLinks.map((link) => (
                            <a href='#' key={link}
                            onClick={() => setActiveLink(link)}
                            onMouseEnter={() => setHoveredLink(link)}
                            onMouseLeave={() => setHoveredLink(null)}
                            className={`relative font-medium transicion-opacity hover:opacity-70
                                ${
                                    activeLink === link 
                                    ? 'opacity-100'
                                    : 'opacity-80'
                                } `}>
                                    {link}
                                    {(hoveredLink === link || activeLink) && (
                                        <span className='absolute -bottom-2 left-0 right-0 h-0.5 bg-white rounded-full animate-fade-in'>

                                        </span>
                                    )}
                                </a>
                        ))}
                    </div>
                </div>
                <div className='flex items-center gap-4 text-white'>

                    <button className='hover:opacity-70 transition-opacity'>
                        <Search size={20}/>
                    </button>
                    
                    <button className='hover:opacity-70 transition-opacity relative'>
                        <ShoppingBag size={20}/>
                        <span className='absolute -top-2 -right-2 bg-white text-gray-900 text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold'>
                            0
                        </span>
                    </button>
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className='md:hidden hover:opacity-70 transition-opacity'>
                        {isMenuOpen ? <X size={24}/> : <Menu size={24}/> }
                    </button>
                </div>
            </div>
            {isMenuOpen && (
                <div >

                </div>
            )}
        </div>
    </div>
  )
}

export default Navbar;