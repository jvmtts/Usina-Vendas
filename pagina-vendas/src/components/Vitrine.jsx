import React, { useState } from 'react';
import { produtos } from '../data/produtos';
import CardProduto from './CardProduto';

export default function Vitrine() {
  const [filtro, setFiltro] = useState('Todos');
  const categorias = ['Todos', ...new Set(produtos.map(p => p.categoria))];

  const produtosFiltrados = filtro === 'Todos' 
    ? produtos 
    : produtos.filter(p => p.categoria === filtro);

  return (
    <div className="pagina-branca">
      <div className="filtros">
        {categorias.map(cat => (
          <button 
            key={cat} 
            className={`btn-filtro ${filtro === cat ? 'ativo' : ''}`}
            onClick={() => setFiltro(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid-3-colunas" key={filtro}>
        {produtosFiltrados.map((produto, index) => (
          <CardProduto key={produto.id} produto={produto} index={index} />
        ))}
      </div>
    </div>
  );
}