import Hero from './components/hero';
import Category from './components/category';
import Order from './components/order';
import Products from './components/products';
import Collection from './components/collection';
import Deals from './components/deals';
import Cards from './components/cards';
import Footer from './components/footer';
import CartDrawer from './components/CartDrawer';
import WishlistDrawer from './components/WishlistDrawer';
import ProductModal from './components/ProductModal';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { ProductModalProvider } from './context/ProductModalContext';

import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from 'react';

export const App = () => {
useEffect(() => {
  AOS.init({
    duration: 1000,
    once: false,
    easing: 'ease-out-cubic',
    offset: 100,
    });
}, []);
  return (
    <CartProvider>
      <WishlistProvider>
        <ProductModalProvider>
          <div className='overflow-hidden'>
            <Hero />
            <Category />
            <Order />
            <Products />
            <Collection />
            <Deals />
            <Cards />
            <Footer />
          </div>
          <WishlistDrawer />
          <CartDrawer />
          <ProductModal />
        </ProductModalProvider>
      </WishlistProvider>
    </CartProvider>
  )
}
export default App;