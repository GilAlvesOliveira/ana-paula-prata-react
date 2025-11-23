// pages/meus-pedidos/index.js
import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import styles from '../../styles/MeusPedidos.module.css';
import { listarPedidosApi, gerarPreferenciaPagamentoApi } from '../../services/api';
import { useRouter } from 'next/router';

const MeusPedidosPage = () => {
  const router = useRouter();

  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [infoMsg, setInfoMsg] = useState('');
  const [loadingPagamento, setLoadingPagamento] = useState(null); // guarda id do pedido em pagamento

  // Modal de imagem ampliada
  const [imagemAmpliada, setImagemAmpliada] = useState(null);

  const carregarPedidos = async () => {
    try {
      setLoading(true);
      setErro('');
      setInfoMsg('');

      const data = await listarPedidosApi();
      setPedidos(data || []);
      if (!data || data.length === 0) {
        setInfoMsg('Você ainda não possui pedidos cadastrados.');
      }
    } catch (e) {
      console.error('Erro ao listar pedidos:', e);
      if (e.status === 401) {
        setErro('Faça login para visualizar seus pedidos.');
      } else {
        setErro(e.message || 'Erro ao carregar pedidos.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarPedidos();
  }, []);

  const formatarMoeda = (valor) => {
    if (valor == null || valor === '') return '';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(Number(valor));
  };

  const formatarData = (dataStr) => {
    if (!dataStr) return '';
    const d = new Date(dataStr);
    return d.toLocaleString('pt-BR');
  };

  const getStatusLabelClass = (status) => {
    const s = String(status || '').toLowerCase();
    if (s === 'aprovado') return styles.statusAprovado;
    if (s === 'cancelado') return styles.statusCancelado;
    return styles.statusPendente;
  };

  const handlePagarPedido = async (pedido) => {
    try {
      setErro('');
      setInfoMsg('');
      setLoadingPagamento(pedido._id);

      const resp = await gerarPreferenciaPagamentoApi({
        pedidoId: pedido._id,
        total: pedido.total,
      });

      if (resp && resp.initPoint) {
        window.open(resp.initPoint, '_blank');
        setInfoMsg('Janela de pagamento aberta. Após o pagamento, o status será atualizado automaticamente.');
      } else {
        setErro('Não foi possível gerar o link de pagamento.');
      }
    } catch (e) {
      console.error('Erro ao gerar pagamento:', e);
      setErro(e.message || 'Erro ao gerar pagamento.');
    } finally {
      setLoadingPagamento(null);
    }
  };

  const abrirImagem = (url) => {
    if (!url) return;
    setImagemAmpliada(url);
  };

  const fecharImagem = () => {
    setImagemAmpliada(null);
  };

  return (
    <div className={styles.pageContainer}>
      <Header />

      <main className={styles.main}>
        <div className={styles.card}>
          <div className={styles.headerRow}>
            <div>
              <h1 className={styles.title}>Meus pedidos</h1>
              <p className={styles.subtitle}>
                Aqui você acompanha o status dos seus pedidos e pagamentos.
              </p>
            </div>

            <button
              type="button"
              className={styles.refreshButton}
              onClick={carregarPedidos}
              disabled={loading}
            >
              {loading ? 'Atualizando...' : 'Atualizar'}
            </button>
          </div>

          {erro && <p className={styles.errorText}>{erro}</p>}
          {infoMsg && !erro && <p className={styles.infoText}>{infoMsg}</p>}

          {!loading && !erro && pedidos.length > 0 && (
            <section className={styles.pedidosList}>
              {pedidos.map((pedido) => (
                <div key={pedido._id} className={styles.pedidoCard}>
                  <div className={styles.pedidoHeader}>
                    <div>
                      <span className={styles.pedidoId}>
                        Pedido #{pedido._id}
                      </span>
                      <span className={styles.pedidoData}>
                        Criado em: {formatarData(pedido.criadoEm)}
                      </span>
                    </div>

                    <div className={styles.pedidoStatusArea}>
                      <span
                        className={`${styles.pedidoStatus} ${getStatusLabelClass(
                          pedido.status
                        )}`}
                      >
                        {String(pedido.status || '').toUpperCase()}
                      </span>
                      {pedido.enviado && (
                        <span className={styles.enviadoTag}>
                          Enviado em {formatarData(pedido.enviadoEm)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Produtos do pedido */}
                  <div className={styles.produtosSection}>
                    {pedido.produtos && pedido.produtos.length > 0 ? (
                      pedido.produtos.map((item, idx) => (
                        <div key={idx} className={styles.produtoRow}>
                          <div className={styles.produtoImagemWrapper}>
                            {item.imagem ? (
                              <img
                                src={item.imagem}
                                alt={item.nome || 'Produto'}
                                className={styles.produtoImagem}
                                onClick={() => abrirImagem(item.imagem)}
                                style={{ cursor: 'pointer' }}
                              />
                            ) : (
                              <div className={styles.produtoSemImagem}>
                                Sem imagem
                              </div>
                            )}
                          </div>

                          <div className={styles.produtoInfo}>
                            <div className={styles.produtoTituloLinha}>
                              <span className={styles.produtoNome}>
                                {item.nome || 'Produto'}
                              </span>
                              {item.modelo && (
                                <span className={styles.produtoModelo}>
                                  {item.modelo}
                                </span>
                              )}
                            </div>

                            {item.cor && (
                              <span className={styles.produtoCor}>
                                Cor: {item.cor}
                              </span>
                            )}

                            <div className={styles.produtoBottomRow}>
                              <div className={styles.produtoQtdPreco}>
                                <span className={styles.produtoQtd}>
                                  Qtde: {item.quantidade}
                                </span>
                                <span className={styles.produtoPrecoUnit}>
                                  {formatarMoeda(item.precoUnitario)}
                                </span>
                              </div>
                              <div className={styles.produtoSubtotal}>
                                <span>Subtotal</span>
                                <strong>
                                  {formatarMoeda(
                                    Number(item.precoUnitario || 0) *
                                      Number(item.quantidade || 0)
                                  )}
                                </strong>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className={styles.infoText}>
                        Nenhum item associado a este pedido.
                      </p>
                    )}
                  </div>

                  {/* Resumo financeiro do pedido */}
                  <div className={styles.pedidoResumo}>
                    <div className={styles.resumoLinha}>
                      <span>Valor dos produtos</span>
                      <span>
                        {formatarMoeda(
                          Number(pedido.total || 0) -
                            Number(pedido.frete || 0)
                        )}
                      </span>
                    </div>

                    <div className={styles.resumoLinha}>
                      <span>Frete</span>
                      <span>{formatarMoeda(pedido.frete || 0)}</span>
                    </div>

                    <div className={styles.resumoTotalLinha}>
                      <span>Total</span>
                      <span>{formatarMoeda(pedido.total || 0)}</span>
                    </div>
                  </div>

                  {/* Ações de pagamento conforme status */}
                  <div className={styles.pedidoAcoes}>
                    {String(pedido.status).toLowerCase() === 'pendente' && (
                      <>
                        <span className={styles.pendenteAviso}>
                          Pagamento pendente. Caso não seja realizado em até 24h,
                          o pedido será cancelado automaticamente.
                        </span>
                        <button
                          type="button"
                          className={styles.pagarButton}
                          onClick={() => handlePagarPedido(pedido)}
                          disabled={loadingPagamento === pedido._id}
                        >
                          {loadingPagamento === pedido._id
                            ? 'Abrindo pagamento...'
                            : 'Pagar agora'}
                        </button>
                      </>
                    )}

                    {String(pedido.status).toLowerCase() === 'aprovado' && (
                      <span className={styles.statusInfoOk}>
                        Pagamento confirmado. Seu pedido está em processamento.
                      </span>
                    )}

                    {String(pedido.status).toLowerCase() === 'cancelado' && (
                      <span className={styles.statusInfoCancelado}>
                        Pedido cancelado. Caso deseje, faça uma nova compra.
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </section>
          )}
        </div>
      </main>

      <Footer />

      {/* Modal de imagem ampliada */}
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

export default MeusPedidosPage;