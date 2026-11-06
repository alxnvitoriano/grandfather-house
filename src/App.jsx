import Hero from './components/hero';
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
    <div>
      <Hero />
    </div>
  )
}
export default App;