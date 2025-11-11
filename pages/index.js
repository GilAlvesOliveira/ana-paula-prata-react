import React, { useState } from 'react';
import Header from '../components/Header'; // Supondo que Header.js esteja na pasta 'components'
import styles from '../styles/Home.module.css'; // Caminho correto para o arquivo CSS

const Home = () => {
  // Array de imagens (Agora com os nomes das imagens que você forneceu)
  const images = [
    '/imagens/pulseiras.webp',  // Imagem de pulseiras
    '/imagens/aneis.webp',     // Imagem de anéis
    '/imagens/brincos.webp',   // Imagem de brincos
    '/imagens/pingentes.webp', // Imagem de pingentes
  ];

  // Estado para controlar o índice da imagem visível
  const [currentIndex, setCurrentIndex] = useState(0);

  // Função para mover para a imagem da esquerda
  const moveLeft = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  // Função para mover para a imagem da direita
  const moveRight = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className={styles.container}>
      {/* Componente Header */}
      <Header />

      {/* Div com Diamante, Título e Descrição */}
        
      <div className={styles.content}>
        <div className={styles.diamanteContainer}>
          <img src="/imagens/diamante.png" alt="Diamante" className={styles.diamante} />
        </div>
        
        <h1 className={styles.title}>JOIAS DE PRATA</h1>


        <div className={styles.description}>
          Descubra a beleza atemporal das nossas joias de prata 925, perfeitas para adicionar um toque de elegância ao seu dia a dia.
        </div>
      </div>

      {/* Nova seção: NAVEGUE POR CATEGORIAS */}
      <div className={styles.categoriesSection}>
        <h2 className={styles.categoriesTitle}>NAVEGUE POR CATEGORIAS</h2>
        <p className={styles.categoriesDescription}>Encontre a sua próxima joia de prata</p>
      </div>

      {/* Carousel de Imagens */}
      <div className={styles.carousel}>
        {/* Botão de seta para esquerda */}
        <button className={styles.arrowButton} onClick={moveLeft}>
          <img src="/imagens/seta_esquerda.png" alt="Seta Esquerda" className={styles.arrow} />
        </button>

        {/* Container com as imagens lado a lado */}
        <div className={styles.carouselImages}>
          {/* Imagem atual no carousel */}
          <img src={images[currentIndex]} alt="Joia" className={styles.carouselImg} />
          <img src={images[(currentIndex + 1) % images.length]} alt="Joia" className={styles.carouselImg} />
        </div>

        {/* Botão de seta para direita */}
        <button className={styles.arrowButton} onClick={moveRight}>
          <img src="/imagens/seta_direita.png" alt="Seta Direita" className={styles.arrow} />
        </button>
      </div>

      {/* Área abaixo com fundo preto */}
      <div className={styles.blackBackground}>
        {/* Aqui você pode adicionar mais conteúdo, se necessário */}
      </div>
    </div>
  );
};

export default Home;
