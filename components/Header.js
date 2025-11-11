import React from 'react';
import styles from './Header.module.css';

const Header = () => {
  return (
    <header className={styles.header}>
      {/* Div superior com imagens e texto */}
      <div className={styles.topHeader}>
        <img src="/imagens/menu.png" alt="Menu" className={styles.menu} />
        
        {/* Texto no meio do header */}
        <div className={styles.logoText}>
          ANA PAULA PRATAS
        </div>
        
        <div className={styles.avatarAndBag}>
          <img src="/imagens/avatarCinza.png" alt="Avatar" className={styles.avatar} />
          <img src="/imagens/sacola.png" alt="Sacola" className={styles.sacola} />
        </div>
      </div>

      {/* Div inferior com o input de busca */}
      <div className={styles.bottomHeader}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Buscar joias..."
        />
        <img src="/imagens/lupa.png" alt="Lupa" className={styles.lupa} />
        {/* Logo da loja ao lado direito */}
        <img src="/imagens/LogoLojaPP.png" alt="Logo da Loja" className={styles.logo} />
      </div>
    </header>
  );
};

export default Header;
