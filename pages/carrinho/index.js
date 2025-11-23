// pages/carrinho/index.js
import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import styles from '../../styles/Carrinho.module.css';
import {
  getCarrinhoApi,
  addItemCarrinhoApi,
  removerItemCarrinhoApi,
  criarPedidoApi,
  calcularFreteMelhorEnvio,
  getUsuarioApi,
  criarPreferenciaPagamentoApi, // 🔹 chamada para Mercado Pago
} from '../../services/api';

const REMETENTE_CEP = '18190-011'; // from fixo (CEP da loja)

const CarrinhoPage = () => {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // frete = valor da opção escolhida
  const [frete, setFrete] = useState('');
  const [freteOpcoes, setFreteOpcoes] = useState([]);
  const [freteSelecionadoId, setFreteSelecionadoId] = useState(null);
  const [loadingFrete, setLoadingFrete] = useState(false);
  const [freteMsg, setFreteMsg] = useState('');
  const [freteErro, setFreteErro] = useState('');

  const [usuarioCep, setUsuarioCep] = useState('');

  // 🔹 Modal de estoque indisponível
  const [showEstoqueModal, setShowEstoqueModal] = useState(false);
  const [estoqueModalMsg, setEstoqueModalMsg] = useState('');

  // 🔹 Modal de imagem ampliada
  const [imagemAmpliada, setImagemAmpliada] = useState(null);

  const carregarCarrinho = async () => {
    try {
      setLoading(true);
      setErrorMsg('');
      setSuccessMsg('');

      const resp = await getCarrinhoApi();
      setProdutos(resp.produtos || []);
    } catch (e) {
      console.error('Erro ao carregar carrinho:', e);
      if (e.status === 401) {
        setErrorMsg('Faça login para visualizar seu carrinho.');
      } else {
        setErrorMsg(e.message || 'Erro ao carregar carrinho.');
      }
    } finally {
      setLoading(false);
    }
  };

  const carregarUsuarioCep = async () => {
    try {
      const usuario = await getUsuarioApi();
      if (usuario && usuario.cep) {
        setUsuarioCep(usuario.cep);
      }
    } catch (e) {
      console.error('Erro ao buscar usuário para CEP:', e);
      // se não tiver login ou CEP, só não permite calcular frete
    }
  };

  useEffect(() => {
    const init = async () => {
      await carregarCarrinho();
      await carregarUsuarioCep();
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatarPreco = (valor) => {
    if (valor == null || valor === '') return '';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(Number(valor));
  };

  const totalProdutos = produtos.reduce((sum, p) => {
    const preco = Number(p.preco || 0);
    const qtd = Number(p.quantidade || 0);
    return sum + preco * qtd;
  }, 0);

  const freteNum = parseFloat(frete || '0') || 0;
  const totalComFrete = totalProdutos + freteNum;

  const handleAumentarQuantidade = async (produto) => {
    try {
      setErrorMsg('');
      setSuccessMsg('');

      await addItemCarrinhoApi({
        produtoId: produto._id,
        quantidade: 1,
      });

      await carregarCarrinho();
    } catch (e) {
      console.error('Erro ao aumentar quantidade:', e);

      // 🔹 Se for erro de estoque indisponível, mostra modal amigável
      if (
        e.status === 400 &&
        typeof e.message === 'string' &&
        e.message.includes('Quantidade indisponível')
      ) {
        setEstoqueModalMsg(
          e.message ||
            'Não temos mais unidades deste produto em estoque no momento.'
        );
        setShowEstoqueModal(true);
      } else {
        setErrorMsg(e.message || 'Erro ao atualizar quantidade.');
      }
    }
  };

  const handleDiminuirQuantidade = async (produto) => {
    try {
      setErrorMsg('');
      setSuccessMsg('');

      await removerItemCarrinhoApi(produto._id);
      await carregarCarrinho();
    } catch (e) {
      console.error('Erro ao diminuir quantidade:', e);
      setErrorMsg(e.message || 'Erro ao atualizar quantidade.');
    }
  };

  // 🔹 Finalizar compra: cria pedido + abre Mercado Pago em nova aba
  const handleFinalizarCompra = async () => {
    try {
      setErrorMsg('');
      setSuccessMsg('');
      setFreteErro('');

      if (!produtos || produtos.length === 0) {
        setErrorMsg('Seu carrinho está vazio.');
        return;
      }

      const freteNumLocal = parseFloat(frete);
      if (isNaN(freteNumLocal) || freteNumLocal <= 0) {
        setFreteErro(
          'Selecione uma opção de frete antes de finalizar a compra.'
        );
        return;
      }

      // 1) Cria o pedido no backend
      const respPedido = await criarPedidoApi({ frete: freteNumLocal });
      const { pedidoId, total } = respPedido;

      setSuccessMsg(
        `Pedido criado com sucesso! Número do pedido: ${pedidoId}`
      );

      // Limpa frete e recarrega carrinho (que deve vir vazio)
      setFrete('');
      setFreteOpcoes([]);
      setFreteSelecionadoId(null);
      await carregarCarrinho();

      // 2) Cria preferência de pagamento no Mercado Pago
      try {
        const pref = await criarPreferenciaPagamentoApi({
          total,
          pedidoId,
        });

        if (pref && pref.initPoint) {
          window.open(pref.initPoint, '_blank'); // abre checkout em nova aba
        }
      } catch (e) {
        console.error('Erro ao criar preferência de pagamento:', e);
        // não derruba a compra, apenas avisa que não conseguiu abrir o pagamento
        setErrorMsg(
          'Pedido criado, mas houve um erro ao abrir o pagamento. Acesse "Meus pedidos" para tentar pagar novamente.'
        );
      }
    } catch (e) {
      console.error('Erro ao finalizar compra:', e);
      if (e.status === 401) {
        setErrorMsg('Faça login para finalizar sua compra.');
      } else {
        setErrorMsg(e.message || 'Erro ao finalizar compra.');
      }
    }
  };

  // 🔹 Calcula dimensões/peso do pacote considerando vários produtos
  const calcularDimensoesPacote = () => {
    let larguraMax = 0;
    let comprimentoMax = 0;
    let alturaTotal = 0;
    let pesoTotal = 0;

    produtos.forEach((p) => {
      const qtd = Number(p.quantidade || 0) || 0;
      const largura = Number(p.largura || 0) || 0;
      const comprimento = Number(p.comprimento || 0) || 0;
      const altura = Number(p.altura || 0) || 0;
      const peso = Number(p.peso || 0) || 0;

      if (largura > larguraMax) larguraMax = largura;
      if (comprimento > comprimentoMax) comprimentoMax = comprimento;
      alturaTotal += altura * qtd;
      pesoTotal += peso * qtd;
    });

    // Valores mínimos de segurança
    if (larguraMax <= 0) larguraMax = 10;
    if (comprimentoMax <= 0) comprimentoMax = 15;
    if (alturaTotal <= 0) alturaTotal = 2;
    if (pesoTotal <= 0) pesoTotal = 0.1;

    return {
      width: larguraMax,
      length: comprimentoMax,
      height: alturaTotal,
      weight: pesoTotal,
    };
  };

  // 🔹 Calcular frete (MelhorEnvio)
  const handleCalcularFrete = async () => {
    try {
      setFreteErro('');
      setFreteMsg('');

      if (!produtos || produtos.length === 0) {
        setFreteErro('Seu carrinho está vazio.');
        return;
      }

      if (!usuarioCep || String(usuarioCep).trim().length < 8) {
        setFreteErro(
          'Cadastre um CEP válido na sua conta para calcular o frete.'
        );
        return;
      }

      const { width, height, length, weight } = calcularDimensoesPacote();

      setLoadingFrete(true);

      const opcoes = await calcularFreteMelhorEnvio({
        from: REMETENTE_CEP,
        to: usuarioCep,
        width,
        height,
        length,
        weight,
        insuranceValue: 0,
      });

      const opcoesValidas = (opcoes || []).filter(
        (opt) => !opt.error && opt.price
      );

      if (!opcoesValidas.length) {
        setFreteOpcoes([]);
        setFreteSelecionadoId(null);
        setFrete('');
        setFreteErro(
          'Nenhuma opção de frete disponível para este endereço no momento.'
        );
        return;
      }

      setFreteOpcoes(opcoesValidas);

      // já seleciona a opção mais barata por padrão
      const opcaoMaisBarata = opcoesValidas.reduce((min, o) =>
        parseFloat(o.price) < parseFloat(min.price) ? o : min
      );

      setFreteSelecionadoId(opcaoMaisBarata.id);
      setFrete(String(opcaoMaisBarata.price || '0'));
      setFreteMsg(
        'Frete calculado. Você pode escolher outra opção se desejar.'
      );
    } catch (e) {
      console.error('Erro ao calcular frete:', e);
      setFreteOpcoes([]);
      setFreteSelecionadoId(null);
      setFrete('');
      setFreteErro(e.message || 'Erro ao calcular frete.');
    } finally {
      setLoadingFrete(false);
    }
  };

  // 🔹 Abrir imagem ampliada
  const abrirImagem = (url) => {
    if (!url) return;
    setImagemAmpliada(url);
  };

  // 🔹 Fechar imagem ampliada
  const fecharImagem = () => {
    setImagemAmpliada(null);
  };

  const finalizarDesabilitado =
    loading || loadingFrete || !produtos.length || freteNum <= 0;

  return (
    <div className={styles.pageContainer}>
      <Header />

      <main className={styles.main}>
        <div className={styles.card}>
          <div className={styles.headerRow}>
            <div>
              <h1 className={styles.title}>Seu carrinho</h1>
              <p className={styles.subtitle}>
                Revise os itens antes de concluir sua compra.
              </p>
            </div>
          </div>

          {loading && (
            <p className={styles.infoText}>Carregando itens do carrinho...</p>
          )}

          {!loading && errorMsg && (
            <p className={styles.errorText}>{errorMsg}</p>
          )}

          {!loading && !errorMsg && produtos.length === 0 && (
            <p className={styles.infoText}>
              Seu carrinho está vazio. Que tal escolher algumas joias? ✨
            </p>
          )}

          {!loading && !errorMsg && produtos.length > 0 && (
            <>
              <section className={styles.itemsSection}>
                {produtos.map((produto) => (
                  <div key={produto._id} className={styles.itemRow}>
                    <div className={styles.itemImageWrapper}>
                      {produto.imagem ? (
                        <img
                          src={produto.imagem}
                          alt={produto.nome}
                          className={styles.itemImage}
                          onClick={() => abrirImagem(produto.imagem)}
                          style={{ cursor: 'pointer' }}
                        />
                      ) : (
                        <div className={styles.itemNoImage}>Sem imagem</div>
                      )}
                    </div>

                    <div className={styles.itemInfo}>
                      <h2 className={styles.itemName}>{produto.nome}</h2>
                      <p className={styles.itemDetails}>
                        {produto.modelo && <span>{produto.modelo} · </span>}
                        {produto.cor && <span>{produto.cor}</span>}
                      </p>

                      <div className={styles.itemBottomRow}>
                        <div className={styles.itemPriceAndQty}>
                          <span className={styles.itemPrice}>
                            {formatarPreco(produto.preco)}
                          </span>

                          <div className={styles.itemQuantityRow}>
                            <button
                              type="button"
                              className={styles.qtyButton}
                              onClick={() =>
                                handleDiminuirQuantidade(produto)
                              }
                            >
                              -
                            </button>
                            <span className={styles.qtyValue}>
                              {produto.quantidade}
                            </span>
                            <button
                              type="button"
                              className={styles.qtyButton}
                              onClick={() =>
                                handleAumentarQuantidade(produto)
                              }
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <div className={styles.itemSubtotalBox}>
                          <span className={styles.itemSubtotalLabel}>
                            Subtotal
                          </span>
                          <span className={styles.itemSubtotalValue}>
                            {formatarPreco(
                              Number(produto.preco || 0) *
                                Number(produto.quantidade || 0)
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </section>

              <section className={styles.summarySection}>
                <div className={styles.summaryBox}>
                  <div className={styles.summaryRow}>
                    <span>Total dos produtos</span>
                    <span>{formatarPreco(totalProdutos)}</span>
                  </div>

                  <div className={styles.summaryRow}>
                    <span>Frete</span>
                    <button
                      type="button"
                      className={styles.calcularFreteButton}
                      onClick={handleCalcularFrete}
                      disabled={loadingFrete || !produtos.length}
                    >
                      {loadingFrete ? 'Calculando...' : 'Calcular frete'}
                    </button>
                  </div>

                  {freteErro && (
                    <p className={styles.errorText}>{freteErro}</p>
                  )}

                  {freteMsg && !freteErro && (
                    <p className={styles.freteMessage}>{freteMsg}</p>
                  )}

                  {/* Opções de frete retornadas pela API */}
                  {freteOpcoes.length > 0 && (
                    <div className={styles.freteOptions}>
                      {freteOpcoes.map((opt) => (
                        <label
                          key={opt.id}
                          className={styles.freteOptionItem}
                        >
                          <input
                            type="radio"
                            name="freteOpcao"
                            value={opt.id}
                            checked={freteSelecionadoId === opt.id}
                            onChange={() => {
                              setFreteSelecionadoId(opt.id);
                              setFrete(String(opt.price || '0'));
                            }}
                          />
                          <div className={styles.freteOptionInfo}>
                            <div className={styles.freteOptionTop}>
                              <span className={styles.freteOptionName}>
                                {opt.company?.name} - {opt.name}
                              </span>
                              <span className={styles.freteOptionPrice}>
                                {formatarPreco(opt.price)}
                              </span>
                            </div>
                            <div className={styles.freteOptionBottom}>
                              <span>
                                Prazo:{' '}
                                {opt.delivery_range
                                  ? `${opt.delivery_range.min} a ${opt.delivery_range.max}`
                                  : opt.delivery_time}{' '}
                                dias úteis
                              </span>
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  )}

                  <div className={styles.summaryRowTotal}>
                    <span>Total com frete</span>
                    <span>{formatarPreco(totalComFrete)}</span>
                  </div>

                  {successMsg && (
                    <p className={styles.successText}>{successMsg}</p>
                  )}

                  {errorMsg && !loading && (
                    <p className={styles.errorText}>{errorMsg}</p>
                  )}

                  <button
                    type="button"
                    className={styles.finishButton}
                    onClick={handleFinalizarCompra}
                    disabled={finalizarDesabilitado}
                  >
                    Finalizar compra
                  </button>
                </div>
              </section>
            </>
          )}
        </div>
      </main>

      <Footer />

      {/* 🔹 Modal de alerta de estoque indisponível */}
      {showEstoqueModal && (
        <div
          className={styles.modalOverlay}
          onClick={() => setShowEstoqueModal(false)}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className={styles.modalCloseButton}
              onClick={() => setShowEstoqueModal(false)}
            >
              ✕
            </button>
            <h3 className={styles.modalTitle}>Quantidade indisponível</h3>
            <p className={styles.modalText}>
              {estoqueModalMsg ||
                'Não temos mais unidades deste produto em estoque no momento.'}
            </p>
          </div>
        </div>
      )}

      {/* 🔹 Modal de imagem ampliada */}
      {imagemAmpliada && (
        <div className={styles.modalOverlay} onClick={fecharImagem}>
          <div
            className={styles.modalImgBox}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className={styles.modalImgClose}
              onClick={fecharImagem}
            >
              ✕
            </button>

            <img
              src={imagemAmpliada}
              alt="Imagem ampliada"
              className={styles.modalImg}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CarrinhoPage;