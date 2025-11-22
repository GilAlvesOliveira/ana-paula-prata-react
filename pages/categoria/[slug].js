// pages/categoria/[slug].js
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import styles from '../../styles/Categoria.module.css';
import { buscarProdutosApi, getProdutosApi } from '../../services/api';

const CategoriaPage = () => {
  const router = useRouter();
  const { slug, q } = router.query;

  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [imagemAmpliada, setImagemAmpliada] = useState(null);

  const termoBusca = typeof q === 'string' ? q : '';

  // Mapeia slug para um nome bonitinho para título
  const getCategoriaNome = (s) => {
    switch (s) {
      case 'pulseiras':
        return 'Pulseiras';
      case 'aneis':
        return 'Anéis';
      case 'brincos':
        return 'Brincos';
      case 'pingentes':
        return 'Pingentes';
      case 'joias':
        return 'Joias';
      case 'buscar':
        return 'Resultados da busca';
      default:
        if (!s) return '';
        return s.charAt(0).toUpperCase() + s.slice(1);
    }
  };

  const categoriaNome = getCategoriaNome(slug);

  useEffect(() => {
    const carregarProdutos = async () => {
      if (!router.isReady || !slug) return;

      try {
        setLoading(true);
        setErrorMsg('');

        let lista = [];

        if (slug === 'joias') {
          // Todas as joias com estoque > 0
          lista = await getProdutosApi({
            q: '',
            somenteDisponiveis: true,
          });
        } else if (slug === 'buscar') {
          const termo = (termoBusca || '').trim();
          if (!termo) {
            setProdutos([]);
            setLoading(false);
            return;
          }

          lista = await buscarProdutosApi({
            q: termo,
          });
        } else {
          // Busca por categoria específica
          lista = await buscarProdutosApi({
            q: categoriaNome,
          });
        }

        setProdutos(lista || []);
      } catch (e) {
        console.error('Erro ao carregar produtos da categoria:', e);
        setErrorMsg(e.message || 'Erro ao carregar produtos.');
      } finally {
        setLoading(false);
      }
    };

    carregarProdutos();
  }, [router.isReady, slug, categoriaNome, termoBusca]);

  const formatarPreco = (valor) => {
    if (valor == null) return '';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(Number(valor));
  };

  const abrirImagem = (url) => {
    setImagemAmpliada(url);
  };

  const fecharImagem = () => {
    setImagemAmpliada(null);
  };

  const handleAdicionarCarrinho = (produto) => {
    console.log('Adicionar ao carrinho:', produto);
    alert('Função "Adicionar ao carrinho" ainda será implementada 🙂');
  };

  const handleComprarAgora = (produto) => {
    console.log('Comprar agora:', produto);
    alert('Função "Comprar agora" ainda será implementada 🙂');
  };

  const tituloPagina =
    slug === 'buscar'
      ? `Resultados para "${termoBusca}"`
      : categoriaNome;

  const subtituloPagina =
    slug === 'joias'
      ? 'Veja todas as joias de prata 925 disponíveis na loja.'
      : slug === 'buscar'
      ? 'Veja as joias encontradas de acordo com o termo pesquisado.'
      : `Explore nossa seleção de ${categoriaNome.toLowerCase()} em prata 925.`;

  return (
    <div className={styles.pageContainer}>
      <Header />

      <main className={styles.main}>
        <div className={styles.card}>
          <div className={styles.headerRow}>
            <div>
              <h1 className={styles.title}>{tituloPagina}</h1>
              <p className={styles.subtitle}>{subtituloPagina}</p>
            </div>
          </div>

          {loading && (
            <p className={styles.infoText}>Carregando produtos...</p>
          )}

          {!loading && errorMsg && (
            <p className={styles.errorText}>{errorMsg}</p>
          )}

          {!loading && !errorMsg && produtos.length === 0 && (
            <p className={styles.infoText}>
              {slug === 'buscar' && termoBusca
                ? `Nenhum produto encontrado para "${termoBusca}".`
                : 'Nenhum produto encontrado nesta categoria.'}
            </p>
          )}

          {!loading && !errorMsg && produtos.length > 0 && (
            <section className={styles.gridSection}>
              <div className={styles.grid}>
                {produtos.map((produto) => (
                  <article key={produto._id} className={styles.productCard}>
                    <div
                      className={styles.imageWrapper}
                      onClick={() => produto.imagem && abrirImagem(produto.imagem)}
                    >
                      {produto.imagem ? (
                        <img
                          src={produto.imagem}
                          alt={produto.nome}
                          className={styles.productImage}
                        />
                      ) : (
                        <div className={styles.noImageBox}>
                          <span>Sem imagem</span>
                        </div>
                      )}
                    </div>

                    <div className={styles.productInfo}>
                      <h2 className={styles.productName}>{produto.nome}</h2>
                      {produto.descricao && (
                        <p className={styles.productDescription}>
                          {produto.descricao}
                        </p>
                      )}

                      <div className={styles.priceRow}>
                        {produto.preco != null && (
                          <span className={styles.productPrice}>
                            {formatarPreco(produto.preco)}
                          </span>
                        )}
                        {produto.estoque != null && (
                          <span className={styles.productStock}>
                            {produto.estoque > 0
                              ? `Estoque: ${produto.estoque}`
                              : 'Sem estoque'}
                          </span>
                        )}
                      </div>

                      <div className={styles.buttonsRow}>
                        <button
                          type="button"
                          className={styles.addToCartButton}
                          onClick={() => handleAdicionarCarrinho(produto)}
                        >
                          Adicionar ao carrinho
                        </button>
                        <button
                          type="button"
                          className={styles.buyNowButton}
                          onClick={() => handleComprarAgora(produto)}
                        >
                          Comprar agora
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />

      {/* MODAL VISUALIZAR IMAGEM */}
      {imagemAmpliada && (
        <div className={styles.modalOverlay} onClick={fecharImagem}>
          <div
            className={styles.modalImgBox}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className={styles.modalImgClose}
              onClick={fecharImagem}
            >
              ✕
            </button>

            <img
              src={imagemAmpliada}
              alt="Imagem ampliada"
              className={styles.modalImg}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriaPage;