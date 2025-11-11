import React from 'react';
import Header from '../components/Header'; // Supondo que Header.js esteja na pasta 'components'
import styles from '../styles/Home.module.css'; // Caminho correto para o arquivo CSS

const Home = () => {
  return (
    <div className={styles.container}>
      {/* Componente Header */}
      <Header />

      {/* Div com Diamante, Título e Descrição, com fundo prateado */}
      <div className={styles.content}>

        {/* Imagem do Diamante */}
        <div className={styles.diamanteContainer}>
          <img src="/imagens/diamante.png" alt="Diamante" className={styles.diamante} />
        </div>
        
        {/* Título */}
        <h1 className={styles.title}>JOIAS DE PRATA</h1>

        {/* Texto de descrição */}
        <div className={styles.description}>
          Descubra a beleza atemporal das nossas joias de prata 925, perfeitas para adicionar um toque de elegância ao seu dia a dia.
        </div>
      </div>

      {/* Nova seção: NAVEGUE POR CATEGORIAS */}
      <div className={styles.categoriesSection}>
        <h2 className={styles.categoriesTitle}>NAVEGUE POR CATEGORIAS</h2>
        <p className={styles.categoriesDescription}>Encontre a sua próxima joia de prata</p>
      </div>

      {/* Área abaixo com fundo preto */}
      <div className={styles.blackBackground}>
        {/* Aqui você pode adicionar mais conteúdo, se necessário */}
      </div>
    </div>
  );
};

export default Home;
