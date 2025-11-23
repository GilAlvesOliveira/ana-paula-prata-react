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
} from '../../services/api';
import { useRouter } from 'next/router';

const CarrinhoPage = () => {
  const router = useRouter();

  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [frete, setFrete] = useState('');

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
        // Opcional: redirecionar para login
        // router.push('/login');
      } else {
        setErrorMsg(e.message || 'Erro ao carregar carrinho.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarCarrinho();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatarPreco = (valor) => {
    if (valor == null) return '';
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

  const totalComFrete = totalProdutos + (parseFloat(frete || '0') || 0);

  const handleAumentarQuantidade = async (produto) => {
    try {
      await addItemCarrinhoApi({
        produtoId: produto._id,
        quantidade: 1,
      });
      await carregarCarrinho();
    } catch (e) {
      console.error('Erro ao aumentar quantidade:', e);
      setErrorMsg(e.message || 'Erro ao atualizar quantidade.');
    }
  };

  const handleDiminuirQuantidade = async (produto) => {
    try {
      await removerItemCarrinhoApi(produto._id);
      await carregarCarrinho();
    } catch (e) {
      console.error('Erro ao diminuir quantidade:', e);
      setErrorMsg(e.message || 'Erro ao atualizar quantidade.');
    }
  };

  const handleFinalizarCompra = async () => {
    try {
      setErrorMsg('');
      setSuccessMsg('');

      const freteNum = parseFloat(frete);
      if (isNaN(freteNum) || freteNum <= 0) {
        setErrorMsg('Informe um valor de frete válido (maior que zero).');
        return;
      }

      if (!produtos || produtos.length === 0) {
        setErrorMsg('Seu carrinho está vazio.');
        return;
      }

      const resp = await criarPedidoApi({ frete: freteNum });

      setSuccessMsg(
        `Pedido criado com sucesso! Número do pedido: ${resp.pedidoId}`
      );
      setFrete('');
      await carregarCarrinho();
    } catch (e) {
      console.error('Erro ao finalizar compra:', e);
      if (e.status === 401) {
        setErrorMsg('Faça login para finalizar sua compra.');
        // router.push('/login');
      } else {
        setErrorMsg(e.message || 'Erro ao finalizar compra.');
      }
    }
  };

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
                        />
                      ) : (
                        <div className={styles.itemNoImage}>
                          Sem imagem
                        </div>
                      )}
                    </div>

                    <div className={styles.itemInfo}>
                      <h2 className={styles.itemName}>{produto.nome}</h2>
                      <p className={styles.itemDetails}>
                        {produto.modelo && (
                          <span>{produto.modelo} · </span>
                        )}
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
                    <input
                      type="number"
                      className={styles.freteInput}
                      placeholder="0,00"
                      value={frete}
                      onChange={(e) => setFrete(e.target.value)}
                    />
                  </div>

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
    </div>
  );
};

export default CarrinhoPage;