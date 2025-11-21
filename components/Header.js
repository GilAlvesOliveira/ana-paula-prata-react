import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from './Header.module.css';
import { getUser, signOut } from '../services/storage';

const Header = () => {
  const router = useRouter();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const user = getUser();
    if (user) {
      setUsuario(user);
    }
  }, []);

  const handleLoginRedirect = () => {
    router.push('/login');
    setIsMenuOpen(false);
  };

  const handleOpenMenu = () => {
    setIsMenuOpen(true);
  };

  const handleCloseMenu = () => {
    setIsMenuOpen(false);
  };

  // Clique no avatar (topo) – por enquanto leva pro login/minha conta
  const handleAvatarClick = () => {
    router.push('/login');
  };

  const handleLogout = () => {
    signOut();
    setUsuario(null);
    setIsMenuOpen(false);
    router.push('/'); // sempre home ao deslogar
  };

  const firstName =
    usuario && usuario.nome
      ? usuario.nome.split(' ')[0]
      : null;

  // Clique no botão "Olá, {nome}" dentro do menu lateral
  const handleMenuUserClick = () => {
    if (usuario) {
      // se estiver logado → vai pra home
      router.push('/');
      setIsMenuOpen(false);
    } else {
      // se não estiver logado → vai pra login
      router.push('/login');
      setIsMenuOpen(false);
    }
  };

  return (
    <>
      <header className={styles.header}>
        {/* Linha superior: menu, logo texto, avatar/sacola + nome */}
        <div className={styles.topHeader}>
          <button
            type="button"
            className={styles.menuButton}
            onClick={handleOpenMenu}
          >
            <img src="/imagens/menu.png" alt="Menu" className={styles.menu} />
          </button>

          <div className={styles.logoText}>
            ANA PAULA PRATAS
          </div>

          <div className={styles.avatarAndBag}>
            {usuario && (
              <div className={styles.userInfo}>
                <span className={styles.userName}>
                  Olá, {firstName}
                </span>

                <button
                  type="button"
                  className={styles.iconButton}
                  onClick={handleAvatarClick}
                >
                  <img
                    src={usuario.avatar || '/imagens/avatarCinza.png'}
                    alt="Avatar"
                    className={styles.avatar}
                  />
                </button>

                <button
                  type="button"
                  className={styles.iconButton}
                >
                  <img
                    src="/imagens/sacola.png"
                    alt="Sacola"
                    className={styles.sacola}
                  />
                </button>
              </div>
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

        {/* Navegação só WEB */}
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

      {/* MENU LATERAL (SLIDE-OVER) */}
      {isMenuOpen && (
        <div className={styles.menuOverlay} onClick={handleCloseMenu}>
          <div
            className={styles.menuPanel}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Cabeçalho do menu */}
            <div className={styles.menuHeader}>
              <span className={styles.menuLogo}>ANA PAULA PRATAS</span>
              <button
                type="button"
                className={styles.menuCloseButton}
                onClick={handleCloseMenu}
              >
                ✕
              </button>
            </div>

            {/* Área usuário / login */}
            <div className={styles.menuUserArea}>
              <button
                type="button"
                className={styles.menuPrimaryButton}
                onClick={handleMenuUserClick}
              >
                {usuario ? `Olá, ${firstName}` : 'Olá! Entre ou Cadastre-se'}
              </button>
            </div>

            {/* Navegação principal do menu */}
            <nav className={styles.menuNav}>
              <ul>
                <li>
                  <button type="button">Pulseiras</button>
                </li>
                <li>
                  <button type="button">Anéis</button>
                </li>
                <li>
                  <button type="button">Brincos</button>
                </li>
                <li>
                  <button type="button">Pingentes</button>
                </li>
                <li>
                  <button type="button">Promoções</button>
                </li>
              </ul>
            </nav>

            {/* Links extras + SAIR */}
            <div className={styles.menuExtraLinks}>
              <button type="button">
                Minha Conta
              </button>
              <button type="button">
                Sobre nós
              </button>
              <button type="button">
                Contato
              </button>
              <button type="button">
                Informações
              </button>

              {usuario && (
                <button
                  type="button"
                  className={styles.logoutButton}
                  onClick={handleLogout}
                >
                  Sair
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;