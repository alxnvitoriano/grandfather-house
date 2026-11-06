//import React from 'react'

import { useEffect, useState } from "react";
import Navbar from "./navbar";
import piscaPisca1 from '../assets/piscaPisca1.svg'
import piscaPisca2 from '../assets/piscaPisca2.svg'
import piscaPisca3 from '../assets/piscaPisca3.svg'
import piscaPisca4 from '../assets/piscaPisca4.svg'
import papaiNoel from '../assets/papai-noel-tchau.svg'


const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const slides = [
    {
      bgColor: 'bg-red-800',
      image: piscaPisca1,
      alt: 'pisca pisca natalino iluminado'  
    },
    {
      bgColor: 'bg-green-800',
      image: piscaPisca2,
      alt: 'pisca pisca natalino iluminado'  
    },
    {
      bgColor: 'bg-yellow-600',
      image: piscaPisca3,
      alt: 'pisca pisca natalino iluminado'  
    },
    {
      bgColor: 'bg-blue-800',
      image: piscaPisca4,
      alt: 'pisca pisca natalino iluminado'
    },
    
  ];
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length)
    }, 1000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const currentSlide = slides[currentIndex];

  return (
    <div className={`relative group min-h-screen transition-colors duration-1000 overflow-hidden ${currentSlide.bgColor}`}>
        <Navbar />
        <div className="w-full h-[calc(90vh-80px)] flex items-center justify-center">
          <div className="relative group w-full h-full flex justify-center items-center">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none" 
            data-aos='fade-up'
            data-aos-duration='1500'>
              <span className="text-[3.5rem] md:text-[12rem] lg:text-[7.5rem] font-black text-black/20 select-none whitespace-nowrap animate-pulse" >
                Casa do Velinho
              </span>
            </div>
            <div className="absolute inset-0 z-10 flex items-center justify-center animate-float" 
            data-aos='zoom-in'
            data-aos-duration='1200'
            data-aos-delay='300'>
              <img src={currentSlide.image} alt={currentSlide.alt} className="w-full h-full object-contain hover:scale-105 transition-transform duration-300 cursor-pointer"/>
            </div>
          </div>
        </div>

        <img
          src={papaiNoel}
          alt="Papai Noel dando tchau"
          className="pointer-events-none select-none absolute bottom-0 -left-15 origin-bottom-left rotate-12 translate-y-full group-hover:translate-y-[15%] transition-transform duration-700 ease-out w-40 sm:w-56 md:w-72 z-30"
        />
    </div>
  )
}

export default Hero;