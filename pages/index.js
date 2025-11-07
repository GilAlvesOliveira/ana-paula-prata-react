import Header from '../components/Header'
import Footer from '../components/Footer'
import styles from '../styles/Home.module.css'
import { useState } from 'react'

export default function Home() {
  const [centerImage, setCenterImage] = useState('roupas.jpeg'); // Estado para a imagem central

  const handleClick = (imageName) => {
    setCenterImage(imageName); // Muda a imagem central ao clicar
  }

  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        <h1 className={styles.title}>Bem-vindo à nossa loja</h1>
        <p className={styles.description}>
          Encontre as joias de prata mais exclusivas e elegantes para você.
        </p>
      </main>

      <div className={styles.imageContainer}>
        <div className={styles.imageWrapper}>
          <img
            src="/imagens/roupas.jpeg"
            alt="Roupas"
            className={centerImage === 'roupas.jpeg' ? styles.centerImage : styles.sideImage}
            onClick={() => handleClick('roupas.jpeg')}
          />
          <div className={styles.imageText}>Roupas</div>
        </div>
        
        <div className={styles.imageWrapper}>
          <img
            src="/imagens/prata.jpeg"
            alt="Prata"
            className={centerImage === 'prata.jpeg' ? styles.centerImage : styles.sideImage}
            onClick={() => handleClick('prata.jpeg')}
          />
          <div className={styles.imageText}>Joias</div>
        </div>
        
        <div className={styles.imageWrapper}>
          <img
            src="/imagens/roupas_joias.jpeg"
            alt="Roupas + Joias"
            className={centerImage === 'roupas_joias.jpeg' ? styles.centerImage : styles.sideImage}
            onClick={() => handleClick('roupas_joias.jpeg')}
          />
          <div className={styles.imageText}>Roupas + Joias</div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
