// pages/sucesso.js
import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import Footer from '../components/Footer';
import styles from '../styles/PagamentoStatus.module.css';

const SucessoPage = () => {
  const router = useRouter();
  const { pedido } = router.query;

  useEffect(() => {
    if (!pedido) return;

    try {
      const stored = localStorage.getItem('pedidoPendente');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && String(parsed.pedidoId) === String(pedido)) {
          localStorage.removeItem('pedidoPendente');
        }
      }
    } catch (e) {
      console.error('Erro ao limpar pedido pendente:', e);
    }
  }, [pedido]);

  return (
    <div className={styles.pageContainer}>
      <Header />

      <main className={styles.main}>
        <div className={styles.card}>
          <h1 className={styles.title}>Pagamento aprovado 🎉</h1>
          <p className={styles.subtitle}>
            Seu pagamento foi aprovado com sucesso.
          </p>

          {pedido && (
            <p className={styles.info}>
              Número do pedido: <strong>{pedido}</strong>
            </p>
          )}

          <button
            type="button"
            className={styles.buttonPrimary}
            onClick={() => router.push('/minhas-compras')}
          >
            Ver meus pedidos
          </button>

          <button
            type="button"
            className={styles.buttonSecondary}
            onClick={() => router.push('/')}
          >
            Voltar para a loja
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SucessoPage;