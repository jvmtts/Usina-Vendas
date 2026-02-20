import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { produtos } from '../data/produtos';

export default function DetalhesProduto() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const produto = produtos.find(p => p.id === parseInt(id));

  if (!produto) return <h2>Produto não encontrado</h2>;

  const [cor, setCor] = useState(produto.variacoes?.cores[0] || '');
  const [tamanho, setTamanho] = useState(produto.variacoes?.tamanhos[0] || '');
  const [imagemAtiva, setImagemAtiva] = useState(produto.imagens[0]);

  return (
    <div className="pagina-branca">
      <button className="btn-voltar" onClick={() => navigate('/')}>
        ← Voltar para Vitrine
      </button>
      
      <div className="detalhes-layout">
        <div className="galeria-container">
          <div className="galeria-miniaturas">
            {produto.imagens.map((img, index) => (
              <img 
                key={index}
                src={img} 
                alt={`${produto.nome} ângulo ${index + 1}`}
                className={`miniatura ${imagemAtiva === img ? 'ativa' : ''}`}
                onMouseEnter={() => setImagemAtiva(img)}
                onClick={() => setImagemAtiva(img)}
              />
            ))}
          </div>
          <div className="galeria-destaque">
            <img src={imagemAtiva} alt={produto.nome} />
          </div>
        </div>
        
        <div className="detalhes-info">
          <h2>{produto.nome}</h2>
          <p className="preco-grande">{produto.preco}</p>

          <div className="variacoes-box">
            <p><strong>Cor:</strong> {cor}</p>
            <div className="btn-group">
              {produto.variacoes?.cores.map(c => (
                <button key={c} className={`btn-opcao ${cor === c ? 'ativo' : ''}`} onClick={() => setCor(c)}>{c}</button>
              ))}
            </div>

            <p><strong>Tamanho:</strong> {tamanho}</p>
            <div className="btn-group">
              {produto.variacoes?.tamanhos.map(t => (
                <button key={t} className={`btn-opcao ${tamanho === t ? 'ativo' : ''}`} onClick={() => setTamanho(t)}>{t}</button>
              ))}
            </div>
          </div>

          <div className="botoes-compra">
            <a href={produto.linkWhatsapp} target="_blank" rel="noreferrer" className="btn-verde btn-full">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 16 16">
                <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
              </svg>
              Comprar pelo WhatsApp
            </a>
            <a href={produto.linkMercadoLivre} target="_blank" rel="noreferrer" className="btn-contorno btn-full">
              <img 
                src="https://http2.mlstatic.com/frontend-assets/ml-web-navigation/ui-navigation/5.21.22/mercadolibre/logo__small@2x.png" 
                alt="Mercado Livre" 
                width="40" 
                style={{ objectFit: 'contain' }}
              />
              Comprar no Mercado Livre
            </a>
          </div>
        </div>
      </div>

      <div className="secao-extra-produto">
        <h3 className="titulo-secao">Descrição Geral</h3>
        <div className="texto-descricao">
          {produto.descricao}
        </div>

        {produto.fichaTecnica && (
          <>
            <h3 className="titulo-secao">Ficha técnica</h3>
            <table className="tabela-ficha">
              <tbody>
                {Object.entries(produto.fichaTecnica).map(([chave, valor]) => (
                  <tr key={chave}>
                    <td className="coluna-chave">{chave}</td>
                    <td className="coluna-valor">{valor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
}