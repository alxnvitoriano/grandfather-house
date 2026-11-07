import Hero from './components/hero';
import Category from './components/category';
import Order from './components/order';
import Products from './components/products';
import Collection from './components/collection';

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
    <div className='overflow-hidden'>
      <Hero />
      <Category />
      <Order />
      <Products />
      <Collection />
    </div>
  )
}
export default App;