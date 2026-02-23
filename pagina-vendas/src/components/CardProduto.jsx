import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function CardProduto({ produto }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/produto/${produto.id}`);
  };

  const formatarPreco = (preco) => {
    if (typeof preco === 'number') {
      return preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }
    return preco;
  };

  const imagemPrincipal = produto.imagens && produto.imagens.length > 0 
    ? produto.imagens[0] 
    : 'https://via.placeholder.com/300x300?text=Sem+Foto';

  return (
    <div 
      className="border border-gray-100 rounded-xl bg-white overflow-hidden flex flex-col cursor-pointer group hover:shadow-lg transition-shadow duration-300" 
      onClick={handleClick}
    >
      <div className="w-full aspect-square bg-white flex justify-center items-center p-4 overflow-hidden border-b border-gray-100">
        <img 
          src={imagemPrincipal} 
          alt={produto.nome} 
          className="object-contain w-full h-full transition-transform duration-500 ease-out group-hover:scale-110"
        />
      </div>
      
      <div className="p-5 flex flex-col grow">
        <p className="text-gray-500 text-sm mb-1">
          {Array.isArray(produto.categoria) ? produto.categoria[0] : produto.categoria}
        </p>
        <h3 className="mb-2 text-[1.1rem] text-gray-800">{produto.nome}</h3>
        <p className="text-[1.4rem] font-bold text-[#111] mb-2">{formatarPreco(produto.preco)}</p>
        
        <button className="mt-auto py-3 px-6 bg-[#f84d2a] hover:bg-[#e04525] text-white rounded-full font-bold text-base w-full transition-colors duration-300">
          Ver detalhes
        </button>
      </div>
    </div>
  );
}