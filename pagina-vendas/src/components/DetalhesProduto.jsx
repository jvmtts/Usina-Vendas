import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaWhatsapp, FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

export default function DetalhesProduto({ produtos = [] }) {
  const { id } = useParams();
  const navigate = useNavigate();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const produto = produtos.find(p => p.id === parseInt(id));

  const [imagemAtiva, setImagemAtiva] = useState(0);
  const [selecoes, setSelecoes] = useState({});
  const [modalZoomAberto, setModalZoomAberto] = useState(false);
  
  const [zoomInterno, setZoomInterno] = useState(false);
  const [posicaoMouse, setPosicaoMouse] = useState({ x: 0, y: 0 });

  if (!produto) {
    return (
      <div className="w-[92%] max-w-[1800px] mx-auto py-10 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Produto não encontrado</h2>
        <button 
          onClick={() => navigate('/')}
          className="bg-transparent text-[#ff7b00] border-2 border-[#ff7b00] py-3 px-6 rounded-full font-bold transition-colors hover:bg-[#ff7b00] hover:text-white cursor-pointer"
        >
          Voltar para a vitrine
        </button>
      </div>
    );
  }

  const formatarPreco = (preco) => {
    if (typeof preco === 'number') {
      return preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }
    return preco || 'R$ 0,00';
  };

  const imagensProduto = produto?.imagens?.length > 0 
    ? produto.imagens 
    : ['https://via.placeholder.com/600x600?text=Sem+Foto'];
  let listaVariacoes = [];
  if (produto.variacoes) {
    if (Array.isArray(produto.variacoes)) {
      listaVariacoes = produto.variacoes;
    } else if (typeof produto.variacoes === 'object') {
      listaVariacoes = Object.entries(produto.variacoes).map(([chave, valores]) => ({
        nome: chave,
        opcoes: Array.isArray(valores) ? valores : [valores]
      }));
    }
  }

  const handleSelecionarOpcao = (nomeVariacao, opcao) => {
    setSelecoes(prev => ({ ...prev, [nomeVariacao]: opcao }));
  };

  const handleMouseMove = (e) => {
    if (!zoomInterno) return;
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;
    setPosicaoMouse({ x, y });
  };

  const irParaProxima = (e) => {
    e.stopPropagation();
    setZoomInterno(false);
    setImagemAtiva((prev) => (prev + 1) % imagensProduto.length);
  };

  const irParaAnterior = (e) => {
    e.stopPropagation();
    setZoomInterno(false);
    setImagemAtiva((prev) => (prev - 1 + imagensProduto.length) % imagensProduto.length);
  };

  const urlWhatsappBase = produto.linkwhatsapp || produto.linkWhatsapp || "https://wa.me/5511999999999";
  const linkFinalWhatsapp = `${urlWhatsappBase}${urlWhatsappBase.includes('?') ? '&' : '?'}text=${encodeURIComponent(`Olá! Tenho interesse no produto: ${produto.nome}`)}`;
  const linkFinalML = produto.linkMercadoLivre || "https://www.mercadolivre.com.br";

  return (
    <>
      <style>{`
        @keyframes fadeUpAnim {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animar-entrada {
          animation: fadeUpAnim 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes fadeInModal {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animar-modal {
          animation: fadeInModal 0.3s ease-out forwards;
        }
        .no-select {
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }
      `}</style>

      <div className="w-[92%] max-w-[1800px] mx-auto py-10 bg-white animar-entrada no-select">
        <button 
          onClick={() => navigate('/')} 
          className="flex items-center gap-2 text-[#ff7b00] text-sm md:text-base font-bold mb-10 hover:-translate-x-2 transition-transform duration-300 bg-transparent border-none cursor-pointer outline-none p-0"
        >
          <FaArrowLeft /> Voltar para Vitrine
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-start">
          <div className="flex flex-col-reverse md:flex-row gap-5 w-full">
            <div className="flex flex-row md:flex-col gap-3 w-full md:w-[120px] overflow-x-auto md:overflow-y-auto max-h-[550px] p-1 scrollbar-hide">
              {imagensProduto.map((img, index) => (
                <div
                  key={index}
                  className={`shrink-0 w-[70px] md:w-full aspect-square rounded-xl cursor-pointer bg-white border-2 flex justify-center items-center overflow-hidden transition-all duration-200 box-border ${
                    imagemAtiva === index ? 'border-[#ff7b00] opacity-100 shadow-sm' : 'border-transparent opacity-60 hover:opacity-100 hover:border-gray-200' 
                  }`}
                  onMouseEnter={() => setImagemAtiva(index)}
                  onClick={() => setImagemAtiva(index)}
                >
                  <img src={img} alt={`${produto.nome} - miniatura ${index + 1}`} className="w-full h-full object-contain p-1" />
                </div>
              ))}
            </div>
            
            <div 
              className="grow w-full aspect-square rounded-2xl border border-gray-100 bg-white flex justify-center items-center overflow-hidden shadow-sm cursor-zoom-in transition-transform duration-300 hover:scale-[1.01]"
              onClick={() => setModalZoomAberto(true)}
            >
              <img src={imagensProduto[imagemAtiva]} alt={produto.nome} className="w-full h-full object-contain p-2" />
            </div>
          </div>

          <div className="flex flex-col">
            <h1 className="text-2xl md:text-3xl lg:text-[2rem] font-extrabold text-gray-900 mb-2 tracking-tight leading-tight">
              {produto.nome}
            </h1>
            
            <p className="text-3xl md:text-4xl lg:text-[2.6rem] font-extrabold text-gray-900 mt-3 mb-8 tracking-tight">
              {formatarPreco(produto.preco)}
            </p>

            {listaVariacoes.length > 0 && (
              <div className="flex flex-col gap-6 mb-10">
                {listaVariacoes.map((variacao, index) => {
                  const selecaoAtual = selecoes[variacao.nome] || variacao.opcoes[0];
                  return (
                    <div key={index}>
                      <p className="text-base md:text-lg text-gray-800 mb-3">
                        <span className="font-bold">{variacao.nome}:</span> {selecaoAtual}
                      </p>
                      <div className="flex gap-3 flex-wrap">
                        {variacao.opcoes.map((opcao, idx) => {
                          const isAtivo = selecaoAtual === opcao;
                          return (
                            <button
                              key={idx}
                              className={`py-2 px-5 md:px-6 rounded-lg cursor-pointer transition-all duration-200 text-sm md:text-base font-bold outline-none shadow-sm active:scale-95 ${
                                isAtivo ? 'border-2 border-[#ff7b00] text-[#ff7b00] bg-[#fff5eb]' : 'border border-gray-300 text-gray-600 bg-white hover:border-[#ff7b00] hover:text-[#ff7b00] hover:bg-gray-50'
                              }`}
                              onClick={() => handleSelecionarOpcao(variacao.nome, opcao)}
                            >
                              {opcao}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="mt-2 flex flex-col gap-4 w-full md:w-[90%]">
              <a href={linkFinalWhatsapp} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full bg-[#1ebd5c] hover:bg-[#18a24e] text-white py-3 md:py-[14px] px-6 rounded-full font-bold text-[1.05rem] cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 no-underline">
                <FaWhatsapp className="text-[1.5rem]" /> Comprar pelo WhatsApp
              </a>
              <a href={linkFinalML} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full bg-transparent text-[#ff7b00] border-2 border-[#ff7b00] py-3 md:py-[12px] px-6 rounded-full font-bold text-[1.05rem] cursor-pointer shadow-sm hover:bg-[#fff5eb] hover:shadow-md hover:-translate-y-1 transition-all duration-300 no-underline">
                <img src="https://http2.mlstatic.com/frontend-assets/ml-web-navigation/ui-navigation/5.21.22/mercadolibre/logo__small@2x.png" alt="Mercado Livre" className="h-7 md:h-8 w-auto object-contain" />
                Comprar no Mercado Livre
              </a>
            </div>
          </div>
        </div>

        <div className="mt-20 pt-12 border-t border-gray-100">
            <h3 className="text-[1.5rem] md:text-[1.8rem] font-extrabold text-[#ff7b00] mb-6 tracking-wide uppercase">Descrição do Produto</h3>
            <p className="text-base md:text-lg text-gray-700 leading-relaxed whitespace-pre-line mb-14">{produto.descricao || 'Nenhuma descrição disponível.'}</p>
            {produto?.fichaTecnica && Object.keys(produto.fichaTecnica).length > 0 && (
                <>
                <h3 className="text-[1.5rem] md:text-[1.8rem] font-extrabold text-[#ff7b00] mb-6 tracking-wide uppercase">Especificações Técnicas</h3>
                <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
                    <table className="w-full border-collapse">
                    <tbody>
                        {Object.entries(produto.fichaTecnica).map(([chave, valor], index) => (
                        <tr key={index} className="even:bg-gray-50 odd:bg-white border-b border-gray-100 last:border-0 hover:bg-gray-100 transition-colors">
                            <td className="p-4 md:p-5 font-bold text-gray-800 w-1/3 md:w-1/4 align-top border-r border-gray-100">{chave}</td>
                            <td className="p-4 md:p-5 text-gray-700 w-2/3 md:w-3/4 leading-relaxed">{valor}</td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
                </>
            )}
        </div>
      </div>

      {modalZoomAberto && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xl animar-modal overflow-hidden no-select"
          onClick={() => { setModalZoomAberto(false); setZoomInterno(false); }}
        >
          <button 
            className="absolute top-4 right-4 md:top-8 md:right-8 text-white/70 hover:text-white text-4xl transition-all z-[70] cursor-pointer p-2 outline-none border-none bg-transparent"
            onClick={() => { setModalZoomAberto(false); setZoomInterno(false); }}
          >
            <FaTimes />
          </button>

          <button className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 text-white/50 hover:text-white text-5xl md:text-6xl transition-all z-[70] cursor-pointer p-2 outline-none border-none bg-transparent" onClick={irParaAnterior}>
            <FaChevronLeft />
          </button>

          <button className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 text-white/50 hover:text-white text-5xl md:text-6xl transition-all z-[70] cursor-pointer p-2 outline-none border-none bg-transparent" onClick={irParaProxima}>
            <FaChevronRight />
          </button>

          <div 
            className={`relative w-full h-full max-h-[85vh] max-w-[90vw] flex justify-center items-center overflow-hidden transition-all duration-300 p-4 md:p-0 ${zoomInterno ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
            onMouseMove={handleMouseMove}
            onClick={(e) => { e.stopPropagation(); setZoomInterno(!zoomInterno); }}
          >
            <img 
              src={imagensProduto[imagemAtiva]} 
              alt={produto.nome} 
              className="max-h-full max-w-full object-contain transition-transform duration-200 ease-out pointer-events-none drop-shadow-2xl"
              style={{
                transform: zoomInterno ? 'scale(1.5)' : 'scale(1)',
                transformOrigin: `${posicaoMouse.x}% ${posicaoMouse.y}%`
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}