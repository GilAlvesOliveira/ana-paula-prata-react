import Header from '../components/Header'
import Footer from '../components/Footer'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        <h1 className={styles.title}>Bem-vindo à nossa loja</h1>
        <p className={styles.description}>
          Encontre as joias de prata mais exclusivas e elegantes para você.
        </p>
        <button className={styles.shopButton}>Comece a Comprar</button>
      </main>
      <Footer /> {/* Incluindo o Footer aqui */}
    </div>
  )
}
