import React, { useState, useEffect, useRef } from 'react';
import { produtos } from '../data/produtos';
import CardProduto from './CardProduto';

export default function Vitrine() {
  const [filtro, setFiltro] = useState('Todos');
  const [quantidadeVisivel, setQuantidadeVisivel] = useState(6);
  const [carregando, setCarregando] = useState(false);
  
  const [buscaAberta, setBuscaAberta] = useState(false);
  const [termoBusca, setTermoBusca] = useState('');
  
  const observerTarget = useRef(null);
  const inputRef = useRef(null);

  const categorias = ['Todos', ...new Set(produtos.flatMap(p => Array.isArray(p.categoria) ? p.categoria : p.categoria))];

  const produtosFiltrados = produtos.filter(p => {
    const matchCategoria = filtro === 'Todos' || (Array.isArray(p.categoria) ? p.categoria.includes(filtro) : p.categoria === filtro);
    const matchBusca = p.nome.toLowerCase().includes(termoBusca.toLowerCase()) || 
                       p.descricao.toLowerCase().includes(termoBusca.toLowerCase());
    return matchCategoria && matchBusca;
  });

  const produtosExibidos = produtosFiltrados.slice(0, quantidadeVisivel);

  const handleMudarFiltro = (cat) => {
    setFiltro(cat);
    setQuantidadeVisivel(6); 
  };

  const handleBusca = (e) => {
    setTermoBusca(e.target.value);
    setQuantidadeVisivel(6);
  };

  const toggleBusca = () => {
    setBuscaAberta(!buscaAberta);
    if (!buscaAberta) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setTermoBusca('');
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && quantidadeVisivel < produtosFiltrados.length && !carregando) {
          setCarregando(true);
          
          setTimeout(() => {
            setQuantidadeVisivel(prev => prev + 6);
            setCarregando(false);
          }, 600);
        }
      },
      { threshold: 0.1 } 
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [quantidadeVisivel, produtosFiltrados.length, carregando]);

  return (
    <div className="pagina-branca">
      
      <div className="controles-vitrine">
        <div className="filtros">
          {categorias.map(cat => (
            <button 
              key={cat} 
              className={`btn-filtro ${filtro === cat ? 'ativo' : ''}`}
              onClick={() => handleMudarFiltro(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className={`busca-container ${buscaAberta ? 'aberta' : ''}`}>
          <button className="btn-icone-busca" onClick={toggleBusca}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '20px', height: '20px', minWidth: '20px', minHeight: '20px', display: 'block' }}>
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
          <input
            ref={inputRef}
            type="text"
            className="input-busca"
            placeholder="Buscar produto..."
            value={termoBusca}
            onChange={handleBusca}
          />
        </div>
      </div>

      {produtosFiltrados.length === 0 && (
        <div className="sem-resultados">
          <h3>Nenhum produto encontrado.</h3>
          <p>Tente buscar por outro termo ou limpe os filtros.</p>
        </div>
      )}

      <div className="grid-3-colunas">
        {produtosExibidos.map((produto, index) => (
          <CardProduto key={produto.id} produto={produto} index={index % 6} />
        ))}
      </div>

      {carregando && (
        <div className="loading-container">
          <div className="spinner"></div>
        </div>
      )}

      {!carregando && quantidadeVisivel < produtosFiltrados.length && (
        <div ref={observerTarget} style={{ height: '20px', width: '100%' }}></div>
      )}
    </div>
  );
}