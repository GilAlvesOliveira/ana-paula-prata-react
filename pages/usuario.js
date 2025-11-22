// pages/usuario.js
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import Footer from '../components/Footer';
import styles from '../styles/User.module.css';
import { getToken, getUser, saveUser, signOut } from '../services/storage';
import { getUsuarioApi, updateUsuarioApi } from '../services/api';

export default function UsuarioPage() {
  const router = useRouter();

  const [usuario, setUsuario] = useState(null);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');

  const [telefone, setTelefone] = useState('');
  const [endereco, setEndereco] = useState('');
  const [cep, setCep] = useState('');

  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');

  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    const token = getToken();
    const userLocal = getUser();

    if (!token || !userLocal) {
      router.push('/login');
      return;
    }

    const carregarUsuario = async () => {
      try {
        const tokenAtual = getToken();
        if (!tokenAtual) {
          router.push('/login');
          return;
        }

        const dados = await getUsuarioApi(tokenAtual);

        const usuarioNormalizado = {
          id: dados._id || dados.id,
          nome: dados.nome,
          email: dados.email,
          avatar: dados.avatar || null,
          role: dados.role,
          telefone: dados.telefone || '',
          endereco: dados.endereco || '',
          cep: dados.cep || '',
        };

        setUsuario(usuarioNormalizado);
        setNome(usuarioNormalizado.nome || '');
        setEmail(usuarioNormalizado.email || '');
        setTelefone(usuarioNormalizado.telefone || '');
        setEndereco(usuarioNormalizado.endereco || '');
        setCep(usuarioNormalizado.cep || '');
        setAvatarPreview(usuarioNormalizado.avatar || null);

        saveUser(usuarioNormalizado);
      } catch (e) {
        console.error('Erro ao carregar usuário:', e);
        if (e.status === 401) {
          signOut();
          router.push('/login');
        } else {
          setErro(e.message || 'Erro ao carregar dados do usuário.');
        }
      }
    };

    carregarUsuario();
  }, [router]);

  const handleAvatarChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) {
      setAvatarFile(null);
      return;
    }
    setAvatarFile(file);
    const previewUrl = URL.createObjectURL(file);
    setAvatarPreview(previewUrl);
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

    try {
      setLoading(true);

      const formData = new FormData();
      if (nome) formData.append('nome', nome);
      if (telefone) formData.append('telefone', telefone);
      if (endereco) formData.append('endereco', endereco);
      if (cep) formData.append('cep', cep);
      if (avatarFile) formData.append('file', avatarFile);

      await updateUsuarioApi(formData, token);

      // Recarrega dados do backend para sincronizar
      const dadosAtualizados = await getUsuarioApi(token);

      const usuarioNormalizado = {
        id: dadosAtualizados._id || dadosAtualizados.id,
        nome: dadosAtualizados.nome,
        email: dadosAtualizados.email,
        avatar: dadosAtualizados.avatar || null,
        role: dadosAtualizados.role,
        telefone: dadosAtualizados.telefone || '',
        endereco: dadosAtualizados.endereco || '',
        cep: dadosAtualizados.cep || '',
      };

      setUsuario(usuarioNormalizado);
      saveUser(usuarioNormalizado);

      setNome(usuarioNormalizado.nome || '');
      setEmail(usuarioNormalizado.email || '');
      setTelefone(usuarioNormalizado.telefone || '');
      setEndereco(usuarioNormalizado.endereco || '');
      setCep(usuarioNormalizado.cep || '');
      setAvatarPreview(usuarioNormalizado.avatar || null);
      setAvatarFile(null);

      setMensagem('Dados atualizados com sucesso!');
      setIsEditMode(false); // volta para modo estático
    } catch (e) {
      console.error('Erro ao atualizar usuário:', e);
      setErro(e.message || 'Erro ao atualizar seus dados.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = () => {
    setErro('');
    setMensagem('');
    setIsEditMode(true);
  };

  const handleCancelEdit = () => {
    if (usuario) {
      setNome(usuario.nome || '');
      setEmail(usuario.email || '');
      setTelefone(usuario.telefone || '');
      setEndereco(usuario.endereco || '');
      setCep(usuario.cep || '');
      setAvatarPreview(usuario.avatar || null);
      setAvatarFile(null);
    }
    setErro('');
    setMensagem('');
    setIsEditMode(false);
  };

  // 🔹 botão "Minhas Compras" na página do usuário
  const handleGoToMinhasCompras = () => {
    router.push('/minhas-compras');
  };

  if (!usuario) {
    return (
      <div className={styles.loadingContainer}>
        <Header />
        <div className={styles.loadingContent}>
          <p>Carregando seus dados...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <Header />

      <main className={styles.main}>
        <div className={styles.card}>
          <div className={styles.avatarSection}>
            <div className={styles.avatarWrapper}>
              <img
                src={avatarPreview || usuario.avatar || '/imagens/avatarCinza.png'}
                alt="Avatar do usuário"
                className={styles.avatar}
              />
            </div>
            <h1 className={styles.userName}>{nome || 'Seu nome'}</h1>
            <p className={styles.userEmail}>{email}</p>

            {isEditMode && (
              <label className={styles.avatarButton}>
                Trocar foto
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                />
              </label>
            )}
          </div>

          {/* MODO ESTÁTICO */}
          {!isEditMode && (
            <div className={styles.staticSection}>
              <h2 className={styles.sectionTitle}>Seus dados</h2>

              <div className={styles.infoList}>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Nome:</span>
                  <span className={styles.infoValue}>
                    {nome || '—'}
                  </span>
                </div>

                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Email:</span>
                  <span className={styles.infoValue}>
                    {email || '—'}
                  </span>
                </div>

                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Telefone:</span>
                  <span className={styles.infoValue}>
                    {telefone || 'Informe seu telefone'}
                  </span>
                </div>

                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Endereço:</span>
                  <span className={styles.infoValue}>
                    {endereco || 'Informe seu endereço'}
                  </span>
                </div>

                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>CEP:</span>
                  <span className={styles.infoValue}>
                    {cep || 'Informe seu CEP'}
                  </span>
                </div>
              </div>

              {erro && <p className={styles.errorText}>{erro}</p>}
              {mensagem && <p className={styles.successText}>{mensagem}</p>}

              <button
                type="button"
                className={styles.editButton}
                onClick={handleEditClick}
              >
                Editar dados
              </button>

              {/* 🔹 Novo botão Minhas Compras */}
              <button
                type="button"
                className={styles.secondaryButton}
                onClick={handleGoToMinhasCompras}
              >
                Minhas Compras
              </button>
            </div>
          )}

          {/* MODO EDIÇÃO */}
          {isEditMode && (
            <form className={styles.form} onSubmit={handleSubmit}>
              <h2 className={styles.sectionTitle}>Editar dados</h2>

              <div className={styles.formGroup}>
                <label className={styles.label}>Nome completo</label>
                <input
                  type="text"
                  className={styles.input}
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Email</label>
                <input
                  type="email"
                  className={styles.input}
                  value={email}
                  disabled
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Telefone</label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="(11) 99999-9999"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Endereço</label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="Rua, número, bairro, cidade"
                  value={endereco}
                  onChange={(e) => setEndereco(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>CEP</label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="00000-000"
                  value={cep}
                  onChange={(e) => setCep(e.target.value)}
                />
              </div>

              {erro && <p className={styles.errorText}>{erro}</p>}
              {mensagem && <p className={styles.successText}>{mensagem}</p>}

              <div className={styles.buttonsRow}>
                <button
                  type="submit"
                  className={styles.saveButton}
                  disabled={loading}
                >
                  {loading ? 'Salvando...' : 'Salvar alterações'}
                </button>

                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={handleCancelEdit}
                  disabled={loading}
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}