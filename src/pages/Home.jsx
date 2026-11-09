import Hero from '../components/hero';
import Category from '../components/category';
import Order from '../components/order';
import Products from '../components/products';
import Collection from '../components/collection';
import Deals from '../components/deals';
import Cards from '../components/cards';
import Seo, { DEFAULT_DESCRIPTION } from '../components/Seo';

const Home = () => (
    <>
        <Seo title="Decoração de Natal" description={DEFAULT_DESCRIPTION} />
        <Hero />
        <Category />
        <Order />
        <Products />
        <Collection />
        <Deals />
        <Cards />
    </>
);

export default Home;
