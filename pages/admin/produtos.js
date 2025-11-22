import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import styles from '../../styles/AdminProdutos.module.css';
import {
  getProdutosApi,
  createProdutoApi,
  updateProdutoApi,
  deleteProdutoApi,
} from '../../services/api';
import { getUser } from '../../services/storage';

const AdminProdutosPage = () => {
  const router = useRouter();

  const [produtos, setProdutos] = useState([]);
  const [loadingProdutos, setLoadingProdutos] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [editingProdutoId, setEditingProdutoId] = useState(null);

  const [codigo, setCodigo] = useState('');
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [estoque, setEstoque] = useState('');
  const [categoria, setCategoria] = useState('');
  const [cor, setCor] = useState('');
  const [modelo, setModelo] = useState('');
  const [peso, setPeso] = useState('');
  const [largura, setLargura] = useState('');
  const [altura, setAltura] = useState('');
  const [comprimento, setComprimento] = useState('');

  const [imagemPreview, setImagemPreview] = useState('');
  const [novaImagem, setNovaImagem] = useState(null);

  const [produtoParaExcluir, setProdutoParaExcluir] = useState(null);

  useEffect(() => {
    const user = getUser();
    if (!user || user.role !== 'admin') {
      router.push('/');
    }
  }, [router]);

  useEffect(() => {
    const carregarProdutos = async () => {
      try {
        setLoadingProdutos(true);
        const lista = await getProdutosApi();
        setProdutos(lista || []);
      } catch (e) {
        console.error('Erro ao carregar produtos:', e);
        setErrorMsg(e.message || 'Erro ao carregar produtos.');
      } finally {
        setLoadingProdutos(false);
      }
    };

    carregarProdutos();
  }, []);

  const limparFormulario = () => {
    setCodigo('');
    setNome('');
    setDescricao('');
    setPreco('');
    setEstoque('');
    setCategoria('');
    setCor('');
    setModelo('');
    setPeso('');
    setLargura('');
    setAltura('');
    setComprimento('');
    setImagemPreview('');
    setNovaImagem(null);
    setEditingProdutoId(null);
  };

  const handleNovoProdutoClick = () => {
    limparFormulario();
    setErrorMsg('');
    setSuccessMsg('');
    setShowForm(true);
  };

  const handleCancelarForm = () => {
    limparFormulario();
    setShowForm(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setNovaImagem(file);
      const previewUrl = URL.createObjectURL(file);
      setImagemPreview(previewUrl);
    }
  };

  const recarregarProdutos = async () => {
    try {
      setLoadingProdutos(true);
      const lista = await getProdutosApi();
      setProdutos(lista || []);
    } catch (e) {
      console.error('Erro ao recarregar produtos:', e);
      setErrorMsg(e.message || 'Erro ao recarregar produtos.');
    } finally {
      setLoadingProdutos(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const formData = new FormData();
      formData.append('codigo', codigo);
      formData.append('nome', nome);
      formData.append('descricao', descricao);
      formData.append('preco', preco || '0');
      formData.append('estoque', estoque || '0');
      formData.append('categoria', categoria);
      formData.append('cor', cor);
      formData.append('modelo', modelo);
      formData.append('peso', peso || '0');
      formData.append('largura', largura || '0');
      formData.append('altura', altura || '0');
      formData.append('comprimento', comprimento || '0');

      if (novaImagem) {
        formData.append('file', novaImagem);
      }

      if (editingProdutoId) {
        await updateProdutoApi(editingProdutoId, formData);
        setSuccessMsg('Produto atualizado com sucesso!');
      } else {
        await createProdutoApi(formData);
        setSuccessMsg('Produto criado com sucesso!');
      }

      await recarregarProdutos();
      limparFormulario();
      setShowForm(false);
    } catch (e) {
      console.error('Erro ao salvar produto:', e);
      setErrorMsg(e.message || 'Erro ao salvar produto.');
    }
  };

  const handleEditarProduto = (produto) => {
    setErrorMsg('');
    setSuccessMsg('');
    setShowForm(true);
    setEditingProdutoId(produto._id || null);

    setCodigo(produto.codigo || '');
    setNome(produto.nome || '');
    setDescricao(produto.descricao || '');
    setPreco(produto.preco != null ? String(produto.preco) : '');
    setEstoque(produto.estoque != null ? String(produto.estoque) : '');
    setCategoria(produto.categoria || '');
    setCor(produto.cor || '');
    setModelo(produto.modelo || '');
    setPeso(produto.peso != null ? String(produto.peso) : '');
    setLargura(produto.largura != null ? String(produto.largura) : '');
    setAltura(produto.altura != null ? String(produto.altura) : '');
    setComprimento(produto.comprimento != null ? String(produto.comprimento) : '');
    setImagemPreview(produto.imagem || '');
    setNovaImagem(null);
  };

  const handleExcluirClick = (produto) => {
    setProdutoParaExcluir(produto);
  };

  const handleCancelarExclusao = () => {
    setProdutoParaExcluir(null);
  };

  const handleConfirmarExclusao = async () => {
    if (!produtoParaExcluir) return;

    try {
      setErrorMsg('');
      setSuccessMsg('');
      await deleteProdutoApi(produtoParaExcluir._id);
      setSuccessMsg('Produto excluído com sucesso!');
      await recarregarProdutos();
    } catch (e) {
      console.error('Erro ao excluir produto:', e);
      setErrorMsg(e.message || 'Erro ao excluir produto.');
    } finally {
      setProdutoParaExcluir(null);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <Header />

      <main className={styles.main}>
        <div className={styles.card}>
          <div className={styles.headerRow}>
            <div>
              <h1 className={styles.title}>Produtos</h1>
              <p className={styles.subtitle}>
                Gerencie o catálogo da loja: cadastre, edite e remova produtos.
              </p>
            </div>

            <button
              type="button"
              className={styles.newProductButton}
              onClick={handleNovoProdutoClick}
            >
              Novo produto
            </button>
          </div>

          {showForm && (
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Código</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={codigo}
                    onChange={(e) => setCodigo(e.target.value)}
                    placeholder="Ex: AP-001"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Nome</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Nome do produto"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Categoria</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                    placeholder="Ex: Pulseiras, Anéis..."
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Cor</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={cor}
                    onChange={(e) => setCor(e.target.value)}
                    placeholder="Ex: Prata, Dourado..."
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Modelo</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={modelo}
                    onChange={(e) => setModelo(e.target.value)}
                    placeholder="Ex: Coração, Elos..."
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Preço (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    className={styles.input}
                    value={preco}
                    onChange={(e) => setPreco(e.target.value)}
                    placeholder="Ex: 129.90"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Estoque</label>
                  <input
                    type="number"
                    className={styles.input}
                    value={estoque}
                    onChange={(e) => setEstoque(e.target.value)}
                    placeholder="Quantidade em estoque"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Peso (kg)</label>
                  <input
                    type="number"
                    step="0.001"
                    className={styles.input}
                    value={peso}
                    onChange={(e) => setPeso(e.target.value)}
                    placeholder="Ex: 0.050"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Largura (cm)</label>
                  <input
                    type="number"
                    className={styles.input}
                    value={largura}
                    onChange={(e) => setLargura(e.target.value)}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Altura (cm)</label>
                  <input
                    type="number"
                    className={styles.input}
                    value={altura}
                    onChange={(e) => setAltura(e.target.value)}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Comprimento (cm)</label>
                  <input
                    type="number"
                    className={styles.input}
                    value={comprimento}
                    onChange={(e) => setComprimento(e.target.value)}
                  />
                </div>
              </div>

              <div className={styles.formGroup} style={{ marginTop: 10 }}>
                <label className={styles.label}>Descrição</label>
                <textarea
                  className={styles.textarea}
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  placeholder="Descrição detalhada do produto"
                />
              </div>

              <div className={styles.imagemRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Imagem</label>
                  <input
                    type="file"
                    accept="image/*"
                    className={styles.fileInput}
                    onChange={handleFileChange}
                  />
                </div>
                {imagemPreview && (
                  <div className={styles.imagemPreviewWrapper}>
                    <img
                      src={imagemPreview}
                      alt="Prévia"
                      className={styles.imagemPreview}
                    />
                  </div>
                )}
              </div>

              {errorMsg && <p className={styles.errorText}>{errorMsg}</p>}
              {successMsg && <p className={styles.successText}>{successMsg}</p>}

              <div className={styles.formButtonsRow}>
                <button type="submit" className={styles.saveButton}>
                  {editingProdutoId ? 'Salvar alterações' : 'Cadastrar produto'}
                </button>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={handleCancelarForm}
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}

          <section className={styles.listaSection}>
            <h2 className={styles.sectionTitle}>Produtos cadastrados</h2>

            {loadingProdutos && <p className={styles.infoText}>Carregando produtos...</p>}

            {!loadingProdutos && produtos.length === 0 && (
              <p className={styles.infoText}>
                Nenhum produto cadastrado até o momento.
              </p>
            )}

            {!loadingProdutos && produtos.length > 0 && (
              <div className={styles.listaTabela}>
                <div className={`${styles.listaLinha} ${styles.listaHeader}`}>
                  <span className={styles.colImagem}>Imagem</span>
                  <span className={styles.colCodigo}>Código</span>
                  <span>Produto</span>
                  <span>Preço</span>
                  <span>Estoque</span>
                  <span className={styles.colAcoes}>Ações</span>
                </div>

                {produtos.map((produto) => (
                  <div key={produto._id} className={styles.listaLinha}>
                    <span className={styles.colImagem}>
                      {produto.imagem ? (
                        <img
                          src={produto.imagem}
                          alt={produto.nome}
                          className={styles.listaImagem}
                        />
                      ) : (
                        <span className={styles.noImage}>Sem imagem</span>
                      )}
                    </span>

                    <span className={styles.colCodigo}>
                      {produto.codigo || '—'}
                    </span>

                    <span className={styles.colNome}>{produto.nome}</span>

                    <span>
                      {produto.preco != null
                        ? `R$ ${Number(produto.preco).toFixed(2)}`
                        : '—'}
                    </span>

                    <span>{produto.estoque != null ? produto.estoque : '—'}</span>

                    <span className={styles.colAcoes}>
                      <button
                        type="button"
                        className={styles.acaoButton}
                        onClick={() => handleEditarProduto(produto)}
                      >
                        Editar
                      </button>

                      <button
                        type="button"
                        className={`${styles.acaoButton} ${styles.acaoExcluir}`}
                        onClick={() => handleExcluirClick(produto)}
                      >
                        Excluir
                      </button>
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />

      {produtoParaExcluir && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3 className={styles.modalTitle}>Excluir produto</h3>
            <p className={styles.modalText}>
              Tem certeza que deseja excluir o produto:
            </p>
            <p className={styles.modalTextSmall}>
              <strong>
                {produtoParaExcluir.codigo
                  ? `${produtoParaExcluir.codigo} - `
                  : ''}
                {produtoParaExcluir.nome}
              </strong>
            </p>
            <div className={styles.modalButtonsRow}>
              <button
                type="button"
                className={styles.modalCancelButton}
                onClick={handleCancelarExclusao}
              >
                Cancelar
              </button>
              <button
                type="button"
                className={styles.modalConfirmButton}
                onClick={handleConfirmarExclusao}
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProdutosPage;