// pages/minhas-compras.js
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import styles from '../styles/MinhasCompras.module.css';

export default function MinhasComprasPage() {
  return (
    <div className={styles.pageContainer}>
      <Header />

      <main className={styles.main}>
        <div className={styles.card}>
          <h1 className={styles.title}>Minhas Compras</h1>
          <p className={styles.text}>
            Em breve você poderá visualizar aqui o histórico das suas compras.
          </p>
          <p className={styles.text}>
            Por enquanto, esta área ainda está em desenvolvimento. 💎
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}