import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import CartDrawer from '../components/CartDrawer';
import WishlistDrawer from '../components/WishlistDrawer';
import ProductModal from '../components/ProductModal';

const Layout = () => {
    const { pathname } = useLocation();

    // Rola para o topo a cada troca de rota — sem isso, navegar de uma página
    // longa para outra mantém a posição antiga do scroll.
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return (
        <div className='overflow-hidden'>
            <Navbar />
            <main>
                <Outlet />
            </main>
            <Footer />
            <WishlistDrawer />
            <CartDrawer />
            <ProductModal />
        </div>
    );
};

export default Layout;
