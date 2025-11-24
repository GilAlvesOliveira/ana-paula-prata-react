// pages/sucesso.js
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import Footer from '../components/Footer';
import styles from '../styles/StatusPagamento.module.css';
import { listarPedidosApi } from '../services/api';

const SucessoPage = () => {
  const router = useRouter();
  const { pedido: pedidoId } = router.query;

  const [pedido, setPedido] = useState(null);
  const [erro, setErro] = useState('');

  const formatarPreco = (valor) => {
    if (valor == null || valor === '') return '';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(Number(valor));
  };

  useEffect(() => {
    if (!pedidoId) return;

    const carregarPedido = async () => {
      try {
        setErro('');
        const lista = await listarPedidosApi();
        const encontrado = (lista || []).find(
          (p) => String(p._id) === String(pedidoId)
        );

        if (!encontrado) {
          setErro('Pedido não encontrado.');
          return;
        }

        setPedido(encontrado);
      } catch (e) {
        console.error('Erro ao buscar pedido:', e);
        setErro(
          e?.message ||
            'Erro ao carregar informações do pedido. Tente novamente mais tarde.'
        );
      }
    };

    carregarPedido();
  }, [pedidoId]);

  const handleVerPedidos = () => {
    router.push('/meus-pedidos');
  };

  const handleVoltarLoja = () => {
    router.push('/');
  };

  const totalComFrete = pedido?.total ?? 0;

  return (
    <div className={styles.pageContainer}>
      <Header />

      <main className={styles.main}>
        <div className={styles.card}>
          <div className={styles.headerRow}>
            <div className={`${styles.iconCircle} ${styles.iconSuccess}`}>
              ✓
            </div>
            <div>
              <h1 className={styles.title}>Pagamento aprovado</h1>
              <p className={styles.subtitle}>
                Seu pedido foi confirmado e está em processamento.
              </p>
            </div>
          </div>

          <p className={`${styles.statusText} ${styles.successText}`}>
            Obrigado pela sua compra! Você receberá atualizações por e-mail
            sobre o andamento do pedido.
          </p>

          {erro && <p className={styles.errorText}>{erro}</p>}

          {pedido && (
            <div className={styles.infoBox}>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Número do pedido</span>
                <span className={`${styles.infoValue} ${styles.highlight}`}>
                  {pedido._id}
                </span>
              </div>

              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Status</span>
                <span
                  className={`${styles.statusTag} ${styles.statusTagSuccess}`}
                >
                  ● Aprovado
                </span>
              </div>

              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Total (produtos + frete)</span>
                <span className={styles.infoValue}>
                  {formatarPreco(totalComFrete)}
                </span>
              </div>

              {typeof pedido.frete === 'number' && (
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Frete</span>
                  <span className={styles.infoValue}>
                    {formatarPreco(pedido.frete)}
                  </span>
                </div>
              )}
            </div>
          )}

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.primaryButton}
              onClick={handleVerPedidos}
            >
              Ver meus pedidos
            </button>
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={handleVoltarLoja}
            >
              Continuar comprando
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SucessoPage;