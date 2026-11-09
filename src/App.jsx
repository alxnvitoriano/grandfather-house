import { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './layouts/Layout';
import Home from './pages/Home';
import Shop from './pages/Shop';
import CategoryPage from './pages/CategoryPage';
import Promotions from './pages/Promotions';
import Offers from './pages/Offers';
import Checkout from './pages/Checkout';
import Sobre from './pages/Sobre';
import Termos from './pages/Termos';
import Privacidade from './pages/Privacidade';
import Trocas from './pages/Trocas';
import NotFound from './pages/NotFound';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { ProductModalProvider } from './context/ProductModalContext';

import AOS from 'aos';
import 'aos/dist/aos.css';

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
          <BrowserRouter>
            <Routes>
              <Route element={<Layout />}>
                <Route path='/' element={<Home />} />
                <Route path='/shop' element={<Shop />} />
                <Route path='/categoria/:id' element={<CategoryPage />} />
                <Route path='/promocoes' element={<Promotions />} />
                <Route path='/ofertas' element={<Offers />} />
                <Route path='/checkout' element={<Checkout />} />
                <Route path='/sobre' element={<Sobre />} />
                <Route path='/termos' element={<Termos />} />
                <Route path='/privacidade' element={<Privacidade />} />
                <Route path='/trocas-e-devolucoes' element={<Trocas />} />
                <Route path='*' element={<NotFound />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </ProductModalProvider>
      </WishlistProvider>
    </CartProvider>
  );
};

export default App;
