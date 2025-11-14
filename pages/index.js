import React, { useState } from 'react';
import Header from '../components/Header';
import styles from '../styles/Home.module.css';

const Home = () => {
  const images = [
    '/imagens/pulseiras.webp',
    '/imagens/aneis.webp',
    '/imagens/brincos.webp',
    '/imagens/pingentes.webp',
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Monta pares: [1,2], [2,3], [3,4], [4,1]
  const pairs = images.map((_, index) => ({
    id: index,
    left: images[index],
    right: images[(index + 1) % images.length],
  }));

  const moveLeft = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? pairs.length - 1 : prevIndex - 1
    );
  };

  const moveRight = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === pairs.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className={styles.container}>
      <Header />

      {/* HERO */}
      <div className={styles.content}>
        <div className={styles.diamanteContainer}>
          <img
            src="/imagens/diamante.png"
            alt="Diamante"
            className={styles.diamante}
          />
        </div>

        <h1 className={styles.title}>JOIAS DE PRATA</h1>

        <div className={styles.description}>
          Descubra a beleza atemporal das nossas joias de prata 925, perfeitas
          para adicionar um toque de elegância ao seu dia a dia.
        </div>
      </div>

      {/* SEÇÃO CATEGORIAS */}
      <div className={styles.categoriesSection}>
        <h2 className={styles.categoriesTitle}>NAVEGUE POR CATEGORIAS</h2>
        <p className={styles.categoriesDescription}>
          Encontre a sua próxima joia de prata
        </p>
      </div>

      {/* CARROSSEL / DESKTOP GRID */}
      <div className={styles.carousel}>
        {/* MOBILE: carrossel com 2 imagens por vez */}
        <div className={styles.carouselMobile}>
          <button className={styles.arrowButton} onClick={moveLeft}>
            <img
              src="/imagens/seta_esquerda.png"
              alt="Seta Esquerda"
              className={styles.arrow}
            />
          </button>

          <div className={styles.carouselWindow}>
            <div
              className={styles.carouselTrack}
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {pairs.map((pair) => (
                <div className={styles.slide} key={pair.id}>
                  <div className={styles.slideImageWrapper}>
                    <img
                      src={pair.left}
                      alt="Joia"
                      className={styles.carouselImg}
                    />
                  </div>
                  <div className={styles.slideImageWrapper}>
                    <img
                      src={pair.right}
                      alt="Joia"
                      className={styles.carouselImg}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button className={styles.arrowButton} onClick={moveRight}>
            <img
              src="/imagens/seta_direita.png"
              alt="Seta Direita"
              className={styles.arrow}
            />
          </button>
        </div>

        {/* DESKTOP: 4 imagens lado a lado */}
        <div className={styles.carouselDesktop}>
          {images.map((src, index) => (
            <div className={styles.desktopImageWrapper} key={index}>
              <img
                src={src}
                alt={`Joia ${index + 1}`}
                className={styles.desktopImg}
              />
            </div>
          ))}
        </div>
      </div>

      <div className={styles.blackBackground}></div>
    </div>
  );
};

export default Home;
