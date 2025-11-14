import React from 'react';
import styles from './Header.module.css';

const Header = () => {
  return (
    <header className={styles.header}>
      {/* Linha superior: menu, logo texto, avatar/sacola */}
      <div className={styles.topHeader}>
        <img src="/imagens/menu.png" alt="Menu" className={styles.menu} />

        <div className={styles.logoText}>
          ANA PAULA PRATAS
        </div>

        <div className={styles.avatarAndBag}>
          <img src="/imagens/avatarCinza.png" alt="Avatar" className={styles.avatar} />
          <img src="/imagens/sacola.png" alt="Sacola" className={styles.sacola} />
        </div>
      </div>

      {/* Linha do meio: busca + logo (mobile: padrão / desktop: barra de busca elegante) */}
      <div className={styles.bottomHeader}>
        <div className={styles.searchWrapper}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Buscar joias..."
          />
          <img src="/imagens/lupa.png" alt="Lupa" className={styles.lupa} />
        </div>

        <img
          src="/imagens/LogoLojaPP.png"
          alt="Logo da Loja"
          className={styles.logo}
        />
      </div>

      {/* Navegação só para WEB (desktop) */}
      <nav className={styles.desktopNav}>
        <ul className={styles.desktopNavList}>
          <li className={styles.desktopNavItem}><a href="#">Joias</a></li>
          <li className={styles.desktopNavItem}><a href="#">Pulseiras</a></li>
          <li className={styles.desktopNavItem}><a href="#">Anéis</a></li>
          <li className={styles.desktopNavItem}><a href="#">Brincos</a></li>
          <li className={styles.desktopNavItem}><a href="#">Pingentes</a></li>
          <li className={styles.desktopNavItem}><a href="#">Promoções</a></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
