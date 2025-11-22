// pages/admin/produtos.js
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import styles from '../../styles/AdminProdutos.module.css';
import { getToken, getUser } from '../../services/storage';
import {
  getProdutos,
  createProduto,
  updateProduto,
  deleteProduto,
} from '../../services/api';

export default function AdminProdutosPage() {
  const router = useRouter();

  const [isAuthorized, setIsAuthorized] = useState(false);
  const [produtos, setProdutos] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [editandoId, setEditandoId] = useState(null);

  // Campos do formulário
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
  const [imagemFile, setImagemFile] = useState(null);
  const [imagemPreview, setImagemPreview] = useState(null);

  const [loading, setLoading] = useState(false);
  const [loadingProdutos, setLoadingProdutos] = useState(false);
  const [erro, setErro] = useState('');
  const [mensagem, setMensagem] = useState('');

  // Modal de exclusão
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [produtoParaExcluir, setProdutoParaExcluir] = useState(null);

  // Checa se é admin e carrega produtos
  useEffect(() => {
    const token = getToken();
    const usuario = getUser();

    if (!token || !usuario || usuario.role !== 'admin') {
      router.push('/');
      return;
    }

    setIsAuthorized(true);
    carregarProdutos();
  }, [router]);

  const carregarProdutos = async () => {
    try {
      setLoadingProdutos(true);
      const lista = await getProdutos();
      setProdutos(lista || []);
    } catch (e) {
      console.error('Erro ao carregar produtos:', e);
      setErro(e.message || 'Erro ao carregar produtos.');
    } finally {
      setLoadingProdutos(false);
    }
  };

  const handleImagemChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) {
      setImagemFile(null);
      setImagemPreview(null);
      return;
    }
    setImagemFile(file);
    const previewUrl = URL.createObjectURL(file);
    setImagemPreview(previewUrl);
  };

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
    setImagemFile(null);
    setImagemPreview(null);
    setEditandoId(null);
  };

  const preencherFormularioParaEdicao = (produto) => {
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
    setImagemFile(null);
    setImagemPreview(produto.imagem || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setMensagem('');

    const token = getToken();
    if (!token) {
      router.push('/login');
      return;
    }

    // Validação simples no front
    if (
      !codigo ||
      !nome ||
      !descricao ||
      !preco ||
      !estoque ||
      !categoria ||
      !cor ||
      !modelo ||
      !peso ||
      !largura ||
      !altura ||
      !comprimento
    ) {
      setErro('Preencha todos os campos obrigatórios.');
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('codigo', codigo);
      formData.append('nome', nome);
      formData.append('descricao', descricao);
      formData.append('preco', String(preco).replace(',', '.'));
      formData.append('estoque', String(estoque));
      formData.append('categoria', categoria);
      formData.append('cor', cor);
      formData.append('modelo', modelo);
      formData.append('peso', String(peso).replace(',', '.'));
      formData.append('largura', String(largura).replace(',', '.'));
      formData.append('altura', String(altura).replace(',', '.'));
      formData.append('comprimento', String(comprimento).replace(',', '.'));

      if (imagemFile) {
        formData.append('file', imagemFile);
      }

      if (editandoId) {
        await updateProduto(editandoId, formData, token);
        setMensagem('Produto atualizado com sucesso!');
      } else {
        await createProduto(formData, token);
        setMensagem('Produto criado com sucesso!');
      }

      limparFormulario();
      setShowForm(false);
      await carregarProdutos();
    } catch (e) {
      console.error('Erro ao salvar produto:', e);
      setErro(e.message || 'Erro ao salvar produto.');
    } finally {
      setLoading(false);
    }
  };

  const handleClickNovoProduto = () => {
    if (!showForm || editandoId) {
      // Abrir formulário em modo "novo"
      limparFormulario();
      setErro('');
      setMensagem('');
      setShowForm(true);
    } else {
      // Se já estiver em "novo" aberto, fecha
      limparFormulario();
      setShowForm(false);
    }
  };

  const handleEditarProduto = (produto) => {
    setErro('');
    setMensagem('');
    setEditandoId(produto._id);
    preencherFormularioParaEdicao(produto);
    setShowForm(true);
  };

  const abrirModalExcluir = (produto) => {
    setProdutoParaExcluir(produto);
    setShowDeleteModal(true);
    setErro('');
    setMensagem('');
  };

  const fecharModalExcluir = () => {
    setShowDeleteModal(false);
    setProdutoParaExcluir(null);
  };

  const confirmarExclusao = async () => {
    if (!produtoParaExcluir) return;

    const token = getToken();
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      setLoading(true);
      await deleteProduto(produtoParaExcluir._id, token);
      setMensagem('Produto excluído com sucesso.');
      fecharModalExcluir();
      await carregarProdutos();
    } catch (e) {
      console.error('Erro ao excluir produto:', e);
      setErro(e.message || 'Erro ao excluir produto.');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthorized) {
    // Enquanto verifica / redireciona
    return (
      <div className={styles.pageContainer}>
        <Header />
        <main className={styles.main}>
          <div className={styles.card}>
            <p>Verificando permissões...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <Header />

      <main className={styles.main}>
        <div className={styles.card}>
          <div className={styles.headerRow}>
            <div>
              <h1 className={styles.title}>Admin - Produtos</h1>
              <p className={styles.subtitle}>
                Gerencie o catálogo de produtos da loja.
              </p>
            </div>

            <button
              type="button"
              className={styles.newProductButton}
              onClick={handleClickNovoProduto}
            >
              {showForm
                ? editandoId
                  ? 'Cancelar edição'
                  : 'Cancelar'
                : 'Novo Produto'}
            </button>
          </div>

          {/* Formulário de novo produto / edição */}
          {showForm && (
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Código *</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={codigo}
                    onChange={(e) => setCodigo(e.target.value)}
                    placeholder="Ex: AP-001"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Nome *</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Categoria *</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                    placeholder="Pulseira, anel, brinco..."
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Cor *</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={cor}
                    onChange={(e) => setCor(e.target.value)}
                    placeholder="Prata, prata envelhecida..."
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Modelo *</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={modelo}
                    onChange={(e) => setModelo(e.target.value)}
                    placeholder="Ex: AP-1234"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Preço (R$) *</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className={styles.input}
                    value={preco}
                    onChange={(e) => setPreco(e.target.value)}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Estoque *</label>
                  <input
                    type="number"
                    min="0"
                    className={styles.input}
                    value={estoque}
                    onChange={(e) => setEstoque(e.target.value)}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Peso (kg) *</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className={styles.input}
                    value={peso}
                    onChange={(e) => setPeso(e.target.value)}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Largura (cm) *</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className={styles.input}
                    value={largura}
                    onChange={(e) => setLargura(e.target.value)}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Altura (cm) *</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className={styles.input}
                    value={altura}
                    onChange={(e) => setAltura(e.target.value)}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Comprimento (cm) *</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className={styles.input}
                    value={comprimento}
                    onChange={(e) => setComprimento(e.target.value)}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Descrição *</label>
                <textarea
                  className={styles.textarea}
                  rows={3}
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                />
              </div>

              <div className={styles.imagemRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Imagem (opcional)</label>
                  <input
                    type="file"
                    accept="image/*"
                    className={styles.fileInput}
                    onChange={handleImagemChange}
                  />
                </div>

                {imagemPreview && (
                  <div className={styles.imagemPreviewWrapper}>
                    <img
                      src={imagemPreview}
                      alt="Pré-visualização"
                      className={styles.imagemPreview}
                    />
                  </div>
                )}
              </div>

              {erro && <p className={styles.errorText}>{erro}</p>}
              {mensagem && <p className={styles.successText}>{mensagem}</p>}

              <div className={styles.formButtonsRow}>
                <button
                  type="submit"
                  className={styles.saveButton}
                  disabled={loading}
                >
                  {loading
                    ? 'Salvando...'
                    : editandoId
                    ? 'Atualizar produto'
                    : 'Salvar produto'}
                </button>

                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={() => {
                    limparFormulario();
                    setShowForm(false);
                  }}
                  disabled={loading}
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}

          {/* Lista de produtos cadastrados */}
          <div className={styles.listaSection}>
            <h2 className={styles.sectionTitle}>Produtos cadastrados</h2>

            {loadingProdutos ? (
              <p className={styles.infoText}>Carregando produtos...</p>
            ) : produtos.length === 0 ? (
              <p className={styles.infoText}>
                Nenhum produto cadastrado ainda.
              </p>
            ) : (
              <div className={styles.listaTabela}>
                {/* Cabeçalho (desktop) */}
                <div className={`${styles.listaLinha} ${styles.listaHeader}`}>
                  <span>Imagem</span>
                  <span>Código</span>
                  <span>Produto</span>
                  <span>Preço</span>
                  <span>Estoque</span>
                  <span>Ações</span>
                </div>

                {produtos.map((p) => (
                  <div key={p._id} className={styles.listaLinha}>
                    <span className={styles.colImagem}>
                      {p.imagem ? (
                        <img
                          src={p.imagem}
                          alt={p.nome}
                          className={styles.listaImagem}
                        />
                      ) : (
                        <span className={styles.noImage}>Sem imagem</span>
                      )}
                    </span>

                    <span className={styles.colCodigo}>{p.codigo}</span>

                    <span className={styles.colNome}>{p.nome}</span>

                    <span>R$ {Number(p.preco || 0).toFixed(2)}</span>

                    <span>{p.estoque}</span>

                    <span className={styles.colAcoes}>
                      <button
                        type="button"
                        className={styles.acaoButton}
                        onClick={() => handleEditarProduto(p)}
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        className={`${styles.acaoButton} ${styles.acaoExcluir}`}
                        onClick={() => abrirModalExcluir(p)}
                      >
                        Excluir
                      </button>
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />

      {/* MODAL DE CONFIRMAÇÃO DE EXCLUSÃO */}
      {showDeleteModal && produtoParaExcluir && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3 className={styles.modalTitle}>Excluir produto</h3>
            <p className={styles.modalText}>
              Tem certeza que deseja excluir o produto{' '}
              <strong>{produtoParaExcluir.nome}</strong>?
            </p>
            <p className={styles.modalTextSmall}>
              Esta ação não poderá ser desfeita.
            </p>

            <div className={styles.modalButtonsRow}>
              <button
                type="button"
                className={styles.modalCancelButton}
                onClick={fecharModalExcluir}
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="button"
                className={styles.modalConfirmButton}
                onClick={confirmarExclusao}
                disabled={loading}
              >
                {loading ? 'Excluindo...' : 'Sim, excluir'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}