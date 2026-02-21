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
    <div className="card" onClick={handleClick}>
      <div className="card-imagem-container">
        <img src={imagemPrincipal} alt={produto.nome} />
      </div>
      
      <div className="card-info">
        <p className="categoria">{Array.isArray(produto.categoria) ? produto.categoria[0] : produto.categoria}</p>
        <h3>{produto.nome}</h3>
        <p className="preco">{formatarPreco(produto.preco)}</p>
        <button className="btn-detalhes">Ver detalhes</button>
      </div>
    </div>
  );
}