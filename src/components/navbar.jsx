import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom';
import { Heart, Menu, Search, ShoppingBag, X } from 'lucide-react';
import papaiNoelVoando from '../assets/papai-noel-treno-voando.svg'
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [hoveredLink, setHoveredLink] = useState(null);
    const { items: cartItems, totalItems, setIsOpen } = useCart();
    const { items: wishlistItems, setIsOpen: setIsWishlistOpen } = useWishlist();
    const wishlistCount = wishlistItems.filter(
        (item) => !cartItems.some((cartItem) => cartItem.id === item.id)
    ).length;

    const navLinks = [
        { label: 'Home', to: '/' },
        { label: 'Shop', to: '/shop' },
        { label: 'Coleções', to: '/shop' },
        { label: 'Promoções', to: '/promocoes' },
        { label: 'Ofertas', to: '/ofertas' },
    ];
  return (
    <div className='relative z-50 bg-gray-900' data-aos='fade-down'>
        <img
            src={papaiNoelVoando}
            alt="Papai Noel voando de trenó"
            className="pointer-events-none select-none absolute top-0 left-0 w-full h-auto z-0"
        />
        <div className="container relative z-10 mx-auto px-4 md:px-8 lg:px-16 py-6">
            <div className="flex items-center justify-between">
                <Link to='/' className="text-white text-3xl font-bold tracking-tight">
                    Casa
                    <span className='text-xs md:flex items-center justify-center flex-1'>
                    do Velinho
                    </span>
                </Link>
                <div className='hidden md:flex items-center justify-center flex-1 '>
                    <div className='flex gap-8 lg:gap-12 text-white'>
                        {navLinks.map((link) => (
                            <NavLink to={link.to} key={link.label}
                            onMouseEnter={() => setHoveredLink(link.label)}
                            onMouseLeave={() => setHoveredLink(null)}
                            className={({ isActive }) => `relative font-medium transition-opacity hover:opacity-70 ${
                                isActive ? 'opacity-100' : 'opacity-80'
                            } `}>
                                {({ isActive }) => (
                                    <>
                                        {link.label}
                                        {(hoveredLink === link.label || isActive) && (
                                            <span className='absolute -bottom-2 left-0 right-0 h-0.5 bg-white rounded-full animate-fade-in'>

                                            </span>
                                        )}
                                    </>
                                )}
                            </NavLink>
                        ))}
                    </div>
                </div>
                <div className='flex items-center gap-4 text-white'>

                    <button className='hover:opacity-70 transition-opacity'>
                        <Search size={20}/>
                    </button>
                    
                    <button onClick={() => setIsWishlistOpen(true)}
                        className='hover:opacity-70 transition-opacity relative'>
                        <Heart size={20}/>
                        <span className='absolute -top-2 -right-2 bg-white text-gray-900 text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold'>
                            {wishlistCount}
                        </span>
                    </button>

                    <button onClick={() => setIsOpen(true)}
                        className='hover:opacity-70 transition-opacity relative'>
                        <ShoppingBag size={20}/>
                        <span className='absolute -top-2 -right-2 bg-white text-gray-900 text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold'>
                            {totalItems}
                        </span>
                    </button>
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className='md:hidden hover:opacity-70 transition-opacity'>
                        {isMenuOpen ? <X size={24}/> : <Menu size={24}/> }
                    </button>
                </div>
            </div>
            {isMenuOpen && (
                <div className='md:hidden mt-4 pt-4 border-t border-white/20'>
                    <div className='flex flex-col gap-3 text-white'>
                        {navLinks.map((link) => (
                            <NavLink to={link.to} key={link.label}
                            onClick={() => setIsMenuOpen(false)}
                            className={({ isActive }) => `py-2 relative transition-opacity hover:opacity-70 ${
                                isActive ? 'opacity-100' : 'opacity-80'
                            } `}>
                                {link.label}
                            </NavLink>
                        ))}
                    </div>
                </div>
            )}
        </div>
    </div>
  )
}

export default Navbar;
