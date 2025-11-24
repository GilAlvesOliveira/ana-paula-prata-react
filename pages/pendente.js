// pages/pendente.js
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import Footer from '../components/Footer';
import styles from '../styles/StatusPagamento.module.css';
import { listarPedidosApi } from '../services/api';

const PendentePage = () => {
  const router = useRouter();
  const { pedido: pedidoId } = router.query;

  const [pedido, setPedido] = useState(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  // formata moeda
  const formatarPreco = (valor) => {
    if (valor == null || valor === '') return '';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(Number(valor));
  };

  useEffect(() => {
    if (!pedidoId) return;

    let intervalId;

    const carregarPedido = async () => {
      try {
        setErro('');
        setLoading(true);

        const lista = await listarPedidosApi();
        const encontrado = (lista || []).find(
          (p) => String(p._id) === String(pedidoId)
        );

        if (!encontrado) {
          setErro('Pedido não encontrado.');
          setLoading(false);
          return;
        }

        setPedido(encontrado);

        // Se o status mudou, redireciona
        const status = String(encontrado.status || '').toLowerCase();

        if (status === 'aprovado') {
          router.replace(`/sucesso?pedido=${encodeURIComponent(pedidoId)}`);
          return;
        }

        if (status === 'cancelado') {
          router.replace(`/falha?pedido=${encodeURIComponent(pedidoId)}`);
          return;
        }

        setLoading(false);
      } catch (e) {
        console.error('Erro ao carregar pedido:', e);
        setErro(
          e?.message ||
            'Erro ao carregar o status do pagamento. Tente novamente mais tarde.'
        );
        setLoading(false);
      }
    };

    // primeira carga imediata
    carregarPedido();

    // polling a cada 1 minuto
    intervalId = setInterval(carregarPedido, 60 * 1000);

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [pedidoId, router]);

  const handleVerPedidos = () => {
    router.push('/meus-pedidos');
  };

  const handleVoltarLoja = () => {
    router.push('/');
  };

  const totalComFrete =
    (pedido?.total ?? 0); // backend já soma produtos + frete

  return (
    <div className={styles.pageContainer}>
      <Header />

      <main className={styles.main}>
        <div className={styles.card}>
          <div className={styles.headerRow}>
            <div className={`${styles.iconCircle} ${styles.iconPending}`}>
              ⏳
            </div>
            <div>
              <h1 className={styles.title}>Pagamento pendente</h1>
              <p className={styles.subtitle}>
                Estamos aguardando a confirmação do seu pagamento pelo Mercado Pago.
              </p>
            </div>
          </div>

          <p className={`${styles.statusText} ${styles.pendingText}`}>
            Assim que o pagamento for aprovado, o status do pedido será atualizado
            automaticamente. Esta página verifica o status a cada 1 minuto.
          </p>

          {erro && <p className={styles.errorText}>{erro}</p>}

          {loading && !erro && (
            <p className={styles.infoText}>Atualizando status do pedido...</p>
          )}

          {pedido && (
            <div className={styles.infoBox}>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Número do pedido</span>
                <span className={`${styles.infoValue} ${styles.highlight}`}>
                  {pedido._id}
                </span>
              </div>

              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Status atual</span>
                <span
                  className={`${styles.statusTag} ${styles.statusTagPending}`}
                >
                  ● Pendente
                </span>
              </div>

              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Produtos + Frete</span>
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
              Voltar para a loja
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PendentePage;