import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CardProduto({ produto }) {
  const navigate = useNavigate();
  
  const [imgIndex, setImgIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  let imagensParaCiclar = [];
  
  if (produto.imagensPorCor && Object.keys(produto.imagensPorCor).length > 0) {
    imagensParaCiclar = Object.values(produto.imagensPorCor).map(fotos => fotos[0]);
  } else if (produto.imagens && produto.imagens.length > 0) {
    imagensParaCiclar = produto.imagens;
  } else {
    imagensParaCiclar = ['https://via.placeholder.com/600x600?text=Sem+Foto'];
  }

  useEffect(() => {
    let intervalo;
    if (isHovered && imagensParaCiclar.length > 1) {
      intervalo = setInterval(() => {
        setImgIndex((prev) => (prev + 1) % imagensParaCiclar.length);
      }, 1500);
    }
    return () => {
      if (intervalo) clearInterval(intervalo);
    };
  }, [isHovered, imagensParaCiclar.length]);

  const handleMouseEnter = () => setIsHovered(true);
  
  const handleMouseLeave = () => {
    setIsHovered(false);
    setImgIndex(0);
  };

  const formatarPreco = (preco) => {
    if (typeof preco === 'number') {
        return preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }
    return preco || 'R$ 0,00';
  };

  const handleClick = () => {
    sessionStorage.setItem('vitrineScrollY', window.scrollY.toString());
    navigate(`/produto/${produto.id}`);
  };

  return (
    <div 
      className="bg-white rounded-2xl p-4 md:p-5 flex flex-col justify-between border border-gray-100 shadow-sm transition-all duration-500 hover:shadow-xl hover:-translate-y-2 cursor-pointer group relative overflow-hidden"
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="w-full aspect-square bg-white rounded-xl overflow-hidden mb-4 relative flex items-center justify-center isolate">
        {imagensParaCiclar.map((imgSrc, index) => {
           const isActive = index === imgIndex;
           return (
             <img 
               key={index}
               src={imgSrc} 
               alt={`${produto.nome} - variação ${index}`}
               className={`absolute inset-0 w-full h-full object-contain p-2 bg-white transition-all duration-700 ease-in-out will-change-[opacity,transform]
                 ${isActive ? 'opacity-100 z-10 scale-105' : 'opacity-0 z-0 scale-100'}
                 ${isHovered && isActive ? 'group-hover:scale-110' : ''} 
               `}
             />
           );
        })}

        {imagensParaCiclar.length > 1 && (
           <div className={`absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-[6px] bg-white/60 backdrop-blur-md px-3 py-[6px] rounded-full transition-all duration-500 z-20 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              {imagensParaCiclar.map((_, idx) => (
                <div 
                  key={idx} 
                  className={`transition-all duration-500 rounded-full ${idx === imgIndex ? 'w-5 h-[5px] bg-[#ff7b00]' : 'w-[5px] h-[5px] bg-gray-400/70'}`}
                />
              ))}
           </div>
        )}
      </div>

      <div className="flex flex-col grow relative z-20 bg-white/80 backdrop-blur-[2px] rounded-xl p-1">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
          {Array.isArray(produto.categoria) ? produto.categoria[0] : produto.categoria}
        </span>
        <h3 className="text-lg font-bold text-gray-800 leading-tight mb-2 line-clamp-2">
          {produto.nome}
        </h3>
        <p className="text-2xl font-extrabold text-gray-900 mt-auto">
          {formatarPreco(produto.preco)}
        </p>
      </div>

      <button className="mt-5 w-full bg-gray-50 text-[#ff7b00] border-2 border-transparent hover:border-[#ff7b00] hover:bg-[#fff5eb] py-3 rounded-xl font-bold transition-all duration-300 relative z-20">
        Ver detalhes
      </button>
    </div>
  );
}