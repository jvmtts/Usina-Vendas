import React, { useState, useEffect } from 'react';
import { FaArrowUp } from 'react-icons/fa';

export default function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);


  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };


  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {

    window.addEventListener('scroll', toggleVisibility);


    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  return (
    <button
      type="button"
      onClick={scrollToTop}
      className={`fixed bottom-8 right-8 z-50 p-4 rounded-full bg-[#ff7b00] text-white shadow-lg 
        transition-all duration-500 ease-in-out transform hover:bg-[#e66e00] hover:scale-110 hover:-translate-y-1 hover:shadow-2xl
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}
      `}
      aria-label="Voltar ao topo"
    >
      <FaArrowUp className="w-5 h-5 md:w-6 md:h-6" />
    </button>
  );
}