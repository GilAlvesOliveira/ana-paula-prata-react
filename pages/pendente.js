// pages/pendente.js
import React from 'react';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import Footer from '../components/Footer';
import styles from '../styles/PagamentoStatus.module.css';

const PendentePage = () => {
  const router = useRouter();
  const { pedido } = router.query;

  return (
    <div className={styles.pageContainer}>
      <Header />

      <main className={styles.main}>
        <div className={styles.card}>
          <h1 className={styles.title}>Pagamento pendente ⏳</h1>
          <p className={styles.subtitle}>
            Seu pagamento ainda está em análise ou aguardando confirmação.
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
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PendentePage;