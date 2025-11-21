import React, { useState } from 'react';
import styles from './Header.module.css';

const Header = () => {
  // TODO: substituir por estado real de autenticação quando tiver login
  const isLoggedIn = false;

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleOpenMenu = () => setIsMenuOpen(true);
  const handleCloseMenu = () => setIsMenuOpen(false);

  return (
    <>
      <header className={styles.header}>
        {/* Linha superior: menu, logo texto, avatar/sacola */}
        <div className={styles.topHeader}>
          <button
            type="button"
            className={styles.menuButton}
            onClick={handleOpenMenu}
            aria-label="Abrir menu"
          >
            <img src="/imagens/menu.png" alt="Menu" className={styles.menu} />
          </button>

          <div className={styles.logoText}>
            ANA PAULA PRATAS
          </div>

          <div className={styles.avatarAndBag}>
            {isLoggedIn && (
              <>
                <button
                  type="button"
                  className={styles.iconButton}
                  aria-label="Perfil"
                >
                  <img
                    src="/imagens/avatarCinza.png"
                    alt="Avatar"
                    className={styles.avatar}
                  />
                </button>

                <button
                  type="button"
                  className={styles.iconButton}
                  aria-label="Sacola"
                >
                  <img
                    src="/imagens/sacola.png"
                    alt="Sacola"
                    className={styles.sacola}
                  />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Linha do meio: busca + logo */}
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

      {/* MENU LATERAL (abre em mobile e web) */}
      {isMenuOpen && (
        <div className={styles.menuOverlay} onClick={handleCloseMenu}>
          <aside
            className={styles.menuPanel}
            onClick={(e) => e.stopPropagation()} // não fecha se clicar dentro
          >
            <header className={styles.menuHeader}>
              <div className={styles.menuLogo}>
                ANA PAULA PRATAS
              </div>

              <button
                type="button"
                className={styles.menuCloseButton}
                onClick={handleCloseMenu}
                aria-label="Fechar menu"
              >
                ✕
              </button>
            </header>

            <div className={styles.menuUserArea}>
              <button type="button" className={styles.menuPrimaryButton}>
                Olá! Entre ou Cadastre-se
              </button>
            </div>

            <nav className={styles.menuNav}>
              <ul>
                <li><button type="button">Pulseiras</button></li>
                <li><button type="button">Anéis</button></li>
                <li><button type="button">Brincos</button></li>
                <li><button type="button">Pingentes</button></li>
                <li><button type="button">Promoções</button></li>
              </ul>
            </nav>

            <div className={styles.menuExtraLinks}>
              <button type="button">Minha Conta</button>
              <button type="button">Sobre nós</button>
              <button type="button">Contato</button>
              <button type="button">Informações</button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
};

export default Header;
