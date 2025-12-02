import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import styles from './Header.module.css';
import { getUser, signOut } from '../services/storage';
import { getCarrinhoApi } from '../services/api';

const Header = () => {
  const router = useRouter();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [usuario, setUsuario] = useState(null);

  // 🔹 estado do campo de busca
  const [searchTerm, setSearchTerm] = useState('');

  // 🔹 quantidade total de itens no carrinho
  const [cartCount, setCartCount] = useState(0);

  // 🔹 modais de informação
  const [showContatoModal, setShowContatoModal] = useState(false);
  const [showSobreModal, setShowSobreModal] = useState(false);

  useEffect(() => {
    const user = getUser();
    if (user) {
      setUsuario(user);
    } else {
      setUsuario(null);
      setCartCount(0);
    }
  }, []);

  // 🔹 Busca quantidade do carrinho no backend
  const carregarQuantidadeCarrinho = useCallback(async () => {
    try {
      if (!usuario) {
        setCartCount(0);
        return;
      }
      const resp = await getCarrinhoApi();
      const itens = resp?.produtos || [];
      const totalQtd = itens.reduce(
        (sum, p) => sum + Number(p.quantidade || 0),
        0
      );
      setCartCount(totalQtd);
    } catch (e) {
      console.error('Erro ao carregar quantidade do carrinho:', e);
      // Em caso de erro, não derruba a UI
    }
  }, [usuario]);

  // Quando usuário logar/deslogar → recarrega quantidade
  useEffect(() => {
    carregarQuantidadeCarrinho();
  }, [carregarQuantidadeCarrinho]);

  // Ouve evento global "carrinhoAtualizado" (disparado no services/api.js)
  useEffect(() => {
    function handleCarrinhoAtualizado() {
      carregarQuantidadeCarrinho();
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('carrinhoAtualizado', handleCarrinhoAtualizado);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener(
          'carrinhoAtualizado',
          handleCarrinhoAtualizado
        );
      }
    };
  }, [carregarQuantidadeCarrinho]);

  const handleOpenMenu = () => {
    setIsMenuOpen(true);
  };

  const handleCloseMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLoginRedirect = () => {
    router.push('/login');
    setIsMenuOpen(false);
  };

  // Clique no logo de texto "ANA PAULA PRATAS JOIAS" → sempre home
  const handleLogoClick = () => {
    router.push('/');
    setIsMenuOpen(false);
  };

  // Clique no avatar (topo) → página do usuário se logado, senão login
  const handleAvatarClick = () => {
    if (usuario) {
      router.push('/usuario');
    } else {
      router.push('/login');
    }
  };

  // Clique na sacola → carrinho (ou login se não logado)
  const handleCarrinhoClick = () => {
    if (usuario) {
      router.push('/carrinho');
    } else {
      router.push('/login');
    }
  };

  const handleLogout = () => {
    signOut();
    setUsuario(null);
    setCartCount(0);
    setIsMenuOpen(false);
    router.push('/'); // sempre home ao deslogar
  };

  const firstName =
    usuario && usuario.nome ? usuario.nome.split(' ')[0] : null;

  // Botão "Olá, {nome}" dentro do menu lateral
  // se logado → home
  // se não logado → login
  const handleMenuUserClick = () => {
    if (usuario) {
      router.push('/');
      setIsMenuOpen(false);
    } else {
      router.push('/login');
      setIsMenuOpen(false);
    }
  };

  // "Minha Conta" no menu lateral → /usuario (ou login se não logado)
  const handleMinhaContaClick = () => {
    if (usuario) {
      router.push('/usuario');
    } else {
      router.push('/login');
    }
    setIsMenuOpen(false);
  };

  // 🔹 Admin → Produtos
  const handleAdminProdutosClick = () => {
    if (usuario && usuario.role === 'admin') {
      router.push('/admin/produtos');
    } else {
      router.push('/login');
    }
    setIsMenuOpen(false);
  };

  // 🔹 Admin → Pedidos
  const handleAdminPedidosClick = () => {
    if (usuario && usuario.role === 'admin') {
      router.push('/admin/pedidos');
    } else {
      router.push('/login');
    }
    setIsMenuOpen(false);
  };

  // 🔹 Admin → Usuários
  const handleAdminUsuariosClick = () => {
    if (usuario && usuario.role === 'admin') {
      router.push('/admin/usuarios');
    } else {
      router.push('/login');
    }
    setIsMenuOpen(false);
  };

  // 🔹 Menu lateral: clicar em categoria
  const handleMenuCategoriaClick = (slug) => {
    router.push(`/categoria/${slug}`);
    setIsMenuOpen(false);
  };

  // 🔎 Executar busca (enter ou clique na lupa)
  const executarBusca = () => {
    const termo = searchTerm.trim();
    if (!termo) return;

    router.push(`/categoria/buscar?q=${encodeURIComponent(termo)}`);
    setIsMenuOpen(false);
  };

  // Enter no input
  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      executarBusca();
    }
  };

  // 🔹 Abrir modal de contato
  const handleContatoClick = () => {
    setIsMenuOpen(false);
    setShowContatoModal(true);
  };

  // 🔹 Abrir modal Sobre nós
  const handleSobreClick = () => {
    setIsMenuOpen(false);
    setShowSobreModal(true);
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

          <div className={styles.logoText} onClick={handleLogoClick}>
            ANA PAULA PRATAS JOIAS
          </div>

          <div className={styles.avatarAndBag}>
            {usuario && (
              <div className={styles.userInfo}>
                <span className={styles.userName}>Olá, {firstName}</span>

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
                  onClick={handleCarrinhoClick}
                >
                  <div className={styles.cartWrapper}>
                    <img
                      src="/imagens/sacola.png"
                      alt="Sacola"
                      className={styles.sacola}
                    />
                    {cartCount > 0 && (
                      <span className={styles.cartBadge}>{cartCount}</span>
                    )}
                  </div>
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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleSearchKeyDown}
            />
            <img
              src="/imagens/lupa.png"
              alt="Lupa"
              className={styles.lupa}
              onClick={executarBusca}
            />
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
            <li className={styles.desktopNavItem}>
              <a href="/categoria/joias">Todas as Joias</a>
            </li>

            <li className={styles.desktopNavItem}>
              <a href="/categoria/aneis">Anéis</a>
            </li>
            <li className={styles.desktopNavItem}>
              <a href="/categoria/colares">Colares</a>
            </li>
            <li className={styles.desktopNavItem}>
              <a href="/categoria/chokers">Chokers</a>
            </li>

            <li className={styles.desktopNavItem}>
              <a href="/categoria/pulseiras">Pulseiras</a>
            </li>
            <li className={styles.desktopNavItem}>
              <a href="/categoria/pulseiras-minha-vida">Pulseiras Minha Vida</a>
            </li>
            <li className={styles.desktopNavItem}>
              <a href="/categoria/braceletes">Braceletes</a>
            </li>

            <li className={styles.desktopNavItem}>
              <a href="/categoria/escapularios">Escapulários</a>
            </li>
            <li className={styles.desktopNavItem}>
              <a href="/categoria/brincos">Brincos</a>
            </li>

            {/* Pingentes */}
            <li className={styles.desktopNavItem}>
              <a href="/categoria/pingentes">Pingentes</a>
            </li>

            {/* 🆕 Relógios Fem. Réplica (depois dos pingentes) */}
            <li className={styles.desktopNavItem}>
              <a href="/categoria/relogios-femininos-replica">
                Relógios Fem. Réplica
              </a>
            </li>

            {/* Masculinos */}
            <li className={styles.desktopNavItem}>
              <a href="/categoria/correntes-masculinas">
                Correntes Masculinas
              </a>
            </li>
            <li className={styles.desktopNavItem}>
              <a href="/categoria/pulseiras-masculinas">
                Pulseiras Masculinas
              </a>
            </li>

            {/* 🆕 Pingentes masculinos (depois das pulseiras masculinas) */}
            <li className={styles.desktopNavItem}>
              <a href="/categoria/pingentes-masculinos">
                Pingentes Masculinos
              </a>
            </li>

            <li className={styles.desktopNavItem}>
              <a href="/categoria/relogios-masculinos-replica">
                Relógios Masc. Réplica
              </a>
            </li>

            <li className={styles.desktopNavItem}>
              <a href="#">Promoções</a>
            </li>
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
              <span className={styles.menuLogo}>ANA PAULA PRATAS JOIAS</span>
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
                  <button
                    type="button"
                    onClick={() => handleMenuCategoriaClick('joias')}
                  >
                    Todas as Joias
                  </button>
                </li>

                <li>
                  <button
                    type="button"
                    onClick={() => handleMenuCategoriaClick('aneis')}
                  >
                    Anéis
                  </button>
                </li>

                <li>
                  <button
                    type="button"
                    onClick={() => handleMenuCategoriaClick('colares')}
                  >
                    Colares
                  </button>
                </li>

                <li>
                  <button
                    type="button"
                    onClick={() => handleMenuCategoriaClick('chokers')}
                  >
                    Chokers
                  </button>
                </li>

                <li>
                  <button
                    type="button"
                    onClick={() => handleMenuCategoriaClick('pulseiras')}
                  >
                    Pulseiras
                  </button>
                </li>

                <li>
                  <button
                    type="button"
                    onClick={() =>
                      handleMenuCategoriaClick('pulseiras-minha-vida')
                    }
                  >
                    Pulseiras Minha Vida
                  </button>
                </li>

                <li>
                  <button
                    type="button"
                    onClick={() => handleMenuCategoriaClick('braceletes')}
                  >
                    Braceletes
                  </button>
                </li>

                <li>
                  <button
                    type="button"
                    onClick={() => handleMenuCategoriaClick('escapularios')}
                  >
                    Escapulários
                  </button>
                </li>

                <li>
                  <button
                    type="button"
                    onClick={() => handleMenuCategoriaClick('brincos')}
                  >
                    Brincos
                  </button>
                </li>

                {/* Pingentes */}
                <li>
                  <button
                    type="button"
                    onClick={() => handleMenuCategoriaClick('pingentes')}
                  >
                    Pingentes
                  </button>
                </li>

                {/* 🆕 Relógios Fem. Réplica */}
                <li>
                  <button
                    type="button"
                    onClick={() =>
                      handleMenuCategoriaClick('relogios-femininos-replica')
                    }
                  >
                    Relógios Fem. Réplica
                  </button>
                </li>

                {/* Masculinos */}
                <li>
                  <button
                    type="button"
                    onClick={() =>
                      handleMenuCategoriaClick('correntes-masculinas')
                    }
                  >
                    Correntes Masculinas
                  </button>
                </li>

                <li>
                  <button
                    type="button"
                    onClick={() =>
                      handleMenuCategoriaClick('pulseiras-masculinas')
                    }
                  >
                    Pulseiras Masculinas
                  </button>
                </li>

                {/* 🆕 Pingentes Masculinos */}
                <li>
                  <button
                    type="button"
                    onClick={() =>
                      handleMenuCategoriaClick('pingentes-masculinos')
                    }
                  >
                    Pingentes Masculinos
                  </button>
                </li>

                <li>
                  <button
                    type="button"
                    onClick={() =>
                      handleMenuCategoriaClick('relogios-masculinos-replica')
                    }
                  >
                    Relógios Masc. Réplica
                  </button>
                </li>

                <li>
                  <button type="button">Promoções</button>
                </li>
              </ul>
            </nav>

            {/* Links extras + SAIR */}
            <div className={styles.menuExtraLinks}>
              <button type="button" onClick={handleMinhaContaClick}>
                Minha Conta
              </button>

              <button
                type="button"
                onClick={() => {
                  if (usuario) {
                    router.push('/meus-pedidos');
                  } else {
                    router.push('/login');
                  }
                  setIsMenuOpen(false);
                }}
              >
                Meus Pedidos
              </button>

              <button type="button" onClick={handleSobreClick}>
                Sobre nós
              </button>

              <button type="button" onClick={handleContatoClick}>
                Contato
              </button>

              <button type="button">Informações</button>

              {/* 🔹 Seção ADMIN – só aparece para usuário admin */}
              {usuario && usuario.role === 'admin' && (
                <div className={styles.menuAdminSection}>
                  <span className={styles.menuAdminTitle}>Administração</span>

                  <button
                    type="button"
                    onClick={handleAdminProdutosClick}
                  >
                    Produtos
                  </button>
                  <button
                    type="button"
                    onClick={handleAdminPedidosClick}
                  >
                    Pedidos
                  </button>
                  <button
                    type="button"
                    onClick={handleAdminUsuariosClick}
                  >
                    Usuários
                  </button>
                </div>
              )}

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

      {/* MODAL CONTATO */}
      {showContatoModal && (
        <div
          className={styles.infoModalOverlay}
          onClick={() => setShowContatoModal(false)}
        >
          <div
            className={styles.infoModalBox}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className={styles.infoModalClose}
              onClick={() => setShowContatoModal(false)}
            >
              ✕
            </button>

            <h3 className={styles.infoModalTitle}>Contato</h3>

            <div className={styles.infoModalGroup}>
              <span className={styles.infoModalLabel}>WhatsApp</span>
              <ul className={styles.infoModalList}>
                <li>
                  <a
                    href="https://wa.me/5515998228365"
                    target="_blank"
                    rel="noreferrer"
                    className={styles.infoModalLink}
                  >
                    15 99822-8365
                  </a>
                </li>
                <li>
                  <a
                    href="https://wa.me/5515997291902"
                    target="_blank"
                    rel="noreferrer"
                    className={styles.infoModalLink}
                  >
                    15 99729-1902
                  </a>
                </li>
              </ul>
            </div>

            <div className={styles.infoModalGroup}>
              <span className={styles.infoModalLabel}>Instagram</span>
              <a
                href="https://www.instagram.com/anapaula_pratajoias/"
                target="_blank"
                rel="noreferrer"
                className={styles.infoModalLink}
              >
                @anapaula_pratajoias
              </a>
            </div>

            <div className={styles.infoModalGroup}>
              <span className={styles.infoModalLabel}>Endereço</span>
              <p className={styles.infoModalText}>
                R. Sete de Setembro, 38 - Centro, Araçoiaba da Serra - SP,
                18190-000
              </p>
            </div>
          </div>
        </div>
      )}

      {/* MODAL SOBRE NÓS */}
      {showSobreModal && (
        <div
          className={styles.infoModalOverlay}
          onClick={() => setShowSobreModal(false)}
        >
          <div
            className={styles.infoModalBox}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className={styles.infoModalClose}
              onClick={() => setShowSobreModal(false)}
            >
              ✕
            </button>

            <h3 className={styles.infoModalTitle}>Sobre nós</h3>

            <p className={styles.infoModalText}>
              A <strong>ANA PAULA PRATAS JOIAS</strong> é uma joalheria
              especializada em prata, com loja física em Araçoiaba da Serra
              desde <strong>2016</strong>.
            </p>

            <p className={styles.infoModalText}>
              Cada peça é escolhida com cuidado para representar elegância,
              brilho e momentos especiais da vida das nossas clientes.
            </p>

            <p className={styles.infoModalText}>
              Aqui você encontra atendimento próximo, joias com acabamento
              diferenciado e todo o carinho de uma loja que cresceu junto com a
              cidade e com suas histórias.
            </p>

            <p className={styles.infoModalTextHighlight}>
              Sinta-se em casa. Sua próxima joia favorita pode estar a um clique
              de distância. ✨
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;