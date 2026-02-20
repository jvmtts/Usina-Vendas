import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function CardProduto({ produto, index }) {
  const navigate = useNavigate();

  return (
    <div className="card" style={{ animationDelay: `${index * 0.1}s` }}>
      <img src={produto.imagem} alt={produto.nome} className="card-img" />
      <div className="card-info">
        <h3>{produto.nome}</h3>
        <p className="preco">{produto.preco}</p>
        <button className="btn-laranja" onClick={() => navigate(`/produto/${produto.id}`)}>
          Ver Detalhes
        </button>
      </div>
    </div>
  );
}