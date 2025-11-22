import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import Footer from '../components/Footer';
import styles from '../styles/Home.module.css';
import { getUser } from '../services/storage';

const Home = () => {
  const router = useRouter();

  const categories = [
    { id: 0, src: '/imagens/pulseiras.webp', label: 'PULSEIRAS' },
    { id: 1, src: '/imagens/aneis.webp', label: 'ANÉIS' },
    { id: 2, src: '/imagens/brincos.webp', label: 'BRINCOS' },
    { id: 3, src: '/imagens/pingentes.webp', label: 'PINGENTES' },
  ];

  // Pares: [1,2], [2,3], [3,4], [4,1]
  const pairs = categories.map((_, index) => ({
    id: index,
    left: categories[index],
    right: categories[(index + 1) % categories.length],
  }));

  // Array estendido para carrossel infinito: [último, ...pares, primeiro]
  const extendedPairs = [
    pairs[pairs.length - 1],
    ...pairs,
    pairs[0],
  ];

  const [currentIndex, setCurrentIndex] = useState(1);
  const [isTransitionEnabled, setIsTransitionEnabled] = useState(true);

  const [precisaCompletarCadastro, setPrecisaCompletarCadastro] = useState(false);

  useEffect(() => {
    const usuario = getUser();
    if (usuario) {
      const faltandoDados =
        !usuario.telefone || !usuario.endereco || !usuario.cep;

      setPrecisaCompletarCadastro(faltandoDados);
    } else {
      setPrecisaCompletarCadastro(false);
    }
  }, []);

  const moveRight = () => {
    setIsTransitionEnabled(true);
    setCurrentIndex((prevIndex) => prevIndex + 1);
  };

  const moveLeft = () => {
    setIsTransitionEnabled(true);
    setCurrentIndex((prevIndex) => prevIndex - 1);
  };

  const handleTransitionEnd = () => {
    if (currentIndex === extendedPairs.length - 1) {
      setIsTransitionEnabled(false);
      setCurrentIndex(1);
    }
    if (currentIndex === 0) {
      setIsTransitionEnabled(false);
      setCurrentIndex(extendedPairs.length - 2);
    }
  };

  const handleBannerClick = () => {
    router.push('/usuario');
  };

  return (
    <div className={styles.container}>
      <Header />

      {precisaCompletarCadastro && (
        <div className={styles.profileBanner} onClick={handleBannerClick}>
          <span>
            Seu cadastro está incompleto. <strong>Clique aqui</strong> para atualizar
            seus dados (endereço, telefone e CEP).
          </span>
        </div>
      )}

      {/* HERO COM LOGO DA LOJA */}
      <div className={styles.content}>
        <div className={styles.diamanteContainer}>
          <img
            src="/imagens/LogoLojaPP.png"
            alt="Logo Ana Paula Pratas"
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
              style={{
                transform: `translateX(-${currentIndex * 100}%)`,
                transition: isTransitionEnabled ? 'transform 0.45s ease-out' : 'none',
              }}
              onTransitionEnd={handleTransitionEnd}
            >
              {extendedPairs.map((pair, index) => (
                <div className={styles.slide} key={`${pair.id}-${index}`}>
                  <div className={styles.slideImageWrapper}>
                    <button
                      type="button"
                      className={styles.categoryButton}
                    >
                      <img
                        src={pair.left.src}
                        alt={pair.left.label}
                        className={styles.carouselImg}
                      />
                      <span className={styles.categoryLabel}>
                        {pair.left.label}
                      </span>
                    </button>
                  </div>

                  <div className={styles.slideImageWrapper}>
                    <button
                      type="button"
                      className={styles.categoryButton}
                    >
                      <img
                        src={pair.right.src}
                        alt={pair.right.label}
                        className={styles.carouselImg}
                      />
                      <span className={styles.categoryLabel}>
                        {pair.right.label}
                      </span>
                    </button>
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
          {categories.map((category) => (
            <div className={styles.desktopImageWrapper} key={category.id}>
              <button
                type="button"
                className={styles.categoryButton}
              >
                <img
                  src={category.src}
                  alt={category.label}
                  className={styles.desktopImg}
                />
                <span className={styles.categoryLabel}>
                  {category.label}
                </span>
              </button>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Home;