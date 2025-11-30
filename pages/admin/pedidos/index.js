// pages/admin/pedidos/index.js
import React, { useEffect, useState } from 'react';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import styles from '../../../styles/MeusPedidos.module.css';
import {
  listarPedidosApi,
  atualizarEnvioPedidoApi,
} from '../../../services/api';

const AdminPedidosPage = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [infoMsg, setInfoMsg] = useState('');
  const [loadingEnvio, setLoadingEnvio] = useState(null);

  const [imagemAmpliada, setImagemAmpliada] = useState(null);

  const carregarPedidos = async () => {
    try {
      setLoading(true);
      setErro('');
      setInfoMsg('');

      const data = await listarPedidosApi();
      setPedidos(data || []);

      if (!data || data.length === 0) {
        setInfoMsg('Nenhum pedido encontrado.');
      }
    } catch (e) {
      console.error('Erro ao listar pedidos (admin):', e);
      if (e.status === 401) {
        setErro('Faça login como administrador para visualizar os pedidos.');
      } else if (e.status === 403) {
        setErro('Acesso negado. Esta área é exclusiva para administradores.');
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

  const abrirImagem = (url) => {
    if (!url) return;
    setImagemAmpliada(url);
  };

  const fecharImagem = () => {
    setImagemAmpliada(null);
  };

  const handleToggleEnvio = async (pedido) => {
    if (String(pedido.status || '').toLowerCase() !== 'aprovado') return;

    const novoValor = !pedido.enviado;

    try {
      setErro('');
      setInfoMsg('');
      setLoadingEnvio(pedido._id);

      await atualizarEnvioPedidoApi({
        pedidoId: pedido._id,
        enviado: novoValor,
      });

      setPedidos((prev) =>
        prev.map((p) =>
          p._id === pedido._id
            ? {
                ...p,
                enviado: novoValor,
                enviadoEm: novoValor ? new Date().toISOString() : null,
              }
            : p
        )
      );
    } catch (e) {
      console.error('Erro ao atualizar envio:', e);
      setErro(e.message || 'Erro ao atualizar status de envio.');
    } finally {
      setLoadingEnvio(null);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <Header />

      <main className={styles.main}>
        <div className={styles.card}>
          <div className={styles.headerRow}>
            <div>
              <h1 className={styles.title}>Pedidos (Admin)</h1>
              <p className={styles.subtitle}>
                Visualize todos os pedidos e controle o envio para os clientes.
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
                    {/* Lado esquerdo */}
                    <div>
                      <span className={styles.pedidoId}>
                        Pedido #{pedido._id}
                      </span>
                      <span className={styles.pedidoData}>
                        Criado em: {formatarData(pedido.criadoEm)}
                      </span>

                      {/* Informações do cliente */}
                      <div className={styles.clienteInfo}>
                        <span className={styles.clienteNome}>
                          Cliente:{' '}
                          {pedido.usuarioInfo?.nome ||
                            'Nome não disponível'}
                        </span>

                        {pedido.usuarioInfo?.email && (
                          <span className={styles.clienteContato}>
                            E-mail: {pedido.usuarioInfo.email}
                          </span>
                        )}

                        {pedido.usuarioInfo?.telefone && (
                          <span className={styles.clienteContato}>
                            Telefone: {pedido.usuarioInfo.telefone}
                          </span>
                        )}

                        {pedido.usuarioInfo?.endereco && (
                          <span className={styles.clienteContato}>
                            Endereço: {pedido.usuarioInfo.endereco}
                          </span>
                        )}

                        {pedido.usuarioInfo?.cep && (
                          <span className={styles.clienteContato}>
                            CEP: {pedido.usuarioInfo.cep}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Status + envio */}
                    <div className={styles.pedidoStatusArea}>
                      <span
                        className={`${styles.pedidoStatus} ${getStatusLabelClass(
                          pedido.status
                        )}`}
                      >
                        {String(pedido.status || '').toUpperCase()}
                      </span>

                      <div className={styles.envioArea}>
                        {String(pedido.status || '').toLowerCase() !==
                        'aprovado' ? (
                          <span className={styles.envioStatusText}>
                            Aguardando pagamento para liberar envio.
                          </span>
                        ) : (
                          <>
                            <label className={styles.envioToggle}>
                              <input
                                type="checkbox"
                                className={styles.envioCheckbox}
                                checked={!!pedido.enviado}
                                onChange={() => handleToggleEnvio(pedido)}
                                disabled={loadingEnvio === pedido._id}
                              />
                              {pedido.enviado
                                ? 'Pedido enviado'
                                : 'Pedido aguardando envio'}
                            </label>

                            {pedido.enviado && pedido.enviadoEm && (
                              <span className={styles.envioStatusText}>
                                Enviado em {formatarData(pedido.enviadoEm)}
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Produtos */}
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

                  {/* Resumo */}
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
                </div>
              ))}
            </section>
          )}
        </div>
      </main>

      <Footer />

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

export default AdminPedidosPage;