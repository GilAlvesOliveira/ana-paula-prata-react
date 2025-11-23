// pages/falha.js
import React from 'react';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import Footer from '../components/Footer';
import styles from '../styles/PagamentoStatus.module.css';

const FalhaPage = () => {
  const router = useRouter();
  const { pedido } = router.query;

  return (
    <div className={styles.pageContainer}>
      <Header />

      <main className={styles.main}>
        <div className={styles.card}>
          <h1 className={styles.title}>Pagamento não aprovado ❌</h1>
          <p className={styles.subtitle}>
            Houve um problema ao processar o pagamento. Você pode tentar novamente.
          </p>

          {pedido && (
            <p className={styles.info}>
              Número do pedido: <strong>{pedido}</strong>
            </p>
          )}

          <button
            type="button"
            className={styles.buttonPrimary}
            onClick={() => router.push('/carrinho')}
          >
            Voltar para o carrinho
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FalhaPage;