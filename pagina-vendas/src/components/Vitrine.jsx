import React, { useState, useEffect, useRef } from 'react';
import CardProduto from './CardProduto';
import { FaSearch } from 'react-icons/fa';

export default function Vitrine({ produtos = [], carregando }) {
  const [termoBusca, setTermoBusca] = useState('');
  const categoriasFixas = ['Todos', 'Coletes', 'Âncoras', 'Acessórios', 'Roupas'];
  const [filtroCategoria, setFiltroCategoria] = useState('Todos');
  const [buscaExpandida, setBuscaExpandida] = useState(false);
  const [limite, setLimite] = useState(6);
  const [carregandoMais, setCarregandoMais] = useState(false);
  
  const inputRef = useRef(null);

  useEffect(() => {
    setLimite(6);
  }, [termoBusca, filtroCategoria]);

  const listaProdutos = produtos || [];

  const produtosFiltrados = listaProdutos.filter(produto => {
    const nome = produto.nome || '';
    const matchBusca = nome.toLowerCase().includes(termoBusca.toLowerCase());
    
    const categoriasDoProduto = Array.isArray(produto.categoria) 
      ? produto.categoria 
      : [produto.categoria];

    const matchCategoria = filtroCategoria === 'Todos' || categoriasDoProduto.includes(filtroCategoria);
    
    return matchBusca && matchCategoria;
  });

  const produtosExibidos = produtosFiltrados.slice(0, limite);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop + 100 >= document.documentElement.scrollHeight) {
        if (!carregandoMais && limite < produtosFiltrados.length) {
          setCarregandoMais(true);
          setTimeout(() => {
            setLimite(prev => prev + 6);
            setCarregandoMais(false);
          }, 800);
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [carregandoMais, limite, produtosFiltrados.length]);

  return (
    <section className="w-[92%] max-w-[1800px] mx-auto py-10 bg-white no-select">
      <div className="flex flex-col md:flex-row justify-center items-center mb-10 gap-5 min-h-[50px] relative">
        
        <div className={`flex gap-3 justify-center flex-wrap transition-all duration-500 ${buscaExpandida ? 'md:opacity-40 md:blur-[1px]' : 'opacity-100'}`}>
          {categoriasFixas.map(cat => (
            <button
              key={cat}
              className={`border-0 py-2 px-5 rounded-full cursor-pointer font-bold transition-all duration-300 text-sm ${
                filtroCategoria === cat ? 'bg-[#ff7b00] text-white shadow-md scale-105' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              onClick={() => setFiltroCategoria(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div 
          className={`flex items-center bg-gray-100 rounded-full h-11 overflow-hidden transition-all duration-500 ease-in-out border-2 ${
            buscaExpandida ? 'w-full md:w-[350px] bg-white border-[#ff7b00] shadow-lg' : 'w-11 border-transparent hover:bg-gray-200'
          } md:absolute md:right-0`}
          onFocus={() => setBuscaExpandida(true)}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget) && termoBusca === '') {
              setBuscaExpandida(false);
            }
          }}
        >
          <button
            className={`bg-transparent border-0 w-11 h-11 rounded-full flex items-center justify-center cursor-pointer shrink-0 transition-colors duration-300 ${
              buscaExpandida ? 'text-[#ff7b00]' : 'text-gray-500'
            }`}
            onClick={(e) => {
              e.preventDefault();
              inputRef.current?.focus();
            }}
            type="button"
          >
            <FaSearch size={18} />
          </button>
          
          <input
            ref={inputRef}
            type="text"
            placeholder="O que você procura?"
            className={`border-0 bg-transparent outline-none pl-1 pr-4 w-full font-sans text-base text-gray-800 transition-opacity duration-300 ${
              buscaExpandida ? 'opacity-100' : 'opacity-0'
            }`}
            value={termoBusca}
            onChange={(e) => setTermoBusca(e.target.value)}
            tabIndex={buscaExpandida ? 0 : -1}
          />
        </div>
      </div>

      {produtosExibidos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {produtosExibidos.map(produto => (
            <CardProduto key={produto.id} produto={produto} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 px-5 text-gray-500 w-full bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
          <h3 className="text-2xl text-gray-800 mb-2 font-bold">Nenhum produto em {filtroCategoria}</h3>
          <p>Tente outro filtro ou faça uma busca geral.</p>
        </div>
      )}

      {carregandoMais && (
        <div className="w-full flex justify-center items-center py-10 mt-4">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-[#ff7b00] rounded-full animate-spin"></div>
        </div>
      )}
    </section>
  );
}